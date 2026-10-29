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
import type { ArchAsset } from "./stage-manifest";

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
      const finalBuffer = isGlb(buffer) ? await convertGlbToStlBuffer(buffer) : buffer;
      return { ok: true, buffer: finalBuffer };
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

export function clearStlBufferCache(): void {
  bufferCache.clear();
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

  const cached = bufferCache.get(url);
  if (cached) {
    return { ok: true, buffer: cached };
  }

  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error;
    return {
      ok: false,
      reason: `Network error fetching "${url}": ${error instanceof Error ? error.message : String(error)}`,
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      reason: `HTTP ${response.status} fetching "${url}"`,
    };
  }

  try {
    const buffer = await response.arrayBuffer();
    const finalBuffer = isGlb(buffer) ? await convertGlbToStlBuffer(buffer) : buffer;
    bufferCache.set(url, finalBuffer);
    return { ok: true, buffer: finalBuffer };
  } catch (error) {
    return {
      ok: false,
      reason: `Could not read response from "${url}": ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export { stlLoader };
