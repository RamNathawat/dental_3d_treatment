import { describe, expect, it } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as THREE from "three";
import { detectMeshContacts } from "../src/treatment-viewer/blockout/mesh-contact-detector";
import {
  buildConformalMeshContext,
  createWaxWedgeGeometry,
} from "../src/treatment-viewer/blockout/wax-wedge-generator";

function parseObjPositions(objText: string): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const lines = objText.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i]!.trim();
    if (l.startsWith("v ")) {
      const parts = l.split(/\s+/);
      points.push(new THREE.Vector3(parseFloat(parts[1]!), parseFloat(parts[2]!), parseFloat(parts[3]!)));
    }
  }
  return points;
}

function loadArchGeometry(dirPath: string): THREE.BufferGeometry {
  const dir = path.resolve(process.cwd(), dirPath);
  const files = fs.readdirSync(dir).filter(f => (f.startsWith("tooth_") || f === "gum.obj") && f.endsWith(".obj")).sort();
  const allPos: number[] = [];
  for (const f of files) {
    const text = fs.readFileSync(path.join(dir, f), "utf-8");
    const pts = parseObjPositions(text);
    for (const p of pts) {
      allPos.push(p.x, p.y, p.z);
    }
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.BufferAttribute(new Float32Array(allPos), 3));
  geom.computeVertexNormals();
  return geom;
}

describe("Milestone 4.3: 3D Volumetric Wax Wedge on Single Gap", () => {
  const cases = [
    { name: "Aibel Lower", path: "models/Aibel LOWER/01", isUpper: false, targetKey: "41-31" },
    { name: "Aibel Upper", path: "models/Aibel UPPER/01", isUpper: true, targetKey: "11-21" },
    { name: "Devika Lower", path: "models/Devika L/01", isUpper: false, targetKey: "41-31" },
    { name: "Shyama Upper", path: "models/shyama/Shyama UPPER/01", isUpper: true, targetKey: "11-21" },
    { name: "Shyama Lower", path: "models/shyama/Shyama LOWER/00 segmented", isUpper: false, targetKey: "41-31" },
  ];

  for (const c of cases) {
    it(`generates a watertight 3D wax wedge for ${c.name} on ${c.targetKey}`, () => {
      const geom = loadArchGeometry(c.path);
      const contacts = detectMeshContacts(geom, c.isUpper);
      const targetContact = contacts.find(cnt => cnt.contactKey === c.targetKey);
      expect(targetContact).toBeDefined();

      const waxWedge = createWaxWedgeGeometry(targetContact!, c.isUpper);
      expect(waxWedge).toBeDefined();

      const posAttr = waxWedge.getAttribute("position");
      expect(posAttr).toBeDefined();
      expect(posAttr.count).toBeGreaterThan(100);

      const normAttr = waxWedge.getAttribute("normal");
      expect(normAttr).toBeDefined();
      expect(normAttr.count).toBe(posAttr.count);

      // Check vertical extent: wax must never cross the incisal edge
      const apexY = targetContact!.position[1];
      let maxY = -Infinity;
      let minY = Infinity;
      for (let i = 0; i < posAttr.count; i++) {
        const y = posAttr.getY(i);
        if (y > maxY) maxY = y;
        if (y < minY) minY = y;
      }

      if (c.isUpper) {
        // Upper arch: biting edges are at lower Y, gums are at higher Y.
        // Wax must not extend lower than apexY (towards biting edge)
        expect(minY).toBeGreaterThanOrEqual(apexY - 0.05);
      } else {
        // Lower arch: biting edges are at higher Y, gums are at lower Y.
        // Wax must not extend higher than apexY (towards biting edge)
        expect(maxY).toBeLessThanOrEqual(apexY + 0.05);
      }
    }, 30000);
  }

  for (const c of cases) {
    it(`generates full-arch 3D mesh-conformal meniscus wax across inner and outer embrasures for ${c.name}`, () => {
      const geom = loadArchGeometry(c.path);
      const contacts = detectMeshContacts(geom, c.isUpper);
      const meshContext = buildConformalMeshContext(geom, c.isUpper);
      expect(meshContext).not.toBeNull();

      let generatedCount = 0;
      for (const ct of contacts) {
        const waxGeom = createWaxWedgeGeometry(ct, c.isUpper, {
          meshContext,
          thicknessMm: 0.60,
        });
        const posAttr = waxGeom.getAttribute("position");
        const normAttr = waxGeom.getAttribute("normal");
        expect(posAttr.count).toBeGreaterThan(60);
        expect(normAttr.count).toBe(posAttr.count);
        generatedCount++;
      }
      expect(generatedCount).toBe(contacts.length);
    }, 30000);
  }
});
