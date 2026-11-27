/**
 * Automated Undercut Survey & Clinical Heatmap Analyzer.
 *
 * Evaluates dental mesh geometry along the path of insertion (draw direction)
 * to detect mechanical undercuts and generate real-time clinical heatmaps.
 */

import { BufferGeometry, Vector3 } from "three";
import type { InsertionAxis, SurveyAnalysis } from "./types";

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
 * Analyzes dental geometry for mechanical undercuts along the true path of insertion
 * using an orthographic draw-axis height-field silhouette shadow map.
 */
export function analyzeUndercuts(
  geometry: BufferGeometry,
  isUpper: boolean,
  axis: InsertionAxis = { x: 0, y: isUpper ? -1 : 1, z: 0, tiltX: 0, tiltY: 0 },
  draftAngleDeg = 2.0,
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

  const upVec = getInsertionVector(axis, isUpper);
  const minDotDraft = Math.sin((draftAngleDeg * Math.PI) / 180);

  // Build orthonormal 2D projection basis perpendicular to the draw axis
  const refAxis = Math.abs(upVec.x) < 0.85 ? new Vector3(1, 0, 0) : new Vector3(0, 0, 1);
  const e1 = new Vector3().crossVectors(upVec, refAxis).normalize();
  const e2 = new Vector3().crossVectors(upVec, e1).normalize();

  // Optional vertex color segmentation to avoid flagging non-crown deep gingiva on colored casts
  const colorAttr =
    (geometry.userData?.baseColors?.count === count ? geometry.userData.baseColors : null) ||
    geometry.getAttribute("color");
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
      const isAtt =
        (r > 0.75 && g > 0.16 && g < 0.55 && b < 0.18) ||
        (r > 0.85 && g > 0.35 && g < 0.72 && b < 0.28);
      if (!isAtt && g < 0.30 && r > 0.30 && r - g > 0.08) {
        isGumColor[i] = 1;
        gumVertCount++;
      } else {
        toothVertCount++;
      }
    }
  }
  const hasToothGumSegmentation = gumVertCount > 0 && toothVertCount > 0;

  // Step 1: Bounding extents and arch coordinates + projected draw-plane coordinates
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;
  let minU = Infinity, maxU = -Infinity;
  let minW = Infinity, maxW = -Infinity;

  const projU = new Float32Array(count);
  const projW = new Float32Array(count);
  const projH = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
    if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;

    const u = x * e1.x + y * e1.y + z * e1.z;
    const w = x * e2.x + y * e2.y + z * e2.z;
    const h = x * upVec.x + y * upVec.y + z * upVec.z;
    projU[i] = u;
    projW[i] = w;
    projH[i] = h;
    if (u < minU) minU = u; if (u > maxU) maxU = u;
    if (w < minW) minW = w; if (w > maxW) maxW = w;
  }

  const midX = (minX + maxX) * 0.5;
  const focalZ = minZ - 12.0;
  const maxSpanAngle = 0.95;
  const spanX = maxX - minX;
  const isFullArch = spanX > 30.0;
  const modelHeight = maxY - minY;

  // Step 2a: Track crown peak heights along 120 arch sectors (follows Curve of Spee)
  const numSectors = 120;
  const peakY = new Float32Array(numSectors);
  peakY.fill(isUpper ? Infinity : -Infinity);

  for (let i = 0; i < count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const angle = Math.atan2(x - midX, z - focalZ);
    const s = Math.max(
      0,
      Math.min(
        numSectors - 1,
        Math.floor(((angle + maxSpanAngle) / (2 * maxSpanAngle)) * numSectors),
      ),
    );
    if (isUpper) {
      if (y < peakY[s]!) peakY[s] = y;
    } else {
      if (y > peakY[s]!) peakY[s] = y;
    }
  }

  const smoothPeak = new Float32Array(numSectors);
  for (let s = 0; s < numSectors; s++) {
    let sumY = 0, w = 0;
    for (let d = -3; d <= 3; d++) {
      const idx = s + d;
      if (idx >= 0 && idx < numSectors) {
        const pv = peakY[idx]!;
        if (isUpper ? pv < Infinity : pv > -Infinity) {
          sumY += pv;
          w++;
        }
      }
    }
    smoothPeak[s] = w > 0 ? sumY / w : isUpper ? minY : maxY;
  }

  // Step 2b: Rasterize orthographic draw-axis height-of-contour silhouette hMax(u, w)
  const spanU = Math.max(1e-3, maxU - minU);
  const spanW = Math.max(1e-3, maxW - minW);
  const targetStep = 0.28;
  const nu = Math.max(16, Math.min(340, Math.ceil(spanU / targetStep) + 3));
  const nw = Math.max(16, Math.min(340, Math.ceil(spanW / targetStep) + 3));
  const padU = 0.5;
  const padW = 0.5;
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
    const h0 = projH[i0]!, h1 = projH[i1]!, h2 = projH[i2]!;

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

  // Step 3: Compute true horizontal undercut shadow depth & heatmap colors for each vertex
  const depths = new Float32Array(count);
  const heatmapColors = new Float32Array(count * 3);
  const undercutList: number[] = [];

  let maxDepth = 0;
  let totalDepthSum = 0;
  let affectedCount = 0;

  const vNorm = new Vector3();
  const maxRadiusCells = Math.min(12, Math.ceil(2.6 / Math.min(du, dw)));

  for (let i = 0; i < count; i++) {
    vNorm.set(norm.getX(i), norm.getY(i), norm.getZ(i));
    const dot = vNorm.dot(upVec);

    const x = pos.getX(i), yVal = pos.getY(i), z = pos.getZ(i);
    const angle = Math.atan2(x - midX, z - focalZ);
    const s = Math.max(
      0,
      Math.min(
        numSectors - 1,
        Math.floor(((angle + maxSpanAngle) / (2 * maxSpanAngle)) * numSectors),
      ),
    );

    const tip = smoothPeak[s]!;
    const distFromTip = isUpper ? yVal - tip : tip - yVal;

    const rx = x - midX;
    const rz = z - focalZ;
    const rHypot = Math.hypot(rx, rz);
    const normRadialDot = rHypot > 0.001 ? (vNorm.x * rx + vNorm.z * rz) / rHypot : 0;

    // Clinical Boundary Exclusions:
    const isBaseCut = modelHeight > 16.0 && (isUpper
      ? (yVal >= maxY - 1.8 && vNorm.y > 0.65)
      : (yVal <= minY + 1.8 && vNorm.y < -0.65));

    const isBaseZone = modelHeight > 12.0 && (isUpper ? yVal >= maxY - 2.2 : yVal <= minY + 2.2);

    const isOcclusalTable = isFullArch && (
      distFromTip <= 1.2 ||
      (distFromTip <= 3.2 && (isUpper ? vNorm.y < -0.20 : vNorm.y > 0.20))
    );

    const maxCrownHeight = isUpper ? (Math.abs(angle) < 0.55 ? 8.8 : 7.6) : (Math.abs(angle) < 0.55 ? 8.2 : 7.2);
    const isAlveolarBone = isFullArch && (distFromTip > maxCrownHeight);
    const isAnteriorFacial = isFullArch && normRadialDot > 0.42 && Math.abs(angle) < 0.85 && distFromTip <= maxCrownHeight;
    const isAnteriorLingual = isFullArch && normRadialDot < 0.10 && Math.abs(angle) < 0.72;
    const isDeepGum = hasToothGumSegmentation && isGumColor[i] === 1 && (!isFullArch || distFromTip > 4.5);

    if (
      isBaseCut ||
      isBaseZone ||
      isOcclusalTable ||
      isAlveolarBone ||
      isAnteriorFacial ||
      isAnteriorLingual ||
      isDeepGum
    ) {
      depths[i] = 0;
      const cIdx = i * 3;
      heatmapColors[cIdx] = 0.25;
      heatmapColors[cIdx + 1] = 0.78;
      heatmapColors[cIdx + 2] = 0.35;
      continue;
    }

    let depth = 0;
    const hVertex = projH[i]!;
    const gi = Math.max(0, Math.min(nu - 1, Math.round((projU[i]! - u0Grid) / du)));
    const gw = Math.max(0, Math.min(nw - 1, Math.round((projW[i]! - w0Grid) / dw)));
    const hAbove = hSilhouette[gi * nw + gw]!;

    // Genuine overhang exists when vertex faces away from draw AND sits inside a higher coronal shadow
    if (dot < minDotDraft && hAbove > hVertex + 0.05) {
      let minEscapeDistSq = 2.6 * 2.6;
      let foundEscape = false;
      const uVertex = projU[i]!;
      const wVertex = projW[i]!;

      for (let rStep = 1; rStep <= maxRadiusCells; rStep++) {
        const minRDist = Math.max(0, (rStep - 1) * Math.min(du, dw));
        if (foundEscape && minRDist * minRDist >= minEscapeDistSq) break;

        for (let di = -rStep; di <= rStep; di++) {
          const ui = gi + di;
          if (ui < 0 || ui >= nu) continue;
          const rowOff = ui * nw;
          for (let dj = -rStep; dj <= rStep; dj++) {
            if (Math.abs(di) !== rStep && Math.abs(dj) !== rStep) continue;
            const wj = gw + dj;
            if (wj < 0 || wj >= nw) continue;

            if (hSilhouette[rowOff + wj]! <= hVertex + 0.03) {
              const cellU = u0Grid + ui * du;
              const cellW = w0Grid + wj * dw;
              const distSq = (cellU - uVertex) * (cellU - uVertex) + (cellW - wVertex) * (cellW - wVertex);
              if (distSq < minEscapeDistSq) {
                minEscapeDistSq = distSq;
                foundEscape = true;
              }
            }
          }
        }
      }

      const shadowDist = foundEscape ? Math.sqrt(minEscapeDistSq) : 2.5;
      depth = Math.min(2.5, Math.max(0, shadowDist));
    }

    depths[i] = depth;

    if (depth > 0.05) {
      undercutList.push(i);
      if (depth > maxDepth) maxDepth = depth;
      totalDepthSum += depth;
      affectedCount++;
    }

    const cIdx = i * 3;
    if (depth <= 0.08) {
      heatmapColors[cIdx] = 0.25;
      heatmapColors[cIdx + 1] = 0.78;
      heatmapColors[cIdx + 2] = 0.35;
    } else if (depth < 0.45) {
      const t = (depth - 0.08) / (0.45 - 0.08);
      heatmapColors[cIdx] = 0.95;
      heatmapColors[cIdx + 1] = 0.75 - t * 0.35;
      heatmapColors[cIdx + 2] = 0.12;
    } else {
      heatmapColors[cIdx] = 0.92;
      heatmapColors[cIdx + 1] = 0.15;
      heatmapColors[cIdx + 2] = 0.15;
    }
  }

  const avgDepth = affectedCount > 0 ? totalDepthSum / affectedCount : 0;
  const approxArea = affectedCount * 0.065;

  return {
    depths,
    heatmapColors,
    maxDepthMm: Number(maxDepth.toFixed(2)),
    avgDepthMm: Number(avgDepth.toFixed(2)),
    undercutAreaMm2: Number(approxArea.toFixed(1)),
    undercutIndices: new Uint32Array(undercutList),
  };
}
