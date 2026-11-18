// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from "vitest";
import {
  BufferAttribute,
  BufferGeometry,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
} from "three";
import { BlockoutStudio } from "../src/treatment-viewer/blockout/blockout-studio";
import type { Viewport } from "../src/viewer/viewport";
import type { CaseManifest } from "../src/treatment-viewer/stage-manifest";

describe("Blockout Studio UI & Interaction", () => {
  let mockScene: Scene;
  let mockCamera: PerspectiveCamera;
  let mockLayerMesh: Mesh;
  let mockGeom: BufferGeometry;
  let mockViewport: Viewport;
  let manifest: CaseManifest;

  beforeEach(() => {
    mockScene = new Scene();
    mockCamera = new PerspectiveCamera(45, 1, 0.1, 1000);

    mockGeom = new BufferGeometry();
    const positions = new Float32Array([
      -10, 0, 0,
       10, 0, 0,
        0, 10, 0,
    ]);
    mockGeom.setAttribute("position", new BufferAttribute(positions, 3));
    mockGeom.computeVertexNormals();

    mockLayerMesh = new Mesh(mockGeom, new MeshStandardMaterial());
    mockScene.add(mockLayerMesh);

    mockViewport = {
      addLayer: () => ({ ok: true }),
      clearLayers: () => {},
      removeLayer: () => {},
      getLayerGeometry: () => mockGeom,
      setLayerGeometry: () => {},
      getLayerMesh: () => mockLayerMesh,
      getThreeScene: () => mockScene,
      getThreeCamera: () => mockCamera,
      getThreeRenderer: () => ({} as any),
      setLayerVisible: () => {},
      setLayerOpacity: () => {},
      setLayerColour: () => {},
      setLayerTransform: () => {},
      setLayerSurface: () => {},
      setLayerSmoothing: () => {},
      isolate: () => {},
      setSeparation: () => {},
      fitAll: () => {},
      fitLayer: () => {},
      setOrbitCentreAt: () => false,
      setView: () => {},
      setGridVisible: () => {},
      getCamera: () => ({ position: [0, 0, 100], target: [0, 0, 0], fov: 45 }),
      setCamera: () => {},
      dispose: () => {},
    };

    manifest = {
      caseId: "test-case-1",
      patientName: "Niya",
      archType: "both",
      templateStages: [],
      ambiguities: [],
      treatmentStages: [
        { id: "stage-01", stageNumber: 1, label: "Stage 1", doctorOnly: false, upper: { url: "u1.glb", filename: "u1.glb" } },
        { id: "stage-02", stageNumber: 2, label: "Stage 2", doctorOnly: false, upper: { url: "u2.glb", filename: "u2.glb" } },
      ],
    };
  });

  it("mounts studio panel into container and renders all controls", () => {
    const container = document.createElement("div");
    const studio = new BlockoutStudio({
      viewport: mockViewport,
      manifest,
      initialArch: "upper",
      initialStageIndex: 0,
    });

    studio.mount(container);

    const panel = container.querySelector(".bo-studio-panel");
    expect(panel).not.toBeNull();

    // Check Header (Milestone 4 badge removed)
    expect(panel?.querySelector(".bo-title")?.textContent).toBe("Undercut & Blockout Studio");
    expect(panel?.querySelector(".bo-badge")).toBeNull();

    // Check Minimize button & Restore pill
    expect(panel?.querySelector(".bo-btn-minimize")).not.toBeNull();
    const expandPill = container.querySelector(".bo-expand-pill");
    expect(expandPill).not.toBeNull();

    // Check Bottom Dock
    const dock = container.querySelector(".bo-bottom-dock");
    expect(dock).not.toBeNull();
    expect(dock?.querySelector(".bo-dock-overlays")).not.toBeNull();
    expect(dock?.querySelector(".bo-dock-timeline")).not.toBeNull();
    expect(dock?.querySelector(".bo-dock-slider")).not.toBeNull();
    expect(dock?.querySelector(".bo-metric-max")).not.toBeNull();
    expect(dock?.querySelector(".bo-btn-propagate")).not.toBeNull();

    // Check Reference Stage Tag
    const stageTag = panel?.querySelector(".bo-stage-tag");
    expect(stageTag?.textContent).toContain("Stage 1 (Reference Model)");

    // Check FDI Tooth Chart
    const toothBtns = panel?.querySelectorAll(".bo-tooth-btn");
    expect(toothBtns?.length).toBeGreaterThan(0);

    studio.unmount();
    expect(container.querySelector(".bo-studio-panel")).toBeNull();
    expect(container.querySelector(".bo-bottom-dock")).toBeNull();
    expect(container.querySelector(".bo-expand-pill")).toBeNull();
  });

  it("switches tabs between Blockout, Wax Carver, and Print Prep", () => {
    let activeTabReported: string | null = null;
    const container = document.createElement("div");
    const studio = new BlockoutStudio({
      viewport: mockViewport,
      manifest,
      onTabChange: (tab) => {
        activeTabReported = tab;
      },
    });
    studio.mount(container);

    const paneBlockout = container.querySelector(".bo-pane-blockout");
    const paneSculpt = container.querySelector(".bo-pane-sculpt");
    const panePrep = container.querySelector(".bo-pane-prep");

    expect(paneBlockout?.classList.contains("bo-pane--hidden")).toBe(false);
    expect(paneSculpt?.classList.contains("bo-pane--hidden")).toBe(true);

    // Switch to Wax Carver (Sculpt) Tab
    studio.setActiveTab("sculpt");
    expect(activeTabReported).toBe("sculpt");
    expect(studio.getActiveTab()).toBe("sculpt");
    expect(paneBlockout?.classList.contains("bo-pane--hidden")).toBe(true);
    expect(paneSculpt?.classList.contains("bo-pane--hidden")).toBe(false);

    // Switch to Print Prep Tab
    studio.setActiveTab("prep");
    expect(activeTabReported).toBe("prep");
    expect(studio.getActiveTab()).toBe("prep");
    expect(panePrep?.classList.contains("bo-pane--hidden")).toBe(false);

    studio.unmount();
  });

  it("minimizes and restores panel with minimize button and restore pill", () => {
    const container = document.createElement("div");
    const studio = new BlockoutStudio({
      viewport: mockViewport,
      manifest,
    });
    studio.mount(container);

    const panel = container.querySelector(".bo-studio-panel");
    const expandPill = container.querySelector(".bo-expand-pill");
    const btnMinimize = container.querySelector<HTMLButtonElement>(".bo-btn-minimize");

    expect(studio.isPanelMinimized()).toBe(false);
    expect(panel?.classList.contains("bo-studio-panel--minimized")).toBe(false);

    // Click minimize button
    btnMinimize?.click();
    expect(studio.isPanelMinimized()).toBe(true);
    expect(panel?.classList.contains("bo-studio-panel--minimized")).toBe(true);
    expect(expandPill?.classList.contains("bo-expand-pill--visible")).toBe(true);

    // Clicking restore pill expands the panel
    (expandPill as HTMLButtonElement)?.click();
    expect(studio.isPanelMinimized()).toBe(false);
    expect(panel?.classList.contains("bo-studio-panel--minimized")).toBe(false);
    expect(expandPill?.classList.contains("bo-expand-pill--visible")).toBe(false);

    // Switching active tab also automatically unminimizes
    studio.setMinimized(true);
    expect(studio.isPanelMinimized()).toBe(true);
    studio.setActiveTab("sculpt");
    expect(studio.isPanelMinimized()).toBe(false);

    studio.unmount();
  });

  it("handles bottom dock quick overlay toggles and stage slider", () => {
    const container = document.createElement("div");
    const studio = new BlockoutStudio({
      viewport: mockViewport,
      manifest,
    });
    studio.mount(container);

    const dock = container.querySelector(".bo-bottom-dock");
    const waxPill = dock?.querySelector<HTMLButtonElement>(".bo-dock-pill--wax");
    const heatPill = dock?.querySelector<HTMLButtonElement>(".bo-dock-pill--heatmap");
    const slider = dock?.querySelector<HTMLInputElement>(".bo-dock-slider");

    expect(waxPill?.classList.contains("bo-dock-pill--active")).toBe(true);
    expect(heatPill?.classList.contains("bo-dock-pill--active")).toBe(false);

    // Toggle wax
    waxPill?.click();
    expect(waxPill?.classList.contains("bo-dock-pill--active")).toBe(false);

    // Toggle heatmap
    heatPill?.click();
    expect(heatPill?.classList.contains("bo-dock-pill--active")).toBe(true);

    // Scrub slider
    studio.setStageIndex(1);
    expect(slider?.value).toBe("1");

    studio.unmount();
  });

  it("switches arch and updates tooth matrix and stage tags", () => {
    const container = document.createElement("div");
    const studio = new BlockoutStudio({
      viewport: mockViewport,
      manifest,
      initialArch: "upper",
    });
    studio.mount(container);

    // Switch to lower arch
    studio.setArch("lower");
    const lowerBtn = container.querySelector<HTMLButtonElement>('.bo-pill-btn[data-arch="lower"]');
    expect(lowerBtn?.classList.contains("bo-pill-btn--active")).toBe(true);

    // Change stage to Stage 2
    studio.setStageIndex(1);
    const stageTag = container.querySelector(".bo-stage-tag");
    expect(stageTag?.textContent).toContain("Transitional Model (Stage 2)");

    studio.unmount();
  });

  it("fires onArchChange callback and exposes getArch and getStageIndex", () => {
    let changedArch: string | null = null;
    const container = document.createElement("div");
    const studio = new BlockoutStudio({
      viewport: mockViewport,
      manifest,
      initialArch: "upper",
      onArchChange: (arch) => {
        changedArch = arch;
      },
    });
    studio.mount(container);

    expect(studio.getArch()).toBe("upper");
    expect(studio.getStageIndex()).toBe(0);

    studio.setArch("lower");
    expect(changedArch).toBe("lower");
    expect(studio.getArch()).toBe("lower");

    studio.unmount();
  });
});
