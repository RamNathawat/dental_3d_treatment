/**
 * Digital Wax Blockout Mesh Generator.
 *
 * Implements:
 * 1. Interproximal Wax Blockout (embrasures & missing tooth spans).
 * 2. Gingival Line Relief (cervical margin blockout, doctor toggleable).
 * 3. Dentition Undercut Fill (draft angle positive, per-tooth overrides).
 *
 * Produces:
 * - A discrete "Digital Wax" overlay mesh (rendered in dental wax red #dc2626).
 * - A unified watertight model geometry ready for binary STL export.
 */

import {
  BufferAttribute,
  BufferGeometry,
  Vector3,
} from "three";
import type {
  BlockoutProtocol,
  StageBlockoutResult,
} from "./types";
import { analyzeUndercuts } from "./undercut-analyzer";
import { identifyToothAtPoint } from "../tooth-data";

/**
 * Generates blockout geometry for a dental arch according to the clinical protocol.
 */
export function generateBlockout(
  baseGeometry: BufferGeometry,
  isUpper: boolean,
  protocol: BlockoutProtocol,
  stageNumber = 1,
  stageId = `stage-${String(stageNumber).padStart(2, "0")}`,
  sculptDeltas?: Map<number, [number, number, number]>,
): StageBlockoutResult {
  const pos = baseGeometry.getAttribute("position");
  if (!pos || pos.count === 0) {
    return {
      stageId,
      stageNumber,
      baseGeometry,
      waxGeometry: null,
      mergedGeometry: baseGeometry.clone(),
      lastUpdated: Date.now(),
    };
  }

  // Ensure vertex normals exist
  if (!baseGeometry.getAttribute("normal")) {
    baseGeometry.computeVertexNormals();
  }
  const norm = baseGeometry.getAttribute("normal");
  const count = pos.count;

  // Run automated survey analysis
  const survey = analyzeUndercuts(
    baseGeometry,
    isUpper,
    protocol.insertionAxis,
    protocol.undercut.draftAngleDeg,
  );

  // Compute arch extents and geometry centers
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
  const bounds = { minX, maxX, minZ, maxZ };

  // Track arch curve crown peak heights
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
    let sum = 0, w = 0;
    for (let d = -3; d <= 3; d++) {
      const idx = s + d;
      if (idx >= 0 && idx < numSectors) {
        sum += peakY[idx]!;
        w++;
      }
    }
    smoothPeak[s] = w > 0 ? sum / w : isUpper ? minY : maxY;
  }

  // Clone positions for the merged final geometry
  const mergedPositions = new Float32Array(pos.array);
  // Arrays for the standalone "Red Digital Wax" overlay
  const waxVertexIndices: number[] = [];
  const waxOffsets = new Float32Array(count * 3);

  const vPos = new Vector3();
  const vNorm = new Vector3();

  // Iterate over every vertex and calculate blockout additions
  for (let i = 0; i < count; i++) {
    vPos.set(pos.getX(i), pos.getY(i), pos.getZ(i));
    vNorm.set(norm.getX(i), norm.getY(i), norm.getZ(i));

    const angle = Math.atan2(vPos.x - midX, vPos.z - focalZ);
    const s = Math.max(
      0,
      Math.min(
        numSectors - 1,
        Math.floor(((angle + maxSpanAngle) / (2 * maxSpanAngle)) * numSectors),
      ),
    );
    const tip = smoothPeak[s]!;
    const distFromTip = isUpper ? vPos.y - tip : tip - vPos.y;

    // Identify tooth FDI number at this vertex
    const toothInfo = identifyToothAtPoint(
      { x: vPos.x, y: vPos.y, z: vPos.z },
      isUpper,
      bounds,
    );
    const fdi = toothInfo.fdi;

    let displacementMagnitude = 0;
    const dispVector = new Vector3();

    // ────────────────────────────────────────────────────────────────────────
    // Component 1: Interproximal Wax Blockout
    // ────────────────────────────────────────────────────────────────────────
    if (protocol.interproximal.enabled) {
      // Interproximal areas are characterized by:
      // 1. Being on the crown body (1.0mm - 5.5mm from incisal tip)
      // 2. Having horizontal normals angled sideways toward adjacent teeth rather than purely facial/lingual
      const isCrownHeight = distFromTip >= 1.0 && distFromTip <= 5.8;
      const horizontalNormalAngle = Math.abs(vNorm.x);

      // Strong lateral direction + recess indicates interproximal embrasure
      if (isCrownHeight && horizontalNormalAngle > 0.45) {
        const proxFactor = Math.min(1.0, (horizontalNormalAngle - 0.45) / 0.4);
        const proxDisp = protocol.interproximal.thicknessMm * proxFactor;
        if (proxDisp > displacementMagnitude) {
          displacementMagnitude = proxDisp;
          // Displace outward along lateral normal to bridge interdental gap
          dispVector.set(vNorm.x * 0.8, 0, vNorm.z * 0.8).normalize().multiplyScalar(proxDisp);
        }
      }
    }

    // ────────────────────────────────────────────────────────────────────────
    // Component 2: Gingival Line Blockout (Cervical Margin Relief)
    // ────────────────────────────────────────────────────────────────────────
    if (protocol.gingival.enabled) {
      // Cervical line is around 4.8mm - 6.5mm from crown tip
      const isCervicalZone = distFromTip >= 4.5 && distFromTip <= 6.8;
      if (isCervicalZone) {
        // Exclude missing tooth spans if requested (teeth 18, 28, 38, 48 or marked edentulous)
        const isEdentulous = protocol.gingival.excludeEdentulous && (fdi % 10 === 8 || distFromTip > 6.2);
        if (!isEdentulous) {
          const gingivalDisp = protocol.gingival.reliefMm;
          if (gingivalDisp > displacementMagnitude) {
            displacementMagnitude = gingivalDisp;
            // Displace outward along cervical normal
            dispVector.set(vNorm.x, 0, vNorm.z).normalize().multiplyScalar(gingivalDisp);
          }
        }
      }
    }

    // ────────────────────────────────────────────────────────────────────────
    // Component 3: Dentition Undercut Blockout
    // ────────────────────────────────────────────────────────────────────────
    if (protocol.undercut.enabled) {
      // Check per-tooth override (doctor can disable blockout on specific teeth)
      const toothAllowed = protocol.undercut.perTooth[fdi] !== false;
      const depth = survey.depths[i] ?? 0;

      if (toothAllowed && depth > protocol.undercut.maxDepthMm) {
        const excessDepth = depth - protocol.undercut.maxDepthMm;
        const undercutDisp = Math.min(1.5, excessDepth * 0.85);

        if (undercutDisp > displacementMagnitude) {
          displacementMagnitude = undercutDisp;
          // Offset radially outward from arch center to eliminate negative draft
          const radial = new Vector3(vPos.x - midX, 0, vPos.z - focalZ).normalize();
          dispVector.copy(radial).multiplyScalar(undercutDisp);
        }
      }
    }

    // ────────────────────────────────────────────────────────────────────────
    // Component 4: Apply Manual Sculpt Deltas (if any recorded)
    // ────────────────────────────────────────────────────────────────────────
    if (sculptDeltas && sculptDeltas.has(i)) {
      const delta = sculptDeltas.get(i)!;
      dispVector.x += delta[0];
      dispVector.y += delta[1];
      dispVector.z += delta[2];
      displacementMagnitude = Math.max(displacementMagnitude, Math.hypot(delta[0], delta[1], delta[2]));
    }

    // Apply displacement to merged geometry and record for discrete wax overlay
    if (displacementMagnitude > 0.02) {
      const idx0 = i * 3;
      const idx1 = idx0 + 1;
      const idx2 = idx0 + 2;
      mergedPositions[idx0] = (mergedPositions[idx0] ?? 0) + dispVector.x;
      mergedPositions[idx1] = (mergedPositions[idx1] ?? 0) + dispVector.y;
      mergedPositions[idx2] = (mergedPositions[idx2] ?? 0) + dispVector.z;

      waxVertexIndices.push(i);
      waxOffsets[idx0] = dispVector.x;
      waxOffsets[idx1] = dispVector.y;
      waxOffsets[idx2] = dispVector.z;
    }
  }

  // Create final merged BufferGeometry
  const mergedGeometry = baseGeometry.clone();
  mergedGeometry.setAttribute("position", new BufferAttribute(mergedPositions, 3));
  mergedGeometry.computeVertexNormals();

  // Create discrete "Digital Wax" overlay geometry
  let waxGeometry: BufferGeometry | null = null;
  if (waxVertexIndices.length > 0) {
    waxGeometry = createWaxOverlayGeometry(
      baseGeometry,
      mergedPositions,
      waxVertexIndices,
    );
  }

  return {
    stageId,
    stageNumber,
    baseGeometry,
    waxGeometry,
    mergedGeometry,
    survey,
    sculptDeltas,
    lastUpdated: Date.now(),
  };
}

/**
 * Builds a visual mesh for the added digital wax volume.
 * Rendered in dental wax red to visually contrast against the resin tooth model.
 */
function createWaxOverlayGeometry(
  baseGeom: BufferGeometry,
  displacedPositions: Float32Array,
  modifiedIndices: number[],
): BufferGeometry {
  const basePos = baseGeom.getAttribute("position");
  const waxGeom = baseGeom.clone();

  // Highlight modified vertices with slight outward displacement for crisp depth
  const posArr = new Float32Array(basePos.array);
  const count = basePos.count;
  const isModified = new Uint8Array(count);

  for (const idx of modifiedIndices) {
    isModified[idx] = 1;
    posArr[idx * 3] = displacedPositions[idx * 3]!;
    posArr[idx * 3 + 1] = displacedPositions[idx * 3 + 1]!;
    posArr[idx * 3 + 2] = displacedPositions[idx * 3 + 2]!;
  }

  waxGeom.setAttribute("position", new BufferAttribute(posArr, 3));
  waxGeom.computeVertexNormals();

  // Filter triangles: only include triangles where at least one vertex has wax applied
  const numTris = Math.floor(count / 3);
  const waxTris: number[] = [];

  for (let t = 0; t < numTris; t++) {
    const i0 = t * 3;
    const i1 = t * 3 + 1;
    const i2 = t * 3 + 2;

    if (isModified[i0] || isModified[i1] || isModified[i2]) {
      waxTris.push(
        posArr[i0 * 3]!, posArr[i0 * 3 + 1]!, posArr[i0 * 3 + 2]!,
        posArr[i1 * 3]!, posArr[i1 * 3 + 1]!, posArr[i1 * 3 + 2]!,
        posArr[i2 * 3]!, posArr[i2 * 3 + 1]!, posArr[i2 * 3 + 2]!,
      );
    }
  }

  const finalWaxGeom = new BufferGeometry();
  finalWaxGeom.setAttribute("position", new BufferAttribute(new Float32Array(waxTris), 3));
  finalWaxGeom.computeVertexNormals();
  return finalWaxGeom;
}
