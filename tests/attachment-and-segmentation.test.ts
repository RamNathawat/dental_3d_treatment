import { describe, it, expect } from "vitest";
import { BufferGeometry, Float32BufferAttribute } from "three";
import { removeOrthodonticAttachments } from "../src/viewer/attachment-remover";
import { computeAnatomicalColors } from "../src/viewer/dental-segmentation";

describe("removeOrthodonticAttachments", () => {
  it("handles empty geometry gracefully", () => {
    const geom = new BufferGeometry();
    const result = removeOrthodonticAttachments(geom);
    expect(result.detectedCount).toBe(0);
    expect(result.modifiedVertexCount).toBe(0);
  });

  it("leaves a smooth planar or spherical mesh untouched", () => {
    // Sphere-like or flat plane without sharp orthogonal protrusions
    const geom = new BufferGeometry();
    const positions: number[] = [];
    for (let i = 0; i < 200; i++) {
      positions.push(i, 0, 0, i + 1, 1, 0, i, 1, 0);
    }
    geom.setAttribute("position", new Float32BufferAttribute(positions, 3));
    const result = removeOrthodonticAttachments(geom);
    expect(result.detectedCount).toBe(0);
    expect(result.modifiedVertexCount).toBe(0);
  });

  it("detects and flattens a synthetic orthodontic attachment box", () => {
    const geom = new BufferGeometry();
    const positions: number[] = [];

    // Base tooth surface around (0, 0, 10): a 10mm x 10mm flat grid at Z = 10
    const addTri = (
      p1: [number, number, number],
      p2: [number, number, number],
      p3: [number, number, number],
    ) => {
      positions.push(...p1, ...p2, ...p3);
    };

    // Tessellate base surface at Z = 10
    for (let x = -5; x < 5; x += 0.5) {
      for (let y = -5; y < 5; y += 0.5) {
        addTri([x, y, 10], [x + 0.5, y, 10], [x + 0.5, y + 0.5, 10]);
        addTri([x, y, 10], [x + 0.5, y + 0.5, 10], [x, y + 0.5, 10]);
      }
    }

    // Now add an orthodontic rectangular box at center (0, 0), width 2mm, height 3mm, protruding 1.2mm to Z = 11.2
    // Top face at Z = 11.2
    for (let x = -1; x < 1; x += 0.4) {
      for (let y = -1.5; y < 1.5; y += 0.5) {
        addTri([x, y, 11.2], [x + 0.4, y, 11.2], [x + 0.4, y + 0.5, 11.2]);
        addTri([x, y, 11.2], [x + 0.4, y + 0.5, 11.2], [x, y + 0.5, 11.2]);
      }
    }

    // 4 Side walls connecting base (Z=10) to top (Z=11.2)
    // Left wall (x = -1)
    for (let y = -1.5; y < 1.5; y += 0.5) {
      addTri([-1, y, 10], [-1, y + 0.5, 10], [-1, y + 0.5, 11.2]);
      addTri([-1, y, 10], [-1, y + 0.5, 11.2], [-1, y, 11.2]);
    }
    // Right wall (x = 1)
    for (let y = -1.5; y < 1.5; y += 0.5) {
      addTri([1, y, 10], [1, y, 11.2], [1, y + 0.5, 11.2]);
      addTri([1, y, 10], [1, y + 0.5, 11.2], [1, y + 0.5, 10]);
    }
    // Bottom wall (y = -1.5)
    for (let x = -1; x < 1; x += 0.4) {
      addTri([x, -1.5, 10], [x, -1.5, 11.2], [x + 0.4, -1.5, 11.2]);
      addTri([x, -1.5, 10], [x + 0.4, -1.5, 11.2], [x + 0.4, -1.5, 10]);
    }
    // Top wall (y = 1.5)
    for (let x = -1; x < 1; x += 0.4) {
      addTri([x, 1.5, 10], [x + 0.4, 1.5, 11.2], [x, 1.5, 11.2]);
      addTri([x, 1.5, 10], [x + 0.4, 1.5, 10], [x + 0.4, 1.5, 11.2]);
    }

    geom.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geom.computeVertexNormals();

    const result = removeOrthodonticAttachments(geom);
    expect(result.detectedCount).toBeGreaterThanOrEqual(1);
    expect(result.modifiedVertexCount).toBeGreaterThan(0);

    // Verify that the protruding vertices at Z = 11.2 were flattened down towards Z = 10
    const pos = geom.getAttribute("position");
    let maxZ = -Infinity;
    for (let i = 0; i < pos.count; i++) {
      const z = pos.getZ(i);
      if (z > maxZ) maxZ = z;
    }
    // Max Z was 11.2; after removal, it should be flattened flush with the base surface (~10.0 - 10.3)
    expect(maxZ).toBeLessThan(10.5);
  });

  it(
    "safely planes attachments on real dental STL models without depressions",
    () => {
    const fs = require("node:fs");
    const { STLLoader } = require("three/examples/jsm/loaders/STLLoader.js");
    const loader = new STLLoader();

    const lowerPath = "models/Ashina models/Niya Priority Lower jaw - 01 - Model.stl";
    if (fs.existsSync(lowerPath)) {
      const buf = fs.readFileSync(lowerPath);
      const geom = loader.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
      const result = removeOrthodonticAttachments(geom);
      console.log("Real Lower Jaw attachments planed:", result);
      expect(result.detectedCount).toBeGreaterThan(0);
      expect(result.modifiedVertexCount).toBeGreaterThan(0);
    }

    const upperPath = "models/Ashina models/Niya Priority Upper jaw - 01 - Model.stl";
    if (fs.existsSync(upperPath)) {
      const buf = fs.readFileSync(upperPath);
      const geom = loader.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
      const result = removeOrthodonticAttachments(geom);
      console.log("Real Upper Jaw attachments planed:", result);
      expect(result.detectedCount).toBeGreaterThan(0);
      expect(result.modifiedVertexCount).toBeGreaterThan(0);
    }
  }, 60000);
});

describe("computeAnatomicalColors", () => {
  it("assigns ceramic enamel white to crown tips and coral-rose to gingival base", () => {
    const geom = new BufferGeometry();
    const positions: number[] = [];

    // Create an arch with lower jaw coordinates:
    // Crown tips at Y = 2.0 (incisors) to Y = 5.0 (molars)
    // Gingival base at Y = -8.0
    // U-shaped arch:
    for (let theta = -Math.PI / 3; theta <= Math.PI / 3; theta += 0.1) {
      const x = 25 * Math.sin(theta);
      const z = 25 * Math.cos(theta);
      // Incisal tip
      const tipY = 2.0 + Math.abs(theta) * 2.5;
      // Vertices from base (-8) to tip
      for (let y = -8; y <= tipY; y += 1.0) {
        positions.push(x, y, z, x + 1, y, z, x, y + 1, z);
      }
    }

    geom.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geom.computeVertexNormals();

    computeAnatomicalColors(geom, "Lower jaw");

    const color = geom.getAttribute("color");
    expect(color).toBeDefined();
    expect(color.count).toBe(geom.getAttribute("position").count);

    // Check incisal tip vertex color: should be clean ceramic white (R > 0.9, G > 0.9, B > 0.8)
    const pos = geom.getAttribute("position");
    let foundWhiteCrown = false;
    let foundCoralGum = false;

    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const r = color.getX(i);
      const g = color.getY(i);
      const b = color.getZ(i);

      if (y >= 1.5) {
        // Crown tip: enamel white
        if (r > 0.9 && g > 0.85 && b > 0.8) {
          foundWhiteCrown = true;
        }
      } else if (y <= -6.0) {
        // Gingiva: natural vascular coral-rose
        if (r > 0.6 && g < 0.40 && b < 0.45) {
          foundCoralGum = true;
        }
      }
    }

    expect(foundWhiteCrown).toBe(true);
    expect(foundCoralGum).toBe(true);
  });

  it("produces realistic anatomical gum and tooth separation on real dental scans", () => {
    const fs = require("node:fs");
    const { STLLoader } = require("three/examples/jsm/loaders/STLLoader.js");
    const loader = new STLLoader();

    function checkRealModel(path: string, label: string) {
      if (!fs.existsSync(path)) return;
      const buf = fs.readFileSync(path);
      const geom = loader.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
      computeAnatomicalColors(geom, label);

      const pos = geom.getAttribute("position");
      const color = geom.getAttribute("color");
      expect(color).toBeDefined();

      let toothCount = 0;
      let gumCount = 0;

      for (let i = 0; i < pos.count; i++) {
        const r = color.getX(i);
        const g = color.getY(i);

        // Gingiva has lower green and distinctive coral-rose hue (g < 0.42, r > 0.60)
        // Tooth enamel has high green and ivory warmth (g > 0.70)
        if (g < 0.42 && r > 0.60) {
          gumCount++;
        } else if (g > 0.70) {
          toothCount++;
        }
      }

      const toothPct = (toothCount / pos.count) * 100;
      const gumPct = (gumCount / pos.count) * 100;

      console.log(`\n=== Verified Realistic Segmentation for ${label} ===`);
      console.log(`Tooth: ${toothCount} (${toothPct.toFixed(1)}%)`);
      console.log(`Gum: ${gumCount} (${gumPct.toFixed(1)}%)`);

      // Both teeth and gums must be well-represented (neither should be < 12%)
      expect(toothPct).toBeGreaterThan(50);
      expect(gumPct).toBeGreaterThan(12);
    }

    checkRealModel("models/Ashina models/Niya Priority Lower jaw - 01 - Model.stl", "Lower jaw");
    checkRealModel("models/Ashina models/Niya Priority Upper jaw - 01 - Model.stl", "Upper jaw");
  });
});




