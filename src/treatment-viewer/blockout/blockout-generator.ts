/**
 * Digital Wax Blockout Mesh Generator.
 *
 * Component 1: Conformal Interproximal Crimson-Rose Wax
 * Component 2: Gingival Margin Relief (Green #4ade80 CEJ Collar)
 * Component 3: Dentition Undercuts (Blue #52b6f9 Smoothed Survey Blockout)
 *
 * Uses geometry-level caching for contacts, interproximal wedge buffers, CEJ boundaries,
 * and spatial weld tables so UI toggles run interactively on low-RAM laptops.
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
import { analyzeUndercuts, isGumVertexColor } from "./undercut-analyzer";
import { detectMeshContacts, type DetectedContact } from "./mesh-contact-detector";
import {
  buildConformalMeshContext,
  createWaxWedgeGeometry,
} from "./wax-wedge-generator";

export interface GenerateBlockoutOptions {
  /** Skip cloning & recomputing normals on the 500k+ mergedGeometry during live UI toggles. */
  readonly skipMergedGeometry?: boolean;
}

interface GeomPrecomputeCache {
  count: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
  midX: number;
  focalZ: number;
  maxSpanAngle: number;
  isFullArch: boolean;
  modelHeight: number;
  archBounds: { minX: number; maxX: number; minZ: number; maxZ: number } | undefined;
  smoothPeak: Float32Array;
  isGumVertex: Uint8Array;
  gumCount: number;
  toothCount: number;
  detectedKey: string;
  detected: DetectedContact[];
  isCervicalBorder?: Uint8Array;
  hasCervicalBorder?: boolean;
  weldId?: Int32Array;
  weldCount?: number;
  weldLockedGeom?: Uint8Array;
  wedgeCache?: {
    key: string;
    positions: Float32Array;
    normals: Float32Array;
    colors: Float32Array;
    sumVolume: number;
  };
}

function getOrCreatePrecomputeCache(
  baseGeometry: BufferGeometry,
  isUpper: boolean,
): GeomPrecomputeCache {
  const pos = baseGeometry.getAttribute("position");
  const count = pos.count;
  const cacheKey = `${isUpper ? "U" : "L"}:${count}`;
  const existing = baseGeometry.userData.__boPrecompute as GeomPrecomputeCache | undefined;
  if (existing && existing.detectedKey === cacheKey) {
    return existing;
  }

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

  // Curve of Spee sector peak tracking
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

  // Unified gum vs tooth segmentation (supports Uint8 & Float32 + lighter coral mucosal pinks)
  const colorAttr =
    (baseGeometry.userData?.baseColors instanceof BufferAttribute &&
    baseGeometry.userData.baseColors.count === count
      ? baseGeometry.userData.baseColors
      : null) || (baseGeometry.getAttribute("color") as BufferAttribute | undefined);
  const isGumVertex = new Uint8Array(count);
  let gumCount = 0;
  let toothCount = 0;
  if (colorAttr && colorAttr.count === count) {
    for (let i = 0; i < count; i++) {
      if (isGumVertexColor(colorAttr.getX(i), colorAttr.getY(i), colorAttr.getZ(i))) {
        isGumVertex[i] = 1;
        gumCount++;
      } else {
        toothCount++;
      }
    }
  }

  const detected = detectMeshContacts(baseGeometry, isUpper);

  const cache: GeomPrecomputeCache = {
    count,
    minX,
    maxX,
    minY,
    maxY,
    minZ,
    maxZ,
    midX,
    focalZ,
    maxSpanAngle,
    isFullArch,
    modelHeight,
    archBounds,
    smoothPeak,
    isGumVertex,
    gumCount,
    toothCount,
    detectedKey: cacheKey,
    detected,
  };
  baseGeometry.userData.__boPrecompute = cache;
  return cache;
}

function ensureCejBorderCache(
  baseGeometry: BufferGeometry,
  cache: GeomPrecomputeCache,
): { isCervicalBorder: Uint8Array; hasCervicalBorder: boolean } {
  if (cache.isCervicalBorder && cache.hasCervicalBorder !== undefined) {
    return {
      isCervicalBorder: cache.isCervicalBorder,
      hasCervicalBorder: cache.hasCervicalBorder,
    };
  }

  const pos = baseGeometry.getAttribute("position");
  const count = pos.count;
  const { isGumVertex, gumCount, toothCount } = cache;
  const isCervicalBorder = new Uint8Array(count);
  let hasCervicalBorder = false;

  if (gumCount > 0 && toothCount > 0) {
    const index = baseGeometry.getIndex();
    const numTris = index ? Math.floor(index.count / 3) : Math.floor(count / 3);

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

    // Spatial proximity fallback for un-welded multi-mesh GLB models (numeric keys + voxel dedup)
    if (!hasCervicalBorder) {
      const cellSize = 0.6;
      const hashCell = (bx: number, by: number, bz: number) =>
        ((bx + 512) * 1024 + (by + 512)) * 1024 + (bz + 512);
      const toothBuckets = new Map<number, number[]>();
      const seenToothVoxels = new Set<number>();
      for (let i = 0; i < count; i++) {
        if (isGumVertex[i] === 0) {
          const px = pos.getX(i), py = pos.getY(i), pz = pos.getZ(i);
          const vKey = hashCell(
            Math.round(px * 5),
            Math.round(py * 5),
            Math.round(pz * 5),
          );
          if (seenToothVoxels.has(vKey)) continue;
          seenToothVoxels.add(vKey);
          const key = hashCell(
            Math.round(px / cellSize),
            Math.round(py / cellSize),
            Math.round(pz / cellSize),
          );
          let arr = toothBuckets.get(key);
          if (!arr) {
            arr = [];
            toothBuckets.set(key, arr);
          }
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
                const bucket = toothBuckets.get(hashCell(bx + ox, by + oy, bz + oz));
                if (!bucket) continue;
                for (let bi = 0; bi < bucket.length; bi++) {
                  const ti = bucket[bi]!;
                  const dx = px - pos.getX(ti);
                  const dy = py - pos.getY(ti);
                  const dz = pz - pos.getZ(ti);
                  if (dx * dx + dy * dy + dz * dz <= threshSq) {
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

  cache.isCervicalBorder = isCervicalBorder;
  cache.hasCervicalBorder = hasCervicalBorder;
  return { isCervicalBorder, hasCervicalBorder };
}

function ensureWeldCache(
  baseGeometry: BufferGeometry,
  isUpper: boolean,
  cache: GeomPrecomputeCache,
): { weldId: Int32Array; weldCount: number; weldLockedGeom: Uint8Array } {
  if (cache.weldId && cache.weldCount !== undefined && cache.weldLockedGeom) {
    return {
      weldId: cache.weldId,
      weldCount: cache.weldCount,
      weldLockedGeom: cache.weldLockedGeom,
    };
  }

  const pos = baseGeometry.getAttribute("position");
  const count = pos.count;
  const hasSegmentation = cache.gumCount > 0 && cache.toothCount > 0;
  const weldId = new Int32Array(count);
  const weldMap = new Map<number, number>();
  let weldCount = 0;

  for (let i = 0; i < count; i++) {
    const kx = Math.round(pos.getX(i) * 100) + 32768;
    const ky = Math.round(pos.getY(i) * 100) + 32768;
    const kz = Math.round(pos.getZ(i) * 100) + 32768;
    const key = (kx * 65536 + ky) * 65536 + kz;
    let wid = weldMap.get(key);
    if (wid === undefined) {
      wid = weldCount++;
      weldMap.set(key, wid);
    }
    weldId[i] = wid;
  }

  const weldLockedGeom = new Uint8Array(weldCount);
  const { isGumVertex, modelHeight, minY, maxY } = cache;
  for (let i = 0; i < count; i++) {
    const wid = weldId[i]!;
    const y = pos.getY(i);
    const isBaseZoneFast =
      modelHeight > 12.0 && (isUpper ? y >= maxY - 2.2 : y <= minY + 2.2);
    const isGum = hasSegmentation && isGumVertex[i] === 1;
    if (isBaseZoneFast || isGum) {
      weldLockedGeom[wid] = 1;
    }
  }

  cache.weldId = weldId;
  cache.weldCount = weldCount;
  cache.weldLockedGeom = weldLockedGeom;
  return { weldId, weldCount, weldLockedGeom };
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
  options?: GenerateBlockoutOptions,
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

  if (!baseGeometry.getAttribute("normal")) {
    baseGeometry.computeVertexNormals();
  }
  const norm = baseGeometry.getAttribute("normal");
  const count = pos.count;

  // Run automated draw-axis survey (geometry-cached for instant UI threshold/toggle updates)
  const survey = analyzeUndercuts(
    baseGeometry,
    isUpper,
    protocol.insertionAxis,
    protocol.undercut.draftAngleDeg,
    protocol.undercut.maxDepthMm,
  );

  // Shared geometry-level precompute (contacts, bounds, Curve of Spee, gum/tooth segmentation)
  const pre = getOrCreatePrecomputeCache(baseGeometry, isUpper);
  const {
    minX, maxX, minY, maxY, minZ, maxZ,
    midX, focalZ, maxSpanAngle, isFullArch, modelHeight, archBounds,
    smoothPeak, detected,
  } = pre;

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

  // Component 1: Conformal Interproximal Crimson-Rose Wax (cached across UI toggles!)
  let wedgePos: Float32Array = new Float32Array(0);
  let wedgeNorm: Float32Array = new Float32Array(0);
  let wedgeCol: Float32Array = new Float32Array(0);
  let sumVolume = 0;

  if (protocol.interproximal.enabled && contacts.length > 0) {
    const focusKey = protocol.singleGapFocusKey ?? "all";
    const thicknessMm = protocol.interproximal.thicknessMm ?? 0.60;
    const overridesKey = JSON.stringify({
      focusKey,
      selected: protocol.selectedContactKey ?? null,
      thicknessMm,
      disabled: protocol.disabledContacts ?? null,
      overrides: protocol.contactOverrides ?? null,
      custom: protocol.customContacts ?? null,
    });

    if (pre.wedgeCache && pre.wedgeCache.key === overridesKey) {
      wedgePos = pre.wedgeCache.positions;
      wedgeNorm = pre.wedgeCache.normals;
      wedgeCol = pre.wedgeCache.colors;
      sumVolume = pre.wedgeCache.sumVolume;
    } else {
      let targetContacts: ContactFittingDiagnostic[] = [];
      if (focusKey === "all" || !focusKey) {
        targetContacts = contacts;
      } else {
        const match = contacts.find((c) => c.contactKey === focusKey);
        targetContacts = match ? [match] : contacts;
      }

      const defaultWaxColor = new Color(0xD83D56);
      const highlightWaxColor = new Color(0xFACC15);
      const meshContext = buildConformalMeshContext(baseGeometry, isUpper);

      const posChunks: Float32Array[] = [];
      const normChunks: Float32Array[] = [];
      const colChunks: Float32Array[] = [];
      let totalFloats = 0;

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
          const pArr = posAttr.array as Float32Array;
          const nArr = normAttr.array as Float32Array;
          const cArr = new Float32Array(posAttr.count * 3);
          for (let ci = 0; ci < posAttr.count; ci++) {
            cArr[ci * 3] = curColor.r;
            cArr[ci * 3 + 1] = curColor.g;
            cArr[ci * 3 + 2] = curColor.b;
          }
          posChunks.push(pArr);
          normChunks.push(nArr);
          colChunks.push(cArr);
          totalFloats += pArr.length;

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

      wedgePos = new Float32Array(totalFloats);
      wedgeNorm = new Float32Array(totalFloats);
      wedgeCol = new Float32Array(totalFloats);
      let wOff = 0;
      for (let k = 0; k < posChunks.length; k++) {
        const pc = posChunks[k]!;
        wedgePos.set(pc, wOff);
        wedgeNorm.set(normChunks[k]!, wOff);
        wedgeCol.set(colChunks[k]!, wOff);
        wOff += pc.length;
      }

      pre.wedgeCache = {
        key: overridesKey,
        positions: wedgePos,
        normals: wedgeNorm,
        colors: wedgeCol,
        sumVolume,
      };
    }
  }

  // Only clone 500k+ mergedGeometry when needed (Print Prep / export / full API callers)
  const mergedGeometry = options?.skipMergedGeometry ? null : baseGeometry.clone();
  const mergedPos = mergedGeometry ? mergedGeometry.getAttribute("position") : null;

  // Component 2 (Gingival Green #4ade80), Component 3 (Blue Undercut #52b6f9) & Manual Wax Sculpt (#f59e0b)
  const needSurfaceRelief = protocol.gingival.enabled || protocol.undercut.enabled;
  const hasSculpt = Boolean(sculptDeltas && sculptDeltas.size > 0);
  let reliefPos: Float32Array = new Float32Array(0);
  let reliefNorm: Float32Array = new Float32Array(0);
  let reliefCol: Float32Array = new Float32Array(0);

  if ((needSurfaceRelief || hasSculpt) && norm) {
    const cejInfo = protocol.gingival.enabled
      ? ensureCejBorderCache(baseGeometry, pre)
      : null;

    const dispX = new Float32Array(count);
    const dispY = new Float32Array(count);
    const dispZ = new Float32Array(count);
    const reliefMag = new Float32Array(count);
    const reliefType = new Uint8Array(count); // 1 = Gingival Green, 2 = Undercut Blue, 3 = Manual Sculpt Amber

    // Component 3: Spatial-welded + 4-pass Laplacian smoothing using cached weld topology
    let smoothedUcDisp: Float32Array | null = null;
    if (protocol.undercut.enabled) {
      const { weldId, weldCount, weldLockedGeom } = ensureWeldCache(baseGeometry, isUpper, pre);
      const weldSum = new Float32Array(weldCount);
      const weldHit = new Uint16Array(weldCount);

      for (let i = 0; i < count; i++) {
        const wid = weldId[i]!;
        if (weldLockedGeom[wid] === 1) continue;
        const depth = survey.depths[i] ?? 0;
        if (depth > protocol.undercut.maxDepthMm) {
          const fdi = identifyToothAtPoint(
            { x: pos.getX(i), y: pos.getY(i), z: pos.getZ(i) },
            isUpper,
            archBounds,
          ).fdi;
          if (protocol.undercut.perTooth[fdi] !== false) {
            let uRaw = Math.min(0.75, (depth - protocol.undercut.maxDepthMm) * 0.72);
            if (protocol.interproximal.enabled && contacts.length > 0) {
              const vx = pos.getX(i), vz = pos.getZ(i);
              for (let cIdx = 0; cIdx < contacts.length; cIdx++) {
                const cp = contacts[cIdx]!.contactPoint;
                const d2 = (vx - cp[0]) * (vx - cp[0]) + (vz - cp[2]) * (vz - cp[2]);
                if (d2 < 0.65 * 0.65) {
                  uRaw = Math.min(uRaw, 0.14);
                  break;
                }
              }
            }
            weldSum[wid] = (weldSum[wid] ?? 0) + uRaw;
          }
        }
        weldHit[wid] = (weldHit[wid] ?? 0) + 1;
      }

      const weldVal = new Float32Array(weldCount);
      for (let w = 0; w < weldCount; w++) {
        if (weldLockedGeom[w] === 0 && weldHit[w]! > 0) {
          weldVal[w] = weldSum[w]! / weldHit[w]!;
        }
      }

      const index = baseGeometry.getIndex();
      const numTris = index ? Math.floor(index.count / 3) : Math.floor(count / 3);
      const nextVal = new Float32Array(weldCount);
      const accSum = new Float32Array(weldCount);
      const accW = new Uint16Array(weldCount);

      for (let pass = 0; pass < 4; pass++) {
        accSum.fill(0);
        accW.fill(0);
        for (let t = 0; t < numTris; t++) {
          const i0 = index ? index.getX(t * 3) : t * 3;
          const i1 = index ? index.getX(t * 3 + 1) : t * 3 + 1;
          const i2 = index ? index.getX(t * 3 + 2) : t * 3 + 2;
          const w0 = weldId[i0]!, w1 = weldId[i1]!, w2 = weldId[i2]!;
          const v0 = weldVal[w0]!, v1 = weldVal[w1]!, v2 = weldVal[w2]!;
          accSum[w0] = (accSum[w0] ?? 0) + v1 + v2; accW[w0] = (accW[w0] ?? 0) + 2;
          accSum[w1] = (accSum[w1] ?? 0) + v0 + v2; accW[w1] = (accW[w1] ?? 0) + 2;
          accSum[w2] = (accSum[w2] ?? 0) + v0 + v1; accW[w2] = (accW[w2] ?? 0) + 2;
        }
        for (let w = 0; w < weldCount; w++) {
          if (weldLockedGeom[w] === 1 || accW[w]! === 0) {
            nextVal[w] = 0;
          } else {
            nextVal[w] = 0.45 * weldVal[w]! + 0.55 * (accSum[w]! / accW[w]!);
          }
        }
        weldVal.set(nextVal);
      }

      smoothedUcDisp = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        const wid = weldId[i]!;
        const v = weldLockedGeom[wid] === 1 ? 0 : weldVal[wid]!;
        smoothedUcDisp[i] = v >= 0.032 ? v : 0;
      }
    }

    const vPos = new Vector3();
    const vNorm = new Vector3();

    for (let i = 0; i < count; i++) {
      const ucDisp = smoothedUcDisp ? smoothedUcDisp[i]! : 0;
      const gingBorder = cejInfo
        ? (cejInfo.hasCervicalBorder ? cejInfo.isCervicalBorder[i]! : 1)
        : 0;
      const sculptDelta = sculptDeltas ? (sculptDeltas.get(i)?.[0] ?? 0) : 0;

      // Fast skip: neither auto-component nor manual sculpt can fire on this vertex
      if (ucDisp <= 0.025 && gingBorder === 0 && sculptDelta <= 0.025) continue;

      vPos.set(pos.getX(i), pos.getY(i), pos.getZ(i));
      vNorm.set(norm.getX(i), norm.getY(i), norm.getZ(i));

      const isBaseCut = modelHeight > 16.0 && (isUpper
        ? (vPos.y >= maxY - 1.8 && vNorm.y > 0.65)
        : (vPos.y <= minY + 1.8 && vNorm.y < -0.65));
      const isBaseZone = modelHeight > 12.0 && (isUpper ? vPos.y >= maxY - 2.2 : vPos.y <= minY + 2.2);
      if (isBaseCut || isBaseZone) continue;

      const rx = vPos.x - midX;
      const rz = vPos.z - focalZ;
      const rHypot = Math.hypot(rx, rz);

      let curMag = 0;
      let dxOut = 0;
      let dyOut = 0;
      let dzOut = 0;
      let curType = 0;

      // Component 2: Gingival Margin Relief (#4ade80 green collar along CEJ)
      if (protocol.gingival.enabled && gingBorder > 0) {
        const angle = Math.atan2(rx, rz);
        const s = Math.max(
          0,
          Math.min(119, Math.floor(((angle + maxSpanAngle) / (2 * maxSpanAngle)) * 120)),
        );
        const tip = smoothPeak[s]!;
        const distFromTip = isUpper ? vPos.y - tip : tip - vPos.y;
        const isOcclusalTable = isFullArch && (
          distFromTip <= 1.2 ||
          (distFromTip <= 3.2 && (isUpper ? vNorm.y < -0.20 : vNorm.y > 0.20))
        );

        if (!isOcclusalTable && distFromTip >= 2.2) {
          let borderLevel = cejInfo!.hasCervicalBorder ? gingBorder : 0;
          if (!cejInfo!.hasCervicalBorder) {
            const normRadialDot = rHypot > 0.001 ? (vNorm.x * rx + vNorm.z * rz) / rHypot : 0;
            let baseCrownHeight = isUpper ? 5.4 : 4.8;
            const absAngle = Math.abs(angle);
            if (absAngle > 0.22 && absAngle < 0.46) baseCrownHeight += 0.55;
            else if (absAngle >= 0.46) baseCrownHeight -= 0.55;
            const scallop = Math.max(-0.8, Math.min(0.5, 0.4 * Math.max(0, normRadialDot)));
            const cejHeight = baseCrownHeight + scallop;
            if (distFromTip >= cejHeight - 0.45 && distFromTip <= cejHeight + 0.45) {
              borderLevel = 2;
            }
          }

          if (borderLevel > 0) {
            const fdi = identifyToothAtPoint({ x: vPos.x, y: vPos.y, z: vPos.z }, isUpper, archBounds).fdi;
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
      }

      // Component 3: Dentition Undercuts (#52b6f9 blue blockout wax)
      if (ucDisp > curMag) {
        curMag = ucDisp;
        curType = 2;
        const hLen = Math.hypot(vNorm.x, vNorm.z);
        if (hLen > 0.15) {
          dxOut = (vNorm.x / hLen) * ucDisp;
          dzOut = (vNorm.z / hLen) * ucDisp;
        } else {
          const invR = rHypot > 1e-4 ? 1.0 / rHypot : 1.0;
          dxOut = rx * invR * ucDisp;
          dzOut = rz * invR * ucDisp;
        }
        dyOut = 0;
      }

      // Component 4: Manual Sculpt Deltas (normal-directed Add / Carve / Smooth, clamped at >= 0 mm net wax)
      if (sculptDelta < -0.002 && curMag > 0) {
        const nextMag = Math.max(0, curMag + sculptDelta);
        if (nextMag <= 0.025) {
          curMag = 0;
          curType = 0;
          dxOut = 0;
          dyOut = 0;
          dzOut = 0;
        } else {
          const ratio = nextMag / curMag;
          curMag = nextMag;
          dxOut *= ratio;
          dyOut *= ratio;
          dzOut *= ratio;
        }
      } else if (sculptDelta > 0.025) {
        const added = Math.min(2.5, sculptDelta);
        dxOut += vNorm.x * added;
        dyOut += vNorm.y * added;
        dzOut += vNorm.z * added;
        curMag = Math.min(2.5, Math.hypot(dxOut, dyOut, dzOut));
        curType = 3;
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

    const gingColor = new Color(0x4ade80);
    const ucColor = new Color(0x52b6f9);
    const sculptColor = new Color(0xf59e0b);
    const index = baseGeometry.getIndex();
    const numTris = index ? Math.floor(index.count / 3) : Math.floor(count / 3);

    // Pre-collect matching triangle indices so typed output buffers allocate exact length
    const rTris: number[] = [];
    for (let t = 0; t < numTris; t++) {
      const i0 = index ? index.getX(t * 3) : t * 3;
      const i1 = index ? index.getX(t * 3 + 1) : t * 3 + 1;
      const i2 = index ? index.getX(t * 3 + 2) : t * 3 + 2;

      const m0 = reliefMag[i0]!;
      const m1 = reliefMag[i1]!;
      const m2 = reliefMag[i2]!;
      if (m0 <= 0.025 && m1 <= 0.025 && m2 <= 0.025) continue;

      const activeCount = (m0 > 0.025 ? 1 : 0) + (m1 > 0.025 ? 1 : 0) + (m2 > 0.025 ? 1 : 0);
      if (activeCount === 1 && Math.max(m0, m1, m2) < 0.12) continue;

      rTris.push(t);
    }

    if (rTris.length > 0) {
      reliefPos = new Float32Array(rTris.length * 9);
      reliefNorm = new Float32Array(rTris.length * 9);
      reliefCol = new Float32Array(rTris.length * 9);
      let ptr = 0;

      for (let rt = 0; rt < rTris.length; rt++) {
        const t = rTris[rt]!;
        const i0 = index ? index.getX(t * 3) : t * 3;
        const i1 = index ? index.getX(t * 3 + 1) : t * 3 + 1;
        const i2 = index ? index.getX(t * 3 + 2) : t * 3 + 2;
        const tDom =
          reliefType[i0] === 3 || reliefType[i1] === 3 || reliefType[i2] === 3
            ? 3
            : reliefType[i0] === 2 || reliefType[i1] === 2 || reliefType[i2] === 2
              ? 2
              : 1;
        const triColor =
          tDom === 3 ? sculptColor : tDom === 2 ? ucColor : gingColor;

        const verts = [i0, i1, i2];
        for (let k = 0; k < 3; k++) {
          const vi = verts[k]!;
          const nx = norm.getX(vi);
          const ny = norm.getY(vi);
          const nz = norm.getZ(vi);
          const m = reliefMag[vi]!;
          if (m > 0.025) {
            reliefPos[ptr] = pos.getX(vi) + dispX[vi]! + nx * 0.02;
            reliefPos[ptr + 1] = pos.getY(vi) + dispY[vi]! + ny * 0.02;
            reliefPos[ptr + 2] = pos.getZ(vi) + dispZ[vi]! + nz * 0.02;
          } else {
            reliefPos[ptr] = pos.getX(vi) - nx * 0.03;
            reliefPos[ptr + 1] = pos.getY(vi) - ny * 0.03;
            reliefPos[ptr + 2] = pos.getZ(vi) - nz * 0.03;
          }
          reliefNorm[ptr] = nx;
          reliefNorm[ptr + 1] = ny;
          reliefNorm[ptr + 2] = nz;
          reliefCol[ptr] = triColor.r;
          reliefCol[ptr + 1] = triColor.g;
          reliefCol[ptr + 2] = triColor.b;
          ptr += 3;
        }
      }
      sumVolume += rTris.length * 0.015;
    }

    if (mergedGeometry && mergedPos) {
      mergedPos.needsUpdate = true;
      mergedGeometry.computeVertexNormals();
    }
  }

  let waxGeometry: BufferGeometry | null = null;
  let waxBounds: { min: [number, number, number]; max: [number, number, number] } | null = null;
  let totalWaxVolumeMm3 = 0;

  const combinedLen = wedgePos.length + reliefPos.length;
  if (combinedLen > 0) {
    const outPos = new Float32Array(combinedLen);
    const outNorm = new Float32Array(combinedLen);
    const outCol = new Float32Array(combinedLen);
    if (wedgePos.length > 0) {
      outPos.set(wedgePos, 0);
      outNorm.set(wedgeNorm, 0);
      outCol.set(wedgeCol, 0);
    }
    if (reliefPos.length > 0) {
      outPos.set(reliefPos, wedgePos.length);
      outNorm.set(reliefNorm, wedgePos.length);
      outCol.set(reliefCol, wedgePos.length);
    }

    waxGeometry = new BufferGeometry();
    waxGeometry.setAttribute("position", new BufferAttribute(outPos, 3));
    waxGeometry.setAttribute("normal", new BufferAttribute(outNorm, 3));
    waxGeometry.setAttribute("color", new BufferAttribute(outCol, 3));

    let wMinX = Infinity, wMaxX = -Infinity;
    let wMinY = Infinity, wMaxY = -Infinity;
    let wMinZ = Infinity, wMaxZ = -Infinity;
    for (let i = 0; i < outPos.length; i += 3) {
      const x = outPos[i]!, y = outPos[i + 1]!, z = outPos[i + 2]!;
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

  // Provide Component 1 interproximal wedges separately for print-prep STL merging while keeping mergedGeometry 1:1 with base vertices
  let interproximalGeometry: BufferGeometry | null = null;
  if (!options?.skipMergedGeometry && wedgePos.length > 0) {
    interproximalGeometry = new BufferGeometry();
    interproximalGeometry.setAttribute("position", new BufferAttribute(wedgePos, 3));
    interproximalGeometry.setAttribute("normal", new BufferAttribute(wedgeNorm, 3));
  }

  return {
    stageId,
    stageNumber,
    baseGeometry,
    waxGeometry,
    interproximalGeometry,
    mergedGeometry,
    survey,
    sculptDeltas,
    lastUpdated: Date.now(),
    fittingSummary,
  };
}
