import { describe, expect, it } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as THREE from "three";
import { detectMeshContacts } from "../src/treatment-viewer/blockout/mesh-contact-detector";

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

function loadArchGeometry(dirPath: string): { geom: THREE.BufferGeometry; name: string } {
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
  return { geom, name: path.basename(path.dirname(dir)) };
}

describe("Standalone detectMeshContacts on Real Cases", () => {
  const cases = [
    { name: "Aibel Lower", path: "models/Aibel LOWER/01", isUpper: false, expectedContacts: 11 },
    { name: "Aibel Upper", path: "models/Aibel UPPER/01", isUpper: true, expectedContacts: 11 },
    { name: "Devika Lower", path: "models/Devika L/01", isUpper: false, expectedContacts: 11 },
    { name: "Shyama Upper", path: "models/shyama/Shyama UPPER/01", isUpper: true, expectedContacts: 11 },
    { name: "Shyama Lower", path: "models/shyama/Shyama LOWER/00 segmented", isUpper: false, expectedContacts: 11 },
  ];

  for (const c of cases) {
    it(`detects contacts on ${c.name} along transverse corridors`, () => {
      const { geom } = loadArchGeometry(c.path);
      const contacts = detectMeshContacts(geom, c.isUpper);

      console.log(`\n=== Contacts for ${c.name} (${contacts.length} found) ===`);
      for (const ct of contacts) {
        console.log(`  ${ct.contactKey}: pos=[${ct.position.join(", ")}], clearance=${ct.clearanceMm}mm, span=${ct.spanMm}mm`);
      }

      expect(contacts.length).toBeGreaterThanOrEqual(10);
      expect(contacts.length).toBeLessThanOrEqual(16);

      // Verify bounds and non-floating
      for (const ct of contacts) {
        expect(ct.clearanceMm).toBeLessThan(4.0);
        expect(Number.isFinite(ct.position[0])).toBe(true);
        expect(Number.isFinite(ct.position[1])).toBe(true);
        expect(Number.isFinite(ct.position[2])).toBe(true);
      }
    });
  }
});
