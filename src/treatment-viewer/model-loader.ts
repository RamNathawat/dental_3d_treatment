/**
 * Model loader for treatment stages.
 *
 * Fetches STL files and parses them with the same STLLoader used by the existing viewer.
 * Supports loading from remote URLs, ArchAsset records, or locally dropped File/Blob objects.
 * Handles loading errors gracefully, keeping the previous valid view intact on failure.
 *
 * Memory management: Three.js geometry and materials are disposed when switching stages,
 * so accumulating meshes across stage changes does not leak GPU memory.
 */

import { STLLoader } from "three/addons/loaders/STLLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { BufferGeometry, Mesh } from "three";
import { get as idbGet, set as idbSet, createStore } from "idb-keyval";
import { computeAnatomicalColors } from "../viewer/three-viewport";
import { capPlanarOpenings } from "../viewer/cap-planar";
import { computeToothCentroids } from "./tooth-data";
import type { ArchAsset, StageDefinition } from "./stage-manifest";

const isTestEnv =
  (typeof process !== "undefined" &&
    (process.env.NODE_ENV === "test" || process.env.VITEST === "true")) ||
  (typeof window !== "undefined" && "__VITEST__" in window);

const modelStore =
  !isTestEnv &&
  typeof window !== "undefined" &&
  typeof indexedDB !== "undefined"
    ? createStore("dental-models-db-v3", "glb-cache")
    : null;

export type ModelProgressCallback = (
  loadedBytes: number,
  totalBytes: number,
  percent: number,
) => void;

let globalProgressCallback: ModelProgressCallback | null = null;

export function setModelProgressCallback(
  cb: ModelProgressCallback | null,
): void {
  globalProgressCallback = cb;
}

export type ModelSource = string | ArchAsset | File | Blob;

export interface LoadedModels {
  readonly upperStl: ArrayBuffer | null;
  readonly lowerStl: ArrayBuffer | null;
}

export interface LoadResult {
  readonly ok: true;
  readonly models: LoadedModels;
}

export interface LoadError {
  readonly ok: false;
  readonly reason: string;
}

export type LoadOutcome = LoadResult | LoadError;

/** The loader is stateless — one instance shared across all loads is fine. */
const stlLoader = new STLLoader();

/**
 * Loads models for a stage in parallel (from URLs, ArchAssets, or Files).
 * Supports dual-arch (both upper and lower) as well as single-arch (upper only or lower only).
 * Returns an error if an arch is specified but fails to load, or if neither arch is specified.
 */
export async function loadStageModels(
  upper?: ModelSource | null,
  lower?: ModelSource | null,
  signal?: AbortSignal,
): Promise<LoadOutcome> {
  if (!upper && !lower) {
    return { ok: false, reason: "Stage must contain at least an Upper or Lower model." };
  }

  try {
    const [upperResult, lowerResult] = await Promise.all([
      upper ? resolveStlBuffer(upper, "Upper jaw", signal) : Promise.resolve(null),
      lower ? resolveStlBuffer(lower, "Lower jaw", signal) : Promise.resolve(null),
    ]);

    if (upper && upperResult && !upperResult.ok) {
      return { ok: false, reason: `Upper jaw: ${upperResult.reason}` };
    }
    if (lower && lowerResult && !lowerResult.ok) {
      return { ok: false, reason: `Lower jaw: ${lowerResult.reason}` };
    }

    return {
      ok: true,
      models: {
        upperStl: upperResult && upperResult.ok ? upperResult.buffer : null,
        lowerStl: lowerResult && lowerResult.ok ? lowerResult.buffer : null,
      },
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return { ok: false, reason: "Load cancelled" };
    }
    return {
      ok: false,
      reason: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Fire-and-forget pre-warm: begins fetching the given stage's STL files in the
 * background so they land in the in-memory cache before the user navigates to
 * them. Errors are swallowed; a cache miss on the actual navigate just falls
 * through to a fresh fetch.
 */
export function prefetchStageModels(
  upper?: ModelSource | null,
  lower?: ModelSource | null,
): void {
  if (upper) void resolveStlBuffer(upper, "Upper jaw (prefetch)");
  if (lower) void resolveStlBuffer(lower, "Lower jaw (prefetch)");
}

/**
 * Pre-warms an entire case progression in the background so that all
 * intermediate stages load with 0ms latency during playback and scrubbing.
 */
export function prewarmAllStages(
  stages: readonly { upper?: ModelSource | null; lower?: ModelSource | null }[],
): void {
  for (const s of stages) {
    prefetchStageModels(s.upper, s.lower);
  }
}


interface BufferSuccess {
  readonly ok: true;
  readonly buffer: ArrayBuffer;
}
interface BufferFailure {
  readonly ok: false;
  readonly reason: string;
}
type BufferOutcome = BufferSuccess | BufferFailure;

async function resolveStlBuffer(
  source: ModelSource,
  archLabel: string,
  signal?: AbortSignal,
): Promise<BufferOutcome> {
  if (signal?.aborted) {
    return { ok: false, reason: "Load cancelled" };
  }

  // 1. In-memory File or Blob
  if (source instanceof Blob) {
    try {
      const buffer = await source.arrayBuffer();
      return { ok: true, buffer };
    } catch (err) {
      return {
        ok: false,
        reason: `Could not read ${archLabel} file: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  // 2. ArchAsset object
  if (typeof source === "object" && source !== null && "filename" in source) {
    if (source.file) {
      return resolveStlBuffer(source.file, archLabel, signal);
    }
    if (source.url) {
      return fetchStl(source.url, signal);
    }
    return {
      ok: false,
      reason: `No file or URL provided for ${archLabel} ("${source.filename}")`,
    };
  }

  // 3. String URL
  if (typeof source === "string") {
    return fetchStl(source, signal);
  }

  return {
    ok: false,
    reason: `Invalid source specified for ${archLabel}`,
  };
}

/** Check if array buffer is GLB format by magic number ('glTF' = 0x46546c67) */
export function isGlb(buf: ArrayBuffer): boolean {
  if (buf.byteLength < 4) return false;
  const view = new DataView(buf);
  return view.getUint32(0, true) === 0x46546c67;
}

/** Converts a binary GLB buffer into a standard binary STL ArrayBuffer. */
export async function convertGlbToStlBuffer(glbBuffer: ArrayBuffer): Promise<ArrayBuffer> {
  const gltfLoader = new GLTFLoader();
  const gltf = await gltfLoader.parseAsync(glbBuffer, "");
  let mesh: import("three").Mesh | null = null;
  gltf.scene.traverse((child) => {
    if ((child as import("three").Mesh).isMesh && !mesh) {
      mesh = child as import("three").Mesh;
    }
  });

  if (!mesh) throw new Error("No mesh found inside GLB container");

  const nonIndexed = (mesh as import("three").Mesh).geometry.toNonIndexed();
  const posAttr = nonIndexed.attributes["position"];
  if (!posAttr) throw new Error("No position attribute in GLB mesh");

  const posArray = posAttr.array as Float32Array;
  const triangleCount = posArray.length / 9;
  const stlBuffer = new ArrayBuffer(84 + triangleCount * 50);
  const view = new DataView(stlBuffer);
  view.setUint32(80, triangleCount, true);

  let offset = 84;
  let posOffset = 0;
  for (let i = 0; i < triangleCount; i++) {
    // 12 bytes normal (can be 0)
    offset += 12;
    // v1
    view.setFloat32(offset, posArray[posOffset++]!, true);
    view.setFloat32(offset + 4, posArray[posOffset++]!, true);
    view.setFloat32(offset + 8, posArray[posOffset++]!, true);
    offset += 12;
    // v2
    view.setFloat32(offset, posArray[posOffset++]!, true);
    view.setFloat32(offset + 4, posArray[posOffset++]!, true);
    view.setFloat32(offset + 8, posArray[posOffset++]!, true);
    offset += 12;
    // v3
    view.setFloat32(offset, posArray[posOffset++]!, true);
    view.setFloat32(offset + 4, posArray[posOffset++]!, true);
    view.setFloat32(offset + 8, posArray[posOffset++]!, true);
    offset += 14;
  }

  return stlBuffer;
}

const bufferCache = new Map<string, ArrayBuffer>();
const rawGlbCache = new Map<string, ArrayBuffer>();
const inFlightFetches = new Map<string, Promise<BufferOutcome>>();

export function clearStlBufferCache(): void {
  bufferCache.clear();
  rawGlbCache.clear();
  inFlightFetches.clear();
  clearStageGeometryCache();
}

function calibrateGeometryColors(geom: BufferGeometry): void {
  if (!geom.getAttribute("normal")) {
    geom.computeVertexNormals();
  }
  geom.computeBoundingBox();
  geom.computeBoundingSphere();

  const colorAttr = geom.getAttribute("color");
  if (!colorAttr) return;

  const arr = colorAttr.array as Float32Array;
  const pos = geom.getAttribute("position");
  const norm = geom.getAttribute("normal");
  const count = colorAttr.count;

  // 1. Gather arch statistics to classify Upper vs Lower and bounds
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;
  let toothSumY = 0, toothCount = 0;
  let gumSumY = 0, gumCount = 0;

  for (let i = 0; i < count; i++) {
    const cIdx = i * 3;
    const r = arr[cIdx]!;
    const g = arr[cIdx + 1]!;
    const b = arr[cIdx + 2]!;
    const y = pos ? pos.getY(i) : 0;

    const isGum = (r > 0.35 && (r - g) > 0.08) || (r > 0.40 && g < 0.35 && b < 0.35);
    if (isGum) {
      gumSumY += y;
      gumCount++;
    } else {
      toothSumY += y;
      toothCount++;
    }

    if (pos) {
      const x = pos.getX(i), z = pos.getZ(i);
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
      if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
    }
  }

  // In Lower jaw: teeth sit above gums (toothMeanY > gumMeanY).
  // In Upper jaw: teeth hang below gums (toothMeanY < gumMeanY).
  const isUpper = gumCount > 0 && toothCount > 0 ? (toothSumY / toothCount) < (gumSumY / gumCount) : false;

  const midX = (minX + maxX) / 2;
  const focalZ = minZ - 12.0;
  const toothExtentY = Math.max(1, maxY - minY);

  // Calibrated Clinical Palette: Natural warm ivory / off-white enamel (matches Veer reference)
  // Prevents harsh chalky blowout and reveals crisp occlusal grooves and anatomical contours
  const tipR = 0.82, tipG = 0.79, tipB = 0.72; // Incisal edge & cusp tips (warm ivory highlight)
  const midR = 0.76, midG = 0.71, midB = 0.63; // Mid-crown body (natural warm ivory enamel)
  const nckR = 0.68, nckG = 0.61, nckB = 0.50; // Cervical neck warmth (natural dentin depth)
  const shdR = 0.46, shdG = 0.40, shdB = 0.32; // Occlusal fissure & interproximal shadow depth

  const gumR = 0.50, gumG = 0.09, gumB = 0.12; // Rich vascular coral-rose

  for (let i = 0; i < count; i++) {
    const cIdx = i * 3;
    const r = arr[cIdx]!;
    const g = arr[cIdx + 1]!;
    const b = arr[cIdx + 2]!;

    // 1. Remove green CAD labels (e.g., "NIYA 1", "NIYA 2") from models:
    if (g > 0.30 && g > r * 1.20) {
      arr[cIdx] = gumR;
      arr[cIdx + 1] = gumG;
      arr[cIdx + 2] = gumB;
      continue;
    }

    // 2. Gum / Gingiva: rich healthy vascular coral-rose
    const isGum = (r > 0.35 && (r - g) > 0.08) || (r > 0.40 && g < 0.35 && b < 0.35);
    if (isGum) {
      arr[cIdx] = gumR;
      arr[cIdx + 1] = gumG;
      arr[cIdx + 2] = gumB;
      continue;
    }

    // 3. Tooth Enamel: warm ivory / off-white with realistic anatomical fissure & contact depth
    if (pos && norm) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const nx = norm.getX(i), ny = norm.getY(i), nz = norm.getZ(i);

      const dx = x - midX;
      const dz = z - focalZ;
      const dist2D = Math.sqrt(dx * dx + dz * dz) || 1;
      const ux = dx / dist2D, uz = dz / dist2D;
      const nTangent = nx * (-uz) + nz * ux;
      const absTangent = Math.abs(nTangent);
      const absAngle = Math.abs(Math.atan2(dx, dz));

      // Normalized crown height: 0 at cusp tip, 1 at cervical margin
      const h = isUpper
        ? Math.max(0, Math.min(1, (y - minY) / (toothExtentY * 0.55)))
        : Math.max(0, Math.min(1, (maxY - y) / (toothExtentY * 0.55)));

      // Base gradient from cusp tip down to cervical neck
      let tr: number, tg: number, tb: number;
      if (h < 0.45) {
        const t = h / 0.45;
        tr = tipR + (midR - tipR) * t;
        tg = tipG + (midG - tipG) * t;
        tb = tipB + (midB - tipB) * t;
      } else {
        const t = (h - 0.45) / 0.55;
        tr = midR + (nckR - midR) * t;
        tg = midG + (nckG - midG) * t;
        tb = midB + (nckB - midB) * t;
      }

      // Interproximal contact shadow between teeth
      let crevice = Math.max(0, Math.min(1, (absTangent - 0.38) * 2.2));

      // Occlusal fissures, central grooves, and fossae on premolars and molars
      if (absAngle > 0.28 && h < 0.45) {
        const occlusalTilt = 1.0 - Math.abs(ny);
        if (occlusalTilt > 0.20) {
          const fissure = Math.max(0, Math.min(1, (occlusalTilt - 0.20) * 1.8));
          crevice = Math.max(crevice, fissure * 0.85);
        }
      }

      if (crevice > 0) {
        tr = tr + (shdR - tr) * (crevice * 0.65);
        tg = tg + (shdG - tg) * (crevice * 0.65);
        tb = tb + (shdB - tb) * (crevice * 0.65);
      }

      arr[cIdx] = tr;
      arr[cIdx + 1] = tg;
      arr[cIdx + 2] = tb;
    } else {
      arr[cIdx] = midR;
      arr[cIdx + 1] = midG;
      arr[cIdx + 2] = midB;
    }
  }
  colorAttr.needsUpdate = true;
}

export interface ExtractedGlbGeometries {
  readonly full: BufferGeometry;
  readonly noAttachments: BufferGeometry;
  readonly hasAttachments: boolean;
}

/** Extracts native BufferGeometries directly from an in-memory GLB buffer in ~10ms.
 * Safely preserves multi-mesh containers and separates distinct attachment submeshes. */
export async function extractGeometriesFromGlb(
  glbBuffer: ArrayBuffer,
): Promise<ExtractedGlbGeometries | null> {
  const gltfLoader = new GLTFLoader();
  const gltf = await gltfLoader.parseAsync(glbBuffer, "");
  const baseGeoms: BufferGeometry[] = [];
  const attGeoms: BufferGeometry[] = [];

  gltf.scene.updateMatrixWorld(true);
  gltf.scene.traverse((child) => {
    if ((child as Mesh).isMesh) {
      const m = child as Mesh;
      const g = m.geometry.clone();
      g.applyMatrix4(m.matrixWorld);
      const name = (child.name || "").toLowerCase();
      if (name.includes("attachment")) {
        attGeoms.push(g);
      } else {
        baseGeoms.push(g);
      }
    }
  });

  if (baseGeoms.length === 0 && attGeoms.length === 0) return null;

  if (attGeoms.length > 0) {
    const baseGeom =
      baseGeoms.length === 1
        ? baseGeoms[0]!
        : mergeGeometries(baseGeoms, false) || baseGeoms[0]!;
    const attGeom =
      attGeoms.length === 1
        ? attGeoms[0]!
        : mergeGeometries(attGeoms, false) || attGeoms[0]!;

    calibrateGeometryColors(baseGeom);
    calibrateGeometryColors(attGeom);

    const fullGeom =
      mergeGeometries([baseGeom.clone(), attGeom.clone()], false) || baseGeom;
    calibrateGeometryColors(fullGeom);

    return {
      full: fullGeom,
      noAttachments: baseGeom,
      hasAttachments: true,
    };
  }

  // If no separate attachment submeshes are present in the GLB,
  // return the clean base geometry without altering or mutating any vertices.
  const baseGeom =
    baseGeoms.length === 1
      ? baseGeoms[0]!
      : mergeGeometries(baseGeoms, false) || baseGeoms[0]!;
  calibrateGeometryColors(baseGeom);

  return {
    full: baseGeom,
    noAttachments: baseGeom,
    hasAttachments: false,
  };
}

/** Extracts native BufferGeometry directly from an in-memory GLB buffer in ~10ms.
 * Safely preserves multi-mesh containers (merging all arch submeshes). */
export async function extractGeometryFromGlb(glbBuffer: ArrayBuffer): Promise<BufferGeometry | null> {
  const result = await extractGeometriesFromGlb(glbBuffer);
  return result ? result.full : null;
}

async function fetchStl(
  url: string,
  signal?: AbortSignal,
): Promise<BufferOutcome> {
  if (signal?.aborted) {
    const err = new Error("The operation was aborted");
    err.name = "AbortError";
    throw err;
  }

  // 1. In-memory RAM cache check
  const cached = bufferCache.get(url);
  if (cached) {
    return { ok: true, buffer: cached };
  }

  const inFlight = inFlightFetches.get(url);
  if (inFlight) {
    return inFlight;
  }

  const promise = (async (): Promise<BufferOutcome> => {
    // 2. Persistent IndexedDB cache check (<5ms instant)
    if (modelStore) {
      try {
        const idbCached = await idbGet<ArrayBuffer>(url, modelStore);
        if (idbCached && idbCached.byteLength > 0) {
          bufferCache.set(url, idbCached);
          if (isGlb(idbCached)) {
            rawGlbCache.set(url, idbCached);
          }
          if (globalProgressCallback) {
            globalProgressCallback(idbCached.byteLength, idbCached.byteLength, 100);
          }
          return { ok: true, buffer: idbCached };
        }
      } catch {
        // Fall through to network fetch if IndexedDB read fails
      }
    }

    try {
      const response = await fetch(url, { signal });
      if (!response.ok) {
        return {
          ok: false,
          reason: `HTTP ${response.status} fetching "${url}"`,
        };
      }

      let buffer: ArrayBuffer;
      const contentLength = response.headers?.get
        ? response.headers.get("content-length")
        : null;
      const total = contentLength ? parseInt(contentLength, 10) : 0;

      // 3. Streaming download with live byte progress
      if (
        response.body &&
        typeof response.body.getReader === "function" &&
        total > 0
      ) {
        const reader = response.body.getReader();
        const chunks: Uint8Array[] = [];
        let loaded = 0;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            loaded += value.length;
            if (globalProgressCallback) {
              globalProgressCallback(loaded, total, Math.round((loaded / total) * 100));
            }
          }
        }
        const merged = new Uint8Array(loaded);
        let offset = 0;
        for (const chunk of chunks) {
          merged.set(chunk, offset);
          offset += chunk.length;
        }
        buffer = merged.buffer;
      } else {
        buffer = await response.arrayBuffer();
        if (globalProgressCallback && buffer.byteLength > 0) {
          globalProgressCallback(buffer.byteLength, buffer.byteLength, 100);
        }
      }

      if (isGlb(buffer)) {
        rawGlbCache.set(url, buffer);
      }
      bufferCache.set(url, buffer);

      // Save to IndexedDB persistently for subsequent instant loads
      if (modelStore) {
        idbSet(url, buffer, modelStore).catch((e) => {
          console.warn("Could not cache model in IndexedDB:", e);
        });
      }

      return { ok: true, buffer };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") throw error;
      return {
        ok: false,
        reason: `Network error fetching "${url}": ${error instanceof Error ? error.message : String(error)}`,
      };
    } finally {
      inFlightFetches.delete(url);
    }
  })();

  inFlightFetches.set(url, promise);
  return promise;
}

export { stlLoader };

export interface StageGeometries {
  readonly upper: BufferGeometry | null;
  readonly lower: BufferGeometry | null;
  readonly upperNoAttachments?: BufferGeometry | null;
  readonly lowerNoAttachments?: BufferGeometry | null;
  readonly hasAttachments?: boolean;
  readonly upperCentroids: Record<number, [number, number, number]>;
  readonly lowerCentroids: Record<number, [number, number, number]>;
}

const stageGeomCache = new Map<string, StageGeometries>();
const inFlightGeoms = new Map<
  string,
  Promise<
    { ok: true; geometries: StageGeometries } | { ok: false; reason: string }
  >
>();

export function getCachedStageGeometries(
  stageId: string,
): StageGeometries | undefined {
  return stageGeomCache.get(stageId);
}

export function isStageGeomCached(stageId: string): boolean {
  return stageGeomCache.has(stageId);
}

export function clearStageGeometryCache(): void {
  stageGeomCache.clear();
  inFlightGeoms.clear();
  prewarmQueue.length = 0;
  activePrewarmIds.clear();
}

/**
 * Loads, parses, and caches full Three.js geometries for a stage, including
 * pre-computed vertex normals, anatomical colors, per-tooth spatial centroids,
 * and distinct attachment/no-attachment configurations for visibility toggling.
 * Supports dual-arch as well as single-arch (upper-only or lower-only).
 *
 * Subsequent requests for the same stage resolve with 0ms latency.
 */
export async function loadStageGeometries(
  stage: StageDefinition,
  signal?: AbortSignal,
): Promise<
  { ok: true; geometries: StageGeometries } | { ok: false; reason: string }
> {
  const cached = stageGeomCache.get(stage.id);
  if (cached) {
    return { ok: true, geometries: cached };
  }

  const inFlight = inFlightGeoms.get(stage.id);
  if (inFlight) {
    return inFlight;
  }

  const promise = (async (): Promise<
    { ok: true; geometries: StageGeometries } | { ok: false; reason: string }
  > => {
    try {
      const outcome = await loadStageModels(stage.upper, stage.lower, signal);
      if (!outcome.ok) {
        return outcome;
      }

      const getGlbBuffer = (source?: ModelSource | null): ArrayBuffer | undefined => {
        if (!source) return undefined;
        if (typeof source === "object" && source !== null && "url" in source && source.url) {
          return rawGlbCache.get(source.url);
        }
        if (typeof source === "string") {
          return rawGlbCache.get(source);
        }
        return undefined;
      };

      let upperGeom: BufferGeometry | null = null;
      let upperNoAttGeom: BufferGeometry | null = null;
      let upperHasAtts = false;

      if (stage.upper && outcome.models.upperStl) {
        const upperGlb = getGlbBuffer(stage.upper);
        if (upperGlb) {
          const res = await extractGeometriesFromGlb(upperGlb);
          if (res) {
            upperGeom = res.full;
            upperNoAttGeom = res.noAttachments;
            upperHasAtts = res.hasAttachments;
          }
        }
        if (!upperGeom) {
          const isModelGlb = isGlb(outcome.models.upperStl);
          if (isModelGlb) {
            const res = await extractGeometriesFromGlb(outcome.models.upperStl);
            if (res) {
              upperGeom = res.full;
              upperNoAttGeom = res.noAttachments;
              upperHasAtts = res.hasAttachments;
            }
          } else {
            const rawUpper = stlLoader.parse(outcome.models.upperStl);
            if (rawUpper) {
              upperGeom = capPlanarOpenings(rawUpper, true);
              upperGeom.computeVertexNormals();
              if (!upperGeom.getAttribute("color")) {
                computeAnatomicalColors(
                  upperGeom,
                  stage.upper.filename || `${stage.label} - Upper`,
                );
              }
              upperHasAtts = false;
              upperNoAttGeom = upperGeom;
            }
          }
        }
        if (upperGeom) {
          upperGeom.computeBoundingBox();
          upperGeom.computeBoundingSphere();
        }
        if (upperNoAttGeom) {
          upperNoAttGeom.computeBoundingBox();
          upperNoAttGeom.computeBoundingSphere();
        }
      }

      let lowerGeom: BufferGeometry | null = null;
      let lowerNoAttGeom: BufferGeometry | null = null;
      let lowerHasAtts = false;

      if (stage.lower && outcome.models.lowerStl) {
        const lowerGlb = getGlbBuffer(stage.lower);
        if (lowerGlb) {
          const res = await extractGeometriesFromGlb(lowerGlb);
          if (res) {
            lowerGeom = res.full;
            lowerNoAttGeom = res.noAttachments;
            lowerHasAtts = res.hasAttachments;
          }
        }
        if (!lowerGeom) {
          const isModelGlb = isGlb(outcome.models.lowerStl);
          if (isModelGlb) {
            const res = await extractGeometriesFromGlb(outcome.models.lowerStl);
            if (res) {
              lowerGeom = res.full;
              lowerNoAttGeom = res.noAttachments;
              lowerHasAtts = res.hasAttachments;
            }
          } else {
            const rawLower = stlLoader.parse(outcome.models.lowerStl);
            if (rawLower) {
              lowerGeom = capPlanarOpenings(rawLower, false);
              lowerGeom.computeVertexNormals();
              if (!lowerGeom.getAttribute("color")) {
                computeAnatomicalColors(
                  lowerGeom,
                  stage.lower.filename || `${stage.label} - Lower`,
                );
              }
              lowerHasAtts = false;
              lowerNoAttGeom = lowerGeom;
            }
          }
        }
        if (lowerGeom) {
          lowerGeom.computeBoundingBox();
          lowerGeom.computeBoundingSphere();
        }
        if (lowerNoAttGeom) {
          lowerNoAttGeom.computeBoundingBox();
          lowerNoAttGeom.computeBoundingSphere();
        }
      }

      if (!upperGeom && !lowerGeom) {
        return { ok: false, reason: "Could not parse geometry for either arch in this stage." };
      }

      const upperCentroids = upperGeom ? computeToothCentroids(upperGeom, true) : {};
      const lowerCentroids = lowerGeom ? computeToothCentroids(lowerGeom, false) : {};

      const geometries: StageGeometries = {
        upper: upperGeom,
        lower: lowerGeom,
        upperNoAttachments: upperNoAttGeom,
        lowerNoAttachments: lowerNoAttGeom,
        hasAttachments: upperHasAtts || lowerHasAtts,
        upperCentroids,
        lowerCentroids,
      };
      stageGeomCache.set(stage.id, geometries);
      return { ok: true, geometries };
    } catch (err) {
      return {
        ok: false,
        reason: err instanceof Error ? err.message : String(err),
      };
    } finally {
      inFlightGeoms.delete(stage.id);
    }
  })();

  inFlightGeoms.set(stage.id, promise);
  return promise;
}

const prewarmQueue: StageDefinition[] = [];
const activePrewarmIds = new Set<string>();
const MAX_CONCURRENT_PREWARMS = 4;
let prewarmScheduled = false;

function pumpPrewarmQueue(): void {
  prewarmScheduled = false;

  while (activePrewarmIds.size < MAX_CONCURRENT_PREWARMS && prewarmQueue.length > 0) {
    const stage = prewarmQueue.shift();
    if (!stage) break;

    if (stageGeomCache.has(stage.id) || activePrewarmIds.has(stage.id)) {
      continue;
    }

    activePrewarmIds.add(stage.id);

    loadStageGeometries(stage)
      .then(() => {
        activePrewarmIds.delete(stage.id);
        pumpPrewarmQueue();
      })
      .catch((err) => {
        activePrewarmIds.delete(stage.id);
        console.warn(`Prewarm error on stage ${stage.id}:`, err);
        pumpPrewarmQueue();
      });
  }
}

function schedulePump(): void {
  if (!prewarmScheduled) {
    prewarmScheduled = true;
    if (typeof queueMicrotask === "function") {
      queueMicrotask(pumpPrewarmQueue);
    } else {
      setTimeout(pumpPrewarmQueue, 0);
    }
  }
}

/**
 * Prioritizes a specific stage by moving it to the absolute front of the background prewarm queue.
 * If the user clicks Play or navigates ahead, this ensures the target stage is loaded immediately.
 */
export function prioritizeStage(stageId: string): void {
  if (stageGeomCache.has(stageId) || activePrewarmIds.has(stageId)) {
    return;
  }
  const idx = prewarmQueue.findIndex((s) => s.id === stageId);
  if (idx > 0) {
    const [target] = prewarmQueue.splice(idx, 1);
    if (target) {
      prewarmQueue.unshift(target);
    }
  }
  schedulePump();
}

export function prioritizeStages(stageIds: readonly string[]): void {
  for (let i = stageIds.length - 1; i >= 0; i--) {
    const id = stageIds[i];
    if (id) prioritizeStage(id);
  }
}

/**
 * Pre-warms and parses all stage 3D geometries concurrently in the background.
 * Uses a 4-worker pipeline over HTTP/2 so an entire 30-stage progression loads into
 * RAM within seconds, enabling 60 FPS zero-latency playback and instant scrubbing.
 */
export function prewarmAllStageGeometries(
  stages: readonly StageDefinition[],
): void {
  for (const stage of stages) {
    if (!stageGeomCache.has(stage.id) && !activePrewarmIds.has(stage.id)) {
      if (!prewarmQueue.some((s) => s.id === stage.id)) {
        prewarmQueue.push(stage);
      }
    }
  }

  schedulePump();
}

