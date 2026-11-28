/**
 * Automated Undercut Survey & Clinical Heatmap Analyzer.
 *
 * Evaluates dental mesh geometry along the path of insertion (draw direction)
 * using an occlusal + anterior/posterior balanced Ney-surveyor axis, unified
 * gum/tooth color segmentation, fast numeric spatial hashing, and geometry-level
 * caching for instant interactive threshold updates.
 */

import { BufferGeometry, Vector3 } from "three";
import type { InsertionAxis, SurveyAnalysis } from "./types";

/**
 * Shared vertex-color classifier distinguishing gingival mucosa from tooth enamel
 * and orthodontic attachments (aligned with `calibrateGeometryColors` in model-loader.ts).
 */
export function isGumVertexColor(r: number, g: number, b: number): boolean {
  if (r > 1.0 || g > 1.0 || b > 1.0) {
    r /= 255.0;
    g /= 255.0;
    b /= 255.0;
  }
  const isAtt =
    (r > 0.75 && g > 0.16 && g < 0.55 && b < 0.18) ||
    (r > 0.85 && g > 0.35 && g < 0.72 && b < 0.28);
  return !isAtt && ((r > 0.35 && r - g > 0.08) || (r > 0.40 && g < 0.35 && b < 0.35));
}

/**
 * Computes the normalized coronal draw direction vector given arch type and manual tilt angles.
 * Points coronally toward occlusal/incisal tips (+Y on lower arch, -Y on upper arch) so height h
 * along this axis is maximal at cusps/height-of-contour and lower apically toward gingiva.
 */
export function getInsertionVector(
  axis: InsertionAxis,
  isUpper: boolean,
): Vector3 {
  const baseDir = new Vector3(0, isUpper ? -1 : 1, 0);
  const radX = (axis.tiltX * Math.PI) / 180;
  const radY = (axis.tiltY * Math.PI) / 180;

  const v = baseDir.clone();
  v.applyAxisAngle(new Vector3(1, 0, 0), radX);
  v.applyAxisAngle(new Vector3(0, 0, 1), radY);
  return v.normalize();
}

/**
 * Fits the occlusal crest plane and applies a fast sagittal pitch sweep (-12..+12 deg)
 * to pick a balanced Ney-surveyor path of insertion that minimizes artificial anterior
 * proclination bias without losing genuine cervical/posterior overhangs.
 */
function computeBestFitArchUpVec(
  pos: { count: number; getX(i: number): number; getY(i: number): number; getZ(i: number): number },
  norm: { getX(i: number): number; getY(i: number): number; getZ(i: number): number },
  isGumColor: Uint8Array,
  hasSegmentation: boolean,
  isUpper: boolean,
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
  minZ: number,
  maxZ: number,
): Vector3 {
  const fallback = new Vector3(0, isUpper ? -1 : 1, 0);
  const midX = (minX + maxX) * 0.5;
  const focalZ = minZ - 12.0;
  const numBins = 48;
  const binX = new Float32Array(numBins);
  const binY = new Float32Array(numBins);
  const binZ = new Float32Array(numBins);
  const hasBin = new Uint8Array(numBins);
  binY.fill(isUpper ? Infinity : -Infinity);

  const stride = Math.max(1, Math.floor(pos.count / 12000));
  for (let i = 0; i < pos.count; i += stride) {
    if (hasSegmentation && isGumColor[i] === 1) continue;
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const ang = Math.atan2(x - midX, z - focalZ);
    const b = Math.max(0, Math.min(numBins - 1, Math.floor(((ang + 1.15) / 2.3) * numBins)));
    if (isUpper ? y < binY[b]! : y > binY[b]!) {
      binY[b] = y;
      binX[b] = x;
      binZ[b] = z;
      hasBin[b] = 1;
    }
  }

  let n = 0;
  let sx = 0, sy = 0, sz = 0;
  for (let b = 0; b < numBins; b++) {
    if (hasBin[b] === 1) {
      sx += binX[b]!;
      sy += binY[b]!;
      sz += binZ[b]!;
      n++;
    }
  }

  let baseAxis = fallback.clone();
  if (n >= 8) {
    const mx = sx / n, my = sy / n, mz = sz / n;
    let sxx = 0, szz = 0, sxz = 0, sxy = 0, szy = 0;
    for (let b = 0; b < numBins; b++) {
      if (hasBin[b] === 1) {
        const dx = binX[b]! - mx;
        const dy = binY[b]! - my;
        const dz = binZ[b]! - mz;
        sxx += dx * dx;
        szz += dz * dz;
        sxz += dx * dz;
        sxy += dx * dy;
        szy += dz * dy;
      }
    }
    const det = sxx * szz - sxz * sxz;
    if (Math.abs(det) >= 1e-4) {
      const slopeA = (sxy * szz - szy * sxz) / det;
      const slopeB = (sxx * szy - sxz * sxy) / det;
      const sign = isUpper ? -1 : 1;
      baseAxis = new Vector3(-slopeA * sign, sign, -slopeB * sign).normalize();
    }
  }

  // Sweep sagittal pitch candidates around X (-12..+12 deg) on tooth crown walls to equalize anterior vs posterior tilt
  const modelHeight = maxY - minY;
  const sampleStride = Math.max(1, Math.floor(pos.count / 5000));
  const antLimitZ = minZ + (maxZ - minZ) * 0.62;
  const pitchesDeg = [-12, -8, -4, 0, 4, 8, 12];
  let bestAxis = baseAxis;
  let bestScore = Infinity;
  const xAxis = new Vector3(1, 0, 0);

  for (const pitchDeg of pitchesDeg) {
    const cand = baseAxis.clone().applyAxisAngle(xAxis, (pitchDeg * Math.PI) / 180).normalize();
    const cosF = Math.max(-1, Math.min(1, cand.dot(fallback)));
    if (Math.acos(cosF) > (18 * Math.PI) / 180) continue;

    let antPenalty = 0;
    let postPenalty = 0;
    for (let i = 0; i < pos.count; i += sampleStride) {
      if (hasSegmentation && isGumColor[i] === 1) continue;
      const y = pos.getY(i);
      if (modelHeight > 14 && (isUpper ? y > maxY - 2.5 : y < minY + 2.5)) continue;
      const d = norm.getX(i) * cand.x + norm.getY(i) * cand.y + norm.getZ(i) * cand.z;
      if (d < -0.09) {
        const overhang = -d - 0.09;
        if (pos.getZ(i) > antLimitZ) {
          antPenalty += overhang * overhang;
        } else {
          postPenalty += overhang * overhang;
        }
      }
    }

    // Balance anterior vs posterior labial/lingual bias + penalize extreme anterior over-tilt
    const score = antPenalty * 1.35 + postPenalty + Math.abs(pitchDeg) * 0.02;
    if (score < bestScore) {
      bestScore = score;
      bestAxis = cand;
    }
  }

  return bestAxis;
}

interface GeomSegmentationCache {
  count: number;
  baseR: Float32Array;
  baseG: Float32Array;
  baseB: Float32Array;
  isGumColor: Uint8Array;
  hasToothGumSegmentation: boolean;
  distToGumMm: Float32Array;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
}

interface SurveyResultCache {
  key: string;
  depths: Float32Array;
  maxDepthMm: number;
  avgDepthMm: number;
  undercutAreaMm2: number;
  undercutIndices: Uint32Array;
}

function getOrBuildSegmentationCache(geometry: BufferGeometry): GeomSegmentationCache {
  const pos = geometry.getAttribute("position");
  const count = pos.count;
  const cached = geometry.userData.__ucSegCache as GeomSegmentationCache | undefined;
  if (cached && cached.count === count) {
    return cached;
  }

  const colorAttr =
    (geometry.userData?.baseColors?.count === count ? geometry.userData.baseColors : null) ||
    geometry.getAttribute("color");
  const baseR = new Float32Array(count);
  const baseG = new Float32Array(count);
  const baseB = new Float32Array(count);
  const isGumColor = new Uint8Array(count);
  let gumVertCount = 0;
  let toothVertCount = 0;

  if (colorAttr && colorAttr.count === count) {
    for (let i = 0; i < count; i++) {
      let r = colorAttr.getX(i);
      let g = colorAttr.getY(i);
      let b = colorAttr.getZ(i);
      if (r > 1.0 || g > 1.0 || b > 1.0) {
        r /= 255.0;
        g /= 255.0;
        b /= 255.0;
      }
      baseR[i] = r;
      baseG[i] = g;
      baseB[i] = b;

      if (isGumVertexColor(r, g, b)) {
        isGumColor[i] = 1;
        gumVertCount++;
      } else {
        toothVertCount++;
      }
    }
  } else {
    baseR.fill(0.84);
    baseG.fill(0.82);
    baseB.fill(0.78);
  }

  const hasToothGumSegmentation = gumVertCount > 0 && toothVertCount > 0;

  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;
  for (let i = 0; i < count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
    if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
  }

  // Voxel-deduplicated spatial hash of gum surface (avoids O(N^2) dense clusters on cold start)
  const distToGumMm = new Float32Array(count);
  distToGumMm.fill(Infinity);
  if (hasToothGumSegmentation) {
    const cellSize = 1.6;
    const voxelSize = 0.3;
    const gumBuckets = new Map<number, number[]>();
    const seenVoxels = new Set<number>();
    const hashCell = (bx: number, by: number, bz: number) =>
      ((bx + 512) * 1024 + (by + 512)) * 1024 + (bz + 512);

    for (let i = 0; i < count; i++) {
      if (isGumColor[i] === 1) {
        const px = pos.getX(i);
        const py = pos.getY(i);
        const pz = pos.getZ(i);
        const vKey = hashCell(
          Math.round(px / voxelSize),
          Math.round(py / voxelSize),
          Math.round(pz / voxelSize),
        );
        if (seenVoxels.has(vKey)) continue;
        seenVoxels.add(vKey);

        const key = hashCell(
          Math.round(px / cellSize),
          Math.round(py / cellSize),
          Math.round(pz / cellSize),
        );
        let arr = gumBuckets.get(key);
        if (!arr) {
          arr = [];
          gumBuckets.set(key, arr);
        }
        arr.push(i);
      }
    }

    const searchMaxSq = 4.0 * 4.0;
    const innerBoundSq = cellSize * cellSize;
    for (let i = 0; i < count; i++) {
      if (isGumColor[i] === 1) {
        distToGumMm[i] = 0;
        continue;
      }
      const px = pos.getX(i);
      const py = pos.getY(i);
      const pz = pos.getZ(i);
      const bx = Math.round(px / cellSize);
      const by = Math.round(py / cellSize);
      const bz = Math.round(pz / cellSize);
      let bestSq = searchMaxSq;

      // Pass A: inner 3x3x3 neighborhood covers >= 1.6 mm around vertex
      for (let ox = -1; ox <= 1; ox++) {
        for (let oy = -1; oy <= 1; oy++) {
          for (let oz = -1; oz <= 1; oz++) {
            const bucket = gumBuckets.get(hashCell(bx + ox, by + oy, bz + oz));
            if (!bucket) continue;
            for (let k = 0; k < bucket.length; k++) {
              const gi = bucket[k]!;
              const dx = px - pos.getX(gi);
              const dy = py - pos.getY(gi);
              const dz = pz - pos.getZ(gi);
              const dSq = dx * dx + dy * dy + dz * dz;
              if (dSq < bestSq) bestSq = dSq;
            }
          }
        }
      }

      // Pass B: outer shell of 5x5x5 only needed when > 1.6 mm from nearest gum
      if (bestSq > innerBoundSq) {
        for (let ox = -2; ox <= 2; ox++) {
          for (let oy = -2; oy <= 2; oy++) {
            for (let oz = -2; oz <= 2; oz++) {
              if (Math.abs(ox) <= 1 && Math.abs(oy) <= 1 && Math.abs(oz) <= 1) continue;
              const bucket = gumBuckets.get(hashCell(bx + ox, by + oy, bz + oz));
              if (!bucket) continue;
              for (let k = 0; k < bucket.length; k++) {
                const gi = bucket[k]!;
                const dx = px - pos.getX(gi);
                const dy = py - pos.getY(gi);
                const dz = pz - pos.getZ(gi);
                const dSq = dx * dx + dy * dy + dz * dz;
                if (dSq < bestSq) bestSq = dSq;
              }
            }
          }
        }
      }

      if (bestSq < searchMaxSq) {
        distToGumMm[i] = Math.sqrt(bestSq);
      }
    }
  }

  const nextCache: GeomSegmentationCache = {
    count,
    baseR,
    baseG,
    baseB,
    isGumColor,
    hasToothGumSegmentation,
    distToGumMm,
    minX,
    maxX,
    minY,
    maxY,
    minZ,
    maxZ,
  };
  geometry.userData.__ucSegCache = nextCache;
  return nextCache;
}

function paintHeatmapFromDepths(
  depths: Float32Array,
  seg: GeomSegmentationCache,
  maxDepthMm: number,
): Float32Array {
  const count = depths.length;
  const heatmapColors = new Float32Array(count * 3);
  const safeMaxDepth = Math.max(0.08, maxDepthMm);
  const { baseR, baseG, baseB } = seg;

  for (let i = 0; i < count; i++) {
    const depth = depths[i]!;
    const cIdx = i * 3;
    if (depth <= 0.05) {
      heatmapColors[cIdx] = baseR[i]! * 0.80 + 0.12;
      heatmapColors[cIdx + 1] = baseG[i]! * 0.80 + 0.12;
      heatmapColors[cIdx + 2] = baseB[i]! * 0.80 + 0.12;
    } else if (depth <= safeMaxDepth) {
      const t = (depth - 0.05) / Math.max(0.02, safeMaxDepth - 0.05);
      heatmapColors[cIdx] = 0.98 - t * 0.02;
      heatmapColors[cIdx + 1] = 0.84 - t * 0.24;
      heatmapColors[cIdx + 2] = 0.14 - t * 0.10;
    } else {
      const t = Math.min(1.0, (depth - safeMaxDepth) / 0.55);
      heatmapColors[cIdx] = 0.98 - t * 0.05;
      heatmapColors[cIdx + 1] = 0.45 - t * 0.31;
      heatmapColors[cIdx + 2] = 0.09 + t * 0.05;
    }
  }
  return heatmapColors;
}

/**
 * Analyzes dental geometry for mechanical undercuts along the true path of insertion.
 */
export function analyzeUndercuts(
  geometry: BufferGeometry,
  isUpper: boolean,
  axis: InsertionAxis = { x: 0, y: isUpper ? -1 : 1, z: 0, tiltX: 0, tiltY: 0 },
  draftAngleDeg = 2.0,
  maxDepthMm = 0.25,
): SurveyAnalysis {
  const pos = geometry.getAttribute("position");
  if (!pos || pos.count === 0) {
    return {
      depths: new Float32Array(0),
      heatmapColors: new Float32Array(0),
      maxDepthMm: 0,
      avgDepthMm: 0,
      undercutAreaMm2: 0,
      undercutIndices: new Uint32Array(0),
    };
  }

  if (!geometry.getAttribute("normal")) {
    geometry.computeVertexNormals();
  }
  const norm = geometry.getAttribute("normal");
  const count = pos.count;
  const index = geometry.getIndex();

  const seg = getOrBuildSegmentationCache(geometry);
  const surveyKey = `${isUpper ? "U" : "L"}:${axis.tiltX.toFixed(2)}:${axis.tiltY.toFixed(2)}:${draftAngleDeg.toFixed(2)}:${count}`;
  const existingSurvey = geometry.userData.__ucSurveyResult as SurveyResultCache | undefined;

  if (existingSurvey && existingSurvey.key === surveyKey) {
    return {
      depths: existingSurvey.depths,
      heatmapColors: paintHeatmapFromDepths(existingSurvey.depths, seg, maxDepthMm),
      maxDepthMm: existingSurvey.maxDepthMm,
      avgDepthMm: existingSurvey.avgDepthMm,
      undercutAreaMm2: existingSurvey.undercutAreaMm2,
      undercutIndices: existingSurvey.undercutIndices,
    };
  }

  const {
    isGumColor,
    hasToothGumSegmentation,
    distToGumMm,
    minX,
    maxX,
    minY,
    maxY,
    minZ,
    maxZ,
  } = seg;

  const spanX = maxX - minX;
  const modelHeight = maxY - minY;
  const isFullArch = spanX > 28.0;

  // Balance sagittal draw path automatically on full arches when manual tilt is zero
  let upVec: Vector3;
  if (isFullArch && Math.abs(axis.tiltX) < 0.01 && Math.abs(axis.tiltY) < 0.01) {
    upVec = computeBestFitArchUpVec(
      pos,
      norm,
      isGumColor,
      hasToothGumSegmentation,
      isUpper,
      minX,
      maxX,
      minY,
      maxY,
      minZ,
      maxZ,
    );
  } else {
    upVec = getInsertionVector(axis, isUpper);
  }

  const minUndercutDot = -Math.sin(Math.max(4.5, draftAngleDeg * 2.5) * (Math.PI / 180));
  const draftSlope = Math.tan(Math.max(0, draftAngleDeg) * (Math.PI / 180));

  const refAxis = Math.abs(upVec.x) < 0.85 ? new Vector3(1, 0, 0) : new Vector3(0, 0, 1);
  const e1 = new Vector3().crossVectors(upVec, refAxis).normalize();
  const e2 = new Vector3().crossVectors(upVec, e1).normalize();

  const projU = new Float32Array(count);
  const projW = new Float32Array(count);
  const projH = new Float32Array(count);
  let minU = Infinity, maxU = -Infinity;
  let minW = Infinity, maxW = -Infinity;

  for (let i = 0; i < count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const u = x * e1.x + y * e1.y + z * e1.z;
    const w = x * e2.x + y * e2.y + z * e2.z;
    const h = x * upVec.x + y * upVec.y + z * upVec.z;
    projU[i] = u;
    projW[i] = w;
    projH[i] = h;
    if (u < minU) minU = u;
    if (u > maxU) maxU = u;
    if (w < minW) minW = w;
    if (w > maxW) maxW = w;
  }

  // Exclude flat/chamfered base mounting skirt and ALL gingival mucosa
  const isExcluded = new Uint8Array(count);
  const baseSkirtTol = modelHeight > 14.0 ? (hasToothGumSegmentation ? 2.1 : 2.6) : 0.8;
  for (let i = 0; i < count; i++) {
    const yVal = pos.getY(i);
    const isBaseCut =
      modelHeight >= 10.0 &&
      (isUpper ? yVal >= maxY - baseSkirtTol : yVal <= minY + baseSkirtTol);
    const isGum = hasToothGumSegmentation && isGumColor[i] === 1;
    if (isBaseCut || isGum) {
      isExcluded[i] = 1;
    }
  }

  // Rasterize orthographic crown height-of-contour silhouette hSilhouette(u, w)
  const spanU = Math.max(1e-3, maxU - minU);
  const spanW = Math.max(1e-3, maxW - minW);
  const targetStep = 0.22;
  const nu = Math.max(24, Math.min(360, Math.ceil(spanU / targetStep) + 3));
  const nw = Math.max(24, Math.min(360, Math.ceil(spanW / targetStep) + 3));
  const padU = 0.6;
  const padW = 0.6;
  const u0Grid = minU - padU;
  const w0Grid = minW - padW;
  const du = (spanU + 2 * padU) / (nu - 1);
  const dw = (spanW + 2 * padW) / (nw - 1);

  const hSilhouette = new Float32Array(nu * nw);
  hSilhouette.fill(-Infinity);

  const numTris = index ? Math.floor(index.count / 3) : Math.floor(count / 3);
  for (let t = 0; t < numTris; t++) {
    const i0 = index ? index.getX(t * 3) : t * 3;
    const i1 = index ? index.getX(t * 3 + 1) : t * 3 + 1;
    const i2 = index ? index.getX(t * 3 + 2) : t * 3 + 2;
    if (i0 >= count || i1 >= count || i2 >= count) continue;
    if (isExcluded[i0] === 1 && isExcluded[i1] === 1 && isExcluded[i2] === 1) continue;

    const gu0 = (projU[i0]! - u0Grid) / du;
    const gu1 = (projU[i1]! - u0Grid) / du;
    const gu2 = (projU[i2]! - u0Grid) / du;
    const gw0 = (projW[i0]! - w0Grid) / dw;
    const gw1 = (projW[i1]! - w0Grid) / dw;
    const gw2 = (projW[i2]! - w0Grid) / dw;

    const uMin = Math.max(0, Math.floor(Math.min(gu0, gu1, gu2)));
    const uMax = Math.min(nu - 1, Math.ceil(Math.max(gu0, gu1, gu2)));
    const wMin = Math.max(0, Math.floor(Math.min(gw0, gw1, gw2)));
    const wMax = Math.min(nw - 1, Math.ceil(Math.max(gw0, gw1, gw2)));
    if (uMax < uMin || wMax < wMin) continue;

    const denom = (gw1 - gw2) * (gu0 - gu2) + (gu2 - gu1) * (gw0 - gw2);
    const h0 = projH[i0]!;
    const h1 = projH[i1]!;
    const h2 = projH[i2]!;

    if (Math.abs(denom) < 1e-6) {
      const hMaxTri = Math.max(h0, h1, h2);
      const cu = Math.max(0, Math.min(nu - 1, Math.round((gu0 + gu1 + gu2) / 3)));
      const cw = Math.max(0, Math.min(nw - 1, Math.round((gw0 + gw1 + gw2) / 3)));
      const cIdx = cu * nw + cw;
      if (hMaxTri > hSilhouette[cIdx]!) hSilhouette[cIdx] = hMaxTri;
      continue;
    }

    const invDenom = 1.0 / denom;
    for (let ui = uMin; ui <= uMax; ui++) {
      const du2 = ui - gu2;
      const rowOff = ui * nw;
      for (let wi = wMin; wi <= wMax; wi++) {
        const dw2 = wi - gw2;
        const b0 = ((gw1 - gw2) * du2 + (gu2 - gu1) * dw2) * invDenom;
        const b1 = ((gw2 - gw0) * du2 + (gu0 - gu2) * dw2) * invDenom;
        const b2 = 1.0 - b0 - b1;
        if (b0 >= -1e-3 && b1 >= -1e-3 && b2 >= -1e-3) {
          const hVal = b0 * h0 + b1 * h1 + b2 * h2;
          if (hVal > hSilhouette[rowOff + wi]!) {
            hSilhouette[rowOff + wi] = hVal;
          }
        }
      }
    }
  }

  const compassDirs: Array<[number, number]> = [];
  for (let k = 0; k < 8; k++) {
    const a = (k * Math.PI) / 4;
    compassDirs.push([Math.cos(a), Math.sin(a)]);
  }

  const marchEscapeDistance = (
    uStart: number,
    wStart: number,
    hVert: number,
    dirU: number,
    dirW: number,
  ): number => {
    const stepMm = 0.11;
    const maxMarchMm = 2.60;
    let prevS = 0;
    let prevDiff =
      (hSilhouette[
        Math.max(0, Math.min(nu - 1, Math.round((uStart - u0Grid) / du))) * nw +
        Math.max(0, Math.min(nw - 1, Math.round((wStart - w0Grid) / dw)))
      ] ?? hVert) - hVert;

    for (let s = stepMm; s <= maxMarchMm; s += stepMm) {
      const su = uStart + s * dirU;
      const sw = wStart + s * dirW;
      const ui = Math.round((su - u0Grid) / du);
      const wi = Math.round((sw - w0Grid) / dw);
      if (ui < 0 || ui >= nu || wi < 0 || wi >= nw) {
        return s;
      }
      const hSample = hSilhouette[ui * nw + wi]!;
      const clearHeight = hVert + 0.04 + s * draftSlope;
      const diff = hSample - clearHeight;
      if (diff <= 0) {
        const denomDiff = prevDiff - diff;
        const frac = denomDiff > 1e-4 ? Math.max(0, Math.min(1, prevDiff / denomDiff)) : 1;
        return prevS + stepMm * frac;
      }
      prevS = s;
      prevDiff = diff;
    }
    return 2.5;
  };

  const depths = new Float32Array(count);
  const undercutList: number[] = [];
  let maxDepth = 0;
  let totalDepthSum = 0;
  let affectedCount = 0;

  const vNorm = new Vector3();
  const midX = (minX + maxX) * 0.5;
  const focalZ = minZ - 12.0;

  for (let i = 0; i < count; i++) {
    if (isExcluded[i] === 1) {
      depths[i] = 0;
      continue;
    }

    vNorm.set(norm.getX(i), norm.getY(i), norm.getZ(i));
    const dot = vNorm.dot(upVec);

    const uVertex = projU[i]!;
    const wVertex = projW[i]!;
    const hVertex = projH[i]!;
    const gi = Math.max(0, Math.min(nu - 1, Math.round((uVertex - u0Grid) / du)));
    const gw = Math.max(0, Math.min(nw - 1, Math.round((wVertex - w0Grid) / dw)));
    const hAbove = hSilhouette[gi * nw + gw]!;

    let depth = 0;

    if (dot < minUndercutDot && hAbove > hVertex + 0.12) {
      const nuComp = vNorm.dot(e1);
      const nwComp = vNorm.dot(e2);
      const nHorizLen = Math.hypot(nuComp, nwComp);

      if (nHorizLen >= 0.08) {
        depth = marchEscapeDistance(
          uVertex,
          wVertex,
          hVertex,
          nuComp / nHorizLen,
          nwComp / nHorizLen,
        );
      } else {
        let minEsc = 2.5;
        for (let k = 0; k < compassDirs.length; k++) {
          const [cdU, cdW] = compassDirs[k]!;
          const esc = marchEscapeDistance(uVertex, wVertex, hVertex, cdU, cdW);
          if (esc < minEsc) minEsc = esc;
        }
        depth = minEsc;
      }

      // Restrict crown undercuts to Titan-calibrated cervical height envelope:
      // tighter (~2.0 mm) on anterior facial enamel so front incisors don't turn 50% blue,
      // and ~2.6 mm (up to 3.4 mm for deep >0.85 mm pockets) on posterior/lingual walls.
      if (hasToothGumSegmentation) {
        const dGum = distToGumMm[i]!;
        const x = pos.getX(i), z = pos.getZ(i);
        const rx = x - midX, rz = z - focalZ;
        const rHypot = Math.hypot(rx, rz);
        const radDot = rHypot > 1e-3 ? (vNorm.x * rx + vNorm.z * rz) / rHypot : 0;
        const ang = Math.atan2(rx, rz);
        const isAntFacial = isFullArch && Math.abs(ang) < 0.55 && radDot > 0.25;

        const maxCejBand = isAntFacial ? 2.05 : (depth > 0.85 ? 3.4 : 2.6);
        const fadeStart = maxCejBand * 0.68;
        if (dGum >= maxCejBand) {
          depth = 0;
        } else if (dGum > fadeStart) {
          const factor = 1.0 - (dGum - fadeStart) / (maxCejBand - fadeStart);
          depth *= factor;
        }
      }

      depth = Math.min(2.5, Math.max(0, depth));
    }

    depths[i] = depth;
    if (depth > 0.05) {
      undercutList.push(i);
      if (depth > maxDepth) maxDepth = depth;
      totalDepthSum += depth;
      affectedCount++;
    }
  }

  const avgDepth = affectedCount > 0 ? totalDepthSum / affectedCount : 0;
  const approxArea = affectedCount * 0.065;

  const resultCache: SurveyResultCache = {
    key: surveyKey,
    depths,
    maxDepthMm: Number(maxDepth.toFixed(2)),
    avgDepthMm: Number(avgDepth.toFixed(2)),
    undercutAreaMm2: Number(approxArea.toFixed(1)),
    undercutIndices: new Uint32Array(undercutList),
  };
  geometry.userData.__ucSurveyResult = resultCache;

  return {
    depths: resultCache.depths,
    heatmapColors: paintHeatmapFromDepths(resultCache.depths, seg, maxDepthMm),
    maxDepthMm: resultCache.maxDepthMm,
    avgDepthMm: resultCache.avgDepthMm,
    undercutAreaMm2: resultCache.undercutAreaMm2,
    undercutIndices: resultCache.undercutIndices,
  };
}
