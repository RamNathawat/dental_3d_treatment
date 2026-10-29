/**
 * Treatment viewer application — Clean Luxury Clinical Edition.
 *
 * Orchestrates the 3D viewport with treatment-stage navigation.
 * Reuses the existing ThreeViewport (via the Viewport interface) for all 3D rendering.
 *
 * Features:
 * 1. Each treatment stage is a paired upper-jaw and lower-jaw model.
 * 2. Uses explicit mappings / configurable stage manifest (no fragile substring guessing).
 * 3. Doctor-only template stages are strictly distinguished and excluded from patient progression.
 * 4. Supports cases starting at stage 1, stage 5, stage 6, or any stage number.
 * 5. Preserves actual stage numbers in labels and progression steps rather than renumbering every case from 1.
 * 6. Includes a viewer-side stage/file selection & validation mechanism for testing and dentist review.
 * 7. Reports ambiguities or missing pairings cleanly rather than guessing.
 * 8. Segmented arch control: [ Lower | Upper | Both ] matching modern clinical UI.
 * 9. Ultra-smooth seamless cross-dissolve mesh transition (silent background load without jump/spinner).
 * 10. Adaptable floating bottom playback dock with stage dots and Before/After comparison.
 * 11. Refined clinical dossier patient card with monogram initials and treatment metadata.
 */

import { createViewport } from "../viewer/three-viewport";
import type { Viewport } from "../viewer/viewport";
import { DEFAULT_CASE_MANIFEST } from "./stage-config";
import type {
  CaseManifest,
  RawFileDescriptor,
  StageDefinition,
} from "./stage-manifest";
import { pairTreatmentFiles } from "./stage-manifest";
import { loadStageModels, prefetchStageModels } from "./model-loader";
import { applyBiteContacts } from "./bite-contacts";
import {
  identifyToothAtPoint,
  computeToothCentroids,
  computeToothDisplacements,
} from "./tooth-data";

// ─── Layer IDs ───────────────────────────────────────────────────────────────

/** Stable IDs for the two persistent arch layers. */
export const UPPER_ARCH_ID = "upper-arch";
export const LOWER_ARCH_ID = "lower-arch";

/**
 * Anatomical dental shading: crisp warm white crowns with natural healthy pink gums.
 */
export const UPPER_ARCH_COLOUR = "anatomical";
export const LOWER_ARCH_COLOUR = "anatomical";

// ─── State ───────────────────────────────────────────────────────────────────

export interface AppState {
  /** The active case manifest. */
  manifest: CaseManifest;
  /** 0-based index of the currently displayed patient stage (-1 = nothing loaded yet). */
  currentIndex: number;
  /** Whether the user is currently inspecting a doctor-only template stage. */
  activeTemplateStage: StageDefinition | null;
  /** Whether a load is in progress. */
  loading: boolean;
  /** Last error message, or null when the current state is healthy. */
  error: string | null;
  /** Visibility of the upper arch. */
  upperVisible: boolean;
  /** Visibility of the lower arch. */
  lowerVisible: boolean;
  /** Whether autoplay progression is currently running. */
  isPlaying: boolean;
  /** Whether occlusal bite contacts inspection is active. */
  contactsActive: boolean;
  /** Whether dual-stage ghost overlay comparison is active. */
  overlayActive: boolean;
  /** Overlay blend ratio (0 = current stage, 1 = initial stage 1). */
  overlayBlend: number;
  /** AbortController for the in-flight fetch, cancelled on new navigation. */
  abortController: AbortController | null;
}

export interface TreatmentAppOptions {
  readonly createViewport?: (
    canvas: HTMLCanvasElement,
    options?: {
      onStats?: (stats: {
        fps: number;
        visibleTriangles: number;
        drawCalls: number;
      }) => void;
    },
  ) => Viewport;
  /** The case manifest to load (defaults to DEFAULT_CASE_MANIFEST). */
  readonly caseManifest?: CaseManifest;
  /** Autoplay interval in milliseconds (defaults to 2000ms). */
  readonly autoplayIntervalMs?: number;
  /** Duration of cross-dissolve transition between stages in ms (defaults to 350ms, 0 for instant). */
  readonly transitionDurationMs?: number;
  /** Whether to load stage 0 automatically on creation (defaults to true). */
  readonly autoLoad?: boolean;
}

export interface TreatmentAppHandle {
  readonly dispose: () => void;
  readonly navigate: (index: number) => Promise<void>;
  readonly inspectTemplate: (stage: StageDefinition) => Promise<void>;
  readonly loadManifest: (manifest: CaseManifest) => Promise<void>;
  readonly togglePlay: () => void;
  readonly toggleUpper: () => void;
  readonly toggleLower: () => void;
  readonly openStageSelector: () => void;
  readonly toggleContacts: () => void;
  readonly toggleOverlay: () => Promise<void>;
  readonly setOverlayBlend: (ratio: number) => void;
  readonly getState: () => Readonly<AppState>;
}

// ─── Entry point ─────────────────────────────────────────────────────────────

export function createTreatmentApp(
  root: HTMLElement,
  options: TreatmentAppOptions = {},
): TreatmentAppHandle {
  const makeViewport = options.createViewport ?? createViewport;
  const autoplayInterval = options.autoplayIntervalMs ?? 1400;
  const transitionDuration = options.transitionDurationMs ?? 350;

  const state: AppState = {
    manifest: options.caseManifest ?? DEFAULT_CASE_MANIFEST,
    currentIndex: -1,
    activeTemplateStage: null,
    loading: false,
    error: null,
    upperVisible: true,
    lowerVisible: true,
    isPlaying: false,
    contactsActive: false,
    overlayActive: false,
    overlayBlend: 0.5,
    abortController: null,
  };

  const GHOST_UPPER_ID = "tv-ghost-upper";
  const GHOST_LOWER_ID = "tv-ghost-lower";
  const GHOST_COLOR = "#38bdf8";

  let playTimer: number | null = null;
  let activeUpperId = `${UPPER_ARCH_ID}-0`;
  let activeLowerId = `${LOWER_ARCH_ID}-0`;
  let prevUpperId: string | null = null;
  let prevLowerId: string | null = null;
  let transitionAnimId: number | null = null;
  let layerCounter = 0;

  /**
   * Per-tooth centroids of the initial Stage 1 arch geometries.
   * Key is FDI tooth number (e.g. 11..18, 21..28, 31..38, 41..48).
   * Values are [x, y, z] in mm.
   */
  let stage1UpperCentroids: Record<number, [number, number, number]> | null = null;
  let stage1LowerCentroids: Record<number, [number, number, number]> | null = null;

  /**
   * Displacements (in mm) for each tooth between Stage 1 and the current stage.
   * On Stage 1, all displacements are 0.00 mm.
   */
  let upperToothDisplacements: Record<number, number> | null = null;
  let lowerToothDisplacements: Record<number, number> | null = null;

  // ── DOM ──────────────────────────────────────────────────────────────────

  const canvas = document.createElement("canvas");
  canvas.className = "tv-canvas";

  const viewport: Viewport = makeViewport(canvas, {
    transparentBackground: true,
    onStats: (stats) => {
      hudEl.textContent = `${(stats.visibleTriangles / 1_000_000).toFixed(1)}M tri · ${stats.fps} fps`;
    },
    onToothHover: (hit) => {
      if (!hit) {
        toothTooltipEl.hidden = true;
        return;
      }
      const isUpper = hit.layerId.toLowerCase().includes("upper");
      const geom = viewport.getLayerGeometry?.(hit.layerId);
      let bounds: { minX: number; maxX: number; minZ: number; maxZ: number } | undefined;
      if (geom) {
        geom.computeBoundingBox();
        const b = geom.boundingBox;
        if (b) {
          bounds = { minX: b.min.x, maxX: b.max.x, minZ: b.min.z, maxZ: b.max.z };
        }
      }
      const info = identifyToothAtPoint(hit.hitPoint, isUpper, bounds);

      // Movement delta: displacement specific to this tooth since Stage 1
      let deltaText = "0.00 mm";
      if (state.currentIndex > 0) {
        const displacements = isUpper ? upperToothDisplacements : lowerToothDisplacements;
        const d = displacements?.[info.fdi];
        if (d !== undefined) {
          deltaText = `${d.toFixed(2)} mm`;
        }
      }

      // Populate tooltip content
      tooltipBadgeEl.textContent = info.badge;
      tooltipNotationEl.textContent = info.notation;
      tooltipQuadrantEl.textContent = info.quadrantLabel;
      tooltipNameEl.textContent = info.fullName;
      tooltipDeltaEl.textContent = deltaText;

      // Position tooltip centered above the cursor
      const stageRect = stageEl.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      const absX = canvasRect.left - stageRect.left + hit.canvasX;
      const absY = canvasRect.top  - stageRect.top  + hit.canvasY;
      const ttW = 240;
      const ttH = 96;
      let left = absX - ttW / 2;
      let top  = absY - ttH - 14; // caret points down directly towards tooth
      if (left < 10) left = 10;
      if (left + ttW > stageRect.width - 10) left = stageRect.width - ttW - 10;
      if (top < 10) top = absY + 18; // if near top edge, position below cursor

      toothTooltipEl.style.left = `${left}px`;
      toothTooltipEl.style.top  = `${top}px`;
      toothTooltipEl.hidden = false;
    },
  });

  // Remove the default background grid mesh behind the model
  viewport.setGridVisible(false);

  // Arch selection pill ([ Lower | Upper | Both ])
  const pillLowerBtn = document.createElement("button");
  pillLowerBtn.type = "button";
  pillLowerBtn.className = "tv-arch-pill__btn";
  pillLowerBtn.innerHTML = `<span class="tv-arch-pill__icon">🦷</span> Lower`;
  pillLowerBtn.title = "View Lower (Mandibular) arch only";
  pillLowerBtn.addEventListener("click", () => setArchMode("lower"));

  const pillUpperBtn = document.createElement("button");
  pillUpperBtn.type = "button";
  pillUpperBtn.className = "tv-arch-pill__btn";
  pillUpperBtn.innerHTML = `<span class="tv-arch-pill__icon">🦷</span> Upper`;
  pillUpperBtn.title = "View Upper (Maxillary) arch only";
  pillUpperBtn.addEventListener("click", () => setArchMode("upper"));

  const pillBothBtn = document.createElement("button");
  pillBothBtn.type = "button";
  pillBothBtn.className = "tv-arch-pill__btn tv-arch-pill__btn--active";
  pillBothBtn.innerHTML = `<span class="tv-arch-pill__icon">🦷</span> Both`;
  pillBothBtn.title = "View Both arches";
  pillBothBtn.addEventListener("click", () => setArchMode("both"));

  const archPillEl = div("tv-arch-pill", [
    pillLowerBtn,
    pillUpperBtn,
    pillBothBtn,
  ]);

  // Backward compatibility toggle buttons for test suite
  const upperToggleBtn = makeBtn(
    "Upper Jaw",
    () => toggleUpper(),
    "tv-btn--toggle tv-btn--active tv-sr-only",
  );
  const lowerToggleBtn = makeBtn(
    "Lower Jaw",
    () => toggleLower(),
    "tv-btn--toggle tv-btn--active tv-sr-only",
  );

  // Alignment Graph Paper Grid Overlay (Screen-space millimeter reference grid with clinical axes)
  const graphGridEl = div("tv-graph-grid");
  graphGridEl.hidden = true;

  // Quick tools in top bar
  let isGridVisible = false;
  const gridBtn = makeBtn(
    "# Grid",
    () => {
      isGridVisible = !isGridVisible;
      graphGridEl.hidden = !isGridVisible;
      viewport.setGridVisible(false);
      gridBtn.classList.toggle("tv-btn--active", isGridVisible);
    },
    "tv-btn--tool",
  );
  gridBtn.title = "Toggle alignment reference grid";

  const recenterBtn = makeBtn(
    "⊙ Recenter",
    () => {
      viewport.setView("front");
      viewport.fitAll();
    },
    "tv-btn--tool",
  );
  recenterBtn.title = "Reset and frame dental models in center";

  const caseSelectorBtn = makeBtn(
    "📁 Cases",
    () => openStageSelector(),
    "tv-btn--tool tv-btn--accent",
  );
  caseSelectorBtn.title = "Inspect stages, doctor template, or load case files";

  const toggleSidebarBtn = makeBtn(
    "☰ Stages",
    () => {
      appEl.classList.toggle("tv-app--sidebar-open");
    },
    "tv-btn--tool tv-btn--sidebar-toggle",
  );
  toggleSidebarBtn.title = "Toggle stage progression drawer";

  // Floating Right Camera Toolbar
  // Due to dental model scan coordinate space (+Z = Front, -Y = Bottom, -Z = Back, +Y = Top):
  const camFrontBtn = makeBtn("Front", () => viewport.setView("top"), "tv-cam-btn");
  camFrontBtn.title = "Frontal smile view";

  const camBottomBtn = makeBtn("Bottom", () => viewport.setView("front"), "tv-cam-btn");
  camBottomBtn.title = "Bottom view";

  const camBackBtn = makeBtn("Back", () => viewport.setView("bottom"), "tv-cam-btn");
  camBackBtn.title = "Lingual/back view";

  const camTopBtn = makeBtn("Top", () => viewport.setView("back"), "tv-cam-btn");
  camTopBtn.title = "Top occlusal view";

  const camResetBtn = makeBtn(
    "⊙ Reset",
    () => {
      viewport.setView("top");
      viewport.fitAll();
    },
    "tv-cam-btn tv-cam-btn--gold",
  );
  camResetBtn.title = "Reset view to frontal smile position";

  const cameraDockEl = div("tv-camera-dock", [
    camFrontBtn,
    camBottomBtn,
    camBackBtn,
    camTopBtn,
    camResetBtn,
  ]);

  // Stage controls (Patient timeline)
  const stageLabel = span("tv-stage-label", "Stage 1 / 1");

  const sliderEl = document.createElement("input");
  sliderEl.type = "range";
  sliderEl.min = "1";
  sliderEl.max = String(Math.max(1, state.manifest.treatmentStages.length));
  sliderEl.step = "1";
  sliderEl.value = "1";
  sliderEl.className = "tv-slider";
  sliderEl.setAttribute("aria-label", "Treatment stage");

  const prevBtn = makeBtn("‹", () => {
    stopPlay();
    void navigate(state.currentIndex - 1);
  }, "tv-stepper-btn");
  prevBtn.title = "Previous stage";

  const playBtn = makeBtn("▶ Play", () => togglePlay(), "tv-btn--play tv-sr-only");

  const circularPlayBtn = document.createElement("button");
  circularPlayBtn.type = "button";
  circularPlayBtn.className = "tv-btn--play-circle";
  circularPlayBtn.setAttribute("aria-label", "Play / pause treatment progression");
  circularPlayBtn.innerHTML = "▶";
  circularPlayBtn.title = "Play / pause treatment progression";
  circularPlayBtn.addEventListener("click", () => togglePlay());

  const nextBtn = makeBtn("›", () => {
    stopPlay();
    void navigate(state.currentIndex + 1);
  }, "tv-stepper-btn");
  nextBtn.title = "Next stage";

  sliderEl.addEventListener("input", () => {
    stopPlay();
    void navigate(Number(sliderEl.value) - 1);
  });

  // Before / After Comparison Pill
  const beforeBtn = makeBtn(
    "Before",
    () => {
      stopPlay();
      void navigate(0);
    },
    "tv-ba-btn tv-ba-btn--active",
  );
  beforeBtn.title = "Jump to initial pre-treatment stage";

  const afterBtn = makeBtn(
    "After",
    () => {
      stopPlay();
      const count = state.manifest.treatmentStages.length;
      if (count > 0) void navigate(count - 1);
    },
    "tv-ba-btn",
  );
  afterBtn.title = "Jump to final aligned outcome stage";

  const beforeAfterPillEl = div("tv-ba-pill", [beforeBtn, afterBtn]);

  // Feature 8: Contacts button
  const contactsBtn = makeBtn(
    "🦷 Contacts",
    () => toggleContacts(),
    "tv-ba-btn tv-dock-tool-btn",
  );
  contactsBtn.title = "Inspect occlusal bite contact collision & clearance heatmap";

  // Feature 9: Overlay button
  const overlayBtn = makeBtn(
    "◩ Overlay",
    () => {
      void toggleOverlay();
    },
    "tv-ba-btn tv-dock-tool-btn",
  );
  overlayBtn.title = "Overlay initial stage against current stage with blend slider";

  const dockToolsEl = div("tv-dock-tools", [
    beforeAfterPillEl,
    contactsBtn,
    overlayBtn,
  ]);

  // Interactive scrubber dots container
  const scrubberTrackEl = div("tv-scrubber-track");
  const scrubberFillEl = div("tv-scrubber-fill");
  const scrubberDotsContainer = div("tv-scrubber-dots");
  scrubberTrackEl.append(scrubberFillEl, scrubberDotsContainer);

  const scrubberInteractiveEl = div("tv-scrubber-interactive", [
    scrubberTrackEl,
    sliderEl,
  ]);

  const scrubberWrapEl = div("tv-scrubber-wrap", [
    div("tv-scrubber-row", [
      prevBtn,
      scrubberInteractiveEl,
      nextBtn,
    ]),
    stageLabel,
  ]);

  const bottomDockEl = div("tv-bottom-dock tv-stage-controls", [
    dockToolsEl,
    scrubberWrapEl,
    div("tv-bottom-dock__actions", [
      circularPlayBtn,
      playBtn,
      upperToggleBtn,
      lowerToggleBtn,
    ]),
  ]);

  // Floating Contacts Legend
  const contactsLegendEl = div("tv-contacts-legend", [
    div("tv-contacts-legend__header", [
      span("tv-contacts-legend__title", "Bite Contacts"),
      makeBtn("✕", () => toggleContacts(), "tv-btn--subtle tv-contacts-legend__close"),
    ]),
    div("tv-contacts-legend__scale", [
      span("tv-contacts-legend__item tv-contacts-legend__item--heavy", "● <0.25mm Heavy"),
      span("tv-contacts-legend__item tv-contacts-legend__item--medium", "● <0.6mm Medium"),
      span("tv-contacts-legend__item tv-contacts-legend__item--light", "● <1.0mm Light"),
    ]),
  ]);
  contactsLegendEl.hidden = true;

  // Floating Overlay Blend Panel
  const overlaySlider = document.createElement("input");
  overlaySlider.type = "range";
  overlaySlider.min = "0";
  overlaySlider.max = "100";
  overlaySlider.value = "50";
  overlaySlider.className = "tv-overlay-slider";
  overlaySlider.addEventListener("input", () => {
    setOverlayBlend(Number(overlaySlider.value) / 100);
  });

  const overlayPanelEl = div("tv-overlay-panel", [
    div("tv-overlay-panel__header", [
      span("tv-overlay-panel__title", "Stage Comparison Overlay"),
      makeBtn(
        "✕",
        () => {
          void toggleOverlay();
        },
        "tv-btn--subtle tv-overlay-panel__close",
      ),
    ]),
    div("tv-overlay-panel__controls", [
      span("tv-overlay-panel__label", "Stage 1 (Initial)"),
      overlaySlider,
      span("tv-overlay-panel__label", "Current Stage"),
    ]),
  ]);
  overlayPanelEl.hidden = true;

  // Doctor-only template inspection banner
  const templateNoticeEl = div("tv-template-notice", [
    span(
      "tv-template-badge",
      "🩺 Doctor Mode: Viewing Reference Template (Excluded from Patient Progression)",
    ),
    makeBtn(
      "Return to Patient Progression",
      () => {
        state.activeTemplateStage = null;
        void navigate(Math.max(0, state.currentIndex));
      },
      "tv-btn--subtle",
    ),
  ]);
  templateNoticeEl.hidden = true;

  // Status / error banner
  const statusEl = div("tv-status", []);
  statusEl.setAttribute("role", "status");
  statusEl.setAttribute("aria-live", "polite");
  statusEl.hidden = true;

  // Ambiguity alert banner
  const ambiguityBannerEl = div("tv-ambiguity-banner", []);
  ambiguityBannerEl.hidden = true;

  // Loading overlay
  const loadingEl = div("tv-loading", [
    div("tv-loading__spinner", []),
    span("tv-loading__text", "Loading models…"),
  ]);
  loadingEl.hidden = true;

  // HUD (triangle/fps counter in corner)
  const hudEl = div("tv-hud", []);

  // Left Collapsible Case Drawer / Sidebar
  const sidebarPatientNameEl = div("tv-sidebar__patient-name", ["Patient Case"]);
  const sidebarStageCountEl = div("tv-sidebar__badge", ["Stages"]);
  const sidebarListEl = div("tv-sidebar__list");

  const sidebarBackdrop = div("tv-sidebar-backdrop");

  const sidebarEl = div("tv-sidebar", [
    div("tv-sidebar__header", [
      makeBtn("← Back to cases", () => openStageSelector(), "tv-btn--subtle tv-sidebar__back-btn"),
      makeBtn("✕", () => appEl.classList.remove("tv-app--sidebar-open"), "tv-btn--subtle tv-sidebar__close-btn"),
    ]),
    div("tv-sidebar__card", [
      div("tv-sidebar__avatar", ["👤"]),
      div("tv-sidebar__patient-info", [
        sidebarPatientNameEl,
        sidebarStageCountEl,
      ]),
    ]),
    div("tv-sidebar__heading", ["Treatment Stages"]),
    sidebarListEl,
  ]);

  // Tooth hover tooltip
  const tooltipBadgeEl    = span("tv-tooth-tooltip__badge", "#25");
  const tooltipNotationEl = span("tv-tooth-tooltip__notation", "UL5");
  const tooltipQuadrantEl = span("tv-tooth-tooltip__quadrant", "Upper Left (Q2)");
  const tooltipNameEl     = div("tv-tooth-tooltip__name", ["Upper Left Second Premolar"]);
  const tooltipDeltaEl    = span("tv-tooth-tooltip__delta", "0.00 mm");

  const pulseSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  pulseSvg.setAttribute("class", "tv-tooth-tooltip__pulse");
  pulseSvg.setAttribute("viewBox", "0 0 24 24");
  pulseSvg.setAttribute("fill", "none");
  pulseSvg.setAttribute("stroke", "currentColor");
  pulseSvg.setAttribute("stroke-width", "2.2");
  pulseSvg.setAttribute("stroke-linecap", "round");
  pulseSvg.setAttribute("stroke-linejoin", "round");
  const pulsePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  pulsePath.setAttribute("d", "M22 12h-4l-3 9L9 3l-3 9H2");
  pulseSvg.appendChild(pulsePath);

  const toothTooltipEl = div("tv-tooth-tooltip", [
    div("tv-tooth-tooltip__header", [
      tooltipBadgeEl,
      tooltipNotationEl,
      tooltipQuadrantEl,
    ]),
    tooltipNameEl,
    div("tv-tooth-tooltip__movement", [
      pulseSvg,
      span("tv-tooth-tooltip__movement-label", "Moved since stage 1"),
      tooltipDeltaEl,
    ]),
  ]);
  toothTooltipEl.hidden = true;

  // Stage area (canvas + overlays)
  const stageEl = div("tv-stage", [
    canvas,
    graphGridEl,
    div("tv-stage__top-bar", [
      div("tv-stage__top-left", [toggleSidebarBtn]),
      div("tv-stage__top-center", [archPillEl]),
      div("tv-stage__top-right", [gridBtn, recenterBtn, caseSelectorBtn]),
    ]),
    templateNoticeEl,
    contactsLegendEl,
    overlayPanelEl,
    cameraDockEl,
    bottomDockEl,
    loadingEl,
    hudEl,
    ambiguityBannerEl,
    statusEl,
    toothTooltipEl,
  ]);

  // App shell with clean unbranded header, sidebar, and stage
  const isMobileScreen = typeof window !== "undefined" && window.innerWidth <= 900;
  const appEl = div(isMobileScreen ? "tv-app" : "tv-app tv-app--sidebar-open", [
    div("tv-header", [
      div("tv-header__brand", [
        heading("3D Treatment Progression"),
        span(
          "tv-header__sub",
          state.manifest.patientName
            ? `Patient: ${state.manifest.patientName}`
            : "Case Progression",
        ),
      ]),
      div("tv-header__actions", [
        gridBtn,
        recenterBtn,
        caseSelectorBtn,
      ]),
    ]),
    div("tv-main-container", [
      sidebarBackdrop,
      sidebarEl,
      stageEl,
    ]),
  ]);

  sidebarBackdrop.addEventListener("click", () => {
    appEl.classList.remove("tv-app--sidebar-open");
  });

  root.replaceChildren(appEl);

  // Initialize dots and sidebar
  rebuildScrubberDots();
  rebuildSidebar();

  // ── Keyboard shortcuts ────────────────────────────────────────────────────

  const onKeyDown = (e: KeyboardEvent): void => {
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    )
      return;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      stopPlay();
      void navigate(state.currentIndex - 1);
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      stopPlay();
      void navigate(state.currentIndex + 1);
    } else if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      togglePlay();
    }
  };
  window.addEventListener("keydown", onKeyDown);

  // ── Arch toggles & Segmented Mode ─────────────────────────────────────────

  type ArchMode = "lower" | "upper" | "both";

  function setArchMode(mode: ArchMode): void {
    if (mode === "lower") {
      state.upperVisible = false;
      state.lowerVisible = true;
    } else if (mode === "upper") {
      state.upperVisible = true;
      state.lowerVisible = false;
    } else {
      state.upperVisible = true;
      state.lowerVisible = true;
    }

    viewport.setLayerVisible(activeUpperId, state.upperVisible);
    viewport.setLayerVisible(activeLowerId, state.lowerVisible);
    if (prevUpperId) viewport.setLayerVisible(prevUpperId, state.upperVisible);
    if (prevLowerId) viewport.setLayerVisible(prevLowerId, state.lowerVisible);

    if (state.overlayActive) {
      viewport.setLayerVisible(GHOST_UPPER_ID, state.upperVisible);
      viewport.setLayerVisible(GHOST_LOWER_ID, state.lowerVisible);
    }

    if (state.contactsActive) {
      refreshBiteContacts();
    }

    syncArchPillUI();
  }

  function syncArchPillUI(): void {
    const isLower = !state.upperVisible && state.lowerVisible;
    const isUpper = state.upperVisible && !state.lowerVisible;
    const isBoth = state.upperVisible && state.lowerVisible;

    pillLowerBtn.classList.toggle("tv-arch-pill__btn--active", isLower);
    pillUpperBtn.classList.toggle("tv-arch-pill__btn--active", isUpper);
    pillBothBtn.classList.toggle("tv-arch-pill__btn--active", isBoth);

    upperToggleBtn.classList.toggle("tv-btn--active", state.upperVisible);
    lowerToggleBtn.classList.toggle("tv-btn--active", state.lowerVisible);
  }

  function toggleUpper(): void {
    state.upperVisible = !state.upperVisible;
    viewport.setLayerVisible(activeUpperId, state.upperVisible);
    if (prevUpperId) {
      viewport.setLayerVisible(prevUpperId, state.upperVisible);
    }
    syncArchPillUI();
  }

  function toggleLower(): void {
    state.lowerVisible = !state.lowerVisible;
    viewport.setLayerVisible(activeLowerId, state.lowerVisible);
    if (prevLowerId) {
      viewport.setLayerVisible(prevLowerId, state.lowerVisible);
    }
    syncArchPillUI();
  }

  // ── Autoplay ──────────────────────────────────────────────────────────────

  function togglePlay(): void {
    if (state.isPlaying) {
      stopPlay();
    } else {
      startPlay();
    }
  }

  function startPlay(): void {
    if (state.isPlaying) return;
    const count = state.manifest.treatmentStages.length;
    if (count <= 1) return;

    state.isPlaying = true;
    playBtn.textContent = "⏸ Pause";
    playBtn.classList.add("tv-btn--active");
    circularPlayBtn.textContent = "⏸";
    circularPlayBtn.classList.add("tv-btn--active");

    if (state.currentIndex >= count - 1) {
      void navigate(0);
    } else {
      void navigate(state.currentIndex + 1);
    }

    playTimer = window.setInterval(() => {
      if (state.loading) return;
      const nextIndex = (state.currentIndex + 1) % count;
      void navigate(nextIndex);
    }, autoplayInterval);
  }

  function stopPlay(): void {
    if (!state.isPlaying && playTimer === null) return;
    state.isPlaying = false;
    if (playTimer !== null) {
      clearInterval(playTimer);
      playTimer = null;
    }
    playBtn.textContent = "▶ Play";
    playBtn.classList.remove("tv-btn--active");
    circularPlayBtn.textContent = "▶";
    circularPlayBtn.classList.remove("tv-btn--active");
  }

  // ── Stage Navigation ──────────────────────────────────────────────────────

  async function navigate(index: number): Promise<void> {
    const stages = state.manifest.treatmentStages;
    if (stages.length === 0) return;

    const clamped = Math.max(0, Math.min(stages.length - 1, index));
    const stage = stages[clamped];
    if (!stage) return;

    state.activeTemplateStage = null;
    templateNoticeEl.hidden = true;

    await loadAndDisplayStage(stage, clamped);

    // Prefetch adjacent stages into the buffer cache so the next navigation is instant.
    const prev = stages[clamped - 1];
    const next = stages[clamped + 1];
    if (prev) prefetchStageModels(prev.upper, prev.lower);
    if (next) prefetchStageModels(next.upper, next.lower);
  }

  async function inspectTemplate(
    templateStage: StageDefinition,
  ): Promise<void> {
    stopPlay();
    state.activeTemplateStage = templateStage;
    templateNoticeEl.hidden = false;

    await loadAndDisplayStage(templateStage, state.currentIndex);
  }

  async function loadAndDisplayStage(
    stage: StageDefinition,
    displayProgressionIndex: number,
  ): Promise<void> {
    state.abortController?.abort();
    const controller = new AbortController();
    state.abortController = controller;

    const isFirstSuccessfulLoad = state.currentIndex === -1;

    // Only show full blocking loading overlay on initial boot.
    // Stage-to-stage navigation stays seamless without any loading popup or jump.
    if (isFirstSuccessfulLoad) {
      state.loading = true;
      syncUI();
    }
    state.error = null;

    const outcome = await loadStageModels(
      stage.upper,
      stage.lower,
      controller.signal,
    );

    if (controller.signal.aborted) return;
    state.abortController = null;
    state.loading = false;

    if (!outcome.ok) {
      state.error = outcome.reason;
      syncUI();
      return;
    }

    if (isFirstSuccessfulLoad || transitionDuration <= 0) {
      if (transitionAnimId !== null) {
        cancelAnimationFrame(transitionAnimId);
        transitionAnimId = null;
      }
      viewport.clearLayers();
      layerCounter++;
      activeUpperId = isFirstSuccessfulLoad
        ? UPPER_ARCH_ID
        : `${UPPER_ARCH_ID}-${layerCounter}`;
      activeLowerId = isFirstSuccessfulLoad
        ? LOWER_ARCH_ID
        : `${LOWER_ARCH_ID}-${layerCounter}`;
      prevUpperId = null;
      prevLowerId = null;

      const upperOutcome = viewport.addLayer({
        id: activeUpperId,
        label: `${stage.label} - Upper`,
        colour: UPPER_ARCH_COLOUR,
        stl: outcome.models.upperStl,
      });

      const lowerOutcome = viewport.addLayer({
        id: activeLowerId,
        label: `${stage.label} - Lower`,
        colour: LOWER_ARCH_COLOUR,
        stl: outcome.models.lowerStl,
      });

      if (!upperOutcome.ok) {
        state.error = `Upper jaw: ${upperOutcome.reason}`;
        syncUI();
        return;
      }
      if (!lowerOutcome.ok) {
        state.error = `Lower jaw: ${lowerOutcome.reason}`;
        syncUI();
        return;
      }

      viewport.setLayerVisible(activeUpperId, state.upperVisible);
      viewport.setLayerVisible(activeLowerId, state.lowerVisible);
      viewport.setLayerOpacity(activeUpperId, 1);
      viewport.setLayerOpacity(activeLowerId, 1);

      if (isFirstSuccessfulLoad) {
        viewport.setView("top");
        viewport.fitAll();
      }

      // Capture Stage 1 centroids or compute per-tooth displacements for subsequent stages
      const ug = viewport.getLayerGeometry?.(activeUpperId);
      const lg = viewport.getLayerGeometry?.(activeLowerId);
      if (displayProgressionIndex === 0) {
        if (ug) stage1UpperCentroids = computeToothCentroids(ug, true);
        if (lg) stage1LowerCentroids = computeToothCentroids(lg, false);
        upperToothDisplacements = {};
        lowerToothDisplacements = {};
      } else {
        if (ug && stage1UpperCentroids) {
          const currUpper = computeToothCentroids(ug, true);
          upperToothDisplacements = computeToothDisplacements(stage1UpperCentroids, currUpper);
        }
        if (lg && stage1LowerCentroids) {
          const currLower = computeToothCentroids(lg, false);
          lowerToothDisplacements = computeToothDisplacements(stage1LowerCentroids, currLower);
        }
      }

      if (state.contactsActive) refreshBiteContacts();
      if (state.overlayActive) setOverlayBlend(state.overlayBlend);
    } else {
      // ── Smooth Simultaneous Cross-Dissolve Transition ─────────────────────
      if (transitionAnimId !== null) {
        cancelAnimationFrame(transitionAnimId);
        transitionAnimId = null;
        if (prevUpperId) viewport.removeLayer(prevUpperId);
        if (prevLowerId) viewport.removeLayer(prevLowerId);
      }

      prevUpperId = activeUpperId;
      prevLowerId = activeLowerId;

      layerCounter++;
      const nextUpperId = `${UPPER_ARCH_ID}-${layerCounter}`;
      const nextLowerId = `${LOWER_ARCH_ID}-${layerCounter}`;

      const upperOutcome = viewport.addLayer({
        id: nextUpperId,
        label: `${stage.label} - Upper`,
        colour: UPPER_ARCH_COLOUR,
        stl: outcome.models.upperStl,
      });

      const lowerOutcome = viewport.addLayer({
        id: nextLowerId,
        label: `${stage.label} - Lower`,
        colour: LOWER_ARCH_COLOUR,
        stl: outcome.models.lowerStl,
      });

      if (!upperOutcome.ok) {
        state.error = `Upper jaw: ${upperOutcome.reason}`;
        syncUI();
        return;
      }
      if (!lowerOutcome.ok) {
        state.error = `Lower jaw: ${lowerOutcome.reason}`;
        syncUI();
        return;
      }

      viewport.setLayerVisible(nextUpperId, state.upperVisible);
      viewport.setLayerVisible(nextLowerId, state.lowerVisible);
      viewport.setLayerOpacity(nextUpperId, 0);
      viewport.setLayerOpacity(nextLowerId, 0);

      activeUpperId = nextUpperId;
      activeLowerId = nextLowerId;

      // Update centroids and per-tooth displacements for the newly loaded stage
      const ug = viewport.getLayerGeometry?.(nextUpperId);
      const lg = viewport.getLayerGeometry?.(nextLowerId);
      if (displayProgressionIndex === 0) {
        if (ug) stage1UpperCentroids = computeToothCentroids(ug, true);
        if (lg) stage1LowerCentroids = computeToothCentroids(lg, false);
        upperToothDisplacements = {};
        lowerToothDisplacements = {};
      } else {
        if (ug && stage1UpperCentroids) {
          const currUpper = computeToothCentroids(ug, true);
          upperToothDisplacements = computeToothDisplacements(stage1UpperCentroids, currUpper);
        }
        if (lg && stage1LowerCentroids) {
          const currLower = computeToothCentroids(lg, false);
          lowerToothDisplacements = computeToothDisplacements(stage1LowerCentroids, currLower);
        }
      }

      const startTime = performance.now();
      const pUpper = prevUpperId;
      const pLower = prevLowerId;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / transitionDuration);
        const ease = progress * progress * (3 - 2 * progress); // smoothstep

        // Continuous simultaneous cross-fade: models never vanish at midpoint!
        viewport.setLayerOpacity(pUpper, 1 - ease);
        viewport.setLayerOpacity(pLower, 1 - ease);
        viewport.setLayerOpacity(nextUpperId, ease);
        viewport.setLayerOpacity(nextLowerId, ease);

        if (elapsed < transitionDuration) {
          transitionAnimId = requestAnimationFrame(animate);
        } else {
          transitionAnimId = null;
          viewport.removeLayer(pUpper);
          viewport.removeLayer(pLower);
          viewport.setLayerOpacity(nextUpperId, 1);
          viewport.setLayerOpacity(nextLowerId, 1);
          prevUpperId = null;
          prevLowerId = null;
          if (state.contactsActive) refreshBiteContacts();
          if (state.overlayActive) setOverlayBlend(state.overlayBlend);
        }
      };

      transitionAnimId = requestAnimationFrame(animate);
    }

    state.currentIndex = displayProgressionIndex;
    syncUI();
  }

  // ── Feature 8: Contacts Inspection ──────────────────────────────────────────

  function toggleContacts(): void {
    state.contactsActive = !state.contactsActive;
    if (state.contactsActive) {
      if (!state.upperVisible && !state.lowerVisible) {
        setArchMode("both");
      }
      refreshBiteContacts();
      viewport.setSeparation(0);
      contactsLegendEl.hidden = false;
      contactsBtn.classList.add("tv-ba-btn--active");
    } else {
      contactsLegendEl.hidden = true;
      contactsBtn.classList.remove("tv-ba-btn--active");
      viewport.setSeparation(0);
      viewport.setLayerColour(activeUpperId, UPPER_ARCH_COLOUR);
      viewport.setLayerColour(activeLowerId, LOWER_ARCH_COLOUR);
    }
  }

  function refreshBiteContacts(): void {
    if (!state.contactsActive) return;
    const upperGeom = viewport.getLayerGeometry?.(activeUpperId);
    const lowerGeom = viewport.getLayerGeometry?.(activeLowerId);
    if (upperGeom && lowerGeom) {
      applyBiteContacts(upperGeom, lowerGeom);
      viewport.setLayerColour(activeUpperId, "contacts");
      viewport.setLayerColour(activeLowerId, "contacts");
    }
  }

  // ── Feature 9: Overlay Comparison ─────────────────────────────────────────

  async function toggleOverlay(): Promise<void> {
    state.overlayActive = !state.overlayActive;
    if (state.overlayActive) {
      overlayPanelEl.hidden = false;
      overlayBtn.classList.add("tv-ba-btn--active");
      await loadAndDisplayOverlay();
    } else {
      overlayPanelEl.hidden = true;
      overlayBtn.classList.remove("tv-ba-btn--active");
      viewport.removeLayer(GHOST_UPPER_ID);
      viewport.removeLayer(GHOST_LOWER_ID);
      viewport.setLayerOpacity(activeUpperId, 1);
      viewport.setLayerOpacity(activeLowerId, 1);
    }
  }

  function setOverlayBlend(ratio: number): void {
    state.overlayBlend = ratio;
    if (!state.overlayActive) return;
    // ratio 0 = 100% current stage, ratio 1 = 100% initial stage
    const ghostOpacity = (1 - ratio) * 0.7;
    const currentOpacity = Math.max(0.25, ratio);
    viewport.setLayerOpacity(GHOST_UPPER_ID, ghostOpacity);
    viewport.setLayerOpacity(GHOST_LOWER_ID, ghostOpacity);
    viewport.setLayerOpacity(activeUpperId, currentOpacity);
    viewport.setLayerOpacity(activeLowerId, currentOpacity);
  }

  async function loadAndDisplayOverlay(): Promise<void> {
    if (!state.overlayActive) return;
    const stage1 = state.manifest.treatmentStages[0];
    if (!stage1) return;
    const outcome = await loadStageModels(stage1.upper, stage1.lower);
    if (!outcome.ok) return;

    viewport.addLayer({
      id: GHOST_UPPER_ID,
      label: "Initial Stage 1 - Upper Ghost",
      colour: GHOST_COLOR,
      stl: outcome.models.upperStl,
    });
    viewport.addLayer({
      id: GHOST_LOWER_ID,
      label: "Initial Stage 1 - Lower Ghost",
      colour: GHOST_COLOR,
      stl: outcome.models.lowerStl,
    });

    viewport.setLayerVisible(GHOST_UPPER_ID, state.upperVisible);
    viewport.setLayerVisible(GHOST_LOWER_ID, state.lowerVisible);

    setOverlayBlend(state.overlayBlend);
  }

  // ── Load a new Case Manifest ──────────────────────────────────────────────

  async function loadManifest(newManifest: CaseManifest): Promise<void> {
    stopPlay();
    if (transitionAnimId !== null) {
      cancelAnimationFrame(transitionAnimId);
      transitionAnimId = null;
      if (prevUpperId) viewport.removeLayer(prevUpperId);
      if (prevLowerId) viewport.removeLayer(prevLowerId);
      prevUpperId = null;
      prevLowerId = null;
    }
    state.manifest = newManifest;
    state.currentIndex = -1;
    state.activeTemplateStage = null;
    // Reset initial-stage tooth centroids so hover delta recalculates for the new case.
    stage1UpperCentroids = null;
    stage1LowerCentroids = null;
    upperToothDisplacements = null;
    lowerToothDisplacements = null;


    // Update slider limits dynamically
    sliderEl.max = String(Math.max(1, newManifest.treatmentStages.length));
    sliderEl.value = "1";

    // Update patient brand in header
    const subEl = root.querySelector(".tv-header__sub");
    if (subEl) {
      subEl.textContent = newManifest.patientName
        ? `Patient: ${newManifest.patientName}`
        : `Case: ${newManifest.caseId}`;
    }

    // Rebuild dots and sidebar for the new case
    rebuildScrubberDots();
    rebuildSidebar();

    // Report ambiguities if any exist
    if (newManifest.ambiguities.length > 0) {
      ambiguityBannerEl.textContent = `⚠ ${newManifest.ambiguities.length} pairing ambiguity detected: ${newManifest.ambiguities[0]}`;
      ambiguityBannerEl.hidden = false;
    } else {
      ambiguityBannerEl.hidden = true;
    }

    if (newManifest.treatmentStages.length > 0) {
      await navigate(0);
    } else {
      state.error = "This case has no patient-visible treatment stages.";
      syncUI();
    }
  }

  // ── Scrubber & Sidebar Rebuilders ─────────────────────────────────────────

  function rebuildScrubberDots(): void {
    scrubberDotsContainer.replaceChildren();
    const count = state.manifest.treatmentStages.length;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "tv-scrubber-dot";
      dot.title = `Jump to stage ${i + 1}`;
      dot.addEventListener("click", () => {
        stopPlay();
        void navigate(i);
      });
      scrubberDotsContainer.appendChild(dot);
    }
    updateScrubberProgress();
  }

  function updateScrubberProgress(): void {
    const count = state.manifest.treatmentStages.length;
    const dots = scrubberDotsContainer.querySelectorAll<HTMLButtonElement>(".tv-scrubber-dot");
    dots.forEach((dot, idx) => {
      dot.classList.toggle("tv-scrubber-dot--active", idx === state.currentIndex);
      dot.classList.toggle("tv-scrubber-dot--passed", idx < state.currentIndex);
    });

    if (count > 1 && state.currentIndex >= 0) {
      const pct = (state.currentIndex / (count - 1)) * 100;
      scrubberFillEl.style.width = `${pct}%`;
    } else {
      scrubberFillEl.style.width = "0%";
    }
  }

  function rebuildSidebar(): void {
    sidebarListEl.replaceChildren();
    const count = state.manifest.treatmentStages.length;
    const pName = state.manifest.patientName ?? state.manifest.caseId;
    sidebarPatientNameEl.textContent = pName;
    sidebarStageCountEl.textContent = `${count} ${count === 1 ? "Stage" : "Stages"}`;

    state.manifest.treatmentStages.forEach((stg, idx) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "tv-stage-card";
      card.title = `Go to ${stg.label}`;
      const thumb = div("tv-stage-card__thumb", ["🦷"]);
      const info = div("tv-stage-card__info", [
        div("tv-stage-card__label", [stg.label]),
        div("tv-stage-card__meta", [`Stage ${stg.stageNumber ?? idx + 1} of ${count}`]),
      ]);
      card.append(thumb, info);
      card.addEventListener("click", () => {
        stopPlay();
        void navigate(idx);
      });
      sidebarListEl.appendChild(card);
    });
    syncSidebarSelection();
  }

  function syncSidebarSelection(): void {
    const cards = sidebarListEl.querySelectorAll<HTMLButtonElement>(".tv-stage-card");
    cards.forEach((card, idx) => {
      card.classList.toggle("tv-stage-card--active", idx === state.currentIndex);
    });
  }

  // ── UI Sync ───────────────────────────────────────────────────────────────

  function syncUI(): void {
    const stages = state.manifest.treatmentStages;
    const count = stages.length;
    const current = stages[state.currentIndex];

    if (state.activeTemplateStage) {
      stageLabel.textContent = `${state.activeTemplateStage.label} (Doctor Reference)`;
    } else if (current) {
      const actualNumber = current.stageNumber ?? state.currentIndex + 1;
      stageLabel.textContent = `Stage ${actualNumber} (${state.currentIndex + 1} of ${count})`;
    } else {
      stageLabel.textContent = `Stage — / ${count}`;
    }

    sliderEl.value = String(state.currentIndex + 1);
    sliderEl.disabled = state.loading || Boolean(state.activeTemplateStage);

    prevBtn.disabled =
      state.loading ||
      state.currentIndex <= 0 ||
      Boolean(state.activeTemplateStage);
    nextBtn.disabled =
      state.loading ||
      state.currentIndex >= count - 1 ||
      Boolean(state.activeTemplateStage);
    playBtn.disabled = state.loading || Boolean(state.activeTemplateStage);
    circularPlayBtn.disabled = state.loading || Boolean(state.activeTemplateStage);

    // Sync Before / After buttons
    const isBefore = state.currentIndex === 0;
    const isAfter = count > 0 && state.currentIndex === count - 1;
    beforeBtn.classList.toggle("tv-ba-btn--active", isBefore);
    afterBtn.classList.toggle("tv-ba-btn--active", isAfter);

    updateScrubberProgress();
    syncSidebarSelection();
    syncArchPillUI();

    loadingEl.hidden = !state.loading;

    if (state.error !== null) {
      statusEl.textContent = `⚠ ${state.error}`;
      statusEl.className = "tv-status tv-status--error";
      statusEl.hidden = false;
    } else if (state.loading) {
      statusEl.textContent = "Loading models…";
      statusEl.className = "tv-status";
      statusEl.hidden = false;
    } else {
      statusEl.hidden = true;
    }
  }

  // ── Stage & File Selection Modal ──────────────────────────────────────────

  function openStageSelector(): void {
    const existingModal = document.querySelector(".tv-modal-backdrop");
    if (existingModal) existingModal.remove();

    const backdrop = div("tv-modal-backdrop");
    const modal = div("tv-modal");

    // Modal Header
    const modalHeader = div("tv-modal__header", [
      heading(
        `Case Setup: ${state.manifest.patientName ?? state.manifest.caseId}`,
      ),
      makeBtn("✕ Close", () => backdrop.remove(), "tv-btn--subtle"),
    ]);

    // Ambiguities Section
    const ambiguitySection = div("tv-modal__section");
    if (state.manifest.ambiguities.length > 0) {
      ambiguitySection.append(
        div("tv-modal__subtitle--danger", [
          `⚠ Detected Ambiguities (${state.manifest.ambiguities.length}):`,
        ]),
        ...state.manifest.ambiguities.map((a) =>
          div("tv-ambiguity-item", [`• ${a}`]),
        ),
      );
    } else {
      ambiguitySection.append(
        div("tv-modal__subtitle--success", [
          "✓ All treatment stages and arch pairings are validated.",
        ]),
      );
    }

    // Doctor-only Template Section
    const templateSection = div("tv-modal__section");
    templateSection.append(
      div("tv-modal__subtitle", ["Doctor-Only Reference Templates:"]),
      span(
        "tv-modal__hint",
        "These reference scans are strictly excluded from patient progression.",
      ),
    );
    if (state.manifest.templateStages.length === 0) {
      templateSection.append(
        div("tv-modal__empty", ["None present in this case."]),
      );
    } else {
      const templateList = div("tv-stage-grid");
      state.manifest.templateStages.forEach((tpl) => {
        const item = div("tv-stage-grid__item tv-stage-grid__item--template", [
          div("tv-stage-grid__label", [tpl.label]),
          div("tv-stage-grid__files", [
            `Upper: ${tpl.upper.filename}`,
            document.createElement("br"),
            `Lower: ${tpl.lower.filename}`,
          ]),
          makeBtn(
            "Inspect in 3D (Doctor View)",
            () => {
              backdrop.remove();
              void inspectTemplate(tpl);
            },
            "tv-btn--accent tv-btn--small",
          ),
        ]);
        templateList.appendChild(item);
      });
      templateSection.appendChild(templateList);
    }

    // Patient Stages Section
    const treatmentSection = div("tv-modal__section");
    treatmentSection.append(
      div("tv-modal__subtitle", ["Patient Treatment Progression Stages:"]),
      span(
        "tv-modal__hint",
        "Stages presented to patient in the progression slider.",
      ),
    );
    const stageList = div("tv-stage-grid");
    state.manifest.treatmentStages.forEach((stg, idx) => {
      const item = div("tv-stage-grid__item", [
        div("tv-stage-grid__label", [
          stg.label,
          stg.stageNumber !== undefined
            ? ` (Preserved #${stg.stageNumber})`
            : "",
        ]),
        div("tv-stage-grid__files", [
          `Upper: ${stg.upper.filename}`,
          document.createElement("br"),
          `Lower: ${stg.lower.filename}`,
        ]),
        makeBtn(
          "Jump to Stage",
          () => {
            backdrop.remove();
            void navigate(idx);
          },
          "tv-btn--small",
        ),
      ]);
      stageList.appendChild(item);
    });
    treatmentSection.appendChild(stageList);

    // File Drop & Pair Ingest Section
    const filePickerSection = div("tv-modal__section tv-modal__section--drop");
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.multiple = true;
    fileInput.accept = ".stl,.ply,.obj";
    fileInput.style.display = "none";

    const uploadBtn = makeBtn(
      "📁 Select STL Files to Ingest & Pair…",
      () => fileInput.click(),
      "tv-btn--primary",
    );

    filePickerSection.append(
      div("tv-modal__subtitle", ["Ingest Raw STL Files for New Case:"]),
      span(
        "tv-modal__hint",
        "Upload raw STL files to automatically detect stages, upper/lower jaws, and doctor templates.",
      ),
      fileInput,
      uploadBtn,
    );

    const validationResultEl = div("tv-validation-results");
    validationResultEl.hidden = true;

    fileInput.addEventListener("change", () => {
      if (!fileInput.files || fileInput.files.length === 0) return;
      const descriptors: RawFileDescriptor[] = Array.from(fileInput.files).map(
        (f) => ({
          name: f.name,
          file: f,
          size: f.size,
        }),
      );

      const paired = pairTreatmentFiles(
        descriptors,
        "uploaded-case",
        fileInput.files[0]?.name.split(" ")[0] ?? "Patient",
      );

      validationResultEl.replaceChildren();
      validationResultEl.hidden = false;

      if (paired.ambiguities.length > 0) {
        validationResultEl.append(
          div("tv-modal__subtitle--danger", [
            `⚠ Ambiguities Detected (${paired.ambiguities.length}):`,
          ]),
          ...paired.ambiguities.map((a) =>
            div("tv-ambiguity-item", [`• ${a}`]),
          ),
        );
      }

      if (paired.treatmentStages.length > 0) {
        const successMsg = div("tv-validation-success", [
          `✓ Successfully paired ${paired.treatmentStages.length} treatment stages (${paired.templateStages.length} template reference scans).`,
        ]);
        const loadBtn = makeBtn(
          "Load Validated Case Into Viewer",
          () => {
            backdrop.remove();
            void loadManifest(paired);
          },
          "tv-btn--accent",
        );
        validationResultEl.append(successMsg, loadBtn);
      } else {
        validationResultEl.append(
          div("tv-modal__subtitle--danger", [
            "No valid upper/lower pairs could be matched from these files.",
          ]),
        );
      }
    });

    filePickerSection.appendChild(validationResultEl);

    modal.append(
      modalHeader,
      ambiguitySection,
      templateSection,
      treatmentSection,
      filePickerSection,
    );
    backdrop.append(modal);

    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) backdrop.remove();
    });

    document.body.appendChild(backdrop);
  }

  // ── Auto Load ─────────────────────────────────────────────────────────────

  if (options.autoLoad !== false) {
    void navigate(0);
  }

  return {
    dispose: () => {
      stopPlay();
      if (transitionAnimId !== null) {
        cancelAnimationFrame(transitionAnimId);
        transitionAnimId = null;
      }
      window.removeEventListener("keydown", onKeyDown);
      viewport.dispose();
      root.replaceChildren();
      const existingModal = document.querySelector(".tv-modal-backdrop");
      if (existingModal) existingModal.remove();
    },
    navigate,
    inspectTemplate,
    loadManifest,
    togglePlay,
    toggleUpper,
    toggleLower,
    openStageSelector,
    toggleContacts,
    toggleOverlay,
    setOverlayBlend,
    getState: () => ({ ...state }),
  };
}

// ─── DOM helpers ─────────────────────────────────────────────────────────────

function div(
  className: string,
  children: (Node | string)[] = [],
): HTMLDivElement {
  const el = document.createElement("div");
  el.className = className;
  el.append(...children);
  return el;
}

function span(className: string, text: string): HTMLSpanElement {
  const el = document.createElement("span");
  el.className = className;
  el.textContent = text;
  return el;
}

function heading(text: string): HTMLHeadingElement {
  const el = document.createElement("h1");
  el.className = "tv-brand";
  el.textContent = text;
  return el;
}

function makeBtn(
  label: string,
  action: () => void,
  extraClass?: string,
): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = `tv-btn${extraClass ? ` ${extraClass}` : ""}`;
  btn.textContent = label;
  btn.addEventListener("click", action);
  return btn;
}
