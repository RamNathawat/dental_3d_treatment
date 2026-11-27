import {
  BufferAttribute,
  type BufferGeometry,
  Float32BufferAttribute,
  ShapeUtils,
  Vector2,
} from "three";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface EdgeEntry {
  count: number;
  v1: Point3D;
  v2: Point3D;
  k1: string;
  k2: string;
}

/**
 * Automatically detects open planar boundaries at the model base/top and generates
 * flat triangular caps to close them.
 *
 * Intraoral orthodontic scans are frequently exported with open planar cuts at the base
 * (leaving the palate or mandibular base hollow). This function identifies planar boundary
 * loops and triangulates them using Earcut/ShapeUtils, creating solid, watertight orthodontic models.
 *
 * If the model is already closed (manifold) or has no planar boundary loops, it is returned untouched.
 */
export function capPlanarOpenings(
  geometry: BufferGeometry,
  isUpper: boolean,
): BufferGeometry {
  const posAttr = geometry.getAttribute("position");
  if (!posAttr) return geometry;

  const index = geometry.getIndex();
  const numTriangles = index ? index.count / 3 : posAttr.count / 3;

  const edgeMap = new Map<string, EdgeEntry>();

  function getPtKey(x: number, y: number, z: number): string {
    return `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;
  }
  function getEdgeKey(k1: string, k2: string): string {
    return k1 < k2 ? `${k1}_${k2}` : `${k2}_${k1}`;
  }

  // Find extreme Y bounds to isolate the base planar cut plane
  let minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < posAttr.count; i++) {
    const y = posAttr.getY(i);
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }

  const modelHeight = maxY - minY;
  const cutY = isUpper ? maxY : minY;
  const cutThreshold = Math.min(4.0, Math.max(2.2, modelHeight * 0.35));

  const pts = new Map<string, Point3D>();
  for (let i = 0; i < numTriangles; i++) {
    const i0 = index ? index.getX(i * 3) : i * 3;
    const i1 = index ? index.getX(i * 3 + 1) : i * 3 + 1;
    const i2 = index ? index.getX(i * 3 + 2) : i * 3 + 2;

    const y0 = posAttr.getY(i0);
    const y1 = posAttr.getY(i1);
    const y2 = posAttr.getY(i2);

    // Fast reject: triangles nowhere near the cut plane can never form the base cap
    if (
      Math.abs(y0 - cutY) > cutThreshold &&
      Math.abs(y1 - cutY) > cutThreshold &&
      Math.abs(y2 - cutY) > cutThreshold
    ) {
      continue;
    }

    const v: Point3D[] = [
      {
        x: posAttr.getX(i0),
        y: y0,
        z: posAttr.getZ(i0),
      },
      {
        x: posAttr.getX(i1),
        y: y1,
        z: posAttr.getZ(i1),
      },
      {
        x: posAttr.getX(i2),
        y: y2,
        z: posAttr.getZ(i2),
      },
    ];

    for (let j = 0; j < 3; j++) {
      const v1 = v[j]!;
      const v2 = v[(j + 1) % 3]!;
      const k1 = getPtKey(v1.x, v1.y, v1.z);
      const k2 = getPtKey(v2.x, v2.y, v2.z);
      pts.set(k1, v1);
      pts.set(k2, v2);
      const ek = getEdgeKey(k1, k2);
      let entry = edgeMap.get(ek);
      if (!entry) {
        entry = { count: 0, v1, v2, k1, k2 };
        edgeMap.set(ek, entry);
      }
      entry.count++;
    }
  }

  // Find single-use boundary edges
  const adj = new Map<string, string[]>();
  for (const entry of edgeMap.values()) {
    if (entry.count === 1) {
      if (!adj.has(entry.k1)) adj.set(entry.k1, []);
      if (!adj.has(entry.k2)) adj.set(entry.k2, []);
      adj.get(entry.k1)!.push(entry.k2);
      adj.get(entry.k2)!.push(entry.k1);
    }
  }

  if (adj.size === 0) return geometry;

  // Extract closed boundary loops
  const visited = new Set<string>();
  const loops: string[][] = [];
  for (const start of adj.keys()) {
    if (visited.has(start)) continue;
    const loop = [start];
    visited.add(start);
    let curr = start;
    let prev: string | null = null;
    while (true) {
      const neighbors = adj.get(curr);
      if (!neighbors) break;
      const next = neighbors.find((n) => n !== prev && !visited.has(n));
      if (!next) break;
      visited.add(next);
      loop.push(next);
      prev = curr;
      curr = next;
    }
    if (loop.length >= 3) loops.push(loop);
  }

  const capTriangles: Point3D[] = [];
  for (const loop of loops) {
    const yVals = loop.map((k) => pts.get(k)!.y);
    const minLoopY = Math.min(...yVals);
    const maxLoopY = Math.max(...yVals);
    const yDiff = maxLoopY - minLoopY;

    const xVals = loop.map((k) => pts.get(k)!.x);
    const zVals = loop.map((k) => pts.get(k)!.z);
    const spanX = Math.max(...xVals) - Math.min(...xVals);
    const spanZ = Math.max(...zVals) - Math.min(...zVals);

    // Dental horseshoe arch protection: distinguish true flat/slightly-tilted base cut from anatomical loops
    const loopNearCut = isUpper
      ? Math.abs(maxLoopY - cutY) < 1.8
      : Math.abs(minLoopY - cutY) < 1.8;
    const isBaseCut = loopNearCut && yDiff <= 2.6;
    if (!isBaseCut && spanX > 15.0 && spanZ > 15.0) continue;
    // Capping tolerance: allow base cuts with height variation up to 2.8mm
    if (!isBaseCut && yDiff > 2.8) continue;
    // Skip tiny micro-loops under 2mm
    if (spanX < 2.0 && spanZ < 2.0) continue;

    const points2D = loop.map((k) => {
      const p = pts.get(k)!;
      return new Vector2(p.x, p.z);
    });

    const triIndices = ShapeUtils.triangulateShape(points2D, []);
    let totalAreaY = 0;
    for (const tri of triIndices) {
      const i0 = tri[0];
      const i1 = tri[1];
      const i2 = tri[2];
      if (i0 === undefined || i1 === undefined || i2 === undefined) continue;
      const p0 = points2D[i0];
      const p1 = points2D[i1];
      const p2 = points2D[i2];
      if (!p0 || !p1 || !p2) continue;
      totalAreaY +=
        (p1.y - p0.y) * (p2.x - p0.x) - (p1.x - p0.x) * (p2.y - p0.y);
    }
    const targetPositiveY = isUpper;
    const shouldFlip = targetPositiveY ? totalAreaY < 0 : totalAreaY > 0;

    for (const tri of triIndices) {
      let i0 = tri[0];
      let i1 = tri[1];
      let i2 = tri[2];
      if (i0 === undefined || i1 === undefined || i2 === undefined) continue;

      if (shouldFlip) {
        const tmp = i1;
        i1 = i2;
        i2 = tmp;
      }
      const k0 = loop[i0];
      const k1 = loop[i1];
      const k2 = loop[i2];
      if (!k0 || !k1 || !k2) continue;
      const p0 = pts.get(k0);
      const p1 = pts.get(k1);
      const p2 = pts.get(k2);
      if (p0 && p1 && p2) {
        // Exclude cross-palate / cross-tongue bridging chords across the hollow dental horseshoe arch
        const cx = (p0.x + p1.x + p2.x) / 3;
        const cz = (p0.z + p1.z + p2.z) / 3;
        if (!isUpper && Math.abs(cx) < 9.0 && cz > -6.0 && cz < 16.0) {
          continue;
        }
        const d01 = Math.hypot(p0.x - p1.x, p0.z - p1.z);
        const d12 = Math.hypot(p1.x - p2.x, p1.z - p2.z);
        const d20 = Math.hypot(p2.x - p0.x, p2.z - p0.z);
        if (d01 > 35.0 || d12 > 35.0 || d20 > 35.0) {
          continue;
        }

        capTriangles.push(p0, p1, p2);
      }
    }
  }

  if (capTriangles.length === 0) return geometry;

  const oldPositions = posAttr.array;
  const newPositions = new Float32Array(
    oldPositions.length + capTriangles.length * 3,
  );
  newPositions.set(oldPositions, 0);

  let offset = oldPositions.length;
  for (const pt of capTriangles) {
    newPositions[offset++] = pt.x;
    newPositions[offset++] = pt.y;
    newPositions[offset++] = pt.z;
  }

  geometry.setAttribute("position", new Float32BufferAttribute(newPositions, 3));

  // Expand vertex colors if geometry has a color attribute so buffer sizes match
  const colorAttr = geometry.getAttribute("color");
  if (colorAttr) {
    const itemSize = colorAttr.itemSize;
    const isUint8 = colorAttr.array instanceof Uint8Array;
    const oldColors = colorAttr.array;
    const newColors = isUint8
      ? new Uint8Array(oldColors.length + capTriangles.length * itemSize)
      : new Float32Array(oldColors.length + capTriangles.length * itemSize);
    newColors.set(oldColors, 0);

    // Gingival coral-rose pink for base cap triangles: [0.46, 0.085, 0.105, 1.0]
    let cOffset = oldColors.length;
    for (let i = 0; i < capTriangles.length; i++) {
      if (isUint8) {
        newColors[cOffset++] = 117;
        newColors[cOffset++] = 22;
        newColors[cOffset++] = 27;
        if (itemSize === 4) newColors[cOffset++] = 255;
      } else {
        newColors[cOffset++] = 0.46;
        newColors[cOffset++] = 0.085;
        newColors[cOffset++] = 0.105;
        if (itemSize === 4) newColors[cOffset++] = 1.0;
      }
    }
    geometry.setAttribute(
      "color",
      new BufferAttribute(newColors as any, itemSize, isUint8),
    );
    geometry.userData.baseColors = geometry.getAttribute("color")!.clone();
  }

  if (geometry.userData.pristinePositions) {
    geometry.userData.pristinePositions = new Float32Array(newPositions);
  }

  if (index) {
    const oldIndices = index.array;
    const newIndices = new Uint32Array(oldIndices.length + capTriangles.length);
    newIndices.set(oldIndices, 0);
    const baseIdx = oldPositions.length / 3;
    for (let i = 0; i < capTriangles.length; i++) {
      newIndices[oldIndices.length + i] = baseIdx + i;
    }
    geometry.setIndex(new BufferAttribute(newIndices, 1) as any);
  }

  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}
