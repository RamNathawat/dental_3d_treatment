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
        const v = peakY[idx]!;
        if (isUpper ? v < Infinity : v > -Infinity) {
          sum += v;
          w++;
        }
      }
    }
    smoothPeak[s] = w > 0 ? sum / w : (isUpper ? minY : maxY);
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

  // Pre-calculate cervical margin boundary vertices separating crown enamel from gingiva
  const colorAttr =
    (baseGeometry.userData.baseColors instanceof BufferAttribute
      ? baseGeometry.userData.baseColors
      : null) || (baseGeometry.getAttribute("color") as BufferAttribute | undefined);

  const isCervicalBorder = new Uint8Array(count);
  let hasCervicalBorder = false;

  if (colorAttr) {
    const isGumVertex = new Uint8Array(count);
    let gumCount = 0;
    let toothCount = 0;

    for (let i = 0; i < count; i++) {
      let r = colorAttr.getX(i);
      let g = colorAttr.getY(i);
      let b = colorAttr.getZ(i);
      // Normalize if in 0..255 range (e.g. Uint8Array attributes from GLB accessors)
      if (r > 1.0 || g > 1.0 || b > 1.0) {
        r /= 255.0;
        g /= 255.0;
        b /= 255.0;
      }
      const isAttachment =
        (r > 0.75 && g > 0.16 && g < 0.55 && b < 0.18) ||
        (r > 0.85 && g > 0.35 && g < 0.72 && b < 0.28);
      // Gum tissue has distinct coral-rose color: high red, low green (< 0.28), and r significantly higher than g
      if (!isAttachment && (g < 0.28 && r > 0.30 && (r - g) > 0.10)) {
        isGumVertex[i] = 1;
        gumCount++;
      } else {
        toothCount++;
      }
    }

    // Only compute boundary if mesh contains both tooth enamel and gingiva
    if (gumCount > 0 && toothCount > 0) {
      const index = baseGeometry.getIndex();
      const numTris = index ? index.count / 3 : Math.floor(count / 3);
      // Pass 1: Mark direct boundary vertices (level 2) on triangles bridging tooth and gum (welded single-mesh scans)
      for (let t = 0; t < numTris; t++) {
        const i0 = index ? index.getX(t * 3) : t * 3;
        const i1 = index ? index.getX(t * 3 + 1) : t * 3 + 1;
        const i2 = index ? index.getX(t * 3 + 2) : t * 3 + 2;
        const sum = isGumVertex[i0]! + isGumVertex[i1]! + isGumVertex[i2]!;
        if (sum === 1 || sum === 2) {
          isCervicalBorder[i0] = 2;
          isCervicalBorder[i1] = 2;
          isCervicalBorder[i2] = 2;
          hasCervicalBorder = true;
        }
      }

      // Pass 1b: If mesh contains separate un-welded submeshes (e.g. Maestro 3D multi-mesh GLBs
      // where tooth and gum meshes are merged without welded boundary edges), detect open boundary
      // collar edges between the teeth and gingival sockets
      if (!hasCervicalBorder) {
        const edgeMap = new Map<number, number>();
        for (let t = 0; t < numTris; t++) {
          const i0 = index ? index.getX(t * 3) : t * 3;
          const i1 = index ? index.getX(t * 3 + 1) : t * 3 + 1;
          const i2 = index ? index.getX(t * 3 + 2) : t * 3 + 2;
          const k0 = i0 < i1 ? i0 * 1000000 + i1 : i1 * 1000000 + i0;
          const k1 = i1 < i2 ? i1 * 1000000 + i2 : i2 * 1000000 + i1;
          const k2 = i2 < i0 ? i2 * 1000000 + i0 : i0 * 1000000 + i2;
          edgeMap.set(k0, (edgeMap.get(k0) || 0) + 1);
          edgeMap.set(k1, (edgeMap.get(k1) || 0) + 1);
          edgeMap.set(k2, (edgeMap.get(k2) || 0) + 1);
        }

        const gumB: number[] = [];
        const toothB: number[] = [];
        const baseCutGumY = isUpper ? maxY - 1.5 : minY + 1.5;

        edgeMap.forEach((cnt, k) => {
          if (cnt === 1) {
            const v1 = Math.floor(k / 1000000);
            const v2 = k % 1000000;
            for (const v of [v1, v2]) {
              if (isGumVertex[v] === 1) {
                // Filter out mechanical flat base cuts of the dental model
                const y = pos.getY(v);
                if (isUpper ? y < baseCutGumY : y > baseCutGumY) {
                  gumB.push(v);
                }
              } else {
                toothB.push(v);
              }
            }
          }
        });

        if (gumB.length > 0 && toothB.length > 0) {
          const uniqueGumB = Array.from(new Set(gumB));
          const uniqueToothB = Array.from(new Set(toothB));

          const cs = 0.8;
          const grid = new Map<string, number[]>();
          for (const gv of uniqueGumB) {
            const gx = Math.floor(pos.getX(gv) / cs);
            const gy = Math.floor(pos.getY(gv) / cs);
            const gz = Math.floor(pos.getZ(gv) / cs);
            const gk = `${gx},${gy},${gz}`;
            let l = grid.get(gk);
            if (!l) {
              l = [];
              grid.set(gk, l);
            }
            l.push(gv);
          }

          const maxDistSq = 0.45 * 0.45;
          for (const tv of uniqueToothB) {
            const px = pos.getX(tv);
            const py = pos.getY(tv);
            const pz = pos.getZ(tv);
            const gx = Math.floor(px / cs);
            const gy = Math.floor(py / cs);
            const gz = Math.floor(pz / cs);
            let matched = false;
            for (let dx = -1; dx <= 1 && !matched; dx++) {
              for (let dy = -1; dy <= 1 && !matched; dy++) {
                for (let dz = -1; dz <= 1 && !matched; dz++) {
                  const l = grid.get(`${gx + dx},${gy + dy},${gz + dz}`);
                  if (l) {
                    for (let m = 0; m < l.length; m++) {
                      const gv = l[m]!;
                      const d2 =
                        (px - pos.getX(gv)) ** 2 +
                        (py - pos.getY(gv)) ** 2 +
                        (pz - pos.getZ(gv)) ** 2;
                      if (d2 <= maxDistSq) {
                        isCervicalBorder[tv] = 2;
                        isCervicalBorder[gv] = 2;
                        hasCervicalBorder = true;
                        matched = true;
                        break;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      // Pass 2: Dilate 1-ring neighbors to level 1 for a smooth, rounded clinical relief bead
      if (hasCervicalBorder) {
        for (let t = 0; t < numTris; t++) {
          const i0 = index ? index.getX(t * 3) : t * 3;
          const i1 = index ? index.getX(t * 3 + 1) : t * 3 + 1;
          const i2 = index ? index.getX(t * 3 + 2) : t * 3 + 2;
          const hasLevel2 =
            isCervicalBorder[i0] === 2 ||
            isCervicalBorder[i1] === 2 ||
            isCervicalBorder[i2] === 2;
          if (hasLevel2) {
            if (isCervicalBorder[i0] === 0) isCervicalBorder[i0] = 1;
            if (isCervicalBorder[i1] === 0) isCervicalBorder[i1] = 1;
            if (isCervicalBorder[i2] === 0) isCervicalBorder[i2] = 1;
          }
        }
      }
    }
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

    // Outward radial direction from arch center to suppress false facial enamel wax
    const rx = vPos.x - midX;
    const rz = vPos.z - focalZ;
    const rHypot = Math.hypot(rx, rz);
    const normRadialDot = rHypot > 0.001 ? (vNorm.x * rx + vNorm.z * rz) / rHypot : 0;
    const contourR = smoothContour[s]!;

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

    const isClinicalCrown = !isFullArch || (distFromTip >= 0.8 && distFromTip <= (isUpper ? 11.5 : 10.5));

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

        if (nearestContact && nearestDistSq < 16.0) {
          const dy = Math.abs(vPos.y - nearestContact.center.y);
          if (dy < 6.8) {
            // Compute coordinate along the tangent line between adjacent teeth
            const dx = vPos.x - nearestContact.center.x;
            const dz = vPos.z - nearestContact.center.z;
            const dTangent = Math.abs(dx * nearestContact.tangent.x + dz * nearestContact.tangent.z);
            // Normal alignment with interdental tangent: in an embrasure groove, surface faces adjacent tooth
            const dotTangent = Math.abs(vNorm.x * nearestContact.tangent.x + vNorm.z * nearestContact.tangent.z);

            // Facial enamel suppression: in an embrasure groove, normal faces adjacent tooth (dotTangent high)
            // Surfaces facing outward radially (normRadialDot > 0.22) are facial enamel, not interproximal embrasures
            const isOuterFacial = isFullArch && (normRadialDot > 0.22 || rHypot >= contourR - 0.45);

            // True embrasures have normal pointing toward adjacent tooth or down into interdental papilla
            const isEmbrasure = !isOuterFacial && dTangent < 1.8 && (dotTangent > 0.32 || (distFromTip > 4.5 && dTangent < 1.4));
            // Missing tooth edentulous span bridging
            const isEdentulousSpan =
              protocol.interproximal.bridgeSpaces &&
              nearestContact.spanDist > 7.5 &&
              dTangent < nearestContact.spanDist * 0.48;

            if (isEmbrasure || isEdentulousSpan) {
              const embrasureFactor = isEdentulousSpan
                ? 1.0
                : Math.max(0, 1.0 - dTangent / 1.8) * Math.min(1.0, (dotTangent - 0.25) / 0.45);
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
      // Anatomical crown height fallback (ONLY for unsegmented monochromatic casts with no color or mesh separation)
      let baseCrownHeight = isUpper ? 9.2 : 8.2;
      const absAngle = Math.abs(angle);
      if (absAngle > 0.22 && absAngle < 0.46) {
        baseCrownHeight -= 0.6; // lateral/canine
      } else if (absAngle >= 0.46) {
        baseCrownHeight -= 1.8; // premolars & molars have shorter crowns
      }
      const scallop = Math.max(-0.8, Math.min(0.5, 0.4 * Math.max(0, normRadialDot)));
      const cejHeight = baseCrownHeight + scallop;

      // True cervical margin zone: strictly along the CEJ boundary (never in the middle of crown enamel)
      const borderLevel = hasCervicalBorder
        ? isCervicalBorder[i]!
        : (distFromTip >= cejHeight - 0.45 && distFromTip <= cejHeight + 0.45 ? 2 : 0);

      if (borderLevel > 0 && distFromTip >= 1.5) {
        // Exclude missing tooth spans if requested (teeth 18, 28, 38, 48)
        const isEdentulous = protocol.gingival.excludeEdentulous && (fdi % 10 === 8);
        if (!isEdentulous) {
          const reliefFactor = borderLevel === 2 ? 1.0 : 0.65;
          const gingivalDisp = protocol.gingival.reliefMm * reliefFactor;
          if (gingivalDisp > displacementMagnitude) {
            displacementMagnitude = gingivalDisp;
            // Displace outward along cervical horizontal normal (with radial fallback)
            const hNormX = vNorm.x;
            const hNormZ = vNorm.z;
            const hLen = Math.hypot(hNormX, hNormZ);
            let dx = hNormX;
            let dz = hNormZ;
            if (hLen < 0.15) {
              const rx = vPos.x - midX;
              const rz = vPos.z - focalZ;
              const rLen = Math.hypot(rx, rz) || 1;
              dx = rx / rLen;
              dz = rz / rLen;
            } else {
              dx /= hLen;
              dz /= hLen;
            }
            dispVector.set(dx, 0, dz).multiplyScalar(gingivalDisp);
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

      // Facial enamel on anterior teeth or outer facial surfaces must NEVER receive digital wax
      const isAnteriorFacial = isFullArch && normRadialDot > 0.20 && (Math.abs(angle) < 0.85 || fdi === 0 || (fdi % 10 <= 3));
      const isOuterFacialCrown = isFullArch && normRadialDot > 0.38;
      // Anterior incisal & lingual crown protection: anterior teeth (#11, #12, #21, #22)
      // must keep their lingual fossa clean for torque and retraction control
      const isAnteriorTooth = Math.abs(angle) < 0.65 || (fdi !== 0 && fdi % 10 <= 2);
      const isAnteriorLingualEnamel = isFullArch && isAnteriorTooth && normRadialDot < -0.10 && distFromTip < 6.5;

      if (toothAllowed && !isAnteriorFacial && !isOuterFacialCrown && !isAnteriorLingualEnamel && depth > protocol.undercut.maxDepthMm) {
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
