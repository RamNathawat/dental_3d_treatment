/**
 * Automated Undercut Survey & Clinical Heatmap Analyzer.
 *
 * Evaluates dental mesh geometry along the path of insertion (draw direction)
 * to detect mechanical undercuts and generate real-time clinical heatmaps.
 */

import { BufferGeometry, Vector3 } from "three";
import type { InsertionAxis, SurveyAnalysis } from "./types";

/**
 * Computes the normalized insertion vector given arch type and manual tilt angles.
 */
export function getInsertionVector(
  axis: InsertionAxis,
  isUpper: boolean,
): Vector3 {
  // Primary draw direction:
  // Upper arch: teeth point downward (-Y), so aligner is seated upward and removed downward.
  // Lower arch: teeth point upward (+Y), so aligner is seated downward and removed upward.
  const baseDir = new Vector3(0, isUpper ? -1 : 1, 0);

  // Apply tilt angles (in radians)
  const radX = (axis.tiltX * Math.PI) / 180;
  const radY = (axis.tiltY * Math.PI) / 180;

  const v = baseDir.clone();
  v.applyAxisAngle(new Vector3(1, 0, 0), radX);
  v.applyAxisAngle(new Vector3(0, 0, 1), radY);
  return v.normalize();
}

/**
 * Analyzes dental geometry for undercuts along the path of insertion.
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

  const insertionVec = getInsertionVector(axis, isUpper);
  const minDotDraft = Math.sin((draftAngleDeg * Math.PI) / 180);

  // Step 1: Bounding extents and focal center
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;

  for (let i = 0; i < count; i += 4) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
    if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
  }

  const midX = (minX + maxX) / 2;
  const focalZ = minZ - 12.0;
  const maxSpanAngle = 0.95;
  const spanX = maxX - minX;
  const isFullArch = spanX > 30.0;
  const modelHeight = maxY - minY;

  // Step 2a: Track crown peak heights along 120 arch sectors to follow Curve of Spee
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
        sumY += peakY[idx]!;
        w++;
      }
    }
    smoothPeak[s] = w > 0 ? sumY / w : isUpper ? minY : maxY;
  }

  // Step 2b: Track maximum convexity (height of contour) within the clinical crown zone
  const maxContourRadius = new Float32Array(numSectors);
  maxContourRadius.fill(0);

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
    const tip = smoothPeak[s]!;
    const distFromTip = isUpper ? y - tip : tip - y;

    // Only clinical crown vertices define tooth contour boundary, preventing base flaring
    if (!isFullArch || (distFromTip >= 0 && distFromTip <= 7.2)) {
      const r = Math.hypot(x - midX, z - focalZ);
      if (r > maxContourRadius[s]!) {
        maxContourRadius[s] = r;
      }
    }
  }

  // Smooth contour boundary
  const smoothContour = new Float32Array(numSectors);
  for (let s = 0; s < numSectors; s++) {
    let sum = 0, w = 0;
    for (let d = -2; d <= 2; d++) {
      const idx = s + d;
      if (idx >= 0 && idx < numSectors) {
        sum += maxContourRadius[idx]!;
        w++;
      }
    }
    smoothContour[s] = w > 0 ? sum / w : maxContourRadius[s]!;
  }

  // Step 3: Compute undercut depth and heatmap colors for each vertex
  const depths = new Float32Array(count);
  const heatmapColors = new Float32Array(count * 3);
  const undercutList: number[] = [];

  let maxDepth = 0;
  let totalDepthSum = 0;
  let affectedCount = 0;

  const vNorm = new Vector3();

  for (let i = 0; i < count; i++) {
    vNorm.set(norm.getX(i), norm.getY(i), norm.getZ(i));
    const dot = vNorm.dot(insertionVec);

    const x = pos.getX(i), yVal = pos.getY(i), z = pos.getZ(i);
    const angle = Math.atan2(x - midX, z - focalZ);
    const s = Math.max(
      0,
      Math.min(
        numSectors - 1,
        Math.floor(((angle + maxSpanAngle) / (2 * maxSpanAngle)) * numSectors),
      ),
    );

    const r = Math.hypot(x - midX, z - focalZ);
    const contourR = smoothContour[s]!;
    const tip = smoothPeak[s]!;
    const distFromTip = isUpper ? yVal - tip : tip - yVal;

    // Outward radial direction from arch focal center
    const rx = x - midX;
    const rz = z - focalZ;
    const rHypot = Math.hypot(rx, rz);
    const normRadialDot = rHypot > 0.001 ? (vNorm.x * rx + vNorm.z * rz) / rHypot : 0;

    // ────────────────────────────────────────────────────────────────────────
    // Clinical Boundary Exclusions:
    // 1. Base cut plane: flat mechanical mounting cut on clinical dental models (>16mm)
    // 2. Occlusal table & incisal edges: functional biting surfaces must NEVER have
    //    undercut depths or wax so the aligner seats with solid vertical occlusal stops
    // 3. Alveolar bone & deep gums: aligners terminate 1-2mm from CEJ; jawbone is NOT
    //    a dental undercut and must never receive automated dentition blockout
    // 4. Anterior facial enamel: labial surface of incisors and canines is the primary
    //    aesthetic and tracking surface; it is naturally draft-compliant during aligner
    //    seating and must NEVER be flagged as a retentive locking undercut
    // ────────────────────────────────────────────────────────────────────────
    const isBaseCut = modelHeight > 16.0 && (isUpper
      ? (yVal >= maxY - 1.8 && vNorm.y > 0.65)
      : (yVal <= minY + 1.8 && vNorm.y < -0.65));

    const isOcclusalTable = isFullArch && (
      distFromTip <= 1.2 ||
      (distFromTip <= 3.2 && (isUpper ? vNorm.y < -0.20 : vNorm.y > 0.20))
    );

    const isAlveolarBone = isFullArch && (distFromTip > 6.8);

    const isAnteriorFacial = isFullArch && normRadialDot > 0.20 && Math.abs(angle) < 0.85 && distFromTip <= 6.8;

    if (isBaseCut || isOcclusalTable || isAlveolarBone || isAnteriorFacial) {
      depths[i] = 0;
      const cIdx = i * 3;
      heatmapColors[cIdx] = 0.25;
      heatmapColors[cIdx + 1] = 0.78;
      heatmapColors[cIdx + 2] = 0.35;
      continue;
    }

    // An undercut is any surface region facing away from the insertion vector,
    // or recessed behind the height of contour along the tooth boundary.
    let depth = 0;
    if (dot < minDotDraft) {
      // Calculate radial undercut depth in millimeters
      const rawDepth = Math.max(0, contourR - r);
      // Scale with negative dot projection to accurately represent clinical undercut severity
      depth = Math.min(2.0, rawDepth * Math.abs(dot) * 0.45);
    }

    depths[i] = depth;

    if (depth > 0.05) {
      undercutList.push(i);
      if (depth > maxDepth) maxDepth = depth;
      totalDepthSum += depth;
      affectedCount++;
    }

    // Heatmap Colors:
    // Green (Safe / Draft compliant): [0.22, 0.78, 0.35]
    // Yellow (Mild retention: 0.1mm - 0.4mm): [0.95, 0.75, 0.15]
    // Red (Critical locking undercut: >= 0.5mm): [0.92, 0.18, 0.18]
    const cIdx = i * 3;
    if (depth <= 0.08) {
      // Normal tooth ivory with slight green tint for clear path of draw
      heatmapColors[cIdx] = 0.25;
      heatmapColors[cIdx + 1] = 0.78;
      heatmapColors[cIdx + 2] = 0.35;
    } else if (depth < 0.45) {
      // Mild undercut / moderate retention (Yellow -> Orange)
      const t = (depth - 0.08) / (0.45 - 0.08);
      heatmapColors[cIdx] = 0.95;
      heatmapColors[cIdx + 1] = 0.75 - t * 0.35;
      heatmapColors[cIdx + 2] = 0.12;
    } else {
      // Deep retention / severe undercut (Vibrant Red)
      heatmapColors[cIdx] = 0.92;
      heatmapColors[cIdx + 1] = 0.15;
      heatmapColors[cIdx + 2] = 0.15;
    }
  }

  const avgDepth = affectedCount > 0 ? totalDepthSum / affectedCount : 0;
  // Approximate surface area (assume typical vertex spacing ~0.2mm - 0.3mm => ~0.06mm² per vertex)
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
