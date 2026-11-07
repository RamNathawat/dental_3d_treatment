// @vitest-environment happy-dom
import { describe, expect, it, vi } from "vitest";
import { BufferAttribute, BufferGeometry } from "three";
import { createViewport } from "../src/viewer/three-viewport";
import { showMeasured, showOwnColour } from "../src/viewer/layer-surface";

vi.mock("three", async (importOriginal) => {
  const actual: any = await importOriginal();
  class MockWebGLRenderer {
    domElement = document.createElement("canvas");
    toneMapping = 0;
    toneMappingExposure = 1;
    setPixelRatio() {}
    setSize() {}
    render() {}
    setAnimationLoop() {}
    dispose() {}
  }
  class MockPMREMGenerator {
    constructor() {}
    fromScene() {
      return { texture: { dispose() {} } };
    }
    dispose() {}
  }
  return {
    ...actual,
    WebGLRenderer: MockWebGLRenderer,
    PMREMGenerator: MockPMREMGenerator,
  };
});

describe("Model Color, Texture, and PBR Styling Retention", () => {
  it("preserves GLB vertex colors when toggling contacts and restoring anatomical mode", () => {
    const canvas = document.createElement("canvas");
    const viewport = createViewport(canvas);

    const geom = new BufferGeometry();
    const positions = new Float32Array([
      0, 0, 0,
      1, 0, 0,
      0, 1, 0,
    ]);
    // Native GLB colors: Warm ivory enamel (0.82, 0.76, 0.68)
    const originalColors = new Float32Array([
      0.82, 0.76, 0.68,
      0.82, 0.76, 0.68,
      0.96, 0.52, 0.16, // Amber attachment
    ]);
    geom.setAttribute("position", new BufferAttribute(positions, 3));
    geom.setAttribute("color", new BufferAttribute(originalColors, 3));
    geom.userData.baseColors = geom.getAttribute("color")!.clone();

    viewport.addLayer({
      id: "upper-arch",
      label: "Stage 1 - Upper",
      colour: "anatomical",
      geometry: geom,
    });

    const layer = (viewport as any).layers.get("upper-arch");
    expect(layer).toBeDefined();

    // Verify native colors are preserved on layer geometry
    const initialColors = layer.geometry.getAttribute("color");
    expect(initialColors.getX(0)).toBeCloseTo(0.82, 2);
    expect(initialColors.getX(2)).toBeCloseTo(0.96, 2);

    // Simulate contacts mode
    viewport.setLayerColour("upper-arch", "contacts");
    expect(layer.colour).toBe("contacts");

    // Mutate color attribute as bite-contacts does during collision check
    const contactColors = new Float32Array([
      0.94, 0.22, 0.22, // Heavy contact Crimson
      0.96, 0.65, 0.08, // Medium contact Amber
      0.96, 0.52, 0.16, // Attachment
    ]);
    layer.geometry.setAttribute("color", new BufferAttribute(contactColors, 3));

    // Turn contacts off back to anatomical
    viewport.setLayerColour("upper-arch", "anatomical");
    expect(layer.colour).toBe("anatomical");

    // Must restore clean baseColors rather than calling computeAnatomicalColors!
    const restoredColors = layer.geometry.getAttribute("color");
    expect(restoredColors.getX(0)).toBeCloseTo(0.82, 2);
    expect(restoredColors.getY(0)).toBeCloseTo(0.76, 2);
    expect(restoredColors.getZ(0)).toBeCloseTo(0.68, 2);
    // Attachment preserved
    expect(restoredColors.getX(2)).toBeCloseTo(0.96, 2);
    expect(restoredColors.getY(2)).toBeCloseTo(0.52, 2);
    expect(restoredColors.getZ(2)).toBeCloseTo(0.16, 2);

    viewport.dispose();
  });

  it("preserves vertex colors during geometry swap in setLayerGeometry", () => {
    const canvas = document.createElement("canvas");
    const viewport = createViewport(canvas);

    const geomA = new BufferGeometry();
    geomA.setAttribute(
      "position",
      new BufferAttribute(new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]), 3),
    );
    geomA.setAttribute(
      "color",
      new BufferAttribute(new Float32Array([0.82, 0.76, 0.68, 0.82, 0.76, 0.68, 0.82, 0.76, 0.68]), 3),
    );
    geomA.userData.baseColors = geomA.getAttribute("color")!.clone();

    viewport.addLayer({
      id: "test-arch",
      label: "Test Arch",
      colour: "anatomical",
      geometry: geomA,
    });

    const geomB = new BufferGeometry();
    geomB.setAttribute(
      "position",
      new BufferAttribute(new Float32Array([0, 0, 0, 2, 0, 0, 0, 2, 0]), 3),
    );
    // Geom B with amber attachment (simulating attachments toggled on)
    geomB.setAttribute(
      "color",
      new BufferAttribute(new Float32Array([0.82, 0.76, 0.68, 0.82, 0.76, 0.68, 0.96, 0.52, 0.16]), 3),
    );
    geomB.userData.baseColors = geomB.getAttribute("color")!.clone();

    // Swap geometry as navigate() and toggleAttachments() do
    viewport.setLayerGeometry?.("test-arch", geomB);

    const layer = (viewport as any).layers.get("test-arch");
    const activeColors = layer.geometry.getAttribute("color");
    expect(activeColors).toBeDefined();
    // Verify attachment orange is intact and was NOT overwritten by computeAnatomicalColors!
    expect(activeColors.getX(2)).toBeCloseTo(0.96, 2);
    expect(activeColors.getY(2)).toBeCloseTo(0.52, 2);
    expect(activeColors.getZ(2)).toBeCloseTo(0.16, 2);

    viewport.dispose();
  });

  it("never deletes native vertex colors in showOwnColour during surface inspection", () => {
    const geom = new BufferGeometry();
    geom.setAttribute(
      "position",
      new BufferAttribute(new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]), 3),
    );
    geom.setAttribute(
      "color",
      new BufferAttribute(new Float32Array([0.82, 0.76, 0.68, 0.50, 0.09, 0.12, 0.96, 0.52, 0.16]), 3),
    );
    geom.userData.baseColors = geom.getAttribute("color")!.clone();

    const mockLayer: any = {
      material: {},
      measuredMaterial: {},
      mesh: { material: null },
      geometry: geom,
    };

    // 1. Measuring surface applies curvature colors
    const measuredColours = new Float32Array([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]);
    showMeasured(mockLayer, measuredColours);

    expect(geom.getAttribute("color").getX(0)).toBeCloseTo(0.1, 2);

    // 2. Switching back to own colour
    showOwnColour(mockLayer);

    // Crucial: Must NOT delete the color attribute! Must restore baseColors!
    const restored = geom.getAttribute("color");
    expect(restored).toBeDefined();
    expect(restored.getX(0)).toBeCloseTo(0.82, 2); // Enamel
    expect(restored.getX(1)).toBeCloseTo(0.50, 2); // Vascular gingiva
    expect(restored.getX(2)).toBeCloseTo(0.96, 2); // Amber attachment
  });
});
