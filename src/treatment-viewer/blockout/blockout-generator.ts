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
import {
  computeToothCentroids,
  identifyToothAtPoint,
  LOWER_DENTAL_CONTACTS,
  UPPER_DENTAL_CONTACTS,
} from "../tooth-data";

interface ResolvedContact {
  center: Vector3;
  tangent: Vector3;
  spanDist: number;
  toothA: number;
  toothB: number;
}

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

  // Pre-calculate interdental contact locations using real tooth centroids
  const toothCentroids = computeToothCentroids(baseGeometry, isUpper);
  const contactDefinitions = isUpper ? UPPER_DENTAL_CONTACTS : LOWER_DENTAL_CONTACTS;
  const resolvedContacts: ResolvedContact[] = [];

  for (const def of contactDefinitions) {
    const cA = toothCentroids[def.toothA];
    const cB = toothCentroids[def.toothB];
    if (cA && cB) {
      const vA = new Vector3(cA[0], cA[1], cA[2]);
      const vB = new Vector3(cB[0], cB[1], cB[2]);
      const center = new Vector3().addVectors(vA, vB).multiplyScalar(0.5);
      const tangent = new Vector3(vB.x - vA.x, 0, vB.z - vA.z);
      const spanDist = tangent.length();
      if (spanDist > 0.001) {
        tangent.normalize();
        resolvedContacts.push({
          center,
          tangent,
          spanDist,
          toothA: def.toothA,
          toothB: def.toothB,
        });
      }
    }
  }

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

  const spanX = maxX - minX;
  const isFullArch = spanX > 30.0;

  // Track maximum height of contour within clinical crown zone
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

    if (!isFullArch || (distFromTip >= 0 && distFromTip <= 7.2)) {
      const r = Math.hypot(x - midX, z - focalZ);
      if (r > maxContourRadius[s]!) {
        maxContourRadius[s] = r;
      }
    }
  }

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

  // Clone positions for the merged final geometry
  const mergedPositions = new Float32Array(pos.array);
  // Arrays for the standalone "Red Digital Wax" overlay
  const waxVertexIndices: number[] = [];
  const waxOffsets = new Float32Array(count * 3);
  const vertexDisplacements = new Float32Array(count);

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
    // Clinical Boundary Exclusions:
    // 1. Base cut plane: flat mechanical mounting cut on clinical dental models (>16mm)
    //    where normals point vertically into the cut base (maxY for upper, minY for lower)
    // 2. Occlusal table & incisal edges: functional biting surfaces must NEVER have
    //    blockout wax so the aligner seats with solid vertical occlusal indexing
    // 3. Clinical crown boundary: dentition undercuts are confined to the anatomical crown
    //    (<= 6.8mm) to strictly prevent wax blankets over the alveolar bone & chin
    // ────────────────────────────────────────────────────────────────────────
    const modelHeight = maxY - minY;
    const isBaseCut = modelHeight > 16.0 && (isUpper
      ? (vPos.y >= maxY - 1.8 && vNorm.y > 0.65)
      : (vPos.y <= minY + 1.8 && vNorm.y < -0.65));

    const isOcclusalTable = isFullArch && (
      distFromTip <= 1.2 ||
      (distFromTip <= 3.2 && (isUpper ? vNorm.y < -0.20 : vNorm.y > 0.20))
    );

    const isClinicalCrown = !isFullArch || (distFromTip >= 1.0 && distFromTip <= 6.8);

    // ────────────────────────────────────────────────────────────────────────
    // Component 1: Interproximal Wax Blockout
    // ────────────────────────────────────────────────────────────────────────
    if (protocol.interproximal.enabled && !isBaseCut && !isOcclusalTable && isClinicalCrown) {
      if (resolvedContacts.length > 0) {
        // Anatomical contact zone check: find nearest interdental contact
        let nearestContact: ResolvedContact | null = null;
        let nearestDistSq = Infinity;

        for (const rc of resolvedContacts) {
          const dx = vPos.x - rc.center.x;
          const dz = vPos.z - rc.center.z;
          const distSq = dx * dx + dz * dz;
          if (distSq < nearestDistSq) {
            nearestDistSq = distSq;
            nearestContact = rc;
          }
        }

        if (nearestContact && nearestDistSq < 10.0) {
          const dy = Math.abs(vPos.y - nearestContact.center.y);
          if (dy < 4.2) {
            // Compute coordinate along the tangent line between adjacent teeth
            const dx = vPos.x - nearestContact.center.x;
            const dz = vPos.z - nearestContact.center.z;
            const dTangent = Math.abs(dx * nearestContact.tangent.x + dz * nearestContact.tangent.z);
            // Normal alignment with interdental tangent: in an embrasure groove, surface faces adjacent tooth
            const dotTangent = Math.abs(vNorm.x * nearestContact.tangent.x + vNorm.z * nearestContact.tangent.z);

            // Compute outward radial direction from arch center to suppress false facial enamel wax
            const rx = vPos.x - midX;
            const rz = vPos.z - focalZ;
            const rHypot = Math.hypot(rx, rz);
            const normRadialDot = rHypot > 0.001 ? (vNorm.x * rx + vNorm.z * rz) / rHypot : 0;
            const contourR = smoothContour[s]!;
            const isOuterFacial = isFullArch && normRadialDot > 0.58 && (rHypot >= contourR - 0.45);

            // True embrasures have normal pointing toward adjacent tooth, sit within narrow interdental corridor, and are not outer facial enamel
            const isEmbrasure = !isOuterFacial && dTangent < 1.4 && dotTangent > 0.36;
            // Missing tooth edentulous span bridging
            const isEdentulousSpan =
              protocol.interproximal.bridgeSpaces &&
              nearestContact.spanDist > 8.5 &&
              dTangent < nearestContact.spanDist * 0.45;

            if (isEmbrasure || isEdentulousSpan) {
              const embrasureFactor = isEdentulousSpan
                ? 1.0
                : Math.max(0, 1.0 - dTangent / 1.4) * Math.min(1.0, (dotTangent - 0.36) / 0.4);
              const proxDisp = protocol.interproximal.thicknessMm * embrasureFactor;

              if (proxDisp > displacementMagnitude) {
                displacementMagnitude = proxDisp;
                dispVector.copy(vNorm).multiplyScalar(proxDisp);
              }
            }
          }
        }
      } else {
        // Fallback for simple unit test / cylinder geometries
        const isCrownHeight = distFromTip >= 1.0 && distFromTip <= 5.8;
        const horizontalNormalAngle = Math.abs(vNorm.x);

        if (isCrownHeight && horizontalNormalAngle > 0.65) {
          const proxFactor = Math.min(1.0, (horizontalNormalAngle - 0.65) / 0.3);
          const proxDisp = protocol.interproximal.thicknessMm * proxFactor;
          if (proxDisp > displacementMagnitude) {
            displacementMagnitude = proxDisp;
            dispVector.set(vNorm.x * 0.8, 0, vNorm.z * 0.8).normalize().multiplyScalar(proxDisp);
          }
        }
      }
    }

    // ────────────────────────────────────────────────────────────────────────
    // Component 2: Gingival Line Blockout (Cervical Margin Relief)
    // ────────────────────────────────────────────────────────────────────────
    if (protocol.gingival.enabled && !isBaseCut && !isOcclusalTable) {
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
    if (protocol.undercut.enabled && !isBaseCut && !isOcclusalTable && isClinicalCrown) {
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
    // Component 4: Apply Manual Sculpt Deltas (Digital Wax Carver / Hot Spatula)
    // ────────────────────────────────────────────────────────────────────────
    if (sculptDeltas && sculptDeltas.has(i)) {
      const delta = sculptDeltas.get(i)!;
      // delta[0] is the scalar wax thickness adjustment in millimeters (+ for add, - for carve)
      const manualDelta = delta[0];
      // Wax thickness cannot go negative (cannot dig into enamel) and is capped at 2.5mm
      const netThickness = Math.max(0, Math.min(2.5, displacementMagnitude + manualDelta));
      displacementMagnitude = netThickness;

      if (netThickness > 0.04) {
        dispVector.copy(vNorm).multiplyScalar(netThickness);
      } else {
        dispVector.set(0, 0, 0);
      }
    }

    // Apply displacement to merged geometry and record for discrete wax overlay
    vertexDisplacements[i] = displacementMagnitude;
    if (displacementMagnitude > 0.04) {
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
      vertexDisplacements,
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
 * Strictly checks baseGeometry.index and filters out degenerate or cross-palate triangles.
 */
function createWaxOverlayGeometry(
  baseGeom: BufferGeometry,
  displacedPositions: Float32Array,
  modifiedIndices: number[],
  displacements: Float32Array,
): BufferGeometry | null {
  const basePos = baseGeom.getAttribute("position");
  if (!basePos || modifiedIndices.length === 0) return null;
  const count = basePos.count;

  // Track modified vertices with non-trivial displacement
  const isModified = new Uint8Array(count);
  for (const idx of modifiedIndices) {
    if (displacements[idx]! > 0.04) {
      isModified[idx] = 1;
    }
  }

  const waxTris: number[] = [];
  const index = baseGeom.index;

  const v0 = new Vector3();
  const v1 = new Vector3();
  const v2 = new Vector3();

  const addTriangle = (i0: number, i1: number, i2: number) => {
    // Include triangle if at least one vertex has actual wax displacement applied
    const modifiedCount = isModified[i0]! + isModified[i1]! + isModified[i2]!;
    if (modifiedCount === 0) return;

    v0.set(displacedPositions[i0 * 3]!, displacedPositions[i0 * 3 + 1]!, displacedPositions[i0 * 3 + 2]!);
    v1.set(displacedPositions[i1 * 3]!, displacedPositions[i1 * 3 + 1]!, displacedPositions[i1 * 3 + 2]!);
    v2.set(displacedPositions[i2 * 3]!, displacedPositions[i2 * 3 + 1]!, displacedPositions[i2 * 3 + 2]!);

    // Guard against degenerate or extreme cross-arch triangles (palate span is >28mm)
    const d01 = v0.distanceTo(v1);
    const d12 = v1.distanceTo(v2);
    const d20 = v2.distanceTo(v0);
    if (d01 > 16.0 || d12 > 16.0 || d20 > 16.0) return;

    waxTris.push(
      v0.x, v0.y, v0.z,
      v1.x, v1.y, v1.z,
      v2.x, v2.y, v2.z,
    );
  };

  if (index) {
    const triCount = index.count / 3;
    for (let t = 0; t < triCount; t++) {
      const i0 = index.getX(t * 3);
      const i1 = index.getX(t * 3 + 1);
      const i2 = index.getX(t * 3 + 2);
      addTriangle(i0, i1, i2);
    }
  } else {
    const triCount = Math.floor(count / 3);
    for (let t = 0; t < triCount; t++) {
      const i0 = t * 3;
      const i1 = t * 3 + 1;
      const i2 = t * 3 + 2;
      addTriangle(i0, i1, i2);
    }
  }

  if (waxTris.length === 0) return null;

  const finalWaxGeom = new BufferGeometry();
  finalWaxGeom.setAttribute("position", new BufferAttribute(new Float32Array(waxTris), 3));
  finalWaxGeom.computeVertexNormals();
  return finalWaxGeom;
}
