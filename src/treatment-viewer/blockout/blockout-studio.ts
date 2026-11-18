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
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
} from "three";
import type { Viewport } from "../../viewer/viewport";
import type { CaseManifest } from "../stage-manifest";
import type {
  BlockoutProtocol,
  SculptMode,
  StageBlockoutResult,
} from "./types";
import { generateBlockout } from "./blockout-generator";
import { WaxSculptor } from "./wax-sculptor";
import {
  createBatchStlZip,
  createNestedBuildPlateGeometry,
  downloadFile,
  exportBinaryStl,
  prepareGeometryForPrint,
} from "./print-prep";

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
    interproximal: { enabled: true, thicknessMm: 0.6, bridgeSpaces: true },
    gingival: { enabled: false, reliefMm: 0.3, excludeEdentulous: true },
    undercut: {
      enabled: true,
      maxDepthMm: 0.5,
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
  private stageSculptDeltas = new Map<number, Map<number, [number, number, number]>>();

  // 3D Objects in Viewport Scene
  private threeScene: Scene | null = null;
  private threeCamera: PerspectiveCamera | null = null;
  private waxMesh: Mesh | null = null;
  private waxMaterial: MeshPhysicalMaterial;
  private sculptor: WaxSculptor | null = null;

  // UI State
  private activeTab: "blockout" | "sculpt" | "prep" = "blockout";
  private showHeatmap = false;
  private showWaxOverlay = true;

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

    this.threeScene = this.viewport.getThreeScene ? this.viewport.getThreeScene() : null;
    this.threeCamera = this.viewport.getThreeCamera ? this.viewport.getThreeCamera() : null;

    // Realistic dental wax red material (#dc2626 / crimson)
    this.waxMaterial = new MeshPhysicalMaterial({
      color: new Color(0xdc2626),
      roughness: 0.28,
      metalness: 0.04,
      transmission: 0.12,
      thickness: 0.8,
      clearcoat: 0.35,
      clearcoatRoughness: 0.2,
      transparent: true,
      opacity: 0.94,
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
    this.initWaxMesh();
    this.initSculptor();
    this.renderUI();
    this.loadCurrentStageBlockout();
  }

  public unmount(): void {
    if (this.sculptor) {
      this.sculptor.dispose();
      this.sculptor = null;
    }
    if (this.waxMesh && this.threeScene) {
      this.threeScene.remove(this.waxMesh);
      this.waxMesh.geometry.dispose();
      this.waxMesh = null;
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
    this.showWaxOverlay = typeof show === "boolean" ? show : !this.showWaxOverlay;
    if (this.waxMesh) {
      this.waxMesh.visible = this.showWaxOverlay;
    }
    this.syncOverlayCheckboxes();
    return this.showWaxOverlay;
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
    this.protocol.insertionAxis.y = this.isUpper ? -1 : 1;
    this.stageResults.clear();
    this.stageSculptDeltas.clear();
    this.loadCurrentStageBlockout();
    this.updateUI();
    if (this.onArchChangeCallback) {
      this.onArchChangeCallback(arch);
    }
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
  }

  private initSculptor(): void {
    if (!this.threeScene || !this.threeCamera || !this.container) return;
    const domEl = this.container.querySelector("canvas") || this.container;

    this.sculptor = new WaxSculptor(
      this.threeScene,
      this.threeCamera,
      domEl as HTMLElement,
      (evt) => {
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
    return this.viewport.getLayerGeometry(this.getLayerId());
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
      );
      this.stageResults.set(this.currentStageIndex, result);
    }

    this.applyResultTo3D(result);
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
    );
    this.stageResults.set(this.currentStageIndex, result);
    this.applyResultTo3D(result);
  }

  private applyResultTo3D(result: StageBlockoutResult): void {
    // 1. Digital Wax Overlay Mesh
    if (this.waxMesh) {
      if (this.showWaxOverlay && result.waxGeometry) {
        this.waxMesh.geometry.dispose();
        this.waxMesh.geometry = result.waxGeometry;
        this.waxMesh.visible = true;
      } else {
        this.waxMesh.visible = false;
      }
    }

    // 2. Base Mesh Shading (Heatmap or Anatomical)
    const baseGeom = this.getBaseGeometry();
    if (baseGeom) {
      if (this.showHeatmap && result.survey) {
        baseGeom.setAttribute("color", new BufferAttribute(result.survey.heatmapColors, 3));
        const layerMesh = this.viewport.getLayerMesh ? this.viewport.getLayerMesh(this.getLayerId()) : null;
        if (layerMesh && layerMesh.material instanceof MeshStandardMaterial) {
          layerMesh.material.vertexColors = true;
          layerMesh.material.needsUpdate = true;
        }
      } else {
        this.restoreBaseColors();
      }
    }

    // 3. Connect target mesh to sculptor
    if (this.sculptor && this.viewport.getLayerMesh) {
      const layerMesh = this.viewport.getLayerMesh(this.getLayerId());
      this.sculptor.setTargetMesh(layerMesh, result.stageId);
      this.sculptor.setStageDeltas(result.stageId, result.sculptDeltas);
    }

    this.updateMetricsDisplay(result);
  }

  private restoreBaseColors(): void {
    const baseGeom = this.getBaseGeometry();
    if (!baseGeom) return;
    if (baseGeom.userData.baseColors instanceof BufferAttribute) {
      baseGeom.setAttribute("color", baseGeom.userData.baseColors.clone());
    }
    const layerMesh = this.viewport.getLayerMesh ? this.viewport.getLayerMesh(this.getLayerId()) : null;
    if (layerMesh && layerMesh.material instanceof MeshStandardMaterial) {
      layerMesh.material.vertexColors = true;
      layerMesh.material.needsUpdate = true;
    }
  }

  // ─── Batch Propagation to All Transitional Models ─────────────────────────

  private async propagateToAllStages(): Promise<void> {
    if (this.isBatchProcessing) return;
    this.isBatchProcessing = true;

    const totalStages = this.manifest.treatmentStages.length;
    const progressEls = this.container?.querySelectorAll<HTMLElement>(".bo-propagate-progress");
    const progressBars = this.container?.querySelectorAll<HTMLElement>(".bo-progress-bar-fill");
    const progressLabels = this.container?.querySelectorAll<HTMLElement>(".bo-progress-label");

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

  private async exportCurrentStageStl(): Promise<void> {
    const result = this.stageResults.get(this.currentStageIndex);
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
      let res = this.stageResults.get(i);
      if (!res) {
        res = generateBlockout(
          baseGeom,
          this.isUpper,
          this.protocol,
          i + 1,
          `stage-${String(i + 1).padStart(2, "0")}`,
          this.stageSculptDeltas.get(i),
        );
        this.stageResults.set(i, res);
      }
      list.push(res);
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
      let res = this.stageResults.get(i);
      if (!res) {
        res = generateBlockout(
          baseGeom,
          this.isUpper,
          this.protocol,
          i + 1,
          `stage-${String(i + 1).padStart(2, "0")}`,
          this.stageSculptDeltas.get(i),
        );
        this.stageResults.set(i, res);
      }
      list.push(res);
    }

    const nested = createNestedBuildPlateGeometry(list, this.protocol.printPrep);
    if (!nested) return;

    const patientName = this.manifest.patientName ?? this.manifest.caseId;
    const filename = `${patientName}_${this.isUpper ? "Upper" : "Lower"}_Nested_BuildPlate.stl`;
    const bytes = exportBinaryStl(nested, filename);
    downloadFile(bytes, filename);
  }

  // ─── UI Rendering (Responsive Drawer / Bottom Sheet) ──────────────────────

  private renderUI(): void {
    if (!this.container) return;

    const panel = document.createElement("div");
    panel.className = "bo-studio-panel";
    this.panelEl = panel;

    panel.innerHTML = `
      <div class="bo-header">
        <div class="bo-title-group">
          <h2 class="bo-title">Undercut &amp; Blockout Studio</h2>
          <span class="bo-panel-mode-label">Step 1: Undercut Survey &amp; Blockout</span>
        </div>
        <button type="button" class="bo-btn-minimize" title="Minimize Panel (inspect 3D model)">
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
          <!-- Survey & Overlays -->
          <div class="bo-section">
            <h4 class="bo-section-title">Visual Overlays</h4>
            <div class="bo-toggle-row">
              <label class="bo-switch">
                <input type="checkbox" class="bo-chk-wax" ${this.showWaxOverlay ? "checked" : ""}>
                <span class="bo-slider"></span>
              </label>
              <span class="bo-toggle-label">Show Red Digital Wax</span>
            </div>
            <div class="bo-toggle-row">
              <label class="bo-switch">
                <input type="checkbox" class="bo-chk-heatmap" ${this.showHeatmap ? "checked" : ""}>
                <span class="bo-slider"></span>
              </label>
              <span class="bo-toggle-label">Survey Undercut Heatmap</span>
            </div>
          </div>

          <!-- Component 1: Interproximal Wax -->
          <div class="bo-section">
            <div class="bo-section-header">
              <h4 class="bo-section-title">1. Interproximal Wax</h4>
              <label class="bo-switch">
                <input type="checkbox" class="bo-chk-prox" ${this.protocol.interproximal.enabled ? "checked" : ""}>
                <span class="bo-slider"></span>
              </label>
            </div>
            <p class="bo-desc">Bridges narrow embrasures between adjacent teeth to prevent aligner lock.</p>
            <div class="bo-range-group">
              <div class="bo-range-meta">
                <span>Wax Thickness</span>
                <span class="bo-range-val bo-val-prox">${this.protocol.interproximal.thicknessMm.toFixed(2)} mm</span>
              </div>
              <input type="range" class="bo-range-input bo-range-prox" min="0.1" max="1.5" step="0.05" value="${this.protocol.interproximal.thicknessMm}">
            </div>
            <label class="bo-checkbox-label">
              <input type="checkbox" class="bo-chk-bridge" ${this.protocol.interproximal.bridgeSpaces ? "checked" : ""}>
              <span>Bridge Missing Tooth / Edentulous Spans</span>
            </label>
          </div>

          <!-- Component 2: Gingival Line Relief -->
          <div class="bo-section">
            <div class="bo-section-header">
              <h4 class="bo-section-title">2. Gingival Margin Relief</h4>
              <label class="bo-switch">
                <input type="checkbox" class="bo-chk-ging" ${this.protocol.gingival.enabled ? "checked" : ""}>
                <span class="bo-slider"></span>
              </label>
            </div>
            <p class="bo-desc">Doctor decides per case. Relieves cervical constriction along the tooth-gum junction.</p>
            <div class="bo-range-group">
              <div class="bo-range-meta">
                <span>Margin Relief</span>
                <span class="bo-range-val bo-val-ging">${this.protocol.gingival.reliefMm.toFixed(2)} mm</span>
              </div>
              <input type="range" class="bo-range-input bo-range-ging" min="0.1" max="0.8" step="0.05" value="${this.protocol.gingival.reliefMm}">
            </div>
          </div>

          <!-- Component 3: Dentition Undercut Blockout -->
          <div class="bo-section">
            <div class="bo-section-header">
              <h4 class="bo-section-title">3. Dentition Undercuts</h4>
              <label class="bo-switch">
                <input type="checkbox" class="bo-chk-uc" ${this.protocol.undercut.enabled ? "checked" : ""}>
                <span class="bo-slider"></span>
              </label>
            </div>
            <p class="bo-desc">Blocks retentive undercuts below maximum contour along the draw axis.</p>
            <div class="bo-range-group">
              <div class="bo-range-meta">
                <span>Max Allowable Depth</span>
                <span class="bo-range-val bo-val-uc">${this.protocol.undercut.maxDepthMm.toFixed(2)} mm</span>
              </div>
              <input type="range" class="bo-range-input bo-range-uc" min="0.1" max="1.2" step="0.05" value="${this.protocol.undercut.maxDepthMm}">
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
        <button type="button" class="bo-btn-propagate" title="Approve reference protocol and apply across all transitional stages">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span>Approve Protocol &amp; Apply to All Stages</span>
        </button>
      </div>
    `;

    // 2. CAD Studio Floating Center Dock (Compact & purpose-built)
    const totalStages = this.manifest.treatmentStages.length || 1;
    const dock = document.createElement("div");
    dock.className = "bo-bottom-dock";
    this.dockEl = dock;

    dock.innerHTML = `
      <!-- Overlays (Red Wax & Heatmap) -->
      <div class="bo-dock-group bo-dock-overlays">
        <button type="button" class="bo-dock-pill bo-dock-pill--wax ${this.showWaxOverlay ? "bo-dock-pill--active" : ""}" title="Toggle Red Digital Wax 3D Layer">
          <span class="bo-dock-pill-dot bo-dock-pill-dot--red"></span>
          <span>Wax</span>
        </button>
        <button type="button" class="bo-dock-pill bo-dock-pill--heatmap ${this.showHeatmap ? "bo-dock-pill--active" : ""}" title="Toggle Clinical Undercut Heatmap">
          <span class="bo-dock-pill-dot bo-dock-pill-dot--heat"></span>
          <span>Heatmap</span>
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

      <div class="bo-dock-divider"></div>

      <!-- Camera Reset -->
      <div class="bo-dock-group">
        <button type="button" class="bo-dock-icon-btn bo-dock-btn-reset" title="Reset frontal camera view">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
          </svg>
        </button>
      </div>
    `;

    // 3. Floating Restore Pill (When panel is minimized)
    const expandPill = document.createElement("button");
    expandPill.type = "button";
    expandPill.className = "bo-expand-pill";
    expandPill.title = "Restore CAD Tools Panel";
    expandPill.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
      <span>CAD Tools</span>
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
    this.panelEl.querySelector(".bo-btn-minimize")?.addEventListener("click", () => {
      this.setMinimized(true);
    });

    // Arch Selector
    this.panelEl.querySelectorAll<HTMLButtonElement>(".bo-pill-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const arch = btn.dataset["arch"] as "upper" | "lower";
        this.setArch(arch);
      });
    });

    // Internal Tabs if present
    this.panelEl.querySelectorAll<HTMLButtonElement>(".bo-tab").forEach((tab) => {
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

    const chkHeatmap = this.panelEl.querySelector<HTMLInputElement>(".bo-chk-heatmap");
    chkHeatmap?.addEventListener("change", () => {
      this.toggleHeatmap(chkHeatmap.checked);
    });

    // Component 1: Interproximal
    const chkProx = this.panelEl.querySelector<HTMLInputElement>(".bo-chk-prox");
    chkProx?.addEventListener("change", () => {
      this.protocol.interproximal.enabled = chkProx.checked;
      this.recomputeCurrentBlockout();
    });

    const rngProx = this.panelEl.querySelector<HTMLInputElement>(".bo-range-prox");
    rngProx?.addEventListener("input", () => {
      const val = parseFloat(rngProx.value);
      this.protocol.interproximal.thicknessMm = val;
      const lbl = this.panelEl?.querySelector(".bo-val-prox");
      if (lbl) lbl.textContent = `${val.toFixed(2)} mm`;
      this.recomputeCurrentBlockout();
    });

    const chkBridge = this.panelEl.querySelector<HTMLInputElement>(".bo-chk-bridge");
    chkBridge?.addEventListener("change", () => {
      this.protocol.interproximal.bridgeSpaces = chkBridge.checked;
      this.recomputeCurrentBlockout();
    });

    // Component 2: Gingival
    const chkGing = this.panelEl.querySelector<HTMLInputElement>(".bo-chk-ging");
    chkGing?.addEventListener("change", () => {
      this.protocol.gingival.enabled = chkGing.checked;
      this.recomputeCurrentBlockout();
    });

    const rngGing = this.panelEl.querySelector<HTMLInputElement>(".bo-range-ging");
    rngGing?.addEventListener("input", () => {
      const val = parseFloat(rngGing.value);
      this.protocol.gingival.reliefMm = val;
      const lbl = this.panelEl?.querySelector(".bo-val-ging");
      if (lbl) lbl.textContent = `${val.toFixed(2)} mm`;
      this.recomputeCurrentBlockout();
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
      this.recomputeCurrentBlockout();
    });

    // Component 4: Sculpt Tools
    this.panelEl.querySelectorAll<HTMLButtonElement>(".bo-mode-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.dataset["mode"] as SculptMode;
        this.panelEl?.querySelectorAll(".bo-mode-btn").forEach((b) => b.classList.remove("bo-mode-btn--active"));
        btn.classList.add("bo-mode-btn--active");
        if (this.sculptor) {
          this.sculptor.setConfig({ mode });
        }
      });
    });

    const rngRadius = this.panelEl.querySelector<HTMLInputElement>(".bo-range-radius");
    rngRadius?.addEventListener("input", () => {
      const val = parseFloat(rngRadius.value);
      const lbl = this.panelEl?.querySelector(".bo-val-radius");
      if (lbl) lbl.textContent = `${val.toFixed(1)} mm`;
      if (this.sculptor) this.sculptor.setConfig({ radiusMm: val });
    });

    const rngStrength = this.panelEl.querySelector<HTMLInputElement>(".bo-range-strength");
    rngStrength?.addEventListener("input", () => {
      const val = parseFloat(rngStrength.value);
      const lbl = this.panelEl?.querySelector(".bo-val-strength");
      if (lbl) lbl.textContent = `${Math.round(val * 100)}%`;
      if (this.sculptor) this.sculptor.setConfig({ strength: val });
    });

    const btnUndo = this.panelEl.querySelector<HTMLButtonElement>(".bo-btn-undo");
    btnUndo?.addEventListener("click", () => {
      if (this.sculptor) this.sculptor.undo();
    });

    const btnRedo = this.panelEl.querySelector<HTMLButtonElement>(".bo-btn-redo");
    btnRedo?.addEventListener("click", () => {
      if (this.sculptor) this.sculptor.redo();
    });

    // Component 5: Print Prep & Scale
    const rngShrink = this.panelEl.querySelector<HTMLInputElement>(".bo-range-shrink");
    rngShrink?.addEventListener("input", () => {
      const val = parseFloat(rngShrink.value);
      this.protocol.printPrep.shrinkageScalePercent = val;
      const lbl = this.panelEl?.querySelector(".bo-val-shrink");
      if (lbl) lbl.textContent = `${val.toFixed(1)}%`;
    });

    const btnAddHole = this.panelEl.querySelector<HTMLButtonElement>(".bo-btn-add-hole");
    btnAddHole?.addEventListener("click", () => {
      // Add standard bilateral suction holes at the posterior palate / base
      this.protocol.printPrep.drainHoles = [
        { id: "hole-left", position: [-18, 0, -10], normal: [0, 1, 0], diameterMm: 3.0 },
        { id: "hole-right", position: [18, 0, -10], normal: [0, 1, 0], diameterMm: 3.0 },
      ];
      this.renderHolesList();
      this.recomputeCurrentBlockout();
    });

    // Export Buttons
    this.panelEl.querySelector(".bo-btn-export-stage")?.addEventListener("click", () => this.exportCurrentStageStl());
    this.panelEl.querySelector(".bo-btn-export-all")?.addEventListener("click", () => this.exportAllStagesZip());
    this.panelEl.querySelector(".bo-btn-export-nested")?.addEventListener("click", () => this.exportNestedBuildPlateStl());

    // Batch Propagate CTA
    this.panelEl.querySelector(".bo-btn-propagate")?.addEventListener("click", () => this.propagateToAllStages());
  }

  private bindDockEvents(): void {
    if (!this.dockEl) return;

    // Quick overlay toggles
    this.dockEl.querySelector(".bo-dock-pill--wax")?.addEventListener("click", () => {
      this.toggleWaxOverlay();
    });

    this.dockEl.querySelector(".bo-dock-pill--heatmap")?.addEventListener("click", () => {
      this.toggleHeatmap();
    });

    const prevBtn = this.dockEl.querySelector<HTMLButtonElement>(".bo-dock-step-prev");
    const nextBtn = this.dockEl.querySelector<HTMLButtonElement>(".bo-dock-step-next");
    const slider = this.dockEl.querySelector<HTMLInputElement>(".bo-dock-slider");

    prevBtn?.addEventListener("click", () => {
      if (this.currentStageIndex > 0) {
        this.setStageIndex(this.currentStageIndex - 1);
      }
    });

    nextBtn?.addEventListener("click", () => {
      const total = this.manifest.treatmentStages.length;
      if (this.currentStageIndex < total - 1) {
        this.setStageIndex(this.currentStageIndex + 1);
      }
    });

    slider?.addEventListener("input", () => {
      const target = parseInt(slider.value, 10);
      if (!isNaN(target)) {
        this.setStageIndex(target);
      }
    });

    this.dockEl.querySelector(".bo-dock-btn-reset")?.addEventListener("click", () => {
      this.viewport.setView("top");
      this.viewport.fitAll();
    });

    this.dockEl.querySelector(".bo-btn-propagate")?.addEventListener("click", () => {
      this.propagateToAllStages();
    });
  }

  private updateActiveTabPanes(): void {
    if (!this.panelEl) return;
    const paneBlockout = this.panelEl.querySelector(".bo-pane-blockout");
    const paneSculpt = this.panelEl.querySelector(".bo-pane-sculpt");
    const panePrep = this.panelEl.querySelector(".bo-pane-prep");
    const modeLabel = this.panelEl.querySelector(".bo-panel-mode-label");

    paneBlockout?.classList.toggle("bo-pane--hidden", this.activeTab !== "blockout");
    paneSculpt?.classList.toggle("bo-pane--hidden", this.activeTab !== "sculpt");
    panePrep?.classList.toggle("bo-pane--hidden", this.activeTab !== "prep");

    if (modeLabel) {
      if (this.activeTab === "blockout") modeLabel.textContent = "Step 1: Undercut Survey & Wax Blockout";
      else if (this.activeTab === "sculpt") modeLabel.textContent = "Step 2: Digital Wax Carver (Hot Spatula)";
      else if (this.activeTab === "prep") modeLabel.textContent = "Step 3: Print Prep, Drainage & STL Export";
    }

    this.panelEl.querySelectorAll<HTMLButtonElement>(".bo-tab").forEach((btn) => {
      btn.classList.toggle("bo-tab--active", btn.dataset["tab"] === this.activeTab);
    });
  }

  private syncOverlayCheckboxes(): void {
    const waxChks = this.container?.querySelectorAll<HTMLInputElement>(".bo-chk-wax");
    waxChks?.forEach((chk) => {
      chk.checked = this.showWaxOverlay;
    });
    const heatChks = this.container?.querySelectorAll<HTMLInputElement>(".bo-chk-heatmap");
    heatChks?.forEach((chk) => {
      chk.checked = this.showHeatmap;
    });

    const dockWax = this.dockEl?.querySelector<HTMLButtonElement>(".bo-dock-pill--wax");
    dockWax?.classList.toggle("bo-dock-pill--active", this.showWaxOverlay);

    const dockHeat = this.dockEl?.querySelector<HTMLButtonElement>(".bo-dock-pill--heatmap");
    dockHeat?.classList.toggle("bo-dock-pill--active", this.showHeatmap);
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
    if (!result.survey) return;
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

  private updateUndoRedoButtons(): void {
    if (!this.panelEl || !this.sculptor) return;
    const btnUndo = this.panelEl.querySelector<HTMLButtonElement>(".bo-btn-undo");
    const btnRedo = this.panelEl.querySelector<HTMLButtonElement>(".bo-btn-redo");
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
          stageBadgeEl.className = "bo-dock-stage-badge bo-dock-stage-badge--ref";
          stageBadgeEl.textContent = "★ Ref";
        } else {
          stageBadgeEl.className = "bo-dock-stage-badge";
          stageBadgeEl.textContent = `Stage ${this.currentStageIndex + 1}/${totalStages}`;
        }
      }
      const prevBtn = this.dockEl.querySelector<HTMLButtonElement>(".bo-dock-step-prev");
      const nextBtn = this.dockEl.querySelector<HTMLButtonElement>(".bo-dock-step-next");
      if (prevBtn) prevBtn.disabled = this.currentStageIndex <= 0;
      if (nextBtn) nextBtn.disabled = this.currentStageIndex >= totalStages - 1;

      const slider = this.dockEl.querySelector<HTMLInputElement>(".bo-dock-slider");
      if (slider) {
        slider.value = String(this.currentStageIndex);
      }
    }

    // Update arch pill buttons
    this.container?.querySelectorAll<HTMLButtonElement>(".bo-pill-btn").forEach((btn) => {
      const arch = btn.dataset["arch"] === "upper";
      btn.classList.toggle("bo-pill-btn--active", arch === this.isUpper);
    });

    this.syncOverlayCheckboxes();
    this.updateActiveTabPanes();
    this.renderToothChart();
  }
}
