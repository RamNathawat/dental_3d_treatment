import {
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

  const count = posAttr.count;
  const numTriangles = count / 3;

  const edgeMap = new Map<string, EdgeEntry>();

  function getPtKey(x: number, y: number, z: number): string {
    return `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;
  }
  function getEdgeKey(k1: string, k2: string): string {
    return k1 < k2 ? `${k1}_${k2}` : `${k2}_${k1}`;
  }

  const pts = new Map<string, Point3D>();
  for (let i = 0; i < numTriangles; i++) {
    const v: Point3D[] = [
      {
        x: posAttr.getX(i * 3),
        y: posAttr.getY(i * 3),
        z: posAttr.getZ(i * 3),
      },
      {
        x: posAttr.getX(i * 3 + 1),
        y: posAttr.getY(i * 3 + 1),
        z: posAttr.getZ(i * 3 + 1),
      },
      {
        x: posAttr.getX(i * 3 + 2),
        y: posAttr.getY(i * 3 + 2),
        z: posAttr.getZ(i * 3 + 2),
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
    const minY = Math.min(...yVals);
    const maxY = Math.max(...yVals);

    // Only cap loops that lie on a flat cutting plane (tolerance <= 0.6mm)
    if (maxY - minY > 0.6) continue;

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
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}
