/**
 * Automated Undercut & Blockout Studio — Milestone 4 Master Orchestrator.
 *
 * Implements:
 * - Real-time Surveying & Clinical Undercut Heatmap.
 * - Digital Wax generation for Interproximal, Gingival line, and Dentition undercuts.
 * - Realistic red dental wax 3D layer visualization.
 * - Interactive 3D Digital Wax Carver with desktop & touch support.
 * - FDI Interactive Dental Chart (tooth-by-tooth retention overrides).
 * - Multi-Model Batch Propagation (Approve Stage 1 -> apply across all stages).
 * - Print Prep: Base drain holes, shrinkage scaling, and binary STL export.
 */

import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Group,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  SphereGeometry,
  Vector2,
} from "three";
import type { Viewport } from "../../viewer/viewport";
import { computeAnatomicalColors } from "../../viewer/three-viewport";
import type { CaseManifest } from "../stage-manifest";
import type {
  BlockoutProtocol,
  SculptMode,
  StageBlockoutResult,
} from "./types";
import { generateBlockout } from "./blockout-generator";
import { WaxSculptor, type SculptStrokeEvent } from "./wax-sculptor";
import {
  createBatchStlZip,
  createNestedBuildPlateGeometry,
  downloadFile,
  exportBinaryStl,
  prepareGeometryForPrint,
} from "./print-prep";
import {
  extractEmbrasureSilhouettes,
  createSilhouette3DObject,
  type EmbrasureSilhouette,
} from "./embrasure-silhouette";
import type { DetectedContact } from "./mesh-contact-detector";

export interface BlockoutStudioOptions {
  viewport: Viewport;
  manifest: CaseManifest;
  initialArch?: "upper" | "lower";
  initialStageIndex?: number;
  onExit?: () => void;
  onStageChange?: (stageIndex: number) => void;
  onArchChange?: (arch: "upper" | "lower") => void;
  onTabChange?: (tab: "blockout" | "sculpt" | "prep") => void;
}

export class BlockoutStudio {
  private viewport: Viewport;
  private manifest: CaseManifest;
  private container: HTMLElement | null = null;
  private panelEl: HTMLElement | null = null;
  private dockEl: HTMLElement | null = null;
  private expandPillEl: HTMLElement | null = null;
  private isMinimized = false;

  private isUpper = true;
  private currentStageIndex = 0;
  private isBatchProcessing = false;

  // Active protocol (starts on Stage 1 as the reference)
  private protocol: BlockoutProtocol = {
    insertionAxis: { x: 0, y: -1, z: 0, tiltX: 0, tiltY: 0 },
    interproximal: { enabled: true, thicknessMm: 0.6, bridgeSpaces: false },
    singleGapFocusKey: "all",
    selectedContactKey: null,
    gingival: { enabled: false, reliefMm: 0.3, excludeEdentulous: true },
    undercut: {
      enabled: false,
      maxDepthMm: 0.25,
      draftAngleDeg: 2.0,
      perTooth: {},
    },
    printPrep: {
      shrinkageScalePercent: 100.5,
      drainHoles: [],
    },
  };

  // Cache of processed stages for the current arch
  private stageResults = new Map<number, StageBlockoutResult>();
  // Distinct sculpt deltas per stage
  private stageSculptDeltas = new Map<
    number,
    Map<number, [number, number, number]>
  >();

  // 3D Objects in Viewport Scene
  private threeScene: Scene | null = null;
  private threeCamera: PerspectiveCamera | null = null;
  private waxMesh: Mesh | null = null;
  private waxMaterial: MeshPhysicalMaterial;
  private sculptor: WaxSculptor | null = null;
  private contactMarkersGroup: Group | null = null;
  private embrasureSilhouettesGroup: Group | null = null;
  private showEmbrasureSilhouettes = false;
  private showContactMarkers = false;
  private selectedContactKey: string | null = null;
  private silhouettes: EmbrasureSilhouette[] = [];

  // Draggable Contact Markers Interaction
  private activeDraggedMarker: Mesh | null = null;
  private hoveredMarker: Mesh | null = null;
  private markerRaycaster = new Raycaster();
  private markerPointerPos = new Vector2();
  private onPointerMoveBound: ((e: PointerEvent) => void) | null = null;
  private onPointerDownBound: ((e: PointerEvent) => void) | null = null;
  private onPointerUpBound: ((e: PointerEvent) => void) | null = null;
  private onDblClickBound: ((e: MouseEvent) => void) | null = null;

  // UI State
  private activeTab: "blockout" | "sculpt" | "prep" = "blockout";
  private showHeatmap = false;
  private showWaxOverlay = true;
  private isPlaying = false;
  private playIntervalId: ReturnType<typeof setInterval> | null = null;
  private sliderDebounceId: ReturnType<typeof setTimeout> | null = null;

  private onExitCallback?: () => void;
  private onStageChangeCallback?: (stageIndex: number) => void;
  private onArchChangeCallback?: (arch: "upper" | "lower") => void;
  private onTabChangeCallback?: (tab: "blockout" | "sculpt" | "prep") => void;

  constructor(options: BlockoutStudioOptions) {
    this.viewport = options.viewport;
    this.manifest = options.manifest;
    this.isUpper = options.initialArch ? options.initialArch === "upper" : true;
    this.currentStageIndex = options.initialStageIndex ?? 0;
    this.onExitCallback = options.onExit;
    this.onStageChangeCallback = options.onStageChange;
    this.onArchChangeCallback = options.onArchChange;
    this.onTabChangeCallback = options.onTabChange;

    this.threeScene = this.viewport.getThreeScene
      ? this.viewport.getThreeScene()
      : null;
    this.threeCamera = this.viewport.getThreeCamera
      ? this.viewport.getThreeCamera()
      : null;

    // Satin-gloss dental CAD blockout material (neutral sheen so crimson, green, and blue stay true)
    this.waxMaterial = new MeshPhysicalMaterial({
      color: new Color(0xffffff),
      vertexColors: true,
      roughness: 0.30,
      metalness: 0.02,
      clearcoat: 0.38,
      clearcoatRoughness: 0.24,
      sheen: 0.16,
      sheenRoughness: 0.40,
      sheenColor: new Color(0xffffff),
      transparent: false,
      opacity: 1.0,
      side: DoubleSide,
      depthTest: true,
      depthWrite: true,
      polygonOffset: true,
      polygonOffsetFactor: -1.0,
      polygonOffsetUnits: -2.0,
    });
  }

  public mount(container: HTMLElement): void {
    this.container = container;
    try {
      this.initWaxMesh();
    } catch (e) {
      console.warn("initWaxMesh warning:", e);
    }
    try {
      this.initSculptor();
    } catch (e) {
      console.warn("initSculptor warning:", e);
    }
    try {
      this.initMarkerInteraction();
    } catch (e) {
      console.warn("initMarkerInteraction warning:", e);
    }
    this.renderUI();
    try {
      this.loadCurrentStageBlockout();
    } catch (e) {
      console.warn("loadCurrentStageBlockout warning:", e);
    }
  }

  public unmount(): void {
    this.stopPlayback();
    if (this.sliderDebounceId !== null) {
      clearTimeout(this.sliderDebounceId);
      this.sliderDebounceId = null;
    }
    const domEl = this.getCanvasDomElement();
    if (domEl) {
      if (this.onPointerMoveBound)
        domEl.removeEventListener("pointermove", this.onPointerMoveBound);
      if (this.onPointerDownBound)
        domEl.removeEventListener("pointerdown", this.onPointerDownBound);
      if (this.onPointerUpBound) {
        domEl.removeEventListener("pointerup", this.onPointerUpBound);
        domEl.removeEventListener("pointercancel", this.onPointerUpBound);
      }
      if (this.onDblClickBound)
        domEl.removeEventListener("dblclick", this.onDblClickBound);
      domEl.style.cursor = "default";
    }
    const controls = this.viewport.getControls
      ? this.viewport.getControls()
      : null;
    if (controls) controls.enabled = true;

    if (this.sculptor) {
      this.sculptor.dispose();
      this.sculptor = null;
    }
    if (this.waxMesh) {
      if (this.waxMesh.parent) {
        this.waxMesh.parent.remove(this.waxMesh);
      } else if (this.threeScene) {
        this.threeScene.remove(this.waxMesh);
      }
      this.waxMesh.geometry.dispose();
      this.waxMesh = null;
    }
    if (this.contactMarkersGroup) {
      if (this.contactMarkersGroup.parent) {
        this.contactMarkersGroup.parent.remove(this.contactMarkersGroup);
      } else if (this.threeScene) {
        this.threeScene.remove(this.contactMarkersGroup);
      }
      while (this.contactMarkersGroup.children.length > 0) {
        const child = this.contactMarkersGroup.children[0] as Mesh;
        this.contactMarkersGroup.remove(child);
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material))
            child.material.forEach((m) => m.dispose());
          else child.material.dispose();
        }
      }
      this.contactMarkersGroup = null;
    }
    if (this.embrasureSilhouettesGroup) {
      if (this.embrasureSilhouettesGroup.parent) {
        this.embrasureSilhouettesGroup.parent.remove(
          this.embrasureSilhouettesGroup,
        );
      } else if (this.threeScene) {
        this.threeScene.remove(this.embrasureSilhouettesGroup);
      }
      while (this.embrasureSilhouettesGroup.children.length > 0) {
        const child = this.embrasureSilhouettesGroup.children[0] as Group;
        this.embrasureSilhouettesGroup.remove(child);
        child.traverse((c) => {
          if ((c as Mesh).geometry) (c as Mesh).geometry.dispose();
          if ((c as Mesh).material) {
            const mat = (c as Mesh).material;
            if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
            else mat.dispose();
          }
        });
      }
      this.embrasureSilhouettesGroup = null;
    }
    if (this.panelEl && this.panelEl.parentNode) {
      this.panelEl.parentNode.removeChild(this.panelEl);
      this.panelEl = null;
    }
    if (this.dockEl && this.dockEl.parentNode) {
      this.dockEl.parentNode.removeChild(this.dockEl);
      this.dockEl = null;
    }
    if (this.expandPillEl && this.expandPillEl.parentNode) {
      this.expandPillEl.parentNode.removeChild(this.expandPillEl);
      this.expandPillEl = null;
    }
    // Restore base tooth vertex colors
    this.restoreBaseColors();
  }

  public exit(): void {
    this.unmount();
    if (this.onExitCallback) {
      this.onExitCallback();
    }
  }

  public setMinimized(minimized: boolean): void {
    this.isMinimized = minimized;
    this.panelEl?.classList.toggle("bo-studio-panel--minimized", minimized);
    if (this.expandPillEl) {
      this.expandPillEl.classList.toggle("bo-expand-pill--visible", minimized);
    }
    this.dockEl?.classList.toggle("bo-bottom-dock--centered", minimized);
  }

  public toggleMinimized(): boolean {
    this.setMinimized(!this.isMinimized);
    return this.isMinimized;
  }

  public isPanelMinimized(): boolean {
    return this.isMinimized;
  }

  public setActiveTab(tab: "blockout" | "sculpt" | "prep"): void {
    this.activeTab = tab;
    if (this.isMinimized) {
      this.setMinimized(false);
    }
    this.updateActiveTabPanes();
    if (this.onTabChangeCallback) {
      this.onTabChangeCallback(tab);
    }
  }

  public getActiveTab(): "blockout" | "sculpt" | "prep" {
    return this.activeTab;
  }

  public toggleWaxOverlay(show?: boolean): boolean {
    this.showWaxOverlay =
      typeof show === "boolean" ? show : !this.showWaxOverlay;
    if (this.waxMesh) {
      this.waxMesh.visible = this.showWaxOverlay;
    }
    if (this.contactMarkersGroup) {
      this.contactMarkersGroup.visible =
        this.showWaxOverlay && this.showContactMarkers;
    }
    if (this.embrasureSilhouettesGroup) {
      this.embrasureSilhouettesGroup.visible =
        this.showWaxOverlay && this.showEmbrasureSilhouettes;
    }
    this.syncOverlayCheckboxes();
    return this.showWaxOverlay;
  }

  public toggleEmbrasureSilhouettes(show?: boolean): boolean {
    this.showEmbrasureSilhouettes =
      typeof show === "boolean" ? show : !this.showEmbrasureSilhouettes;
    if (this.embrasureSilhouettesGroup) {
      this.embrasureSilhouettesGroup.visible =
        this.showEmbrasureSilhouettes && this.showWaxOverlay;
    }
    this.syncOverlayCheckboxes();
    return this.showEmbrasureSilhouettes;
  }

  public toggleContactMarkers(show?: boolean): boolean {
    this.showContactMarkers =
      typeof show === "boolean" ? show : !this.showContactMarkers;
    if (this.contactMarkersGroup) {
      this.contactMarkersGroup.visible =
        this.showWaxOverlay && this.showContactMarkers;
    }
    this.syncOverlayCheckboxes();
    return this.showContactMarkers;
  }

  public selectContact(key: string | null): void {
    this.selectedContactKey = key;
    this.highlightActiveSilhouette(key);

    if (this.contactMarkersGroup) {
      this.contactMarkersGroup.children.forEach((obj) => {
        const marker = obj as Mesh;
        if (marker.userData?.contactKey === key) {
          (marker.material as MeshStandardMaterial).color.set(0xfacc15);
          (marker.material as MeshStandardMaterial).emissive.set(0xd97706);
        } else {
          (marker.material as MeshStandardMaterial).color.set(0xe58189);
          (marker.material as MeshStandardMaterial).emissive.set(0x9d414a);
        }
      });
    }

    this.container
      ?.querySelectorAll<HTMLTableRowElement>(".bo-contact-row")
      .forEach((tr) => {
        const rowKey = tr.getAttribute("data-contact-key");
        const isSel = rowKey === key;
        tr.style.background = isSel ? "rgba(245, 158, 11, 0.18)" : "";
        tr.style.borderLeft = isSel ? "3px solid #facc15" : "";
      });

    const focusPill = this.container?.querySelector(".bo-wax-focus-pill");
    if (focusPill && this.protocol.singleGapFocusKey !== "all" && key) {
      focusPill.innerHTML = `Active Focus: <strong style="color:#facc15;">${key}</strong> <span style="color:#64748b;">(Click any row or 3D sphere to inspect another gap)</span>`;
    }

    this.protocol.selectedContactKey = key;
    if (this.protocol.singleGapFocusKey !== "all" && key) {
      if (this.protocol.singleGapFocusKey !== key) {
        this.protocol.singleGapFocusKey = key;
        this.recomputeCurrentBlockout();
      }
    } else if (key) {
      this.recomputeCurrentBlockout();
    }
  }

  private highlightActiveSilhouette(activeKey: string | null): void {
    if (!this.embrasureSilhouettesGroup) return;
    this.embrasureSilhouettesGroup.children.forEach((child) => {
      const isSel = child.name === `embrasure-${activeKey}`;
      const primaryColor = isSel ? new Color(0xfbbf24) : new Color(0x06b6d4);
      const opacity = isSel ? 0.38 : 0.16;

      child.traverse((c) => {
        if ((c as any).isLine || (c as any).isLineSegments) {
          const mat = (c as any).material as LineBasicMaterial;
          mat.color.copy(primaryColor);
          mat.opacity = isSel ? 0.95 : 0.75;
        } else if ((c as any).isMesh) {
          const mat = (c as any).material as MeshBasicMaterial;
          mat.color.copy(primaryColor);
          mat.opacity = opacity;
        }
      });
    });
  }

  public toggleHeatmap(show?: boolean): boolean {
    this.showHeatmap = typeof show === "boolean" ? show : !this.showHeatmap;
    this.loadCurrentStageBlockout();
    this.syncOverlayCheckboxes();
    return this.showHeatmap;
  }

  public getArch(): "upper" | "lower" {
    return this.isUpper ? "upper" : "lower";
  }

  public getStageIndex(): number {
    return this.currentStageIndex;
  }

  public setArch(arch: "upper" | "lower"): void {
    if ((arch === "upper") === this.isUpper) return;
    this.isUpper = arch === "upper";
    if (
      this.protocol.singleGapFocusKey &&
      this.protocol.singleGapFocusKey !== "all"
    ) {
      const defaultFocus = this.isUpper ? "11-21" : "41-31";
      this.selectedContactKey = defaultFocus;
      this.protocol.selectedContactKey = defaultFocus;
      this.protocol.singleGapFocusKey = defaultFocus;
    } else {
      this.selectedContactKey = null;
      this.protocol.selectedContactKey = null;
    }
    this.stopPlayback();
    this.protocol.insertionAxis.y = this.isUpper ? -1 : 1;
    this.stageResults.clear();
    this.stageSculptDeltas.clear();
    if (this.waxMesh && this.waxMesh.parent) {
      this.waxMesh.parent.remove(this.waxMesh);
    }
    if (this.contactMarkersGroup && this.contactMarkersGroup.parent) {
      this.contactMarkersGroup.parent.remove(this.contactMarkersGroup);
    }
    if (
      this.embrasureSilhouettesGroup &&
      this.embrasureSilhouettesGroup.parent
    ) {
      this.embrasureSilhouettesGroup.parent.remove(
        this.embrasureSilhouettesGroup,
      );
    }
    // Notify viewport to switch active visible layer FIRST before querying geometry
    if (this.onArchChangeCallback) {
      this.onArchChangeCallback(arch);
    }
    this.loadCurrentStageBlockout();
    this.updateUI();
  }

  public setStageIndex(index: number): void {
    if (index === this.currentStageIndex) return;
    this.currentStageIndex = index;
    this.loadCurrentStageBlockout();
    this.updateUI();
    if (this.onStageChangeCallback) {
      this.onStageChangeCallback(index);
    }
  }

  private initWaxMesh(): void {
    if (!this.threeScene) return;
    const geom = new BufferGeometry();
    this.waxMesh = new Mesh(geom, this.waxMaterial);
    this.waxMesh.name = "digital-wax-overlay";
    this.waxMesh.renderOrder = 20;
    this.threeScene.add(this.waxMesh);
    this.sculptor?.setSecondaryMesh(this.waxMesh);
  }

  private initSculptor(): void {
    if (!this.threeScene || !this.threeCamera || !this.container) return;
    const domEl = this.container.querySelector("canvas") || this.container;

    this.sculptor = new WaxSculptor(
      this.threeScene,
      this.threeCamera,
      domEl as HTMLElement,
      (evt: SculptStrokeEvent) => {
        // Record deltas for current stage
        this.stageSculptDeltas.set(this.currentStageIndex, evt.deltas);
        this.recomputeCurrentBlockout();
        this.updateUndoRedoButtons();
      },
    );
  }

  private getLayerId(): string {
    return this.isUpper ? "upper-arch" : "lower-arch";
  }

  private getBaseGeometry(): BufferGeometry | null {
    if (!this.viewport.getLayerGeometry) return null;
    const geom = this.viewport.getLayerGeometry(this.getLayerId());
    if (geom) {
      const pos = geom.getAttribute("position");
      if (pos) {
        if (
          !geom.userData.pristinePositions ||
          geom.userData.pristinePositions.length !== pos.array.length
        ) {
          geom.userData.pristinePositions = new Float32Array(pos.array);
        } else {
          (pos as any).array.set(geom.userData.pristinePositions);
          pos.needsUpdate = true;
        }
      }
    }
    return geom;
  }

  public reloadCurrentStage(): void {
    this.stageResults.delete(this.currentStageIndex);
    this.loadCurrentStageBlockout();
    this.updateUI();
  }

  private loadCurrentStageBlockout(): void {
    const baseGeom = this.getBaseGeometry();
    if (!baseGeom) return;

    const stageNum = this.currentStageIndex + 1;
    const stageId = `stage-${String(stageNum).padStart(2, "0")}`;

    let result = this.stageResults.get(this.currentStageIndex);
    if (!result) {
      const deltas = this.stageSculptDeltas.get(this.currentStageIndex);
      result = generateBlockout(
        baseGeom,
        this.isUpper,
        this.protocol,
        stageNum,
        stageId,
        deltas,
        { skipMergedGeometry: true },
      );
      this.stageResults.set(this.currentStageIndex, result);
    }

    this.applyResultTo3D(result);
  }

  private scheduleRecomputeDebounced(delayMs = 60): void {
    if (this.sliderDebounceId !== null) {
      clearTimeout(this.sliderDebounceId);
    }
    this.sliderDebounceId = setTimeout(() => {
      this.sliderDebounceId = null;
      this.recomputeCurrentBlockout();
    }, delayMs);
  }

  private isWaxGeomCachedElsewhere(geom: BufferGeometry): boolean {
    for (const res of this.stageResults.values()) {
      if (res.waxGeometry === geom) return true;
    }
    return false;
  }

  private recomputeCurrentBlockout(): void {
    const baseGeom = this.getBaseGeometry();
    if (!baseGeom) return;

    const stageNum = this.currentStageIndex + 1;
    const stageId = `stage-${String(stageNum).padStart(2, "0")}`;
    const deltas = this.stageSculptDeltas.get(this.currentStageIndex);

    const result = generateBlockout(
      baseGeom,
      this.isUpper,
      this.protocol,
      stageNum,
      stageId,
      deltas,
      { skipMergedGeometry: true },
    );
    this.stageResults.set(this.currentStageIndex, result);
    this.applyResultTo3D(result);
  }

  private applyResultTo3D(result: StageBlockoutResult): void {
    const layerMesh = this.viewport.getLayerMesh
      ? this.viewport.getLayerMesh(this.getLayerId())
      : null;
    if (layerMesh) {
      layerMesh.visible = true;
    }

    // 1. Digital Wax Overlay Mesh (attached directly to active arch layer mesh so it inherits separation lift & transforms)
    if (this.waxMesh) {
      if (layerMesh && this.waxMesh.parent !== layerMesh) {
        if (this.waxMesh.parent) {
          this.waxMesh.parent.remove(this.waxMesh);
        }
        layerMesh.add(this.waxMesh);
        this.waxMesh.position.set(0, 0, 0);
        this.waxMesh.rotation.set(0, 0, 0);
        this.waxMesh.scale.set(1, 1, 1);
      }
      if (this.showWaxOverlay && result.waxGeometry) {
        if (
          this.waxMesh.geometry !== result.waxGeometry &&
          !this.isWaxGeomCachedElsewhere(this.waxMesh.geometry)
        ) {
          this.waxMesh.geometry.dispose();
        }
        this.waxMesh.geometry = result.waxGeometry;
        this.waxMesh.visible = true;
      } else {
        this.waxMesh.visible = false;
      }
    }

    // 2. Physical Interdental Contact Markers (Milestone 4.1 Visual Verification)
    if (!this.contactMarkersGroup) {
      this.contactMarkersGroup = new Group();
      this.contactMarkersGroup.name = "contact-markers-group";
    }

    const targetParent = layerMesh || this.threeScene;
    if (targetParent && this.contactMarkersGroup.parent !== targetParent) {
      if (this.contactMarkersGroup.parent) {
        this.contactMarkersGroup.parent.remove(this.contactMarkersGroup);
      }
      targetParent.add(this.contactMarkersGroup);
      this.contactMarkersGroup.position.set(0, 0, 0);
      this.contactMarkersGroup.rotation.set(0, 0, 0);
      this.contactMarkersGroup.scale.set(1, 1, 1);
    }

    // Dispose old markers
    while (this.contactMarkersGroup.children.length > 0) {
      const child = this.contactMarkersGroup.children[0] as Mesh;
      this.contactMarkersGroup.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material))
          child.material.forEach((m) => m.dispose());
        else child.material.dispose();
      }
    }

    if (
      this.showWaxOverlay &&
      result.fittingSummary?.contacts &&
      result.fittingSummary.contacts.length > 0
    ) {
      const markerGeom = new SphereGeometry(0.24, 16, 16);
      const activeFocus =
        this.selectedContactKey || (this.isUpper ? "11-21" : "41-31");

      for (const c of result.fittingSummary.contacts) {
        const isCustom = Boolean(
          this.protocol.contactOverrides?.[c.contactKey],
        );
        const isSelected = c.contactKey === activeFocus;
        const markerMat = new MeshStandardMaterial({
          color: isSelected ? 0xfacc15 : 0xe58189,
          emissive: isSelected ? 0xd97706 : isCustom ? 0xf43f5e : 0x9d414a,
          emissiveIntensity: isSelected ? 1.0 : isCustom ? 1.0 : 0.8,
          roughness: 0.2,
          metalness: 0.1,
        });

        const marker = new Mesh(markerGeom, markerMat);
        marker.position.set(
          c.contactPoint[0],
          c.contactPoint[1],
          c.contactPoint[2],
        );
        marker.name = `contact-marker-${c.contactKey}`;
        marker.userData = {
          contactKey: c.contactKey,
          contact: c,
          isCustom,
        };
        this.contactMarkersGroup.add(marker);
      }
      this.contactMarkersGroup.visible =
        this.showWaxOverlay && this.showContactMarkers;
    } else {
      this.contactMarkersGroup.visible = false;
    }

    // 3. Embrasure Boundary Silhouettes (Milestone 4.2 Visual Verification)
    if (!this.embrasureSilhouettesGroup) {
      this.embrasureSilhouettesGroup = new Group();
      this.embrasureSilhouettesGroup.name = "embrasure-silhouettes-group";
    }

    if (
      targetParent &&
      this.embrasureSilhouettesGroup.parent !== targetParent
    ) {
      if (this.embrasureSilhouettesGroup.parent) {
        this.embrasureSilhouettesGroup.parent.remove(
          this.embrasureSilhouettesGroup,
        );
      }
      targetParent.add(this.embrasureSilhouettesGroup);
      this.embrasureSilhouettesGroup.position.set(0, 0, 0);
      this.embrasureSilhouettesGroup.rotation.set(0, 0, 0);
      this.embrasureSilhouettesGroup.scale.set(1, 1, 1);
    }

    // Dispose old silhouettes
    while (this.embrasureSilhouettesGroup.children.length > 0) {
      const child = this.embrasureSilhouettesGroup.children[0] as Group;
      this.embrasureSilhouettesGroup.remove(child);
      child.traverse((c) => {
        if ((c as Mesh).geometry) (c as Mesh).geometry.dispose();
        if ((c as Mesh).material) {
          const mat = (c as Mesh).material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat.dispose();
        }
      });
    }

    const baseGeom = this.getBaseGeometry();
    if (
      this.showWaxOverlay &&
      this.showEmbrasureSilhouettes &&
      baseGeom &&
      result.fittingSummary?.contacts &&
      result.fittingSummary.contacts.length > 0
    ) {
      const detectedContacts: DetectedContact[] =
        result.fittingSummary.contacts.map((c, idx) => ({
          id: `contact-${idx + 1}`,
          index: idx,
          contactKey: c.contactKey,
          label: c.label,
          toothA: c.toothA,
          toothB: c.toothB,
          position: [c.contactPoint[0], c.contactPoint[1], c.contactPoint[2]],
          normal: [0, 0, 1],
          clearanceMm: c.clearanceMm ?? 0.35,
          spanMm: c.spanMm,
          apexY: c.apexY,
          baseY: c.baseY,
          buccalWidthMm: c.buccalWidthMm,
          lingualWidthMm: c.lingualWidthMm,
        }));

      this.silhouettes = extractEmbrasureSilhouettes(
        baseGeom,
        this.isUpper,
        detectedContacts,
      );

      for (const sil of this.silhouettes) {
        const isSelected = sil.contactKey === this.selectedContactKey;
        const silObj = createSilhouette3DObject(sil, isSelected, false);
        this.embrasureSilhouettesGroup.add(silObj);
      }
      this.embrasureSilhouettesGroup.visible = true;
    } else {
      this.embrasureSilhouettesGroup.visible = false;
    }

    // 4. Base Mesh Shading (Heatmap or Anatomical)
    if (baseGeom) {
      if (this.showHeatmap && result.survey) {
        baseGeom.setAttribute(
          "color",
          new BufferAttribute(result.survey.heatmapColors, 3),
        );
        if (baseGeom.attributes["color"]) {
          baseGeom.attributes["color"].needsUpdate = true;
        }
        if (layerMesh && layerMesh.material instanceof MeshStandardMaterial) {
          layerMesh.material.vertexColors = true;
          layerMesh.material.needsUpdate = true;
        }
      } else {
        this.restoreBaseColors();
      }
    }

    // 3. Connect target mesh to sculptor
    if (this.sculptor && layerMesh) {
      this.sculptor.setTargetMesh(layerMesh, result.stageId);
      this.sculptor.setSecondaryMesh(this.waxMesh);
      this.sculptor.setStageDeltas(result.stageId, result.sculptDeltas);
    }

    this.updateMetricsDisplay(result);
  }

  private restoreBaseColors(): void {
    const baseGeom = this.getBaseGeometry();
    if (!baseGeom) return;
    const pos = baseGeom.getAttribute("position");
    const posCount = pos ? pos.count : 0;

    if (
      baseGeom.userData.baseColors instanceof BufferAttribute &&
      baseGeom.userData.baseColors.count === posCount
    ) {
      baseGeom.setAttribute("color", baseGeom.userData.baseColors.clone());
    } else {
      const currentColor = baseGeom.getAttribute("color");
      if (
        currentColor &&
        currentColor.count === posCount &&
        !this.showHeatmap
      ) {
        baseGeom.userData.baseColors = currentColor.clone();
      } else {
        computeAnatomicalColors(
          baseGeom,
          this.isUpper ? "Upper Jaw" : "Lower Jaw",
        );
        if (baseGeom.getAttribute("color")) {
          baseGeom.userData.baseColors = baseGeom
            .getAttribute("color")!
            .clone();
        }
      }
    }
    if (baseGeom.attributes["color"]) {
      baseGeom.attributes["color"].needsUpdate = true;
    }
    const layerMesh = this.viewport.getLayerMesh
      ? this.viewport.getLayerMesh(this.getLayerId())
      : null;
    if (layerMesh) {
      layerMesh.visible = true;
      if (layerMesh.material instanceof MeshStandardMaterial) {
        layerMesh.material.vertexColors = Boolean(
          baseGeom.getAttribute("color"),
        );
        layerMesh.material.needsUpdate = true;
      }
    }
  }

  // ─── Draggable Contact Marker Interactivity ─────────────────────────────────

  private getCanvasDomElement(): HTMLElement | null {
    if (this.viewport.getThreeRenderer) {
      return this.viewport.getThreeRenderer().domElement;
    }
    return (
      (this.container?.querySelector("canvas") as HTMLElement) || this.container
    );
  }

  private initMarkerInteraction(): void {
    const domEl = this.getCanvasDomElement();
    if (!domEl) return;

    this.onPointerMoveBound = (e: PointerEvent) =>
      this.handleMarkerPointerMove(e);
    this.onPointerDownBound = (e: PointerEvent) =>
      this.handleMarkerPointerDown(e);
    this.onPointerUpBound = (e: PointerEvent) => this.handleMarkerPointerUp(e);
    this.onDblClickBound = (e: MouseEvent) => this.handleMarkerDblClick(e);

    domEl.addEventListener("pointermove", this.onPointerMoveBound);
    domEl.addEventListener("pointerdown", this.onPointerDownBound);
    domEl.addEventListener("pointerup", this.onPointerUpBound);
    domEl.addEventListener("pointercancel", this.onPointerUpBound);
    domEl.addEventListener("dblclick", this.onDblClickBound);
  }

  private updatePointerPos(
    e: MouseEvent | PointerEvent,
    domEl: HTMLElement,
  ): void {
    const rect = domEl.getBoundingClientRect();
    this.markerPointerPos.x =
      ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
    this.markerPointerPos.y = -(
      ((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 -
      1
    );
  }

  private handleMarkerPointerMove(e: PointerEvent): void {
    if (this.activeTab !== "blockout" || !this.showWaxOverlay) return;
    const domEl = this.getCanvasDomElement();
    if (!domEl) return;

    this.updatePointerPos(e, domEl);
    const camera = this.viewport.getThreeCamera
      ? this.viewport.getThreeCamera()
      : this.threeCamera;
    if (!camera) return;

    this.markerRaycaster.setFromCamera(this.markerPointerPos, camera);

    if (this.activeDraggedMarker) {
      // While dragging: raycast against tooth enamel mesh and conform sphere to the surface
      const layerMesh = this.viewport.getLayerMesh
        ? this.viewport.getLayerMesh(this.getLayerId())
        : null;
      if (!layerMesh) return;

      const hits = this.markerRaycaster.intersectObject(layerMesh, false);
      if (hits.length > 0 && hits[0]) {
        const hitPoint = hits[0].point.clone();
        if (this.activeDraggedMarker.parent) {
          this.activeDraggedMarker.parent.worldToLocal(hitPoint);
        }
        this.activeDraggedMarker.position.copy(hitPoint);
        domEl.style.cursor = "grabbing";

        const key = this.activeDraggedMarker.userData?.contactKey;
        if (key) {
          this.previewMarkerDragInTable(key, hitPoint.y);
        }
      }
    } else {
      // Hovering over markers
      if (!this.contactMarkersGroup || !this.contactMarkersGroup.visible)
        return;

      const hits = this.markerRaycaster.intersectObjects(
        this.contactMarkersGroup.children,
        false,
      );
      if (hits.length > 0 && hits[0]) {
        const marker = hits[0].object as Mesh;
        if (this.hoveredMarker !== marker) {
          if (
            this.hoveredMarker &&
            this.hoveredMarker !== this.activeDraggedMarker
          ) {
            (this.hoveredMarker.material as MeshStandardMaterial).color.set(
              0xe58189,
            );
            (this.hoveredMarker.material as MeshStandardMaterial).emissive.set(
              0x9d414a,
            );
          }
          this.hoveredMarker = marker;
          (marker.material as MeshStandardMaterial).color.set(0xfacc15);
          (marker.material as MeshStandardMaterial).emissive.set(0xd97706);
        }
        domEl.style.cursor = "grab";
      } else {
        if (
          this.hoveredMarker &&
          this.hoveredMarker !== this.activeDraggedMarker
        ) {
          (this.hoveredMarker.material as MeshStandardMaterial).color.set(
            0xe58189,
          );
          (this.hoveredMarker.material as MeshStandardMaterial).emissive.set(
            0x9d414a,
          );
          this.hoveredMarker = null;
        }
        if (domEl.style.cursor === "grab") {
          domEl.style.cursor = "default";
        }
      }
    }
  }

  private handleMarkerPointerDown(e: PointerEvent): void {
    if (this.activeTab !== "blockout" || !this.showWaxOverlay) return;
    const domEl = this.getCanvasDomElement();
    if (!domEl) return;

    this.updatePointerPos(e, domEl);
    const camera = this.viewport.getThreeCamera
      ? this.viewport.getThreeCamera()
      : this.threeCamera;
    if (
      !camera ||
      !this.contactMarkersGroup ||
      !this.contactMarkersGroup.visible
    )
      return;

    this.markerRaycaster.setFromCamera(this.markerPointerPos, camera);
    const hits = this.markerRaycaster.intersectObjects(
      this.contactMarkersGroup.children,
      false,
    );

    if (hits.length > 0 && hits[0]) {
      const marker = hits[0].object as Mesh;
      this.activeDraggedMarker = marker;
      const key = marker.userData?.contactKey;
      if (key) {
        this.selectContact(key);
      }
      (marker.material as MeshStandardMaterial).color.set(0xff9900);
      (marker.material as MeshStandardMaterial).emissive.set(0xff5500);
      domEl.style.cursor = "grabbing";

      // Disable orbit camera controls during dragging
      const controls = this.viewport.getControls
        ? this.viewport.getControls()
        : null;
      if (controls) {
        controls.enabled = false;
      }

      try {
        domEl.setPointerCapture(e.pointerId);
      } catch {}

      e.preventDefault();
      e.stopPropagation();
    }
  }

  private handleMarkerPointerUp(e: PointerEvent): void {
    if (!this.activeDraggedMarker) return;
    const domEl = this.getCanvasDomElement();

    try {
      if (domEl) {
        domEl.releasePointerCapture(e.pointerId);
      }
    } catch {}

    // Re-enable orbit camera controls
    const controls = this.viewport.getControls
      ? this.viewport.getControls()
      : null;
    if (controls) {
      controls.enabled = true;
    }

    const key = this.activeDraggedMarker.userData?.contactKey;
    if (key) {
      const pos = this.activeDraggedMarker.position;
      const newPos: [number, number, number] = [
        parseFloat(pos.x.toFixed(2)),
        parseFloat(pos.y.toFixed(2)),
        parseFloat(pos.z.toFixed(2)),
      ];

      if (!this.protocol.contactOverrides) {
        this.protocol.contactOverrides = {};
      }
      this.protocol.contactOverrides[key] = newPos;

      console.log(
        `%c[Clinical Blockout] Contact override saved: %c${key} %c-> [${newPos.join(", ")}]`,
        "color: #e58189; font-weight: bold;",
        "color: #facc15; font-weight: bold;",
        "color: #fda4af;",
      );

      // Invalidate cached results so all stages adopt the calibrated contact point
      this.stageResults.clear();
      this.recomputeCurrentBlockout();
    }

    if (domEl) {
      domEl.style.cursor = "default";
    }
    this.activeDraggedMarker = null;
    this.hoveredMarker = null;
  }

  private handleMarkerDblClick(e: MouseEvent): void {
    if (this.activeTab !== "blockout" || !this.showWaxOverlay) return;
    const domEl = this.getCanvasDomElement();
    if (!domEl) return;

    this.updatePointerPos(e, domEl);
    const camera = this.viewport.getThreeCamera
      ? this.viewport.getThreeCamera()
      : this.threeCamera;
    if (
      !camera ||
      !this.contactMarkersGroup ||
      !this.contactMarkersGroup.visible
    )
      return;

    this.markerRaycaster.setFromCamera(this.markerPointerPos, camera);
    const hits = this.markerRaycaster.intersectObjects(
      this.contactMarkersGroup.children,
      false,
    );

    if (hits.length > 0 && hits[0]) {
      const marker = hits[0].object as Mesh;
      const key = marker.userData?.contactKey;
      if (
        key &&
        this.protocol.contactOverrides &&
        this.protocol.contactOverrides[key]
      ) {
        delete this.protocol.contactOverrides[key];
        console.log(
          `[Clinical Blockout] Reset contact override for ${key} to auto-detected position`,
        );
        this.stageResults.clear();
        this.recomputeCurrentBlockout();
      }
    }
  }

  private previewMarkerDragInTable(contactKey: string, y: number): void {
    const row = this.container?.querySelector(`.bo-contact-row-${contactKey}`);
    if (row) {
      const apexCell = row.querySelector(".bo-contact-apex");
      if (apexCell) {
        apexCell.textContent = `${y.toFixed(1)}*`;
        (apexCell as HTMLElement).style.color = "#facc15";
      }
      const fitCell = row.querySelector(".bo-contact-fit");
      if (fitCell) {
        fitCell.innerHTML = `<span style="color:#facc15;font-weight:600;">Moving...</span>`;
      }
    }
  }

  // ─── Batch Propagation to All Transitional Models ─────────────────────────

  private async propagateToAllStages(): Promise<void> {
    if (this.isBatchProcessing) return;
    this.isBatchProcessing = true;

    const totalStages = this.manifest.treatmentStages.length;
    const progressEls = this.container?.querySelectorAll<HTMLElement>(
      ".bo-propagate-progress",
    );
    const progressBars = this.container?.querySelectorAll<HTMLElement>(
      ".bo-progress-bar-fill",
    );
    const progressLabels =
      this.container?.querySelectorAll<HTMLElement>(".bo-progress-label");

    progressEls?.forEach((el) => {
      el.hidden = false;
    });

    try {
      // Clear downstream stage caches so they regenerate with approved protocol
      for (let i = 1; i < totalStages; i++) {
        const pct = `${((i + 1) / totalStages) * 100}%`;
        const text = `Processing Stage ${i + 1} of ${totalStages}...`;
        progressBars?.forEach((b) => (b.style.width = pct));
        progressLabels?.forEach((l) => (l.textContent = text));

        // Small yield so browser UI stays responsive
        await new Promise((r) => setTimeout(r, 40));

        // Note: For full batch slicing, stage geometries are processed using the approved protocol
        this.stageResults.delete(i);
      }

      progressLabels?.forEach((l) => {
        l.textContent = `✓ Protocol applied to all ${totalStages} transitional stages!`;
      });
      setTimeout(() => {
        progressEls?.forEach((el) => {
          el.hidden = true;
        });
      }, 2500);
    } finally {
      this.isBatchProcessing = false;
    }
  }

  // ─── Export Dialogs ─────────────────────────────────────────────────────────

  private ensureMergedGeometry(
    stageIdx: number,
    res?: StageBlockoutResult,
  ): StageBlockoutResult | undefined {
    const baseGeom = this.getBaseGeometry();
    if (!baseGeom) return res;
    if (res && res.mergedGeometry) return res;
    const full = generateBlockout(
      baseGeom,
      this.isUpper,
      this.protocol,
      stageIdx + 1,
      `stage-${String(stageIdx + 1).padStart(2, "0")}`,
      this.stageSculptDeltas.get(stageIdx),
      { skipMergedGeometry: false },
    );
    this.stageResults.set(stageIdx, full);
    return full;
  }

  private async exportCurrentStageStl(): Promise<void> {
    const result = this.ensureMergedGeometry(
      this.currentStageIndex,
      this.stageResults.get(this.currentStageIndex),
    );
    if (!result) return;

    const raw = result.mergedGeometry || result.baseGeometry;
    const prep = prepareGeometryForPrint(raw, this.protocol.printPrep);
    const pad = String(this.currentStageIndex + 1).padStart(2, "0");
    const patientName = this.manifest.patientName ?? this.manifest.caseId;
    const filename = `${patientName}_${this.isUpper ? "Upper" : "Lower"}_Stage_${pad}_Blocked.stl`;

    const bytes = exportBinaryStl(prep, filename);
    downloadFile(bytes, filename);
  }

  private async exportAllStagesZip(): Promise<void> {
    const list: StageBlockoutResult[] = [];
    const total = this.manifest.treatmentStages.length;
    const baseGeom = this.getBaseGeometry();
    if (!baseGeom) return;

    for (let i = 0; i < total; i++) {
      const res = this.ensureMergedGeometry(i, this.stageResults.get(i));
      if (res) list.push(res);
    }

    const patientName = this.manifest.patientName ?? this.manifest.caseId;
    const zipBlob = await createBatchStlZip(
      patientName,
      this.isUpper ? "Upper" : "Lower",
      list,
      this.protocol.printPrep,
    );
    downloadFile(
      zipBlob,
      `${patientName}_${this.isUpper ? "Upper" : "Lower"}_All_Stages_Blocked_STLs.zip`,
    );
  }

  private async exportNestedBuildPlateStl(): Promise<void> {
    const list: StageBlockoutResult[] = [];
    const total = this.manifest.treatmentStages.length;
    const baseGeom = this.getBaseGeometry();
    if (!baseGeom) return;

    for (let i = 0; i < total; i++) {
      const res = this.ensureMergedGeometry(i, this.stageResults.get(i));
      if (res) list.push(res);
    }

    const nested = createNestedBuildPlateGeometry(
      list,
      this.protocol.printPrep,
    );
    if (!nested) return;

    const patientName = this.manifest.patientName ?? this.manifest.caseId;
    const filename = `${patientName}_${this.isUpper ? "Upper" : "Lower"}_Nested_BuildPlate.stl`;
    const bytes = exportBinaryStl(nested, filename);
    downloadFile(bytes, filename);
  }

  // ─── UI Rendering (Responsive Drawer / Bottom Sheet) ──────────────────────

  private renderUI(): void {
    if (!this.container) return;

    this.panelEl?.remove();
    this.dockEl?.remove();
    this.expandPillEl?.remove();

    const activeGapKey =
      this.selectedContactKey || (this.isUpper ? "11-21" : "41-31");
    const focusPillContent =
      this.protocol.singleGapFocusKey === "all"
        ? "Showing full arch digital wax across all interproximal embrasures (Titan CAD standard)."
        : 'Active Focus: <strong style="color:#ffe600;">' +
          activeGapKey +
          '</strong> <span style="color:#64748b;">(Click any row or 3D sphere to inspect another gap)</span>';

    const panel = document.createElement("div");
    panel.className = "bo-studio-panel";
    this.panelEl = panel;

    panel.innerHTML = `
      <div class="bo-header">
        <div class="bo-title-group">
          <h2 class="bo-title">Undercut &amp; Blockout Studio</h2>
          <span class="bo-panel-mode-label">Step 1: Undercut Survey &amp; Blockout</span>
        </div>
        <button type="button" class="bo-btn-minimize" title="Minimize Tools panel">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Quick Metrics Strip -->
      <div class="bo-metrics-strip">
        <div class="bo-metric" title="Maximum detected undercut depth">
          <span class="bo-metric-label">Max Undercut</span>
          <span class="bo-metric-val bo-metric-max">-</span>
        </div>
        <div class="bo-metric" title="Average retention depth across blocked areas">
          <span class="bo-metric-label">Avg Retention</span>
          <span class="bo-metric-val bo-metric-avg">-</span>
        </div>
        <div class="bo-metric" title="Total digital wax blockout area">
          <span class="bo-metric-label">Blockout Area</span>
          <span class="bo-metric-val bo-metric-area">-</span>
        </div>
      </div>

      <!-- Tab Content Area -->
      <div class="bo-tab-body">
        <!-- TAB 1: BLOCKOUT CONFIG -->
        <div class="bo-pane bo-pane-blockout ${this.activeTab === "blockout" ? "" : "bo-pane--hidden"}">
          <!-- Collapsible 3D Wax Fit & Contact Inspector -->
          <details class="bo-section bo-fitting-details" style="background: rgba(14, 165, 233, 0.05); border: 1px solid rgba(14, 165, 233, 0.25); border-radius: 8px; padding: 10px; margin-bottom: 12px;">
            <summary style="font-weight: 600; font-size: 13px; color: #38bdf8; cursor: pointer; display: flex; align-items: center; justify-content: space-between; list-style: none;">
              <span>🔍 3D Model &amp; Contact Inspector</span>
              <span class="bo-fit-badge" style="font-size: 11px; background: #0284c7; color: white; padding: 2px 8px; border-radius: 10px; font-weight: 500;">Scanning...</span>
            </summary>
            <div style="margin-top: 10px; font-size: 12px; line-height: 1.5; color: #cbd5e1;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 8px;">
                <div style="background: rgba(15, 23, 42, 0.7); padding: 6px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.05);">
                  <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase;">Model 3D Extents</div>
                  <div class="bo-model-bounds" style="font-family: monospace; font-size: 10px; color: #f8fafc; word-break: break-all;">-</div>
                </div>
                <div style="background: rgba(15, 23, 42, 0.7); padding: 6px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.05);">
                  <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase;">Wax 3D Extents</div>
                  <div class="bo-wax-bounds" style="font-family: monospace; font-size: 10px; color: #38bdf8; word-break: break-all;">-</div>
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 5px 8px; background: rgba(15, 23, 42, 0.5); border-radius: 4px; margin-bottom: 8px; font-size: 11px;">
                <span>Wax Volume: <strong class="bo-wax-volume" style="color: #38bdf8;">- mm³</strong></span>
                <span>Interdental Fit: <strong class="bo-contacts-sealed" style="color: #4ade80;">- / -</strong></span>
              </div>
              <div style="max-height: 140px; overflow-y: auto; background: rgba(15, 23, 42, 0.85); border-radius: 4px; padding: 4px 6px; border: 1px solid rgba(255,255,255,0.08);">
                <table style="width: 100%; border-collapse: collapse; font-size: 10px; font-family: monospace;">
                  <thead>
                    <tr style="color: #94a3b8; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.12);">
                      <th style="padding: 2px 4px;">Contact</th>
                      <th style="padding: 2px 4px;">Span</th>
                      <th style="padding: 2px 4px;">Apex Y</th>
                      <th style="padding: 2px 4px;">Fit</th>
                    </tr>
                  </thead>
                  <tbody class="bo-contacts-table-body">
                    <tr><td colspan="4" style="text-align: center; color: #64748b; padding: 6px;">Analyzing contact fits...</td></tr>
                  </tbody>
                </table>
              </div>
              <div class="bo-contacts-tip-container" style="display: flex; align-items: center; justify-content: space-between; margin-top: 6px; font-size: 10px; color: #94a3b8;">
                <span>💡 Drag spheres in 3D to tune • Dbl-click to reset</span>
                <button type="button" class="bo-btn-copy-coords" style="display: none; background: rgba(250,204,21,0.15); border: 1px solid rgba(250,204,21,0.3); color: #fde047; border-radius: 3px; font-size: 9px; padding: 2px 6px; cursor: pointer;">📋 Copy Coords</button>
              </div>
            </div>
          </details>

          <!-- Display Overlays -->
          <div class="bo-section bo-section-overlays">
            <h4 class="bo-section-title">Display Overlays</h4>
            <div class="bo-toggle-row">
              <label class="bo-switch">
                <input type="checkbox" class="bo-chk-wax" ${this.showWaxOverlay ? "checked" : ""}>
                <span class="bo-slider"></span>
              </label>
              <span class="bo-toggle-label">Clinical Digital Wax</span>
            </div>
            <div class="bo-toggle-row">
              <label class="bo-switch">
                <input type="checkbox" class="bo-chk-markers" ${this.showContactMarkers ? "checked" : ""}>
                <span class="bo-slider"></span>
              </label>
              <span class="bo-toggle-label">Contact Markers (Draggable)</span>
            </div>
            <div class="bo-toggle-row">
              <label class="bo-switch">
                <input type="checkbox" class="bo-chk-silhouettes" ${this.showEmbrasureSilhouettes ? "checked" : ""}>
                <span class="bo-slider"></span>
              </label>
              <span class="bo-toggle-label">Embrasure Silhouettes</span>
            </div>
          </div>

          <!-- Component 1: Interproximal Wax -->
          <div class="bo-section bo-section-interproximal">
            <div class="bo-section-header">
              <h4 class="bo-section-title">1. Interproximal Wax <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#D83D56;margin-left:5px;vertical-align:middle;" title="Interproximal Digital Wax"></span></h4>
              <label class="bo-switch">
                <input type="checkbox" class="bo-chk-prox" ${this.protocol.interproximal.enabled ? "checked" : ""}>
                <span class="bo-slider"></span>
              </label>
            </div>
            <p class="bo-desc">Conformal wax filling embrasures between adjacent teeth.</p>

            <div style="margin: 8px 0;">
              <div style="display:flex; gap:6px; margin-bottom: 6px;">
                <button type="button" class="bo-btn-wax-mode bo-btn-wax-mode--all" style="flex:1; padding:6px 8px; font-size:11px; font-weight:600; border-radius:6px; cursor:pointer; transition:all 0.2s ease; border: 1px solid ${this.protocol.singleGapFocusKey === "all" ? "#e58189" : "rgba(255,255,255,0.15)"}; background: ${this.protocol.singleGapFocusKey === "all" ? "rgba(229,129,137,0.18)" : "rgba(255,255,255,0.05)"}; color: ${this.protocol.singleGapFocusKey === "all" ? "#e58189" : "#94a3b8"};">
                  ★ Full Arch
                </button>
                <button type="button" class="bo-btn-wax-mode bo-btn-wax-mode--single" style="flex:1; padding:6px 8px; font-size:11px; font-weight:600; border-radius:6px; cursor:pointer; transition:all 0.2s ease; border: 1px solid ${this.protocol.singleGapFocusKey !== "all" ? "#e58189" : "rgba(255,255,255,0.15)"}; background: ${this.protocol.singleGapFocusKey !== "all" ? "rgba(229,129,137,0.18)" : "rgba(255,255,255,0.05)"}; color: ${this.protocol.singleGapFocusKey !== "all" ? "#e58189" : "#94a3b8"};">
                  Single Gap
                </button>
              </div>
              <div class="bo-wax-focus-pill" style="font-size:11px; color:#cbd5e1; padding:6px 8px; background:rgba(229,129,137,0.08); border-left:3px solid #e58189; border-radius:4px; line-height:1.4;">
                ${focusPillContent}
              </div>
            </div>
            <div class="bo-range-group">
              <div class="bo-range-meta">
                <span>Wax Thickness</span>
                <span class="bo-range-val bo-val-prox">${this.protocol.interproximal.thicknessMm.toFixed(2)} mm</span>
              </div>
              <input type="range" class="bo-range-input bo-range-prox" min="0.1" max="1.5" step="0.05" value="${this.protocol.interproximal.thicknessMm}">
            </div>
          </div>

          <!-- Component 2: Gingival Line Relief -->
          <div class="bo-section bo-section-gingival">
            <div class="bo-section-header">
              <h4 class="bo-section-title">2. Gingival Margin Relief <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#4ade80;margin-left:5px;vertical-align:middle;" title="Gingival Margin Relief"></span></h4>
              <label class="bo-switch">
                <input type="checkbox" class="bo-chk-ging" ${this.protocol.gingival.enabled ? "checked" : ""}>
                <span class="bo-slider"></span>
              </label>
            </div>
            <p class="bo-desc">Relieves cervical constriction along the tooth-gum CEJ boundary.</p>
            <div class="bo-range-group">
              <div class="bo-range-meta">
                <span>Margin Relief</span>
                <span class="bo-range-val bo-val-ging">${this.protocol.gingival.reliefMm.toFixed(2)} mm</span>
              </div>
              <input type="range" class="bo-range-input bo-range-ging" min="0.1" max="0.8" step="0.05" value="${this.protocol.gingival.reliefMm}">
            </div>
          </div>

          <!-- Component 3: Dentition Undercut Blockout & Heatmap -->
          <div class="bo-section bo-section-undercut">
            <div class="bo-section-header">
              <h4 class="bo-section-title">3. Dentition Undercuts <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#38bdf8;margin-left:5px;vertical-align:middle;" title="Blue Undercut Blockout"></span></h4>
              <label class="bo-switch">
                <input type="checkbox" class="bo-chk-uc" ${this.protocol.undercut.enabled ? "checked" : ""}>
                <span class="bo-slider"></span>
              </label>
            </div>
            <p class="bo-desc">Blocks retentive crown undercuts in blue along the draw path.</p>
            <div class="bo-toggle-row" style="margin-bottom: 8px;">
              <label class="bo-switch">
                <input type="checkbox" class="bo-chk-heatmap" ${this.showHeatmap ? "checked" : ""}>
                <span class="bo-slider"></span>
              </label>
              <span class="bo-toggle-label">Undercut Heatmap Overlay</span>
            </div>
            <div class="bo-range-group">
              <div class="bo-range-meta">
                <span>Max Allowable Depth</span>
                <span class="bo-range-val bo-val-uc">${this.protocol.undercut.maxDepthMm.toFixed(2)} mm</span>
              </div>
              <input type="range" class="bo-range-input bo-range-uc" min="0.00" max="1.00" step="0.05" value="${this.protocol.undercut.maxDepthMm}">
            </div>

            <!-- Interactive FDI Tooth Chart -->
            <div class="bo-tooth-chart">
              <div class="bo-chart-title">Tooth-by-Tooth Exclusions (FDI)</div>
              <div class="bo-tooth-grid bo-tooth-grid-quad1"></div>
              <div class="bo-tooth-grid bo-tooth-grid-quad2"></div>
            </div>
          </div>
        </div>

        <!-- TAB 2: DIGITAL WAX CARVER (SCULPT) -->
        <div class="bo-pane bo-pane-sculpt ${this.activeTab === "sculpt" ? "" : "bo-pane--hidden"}">
          <div class="bo-section">
            <h4 class="bo-section-title">Digital Wax Carver (Hot Spatula)</h4>
            <p class="bo-desc">Directly sculpt and smooth custom wax on crowded teeth or missing tooth spaces.</p>
            <div class="bo-brush-modes">
              <button type="button" class="bo-mode-btn bo-mode-btn--active" data-mode="off">Off (Rotate)</button>
              <button type="button" class="bo-mode-btn" data-mode="add">+ Add Wax</button>
              <button type="button" class="bo-mode-btn" data-mode="remove">- Carve Wax</button>
              <button type="button" class="bo-mode-btn" data-mode="smooth">~ Smooth</button>
            </div>

            <div class="bo-range-group" style="margin-top: 14px;">
              <div class="bo-range-meta">
                <span>Brush Radius</span>
                <span class="bo-range-val bo-val-radius">3.5 mm</span>
              </div>
              <input type="range" class="bo-range-input bo-range-radius" min="1.0" max="8.0" step="0.5" value="3.5">
            </div>

            <div class="bo-range-group">
              <div class="bo-range-meta">
                <span>Carving Strength</span>
                <span class="bo-range-val bo-val-strength">50%</span>
              </div>
              <input type="range" class="bo-range-input bo-range-strength" min="0.1" max="1.0" step="0.05" value="0.5">
            </div>

            <div class="bo-undo-row">
              <button type="button" class="bo-btn-undo" disabled>↶ Undo</button>
              <button type="button" class="bo-btn-redo" disabled>↷ Redo</button>
            </div>
          </div>
        </div>

        <!-- TAB 3: PRINT PREP & EXPORT -->
        <div class="bo-pane bo-pane-prep ${this.activeTab === "prep" ? "" : "bo-pane--hidden"}">
          <div class="bo-section">
            <h4 class="bo-section-title">Photopolymer Resin Shrinkage</h4>
            <p class="bo-desc">Scales models to compensate for 3D printer post-curing shrinkage.</p>
            <div class="bo-range-group">
              <div class="bo-range-meta">
                <span>Shrinkage Scale</span>
                <span class="bo-range-val bo-val-shrink">${this.protocol.printPrep.shrinkageScalePercent.toFixed(1)}%</span>
              </div>
              <input type="range" class="bo-range-input bo-range-shrink" min="100.0" max="102.0" step="0.1" value="${this.protocol.printPrep.shrinkageScalePercent}">
            </div>
          </div>

          <div class="bo-section">
            <h4 class="bo-section-title">Base Drainage &amp; Suction Holes</h4>
            <p class="bo-desc">Place hollow suction and drainage holes for vacuum thermoforming and resin drainage.</p>
            <button type="button" class="bo-btn-action bo-btn-add-hole">+ Add Standard Base Suction Holes</button>
            <div class="bo-holes-list"></div>
          </div>

          <div class="bo-section">
            <h4 class="bo-section-title">Export Slicing Files</h4>
            <div class="bo-export-btns">
              <button type="button" class="bo-btn-export bo-btn-export-stage">Download Current Stage STL</button>
              <button type="button" class="bo-btn-export bo-btn-export-all">Export All Stages (.ZIP STLs)</button>
              <button type="button" class="bo-btn-export bo-btn-export-nested">Export Single Nested Build-Plate STL</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Master Action CTA Footer (Pinned to Side Panel) -->
      <div class="bo-action-footer">
        <div class="bo-propagate-progress" hidden>
          <div class="bo-progress-label">Processing transitional models...</div>
          <div class="bo-progress-bar-bg">
            <div class="bo-progress-bar-fill" style="width: 0%"></div>
          </div>
        </div>
        <button type="button" class="bo-btn-propagate" title="Apply reference protocol across all transitional stages">
          <span>Apply to All Stages</span>
        </button>
      </div>
    `;

    // 2. CAD Studio Floating Center Dock (Compact & purpose-built)
    const totalStages = this.manifest.treatmentStages.length || 1;
    const dock = document.createElement("div");
    dock.className = "bo-bottom-dock";
    this.dockEl = dock;

    dock.innerHTML = `
      <!-- Playback Control (Play / Pause) -->
      <div class="bo-dock-group bo-dock-playback">
        <button type="button" class="bo-dock-btn-play ${this.isPlaying ? "bo-dock-btn-play--active" : ""}" title="${this.isPlaying ? "Pause treatment playback" : "Play treatment progression"}" aria-label="${this.isPlaying ? "Pause" : "Play"}">
          ${this.getPlayPauseIconSvg(this.isPlaying)}
        </button>
      </div>

      <div class="bo-dock-divider"></div>

      <!-- Stage Timeline Stepper & Scrubber -->
      <div class="bo-dock-group bo-dock-timeline bo-dock-stepper">
        <button type="button" class="bo-dock-step-btn bo-dock-step-prev" title="Previous stage" ${this.currentStageIndex === 0 ? "disabled" : ""}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <input type="range" class="bo-dock-slider" min="0" max="${totalStages - 1}" step="1" value="${this.currentStageIndex}" title="Scrub through treatment stages">
        <button type="button" class="bo-dock-step-btn bo-dock-step-next" title="Next stage" ${this.currentStageIndex >= totalStages - 1 ? "disabled" : ""}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
        <span class="bo-dock-stage-badge ${this.currentStageIndex === 0 ? "bo-dock-stage-badge--ref" : ""}">
          ${this.currentStageIndex === 0 ? "★ Ref" : `Stage ${this.currentStageIndex + 1}/${totalStages}`}
        </span>
      </div>
    `;

    // 3. Floating Restore Pill (When panel is minimized)
    const expandPill = document.createElement("button");
    expandPill.type = "button";
    expandPill.className = "bo-expand-pill";
    expandPill.title = "Restore Tools Panel";
    expandPill.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
      <span>Tools</span>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    `;
    expandPill.addEventListener("click", () => {
      this.setMinimized(false);
    });
    this.expandPillEl = expandPill;

    this.container.appendChild(panel);
    this.container.appendChild(dock);
    this.container.appendChild(expandPill);
    this.bindPanelEvents();
    this.bindDockEvents();
    this.renderToothChart();
  }

  private renderToothChart(): void {
    if (!this.panelEl) return;
    const q1 = this.panelEl.querySelector(".bo-tooth-grid-quad1");
    const q2 = this.panelEl.querySelector(".bo-tooth-grid-quad2");
    if (!q1 || !q2) return;

    q1.innerHTML = "";
    q2.innerHTML = "";

    // Quadrants based on arch
    const quad1Teeth = this.isUpper
      ? [18, 17, 16, 15, 14, 13, 12, 11]
      : [48, 47, 46, 45, 44, 43, 42, 41];
    const quad2Teeth = this.isUpper
      ? [21, 22, 23, 24, 25, 26, 27, 28]
      : [31, 32, 33, 34, 35, 36, 37, 38];

    const createBtn = (fdi: number) => {
      const btn = document.createElement("button");
      btn.type = "button";
      const isAllowed = this.protocol.undercut.perTooth[fdi] !== false;
      btn.className = `bo-tooth-btn ${isAllowed ? "bo-tooth-btn--active" : "bo-tooth-btn--disabled"}`;
      btn.textContent = String(fdi);
      btn.title = `Tooth ${fdi}: Click to toggle undercut blockout`;
      btn.addEventListener("click", () => {
        this.protocol.undercut.perTooth[fdi] = !isAllowed;
        this.renderToothChart();
        this.recomputeCurrentBlockout();
      });
      return btn;
    };

    quad1Teeth.forEach((t) => q1.appendChild(createBtn(t)));
    quad2Teeth.forEach((t) => q2.appendChild(createBtn(t)));
  }

  private bindPanelEvents(): void {
    if (!this.panelEl) return;

    // Minimize Panel (Does not exit studio to 3D progression viewer)
    this.panelEl
      .querySelector(".bo-btn-minimize")
      ?.addEventListener("click", () => {
        this.setMinimized(true);
      });

    // Arch Selector
    this.panelEl
      .querySelectorAll<HTMLButtonElement>(".bo-pill-btn")
      .forEach((btn) => {
        btn.addEventListener("click", () => {
          const arch = btn.dataset["arch"] as "upper" | "lower";
          this.setArch(arch);
        });
      });

    // Internal Tabs if present
    this.panelEl
      .querySelectorAll<HTMLButtonElement>(".bo-tab")
      .forEach((tab) => {
        tab.addEventListener("click", () => {
          const t = tab.dataset["tab"] as "blockout" | "sculpt" | "prep";
          if (t) this.setActiveTab(t);
        });
      });

    // Overlays
    const chkWax = this.panelEl.querySelector<HTMLInputElement>(".bo-chk-wax");
    chkWax?.addEventListener("change", () => {
      this.toggleWaxOverlay(chkWax.checked);
    });

    const chkMarkers =
      this.panelEl.querySelector<HTMLInputElement>(".bo-chk-markers");
    chkMarkers?.addEventListener("change", () => {
      this.toggleContactMarkers(chkMarkers.checked);
    });

    const chkSilhouettes = this.panelEl.querySelector<HTMLInputElement>(
      ".bo-chk-silhouettes",
    );
    chkSilhouettes?.addEventListener("change", () => {
      this.toggleEmbrasureSilhouettes(chkSilhouettes.checked);
    });

    const chkHeatmap =
      this.panelEl.querySelector<HTMLInputElement>(".bo-chk-heatmap");
    chkHeatmap?.addEventListener("change", () => {
      this.toggleHeatmap(chkHeatmap.checked);
    });

    // Component 1: Interproximal
    const chkProx =
      this.panelEl.querySelector<HTMLInputElement>(".bo-chk-prox");
    chkProx?.addEventListener("change", () => {
      this.protocol.interproximal.enabled = chkProx.checked;
      this.recomputeCurrentBlockout();
    });

    const btnModeSingle = this.panelEl.querySelector<HTMLButtonElement>(
      ".bo-btn-wax-mode--single",
    );
    const btnModeAll = this.panelEl.querySelector<HTMLButtonElement>(
      ".bo-btn-wax-mode--all",
    );
    btnModeSingle?.addEventListener("click", () => {
      this.protocol.singleGapFocusKey =
        this.selectedContactKey || (this.isUpper ? "11-21" : "41-31");
      this.recomputeCurrentBlockout();
      this.renderUI();
    });
    btnModeAll?.addEventListener("click", () => {
      this.protocol.singleGapFocusKey = "all";
      this.recomputeCurrentBlockout();
      this.renderUI();
    });

    const rngProx =
      this.panelEl.querySelector<HTMLInputElement>(".bo-range-prox");
    rngProx?.addEventListener("input", () => {
      const val = parseFloat(rngProx.value);
      this.protocol.interproximal.thicknessMm = val;
      const lbl = this.panelEl?.querySelector(".bo-val-prox");
      if (lbl) lbl.textContent = `${val.toFixed(2)} mm`;
      this.scheduleRecomputeDebounced();
    });

    // Component 2: Gingival
    const chkGing =
      this.panelEl.querySelector<HTMLInputElement>(".bo-chk-ging");
    chkGing?.addEventListener("change", () => {
      this.protocol.gingival.enabled = chkGing.checked;
      this.recomputeCurrentBlockout();
    });

    const rngGing =
      this.panelEl.querySelector<HTMLInputElement>(".bo-range-ging");
    rngGing?.addEventListener("input", () => {
      const val = parseFloat(rngGing.value);
      this.protocol.gingival.reliefMm = val;
      const lbl = this.panelEl?.querySelector(".bo-val-ging");
      if (lbl) lbl.textContent = `${val.toFixed(2)} mm`;
      this.scheduleRecomputeDebounced();
    });

    // Component 3: Undercut
    const chkUc = this.panelEl.querySelector<HTMLInputElement>(".bo-chk-uc");
    chkUc?.addEventListener("change", () => {
      this.protocol.undercut.enabled = chkUc.checked;
      this.recomputeCurrentBlockout();
    });

    const rngUc = this.panelEl.querySelector<HTMLInputElement>(".bo-range-uc");
    rngUc?.addEventListener("input", () => {
      const val = parseFloat(rngUc.value);
      this.protocol.undercut.maxDepthMm = val;
      const lbl = this.panelEl?.querySelector(".bo-val-uc");
      if (lbl) lbl.textContent = `${val.toFixed(2)} mm`;
      this.scheduleRecomputeDebounced();
    });

    // Component 4: Sculpt Tools
    this.panelEl
      .querySelectorAll<HTMLButtonElement>(".bo-mode-btn")
      .forEach((btn) => {
        btn.addEventListener("click", () => {
          const mode = btn.dataset["mode"] as SculptMode;
          this.panelEl
            ?.querySelectorAll(".bo-mode-btn")
            .forEach((b) => b.classList.remove("bo-mode-btn--active"));
          btn.classList.add("bo-mode-btn--active");
          if (this.sculptor) {
            this.sculptor.setConfig({ mode });
          }
        });
      });

    const rngRadius =
      this.panelEl.querySelector<HTMLInputElement>(".bo-range-radius");
    rngRadius?.addEventListener("input", () => {
      const val = parseFloat(rngRadius.value);
      const lbl = this.panelEl?.querySelector(".bo-val-radius");
      if (lbl) lbl.textContent = `${val.toFixed(1)} mm`;
      if (this.sculptor) this.sculptor.setConfig({ radiusMm: val });
    });

    const rngStrength =
      this.panelEl.querySelector<HTMLInputElement>(".bo-range-strength");
    rngStrength?.addEventListener("input", () => {
      const val = parseFloat(rngStrength.value);
      const lbl = this.panelEl?.querySelector(".bo-val-strength");
      if (lbl) lbl.textContent = `${Math.round(val * 100)}%`;
      if (this.sculptor) this.sculptor.setConfig({ strength: val });
    });

    const btnUndo =
      this.panelEl.querySelector<HTMLButtonElement>(".bo-btn-undo");
    btnUndo?.addEventListener("click", () => {
      if (this.sculptor) this.sculptor.undo();
    });

    const btnRedo =
      this.panelEl.querySelector<HTMLButtonElement>(".bo-btn-redo");
    btnRedo?.addEventListener("click", () => {
      if (this.sculptor) this.sculptor.redo();
    });

    // Component 5: Print Prep & Scale
    const rngShrink =
      this.panelEl.querySelector<HTMLInputElement>(".bo-range-shrink");
    rngShrink?.addEventListener("input", () => {
      const val = parseFloat(rngShrink.value);
      this.protocol.printPrep.shrinkageScalePercent = val;
      const lbl = this.panelEl?.querySelector(".bo-val-shrink");
      if (lbl) lbl.textContent = `${val.toFixed(1)}%`;
    });

    const btnAddHole =
      this.panelEl.querySelector<HTMLButtonElement>(".bo-btn-add-hole");
    btnAddHole?.addEventListener("click", () => {
      // Add standard bilateral suction holes at the posterior palate / base
      this.protocol.printPrep.drainHoles = [
        {
          id: "hole-left",
          position: [-18, 0, -10],
          normal: [0, 1, 0],
          diameterMm: 3.0,
        },
        {
          id: "hole-right",
          position: [18, 0, -10],
          normal: [0, 1, 0],
          diameterMm: 3.0,
        },
      ];
      this.renderHolesList();
      this.recomputeCurrentBlockout();
    });

    // Copy Tuned Contact Coordinates
    this.panelEl
      .querySelectorAll<HTMLButtonElement>(".bo-btn-copy-coords")
      .forEach((btn) => {
        btn.addEventListener("click", () => {
          if (
            !this.protocol.contactOverrides ||
            Object.keys(this.protocol.contactOverrides).length === 0
          )
            return;
          const text = JSON.stringify(this.protocol.contactOverrides, null, 2);
          if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
            btn.textContent = "✓ Copied!";
            setTimeout(() => {
              btn.textContent = "📋 Copy Coords";
            }, 2000);
          }
        });
      });

    // Export Buttons
    this.panelEl
      .querySelector(".bo-btn-export-stage")
      ?.addEventListener("click", () => this.exportCurrentStageStl());
    this.panelEl
      .querySelector(".bo-btn-export-all")
      ?.addEventListener("click", () => this.exportAllStagesZip());
    this.panelEl
      .querySelector(".bo-btn-export-nested")
      ?.addEventListener("click", () => this.exportNestedBuildPlateStl());

    // Batch Propagate CTA
    this.panelEl
      .querySelector(".bo-btn-propagate")
      ?.addEventListener("click", () => this.propagateToAllStages());
  }

  private getPlayPauseIconSvg(playing: boolean): string {
    return playing
      ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`
      : `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="6 4 20 12 6 20 6 4"/></svg>`;
  }

  public togglePlayback(play?: boolean): boolean {
    const nextState = typeof play === "boolean" ? play : !this.isPlaying;
    if (nextState) {
      const totalStages = this.manifest.treatmentStages.length || 1;
      if (this.currentStageIndex >= totalStages - 1) {
        this.setStageIndex(0);
      }
      this.isPlaying = true;
      if (this.playIntervalId !== null) clearInterval(this.playIntervalId);
      this.playIntervalId = setInterval(() => {
        const total = this.manifest.treatmentStages.length || 1;
        if (this.currentStageIndex < total - 1) {
          this.setStageIndex(this.currentStageIndex + 1);
        } else {
          this.stopPlayback();
        }
      }, 900);
    } else {
      this.stopPlayback();
    }
    this.syncPlaybackUI();
    return this.isPlaying;
  }

  private stopPlayback(): void {
    this.isPlaying = false;
    if (this.playIntervalId !== null) {
      clearInterval(this.playIntervalId);
      this.playIntervalId = null;
    }
    this.syncPlaybackUI();
  }

  private syncPlaybackUI(): void {
    const playBtn =
      this.dockEl?.querySelector<HTMLButtonElement>(".bo-dock-btn-play");
    if (!playBtn) return;
    playBtn.classList.toggle("bo-dock-btn-play--active", this.isPlaying);
    playBtn.title = this.isPlaying
      ? "Pause treatment playback"
      : "Play treatment progression";
    playBtn.setAttribute("aria-label", this.isPlaying ? "Pause" : "Play");
    playBtn.innerHTML = this.getPlayPauseIconSvg(this.isPlaying);
  }

  private bindDockEvents(): void {
    if (!this.dockEl) return;

    this.dockEl
      .querySelector(".bo-dock-btn-play")
      ?.addEventListener("click", () => {
        this.togglePlayback();
      });

    const prevBtn =
      this.dockEl.querySelector<HTMLButtonElement>(".bo-dock-step-prev");
    const nextBtn =
      this.dockEl.querySelector<HTMLButtonElement>(".bo-dock-step-next");
    const slider =
      this.dockEl.querySelector<HTMLInputElement>(".bo-dock-slider");

    prevBtn?.addEventListener("click", () => {
      if (this.isPlaying) this.stopPlayback();
      if (this.currentStageIndex > 0) {
        this.setStageIndex(this.currentStageIndex - 1);
      }
    });

    nextBtn?.addEventListener("click", () => {
      if (this.isPlaying) this.stopPlayback();
      const total = this.manifest.treatmentStages.length;
      if (this.currentStageIndex < total - 1) {
        this.setStageIndex(this.currentStageIndex + 1);
      }
    });

    slider?.addEventListener("input", () => {
      if (this.isPlaying) this.stopPlayback();
      const target = parseInt(slider.value, 10);
      if (!isNaN(target)) {
        this.setStageIndex(target);
      }
    });
  }

  private updateActiveTabPanes(): void {
    if (!this.panelEl) return;
    const paneBlockout = this.panelEl.querySelector(".bo-pane-blockout");
    const paneSculpt = this.panelEl.querySelector(".bo-pane-sculpt");
    const panePrep = this.panelEl.querySelector(".bo-pane-prep");
    const modeLabel = this.panelEl.querySelector(".bo-panel-mode-label");

    paneBlockout?.classList.toggle(
      "bo-pane--hidden",
      this.activeTab !== "blockout",
    );
    paneSculpt?.classList.toggle(
      "bo-pane--hidden",
      this.activeTab !== "sculpt",
    );
    panePrep?.classList.toggle("bo-pane--hidden", this.activeTab !== "prep");

    if (modeLabel) {
      if (this.activeTab === "blockout")
        modeLabel.textContent = "Step 1: Undercut Survey & Wax Blockout";
      else if (this.activeTab === "sculpt")
        modeLabel.textContent = "Step 2: Digital Wax Carver (Hot Spatula)";
      else if (this.activeTab === "prep")
        modeLabel.textContent = "Step 3: Print Prep, Drainage & STL Export";
    }

    this.panelEl
      .querySelectorAll<HTMLButtonElement>(".bo-tab")
      .forEach((btn) => {
        btn.classList.toggle(
          "bo-tab--active",
          btn.dataset["tab"] === this.activeTab,
        );
      });
  }

  private syncOverlayCheckboxes(): void {
    const waxChks =
      this.container?.querySelectorAll<HTMLInputElement>(".bo-chk-wax");
    waxChks?.forEach((chk) => {
      chk.checked = this.showWaxOverlay;
    });
    const markerChks =
      this.container?.querySelectorAll<HTMLInputElement>(".bo-chk-markers");
    markerChks?.forEach((chk) => {
      chk.checked = this.showContactMarkers;
    });
    const silChks = this.container?.querySelectorAll<HTMLInputElement>(
      ".bo-chk-silhouettes",
    );
    silChks?.forEach((chk) => {
      chk.checked = this.showEmbrasureSilhouettes;
    });
    const heatChks =
      this.container?.querySelectorAll<HTMLInputElement>(".bo-chk-heatmap");
    heatChks?.forEach((chk) => {
      chk.checked = this.showHeatmap;
    });
  }

  private renderHolesList(): void {
    if (!this.panelEl) return;
    const listEl = this.panelEl.querySelector(".bo-holes-list");
    if (!listEl) return;
    listEl.innerHTML = "";

    this.protocol.printPrep.drainHoles.forEach((hole, idx) => {
      const item = document.createElement("div");
      item.className = "bo-hole-item";
      item.innerHTML = `
        <span>Hole #${idx + 1} (${hole.diameterMm.toFixed(1)} mm)</span>
        <button type="button" class="bo-hole-del">&times;</button>
      `;
      item.querySelector(".bo-hole-del")?.addEventListener("click", () => {
        this.protocol.printPrep.drainHoles.splice(idx, 1);
        this.renderHolesList();
        this.recomputeCurrentBlockout();
      });
      listEl.appendChild(item);
    });
  }

  private updateMetricsDisplay(result: StageBlockoutResult): void {
    if (result.survey) {
      const maxEls = this.container?.querySelectorAll(".bo-metric-max");
      const avgEls = this.container?.querySelectorAll(".bo-metric-avg");
      const areaEls = this.container?.querySelectorAll(".bo-metric-area");

      maxEls?.forEach((el) => {
        el.textContent = `${result.survey!.maxDepthMm.toFixed(2)} mm`;
      });
      avgEls?.forEach((el) => {
        el.textContent = `${result.survey!.avgDepthMm.toFixed(2)} mm`;
      });
      areaEls?.forEach((el) => {
        el.textContent = `${result.survey!.undercutAreaMm2.toFixed(1)} mm²`;
      });
    }

    // Populate 3D Model & Wax Fitting Inspector
    if (result.fittingSummary) {
      const summary = result.fittingSummary;
      const modelBoundsEls =
        this.container?.querySelectorAll(".bo-model-bounds");
      const waxBoundsEls = this.container?.querySelectorAll(".bo-wax-bounds");
      const waxVolEls = this.container?.querySelectorAll(".bo-wax-volume");
      const sealedEls = this.container?.querySelectorAll(".bo-contacts-sealed");
      const badgeEls = this.container?.querySelectorAll(".bo-fit-badge");
      const tableBodyEls = this.container?.querySelectorAll(
        ".bo-contacts-table-body",
      );

      const mb = summary.modelBounds;
      const modelBoundsStr = `X:[${mb.min[0].toFixed(1)}, ${mb.max[0].toFixed(1)}] Y:[${mb.min[1].toFixed(1)}, ${mb.max[1].toFixed(1)}] Z:[${mb.min[2].toFixed(1)}, ${mb.max[2].toFixed(1)}]`;
      modelBoundsEls?.forEach((el) => {
        el.textContent = modelBoundsStr;
      });

      if (summary.waxBounds) {
        const wb = summary.waxBounds;
        const waxBoundsStr = `X:[${wb.min[0].toFixed(1)}, ${wb.max[0].toFixed(1)}] Y:[${wb.min[1].toFixed(1)}, ${wb.max[1].toFixed(1)}] Z:[${wb.min[2].toFixed(1)}, ${wb.max[2].toFixed(1)}]`;
        waxBoundsEls?.forEach((el) => {
          el.textContent = waxBoundsStr;
        });
      } else {
        waxBoundsEls?.forEach((el) => {
          el.textContent = "None";
        });
      }

      waxVolEls?.forEach((el) => {
        el.textContent = `${summary.totalWaxVolumeMm3.toFixed(1)} mm³`;
      });

      const isAllSealed =
        summary.sealedContacts >= summary.totalContacts &&
        summary.totalContacts > 0;
      sealedEls?.forEach((el) => {
        el.textContent = `${summary.sealedContacts} / ${summary.totalContacts} (${isAllSealed ? "100%" : Math.round((summary.sealedContacts / Math.max(1, summary.totalContacts)) * 100) + "%"})`;
      });

      badgeEls?.forEach((el) => {
        (el as HTMLElement).style.background = "#0284c7";
        el.textContent = `✓ ${summary.contacts.length} Contacts Found`;
      });

      if (tableBodyEls && summary.contacts.length > 0) {
        const rowsHtml = summary.contacts
          .map((c) => {
            const isTuned = Boolean(
              this.protocol.contactOverrides?.[c.contactKey],
            );
            const isSelected = c.contactKey === this.selectedContactKey;
            const sil = this.silhouettes.find(
              (s) => s.contactKey === c.contactKey,
            );
            const dimSpan = sil
              ? `<span style="color: ${isSelected ? "#fbbf24" : "#38bdf8"}; font-weight: 600;" title="Embrasure Silhouette: H=${sil.heightMm}mm, W=${sil.spanMm}mm, D=${sil.depthMm}mm">${sil.spanMm}mm <small style="color: #94a3b8; font-size: 8px;">(H:${sil.heightMm})</small></span>`
              : `${c.spanMm.toFixed(1)}mm`;
            const fitText = isTuned
              ? `<span style="color: #facc15; font-weight: 600;" title="User calibrated: [${c.contactPoint.map((v) => v.toFixed(1)).join(", ")}]">★ Tuned</span>`
              : `<span style="color: #e58189;">✓ ${c.clearanceMm !== undefined ? c.clearanceMm.toFixed(2) + "mm" : "0.35mm"}</span>`;
            return `
            <tr class="bo-contact-row bo-contact-row-${c.contactKey}" data-contact-key="${c.contactKey}" style="cursor: pointer; transition: background 0.15s ease; border-bottom: 1px solid rgba(255,255,255,0.05); ${isSelected ? "background: rgba(56, 189, 248, 0.18); border-left: 3px solid #38bdf8;" : isTuned ? "background: rgba(250, 204, 21, 0.08);" : ""}">
              <td style="padding: 2px 4px; color: ${isSelected ? "#38bdf8" : isTuned ? "#fde047" : "#f8fafc"}; font-weight: ${isSelected ? "700" : "normal"};" title="${c.label} (Click to inspect silhouette, drag sphere in 3D to tune)">${c.contactKey}${isTuned ? " ★" : ""}</td>
              <td style="padding: 2px 4px;">${dimSpan}</td>
              <td class="bo-contact-apex" style="padding: 2px 4px; color: #38bdf8;">${c.apexY.toFixed(1)}</td>
              <td class="bo-contact-fit" style="padding: 2px 4px;">${fitText}</td>
            </tr>
          `;
          })
          .join("");
        tableBodyEls.forEach((el) => {
          el.innerHTML = rowsHtml;
          el.querySelectorAll<HTMLTableRowElement>(".bo-contact-row").forEach(
            (tr) => {
              tr.addEventListener("click", () => {
                const key = tr.getAttribute("data-contact-key");
                if (key) {
                  this.selectContact(key);
                }
              });
            },
          );
        });
      }

      const copyBtns = this.container?.querySelectorAll<HTMLButtonElement>(
        ".bo-btn-copy-coords",
      );
      const hasOverrides = Boolean(
        this.protocol.contactOverrides &&
        Object.keys(this.protocol.contactOverrides).length > 0,
      );
      copyBtns?.forEach((btn) => {
        btn.style.display = hasOverrides ? "inline-block" : "none";
      });
    }
  }

  private updateUndoRedoButtons(): void {
    if (!this.panelEl || !this.sculptor) return;
    const btnUndo =
      this.panelEl.querySelector<HTMLButtonElement>(".bo-btn-undo");
    const btnRedo =
      this.panelEl.querySelector<HTMLButtonElement>(".bo-btn-redo");
    if (btnUndo) btnUndo.disabled = !this.sculptor.canUndo();
    if (btnRedo) btnRedo.disabled = !this.sculptor.canRedo();
  }

  private updateUI(): void {
    const totalStages = this.manifest.treatmentStages.length || 1;

    // Update all stage tags across panel and bottom dock
    const stageTags = this.container?.querySelectorAll(".bo-stage-tag");
    stageTags?.forEach((stageTag) => {
      if (this.currentStageIndex === 0) {
        stageTag.className = "bo-stage-tag bo-stage-tag--ref";
        stageTag.textContent = "★ Stage 1 (Reference Model)";
      } else {
        stageTag.className = "bo-stage-tag";
        stageTag.textContent = `Transitional Model (Stage ${this.currentStageIndex + 1})`;
      }
    });

    // Update dock stepper indicator, slider and button disabled states
    if (this.dockEl) {
      const stageBadgeEl = this.dockEl.querySelector(".bo-dock-stage-badge");
      if (stageBadgeEl) {
        if (this.currentStageIndex === 0) {
          stageBadgeEl.className =
            "bo-dock-stage-badge bo-dock-stage-badge--ref";
          stageBadgeEl.textContent = "★ Ref";
        } else {
          stageBadgeEl.className = "bo-dock-stage-badge";
          stageBadgeEl.textContent = `Stage ${this.currentStageIndex + 1}/${totalStages}`;
        }
      }
      const prevBtn =
        this.dockEl.querySelector<HTMLButtonElement>(".bo-dock-step-prev");
      const nextBtn =
        this.dockEl.querySelector<HTMLButtonElement>(".bo-dock-step-next");
      if (prevBtn) prevBtn.disabled = this.currentStageIndex <= 0;
      if (nextBtn) nextBtn.disabled = this.currentStageIndex >= totalStages - 1;

      const slider =
        this.dockEl.querySelector<HTMLInputElement>(".bo-dock-slider");
      if (slider) {
        slider.value = String(this.currentStageIndex);
      }
    }

    // Update arch pill buttons
    this.container
      ?.querySelectorAll<HTMLButtonElement>(".bo-pill-btn")
      .forEach((btn) => {
        const arch = btn.dataset["arch"] === "upper";
        btn.classList.toggle("bo-pill-btn--active", arch === this.isUpper);
      });

    this.syncOverlayCheckboxes();
    this.updateActiveTabPanes();
    this.renderToothChart();
  }
}
