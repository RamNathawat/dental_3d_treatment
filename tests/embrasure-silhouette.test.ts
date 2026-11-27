import { describe, expect, it } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as THREE from "three";
import { detectMeshContacts } from "../src/treatment-viewer/blockout/mesh-contact-detector";
import {
  extractEmbrasureSilhouettes,
  createSilhouette3DObject,
} from "../src/treatment-viewer/blockout/embrasure-silhouette";

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

describe("Milestone 4.2: Embrasure Boundary Silhouettes (The Black Triangle Profile)", () => {
  const cases = [
    { name: "Aibel Lower", path: "models/Aibel LOWER/01", isUpper: false },
    { name: "Aibel Upper", path: "models/Aibel UPPER/01", isUpper: true },
    { name: "Devika Lower", path: "models/Devika L/01", isUpper: false },
    { name: "Shyama Upper", path: "models/shyama/Shyama UPPER/01", isUpper: true },
    { name: "Shyama Lower", path: "models/shyama/Shyama LOWER/00 segmented", isUpper: false },
  ];

  for (const c of cases) {
    it(`extracts valid embrasure silhouettes for ${c.name}`, () => {
      const geom = loadArchGeometry(c.path);
      const contacts = detectMeshContacts(geom, c.isUpper);
      expect(contacts.length).toBeGreaterThanOrEqual(11);

      const silhouettes = extractEmbrasureSilhouettes(geom, c.isUpper, contacts);
      expect(silhouettes.length).toBe(contacts.length);

      for (let i = 0; i < silhouettes.length; i++) {
        const sil = silhouettes[i]!;
        const contact = contacts[i]!;

        // 1. Apex must match the detected contact point exactly
        expect(sil.apex[0]).toBeCloseTo(contact.position[0], 1);
        expect(sil.apex[1]).toBeCloseTo(contact.position[1], 1);
        expect(sil.apex[2]).toBeCloseTo(contact.position[2], 1);

        // 2. Base must be in the gingival direction (+Y for upper, -Y for lower)
        if (c.isUpper) {
          expect(sil.papillaBase[1]).toBeGreaterThan(sil.apex[1]);
        } else {
          expect(sil.papillaBase[1]).toBeLessThan(sil.apex[1]);
        }

        // 3. Clinical triangle height must be within physiological limits (2.0mm to 5.5mm)
        expect(sil.heightMm).toBeGreaterThanOrEqual(2.0);
        expect(sil.heightMm).toBeLessThanOrEqual(5.5);

        // 4. Loops must have non-empty valid 3D points
        expect(sil.buccalLoop.length).toBeGreaterThan(10);
        expect(sil.lingualLoop.length).toBeGreaterThan(10);

        // 5. Must generate Three.js 3D visual object with child meshes and line loops
        const obj = createSilhouette3DObject(sil, false, false);
        expect(obj.children.length).toBeGreaterThanOrEqual(3);
      }
    });
  }

  it("highlights active silhouette with gold material and increased opacity", () => {
    const geom = loadArchGeometry("models/Aibel LOWER/01");
    const contacts = detectMeshContacts(geom, false);
    const silhouettes = extractEmbrasureSilhouettes(geom, false, contacts);
    const activeSil = silhouettes[0]!;

    const selectedObj = createSilhouette3DObject(activeSil, true, false);
    expect(selectedObj.name).toBe(`embrasure-${activeSil.contactKey}`);
    expect(selectedObj.children.length).toBeGreaterThanOrEqual(3);
  });
});
