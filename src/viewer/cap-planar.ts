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

interface CleanLoop2D {
  pts2D: Vector2[];
  pts3D: Point3D[];
  absArea: number;
  isBaseCut: boolean;
}

function signedAreaXZ(pts: Vector2[]): number {
  let area = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i]!;
    const b = pts[(i + 1) % pts.length]!;
    area += a.x * b.y - b.x * a.y;
  }
  return area * 0.5;
}

function pointInPolygonXZ(px: number, pz: number, poly: Vector2[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i]!.x;
    const zi = poly[i]!.y;
    const xj = poly[j]!.x;
    const zj = poly[j]!.y;
    const intersect =
      zi > pz !== zj > pz &&
      px < ((xj - xi) * (pz - zi)) / (zj - zi || 1e-12) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function distSqToPolyBoundaryXZ(px: number, pz: number, poly: Vector2[]): number {
  let minD2 = Infinity;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const ax = poly[j]!.x;
    const az = poly[j]!.y;
    const bx = poly[i]!.x;
    const bz = poly[i]!.y;
    const abx = bx - ax;
    const abz = bz - az;
    const denom = abx * abx + abz * abz;
    const t =
      denom > 1e-12
        ? Math.max(0, Math.min(1, ((px - ax) * abx + (pz - az) * abz) / denom))
        : 0;
    const dx = px - (ax + t * abx);
    const dz = pz - (az + t * abz);
    const d2 = dx * dx + dz * dz;
    if (d2 < minD2) minD2 = d2;
  }
  return minD2;
}

function isPointInsideOrOnPolyXZ(
  px: number,
  pz: number,
  poly: Vector2[],
  tolSq = 0.04,
): boolean {
  if (pointInPolygonXZ(px, pz, poly)) return true;
  return distSqToPolyBoundaryXZ(px, pz, poly) <= tolSq;
}

// 48-bit exact integer spatial key at 0.02 mm resolution (range +/-655 mm)
function getPtKeyNum(x: number, y: number, z: number): number {
  const ix = Math.round(x * 50) + 32768;
  const iy = Math.round(y * 50) + 32768;
  const iz = Math.round(z * 50) + 32768;
  return (ix * 65536 + iy) * 65536 + iz;
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
  const numTriangles = index ? Math.floor(index.count / 3) : Math.floor(posAttr.count / 3);

  interface NumEdgeEntry {
    count: number;
    k1: number;
    k2: number;
  }

  const edgeMap = new Map<string, NumEdgeEntry>();
  const pts = new Map<number, Point3D>();

  function getEdgeKey(k1: number, k2: number): string {
    return k1 < k2 ? `${k1}_${k2}` : `${k2}_${k1}`;
  }

  // Find extreme Y bounds to isolate the base planar cut plane
  let minY = Infinity,
    maxY = -Infinity;
  for (let i = 0; i < posAttr.count; i++) {
    const y = posAttr.getY(i);
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  const cutY = isUpper ? maxY : minY;

  // Scan ALL triangles so no artificial Y-threshold ever bisects the mesh into fake boundary loops
  for (let i = 0; i < numTriangles; i++) {
    const i0 = index ? index.getX(i * 3) : i * 3;
    const i1 = index ? index.getX(i * 3 + 1) : i * 3 + 1;
    const i2 = index ? index.getX(i * 3 + 2) : i * 3 + 2;

    const x0 = posAttr.getX(i0), y0 = posAttr.getY(i0), z0 = posAttr.getZ(i0);
    const x1 = posAttr.getX(i1), y1 = posAttr.getY(i1), z1 = posAttr.getZ(i1);
    const x2 = posAttr.getX(i2), y2 = posAttr.getY(i2), z2 = posAttr.getZ(i2);

    const k0 = getPtKeyNum(x0, y0, z0);
    const k1 = getPtKeyNum(x1, y1, z1);
    const k2 = getPtKeyNum(x2, y2, z2);

    const ks = [k0, k1, k2];
    const vs: Point3D[] = [
      { x: x0, y: y0, z: z0 },
      { x: x1, y: y1, z: z1 },
      { x: x2, y: y2, z: z2 },
    ];

    for (let j = 0; j < 3; j++) {
      const a = ks[j]!;
      const b = ks[(j + 1) % 3]!;
      if (a === b) continue;
      if (!pts.has(a)) pts.set(a, vs[j]!);
      if (!pts.has(b)) pts.set(b, vs[(j + 1) % 3]!);
      const ek = getEdgeKey(a, b);
      let entry = edgeMap.get(ek);
      if (!entry) {
        entry = { count: 0, k1: a, k2: b };
        edgeMap.set(ek, entry);
      }
      entry.count++;
    }
  }

  // Find single-use boundary edges
  const adj = new Map<number, number[]>();
  for (const entry of edgeMap.values()) {
    if (entry.count === 1) {
      if (!adj.has(entry.k1)) adj.set(entry.k1, []);
      if (!adj.has(entry.k2)) adj.set(entry.k2, []);
      adj.get(entry.k1)!.push(entry.k2);
      adj.get(entry.k2)!.push(entry.k1);
    }
  }

  if (adj.size === 0) return geometry;

  // Extract boundary chains and automatically split figure-8 pinched loops into simple cycles
  const usedEdges = new Set<string>();
  const loops: number[][] = [];
  const openChains: number[][] = [];

  function walkComponent(start: number, preferSimpleCycle: boolean): void {
    const stack: number[] = [start];
    const indexInStack = new Map<number, number>([[start, 0]]);
    while (true) {
      const curr = stack[stack.length - 1]!;
      const neighbors = adj.get(curr);
      if (!neighbors) break;
      let chosen: number | null = null;
      for (const n of neighbors) {
        const ek = getEdgeKey(curr, n);
        if (!usedEdges.has(ek)) {
          chosen = n;
          break;
        }
      }
      if (chosen === null) break;
      usedEdges.add(getEdgeKey(curr, chosen));

      const prevIdx = indexInStack.get(chosen);
      if (prevIdx !== undefined) {
        // Closed a simple sub-cycle [prevIdx .. stack.length - 1]
        const cycle = stack.slice(prevIdx);
        for (let i = prevIdx + 1; i < stack.length; i++) {
          indexInStack.delete(stack[i]!);
        }
        stack.length = prevIdx + 1;
        if (cycle.length >= 3) loops.push(cycle);
        if (preferSimpleCycle && stack.length === 1) {
          // Continue from `chosen` if it still has unused edges
          const rem = adj
            .get(chosen)
            ?.some((n) => !usedEdges.has(getEdgeKey(chosen!, n)));
          if (!rem) break;
        }
      } else {
        indexInStack.set(chosen, stack.length);
        stack.push(chosen);
      }
    }
    if (stack.length >= 3) {
      const pStart = pts.get(stack[0]!)!;
      const pEnd = pts.get(stack[stack.length - 1]!)!;
      const gap = Math.hypot(
        pStart.x - pEnd.x,
        pStart.y - pEnd.y,
        pStart.z - pEnd.z,
      );
      if (gap < 1.5) {
        loops.push(stack);
      } else {
        openChains.push(stack);
      }
    } else if (stack.length >= 2) {
      openChains.push(stack);
    }
  }

  for (const [k, neighbors] of adj.entries()) {
    if (neighbors.length % 2 === 1) {
      const hasUnused = neighbors.some((n) => !usedEdges.has(getEdgeKey(k, n)));
      if (hasUnused) walkComponent(k, false);
    }
  }
  for (const k of adj.keys()) {
    const neighbors = adj.get(k)!;
    const hasUnused = neighbors.some((n) => !usedEdges.has(getEdgeKey(k, n)));
    if (hasUnused) walkComponent(k, true);
  }

  // Stitch nearby open chain segments (< 2.5 mm gap)
  while (openChains.length > 0) {
    const curr = openChains.shift()!;
    let merged = true;
    while (merged) {
      merged = false;
      const cStart = pts.get(curr[0]!)!;
      const cEnd = pts.get(curr[curr.length - 1]!)!;
      if (
        curr.length >= 3 &&
        Math.hypot(cStart.x - cEnd.x, cStart.y - cEnd.y, cStart.z - cEnd.z) < 2.5
      ) {
        break;
      }

      let bestIdx = -1;
      let bestDist = 2.5;
      let bestReverse = false;
      for (let i = 0; i < openChains.length; i++) {
        const cand = openChains[i]!;
        const s = pts.get(cand[0]!)!;
        const e = pts.get(cand[cand.length - 1]!)!;
        const dEndStart = Math.hypot(cEnd.x - s.x, cEnd.y - s.y, cEnd.z - s.z);
        const dEndEnd = Math.hypot(cEnd.x - e.x, cEnd.y - e.y, cEnd.z - e.z);
        if (dEndStart < bestDist) {
          bestDist = dEndStart;
          bestIdx = i;
          bestReverse = false;
        }
        if (dEndEnd < bestDist) {
          bestDist = dEndEnd;
          bestIdx = i;
          bestReverse = true;
        }
      }
      if (bestIdx >= 0) {
        const picked = openChains.splice(bestIdx, 1)[0]!;
        if (bestReverse) picked.reverse();
        curr.push(...picked);
        merged = true;
      }
    }
    if (curr.length >= 3) {
      const s = pts.get(curr[0]!)!;
      const e = pts.get(curr[curr.length - 1]!)!;
      if (Math.hypot(s.x - e.x, s.y - e.y, s.z - e.z) < 2.5) {
        loops.push(curr);
      }
    }
  }

  // Filter and build clean 2D/3D loops preserving exact 1-to-1 perimeter vertices
  const candidateLoops: CleanLoop2D[] = [];
  for (const loop of loops) {
    let minLoopY = Infinity,
      maxLoopY = -Infinity;
    let minX = Infinity,
      maxX = -Infinity;
    let minZ = Infinity,
      maxZ = -Infinity;
    for (const k of loop) {
      const p = pts.get(k)!;
      if (p.y < minLoopY) minLoopY = p.y;
      if (p.y > maxLoopY) maxLoopY = p.y;
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.z < minZ) minZ = p.z;
      if (p.z > maxZ) maxZ = p.z;
    }

    const yDiff = maxLoopY - minLoopY;
    const spanX = maxX - minX;
    const spanZ = maxZ - minZ;

    // Dental horseshoe arch protection: distinguish true flat/slightly-tilted base cut from anatomical loops
    const loopNearCut = isUpper
      ? Math.abs(maxLoopY - cutY) < 2.5
      : Math.abs(minLoopY - cutY) < 2.5;
    const isBaseCut = loopNearCut && yDiff <= 3.8;
    if (!isBaseCut && spanX > 15.0 && spanZ > 15.0) continue;
    if (!isBaseCut && yDiff > 3.8) continue;
    if (!isBaseCut && spanX < 1.2 && spanZ < 1.2) continue;

    const pts2D: Vector2[] = [];
    const pts3D: Point3D[] = [];
    for (const k of loop) {
      const p = pts.get(k)!;
      pts2D.push(new Vector2(p.x, p.z));
      pts3D.push(p);
    }
    if (pts2D.length < 3) continue;

    const absArea = Math.abs(signedAreaXZ(pts2D));
    if (absArea < 0.25) continue;

    candidateLoops.push({ pts2D, pts3D, absArea, isBaseCut });
  }

  // Group concentric nested loops (outer rim + nested hollow inner rim -> Earcut hole)
  candidateLoops.sort((a, b) => b.absArea - a.absArea);
  const consumedAsHole = new Set<number>();
  const capTriangles: Point3D[] = [];

  for (let oi = 0; oi < candidateLoops.length; oi++) {
    if (consumedAsHole.has(oi)) continue;
    const outer = candidateLoops[oi]!;
    const holes2D: Vector2[][] = [];
    const combinedPts3D: Point3D[] = [...outer.pts3D];

    for (let hi = oi + 1; hi < candidateLoops.length; hi++) {
      if (consumedAsHole.has(hi)) continue;
      const inner = candidateLoops[hi]!;
      let insideCount = 0;
      const sampleStep = Math.max(1, Math.floor(inner.pts2D.length / 5));
      let sampleTotal = 0;
      for (let s = 0; s < inner.pts2D.length; s += sampleStep) {
        sampleTotal++;
        const sp = inner.pts2D[s]!;
        if (pointInPolygonXZ(sp.x, sp.y, outer.pts2D)) {
          insideCount++;
        }
      }
      if (outer.isBaseCut && inner.isBaseCut && insideCount === sampleTotal) {
        consumedAsHole.add(hi);
        holes2D.push(inner.pts2D);
        combinedPts3D.push(...inner.pts3D);
      }
    }

    const triIndices = ShapeUtils.triangulateShape(outer.pts2D, holes2D);
    const targetPositiveY = isUpper;

    for (const tri of triIndices) {
      const i0 = tri[0];
      const i1 = tri[1];
      const i2 = tri[2];
      if (i0 === undefined || i1 === undefined || i2 === undefined) continue;

      let p0 = combinedPts3D[i0];
      let p1 = combinedPts3D[i1];
      let p2 = combinedPts3D[i2];
      if (!p0 || !p1 || !p2) continue;

      const areaY =
        (p1.z - p0.z) * (p2.x - p0.x) - (p1.x - p0.x) * (p2.z - p0.z);
      const shouldFlip = targetPositiveY ? areaY < 0 : areaY > 0;
      if (shouldFlip) {
        const tmp = p1;
        p1 = p2;
        p2 = tmp;
      }

      // Topological interior guard (allows tiny boundary sliver tolerances of 0.04 mm^2 so perimeter edges never stay open)
      const cx = (p0.x + p1.x + p2.x) / 3;
      const cz = (p0.z + p1.z + p2.z) / 3;
      if (!isPointInsideOrOnPolyXZ(cx, cz, outer.pts2D, 0.0025)) continue;

      let inHole = false;
      for (const h of holes2D) {
        if (
          pointInPolygonXZ(cx, cz, h) &&
          distSqToPolyBoundaryXZ(cx, cz, h) > 0.0025
        ) {
          inHole = true;
          break;
        }
      }
      if (inHole) continue;

      capTriangles.push(p0, p1, p2);
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