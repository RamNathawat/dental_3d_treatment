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

    // Check Header and Milestone 4 Badge
    expect(panel?.querySelector(".bo-title")?.textContent).toBe("Undercut & Blockout Studio");
    expect(panel?.querySelector(".bo-badge")?.textContent).toBe("Milestone 4 CAD Engine");

    // Check Reference Stage Tag
    const stageTag = panel?.querySelector(".bo-stage-tag");
    expect(stageTag?.textContent).toContain("Stage 1 (Reference Model)");

    // Check Navigation Tabs
    const tabs = panel?.querySelectorAll(".bo-tab");
    expect(tabs?.length).toBe(3);

    // Check FDI Tooth Chart
    const toothBtns = panel?.querySelectorAll(".bo-tooth-btn");
    expect(toothBtns?.length).toBeGreaterThan(0);

    studio.unmount();
    expect(container.querySelector(".bo-studio-panel")).toBeNull();
  });

  it("switches tabs between Blockout, Wax Carver, and Print Prep", () => {
    const container = document.createElement("div");
    const studio = new BlockoutStudio({
      viewport: mockViewport,
      manifest,
    });
    studio.mount(container);

    const tabs = container.querySelectorAll<HTMLButtonElement>(".bo-tab");
    const paneBlockout = container.querySelector(".bo-pane-blockout");
    const paneSculpt = container.querySelector(".bo-pane-sculpt");
    const panePrep = container.querySelector(".bo-pane-prep");

    expect(paneBlockout?.classList.contains("bo-pane--hidden")).toBe(false);
    expect(paneSculpt?.classList.contains("bo-pane--hidden")).toBe(true);

    // Switch to Wax Carver (Sculpt) Tab
    tabs[1]?.click();
    expect(paneBlockout?.classList.contains("bo-pane--hidden")).toBe(true);
    expect(paneSculpt?.classList.contains("bo-pane--hidden")).toBe(false);

    // Switch to Print Prep Tab
    tabs[2]?.click();
    expect(panePrep?.classList.contains("bo-pane--hidden")).toBe(false);

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
});
