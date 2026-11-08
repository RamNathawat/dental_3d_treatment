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
  IprEntry,
  RawFileDescriptor,
  StageDefinition,
} from "./stage-manifest";
import {
  pairTreatmentFiles,
  getArchStageNumbers,
  normalizeManifestStages,
} from "./stage-manifest";
import {
  loadStageModels,
  prefetchStageModels,
  loadStageGeometries,
  prewarmAllStageGeometries,
  getCachedStageGeometries,
  isStageGeomCached,
  getBufferedStageCount,
  setStageBufferedCallback,
  prioritizeStage,
  prioritizeStages,
  setModelProgressCallback,
  getLastKnownValidArchStages,
  clearStageGeometryCache,
} from "./model-loader";
import { applyBiteContacts, clearBiteContacts } from "./bite-contacts";
import {
  identifyToothAtPoint,
  computeToothCentroids,
  computeToothDisplacements,
  getClinicalToothList,
  getContactPoint,
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
  /** Whether orthodontic composite attachments are visible. */
  attachmentsVisible: boolean;
  /** Playback speed multiplier (1 = normal 1x, 0.5 = 0.5x, 1.5 = 1.5x). Defaults to 1. */
  playbackSpeed: number;
  /** Whether autoplay progression is currently running. */
  isPlaying: boolean;
  /** Whether occlusal bite contacts inspection is active. */
  contactsActive: boolean;
  /** Whether dual-stage ghost overlay comparison is active. */
  overlayActive: boolean;
  /** Overlay blend ratio (0 = current stage, 1 = initial stage 1). */
  overlayBlend: number;
  /** Whether Interproximal Reduction (IPR) values and contact callouts are active. */
  iprActive: boolean;
  /** Whether the doctor's notes and clinical remarks drawer is open. */
  notesOpen: boolean;
  /** AbortController for the in-flight fetch, cancelled on new navigation. */
  abortController: AbortController | null;
  /** Whether the clinical tooth movements panel is open. */
  metricsPanelOpen: boolean;
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
  /** Autoplay interval in milliseconds (defaults to 600ms). */
  readonly autoplayIntervalMs?: number;
  /** Duration of cross-dissolve transition between stages in ms (defaults to 260ms, 0 for instant). */
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
  readonly toggleAttachments: () => void;
  readonly setAttachmentsVisible: (visible: boolean) => void;
  readonly toggleIpr: () => void;
  readonly setIprActive: (active: boolean) => void;
  readonly toggleNotes: () => void;
  readonly setNotesOpen: (open: boolean) => void;
  readonly cyclePlaybackSpeed: () => number;
  readonly setPlaybackSpeed: (speed: number) => void;
  readonly getPlaybackSpeed: () => number;
  readonly getState: () => Readonly<AppState>;
}

const isTestEnv =
  (typeof process !== "undefined" &&
    (process.env.NODE_ENV === "test" || process.env.VITEST === "true")) ||
  (typeof window !== "undefined" && "__VITEST__" in window);

// ─── Entry point ─────────────────────────────────────────────────────────────

export function createTreatmentApp(
  root: HTMLElement,
  options: TreatmentAppOptions = {},
): TreatmentAppHandle {
  const makeViewport = options.createViewport ?? createViewport;
  const autoplayInterval = options.autoplayIntervalMs ?? 240;
  const transitionDuration = options.transitionDurationMs ?? 0;

  const rawManifest = options.caseManifest ?? DEFAULT_CASE_MANIFEST;
  const manifest = normalizeManifestStages(rawManifest);
  const caseHasUpper = manifest.treatmentStages.some((s) => Boolean(s.upper));
  const caseHasLower = manifest.treatmentStages.some((s) => Boolean(s.lower));
  const isSingleArchUpper = caseHasUpper && !caseHasLower;
  const isSingleArchLower = !caseHasUpper && caseHasLower;

  const state: AppState = {
    manifest,
    currentIndex: -1,
    activeTemplateStage: null,
    loading: false,
    error: null,
    upperVisible: !isSingleArchLower,
    lowerVisible: !isSingleArchUpper,
    attachmentsVisible: false,
    playbackSpeed: 1,
    isPlaying: false,
    contactsActive: false,
    overlayActive: false,
    overlayBlend: 0.5,
    iprActive: false,
    notesOpen: false,
    abortController: null,
    metricsPanelOpen: false,
  };

  const GHOST_UPPER_ID = "tv-ghost-upper";
  const GHOST_LOWER_ID = "tv-ghost-lower";
  const GHOST_COLOR = "#38bdf8";

  let playTimer: number | null = null;
  let pendingStageIndex: number | null = null;
  let isStageLoading = false;
  let activeUpperId = `${UPPER_ARCH_ID}-0`;
  let activeLowerId = `${LOWER_ARCH_ID}-0`;
  let prevUpperId: string | null = null;
  let prevLowerId: string | null = null;
  let transitionAnimId: number | null = null;
  let layerCounter = 0;
  let isInitialBoot = options.autoLoad !== false;

  /**
   * Per-tooth centroids of the initial Stage 1 arch geometries.
   * Key is FDI tooth number (e.g. 11..18, 21..28, 31..38, 41..48).
   * Values are [x, y, z] in mm.
   */
  let stage1UpperCentroids: Record<number, [number, number, number]> | null = null;
  let stage1LowerCentroids: Record<number, [number, number, number]> | null = null;
  let lastValidUpperGeom: import("three").BufferGeometry | null = null;
  let lastValidLowerGeom: import("three").BufferGeometry | null = null;

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
  pillLowerBtn.textContent = "Lower";
  pillLowerBtn.title = "View Lower (Mandibular) arch only";
  pillLowerBtn.addEventListener("click", () => setArchMode("lower"));

  const pillUpperBtn = document.createElement("button");
  pillUpperBtn.type = "button";
  pillUpperBtn.className = "tv-arch-pill__btn";
  pillUpperBtn.textContent = "Upper";
  pillUpperBtn.title = "View Upper (Maxillary) arch only";
  pillUpperBtn.addEventListener("click", () => setArchMode("upper"));

  const pillBothBtn = document.createElement("button");
  pillBothBtn.type = "button";
  pillBothBtn.className = "tv-arch-pill__btn tv-arch-pill__btn--active";
  pillBothBtn.textContent = "Both";
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

  // ── Clinical Tooth Movement Drawer ────────────────────────────────────────
  const movementDrawerStageBadgeEl = span("tv-movement-drawer__stage-badge", "Stage 1 of 1");
  const movementUpperListEl = div("tv-movement-list");
  const movementLowerListEl = div("tv-movement-list");

  const movementDrawerEl = div("tv-movement-drawer", [
    div("tv-movement-drawer__header", [
      div("tv-movement-drawer__title-wrap", [
        (() => { const h3 = document.createElement("h3"); h3.textContent = "Tooth Movements"; return h3; })(),
        movementDrawerStageBadgeEl,
      ]),
      makeBtn("✕", () => toggleMovementsDrawer(), "tv-movement-drawer__close"),
    ]),
    div("tv-movement-content", [
      div("tv-movement-section", [
        div("tv-movement-section__header", [
          span("tv-movement-section__title", "Upper Arch (Maxillary)"),
        ]),
        movementUpperListEl,
      ]),
      div("tv-movement-section", [
        div("tv-movement-section__header", [
          span("tv-movement-section__title", "Lower Arch (Mandibular)"),
        ]),
        movementLowerListEl,
      ]),
    ]),
  ]);
  movementDrawerEl.hidden = true;
  movementDrawerEl.style.display = "none";
  movementDrawerEl.style.visibility = "hidden";

  // ── Doctor's Notes & Remarks Drawer ───────────────────────────────────────
  const notesDrawerDoctorMetaEl = div("tv-notes-meta");
  const notesDrawerGuidelinesEl = div("tv-notes-guidelines");
  const notesDrawerGeneralEl = div("tv-notes-general");
  const notesDrawerStageListEl = div("tv-notes-stage-list");

  // Backdrop overlay to cleanly dismiss drawer on mobile or canvas click
  const notesBackdropEl = div("tv-notes-backdrop");
  notesBackdropEl.hidden = true;
  notesBackdropEl.style.display = "none";
  notesBackdropEl.addEventListener("click", () => {
    setNotesOpen(false);
  });

  const notesDrawerEl = div("tv-notes-drawer", [
    div("tv-notes-drawer__header", [
      div("tv-notes-drawer__title-wrap", [
        (() => {
          const h3 = document.createElement("h3");
          h3.textContent = "Treatment Plan & Remarks";
          return h3;
        })(),
        span("tv-notes-drawer__sub", "Treating Doctor Guidance"),
      ]),
      makeBtn("✕", () => toggleNotesDrawer(), "tv-notes-drawer__close"),
    ]),
    div("tv-notes-content", [
      notesDrawerDoctorMetaEl,
      notesDrawerGuidelinesEl,
      notesDrawerGeneralEl,
      div("tv-notes-section", [
        div("tv-notes-section__header", [
          span("tv-notes-section__title", "Stage-Specific Remarks"),
        ]),
        notesDrawerStageListEl,
      ]),
    ]),
  ]);
  notesDrawerEl.hidden = true;
  notesDrawerEl.style.display = "none";
  notesDrawerEl.style.visibility = "hidden";

  // Treatment Plan button in header
  const notesHeaderBtn = makeBtn(
    "Treatment Plan",
    () => toggleNotesDrawer(),
    "tv-btn--tool tv-btn--notes",
  );
  notesHeaderBtn.title = "View treatment plan, instructions & case remarks";

  // Quick tools in top bar
  let isGridVisible = false;
  const gridBtn = makeBtn(
    "Grid",
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
    "Recenter",
    () => {
      viewport.setView("top");
      viewport.fitAll();
    },
    "tv-btn--tool",
  );
  recenterBtn.title = "Reset and frame dental models in frontal smile position";

  // Dark / Light Mode Theme Toggle Button (replaces Cases button per requirement)
  let isDarkMode = false;
  const savedTheme =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("dental_theme")
      : null;
  if (
    savedTheme === "dark" ||
    (!savedTheme &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    isDarkMode = true;
  }

  const themeToggleBtn = makeBtn(
    isDarkMode ? "Light" : "Dark",
    () => {
      isDarkMode = !isDarkMode;
      if (isDarkMode) {
        appEl.classList.add("tv-app--dark");
        if (typeof document !== "undefined") {
          document.documentElement.classList.add("dark");
          document.documentElement.setAttribute("data-theme", "dark");
        }
        themeToggleBtn.textContent = "Light";
        themeToggleBtn.title = "Switch to Light Mode";
        try {
          localStorage.setItem("dental_theme", "dark");
        } catch {}
        viewport.setBackgroundColor?.(0x0f141f);
      } else {
        appEl.classList.remove("tv-app--dark");
        if (typeof document !== "undefined") {
          document.documentElement.classList.remove("dark");
          document.documentElement.setAttribute("data-theme", "light");
        }
        themeToggleBtn.textContent = "Dark";
        themeToggleBtn.title = "Switch to Dark Mode";
        try {
          localStorage.setItem("dental_theme", "light");
        } catch {}
        viewport.setBackgroundColor?.(0xebe7e0);
      }
    },
    "tv-btn--tool tv-btn--theme-toggle",
  );
  themeToggleBtn.title = isDarkMode
    ? "Switch to Light Mode"
    : "Switch to Dark Mode";

  const toggleSidebarBtn = makeBtn(
    "Stages",
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
    "Reset",
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
  stageLabel.title = "View all treatment stages";
  stageLabel.addEventListener("click", () => {
    openStageSelector();
  });

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

  const SPEED_OPTIONS: readonly number[] = [1, 0.5, 1.5];

  const speedBtn = document.createElement("button");
  speedBtn.type = "button";
  speedBtn.className = "tv-btn--speed";
  speedBtn.textContent = "1x";
  speedBtn.title = "Playback speed: 1x (Click to cycle: 1x, 0.5x, 1.5x)";
  speedBtn.setAttribute("aria-label", "Playback speed: 1x");
  speedBtn.addEventListener("click", () => {
    cyclePlaybackSpeed();
  });

  const nextBtn = makeBtn("›", () => {
    stopPlay();
    void navigate(state.currentIndex + 1);
  }, "tv-stepper-btn");
  nextBtn.title = "Next stage";

  let sliderDebounceTimer: number | null = null;
  sliderEl.addEventListener("input", () => {
    stopPlay();
    const target = Number(sliderEl.value) - 1;
    pendingStageIndex = target;
    updateScrubberProgress();
    syncSidebarSelection();
    if (sliderDebounceTimer !== null) {
      clearTimeout(sliderDebounceTimer);
    }
    sliderDebounceTimer = window.setTimeout(() => {
      sliderDebounceTimer = null;
      void navigate(target);
    }, 45);
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
    "Contacts",
    () => toggleContacts(),
    "tv-ba-btn tv-dock-tool-btn",
  );
  contactsBtn.title = "Inspect occlusal bite contact collision & clearance heatmap";

  // Feature 9: Overlay button
  const overlayBtn = makeBtn(
    "Overlay",
    () => {
      void toggleOverlay();
    },
    "tv-ba-btn tv-dock-tool-btn",
  );
  overlayBtn.title = "Overlay initial stage against current stage with blend slider";

  // Feature 10: Attachments toggle button (default: toggled off / no attachments visible)
  const attachmentsBtn = makeBtn(
    "Attachments",
    () => toggleAttachments(),
    "tv-ba-btn tv-dock-tool-btn",
  );
  attachmentsBtn.title = "Toggle visibility of orthodontic composite attachments (contrast deep orange engagers)";
  attachmentsBtn.setAttribute("aria-pressed", "false");
  attachmentsBtn.dataset.tool = "attachments";

  // Feature 11: IPR toggle button (default: toggled off)
  const iprBtn = makeBtn(
    "IPR",
    () => toggleIpr(),
    "tv-ba-btn tv-dock-tool-btn",
  );
  iprBtn.title = "Toggle planned Interproximal Reduction (IPR) values and contact callouts";
  iprBtn.setAttribute("aria-pressed", "false");

  const dockToolsEl = div("tv-dock-tools", [
    beforeAfterPillEl,
    contactsBtn,
    overlayBtn,
    attachmentsBtn,
    iprBtn,
  ]);

  // Interactive scrubber dots container
  const scrubberTrackEl = div("tv-scrubber-track");
  const scrubberBufferEl = div("tv-scrubber-buffer-bar");
  const scrubberFillEl = div("tv-scrubber-fill");
  const scrubberDotsContainer = div("tv-scrubber-dots");
  scrubberTrackEl.append(scrubberBufferEl, scrubberFillEl, scrubberDotsContainer);

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
      speedBtn,
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

  // Feature 11: 3D Callout SVG Overlay
  const iprSvgOverlay = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  iprSvgOverlay.setAttribute("class", "tv-ipr-overlay");

  // Feature 11: Floating IPR Legend / Summary Panel
  const iprLegendBodyEl = div("tv-ipr-legend__body");
  const iprLegendEl = div("tv-ipr-legend", [
    div("tv-ipr-legend__header", [
      div("tv-ipr-legend__title-wrap", [
        span("tv-ipr-legend__title", "Interproximal Reduction (IPR)"),
      ]),
      makeBtn("✕", () => toggleIpr(), "tv-btn--subtle tv-contacts-legend__close"),
    ]),
    iprLegendBodyEl,
  ]);
  iprLegendEl.hidden = true;

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
      "Doctor Mode: Viewing Reference Template (Excluded from Patient Progression)",
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

  // Loading overlay with clinical progress bar
  const loadingTextEl = span("tv-loading__text", "Loading 3D Models…");
  const loadingBarFillEl = div("tv-loading__bar-fill", []);
  const loadingBarTrackEl = div("tv-loading__bar-track", [loadingBarFillEl]);
  const loadingEl = div("tv-loading", [
    div("tv-loading__spinner", []),
    loadingTextEl,
    loadingBarTrackEl,
  ]);
  loadingEl.hidden = true;

  let isDownloadFinished = false;

  function updateOptimizationProgress(bufferedCount?: number, totalCount?: number): void {
    if (!state.loading) return;
    const count = bufferedCount ?? getBufferedStageCount();
    const total = totalCount ?? state.manifest.treatmentStages.length;
    if (total <= 0) return;
    const optPct = Math.min(100, Math.round((count / total) * 100));
    if (optPct >= 100) {
      loadingTextEl.textContent = "All 3D models ready!";
      loadingBarFillEl.style.width = "100%";
      loadingBarFillEl.classList.remove("tv-loading__bar-fill--pulse");
    } else {
      loadingTextEl.textContent = `Optimizing 3D models for smooth playback: ${count} of ${total} stages ready (${optPct}%)`;
      loadingBarFillEl.style.width = `${optPct}%`;
      loadingBarFillEl.classList.remove("tv-loading__bar-fill--pulse");
    }
  }

  // Stream live download progress to the doctor (Phase 1)
  setModelProgressCallback((loaded, total, percent) => {
    if (!state.loading) return;
    if (total > 0) {
      const loadedMb = (loaded / (1024 * 1024)).toFixed(1);
      const totalMb = (total / (1024 * 1024)).toFixed(1);
      if (percent >= 100) {
        isDownloadFinished = true;
        updateOptimizationProgress();
      } else {
        isDownloadFinished = false;
        loadingTextEl.textContent = `Downloading 3D Models: ${percent}% (${loadedMb} / ${totalMb} MB)`;
        loadingBarFillEl.style.width = `${percent}%`;
        loadingBarFillEl.classList.remove("tv-loading__bar-fill--pulse");
      }
    } else if (!isDownloadFinished) {
      loadingTextEl.textContent = "Downloading 3D Models…";
      loadingBarFillEl.style.width = "25%";
      loadingBarFillEl.classList.add("tv-loading__bar-fill--pulse");
    }
  });

  // YouTube-style timeline buffer update listener & Phase 2 optimization tracker
  setStageBufferedCallback((_stageId, bufferedCount, totalCount) => {
    updateScrubberProgress();
    if (state.loading) {
      updateOptimizationProgress(bufferedCount, totalCount);
    }
  });

  // HUD (triangle/fps counter in corner)
  const hudEl = div("tv-hud", []);

  // Left Collapsible Case Drawer / Sidebar
  const sidebarPatientNameEl = div("tv-sidebar__patient-name", ["Patient Case"]);
  const sidebarPatientDemographicsEl = div("tv-sidebar__patient-demographics");
  const sidebarStageCountEl = span("tv-sidebar__badge", "10 Stages");
  const sidebarStatusDotEl = span("tv-sidebar__status-dot", "");
  const sidebarListEl = div("tv-sidebar__list");

  const sidebarBackdrop = div("tv-sidebar-backdrop");

  const avatarSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  avatarSvg.setAttribute("viewBox", "0 0 24 24");
  avatarSvg.setAttribute("width", "18");
  avatarSvg.setAttribute("height", "18");
  avatarSvg.setAttribute("fill", "none");
  avatarSvg.setAttribute("stroke", "currentColor");
  avatarSvg.setAttribute("stroke-width", "2");
  avatarSvg.setAttribute("stroke-linecap", "round");
  avatarSvg.setAttribute("stroke-linejoin", "round");
  const avatarPath1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  avatarPath1.setAttribute("d", "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2");
  const avatarPath2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  avatarPath2.setAttribute("cx", "12");
  avatarPath2.setAttribute("cy", "7");
  avatarPath2.setAttribute("r", "4");
  avatarSvg.append(avatarPath1, avatarPath2);

  const sidebarEl = div("tv-sidebar", [
    div("tv-sidebar__header", [
      span("tv-sidebar__header-title", "Treatment Stages"),
      makeBtn("✕", () => appEl.classList.remove("tv-app--sidebar-open"), "tv-btn--subtle tv-sidebar__close-btn"),
    ]),
    div("tv-sidebar__card", [
      div("tv-sidebar__avatar", [avatarSvg]),
      div("tv-sidebar__patient-info", [
        sidebarPatientNameEl,
        sidebarPatientDemographicsEl,
        div("tv-sidebar__status-row", [
          sidebarStatusDotEl,
          sidebarStageCountEl,
        ]),
      ]),
    ]),
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
    iprSvgOverlay,
    div("tv-stage__top-bar", [
      div("tv-stage__top-left", [toggleSidebarBtn]),
      div("tv-stage__top-center", [archPillEl]),
      div("tv-stage__top-right", [gridBtn, recenterBtn, themeToggleBtn]),
    ]),
    templateNoticeEl,
    contactsLegendEl,
    iprLegendEl,
    overlayPanelEl,
    movementDrawerEl,
    notesBackdropEl,
    notesDrawerEl,
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
        div("tv-header__title-wrap", [
          heading("3D Treatment Progression"),
        ]),
        div("tv-header__divider"),
        div("tv-header__sub tv-header__patient-chip", [
          span("tv-header__patient-dot", ""),
          span("tv-header__patient-label", "Patient"),
          span(
            "tv-header__patient-name",
            state.manifest.patientId
              ? `${state.manifest.patientName ?? state.manifest.caseId} (#${state.manifest.patientId})`
              : (state.manifest.patientName ?? state.manifest.caseId),
          ),
          ...((state.manifest.patientSex || state.manifest.patientAge != null)
            ? [
                span(
                  "tv-header__patient-demo",
                  [state.manifest.patientSex, state.manifest.patientAge != null ? `${state.manifest.patientAge}y` : null]
                    .filter(Boolean)
                    .join(" · "),
                ),
              ]
            : []),
        ]),
      ]),
      div("tv-header__actions", [
        notesHeaderBtn,
        gridBtn,
        recenterBtn,
        themeToggleBtn,
      ]),
    ]),
    div("tv-main-container", [
      sidebarBackdrop,
      sidebarEl,
      stageEl,
    ]),
  ]);

  if (isDarkMode) {
    appEl.classList.add("tv-app--dark");
    if (typeof document !== "undefined") {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    }
    viewport.setBackgroundColor?.(0x0f141f);
  } else {
    appEl.classList.remove("tv-app--dark");
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
    viewport.setBackgroundColor?.(0xebe7e0);
  }

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
    if (state.iprActive) {
      renderIprOverlay();
    }

    syncArchPillUI();
  }

  function syncArchPillUI(): void {
    if (isSingleArchUpper || isSingleArchLower) {
      archPillEl.style.display = "none";
      contactsBtn.style.display = "none";
      return;
    }

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
    if (state.iprActive) {
      renderIprOverlay();
    }
    syncArchPillUI();
  }

  function toggleLower(): void {
    state.lowerVisible = !state.lowerVisible;
    viewport.setLayerVisible(activeLowerId, state.lowerVisible);
    if (prevLowerId) {
      viewport.setLayerVisible(prevLowerId, state.lowerVisible);
    }
    if (state.iprActive) {
      renderIprOverlay();
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

  async function stepPlayLoop(): Promise<void> {
    if (!state.isPlaying) return;
    const count = state.manifest.treatmentStages.length;
    if (count <= 1) return;

    const prevIndex = state.currentIndex;
    const nextIndex = (state.currentIndex + 1) % count;

    const nextStage = state.manifest.treatmentStages[nextIndex];
    const isCached = nextStage ? isStageGeomCached(nextStage.id) : false;
    if (!isCached) {
      circularPlayBtn.classList.add("tv-btn--buffering");
    }

    try {
      await navigate(nextIndex);
    } finally {
      circularPlayBtn.classList.remove("tv-btn--buffering");
    }

    if (!state.isPlaying) return;

    // Safety guard: If navigate did not advance, try next stage or pause gently without freezing UI
    if (state.currentIndex === prevIndex && state.currentIndex !== nextIndex) {
      const skipIndex = (nextIndex + 1) % count;
      if (skipIndex !== prevIndex) {
        await navigate(skipIndex);
      }
      if (state.currentIndex === prevIndex) {
        stopPlay();
        return;
      }
    }

    // At the final outcome stage, pause so user can appreciate the final result before looping
    const delay = nextIndex === count - 1
      ? Math.round(1200 / state.playbackSpeed)
      : Math.round(autoplayInterval / state.playbackSpeed);
    playTimer = window.setTimeout(() => {
      void stepPlayLoop();
    }, delay);
  }

  function cyclePlaybackSpeed(): number {
    const currentIdx = SPEED_OPTIONS.indexOf(state.playbackSpeed);
    const nextIdx = (currentIdx === -1 ? 0 : currentIdx + 1) % SPEED_OPTIONS.length;
    const nextSpeed = SPEED_OPTIONS[nextIdx] ?? 1;
    setPlaybackSpeed(nextSpeed);
    return nextSpeed;
  }

  function setPlaybackSpeed(speed: number): void {
    state.playbackSpeed = speed > 0 ? speed : 1;
    speedBtn.textContent = `${state.playbackSpeed}x`;
    speedBtn.title = `Playback speed: ${state.playbackSpeed}x (Click to cycle: 1x, 0.5x, 1.5x)`;
    speedBtn.setAttribute("aria-label", `Playback speed: ${state.playbackSpeed}x`);

    // If currently playing, reschedule next frame immediately at new rate
    if (state.isPlaying && playTimer !== null) {
      clearTimeout(playTimer);
      const delay = Math.round(autoplayInterval / state.playbackSpeed);
      playTimer = window.setTimeout(() => {
        void stepPlayLoop();
      }, delay);
    }
  }

  function getPlaybackSpeed(): number {
    return state.playbackSpeed;
  }

  function startPlay(): void {
    if (state.isPlaying) return;
    const stages = state.manifest.treatmentStages;
    const count = stages.length;
    if (count <= 1) return;

    // Prioritize upcoming stages immediately in background worker pool
    const cur = state.currentIndex >= 0 ? state.currentIndex : 0;
    const priorityIds: string[] = [];
    for (let i = 1; i <= Math.min(12, count); i++) {
      const idx = (cur + i) % count;
      const s = stages[idx];
      if (s) priorityIds.push(s.id);
    }
    prioritizeStages(priorityIds);

    state.isPlaying = true;
    playBtn.textContent = "⏸ Pause";
    playBtn.classList.add("tv-btn--active");
    circularPlayBtn.textContent = "⏸";
    circularPlayBtn.classList.add("tv-btn--active");

    if (playTimer !== null) {
      clearTimeout(playTimer);
      playTimer = null;
    }

    void stepPlayLoop();
  }

  function stopPlay(): void {
    state.isPlaying = false;
    if (playTimer !== null) {
      clearTimeout(playTimer);
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
    if (clamped === state.currentIndex && !state.activeTemplateStage) return;

    const stage = stages[clamped];
    if (!stage) return;

    state.activeTemplateStage = null;
    templateNoticeEl.hidden = true;

    // Prioritize adjacent stages in background prewarmer immediately
    prioritizeStage(stage.id);
    const next1 = stages[clamped + 1];
    if (next1) prioritizeStage(next1.id);
    const next2 = stages[clamped + 2];
    if (next2) prioritizeStage(next2.id);

    const isCached = isStageGeomCached(stage.id);

    // Only mark pending in UI if not yet cached AND user is manually navigating (never during smooth playback)
    if (!isCached && !state.isPlaying) {
      pendingStageIndex = clamped;
      isStageLoading = true;
      syncUI();
    }

    try {
      await loadAndDisplayStage(stage, clamped);
    } finally {
      pendingStageIndex = null;
      isStageLoading = false;
      syncUI();
    }

    // Fire prefetch for subsequent stages
    if (next1) prefetchStageModels(next1.upper, next1.lower);
    if (next2) prefetchStageModels(next2.upper, next2.lower);
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
    if (!state.isPlaying) {
      state.abortController?.abort();
      state.abortController = new AbortController();
    }

    const isFirstSuccessfulLoad = state.currentIndex === -1;
    const hasRequiredArchLayers = isSingleArchUpper
      ? Boolean(activeUpperId)
      : isSingleArchLower
      ? Boolean(activeLowerId)
      : Boolean(activeUpperId && activeLowerId);

    // ── Ultra-Fast Instant Geometry Swap for Video-Like Fluid Playback & Scrubbing ──
    if (
      !isFirstSuccessfulLoad &&
      transitionDuration <= 0 &&
      viewport.setLayerGeometry &&
      hasRequiredArchLayers
    ) {
      const cached = getCachedStageGeometries(stage.id);
      if (cached) {
        state.abortController = null;
        if (transitionAnimId !== null) {
          cancelAnimationFrame(transitionAnimId);
          transitionAnimId = null;
          if (prevUpperId && caseHasUpper) viewport.removeLayer(prevUpperId);
          if (prevLowerId && caseHasLower) viewport.removeLayer(prevLowerId);
          prevUpperId = null;
          prevLowerId = null;
        }

        const targetUpper = state.attachmentsVisible
          ? cached.upper
          : (cached.upperNoAttachments || cached.upper);
        const targetLower = state.attachmentsVisible
          ? cached.lower
          : (cached.lowerNoAttachments || cached.lower);
        if (!state.contactsActive) {
          clearBiteContacts(targetUpper, targetLower);
        }
        if (targetUpper && activeUpperId) {
          lastValidUpperGeom = targetUpper;
          viewport.setLayerGeometry(activeUpperId, targetUpper);
          viewport.setLayerOpacity(activeUpperId, 1);
        }
        if (targetLower && activeLowerId) {
          lastValidLowerGeom = targetLower;
          viewport.setLayerGeometry(activeLowerId, targetLower);
          viewport.setLayerOpacity(activeLowerId, 1);
        }

        if (displayProgressionIndex === 0) {
          stage1UpperCentroids = cached.upperCentroids;
          stage1LowerCentroids = cached.lowerCentroids;
          upperToothDisplacements = {};
          lowerToothDisplacements = {};
        } else {
          if (stage1UpperCentroids) {
            upperToothDisplacements = computeToothDisplacements(
              stage1UpperCentroids,
              cached.upperCentroids,
            );
          }
          if (stage1LowerCentroids) {
            lowerToothDisplacements = computeToothDisplacements(
              stage1LowerCentroids,
              cached.lowerCentroids,
            );
          }
        }

        state.currentIndex = displayProgressionIndex;
        syncUI();
        refreshMovementDrawer();
        if (state.contactsActive && !isSingleArchUpper && !isSingleArchLower) refreshBiteContacts();
        if (state.overlayActive) setOverlayBlend(state.overlayBlend);
        if (state.iprActive) {
          refreshIprPanel();
          renderIprOverlay();
        }
        if (state.notesOpen) refreshNotesDrawer();
        return;
      }
    }

    // Only show full blocking loading overlay on initial boot.
    // Stage-to-stage navigation stays seamless without any loading popup or jump.
    if (isFirstSuccessfulLoad) {
      state.loading = true;
      syncUI();
    } else if (!state.isPlaying) {
      isStageLoading = true;
      syncUI();
    }
    state.error = null;

    // Load pre-parsed geometries (shared with background prewarmer)
    const geomOutcome = await loadStageGeometries(stage);
    isStageLoading = false;

    if (geomOutcome.ok) {
      const { upperStageNum, lowerStageNum } = getLastKnownValidArchStages();
      if (lowerStageNum !== null && lowerStageNum > 0) {
        const stages = state.manifest.treatmentStages;
        for (let i = lowerStageNum; i < stages.length; i++) {
          const st = stages[i] as any;
          if (st && (!st.lowerStageNumber || st.lowerStageNumber > lowerStageNum)) {
            st.lowerStageNumber = lowerStageNum;
            const donor = stages[lowerStageNum - 1];
            if (donor?.lower) {
              st.lower = { ...donor.lower };
            }
          }
        }
      }
      if (upperStageNum !== null && upperStageNum > 0) {
        const stages = state.manifest.treatmentStages;
        for (let i = upperStageNum; i < stages.length; i++) {
          const st = stages[i] as any;
          if (st && (!st.upperStageNumber || st.upperStageNumber > upperStageNum)) {
            st.upperStageNumber = upperStageNum;
            const donor = stages[upperStageNum - 1];
            if (donor?.upper) {
              st.upper = { ...donor.upper };
            }
          }
        }
      }
    }

    if (
      geomOutcome.ok &&
      !isFirstSuccessfulLoad &&
      transitionDuration <= 0 &&
      viewport.setLayerGeometry &&
      hasRequiredArchLayers
    ) {
      state.abortController = null;
      state.loading = false;
      isStageLoading = false;
      if (transitionAnimId !== null) {
        cancelAnimationFrame(transitionAnimId);
        transitionAnimId = null;
        if (prevUpperId && caseHasUpper) viewport.removeLayer(prevUpperId);
        if (prevLowerId && caseHasLower) viewport.removeLayer(prevLowerId);
        prevUpperId = null;
        prevLowerId = null;
      }
      const cached = geomOutcome.geometries;
      const targetUpper = state.attachmentsVisible
        ? cached.upper
        : (cached.upperNoAttachments || cached.upper);
      const targetLower = state.attachmentsVisible
        ? cached.lower
        : (cached.lowerNoAttachments || cached.lower);
      if (!state.contactsActive) {
        clearBiteContacts(targetUpper, targetLower);
      }
      if (targetUpper && activeUpperId) {
        lastValidUpperGeom = targetUpper;
        viewport.setLayerGeometry(activeUpperId, targetUpper);
        viewport.setLayerOpacity(activeUpperId, 1);
      }
      if (targetLower && activeLowerId) {
        lastValidLowerGeom = targetLower;
        viewport.setLayerGeometry(activeLowerId, targetLower);
        viewport.setLayerOpacity(activeLowerId, 1);
      }

      if (displayProgressionIndex === 0) {
        stage1UpperCentroids = cached.upperCentroids;
        stage1LowerCentroids = cached.lowerCentroids;
        upperToothDisplacements = {};
        lowerToothDisplacements = {};
      } else {
        if (stage1UpperCentroids) {
          upperToothDisplacements = computeToothDisplacements(
            stage1UpperCentroids,
            cached.upperCentroids,
          );
        }
        if (stage1LowerCentroids) {
          lowerToothDisplacements = computeToothDisplacements(
            stage1LowerCentroids,
            cached.lowerCentroids,
          );
        }
      }

      state.currentIndex = displayProgressionIndex;
      syncUI();
      refreshMovementDrawer();
      if (state.contactsActive) refreshBiteContacts();
      if (state.overlayActive) setOverlayBlend(state.overlayBlend);
      if (state.iprActive) {
        refreshIprPanel();
        renderIprOverlay();
      }
      if (state.notesOpen) refreshNotesDrawer();
      return;
    }

    let upperGeometry = geomOutcome.ok
      ? (state.attachmentsVisible
          ? geomOutcome.geometries.upper
          : (geomOutcome.geometries.upperNoAttachments || geomOutcome.geometries.upper))
      : undefined;
    let lowerGeometry = geomOutcome.ok
      ? (state.attachmentsVisible
          ? geomOutcome.geometries.lower
          : (geomOutcome.geometries.lowerNoAttachments || geomOutcome.geometries.lower))
      : undefined;
    let upperStl: ArrayBuffer | undefined = undefined;
    let lowerStl: ArrayBuffer | undefined = undefined;

    if (!geomOutcome.ok) {
      if (lastValidUpperGeom || lastValidLowerGeom) {
        upperGeometry = lastValidUpperGeom || undefined;
        lowerGeometry = lastValidLowerGeom || undefined;
      } else {
        state.abortController = null;
        isInitialBoot = false;
        state.loading = false;
        state.error = geomOutcome.reason;
        syncUI();
        return;
      }
    }

    state.abortController = null;
    if (!isInitialBoot) {
      state.loading = false;
    }

    if (isFirstSuccessfulLoad || transitionDuration <= 0) {
      if (transitionAnimId !== null) {
        cancelAnimationFrame(transitionAnimId);
        transitionAnimId = null;
      }

      const hasUpperModel = Boolean(upperGeometry || upperStl);
      const hasLowerModel = Boolean(lowerGeometry || lowerStl);

      if (!isFirstSuccessfulLoad && viewport.setLayerGeometry && hasRequiredArchLayers) {
        if (upperGeometry && activeUpperId) {
          viewport.setLayerGeometry(activeUpperId, upperGeometry);
          viewport.setLayerOpacity(activeUpperId, 1);
        }
        if (lowerGeometry && activeLowerId) {
          viewport.setLayerGeometry(activeLowerId, lowerGeometry);
          viewport.setLayerOpacity(activeLowerId, 1);
        }
      } else {
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

        if (hasUpperModel) {
          const upperOutcome = viewport.addLayer({
            id: activeUpperId,
            label: `${stage.label} - Upper`,
            colour: UPPER_ARCH_COLOUR,
            stl: upperStl || undefined,
            geometry: upperGeometry || undefined,
          });

          if (!upperOutcome.ok) {
            state.error = `Upper jaw: ${upperOutcome.reason}`;
            syncUI();
            return;
          }

          viewport.setLayerVisible(activeUpperId, state.upperVisible);
          viewport.setLayerOpacity(activeUpperId, 1);
        }

        if (hasLowerModel) {
          const lowerOutcome = viewport.addLayer({
            id: activeLowerId,
            label: `${stage.label} - Lower`,
            colour: LOWER_ARCH_COLOUR,
            stl: lowerStl || undefined,
            geometry: lowerGeometry || undefined,
          });

          if (!lowerOutcome.ok) {
            state.error = `Lower jaw: ${lowerOutcome.reason}`;
            syncUI();
            return;
          }

          viewport.setLayerVisible(activeLowerId, state.lowerVisible);
          viewport.setLayerOpacity(activeLowerId, 1);
        }
      }

      if (isFirstSuccessfulLoad) {
        viewport.setView("top");
        viewport.fitAll();
        prewarmAllStageGeometries(state.manifest.treatmentStages);
      }

      // Capture Stage 1 centroids or compute per-tooth displacements for subsequent stages
      if (geomOutcome.ok) {
        if (displayProgressionIndex === 0) {
          stage1UpperCentroids = geomOutcome.geometries.upperCentroids;
          stage1LowerCentroids = geomOutcome.geometries.lowerCentroids;
          upperToothDisplacements = {};
          lowerToothDisplacements = {};
        } else {
          if (stage1UpperCentroids && geomOutcome.geometries.upperCentroids) {
            upperToothDisplacements = computeToothDisplacements(
              stage1UpperCentroids,
              geomOutcome.geometries.upperCentroids,
            );
          }
          if (stage1LowerCentroids && geomOutcome.geometries.lowerCentroids) {
            lowerToothDisplacements = computeToothDisplacements(
              stage1LowerCentroids,
              geomOutcome.geometries.lowerCentroids,
            );
          }
        }
      } else {
        const ug = hasUpperModel ? viewport.getLayerGeometry?.(activeUpperId) : null;
        const lg = hasLowerModel ? viewport.getLayerGeometry?.(activeLowerId) : null;
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
      }

      if (state.contactsActive && !isSingleArchUpper && !isSingleArchLower) refreshBiteContacts();
      if (state.overlayActive) setOverlayBlend(state.overlayBlend);
      if (state.iprActive) {
        refreshIprPanel();
        renderIprOverlay();
      }
    } else {
      // ── Smooth Simultaneous Cross-Dissolve Transition ─────────────────────
      if (transitionAnimId !== null) {
        cancelAnimationFrame(transitionAnimId);
        transitionAnimId = null;
        if (prevUpperId && caseHasUpper) viewport.removeLayer(prevUpperId);
        if (prevLowerId && caseHasLower) viewport.removeLayer(prevLowerId);
      }

      prevUpperId = activeUpperId;
      prevLowerId = activeLowerId;

      layerCounter++;
      const nextUpperId = `${UPPER_ARCH_ID}-${layerCounter}`;
      const nextLowerId = `${LOWER_ARCH_ID}-${layerCounter}`;

      const hasUpperModel = Boolean(upperGeometry || upperStl);
      const hasLowerModel = Boolean(lowerGeometry || lowerStl);

      if (hasUpperModel) {
        const upperOutcome = viewport.addLayer({
          id: nextUpperId,
          label: `${stage.label} - Upper`,
          colour: UPPER_ARCH_COLOUR,
          stl: upperStl || undefined,
          geometry: upperGeometry || undefined,
        });

        if (!upperOutcome.ok) {
          state.error = `Upper jaw: ${upperOutcome.reason}`;
          syncUI();
          return;
        }

        viewport.setLayerVisible(nextUpperId, state.upperVisible);
        viewport.setLayerOpacity(nextUpperId, 0);
        activeUpperId = nextUpperId;
      }

      if (hasLowerModel) {
        const lowerOutcome = viewport.addLayer({
          id: nextLowerId,
          label: `${stage.label} - Lower`,
          colour: LOWER_ARCH_COLOUR,
          stl: lowerStl || undefined,
          geometry: lowerGeometry || undefined,
        });

        if (!lowerOutcome.ok) {
          state.error = `Lower jaw: ${lowerOutcome.reason}`;
          syncUI();
          return;
        }

        viewport.setLayerVisible(nextLowerId, state.lowerVisible);
        viewport.setLayerOpacity(nextLowerId, 0);
        activeLowerId = nextLowerId;
      }

      // Update centroids and per-tooth displacements for the newly loaded stage
      const ug = hasUpperModel ? viewport.getLayerGeometry?.(nextUpperId) : null;
      const lg = hasLowerModel ? viewport.getLayerGeometry?.(nextLowerId) : null;
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
        if (hasUpperModel) {
          if (pUpper) viewport.setLayerOpacity(pUpper, 1 - ease);
          viewport.setLayerOpacity(nextUpperId, ease);
        }
        if (hasLowerModel) {
          if (pLower) viewport.setLayerOpacity(pLower, 1 - ease);
          viewport.setLayerOpacity(nextLowerId, ease);
        }

        if (elapsed < transitionDuration) {
          transitionAnimId = requestAnimationFrame(animate);
        } else {
          transitionAnimId = null;
          if (hasUpperModel) {
            if (pUpper) viewport.removeLayer(pUpper);
            viewport.setLayerOpacity(nextUpperId, 1);
          }
          if (hasLowerModel) {
            if (pLower) viewport.removeLayer(pLower);
            viewport.setLayerOpacity(nextLowerId, 1);
          }
          prevUpperId = null;
          prevLowerId = null;
          if (state.contactsActive && !isSingleArchUpper && !isSingleArchLower) refreshBiteContacts();
          if (state.overlayActive) setOverlayBlend(state.overlayBlend);
          if (state.iprActive) {
            refreshIprPanel();
            renderIprOverlay();
          }
        }
      };

      transitionAnimId = requestAnimationFrame(animate);
    }

    state.currentIndex = displayProgressionIndex;
    syncUI();
    refreshMovementDrawer();
    if (state.iprActive) {
      refreshIprPanel();
      renderIprOverlay();
    }
    if (state.notesOpen) refreshNotesDrawer();
  }

  // ── Clinical Tooth Movements Drawer ─────────────────────────────────────────

  function toggleMovementsDrawer(): void {
    const nextOpen = !state.metricsPanelOpen;
    state.metricsPanelOpen = nextOpen;
    movementDrawerEl.hidden = !nextOpen;
    movementDrawerEl.classList.toggle("tv-drawer--open", nextOpen);
    movementDrawerEl.style.display = nextOpen ? "flex" : "none";
    movementDrawerEl.style.visibility = nextOpen ? "visible" : "hidden";
    movementDrawerEl.style.backdropFilter = nextOpen ? "" : "none";
    (movementDrawerEl.style as any).webkitBackdropFilter = nextOpen ? "" : "none";

    if (nextOpen) {
      if (state.notesOpen) {
        setNotesOpen(false);
      }
      refreshMovementDrawer();
    } else {
      requestAnimationFrame(() => {
        (viewport as any).render?.();
      });
    }
  }

  function refreshMovementDrawer(): void {
    if (!state.metricsPanelOpen) return;

    const stages = state.manifest.treatmentStages;
    const count = stages.length;
    const idx = state.currentIndex;
    const current = stages[idx];

    // Update stage badge
    if (current) {
      const stageNum = current.stageNumber ?? idx + 1;
      movementDrawerStageBadgeEl.textContent =
        idx === 0
          ? `Initial (Stage ${stageNum})`
          : `Stage ${stageNum} of ${count}`;
    }

    // Render tooth rows for upper arch
    const upperItems = getClinicalToothList(true, upperToothDisplacements);
    movementUpperListEl.replaceChildren(
      ...upperItems
        .map(item => buildMovementRow(item.fdi, item.fullLabel, item.displacementMm)),
    );

    // Render tooth rows for lower arch
    const lowerItems = getClinicalToothList(false, lowerToothDisplacements);
    movementLowerListEl.replaceChildren(
      ...lowerItems.map(item => buildMovementRow(item.fdi, item.fullLabel, item.displacementMm)),
    );
  }

  // ── Feature 12: Doctor's Notes & Remarks Drawer ───────────────────────────

  function toggleNotesDrawer(): void {
    setNotesOpen(!state.notesOpen);
  }

  function setNotesOpen(open: boolean): void {
    state.notesOpen = open;
    notesDrawerEl.hidden = !open;
    notesDrawerEl.classList.toggle("tv-drawer--open", open);
    notesDrawerEl.style.display = open ? "flex" : "none";
    notesDrawerEl.style.visibility = open ? "visible" : "hidden";
    notesDrawerEl.style.backdropFilter = open ? "" : "none";
    (notesDrawerEl.style as any).webkitBackdropFilter = open ? "" : "none";

    notesBackdropEl.hidden = !open;
    notesBackdropEl.classList.toggle("tv-backdrop--open", open);
    notesBackdropEl.style.display = open ? "block" : "none";
    notesBackdropEl.style.visibility = open ? "visible" : "hidden";
    notesBackdropEl.style.backdropFilter = open ? "" : "none";
    (notesBackdropEl.style as any).webkitBackdropFilter = open ? "" : "none";

    notesHeaderBtn.classList.toggle("tv-btn--active", open);
    notesHeaderBtn.setAttribute("aria-expanded", String(open));

    if (open) {
      if (state.metricsPanelOpen) {
        state.metricsPanelOpen = false;
        movementDrawerEl.hidden = true;
        movementDrawerEl.classList.remove("tv-drawer--open");
        movementDrawerEl.style.display = "none";
        movementDrawerEl.style.visibility = "hidden";
        movementDrawerEl.style.backdropFilter = "none";
        (movementDrawerEl.style as any).webkitBackdropFilter = "none";
      }
      refreshNotesDrawer();
      const dn = state.manifest.doctorNotes;
      const hasContent = Boolean(
        dn &&
          (dn.general ||
            dn.doctorName ||
            dn.clinicName ||
            (Array.isArray(dn.stageRemarks) && dn.stageRemarks.length > 0)),
      );
      if (!hasContent) {
        void checkFreshNotes();
      }
    } else {
      requestAnimationFrame(() => {
        (viewport as any).render?.();
      });
    }
  }

  function refreshNotesDrawer(): void {
    if (!state.notesOpen) return;
    const notes = state.manifest.doctorNotes;
    const stages = state.manifest.treatmentStages;
    const currentIdx = state.currentIndex;
    const currentStageNum = stages[currentIdx]?.stageNumber ?? (currentIdx + 1);

    // 1. Doctor & Clinic Meta
    notesDrawerDoctorMetaEl.replaceChildren();
    const clinicDisplay = notes?.clinicName || state.manifest.clinicName;
    const demographics = [
      state.manifest.patientSex,
      state.manifest.patientAge != null ? `${state.manifest.patientAge} yrs` : null,
    ]
      .filter(Boolean)
      .join(" · ");

    if (notes?.doctorName || clinicDisplay || notes?.updatedAt || state.manifest.patientId || demographics) {
      const metaRows: HTMLElement[] = [];
      const leftCol = div("tv-notes-meta-left");
      if (notes?.doctorName) {
        leftCol.appendChild(span("tv-notes-doctor-name", notes.doctorName));
      }
      if (clinicDisplay) {
        leftCol.appendChild(span("tv-notes-clinic-name", clinicDisplay));
      }
      if (state.manifest.patientId) {
        leftCol.appendChild(span("tv-notes-patient-id", `Patient ID: ${state.manifest.patientId}`));
      }
      if (demographics) {
        leftCol.appendChild(span("tv-notes-demographics", `Patient: ${demographics}`));
      }
      metaRows.push(leftCol);

      if (notes?.updatedAt) {
        metaRows.push(span("tv-notes-date", `Updated: ${notes.updatedAt}`));
      }
      const card = div("tv-notes-meta-card", metaRows);
      notesDrawerDoctorMetaEl.appendChild(card);
    }

    // 2. Wear guidelines
    notesDrawerGuidelinesEl.replaceChildren();
    if (notes?.wearHoursPerDay || notes?.daysPerStage) {
      const chips: HTMLElement[] = [];
      if (notes.wearHoursPerDay) {
        chips.push(
          div("tv-notes-guideline-chip", [
            span("tv-notes-guideline-label", "Daily Wear"),
            span("tv-notes-guideline-val", `${notes.wearHoursPerDay} hrs / day`),
          ]),
        );
      }
      if (notes.daysPerStage) {
        chips.push(
          div("tv-notes-guideline-chip", [
            span("tv-notes-guideline-label", "Tray Duration"),
            span("tv-notes-guideline-val", `${notes.daysPerStage} days / tray`),
          ]),
        );
      }
      const counts = notes?.aligner_counts;
      const upperStages = counts?.upper ?? state.manifest.upperStagesCount;
      const lowerStages = counts?.lower ?? state.manifest.lowerStagesCount;
      if (upperStages && lowerStages) {
        const isUnequal = upperStages !== lowerStages;
        chips.push(
          div("tv-notes-guideline-chip", [
            span("tv-notes-guideline-label", "Prescribed Trays"),
            span(
              "tv-notes-guideline-val",
              isUnequal
                ? `Upper: ${upperStages} · Lower: ${lowerStages} (${upperStages + lowerStages} Total)`
                : `${upperStages} Each (${upperStages + lowerStages} Total)`,
            ),
          ]),
        );
      }
      notesDrawerGuidelinesEl.appendChild(div("tv-notes-guidelines-wrap", chips));
    } else if (notes?.aligner_counts || (state.manifest.upperStagesCount && state.manifest.lowerStagesCount)) {
      const counts = notes?.aligner_counts;
      const upperStages = counts?.upper ?? state.manifest.upperStagesCount;
      const lowerStages = counts?.lower ?? state.manifest.lowerStagesCount;
      if (upperStages && lowerStages) {
        const isUnequal = upperStages !== lowerStages;
        notesDrawerGuidelinesEl.appendChild(
          div("tv-notes-guidelines-wrap", [
            div("tv-notes-guideline-chip", [
              span("tv-notes-guideline-label", "Prescribed Trays"),
              span(
                "tv-notes-guideline-val",
                isUnequal
                  ? `Upper: ${upperStages} · Lower: ${lowerStages} (${upperStages + lowerStages} Total)`
                  : `${upperStages} Each (${upperStages + lowerStages} Total)`,
              ),
            ]),
          ]),
        );
      }
    }

    // 3. General Treatment Instructions
    notesDrawerGeneralEl.replaceChildren();
    if (notes?.general) {
      const gCard = div("tv-notes-card", [
        div("tv-notes-card__title", ["Treatment Plan Instructions"]),
        div("tv-notes-card__text", [notes.general]),
      ]);
      notesDrawerGeneralEl.appendChild(gCard);
    } else if (!notes?.stageRemarks || notes.stageRemarks.length === 0) {
      const emptyIconEl = document.createElement("div");
      emptyIconEl.className = "tv-notes-empty__icon";
      emptyIconEl.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`;

      const empty = div("tv-notes-empty", [
        emptyIconEl,
        div("tv-notes-empty__title", ["No Treatment Plan Remarks Yet"]),
        div("tv-notes-empty__sub", [
          "The treating doctor has not posted specific remarks for this treatment plan.",
        ]),
      ]);
      notesDrawerGeneralEl.appendChild(empty);
    }

    // 4. Stage Remarks
    notesDrawerStageListEl.replaceChildren();
    const remarks = notes?.stageRemarks || [];
    if (remarks.length > 0) {
      const sorted = [...remarks].sort((a, b) => a.stage - b.stage);
      sorted.forEach((r) => {
        const isCurrent = r.stage === currentStageNum;
        const item = div(
          `tv-notes-stage-item ${isCurrent ? "tv-notes-stage-item--current" : ""}`,
          [
            div("tv-notes-stage-item__badge", [`Stage ${r.stage}`]),
            div("tv-notes-stage-item__text", [r.note]),
          ],
        );
        item.title = `Click to jump to Stage ${r.stage}`;
        item.addEventListener("click", () => {
          const sIdx = stages.findIndex((s) => (s.stageNumber ?? -1) === r.stage);
          if (sIdx !== -1) void navigate(sIdx);
          else if (r.stage <= stages.length) void navigate(r.stage - 1);
        });
        notesDrawerStageListEl.appendChild(item);
      });
    } else {
      const noStageNotes = div("tv-notes-stage-empty", [
        "No stage-specific remarks recorded in treatment plan.",
      ]);
      notesDrawerStageListEl.appendChild(noStageNotes);
    }
  }

  function buildMovementRow(
    fdi: number,
    label: string,
    displacementMm: number,
  ): HTMLDivElement {
    const moved = displacementMm > 0.05; // >0.05mm threshold to mark as "moved"
    const row = div(
      moved ? "tv-movement-row tv-movement-row--moved" : "tv-movement-row",
    );
    const namePart = span("tv-movement-row__name", `#${fdi} ${label}`);
    const deltaPart = span(
      "tv-movement-row__delta",
      moved ? `${displacementMm.toFixed(2)} mm` : "—",
    );
    row.append(namePart, deltaPart);
    return row;
  }

  // ── Feature 8: Contacts Inspection ──────────────────────────────────────────

  function toggleContacts(): void {
    state.contactsActive = !state.contactsActive;
    contactsBtn.classList.toggle("tv-dock-tool-btn--active", state.contactsActive);
    contactsBtn.classList.toggle("tv-ba-btn--active", state.contactsActive);
    if (state.contactsActive) {
      if (!state.upperVisible && !state.lowerVisible) {
        setArchMode("both");
      }
      refreshBiteContacts();
      viewport.setSeparation(0);
      contactsLegendEl.hidden = false;
    } else {
      contactsLegendEl.hidden = true;
      viewport.setSeparation(0);
      const upperGeom = viewport.getLayerGeometry?.(activeUpperId);
      const lowerGeom = viewport.getLayerGeometry?.(activeLowerId);
      clearBiteContacts(upperGeom, lowerGeom);
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
    overlayBtn.classList.toggle("tv-dock-tool-btn--active", state.overlayActive);
    overlayBtn.classList.toggle("tv-ba-btn--active", state.overlayActive);
    if (state.overlayActive) {
      overlayPanelEl.hidden = false;
      await loadAndDisplayOverlay();
    } else {
      overlayPanelEl.hidden = true;
      if (caseHasUpper) {
        viewport.removeLayer(GHOST_UPPER_ID);
        viewport.setLayerOpacity(activeUpperId, 1);
      }
      if (caseHasLower) {
        viewport.removeLayer(GHOST_LOWER_ID);
        viewport.setLayerOpacity(activeLowerId, 1);
      }
    }
  }

  function setOverlayBlend(ratio: number): void {
    state.overlayBlend = ratio;
    if (!state.overlayActive) return;
    // ratio 0 = 100% current stage, ratio 1 = 100% initial stage
    const ghostOpacity = (1 - ratio) * 0.7;
    const currentOpacity = Math.max(0.25, ratio);
    if (caseHasUpper) {
      viewport.setLayerOpacity(GHOST_UPPER_ID, ghostOpacity);
      viewport.setLayerOpacity(activeUpperId, currentOpacity);
    }
    if (caseHasLower) {
      viewport.setLayerOpacity(GHOST_LOWER_ID, ghostOpacity);
      viewport.setLayerOpacity(activeLowerId, currentOpacity);
    }
  }

  async function loadAndDisplayOverlay(): Promise<void> {
    if (!state.overlayActive) return;
    const stage1 = state.manifest.treatmentStages[0];
    if (!stage1) return;
    const [outcome, geom1] = await Promise.all([
      loadStageModels(stage1.upper, stage1.lower),
      loadStageGeometries(stage1),
    ]);
    if (!outcome.ok) return;

    if (caseHasUpper && (outcome.models.upperStl || (geom1.ok && geom1.geometries.upper))) {
      const gUpper = geom1.ok && geom1.geometries.upper
        ? (state.attachmentsVisible ? geom1.geometries.upper : (geom1.geometries.upperNoAttachments || geom1.geometries.upper))
        : undefined;
      viewport.addLayer({
        id: GHOST_UPPER_ID,
        label: "Initial Stage 1 - Upper Ghost",
        colour: GHOST_COLOR,
        stl: outcome.models.upperStl || undefined,
        geometry: gUpper,
      });
      viewport.setLayerVisible(GHOST_UPPER_ID, state.upperVisible);
    }

    if (caseHasLower && (outcome.models.lowerStl || (geom1.ok && geom1.geometries.lower))) {
      const gLower = geom1.ok && geom1.geometries.lower
        ? (state.attachmentsVisible ? geom1.geometries.lower : (geom1.geometries.lowerNoAttachments || geom1.geometries.lower))
        : undefined;
      viewport.addLayer({
        id: GHOST_LOWER_ID,
        label: "Initial Stage 1 - Lower Ghost",
        colour: GHOST_COLOR,
        stl: outcome.models.lowerStl || undefined,
        geometry: gLower,
      });
      viewport.setLayerVisible(GHOST_LOWER_ID, state.lowerVisible);
    }

    setOverlayBlend(state.overlayBlend);
  }

  // ── Feature 10: Orthodontic Attachments Visibility Toggle ──────────────────

  function toggleAttachments(): void {
    setAttachmentsVisible(!state.attachmentsVisible);
  }

  function setAttachmentsVisible(visible: boolean): void {
    state.attachmentsVisible = visible;
    attachmentsBtn.classList.toggle("tv-dock-tool-btn--active", visible);
    attachmentsBtn.classList.toggle("tv-ba-btn--active", visible);
    attachmentsBtn.setAttribute("aria-pressed", String(visible));
    refreshActiveStageGeometries();
  }

  function refreshActiveStageGeometries(): void {
    if (state.currentIndex < 0 || state.currentIndex >= state.manifest.treatmentStages.length) return;
    const stage = state.manifest.treatmentStages[state.currentIndex];
    if (!stage) return;
    const cached = getCachedStageGeometries(stage.id);
    if (!cached) return;

    const targetUpper = state.attachmentsVisible
      ? cached.upper
      : (cached.upperNoAttachments || cached.upper);
    const targetLower = state.attachmentsVisible
      ? cached.lower
      : (cached.lowerNoAttachments || cached.lower);

    if (!state.contactsActive) {
      clearBiteContacts(targetUpper, targetLower);
    }

    if (targetUpper && activeUpperId && viewport.setLayerGeometry) {
      viewport.setLayerGeometry(activeUpperId, targetUpper);
      if (prevUpperId) viewport.setLayerGeometry(prevUpperId, targetUpper);
    }
    if (targetLower && activeLowerId && viewport.setLayerGeometry) {
      viewport.setLayerGeometry(activeLowerId, targetLower);
      if (prevLowerId) viewport.setLayerGeometry(prevLowerId, targetLower);
    }

    if (state.contactsActive) refreshBiteContacts();
    if (state.overlayActive) {
      const stage1 = state.manifest.treatmentStages[0];
      if (stage1) {
        const cached1 = getCachedStageGeometries(stage1.id);
        if (cached1) {
          const ghostUpper = state.attachmentsVisible
            ? cached1.upper
            : (cached1.upperNoAttachments || cached1.upper);
          const ghostLower = state.attachmentsVisible
            ? cached1.lower
            : (cached1.lowerNoAttachments || cached1.lower);
          if (ghostUpper && viewport.setLayerGeometry) viewport.setLayerGeometry(GHOST_UPPER_ID, ghostUpper);
          if (ghostLower && viewport.setLayerGeometry) viewport.setLayerGeometry(GHOST_LOWER_ID, ghostLower);
        }
      }
      setOverlayBlend(state.overlayBlend);
    }
  }

  // ── Feature 11: Interproximal Reduction (IPR) Toggle & Display ────────────

  let iprAnimFrameId: number | null = null;

  function toggleIpr(): void {
    setIprActive(!state.iprActive);
  }

  function setIprActive(active: boolean): void {
    state.iprActive = active;
    iprBtn.classList.toggle("tv-dock-tool-btn--active", active);
    iprBtn.classList.toggle("tv-ba-btn--active", active);
    iprBtn.setAttribute("aria-pressed", String(active));
    iprLegendEl.hidden = !active;

    if (active) {
      refreshIprPanel();
      startIprLoop();
      renderIprOverlay();
      if (!state.manifest.ipr || state.manifest.ipr.length === 0) {
        void checkFreshIpr();
      }
    } else {
      stopIprLoop();
    }
  }

  async function checkFreshIpr(): Promise<void> {
    const caseId = state.manifest.caseId;
    if (!caseId) return;

    try {
      // 1. Try public storage manifest with cache buster
      const storageUrl = `https://yrjulcwnabnhgtqebrtn.supabase.co/storage/v1/object/public/treatment-models/${caseId}/manifest.json?t=${Date.now()}`;
      const pubRes = await fetch(storageUrl, { cache: "no-store" });
      if (pubRes.ok) {
        const pubManifest = await pubRes.json();
        if (Array.isArray(pubManifest.ipr) && pubManifest.ipr.length > 0) {
          (state.manifest as any).ipr = pubManifest.ipr;
          refreshIprPanel();
          renderIprOverlay();
          return;
        }
      }

      // 2. Try API route fallback
      const apiRes = await fetch(`/api/cases/${caseId}/ipr?t=${Date.now()}`, { cache: "no-store" });
      if (apiRes.ok) {
        const data = await apiRes.json();
        if (Array.isArray(data.ipr) && data.ipr.length > 0) {
          (state.manifest as any).ipr = data.ipr;
          refreshIprPanel();
          renderIprOverlay();
        }
      }
    } catch {
      // Non-blocking background check
    }
  }

  async function checkFreshNotes(): Promise<void> {
    const caseId = state.manifest.caseId;
    if (!caseId) return;

    try {
      // 1. Try public storage manifest with cache buster
      const storageUrl = `https://yrjulcwnabnhgtqebrtn.supabase.co/storage/v1/object/public/treatment-models/${caseId}/manifest.json?t=${Date.now()}`;
      const pubRes = await fetch(storageUrl, { cache: "no-store" });
      if (pubRes.ok) {
        const pubManifest = await pubRes.json();
        const dn = pubManifest.doctorNotes;
        if (
          dn &&
          (dn.general ||
            dn.doctorName ||
            dn.clinicName ||
            (Array.isArray(dn.stageRemarks) && dn.stageRemarks.length > 0))
        ) {
          (state.manifest as any).doctorNotes = dn;
          if (state.notesOpen) refreshNotesDrawer();
          syncUI();
          return;
        }
      }

      // 2. Try API route fallback (queries Postgres cases.doctor_notes directly)
      const apiRes = await fetch(`/api/cases/${caseId}/notes?t=${Date.now()}`, {
        cache: "no-store",
      });
      if (apiRes.ok) {
        const data = await apiRes.json();
        const dn = data.doctorNotes;
        if (
          dn &&
          (dn.general ||
            dn.doctorName ||
            dn.clinicName ||
            (Array.isArray(dn.stageRemarks) && dn.stageRemarks.length > 0))
        ) {
          (state.manifest as any).doctorNotes = dn;
          if (state.notesOpen) refreshNotesDrawer();
          syncUI();
        }
      }
    } catch {
      // Non-blocking background check
    }
  }

  function refreshIprPanel(): void {
    iprLegendBodyEl.replaceChildren();
    const allIpr: readonly IprEntry[] = state.manifest.ipr || [];
    if (allIpr.length === 0) {
      const empty = div("tv-ipr-empty", [
        span("", "No IPR prescribed for this treatment case."),
      ]);
      iprLegendBodyEl.appendChild(empty);
      return;
    }

    const currentStageNum =
      state.manifest.treatmentStages[state.currentIndex]?.stageNumber ??
      (state.currentIndex + 1);
    const totalMm = allIpr.reduce((sum, item) => sum + (item.amountMm || 0), 0);

    const summaryEl = div("tv-ipr-legend__summary", [
      span("tv-ipr-legend__count", `${allIpr.length} planned reductions`),
      span("tv-ipr-legend__total", `Total: ${totalMm.toFixed(2)} mm`),
    ]);
    iprLegendBodyEl.appendChild(summaryEl);

    const tableEl = document.createElement("table");
    tableEl.className = "tv-ipr-table";
    const tbody = document.createElement("tbody");

    const sorted = [...allIpr].sort((a, b) => a.stage - b.stage || a.toothA - b.toothA);
    for (const item of sorted) {
      const isCurrentStage = item.stage === currentStageNum;
      const tr = document.createElement("tr");
      tr.className = `tv-ipr-row ${isCurrentStage ? "tv-ipr-row--current" : ""}`;
      tr.title = `Click to navigate to Stage ${item.stage}`;
      tr.addEventListener("click", () => {
        const stageIdx = state.manifest.treatmentStages.findIndex(
          (s) => (s.stageNumber ?? -1) === item.stage,
        );
        if (stageIdx !== -1) void navigate(stageIdx);
        else if (item.stage <= state.manifest.treatmentStages.length) void navigate(item.stage - 1);
      });

      const tdStage = document.createElement("td");
      tdStage.className = "tv-ipr-td-stage";
      tdStage.textContent = item.stage === 1 ? "Stage 1 (Initial)" : `Stage ${item.stage}`;

      const tdContact = document.createElement("td");
      tdContact.className = "tv-ipr-td-contact";
      tdContact.textContent = `${item.arch === "upper" ? "Upper" : "Lower"} ${item.contact}`;

      const tdAmount = document.createElement("td");
      tdAmount.className = "tv-ipr-td-amount";
      tdAmount.textContent = `${item.amountMm.toFixed(2)} mm`;

      tr.append(tdStage, tdContact, tdAmount);
      tbody.appendChild(tr);
    }
    tableEl.appendChild(tbody);
    iprLegendBodyEl.appendChild(tableEl);
  }

  function renderIprOverlay(): void {
    iprSvgOverlay.replaceChildren();
    if (!state.iprActive || !viewport.projectPoint) return;

    const allIpr = state.manifest.ipr || [];
    if (allIpr.length === 0) return;

    const currentStage = state.manifest.treatmentStages[state.currentIndex];
    const currentStageNum = currentStage?.stageNumber ?? (state.currentIndex + 1);
    const activeItems = allIpr.filter((item) => item.stage === currentStageNum);
    if (activeItems.length === 0) return;

    // Use precomputed stage centroids for instant 60 FPS performance without vertex re-scanning
    const cachedGeoms = currentStage ? getCachedStageGeometries(currentStage.id) : null;
    const currentUpperCentroids = cachedGeoms?.upperCentroids || stage1UpperCentroids;
    const currentLowerCentroids = cachedGeoms?.lowerCentroids || stage1LowerCentroids;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    iprSvgOverlay.setAttribute("viewBox", `0 0 ${width} ${height}`);

    // Reusable crisp SVG arrow marker
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", "ipr-arrow-marker");
    marker.setAttribute("viewBox", "0 0 10 10");
    marker.setAttribute("refX", "7");
    marker.setAttribute("refY", "5");
    marker.setAttribute("markerWidth", "6");
    marker.setAttribute("markerHeight", "6");
    marker.setAttribute("orient", "auto");
    const markerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    markerPath.setAttribute("d", "M 0 1.5 L 8 5 L 0 8.5 z");
    markerPath.setAttribute("fill", "#38bdf8");
    marker.appendChild(markerPath);
    defs.appendChild(marker);
    iprSvgOverlay.appendChild(defs);

    for (const item of activeItems) {
      const isUpper = item.arch === "upper" || item.toothA < 30;
      if (isUpper && !state.upperVisible) continue;
      if (!isUpper && !state.lowerVisible) continue;

      const pt = getContactPoint(
        item.toothA,
        item.toothB,
        currentUpperCentroids || undefined,
        currentLowerCentroids || undefined,
      );
      if (!pt) continue;

      // Project point taking into account the active arch layer world matrix
      const layerId = isUpper ? activeUpperId : activeLowerId;
      const proj = viewport.projectPoint({ x: pt[0], y: pt[1], z: pt[2] }, layerId || undefined);
      if (!proj || !proj.visible) continue;
      // Do not render if projected point is far outside screen
      if (proj.x < -60 || proj.x > width + 60 || proj.y < -60 || proj.y > height + 60) continue;

      const offsetY = isUpper ? -68 : 68;
      const lateralDir = pt[0] >= 0 ? 1 : -1;
      const fanX = lateralDir * 36;

      // Anchor badge directly relative to projected 3D contact point so they move synchronously on pan/orbit
      const bx = proj.x + fanX;
      const by = proj.y + offsetY;

      // Calculate directional vector from badge to tooth contact point
      const dx = proj.x - bx;
      const dy = proj.y - by;
      const dist = Math.hypot(dx, dy);
      const nx = dist > 0 ? dx / dist : 0;
      const ny = dist > 0 ? dy / dist : 0;
      const startX = bx + nx * 14;
      const startY = by + ny * 14;

      // Leader line with clinical directional arrow pointing right into interdental contact
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", String(startX));
      line.setAttribute("y1", String(startY));
      line.setAttribute("x2", String(proj.x));
      line.setAttribute("y2", String(proj.y));
      line.setAttribute("stroke", "#38bdf8");
      line.setAttribute("stroke-width", "2");
      line.setAttribute("stroke-dasharray", "4,2");
      line.setAttribute("marker-end", "url(#ipr-arrow-marker)");
      line.setAttribute("filter", "drop-shadow(0 1px 2px rgba(0,0,0,0.65))");
      iprSvgOverlay.appendChild(line);

      // Contact point anchor dot firmly positioned on 3D tooth interproximal gap
      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("cx", String(proj.x));
      dot.setAttribute("cy", String(proj.y));
      dot.setAttribute("r", "3");
      dot.setAttribute("fill", "#38bdf8");
      dot.setAttribute("stroke", "#ffffff");
      dot.setAttribute("stroke-width", "1.5");
      dot.setAttribute("filter", "drop-shadow(0 1px 3px rgba(0,0,0,0.7))");
      iprSvgOverlay.appendChild(dot);

      // Diamond Badge (enlarged & clinical contrast blue, follows tooth on pan/orbit)
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("transform", `translate(${bx}, ${by})`);
      g.setAttribute("class", "tv-ipr-badge");
      g.style.cursor = "pointer";
      g.style.pointerEvents = "auto";

      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", "-14");
      rect.setAttribute("y", "-14");
      rect.setAttribute("width", "28");
      rect.setAttribute("height", "28");
      rect.setAttribute("rx", "4.5");
      rect.setAttribute("transform", "rotate(45)");
      rect.setAttribute("fill", "#2563eb");
      rect.setAttribute("stroke", "#ffffff");
      rect.setAttribute("stroke-width", "1.8");
      rect.setAttribute("filter", "drop-shadow(0 3px 6px rgba(0,0,0,0.55)) drop-shadow(0 1px 3px rgba(37,99,235,0.45))");

      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "central");
      text.setAttribute("font-family", "system-ui, -apple-system, sans-serif");
      text.setAttribute("font-size", "13");
      text.setAttribute("font-weight", "800");
      text.setAttribute("letter-spacing", "-0.3px");
      text.setAttribute("fill", "#ffffff");
      const valStr = (Number.isInteger(item.amountMm * 10) ? item.amountMm.toFixed(1) : item.amountMm.toFixed(2)).replace(/^0/, "");
      text.textContent = valStr;

      g.append(rect, text);

      g.addEventListener("mouseenter", () => {
        tooltipBadgeEl.textContent = `IPR ${item.amountMm.toFixed(2)} mm`;
        tooltipNotationEl.textContent = `Stage ${item.stage}`;
        tooltipQuadrantEl.textContent = isUpper ? "Upper Arch (Maxilla)" : "Lower Arch (Mandible)";
        tooltipNameEl.textContent = `Contact Tooth ${item.contact}`;
        tooltipDeltaEl.textContent = `Reduction: ${item.amountMm.toFixed(2)} mm`;
        toothTooltipEl.style.left = `${Math.max(10, Math.min(window.innerWidth - 250, bx - 120))}px`;
        const tooltipTop = isUpper
          ? (by - 75 < 60 ? by + 28 : by - 75)
          : (by + 28 > window.innerHeight - 120 ? by - 75 : by + 28);
        toothTooltipEl.style.top = `${tooltipTop}px`;
        toothTooltipEl.hidden = false;
      });
      g.addEventListener("mouseleave", () => {
        toothTooltipEl.hidden = true;
      });

      iprSvgOverlay.appendChild(g);
    }
  }

  function startIprLoop(): void {
    if (iprAnimFrameId !== null) return;
    function step() {
      if (!state.iprActive) {
        iprAnimFrameId = null;
        return;
      }
      renderIprOverlay();
      iprAnimFrameId = requestAnimationFrame(step);
    }
    iprAnimFrameId = requestAnimationFrame(step);
  }

  function stopIprLoop(): void {
    if (iprAnimFrameId !== null) {
      cancelAnimationFrame(iprAnimFrameId);
      iprAnimFrameId = null;
    }
    iprSvgOverlay.replaceChildren();
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
    state.manifest = normalizeManifestStages(newManifest);
    state.currentIndex = -1;
    state.activeTemplateStage = null;
    // Reset initial-stage tooth centroids so hover delta recalculates for the new case.
    stage1UpperCentroids = null;
    stage1LowerCentroids = null;
    upperToothDisplacements = null;
    lowerToothDisplacements = null;
    lastValidUpperGeom = null;
    lastValidLowerGeom = null;


    // Update slider limits dynamically
    sliderEl.max = String(Math.max(1, newManifest.treatmentStages.length));
    sliderEl.value = "1";

    // Update patient brand in header
    const patientNameEl = root.querySelector(".tv-header__patient-name");
    if (patientNameEl) {
      const pName = newManifest.patientName ?? newManifest.caseId;
      patientNameEl.textContent = newManifest.patientId
        ? `${pName} (#${newManifest.patientId})`
        : pName;
    }

    // Rebuild dots and sidebar for the new case
    rebuildScrubberDots();
    rebuildSidebar();

    // Report ambiguities if any exist
    if (newManifest.ambiguities.length > 0) {
      ambiguityBannerEl.textContent = `${newManifest.ambiguities.length} pairing ambiguity detected: ${newManifest.ambiguities[0]}`;
      ambiguityBannerEl.hidden = false;
    } else {
      ambiguityBannerEl.hidden = true;
    }

    if (newManifest.treatmentStages.length > 0) {
      await bootInitialCase(newManifest.treatmentStages);
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
    const targetIdx = pendingStageIndex ?? state.currentIndex;
    const stages = state.manifest.treatmentStages;
    let bufferedCount = 0;

    const dots = scrubberDotsContainer.querySelectorAll<HTMLButtonElement>(".tv-scrubber-dot");
    dots.forEach((dot, idx) => {
      const stage = stages[idx];
      const isBuffered = Boolean(stage && isStageGeomCached(stage.id));
      if (isBuffered) bufferedCount++;

      dot.classList.toggle("tv-scrubber-dot--buffered", isBuffered);
      dot.classList.toggle("tv-scrubber-dot--active", idx === targetIdx);
      dot.classList.toggle("tv-scrubber-dot--passed", idx < targetIdx);
      dot.classList.toggle(
        "tv-scrubber-dot--loading",
        !state.isPlaying && idx === pendingStageIndex && pendingStageIndex !== state.currentIndex,
      );
    });

    if (count > 1 && targetIdx >= 0) {
      const pct = (targetIdx / (count - 1)) * 100;
      scrubberFillEl.style.width = `${pct}%`;
    } else {
      scrubberFillEl.style.width = "0%";
    }

    // YouTube-style timeline buffer bar: indicates prewarmed geometry in RAM
    if (count > 0) {
      const bufferPct = Math.min(100, Math.round((bufferedCount / count) * 100));
      scrubberBufferEl.style.width = `${bufferPct}%`;
      scrubberBufferEl.title = `Preloaded stages: ${bufferedCount} / ${count} (${bufferPct}%)`;
    } else {
      scrubberBufferEl.style.width = "0%";
    }
  }

  function rebuildSidebar(): void {
    sidebarListEl.replaceChildren();
    const count = state.manifest.treatmentStages.length;
    const pName = state.manifest.patientName ?? state.manifest.caseId;
    sidebarPatientNameEl.textContent = state.manifest.patientId
      ? `${pName} (#${state.manifest.patientId})`
      : pName;

    const demographics = [
      state.manifest.patientSex,
      state.manifest.patientAge != null ? `${state.manifest.patientAge} yrs` : null,
    ]
      .filter(Boolean)
      .join(" · ");
    if (demographics) {
      sidebarPatientDemographicsEl.textContent = demographics;
      sidebarPatientDemographicsEl.hidden = false;
    } else {
      sidebarPatientDemographicsEl.hidden = true;
    }

    sidebarStageCountEl.textContent = `${count} ${count === 1 ? "Stage" : "Stages"}`;

    state.manifest.treatmentStages.forEach((stg, idx) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "tv-stage-card";
      card.title = `Go to ${stg.label}`;
      const thumb = div("tv-stage-card__thumb", [String(stg.stageNumber ?? idx + 1)]);

      const { upperNum, lowerNum, hasMismatch } = getArchStageNumbers(stg);
      const metaText = hasMismatch
        ? `Upper ${upperNum} · Lower ${lowerNum}`
        : `Stage ${stg.stageNumber ?? idx + 1} of ${count}`;

      const metaEl = div(
        hasMismatch
          ? "tv-stage-card__meta tv-stage-card__meta--mismatch"
          : "tv-stage-card__meta",
        [metaText],
      );

      const info = div("tv-stage-card__info", [
        div("tv-stage-card__label", [stg.label]),
        metaEl,
      ]);
      const pip = div("tv-stage-card__pip");
      card.append(thumb, info, pip);
      card.addEventListener("click", () => {
        stopPlay();
        void navigate(idx);
      });
      sidebarListEl.appendChild(card);
    });
    syncSidebarSelection();
  }

  function syncSidebarSelection(): void {
    const targetIdx = pendingStageIndex ?? state.currentIndex;
    const cards = sidebarListEl.querySelectorAll<HTMLButtonElement>(".tv-stage-card");
    cards.forEach((card, idx) => {
      const isActive = idx === targetIdx;
      card.classList.toggle("tv-stage-card--active", isActive);
      card.classList.toggle(
        "tv-stage-card--loading",
        !state.isPlaying && idx === pendingStageIndex && pendingStageIndex !== state.currentIndex,
      );
      if (isActive && appEl.classList.contains("tv-app--sidebar-open") && typeof card.scrollIntoView === "function") {
        card.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    });
  }

  // ── UI Sync ───────────────────────────────────────────────────────────────

  function syncUI(): void {
    const stages = state.manifest.treatmentStages;
    const count = stages.length;
    const targetIdx = pendingStageIndex ?? state.currentIndex;
    const current = stages[targetIdx];

    if (state.activeTemplateStage) {
      stageLabel.textContent = `${state.activeTemplateStage.label} (Doctor Reference)`;
    } else if (current) {
      const actualNumber = current.stageNumber ?? targetIdx + 1;
      const { upperNum, lowerNum, hasMismatch } = getArchStageNumbers(current);
      let desc = `Stage ${actualNumber} (${targetIdx + 1} of ${count})`;
      if (hasMismatch) {
        if (state.upperVisible && state.lowerVisible) {
          desc = `Stage ${actualNumber} (${targetIdx + 1} of ${count}) · Upper ${upperNum} · Lower ${lowerNum}`;
        } else if (state.upperVisible && !state.lowerVisible) {
          desc = `Stage ${actualNumber} (${targetIdx + 1} of ${count}) · Upper ${upperNum}`;
        } else if (!state.upperVisible && state.lowerVisible) {
          desc = `Stage ${actualNumber} (${targetIdx + 1} of ${count}) · Lower ${lowerNum} (final)`;
        }
      }
      const isLoading = !state.isPlaying && isStageLoading && pendingStageIndex !== null && pendingStageIndex !== state.currentIndex;
      stageLabel.textContent = isLoading
        ? `${desc} · Loading 3D model…`
        : desc;
    } else {
      stageLabel.textContent = `Stage — / ${count}`;
    }

    sliderEl.value = String(targetIdx + 1);
    sliderEl.disabled = Boolean(state.activeTemplateStage);

    prevBtn.disabled =
      targetIdx <= 0 ||
      Boolean(state.activeTemplateStage);
    nextBtn.disabled =
      targetIdx >= count - 1 ||
      Boolean(state.activeTemplateStage);
    playBtn.disabled = Boolean(state.activeTemplateStage);
    circularPlayBtn.disabled = Boolean(state.activeTemplateStage);

    // Sync Before / After buttons
    const isBefore = targetIdx === 0;
    const isAfter = count > 0 && targetIdx === count - 1;
    beforeBtn.classList.toggle("tv-ba-btn--active", isBefore);
    afterBtn.classList.toggle("tv-ba-btn--active", isAfter);

    contactsBtn.classList.toggle("tv-dock-tool-btn--active", state.contactsActive);
    contactsBtn.classList.toggle("tv-ba-btn--active", state.contactsActive);
    overlayBtn.classList.toggle("tv-dock-tool-btn--active", state.overlayActive);
    overlayBtn.classList.toggle("tv-ba-btn--active", state.overlayActive);
    attachmentsBtn.classList.toggle("tv-dock-tool-btn--active", state.attachmentsVisible);
    attachmentsBtn.classList.toggle("tv-ba-btn--active", state.attachmentsVisible);
    attachmentsBtn.setAttribute("aria-pressed", String(state.attachmentsVisible));
    iprBtn.classList.toggle("tv-dock-tool-btn--active", state.iprActive);
    iprBtn.classList.toggle("tv-ba-btn--active", state.iprActive);
    iprBtn.setAttribute("aria-pressed", String(state.iprActive));
    notesHeaderBtn.classList.toggle("tv-btn--active", state.notesOpen);

    const hasNotes = Boolean(
      state.manifest.doctorNotes &&
      (state.manifest.doctorNotes.general || (state.manifest.doctorNotes.stageRemarks && state.manifest.doctorNotes.stageRemarks.length > 0))
    );
    notesHeaderBtn.classList.toggle("tv-btn--has-notes", hasNotes);

    updateScrubberProgress();
    syncSidebarSelection();
    syncArchPillUI();

    if (state.loading) {
      loadingEl.classList.remove("tv-loading--fade-out");
      loadingEl.hidden = false;
    } else if (!loadingEl.hidden) {
      loadingEl.classList.add("tv-loading--fade-out");
      setTimeout(() => {
        if (!state.loading) {
          loadingEl.hidden = true;
          loadingEl.classList.remove("tv-loading--fade-out");
        }
      }, 220);
    }

    if (state.error !== null) {
      statusEl.textContent = state.error;
      statusEl.className = "tv-status tv-status--error";
      statusEl.hidden = false;
    } else if (state.loading) {
      statusEl.textContent = "Loading 3D Models…";
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
      makeBtn("Close", () => backdrop.remove(), "tv-btn--subtle"),
    ]);

    // Ambiguities Section
    const ambiguitySection = div("tv-modal__section");
    if (state.manifest.ambiguities.length > 0) {
      ambiguitySection.append(
        div("tv-modal__subtitle--danger", [
          `Detected Ambiguities (${state.manifest.ambiguities.length}):`,
        ]),
        ...state.manifest.ambiguities.map((a) =>
          div("tv-ambiguity-item", [`• ${a}`]),
        ),
      );
    } else {
      ambiguitySection.append(
        div("tv-modal__subtitle--success", [
          "All treatment stages and arch pairings are validated.",
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
            tpl.upper ? `Upper: ${tpl.upper.filename}` : "Upper: None",
            document.createElement("br"),
            tpl.lower ? `Lower: ${tpl.lower.filename}` : "Lower: None",
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
          stg.upper ? `Upper: ${stg.upper.filename}` : "Upper: None",
          document.createElement("br"),
          stg.lower ? `Lower: ${stg.lower.filename}` : "Lower: None",
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
      "Select STL Files to Ingest & Pair…",
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
            `Ambiguities Detected (${paired.ambiguities.length}):`,
          ]),
          ...paired.ambiguities.map((a) =>
            div("tv-ambiguity-item", [`• ${a}`]),
          ),
        );
      }

      if (paired.treatmentStages.length > 0) {
        const successMsg = div("tv-validation-success", [
          `Successfully paired ${paired.treatmentStages.length} treatment stages (${paired.templateStages.length} template reference scans).`,
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

  // ── Two-Phase Case Prewarming & Auto Load ─────────────────────────────────

  async function bootInitialCase(stages: readonly StageDefinition[]): Promise<void> {
    isInitialBoot = true;
    state.loading = true;
    syncUI();

    try {
      // 1. Kick off concurrent prewarm of all stages in parallel
      const prewarmPromise = prewarmAllStageGeometries(stages);

      // 2. Mount stage 0 into viewport behind loading overlay
      await navigate(0);

      // 3. Wait for all stages to be prewarmed into RAM / GPU cache
      const safetyTimeout = isTestEnv ? 60 : 35000;
      await Promise.race([
        prewarmPromise,
        new Promise<void>((resolve) => setTimeout(resolve, safetyTimeout)),
      ]);

      if (!isTestEnv) {
        updateOptimizationProgress(stages.length, stages.length);
        await new Promise<void>((resolve) => setTimeout(resolve, 200));
      }
    } catch (err) {
      console.warn("Initial boot prewarm warning:", err);
    } finally {
      isInitialBoot = false;
      state.loading = false;
      syncUI();
    }
  }

  if (options.autoLoad !== false && state.manifest.treatmentStages.length > 0) {
    void bootInitialCase(state.manifest.treatmentStages);
  }

  const onStorageSync = (e: StorageEvent): void => {
    if (e.key === "dental_viewer_sync" && e.newValue) {
      try {
        const syncData = JSON.parse(e.newValue);
        if (syncData.caseId === state.manifest.caseId) {
          if (syncData.type === "ipr" || !syncData.type) {
            void checkFreshIpr();
          }
          if (syncData.type === "notes" || !syncData.type) {
            void checkFreshNotes();
          }
        }
      } catch {}
    }
  };
  window.addEventListener("storage", onStorageSync);

  return {
    dispose: () => {
      stopPlay();
      stopIprLoop();
      if (transitionAnimId !== null) {
        cancelAnimationFrame(transitionAnimId);
        transitionAnimId = null;
      }
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("storage", onStorageSync);
      viewport.dispose();
      clearStageGeometryCache();
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
    toggleAttachments,
    setAttachmentsVisible,
    toggleIpr,
    setIprActive,
    toggleNotes: toggleNotesDrawer,
    setNotesOpen,
    cyclePlaybackSpeed,
    setPlaybackSpeed,
    getPlaybackSpeed,
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
  if (text === "3D Treatment Progression") {
    const desktopSpan = document.createElement("span");
    desktopSpan.className = "tv-brand-desktop";
    desktopSpan.textContent = "3D Treatment Progression";
    const mobileSpan = document.createElement("span");
    mobileSpan.className = "tv-brand-mobile";
    mobileSpan.textContent = "3D Progression";
    el.appendChild(desktopSpan);
    el.appendChild(mobileSpan);
  } else {
    el.textContent = text;
  }
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
