import { describe, it } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as THREE from "three";
import { computeToothCentroids } from "../src/treatment-viewer/tooth-data";

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

function getToothObjFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.startsWith("tooth_") && f.endsWith(".obj"))
    .sort();
}

describe("Cross-Model Dental Geometry Study", () => {
  const cases = [
    { name: "Devika Lower", path: "models/Devika L/01", isUpper: false },
    { name: "Devika Upper", path: "models/Devika U/01", isUpper: true },
    { name: "Aibel Lower", path: "models/Aibel LOWER/01", isUpper: false },
    { name: "Aibel Upper", path: "models/Aibel UPPER/01", isUpper: true },
    { name: "Elizabeth S", path: "models/Elizabeth S/01", isUpper: true },
  ];

  for (const c of cases) {
    it(`Studies ${c.name} dental spacing, contacts, and embrasures`, () => {
      const dir = path.resolve(process.cwd(), c.path);
      if (!fs.existsSync(dir)) {
        console.log(`Skipping ${c.name}, dir not found: ${dir}`);
        return;
      }

      const toothFiles = getToothObjFiles(dir);
      console.log(`\n=================== STUDY: ${c.name} (${toothFiles.length} teeth) ===================`);

      interface ToothMeta {
        file: string;
        center: THREE.Vector3;
        box: THREE.Box3;
        points: THREE.Vector3[];
      }

      const teeth: ToothMeta[] = [];
      for (const tf of toothFiles) {
        const text = fs.readFileSync(path.join(dir, tf), "utf-8");
        const pts = parseObjPositions(text);
        if (pts.length === 0) continue;
        const box = new THREE.Box3();
        const center = new THREE.Vector3();
        for (const p of pts) box.expandByPoint(p);
        box.getCenter(center);
        teeth.push({ file: tf, center, box, points: pts });
      }

      // Sort teeth anatomically around the arch (by angle)
      const archBox = new THREE.Box3();
      for (const t of teeth) archBox.union(t.box);
      const midX = (archBox.min.x + archBox.max.x) / 2;
      const minZ = archBox.min.z;
      const focalZ = minZ - 2.0;

      teeth.sort((a, b) => {
        const angleA = Math.atan2(a.center.x - midX, a.center.z - focalZ);
        const angleB = Math.atan2(b.center.x - midX, b.center.z - focalZ);
        return angleA - angleB;
      });

      console.log(`Arch Extents: X=[${archBox.min.x.toFixed(1)}, ${archBox.max.x.toFixed(1)}], Y=[${archBox.min.y.toFixed(1)}, ${archBox.max.y.toFixed(1)}], Z=[${archBox.min.z.toFixed(1)}, ${archBox.max.z.toFixed(1)}]`);

      // Test computeToothCentroids on merged arch
      const allPos: number[] = [];
      for (const t of teeth) {
        for (const p of t.points) {
          allPos.push(p.x, p.y, p.z);
        }
      }
      const fullGeom = new THREE.BufferGeometry();
      fullGeom.setAttribute("position", new THREE.BufferAttribute(new Float32Array(allPos), 3));

      const detectedCentroids = computeToothCentroids(fullGeom, c.isUpper);
      console.log(`Detected Centroids for ${c.name}:`);
      for (const [fdi, pos] of Object.entries(detectedCentroids)) {
        console.log(`  Tooth ${fdi}: pt=[${pos[0].toFixed(2)}, ${pos[1].toFixed(2)}, ${pos[2].toFixed(2)}]`);
      }

      // Analyze crown clusters along arch theta
      const posAttr = fullGeom.getAttribute("position");
      const numBins = 180;
      const binCounts = new Int32Array(numBins);
      const binYSum = new Float32Array(numBins);
      const binXSum = new Float32Array(numBins);
      const binZSum = new Float32Array(numBins);
      const minTheta = -1.5, maxTheta = 1.5;

      const yCutoff = c.isUpper ? archBox.min.y + (archBox.max.y - archBox.min.y) * 0.55 : archBox.max.y - (archBox.max.y - archBox.min.y) * 0.55;

      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i), y = posAttr.getY(i), z = posAttr.getZ(i);
        if (c.isUpper ? y > yCutoff : y < yCutoff) continue;
        const th = Math.atan2(x - midX, Math.max(0.1, z - focalZ));
        if (th < minTheta || th > maxTheta) continue;
        const b = Math.floor(((th - minTheta) / (maxTheta - minTheta)) * numBins);
        if (b >= 0 && b < numBins && binCounts[b] !== undefined) {
          binCounts[b]!++;
          binYSum[b] = (binYSum[b] ?? 0) + y;
          binXSum[b] = (binXSum[b] ?? 0) + x;
          binZSum[b] = (binZSum[b] ?? 0) + z;
        }
      }

      // Find peaks in binCounts (each peak is a tooth crown!)
      const peaks: { bin: number; th: number; count: number; x: number; y: number; z: number }[] = [];
      const smoothCounts = new Float32Array(numBins);
      for (let b = 0; b < numBins; b++) {
        let sum = 0, w = 0;
        for (let d = -2; d <= 2; d++) {
          const idx = b + d;
          if (idx >= 0 && idx < numBins) { sum += binCounts[idx]!; w++; }
        }
        smoothCounts[b] = sum / w;
      }

      for (let b = 2; b < numBins - 2; b++) {
        if (smoothCounts[b]! > 80 &&
            smoothCounts[b]! > smoothCounts[b - 1]! &&
            smoothCounts[b]! > smoothCounts[b - 2]! &&
            smoothCounts[b]! >= smoothCounts[b + 1]! &&
            smoothCounts[b]! > smoothCounts[b + 2]!) {
          const th = minTheta + (b + 0.5) * ((maxTheta - minTheta) / numBins);
          const cnt = binCounts[b]! || 1;
          peaks.push({
            bin: b,
            th,
            count: cnt,
            x: binXSum[b]! / cnt,
            y: binYSum[b]! / cnt,
            z: binZSum[b]! / cnt,
          });
        }
      }
      console.log(`Discovered ${peaks.length} Physical Tooth Crown Peaks for ${c.name}:`);
      for (let p = 0; p < peaks.length; p++) {
        const pk = peaks[p]!;
        console.log(`  Peak #${p + 1}: theta=${pk.th.toFixed(3)}, pt=[${pk.x.toFixed(1)}, ${pk.y.toFixed(1)}, ${pk.z.toFixed(1)}], density=${pk.count}`);
      }

      for (let i = 0; i < teeth.length - 1; i++) {
        const tA = teeth[i]!;
        const tB = teeth[i + 1]!;
        const spanDist = tA.center.distanceTo(tB.center);
        const contactCenter = new THREE.Vector3().addVectors(tA.center, tB.center).multiplyScalar(0.5);

        // Find closest point distance between the two teeth (true physical contact clearance)
        let minGap = Infinity;
        let ptAClosest = new THREE.Vector3();
        let ptBClosest = new THREE.Vector3();

        // Subsample for fast exact check
        const stepA = Math.max(1, Math.floor(tA.points.length / 500));
        const stepB = Math.max(1, Math.floor(tB.points.length / 500));

        for (let ia = 0; ia < tA.points.length; ia += stepA) {
          const pa = tA.points[ia]!;
          for (let ib = 0; ib < tB.points.length; ib += stepB) {
            const pb = tB.points[ib]!;
            const d = pa.distanceTo(pb);
            if (d < minGap) {
              minGap = d;
              ptAClosest.copy(pa);
              ptBClosest.copy(pb);
            }
          }
        }

        const physicalContact = new THREE.Vector3().addVectors(ptAClosest, ptBClosest).multiplyScalar(0.5);

        // Measure embrasure depth (buccal and lingual spread perpendicular to tangent)
        const tangent = new THREE.Vector3().subVectors(tB.center, tA.center).normalize();
        const radDir = new THREE.Vector3(contactCenter.x - midX, 0, contactCenter.z - focalZ).normalize();
        let facial = new THREE.Vector3(-tangent.z, 0, tangent.x);
        if (facial.dot(radDir) < 0) facial.negate();
        facial.normalize();

        // Measure tooth envelope at contact
        let maxBuccal = 0;
        let maxLingual = 0;
        for (let ia = 0; ia < tA.points.length; ia += stepA) {
          const pa = tA.points[ia]!;
          const dContact = pa.distanceTo(physicalContact);
          if (dContact < 5.0) {
            const w = (pa.x - physicalContact.x) * facial.x + (pa.z - physicalContact.z) * facial.z;
            if (w > maxBuccal) maxBuccal = w;
            if (-w > maxLingual) maxLingual = -w;
          }
        }

        console.log(
          `Contact ${tA.file} <-> ${tB.file}: ` +
          `CentroidSpan=${spanDist.toFixed(2)}mm, ` +
          `MinGap=${minGap.toFixed(2)}mm, ` +
          `ContactY=${physicalContact.y.toFixed(2)}, ` +
          `CrownApexY=${(c.isUpper ? Math.min(tA.box.min.y, tB.box.min.y) : Math.max(tA.box.max.y, tB.box.max.y)).toFixed(2)}, ` +
          `Embrasure Buccal=${maxBuccal.toFixed(2)}mm, Lingual=${maxLingual.toFixed(2)}mm`
        );
      }
    });
  }
});
