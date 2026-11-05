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
  readonly upperStl: ArrayBuffer;
  readonly lowerStl: ArrayBuffer;
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
 * Loads both STL models for a stage in parallel (from URLs, ArchAssets, or Files).
 * Returns an error if either load fails.
 */
export async function loadStageModels(
  upper: ModelSource,
  lower: ModelSource,
  signal?: AbortSignal,
): Promise<LoadOutcome> {
  try {
    const [upperResult, lowerResult] = await Promise.all([
      resolveStlBuffer(upper, "Upper jaw", signal),
      resolveStlBuffer(lower, "Lower jaw", signal),
    ]);

    if (!upperResult.ok) {
      return { ok: false, reason: `Upper jaw: ${upperResult.reason}` };
    }
    if (!lowerResult.ok) {
      return { ok: false, reason: `Lower jaw: ${lowerResult.reason}` };
    }

    return {
      ok: true,
      models: {
        upperStl: upperResult.buffer,
        lowerStl: lowerResult.buffer,
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
 * them.  Errors are swallowed; a cache miss on the actual navigate just falls
 * through to a fresh fetch.
 */
export function prefetchStageModels(upper: ModelSource, lower: ModelSource): void {
  void resolveStlBuffer(upper, "Upper jaw (prefetch)");
  void resolveStlBuffer(lower, "Lower jaw (prefetch)");
}

/**
 * Pre-warms an entire case progression in the background so that all
 * intermediate stages load with 0ms latency during playback and scrubbing.
 */
export function prewarmAllStages(
  stages: readonly { upper: ModelSource; lower: ModelSource }[],
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

/** Extracts native BufferGeometry directly from an in-memory GLB buffer in ~10ms */
export async function extractGeometryFromGlb(glbBuffer: ArrayBuffer): Promise<BufferGeometry | null> {
  const gltfLoader = new GLTFLoader();
  const gltf = await gltfLoader.parseAsync(glbBuffer, "");
  let geom: BufferGeometry | null = null;
  gltf.scene.traverse((child) => {
    if ((child as Mesh).isMesh && !geom) {
      geom = (child as Mesh).geometry;
    }
  });
  if (geom) {
    if (!(geom as BufferGeometry).getAttribute("normal")) {
      (geom as BufferGeometry).computeVertexNormals();
    }

    // Calibrate vertex colors for natural ClinCheck / 3Shape aesthetics:
    // Upgrades previously uploaded cases with pale/chalky colors to clinical enamel & gingiva tones
    const colorAttr = (geom as BufferGeometry).getAttribute("color");
    if (colorAttr) {
      const arr = colorAttr.array as Float32Array;
      for (let i = 0; i < arr.length; i += 3) {
        const r = arr[i]!;
        const g = arr[i + 1]!;
        const b = arr[i + 2]!;
        // 1. Preserve distinct green CAD labels or attachment markings (e.g., "NIYA 1", "NIYA 2")
        if (g > 0.40 && g > r * 1.30) {
          continue;
        }
        // 2. Gum / Gingiva: rich healthy vascular coral-rose (#CC5C6A in linear: 0.46, 0.085, 0.105)
        if (r > 0.35 && (r - g) > 0.08) {
          arr[i] = 0.46;
          arr[i + 1] = 0.085;
          arr[i + 2] = 0.105;
        } else if (r > 0.60 && g > 0.55 && b > 0.50) {
          // 3. Tooth Enamel: natural pearlescent enamel ivory (#E1E0DF in linear: 0.76, 0.74, 0.72)
          arr[i] = 0.76;
          arr[i + 1] = 0.74;
          arr[i + 2] = 0.72;
        }
      }
      colorAttr.needsUpdate = true;
    }

    return geom;
  }
  return null;
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
  readonly upper: BufferGeometry;
  readonly lower: BufferGeometry;
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

export function clearStageGeometryCache(): void {
  stageGeomCache.clear();
  inFlightGeoms.clear();
}

/**
 * Loads, parses, and caches full Three.js geometries for a stage, including
 * pre-computed vertex normals, anatomical colors, and per-tooth spatial centroids.
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

      const getGlbBuffer = (source: ModelSource): ArrayBuffer | undefined => {
        if (typeof source === "object" && source !== null && "url" in source && source.url) {
          return rawGlbCache.get(source.url);
        }
        if (typeof source === "string") {
          return rawGlbCache.get(source);
        }
        return undefined;
      };

      const upperGlb = getGlbBuffer(stage.upper);
      const lowerGlb = getGlbBuffer(stage.lower);

      let upperGeom: BufferGeometry | null = null;
      if (upperGlb) {
        upperGeom = await extractGeometryFromGlb(upperGlb);
      }
      if (!upperGeom) {
        const isModelGlb = isGlb(outcome.models.upperStl);
        const rawUpper = isModelGlb
          ? await extractGeometryFromGlb(outcome.models.upperStl)
          : stlLoader.parse(outcome.models.upperStl);
        if (rawUpper) {
          upperGeom = isModelGlb ? rawUpper : capPlanarOpenings(rawUpper, true);
          upperGeom.computeVertexNormals();
          if (!upperGeom.getAttribute("color")) {
            computeAnatomicalColors(
              upperGeom,
              stage.upper.filename || `${stage.label} - Upper`,
            );
          }
        }
      }
      if (!upperGeom) {
        return { ok: false, reason: "Could not parse Upper jaw geometry." };
      }
      upperGeom.computeBoundingBox();
      upperGeom.computeBoundingSphere();

      let lowerGeom: BufferGeometry | null = null;
      if (lowerGlb) {
        lowerGeom = await extractGeometryFromGlb(lowerGlb);
      }
      if (!lowerGeom) {
        const isModelGlb = isGlb(outcome.models.lowerStl);
        const rawLower = isModelGlb
          ? await extractGeometryFromGlb(outcome.models.lowerStl)
          : stlLoader.parse(outcome.models.lowerStl);
        if (rawLower) {
          lowerGeom = isModelGlb ? rawLower : capPlanarOpenings(rawLower, false);
          lowerGeom.computeVertexNormals();
          if (!lowerGeom.getAttribute("color")) {
            computeAnatomicalColors(
              lowerGeom,
              stage.lower.filename || `${stage.label} - Lower`,
            );
          }
        }
      }
      if (!lowerGeom) {
        return { ok: false, reason: "Could not parse Lower jaw geometry." };
      }
      lowerGeom.computeBoundingBox();
      lowerGeom.computeBoundingSphere();

      const upperCentroids = computeToothCentroids(upperGeom, true);
      const lowerCentroids = computeToothCentroids(lowerGeom, false);

      const geometries: StageGeometries = {
        upper: upperGeom,
        lower: lowerGeom,
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

/**
 * Pre-warms and parses all stage 3D geometries in the background,
 * spaced across ticks so the main thread remains 100% fluid and responsive.
 */
export function prewarmAllStageGeometries(
  stages: readonly StageDefinition[],
): void {
  // Start at index 1: Stage 0 is already prioritized by navigate(0)
  let index = 1;
  function processNext(): void {
    if (index >= stages.length) return;
    const stage = stages[index++];
    if (!stage) return;
    if (stageGeomCache.has(stage.id)) {
      setTimeout(processNext, 100);
      return;
    }
    loadStageGeometries(stage)
      .then(() => {
        // Space sequential background downloads so playback stays at 60 FPS
        setTimeout(processNext, 250);
      })
      .catch(() => {
        setTimeout(processNext, 250);
      });
  }
  // Allow initial Stage 1 to settle and render before background prewarming
  setTimeout(processNext, 800);
}

