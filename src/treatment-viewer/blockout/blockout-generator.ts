/**
 * Digital Wax Blockout Mesh Generator.
 *
 * Clean scaffold ready for Milestone 1: Contact Point & Gap Detection.
 * All legacy cylinder and heuristic quad-loft wax generation has been completely removed.
 */

import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Vector3,
} from "three";
import { identifyToothAtPoint } from "../tooth-data";
import type {
  BlockoutProtocol,
  ContactFittingDiagnostic,
  ModelFittingSummary,
  StageBlockoutResult,
} from "./types";
import { analyzeUndercuts } from "./undercut-analyzer";
import { detectMeshContacts, type DetectedContact } from "./mesh-contact-detector";
import {
  buildConformalMeshContext,
  createWaxWedgeGeometry,
} from "./wax-wedge-generator";

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

  // Run automated draw-axis survey analysis for undercut heatmap, metrics & Component 3
  const survey = analyzeUndercuts(
    baseGeometry,
    isUpper,
    protocol.insertionAxis,
    protocol.undercut.draftAngleDeg,
  );

  // Compute arch extents
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;

  for (let i = 0; i < count; i += 4) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
    if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
  }

  const midX = (minX + maxX) * 0.5;
  const focalZ = minZ - 12.0;
  const maxSpanAngle = 0.95;
  const spanX = maxX - minX;
  const isFullArch = spanX > 30.0;
  const modelHeight = maxY - minY;
  const archBounds = isFullArch ? { minX, maxX, minZ, maxZ } : undefined;

  // Milestone 4.1: Pure mesh-based topological contact detection
  const detected = detectMeshContacts(baseGeometry, isUpper);
  const contacts: ContactFittingDiagnostic[] = detected
    .filter((c) => !protocol.disabledContacts?.[c.contactKey])
    .map((c) => {
      const override = protocol.contactOverrides?.[c.contactKey];
      const pt: [number, number, number] = override
        ? [override[0], override[1], override[2]]
        : c.position;
      return {
        contactKey: c.contactKey,
        label: c.label,
        toothA: c.toothA,
        toothB: c.toothB,
        spanMm: c.spanMm,
        contactPoint: pt,
        normal: c.normal,
        apexY: override ? pt[1] : c.apexY,
        baseY: c.baseY,
        buccalWidthMm: c.buccalWidthMm,
        lingualWidthMm: c.lingualWidthMm,
        isSealed: true,
        clearanceMm: c.clearanceMm,
      };
    });

  // Include user-added custom contact points
  if (protocol.customContacts && protocol.customContacts.length > 0) {
    for (const cc of protocol.customContacts) {
      if (protocol.disabledContacts?.[cc.key]) continue;
      const override = protocol.contactOverrides?.[cc.key];
      const pt: [number, number, number] = override
        ? [override[0], override[1], override[2]]
        : cc.position;
      contacts.push({
        contactKey: cc.key,
        label: cc.label || `Custom Contact (${cc.key})`,
        toothA: 0,
        toothB: 0,
        spanMm: 6.5,
        contactPoint: pt,
        apexY: pt[1],
        baseY: pt[1] - (isUpper ? 4.0 : -4.0),
        buccalWidthMm: 2.0,
        lingualWidthMm: 2.0,
        isSealed: true,
        clearanceMm: 0.35,
      });
    }
  }

  // Milestone 4: Full-Arch 3D Volumetric Wax Blockout Generation
  // Component 1 (Interproximal Pink/Rose), Component 2 (Gingival Green), Component 3 (Undercut Blue)
  const allPositions: number[] = [];
  const allNormals: number[] = [];
  const allColors: number[] = [];
  let sumVolume = 0;

  if (protocol.interproximal.enabled && contacts.length > 0) {
    const focusKey = protocol.singleGapFocusKey;

    let targetContacts: ContactFittingDiagnostic[] = [];
    if (focusKey === "all" || !focusKey) {
      targetContacts = contacts;
    } else {
      const match = contacts.find((c) => c.contactKey === focusKey);
      targetContacts = match ? [match] : contacts;
    }

    const defaultWaxColor = new Color(0xD83D56); // Lab-wax crimson-rose (#D83D56)
    const highlightWaxColor = new Color(0xFACC15); // Focused gap gold (#FACC15)

    const meshContext = buildConformalMeshContext(baseGeometry, isUpper);
    const thicknessMm = protocol.interproximal.thicknessMm ?? 0.60;

    for (const c of targetContacts) {
      const isSelected =
        focusKey && focusKey !== "all"
          ? c.contactKey === focusKey
          : protocol.selectedContactKey
            ? c.contactKey === protocol.selectedContactKey
            : false;
      const curColor = isSelected ? highlightWaxColor : defaultWaxColor;
      const isUserTuned = Boolean(protocol.contactOverrides?.[c.contactKey]);

      const detectedC: DetectedContact = {
        id: `contact-${c.contactKey}`,
        index: 0,
        contactKey: c.contactKey,
        label: c.label,
        toothA: c.toothA,
        toothB: c.toothB,
        position: [c.contactPoint[0], c.contactPoint[1], c.contactPoint[2]],
        normal: c.normal ?? [1, 0, 0],
        clearanceMm: c.clearanceMm ?? 0.35,
        spanMm: c.spanMm,
        apexY: c.apexY,
        baseY: c.baseY,
        buccalWidthMm: c.buccalWidthMm,
        lingualWidthMm: c.lingualWidthMm,
      };

      const isAnt = Math.abs(c.toothA % 10) <= 3 && Math.abs(c.toothB % 10) <= 3;
      const isMolar = Math.abs(c.toothA % 10) >= 6 || Math.abs(c.toothB % 10) >= 6;
      const wedge = createWaxWedgeGeometry(detectedC, isUpper, {
        concavityMm: 0.25,
        maxSpanMm: isAnt ? 0.48 : (isMolar ? 0.85 : 0.64),
        thicknessMm,
        meshContext,
        isUserTuned,
      });

      const posAttr = wedge.getAttribute("position");
      const normAttr = wedge.getAttribute("normal");
      if (posAttr && normAttr) {
        for (let i = 0; i < posAttr.count; i++) {
          allPositions.push(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
          allNormals.push(normAttr.getX(i), normAttr.getY(i), normAttr.getZ(i));
          allColors.push(curColor.r, curColor.g, curColor.b);
        }

        const singleVol = Math.max(
          0.8,
          c.spanMm *
            0.18 *
            (Math.abs(c.baseY - c.apexY) || 2.8) *
            ((c.buccalWidthMm || 1.2) + (c.lingualWidthMm || 1.2)) *
            0.18,
        );
        sumVolume += singleVol;
      }
    }
  }

  // Compute vertex-level surface relief for Component 2 (Gingival Margin Relief) and Component 3 (Blue Undercuts)
  const needSurfaceRelief = protocol.gingival.enabled || protocol.undercut.enabled;
  const mergedGeometry = baseGeometry.clone();
  const mergedPos = mergedGeometry.getAttribute("position");

  if (needSurfaceRelief && norm) {
    // 1. Curve of Spee sector peak tracking
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
      if (isUpper ? y < peakY[s]! : y > peakY[s]!) {
        peakY[s] = y;
      }
    }
    const smoothPeak = new Float32Array(numSectors);
    for (let s = 0; s < numSectors; s++) {
      let sumY = 0, w = 0;
      for (let d = -3; d <= 3; d++) {
        const idx = s + d;
        if (idx >= 0 && idx < numSectors) {
          const v = peakY[idx]!;
          if (isUpper ? v < Infinity : v > -Infinity) {
            sumY += v;
            w++;
          }
        }
      }
      smoothPeak[s] = w > 0 ? sumY / w : (isUpper ? minY : maxY);
    }

    // 2. Cervical CEJ boundary detection (supports Uint8 & Float32 vertex colors + un-welded meshes)
    const colorAttr =
      (baseGeometry.userData?.baseColors instanceof BufferAttribute &&
      baseGeometry.userData.baseColors.count === count
        ? baseGeometry.userData.baseColors
        : null) || (baseGeometry.getAttribute("color") as BufferAttribute | undefined);
    const isGumVertex = new Uint8Array(count);
    const isCervicalBorder = new Uint8Array(count);
    let gumCount = 0;
    let toothCount = 0;
    let hasCervicalBorder = false;

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
        const isAttachment =
          (r > 0.75 && g > 0.16 && g < 0.55 && b < 0.18) ||
          (r > 0.85 && g > 0.35 && g < 0.72 && b < 0.28);
        if (!isAttachment && g < 0.30 && r > 0.30 && r - g > 0.08) {
          isGumVertex[i] = 1;
          gumCount++;
        } else {
          toothCount++;
        }
      }

      const index = baseGeometry.getIndex();
      const numTris = index ? Math.floor(index.count / 3) : Math.floor(count / 3);

      if (gumCount > 0 && toothCount > 0 && protocol.gingival.enabled) {
        // Pass 1: Direct CEJ seam triangles (welded meshes)
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

        // Spatial proximity fallback for un-welded multi-mesh GLB models (e.g. Maestro 3D)
        if (!hasCervicalBorder) {
          const cellSize = 0.6;
          const toothBuckets = new Map<string, number[]>();
          for (let i = 0; i < count; i++) {
            if (isGumVertex[i] === 0) {
              const key = `${Math.round(pos.getX(i) / cellSize)},${Math.round(pos.getY(i) / cellSize)},${Math.round(pos.getZ(i) / cellSize)}`;
              let arr = toothBuckets.get(key);
              if (!arr) { arr = []; toothBuckets.set(key, arr); }
              arr.push(i);
            }
          }
          const threshSq = 0.45 * 0.45;
          for (let i = 0; i < count; i++) {
            if (isGumVertex[i] === 1) {
              const px = pos.getX(i), py = pos.getY(i), pz = pos.getZ(i);
              const bx = Math.round(px / cellSize);
              const by = Math.round(py / cellSize);
              const bz = Math.round(pz / cellSize);
              let foundSeam = false;
              for (let ox = -1; ox <= 1 && !foundSeam; ox++) {
                for (let oy = -1; oy <= 1 && !foundSeam; oy++) {
                  for (let oz = -1; oz <= 1 && !foundSeam; oz++) {
                    const bucket = toothBuckets.get(`${bx + ox},${by + oy},${bz + oz}`);
                    if (!bucket) continue;
                    for (let bi = 0; bi < bucket.length; bi++) {
                      const ti = bucket[bi]!;
                      const d2 =
                        (px - pos.getX(ti)) ** 2 +
                        (py - pos.getY(ti)) ** 2 +
                        (pz - pos.getZ(ti)) ** 2;
                      if (d2 <= threshSq) {
                        isCervicalBorder[i] = 2;
                        isCervicalBorder[ti] = 2;
                        hasCervicalBorder = true;
                        foundSeam = true;
                        break;
                      }
                    }
                  }
                }
              }
            }
          }
        }

        // Pass 2: Smooth 1-ring dilation around CEJ seam
        if (hasCervicalBorder) {
          for (let t = 0; t < numTris; t++) {
            const i0 = index ? index.getX(t * 3) : t * 3;
            const i1 = index ? index.getX(t * 3 + 1) : t * 3 + 1;
            const i2 = index ? index.getX(t * 3 + 2) : t * 3 + 2;
            if (
              isCervicalBorder[i0] === 2 ||
              isCervicalBorder[i1] === 2 ||
              isCervicalBorder[i2] === 2
            ) {
              if (isCervicalBorder[i0] === 0) isCervicalBorder[i0] = 1;
              if (isCervicalBorder[i1] === 0) isCervicalBorder[i1] = 1;
              if (isCervicalBorder[i2] === 0) isCervicalBorder[i2] = 1;
            }
          }
        }
      }
    }

    const dispX = new Float32Array(count);
    const dispY = new Float32Array(count);
    const dispZ = new Float32Array(count);
    const reliefMag = new Float32Array(count);
    const reliefType = new Uint8Array(count); // 1 = Gingival Green (#4ade80), 2 = Undercut Blue (#38bdf8)

    const vPos = new Vector3();
    const vNorm = new Vector3();

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

      const rx = vPos.x - midX;
      const rz = vPos.z - focalZ;
      const rHypot = Math.hypot(rx, rz);
      const normRadialDot = rHypot > 0.001 ? (vNorm.x * rx + vNorm.z * rz) / rHypot : 0;

      const isBaseCut = modelHeight > 16.0 && (isUpper
        ? (vPos.y >= maxY - 1.8 && vNorm.y > 0.65)
        : (vPos.y <= minY + 1.8 && vNorm.y < -0.65));
      const isBaseZone = modelHeight > 12.0 && (isUpper ? vPos.y >= maxY - 2.2 : vPos.y <= minY + 2.2);
      const isOcclusalTable = isFullArch && (
        distFromTip <= 1.2 ||
        (distFromTip <= 3.2 && (isUpper ? vNorm.y < -0.20 : vNorm.y > 0.20))
      );
      const isClinicalCrown = !isFullArch || (distFromTip >= 0.8 && distFromTip <= (isUpper ? 10.5 : 9.8));

      const toothInfo = identifyToothAtPoint({ x: vPos.x, y: vPos.y, z: vPos.z }, isUpper, archBounds);
      const fdi = toothInfo.fdi;

      let curMag = 0;
      let dxOut = 0;
      let dyOut = 0;
      let dzOut = 0;
      let curType = 0;

      // Component 2: Gingival Margin Relief (#4ade80 green collar along CEJ)
      if (protocol.gingival.enabled && !isBaseCut && !isBaseZone && !isOcclusalTable) {
        let baseCrownHeight = isUpper ? 5.4 : 4.8;
        const absAngle = Math.abs(angle);
        if (absAngle > 0.22 && absAngle < 0.46) baseCrownHeight += 0.55;
        else if (absAngle >= 0.46) baseCrownHeight -= 0.55;
        const scallop = Math.max(-0.8, Math.min(0.5, 0.4 * Math.max(0, normRadialDot)));
        const cejHeight = baseCrownHeight + scallop;

        const borderLevel = hasCervicalBorder
          ? isCervicalBorder[i]!
          : (distFromTip >= cejHeight - 0.45 && distFromTip <= cejHeight + 0.45 ? 2 : 0);

        if (borderLevel > 0 && distFromTip >= 2.2) {
          const isEdentulous = protocol.gingival.excludeEdentulous && (fdi % 10 === 8);
          if (!isEdentulous) {
            const reliefFactor = borderLevel === 2 ? 1.0 : 0.62;
            const gDisp = protocol.gingival.reliefMm * reliefFactor;
            if (gDisp > curMag) {
              curMag = gDisp;
              curType = 1;
              const hLen = Math.hypot(vNorm.x, vNorm.z);
              if (hLen < 0.15) {
                const invR = rHypot > 1e-4 ? 1.0 / rHypot : 1.0;
                dxOut = rx * invR * gDisp;
                dzOut = rz * invR * gDisp;
              } else {
                dxOut = (vNorm.x / hLen) * gDisp;
                dzOut = (vNorm.z / hLen) * gDisp;
              }
            }
          }
        }
      }

      // Component 3: Dentition Undercuts (#38bdf8 blue blockout wax over crown undercuts)
      if (protocol.undercut.enabled && !isBaseCut && !isBaseZone && !isOcclusalTable && isClinicalCrown) {
        const toothAllowed = protocol.undercut.perTooth[fdi] !== false;
        const depth = survey.depths[i] ?? 0;
        const isGum = gumCount > 0 && toothCount > 0 && isGumVertex[i] === 1 && (!isFullArch || distFromTip > 4.5);
        const isAnteriorFacial = isFullArch && normRadialDot > 0.25 && (Math.abs(angle) < 0.85 || fdi === 0 || (fdi % 10 <= 3));
        const isOuterFacialCrown = isFullArch && normRadialDot > 0.38;
        const isAnteriorTooth = Math.abs(angle) < 0.65 || (fdi !== 0 && fdi % 10 <= 2);
        const isAnteriorLingualEnamel = isFullArch && isAnteriorTooth && normRadialDot < -0.10 && distFromTip < 6.5;

        if (
          toothAllowed &&
          !isGum &&
          !isAnteriorFacial &&
          !isOuterFacialCrown &&
          !isAnteriorLingualEnamel &&
          depth > protocol.undercut.maxDepthMm
        ) {
          const excess = depth - protocol.undercut.maxDepthMm;
          const uDisp = Math.min(1.6, excess * 0.90);
          if (uDisp > curMag) {
            curMag = uDisp;
            curType = 2;
            const hLen = Math.hypot(vNorm.x, vNorm.z);
            if (hLen > 0.20) {
              dxOut = (vNorm.x / hLen) * uDisp;
              dzOut = (vNorm.z / hLen) * uDisp;
            } else {
              const invR = rHypot > 1e-4 ? 1.0 / rHypot : 1.0;
              dxOut = rx * invR * uDisp;
              dzOut = rz * invR * uDisp;
            }
            dyOut = 0;
          }
        }
      }

      if (curMag > 0.025) {
        reliefMag[i] = curMag;
        dispX[i] = dxOut;
        dispY[i] = dyOut;
        dispZ[i] = dzOut;
        reliefType[i] = curType;

        if (mergedPos) {
          mergedPos.setXYZ(
            i,
            mergedPos.getX(i) + dxOut,
            mergedPos.getY(i) + dyOut,
            mergedPos.getZ(i) + dzOut,
          );
        }
      }
    }

    // Emit smooth Titan-CAD colored overlay patches (Green #4ade80 = Gingival Relief, Blue #38bdf8 = Undercuts)
    const gingColor = new Color(0x4ade80);
    const ucColor = new Color(0x38bdf8);
    const index = baseGeometry.getIndex();
    const numTris = index ? Math.floor(index.count / 3) : Math.floor(count / 3);
    let reliefTris = 0;

    for (let t = 0; t < numTris; t++) {
      const i0 = index ? index.getX(t * 3) : t * 3;
      const i1 = index ? index.getX(t * 3 + 1) : t * 3 + 1;
      const i2 = index ? index.getX(t * 3 + 2) : t * 3 + 2;

      const m0 = reliefMag[i0]!;
      const m1 = reliefMag[i1]!;
      const m2 = reliefMag[i2]!;
      if (m0 <= 0.025 && m1 <= 0.025 && m2 <= 0.025) continue;

      // Require >= 2 vertices active OR single active vertex > 0.12mm to suppress stray single-vertex spikes
      const activeCount = (m0 > 0.025 ? 1 : 0) + (m1 > 0.025 ? 1 : 0) + (m2 > 0.025 ? 1 : 0);
      if (activeCount === 1 && Math.max(m0, m1, m2) < 0.12) continue;

      const tDom = (reliefType[i0] === 2 || reliefType[i1] === 2 || reliefType[i2] === 2) ? 2 : 1;
      const triColor = tDom === 2 ? ucColor : gingColor;

      for (const vi of [i0, i1, i2]) {
        const nx = norm.getX(vi);
        const ny = norm.getY(vi);
        const nz = norm.getZ(vi);
        const m = reliefMag[vi]!;
        if (m > 0.025) {
          allPositions.push(
            pos.getX(vi) + dispX[vi]! + nx * 0.02,
            pos.getY(vi) + dispY[vi]! + ny * 0.02,
            pos.getZ(vi) + dispZ[vi]! + nz * 0.02,
          );
        } else {
          // Feather skirt pinches smoothly inside the tooth/gum surface to avoid ragged edges or Z-fighting
          allPositions.push(
            pos.getX(vi) - nx * 0.03,
            pos.getY(vi) - ny * 0.03,
            pos.getZ(vi) - nz * 0.03,
          );
        }
        allNormals.push(nx, ny, nz);
        allColors.push(triColor.r, triColor.g, triColor.b);
      }
      reliefTris++;
    }
    if (reliefTris > 0) {
      sumVolume += reliefTris * 0.015;
    }
    if (mergedPos) mergedPos.needsUpdate = true;
    mergedGeometry.computeVertexNormals();
  }

  let waxGeometry: BufferGeometry | null = null;
  let waxBounds: { min: [number, number, number]; max: [number, number, number] } | null = null;
  let totalWaxVolumeMm3 = 0;

  if (allPositions.length > 0) {
    waxGeometry = new BufferGeometry();
    waxGeometry.setAttribute("position", new BufferAttribute(new Float32Array(allPositions), 3));
    waxGeometry.setAttribute("normal", new BufferAttribute(new Float32Array(allNormals), 3));
    waxGeometry.setAttribute("color", new BufferAttribute(new Float32Array(allColors), 3));

    let wMinX = Infinity, wMaxX = -Infinity;
    let wMinY = Infinity, wMaxY = -Infinity;
    let wMinZ = Infinity, wMaxZ = -Infinity;
    for (let i = 0; i < allPositions.length; i += 3) {
      const x = allPositions[i]!, y = allPositions[i + 1]!, z = allPositions[i + 2]!;
      if (x < wMinX) wMinX = x; if (x > wMaxX) wMaxX = x;
      if (y < wMinY) wMinY = y; if (y > wMaxY) wMaxY = y;
      if (z < wMinZ) wMinZ = z; if (z > wMaxZ) wMaxZ = z;
    }

    waxBounds = {
      min: [parseFloat(wMinX.toFixed(2)), parseFloat(wMinY.toFixed(2)), parseFloat(wMinZ.toFixed(2))],
      max: [parseFloat(wMaxX.toFixed(2)), parseFloat(wMaxY.toFixed(2)), parseFloat(wMaxZ.toFixed(2))],
    };

    totalWaxVolumeMm3 = parseFloat(sumVolume.toFixed(1));
  }

  const fittingSummary: ModelFittingSummary = {
    modelBounds: {
      min: [parseFloat(minX.toFixed(2)), parseFloat(minY.toFixed(2)), parseFloat(minZ.toFixed(2))],
      max: [parseFloat(maxX.toFixed(2)), parseFloat(maxY.toFixed(2)), parseFloat(maxZ.toFixed(2))],
    },
    waxBounds,
    totalContacts: contacts.length,
    sealedContacts: contacts.length,
    totalWaxVolumeMm3,
    contacts,
  };

  if (sculptDeltas && sculptDeltas.size > 0 && mergedPos) {
    for (const [vIdx, delta] of sculptDeltas.entries()) {
      if (vIdx < mergedPos.count) {
        // Positive wax displacement along normals/offsets; clamp carve so it doesn't dig into tooth
        const dx = Math.max(0, delta[0]);
        const dy = Math.max(0, delta[1]);
        const dz = Math.max(0, delta[2]);
        mergedPos.setXYZ(
          vIdx,
          mergedPos.getX(vIdx) + dx,
          mergedPos.getY(vIdx) + dy,
          mergedPos.getZ(vIdx) + dz,
        );
      }
    }
    mergedPos.needsUpdate = true;
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
    fittingSummary,
  };
}
