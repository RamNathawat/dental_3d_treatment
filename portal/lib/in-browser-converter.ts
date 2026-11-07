import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import * as fflate from "fflate";
import { createClient } from "@/lib/supabase/client";

export interface ProgressCallback {
  (step: string, percent: number): void;
}

export interface DentalUploadFiles {
  upperZip?: File | null;
  lowerZip?: File | null;
  singleZip?: File | null;
}

export interface IngestResult {
  ok: boolean;
  caseId?: string;
  shareToken?: string;
  totalStages?: number;
  archType?: "both" | "upper" | "lower";
  hasUpper?: boolean;
  hasLower?: boolean;
  patientId?: string;
  patientAge?: number;
  patientSex?: string;
  clinicName?: string;
  clinicEmail?: string;
  error?: string;
}

/**
 * Plans and seals the open planar boundary of the dental model using
 * exact polygon triangulation (Earcut). Properly handles horseshoe/concave arches.
 */
interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface EdgeEntry {
  count: number;
  v1: Point3D;
  v2: Point3D;
  k1: string;
  k2: string;
}

export function capPlanarOpenings(
  geometry: THREE.BufferGeometry,
  isUpper: boolean,
): THREE.BufferGeometry {
  const posAttr = geometry.getAttribute("position");
  if (!posAttr) return geometry;

  const count = posAttr.count;
  const numTriangles = count / 3;
  const edgeMap = new Map<string, EdgeEntry>();

  function getPtKey(x: number, y: number, z: number): string {
    return `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;
  }
  function getEdgeKey(k1: string, k2: string): string {
    return k1 < k2 ? `${k1}_${k2}` : `${k2}_${k1}`;
  }

  // Find extreme Y bounds to isolate the base planar cut plane
  let minY = Infinity,
    maxY = -Infinity;
  for (let i = 0; i < count; i += 3) {
    const y0 = posAttr.getY(i),
      y1 = posAttr.getY(i + 1),
      y2 = posAttr.getY(i + 2);
    if (y0 < minY) minY = y0;
    if (y0 > maxY) maxY = y0;
    if (y1 < minY) minY = y1;
    if (y1 > maxY) maxY = y1;
    if (y2 < minY) minY = y2;
    if (y2 > maxY) maxY = y2;
  }

  const cutY = isUpper ? maxY : minY;
  const cutThreshold = 2.0;

  const pts = new Map<string, Point3D>();
  for (let i = 0; i < numTriangles; i++) {
    const i3 = i * 3;
    const y0 = posAttr.getY(i3);
    const y1 = posAttr.getY(i3 + 1);
    const y2 = posAttr.getY(i3 + 2);

    if (
      Math.abs(y0 - cutY) > cutThreshold &&
      Math.abs(y1 - cutY) > cutThreshold &&
      Math.abs(y2 - cutY) > cutThreshold
    ) {
      continue;
    }

    const v: Point3D[] = [
      { x: posAttr.getX(i3), y: y0, z: posAttr.getZ(i3) },
      { x: posAttr.getX(i3 + 1), y: y1, z: posAttr.getZ(i3 + 1) },
      { x: posAttr.getX(i3 + 2), y: y2, z: posAttr.getZ(i3 + 2) },
    ];

    for (let j = 0; j < 3; j++) {
      const v1 = v[j]!;
      const v2 = v[(j + 1) % 3]!;
      const k1 = getPtKey(v1.x, v1.y, v1.z);
      const k2 = getPtKey(v2.x, v2.y, v2.z);
      pts.set(k1, v1);
      pts.set(k2, v2);
      const ek = getEdgeKey(k1, k2);
      let entry = edgeMap.get(ek);
      if (!entry) {
        entry = { count: 0, v1, v2, k1, k2 };
        edgeMap.set(ek, entry);
      }
      entry.count++;
    }
  }

  // Find single-use boundary edges
  const adj = new Map<string, string[]>();
  for (const entry of edgeMap.values()) {
    if (entry.count === 1) {
      if (!adj.has(entry.k1)) adj.set(entry.k1, []);
      if (!adj.has(entry.k2)) adj.set(entry.k2, []);
      adj.get(entry.k1)!.push(entry.k2);
      adj.get(entry.k2)!.push(entry.k1);
    }
  }

  if (adj.size === 0) return geometry;

  // Extract closed boundary loops
  const visited = new Set<string>();
  const loops: string[][] = [];
  for (const start of adj.keys()) {
    if (visited.has(start)) continue;
    const loop = [start];
    visited.add(start);
    let curr = start;
    let prev: string | null = null;
    while (true) {
      const neighbors = adj.get(curr);
      if (!neighbors) break;
      const next = neighbors.find((n) => n !== prev && !visited.has(n));
      if (!next) break;
      visited.add(next);
      loop.push(next);
      prev = curr;
      curr = next;
    }
    if (loop.length >= 3) loops.push(loop);
  }

  const capTriangles: Point3D[] = [];
  for (const loop of loops) {
    const yVals = loop.map((k) => pts.get(k)!.y);
    const minLoopY = Math.min(...yVals);
    const maxLoopY = Math.max(...yVals);

    // Only cap loops that lie on a flat cutting plane (tolerance <= 0.6mm)
    if (maxLoopY - minLoopY > 0.6) continue;

    const points2D = loop.map((k) => {
      const p = pts.get(k)!;
      return new THREE.Vector2(p.x, p.z);
    });

    const triIndices = THREE.ShapeUtils.triangulateShape(points2D, []);
    let totalAreaY = 0;
    for (const tri of triIndices) {
      const i0 = tri[0],
        i1 = tri[1],
        i2 = tri[2];
      if (i0 === undefined || i1 === undefined || i2 === undefined) continue;
      const p0 = points2D[i0],
        p1 = points2D[i1],
        p2 = points2D[i2];
      if (!p0 || !p1 || !p2) continue;
      totalAreaY += (p1.y - p0.y) * (p2.x - p0.x) - (p1.x - p0.x) * (p2.y - p0.y);
    }
    const targetPositiveY = isUpper;
    const shouldFlip = targetPositiveY ? totalAreaY < 0 : totalAreaY > 0;

    for (const tri of triIndices) {
      let i0 = tri[0],
        i1 = tri[1],
        i2 = tri[2];
      if (i0 === undefined || i1 === undefined || i2 === undefined) continue;

      if (shouldFlip) {
        const tmp = i1;
        i1 = i2;
        i2 = tmp;
      }
      const k0 = loop[i0],
        k1 = loop[i1],
        k2 = loop[i2];
      if (!k0 || !k1 || !k2) continue;
      const p0 = pts.get(k0),
        p1 = pts.get(k1),
        p2 = pts.get(k2);
      if (p0 && p1 && p2) {
        capTriangles.push(p0, p1, p2);
      }
    }
  }

  if (capTriangles.length === 0) return geometry;

  const oldPositions = posAttr.array;
  const newPositions = new Float32Array(oldPositions.length + capTriangles.length * 3);
  newPositions.set(oldPositions, 0);

  let offset = oldPositions.length;
  for (const pt of capTriangles) {
    newPositions[offset++] = pt.x;
    newPositions[offset++] = pt.y;
    newPositions[offset++] = pt.z;
  }

  geometry.setAttribute("position", new THREE.Float32BufferAttribute(newPositions, 3));
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

/**
 * Computes realistic ClinCheck / 3Shape anatomical coloring for solid (unsegmented) dental meshes.
 * Accurately traces the cervical margin separating pearlescent tooth enamel from healthy gingiva.
 */
export function computeAnatomicalColors(
  geometry: THREE.BufferGeometry,
  options: { isUpper: boolean },
): void {
  const pos = geometry.getAttribute("position");
  if (!pos || pos.count === 0) return;

  const count = pos.count;
  const isUpper = options.isUpper;

  if (!geometry.getAttribute("normal")) {
    geometry.computeVertexNormals();
  }
  const norm = geometry.getAttribute("normal");

  // Natural Ivory / Off-White Enamel Palette (matches Veer / 3Shape clinical reference)
  // Soft, warm ceramic off-white with distinct fissure and interproximal shadow depth
  const tipR = 0.82, tipG = 0.79, tipB = 0.72; // Incisal edge & cusp tips (warm ivory highlight)
  const midR = 0.76, midG = 0.71, midB = 0.63; // Mid-crown body (natural warm ivory enamel)
  const nckR = 0.68, nckG = 0.61, nckB = 0.50; // Cervical neck warmth (natural dentin depth)
  const shdR = 0.46, shdG = 0.40, shdB = 0.32; // Interproximal shadow & occlusal fissure depth

  const gumMarginR = 0.68, gumMarginG = 0.18, gumMarginB = 0.24;
  const gumAttachR = 0.60, gumAttachG = 0.14, gumAttachB = 0.20;
  const gumDeepR   = 0.50, gumDeepG   = 0.10, gumDeepB   = 0.14;

  let minX = Infinity, maxX = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  for (let i = 0; i < count; i += 4) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
    if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
  }

  const midX = (minX + maxX) / 2;
  const focalZ = minZ - 12.0;
  const maxSpanAngle = 0.95;

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
    smoothPeak[s] = w > 0 ? sum / w : isUpper ? minY : maxY;
  }

  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const nx = norm ? norm.getX(i) : 0;
    const ny = norm ? norm.getY(i) : 0;
    const nz = norm ? norm.getZ(i) : 0;

    const dx = x - midX;
    const dz = z - focalZ;
    const dist2D = Math.sqrt(dx * dx + dz * dz);
    const ux = dist2D > 0 ? dx / dist2D : 0;
    const uz = dist2D > 0 ? dz / dist2D : 1;
    const vx = -uz;
    const vz = ux;

    const nRadial = nx * ux + nz * uz;
    const nTangent = nx * vx + nz * vz;
    const absTangent = Math.abs(nTangent);

    const angle = Math.atan2(dx, dz);
    const s = Math.max(
      0,
      Math.min(
        numSectors - 1,
        Math.floor(((angle + maxSpanAngle) / (2 * maxSpanAngle)) * numSectors),
      ),
    );
    const tip = smoothPeak[s]!;
    const distFromTip = isUpper ? y - tip : tip - y;

    const absAngle = Math.abs(angle);
    let baseCrownHeight = isUpper ? 5.4 : 4.8;
    if (absAngle > 0.22 && absAngle < 0.46) {
      baseCrownHeight += 0.55;
    } else if (absAngle >= 0.46) {
      baseCrownHeight -= 0.55;
    }

    const scallop = Math.max(
      -0.9,
      Math.min(0.5, 0.4 * Math.max(0, nRadial) - 0.85 * Math.pow(absTangent, 1.6)),
    );
    const effectiveCrownHeight = baseCrownHeight + scallop;
    const gingivalSlope = isUpper ? ny : -ny;
    const marginScore = distFromTip - effectiveCrownHeight + gingivalSlope * 0.45;

    const marginHalfWidth = 0.35;

    if (marginScore < -marginHalfWidth) {
      const crownT = Math.max(0, Math.min(1, distFromTip / effectiveCrownHeight));
      let r: number, g: number, b: number;
      if (crownT < 0.45) {
        const t = crownT / 0.45;
        r = tipR + (midR - tipR) * t;
        g = tipG + (midG - tipG) * t;
        b = tipB + (midB - tipB) * t;
      } else {
        const t = (crownT - 0.45) / 0.55;
        r = midR + (nckR - midR) * t;
        g = midG + (nckG - midG) * t;
        b = midB + (nckB - midB) * t;
      }
      if (absTangent > 0.40) {
        const shadowT = Math.min(0.60, (absTangent - 0.40) * 1.5);
        r = r + (shdR - r) * shadowT;
        g = g + (shdG - g) * shadowT;
        b = b + (shdB - b) * shadowT;
      }
      // Occlusal fissures & fossae on molars and premolars
      if (absAngle > 0.28 && crownT < 0.40) {
        const occlusalTilt = 1.0 - Math.abs(ny);
        if (occlusalTilt > 0.20) {
          const fissureT = Math.min(0.55, (occlusalTilt - 0.20) * 1.6);
          r = r + (shdR - r) * fissureT;
          g = g + (shdG - g) * fissureT;
          b = b + (shdB - b) * fissureT;
        }
      }
      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    } else if (marginScore > marginHalfWidth) {
      const gumDepth = marginScore - marginHalfWidth;
      let r: number, g: number, b: number;
      if (gumDepth < 2.5) {
        const t = gumDepth / 2.5;
        r = gumMarginR + (gumAttachR - gumMarginR) * t;
        g = gumMarginG + (gumAttachG - gumMarginG) * t;
        b = gumMarginB + (gumAttachB - gumMarginB) * t;
      } else {
        const t = Math.min(1, (gumDepth - 2.5) / 5.0);
        r = gumAttachR + (gumDeepR - gumAttachR) * t;
        g = gumAttachG + (gumDeepG - gumAttachG) * t;
        b = gumAttachB + (gumDeepB - gumAttachB) * t;
      }
      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    } else {
      const t = (marginScore + marginHalfWidth) / (2 * marginHalfWidth);
      const toothR = nckR, toothG = nckG, toothB = nckB;
      colors[i * 3] = toothR * (1 - t) + gumMarginR * t;
      colors[i * 3 + 1] = toothG * (1 - t) + gumMarginG * t;
      colors[i * 3 + 2] = toothB * (1 - t) + gumMarginB * t;
    }
  }

  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
}

interface ArchStageFiles {
  gum?: Uint8Array;
  teeth: Uint8Array[];
  attachments?: Uint8Array[];
  labels?: Uint8Array[];
  combined?: Uint8Array;
}

/**
 * Extracts and maps all files in a zip or nested zips.
 * Normalizes all path separators to forward slashes.
 */
function unpackZipRecursive(zipBytes: Uint8Array): Record<string, Uint8Array> {
  const allFilesMap: Record<string, Uint8Array> = {};
  const unzipped = fflate.unzipSync(zipBytes);

  for (const [name, content] of Object.entries(unzipped)) {
    const cleanName = name.replace(/\\/g, "/");
    if (cleanName.toLowerCase().endsWith(".zip")) {
      try {
        const nested = fflate.unzipSync(content);
        for (const [nestedName, nestedContent] of Object.entries(nested)) {
          allFilesMap[`${cleanName}/${nestedName.replace(/\\/g, "/")}`] = nestedContent;
        }
      } catch (e) {
        console.warn("Could not unpack nested ZIP:", name, e);
      }
    } else {
      allFilesMap[cleanName] = content;
    }
  }
  return allFilesMap;
}

export function parseStageFromPath(rawPath: string): number | null {
  const normalized = rawPath.replace(/\\/g, "/");
  const parts = normalized.split("/").filter(Boolean);
  if (parts.length === 0) return null;

  const baseName = parts[parts.length - 1] || "";
  const baseLower = baseName.toLowerCase();

  // If path is inside an attachment template or unaligned raw segmented directory, ignore as progressive stage
  for (const part of parts) {
    const pl = part.toLowerCase();
    if (pl.includes("template") || pl.includes("segmented")) {
      return null;
    }
  }

  // Tooth files (tooth_01.obj) and attachment files (attachment_00.obj) carry component/FDI indices,
  // NOT stage numbers. We must strictly examine the directory hierarchy for the stage number.
  const isComponent =
    baseLower.startsWith("tooth") ||
    baseLower.includes("teeth") ||
    baseLower.startsWith("attachment") ||
    baseLower.startsWith("label") ||
    baseLower === "gum.obj" ||
    baseLower.includes("gingiva");

  // Check directory levels from innermost parent outwards
  for (let i = parts.length - 2; i >= 0; i--) {
    const dir = parts[i]!;

    // 1. Direct exact numeric folder: "01", "02", "10"
    const exactNum = dir.match(/^0*([1-9]\d?)$/);
    if (exactNum) return parseInt(exactNum[1], 10);

    // 2. Folder with stage/step: "Stage 01", "Stage_01", "Step-02", "Stage 10"
    const stageDir = dir.match(/(?:stage|step|phase|aligner|stg)[\s_.-]*0*([1-9]\d?)(?:[^\d]|$)/i);
    if (stageDir) return parseInt(stageDir[1], 10);

    // 3. Folder with arch and number: "Upper_01", "01-Upper", "Maxilla_02"
    const archDir =
      dir.match(/(?:upper|lower|maxill|mandib)[\s_.-]*0*([1-9]\d?)(?:[^\d]|$)/i) ||
      dir.match(/^0*([1-9]\d?)[\s_.-]*(?:upper|lower|maxill|mandib)/i);
    if (archDir) return parseInt(archDir[1], 10);
  }

  // If NOT a component (i.e. it is a solid stage file like "Stage 01.stl", "01.obj", "Upper_02.obj"):
  if (!isComponent) {
    // 1. "Stage 01.obj", "Step 02.stl"
    const stageFile = baseName.match(/(?:stage|step|phase|aligner|stg)[\s_.-]*0*([1-9]\d?)(?:[^\d]|$)/i);
    if (stageFile) return parseInt(stageFile[1], 10);

    // 2. "Upper_01.obj", "01_Upper.stl"
    const archFile =
      baseName.match(/(?:upper|lower|maxill|mandib)[\s_.-]*0*([1-9]\d?)(?:[^\d]|$)/i) ||
      baseName.match(/^0*([1-9]\d?)[\s_.-]*(?:upper|lower|maxill|mandib)/i);
    if (archFile) return parseInt(archFile[1], 10);

    // 3. Simple "01.obj", "02.stl"
    const fileNumMatch = baseName.match(/^0*([1-9]\d?)\.(?:obj|stl|glb)$/i);
    if (fileNumMatch) return parseInt(fileNumMatch[1], 10);
  }

  return null;
}

/**
 * Ingests Upper and/or Lower Maestro 3D export archives directly in the browser:
 * 1. Supports separate Upper ZIP and Lower ZIP, single-arch cases (Upper only OR Lower only), or combined ZIP.
 * 2. Uncompresses CAD models entirely in-memory.
 * 3. Applies planar capping (Maxilla top cut / Mandible base cut) and anatomical coloring.
 * 4. Compresses to optimized 60 FPS GLB models.
 * 5. Uploads models and manifest.json to Supabase Cloud Storage.
 * 6. Creates case database row with proper arch labeling.
 */
export async function processDentalZipInBrowser(
  input: DentalUploadFiles | File,
  patientName: string,
  userId: string,
  onProgress: ProgressCallback,
  ipr?: any[],
  doctorNotes?: any,
  patientId?: string,
  clinicName?: string,
  patientAge?: number,
  patientSex?: string,
  clinicEmail?: string,
  existingCaseId?: string,
): Promise<IngestResult> {
  const supabase = createClient();
  const objLoader = new OBJLoader();
  const gltfExporter = new GLTFExporter();
  const isEdit = Boolean(existingCaseId);

  try {
    let upperFile: File | null = null;
    let lowerFile: File | null = null;
    let singleFile: File | null = null;

    if (input instanceof File) {
      singleFile = input;
    } else {
      upperFile = input.upperZip ?? null;
      lowerFile = input.lowerZip ?? null;
      singleFile = input.singleZip ?? null;
    }

    if (!upperFile && !lowerFile && !singleFile) {
      return { ok: false, error: "Please provide at least one dental archive (Upper or Lower)." };
    }

    const upperStages = new Map<number, ArchStageFiles>();
    const lowerStages = new Map<number, ArchStageFiles>();

    // ── 1. Process Upper Arch ZIP if provided ─────────────────────────────────
    if (upperFile) {
      onProgress(`Uncompressing Upper jaw archive (${upperFile.name})...`, 8);
      const buf = await upperFile.arrayBuffer();
      const filesMap = unpackZipRecursive(new Uint8Array(buf));

      for (const [rawName, content] of Object.entries(filesMap)) {
        if (rawName.endsWith("/") || rawName.includes("__MACOSX")) continue;
        const lowerName = rawName.toLowerCase();
        if (!lowerName.endsWith(".obj") && !lowerName.endsWith(".stl")) continue;

        const stageNum = parseStageFromPath(rawName);
        if (stageNum === null || stageNum === 0) continue;

        if (!upperStages.has(stageNum)) {
          upperStages.set(stageNum, { teeth: [], attachments: [], labels: [] });
        }
        const entry = upperStages.get(stageNum)!;
        const baseName = rawName.split("/").pop()!.toLowerCase();

        if (baseName === "gum.obj" || baseName.includes("gingiva")) {
          entry.gum = content;
        } else if (baseName.startsWith("tooth") || baseName.includes("teeth")) {
          entry.teeth.push(content);
        } else if (baseName.startsWith("attachment")) {
          entry.attachments = entry.attachments || [];
          entry.attachments.push(content);
        } else if (baseName.startsWith("label")) {
          entry.labels = entry.labels || [];
          entry.labels.push(content);
        } else {
          entry.combined = content;
        }
      }
    }

    // ── 2. Process Lower Arch ZIP if provided ─────────────────────────────────
    if (lowerFile) {
      onProgress(`Uncompressing Lower jaw archive (${lowerFile.name})...`, 16);
      const buf = await lowerFile.arrayBuffer();
      const filesMap = unpackZipRecursive(new Uint8Array(buf));

      for (const [rawName, content] of Object.entries(filesMap)) {
        if (rawName.endsWith("/") || rawName.includes("__MACOSX")) continue;
        const lowerName = rawName.toLowerCase();
        if (!lowerName.endsWith(".obj") && !lowerName.endsWith(".stl")) continue;

        const stageNum = parseStageFromPath(rawName);
        if (stageNum === null || stageNum === 0) continue;

        if (!lowerStages.has(stageNum)) {
          lowerStages.set(stageNum, { teeth: [], attachments: [], labels: [] });
        }
        const entry = lowerStages.get(stageNum)!;
        const baseName = rawName.split("/").pop()!.toLowerCase();

        if (baseName === "gum.obj" || baseName.includes("gingiva")) {
          entry.gum = content;
        } else if (baseName.startsWith("tooth") || baseName.includes("teeth")) {
          entry.teeth.push(content);
        } else if (baseName.startsWith("attachment")) {
          entry.attachments = entry.attachments || [];
          entry.attachments.push(content);
        } else if (baseName.startsWith("label")) {
          entry.labels = entry.labels || [];
          entry.labels.push(content);
        } else {
          entry.combined = content;
        }
      }
    }

    // ── 3. Fallback: Process single combined ZIP if provided ──────────────────
    if (singleFile) {
      onProgress(`Uncompressing CAD archive (${singleFile.name})...`, 12);
      const buf = await singleFile.arrayBuffer();
      const filesMap = unpackZipRecursive(new Uint8Array(buf));

      for (const [rawName, content] of Object.entries(filesMap)) {
        if (rawName.endsWith("/") || rawName.includes("__MACOSX")) continue;
        const lowerName = rawName.toLowerCase();
        if (!lowerName.endsWith(".obj") && !lowerName.endsWith(".stl")) continue;

        const isUpper = lowerName.includes("upper") || lowerName.includes("maxill");
        const isLower = lowerName.includes("lower") || lowerName.includes("mandib");
        if (!isUpper && !isLower) continue;

        const stageNum = parseStageFromPath(rawName);
        if (stageNum === null || stageNum === 0) continue;

        const targetMap = isUpper ? upperStages : lowerStages;
        if (!targetMap.has(stageNum)) {
          targetMap.set(stageNum, { teeth: [], attachments: [], labels: [] });
        }
        const entry = targetMap.get(stageNum)!;
        const baseName = rawName.split("/").pop()!.toLowerCase();

        if (baseName === "gum.obj" || baseName.includes("gingiva")) {
          entry.gum = content;
        } else if (baseName.startsWith("tooth") || baseName.includes("teeth")) {
          entry.teeth.push(content);
        } else if (baseName.startsWith("attachment")) {
          entry.attachments = entry.attachments || [];
          entry.attachments.push(content);
        } else if (baseName.startsWith("label")) {
          entry.labels = entry.labels || [];
          entry.labels.push(content);
        } else {
          entry.combined = content;
        }
      }
    }

    const hasUpper = upperStages.size > 0;
    const hasLower = lowerStages.size > 0;

    if (!hasUpper && !hasLower) {
      return {
        ok: false,
        error: "No recognizable orthodontic OBJ stages (gum.obj, tooth_*.obj, or stage OBJ models) found in the uploaded archives.",
      };
    }

    const archType: "both" | "upper" | "lower" =
      hasUpper && hasLower ? "both" : hasUpper ? "upper" : "lower";

    const availableStages = Array.from(
      new Set([...upperStages.keys(), ...lowerStages.keys()]),
    ).sort((a, b) => a - b);

    const totalStages = availableStages.length;
    const archDescription =
      archType === "both"
        ? "Dual-Arch (Upper & Lower)"
        : archType === "upper"
        ? "Single-Arch (Upper only)"
        : "Single-Arch (Lower only)";

    onProgress(
      `Detected ${totalStages} clinical treatment stages · ${archDescription}. Generating 3D meshes...`,
      25,
    );

    const cleanPatientName = patientName
      .replace(/\s*\[(Upper|Lower|Dual)\]/i, "")
      .trim() || "Patient Treatment";

    const dbPatientName =
      archType === "upper"
        ? `${cleanPatientName} [Upper]`
        : archType === "lower"
        ? `${cleanPatientName} [Lower]`
        : cleanPatientName;

    // Create or update case row in database with optional clinic_name, clinic_email & patient_id
    let shareToken: string;
    let existingCaseRow: any = null;

    if (isEdit) {
      const { data: foundCase } = await supabase
        .from("cases")
        .select("*")
        .eq("id", existingCaseId!)
        .single();
      existingCaseRow = foundCase;
      shareToken =
        foundCase?.share_token ||
        Array.from(crypto.getRandomValues(new Uint8Array(16)))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
      if (!doctorNotes && foundCase?.doctor_notes) doctorNotes = foundCase.doctor_notes;
      if (!ipr && foundCase?.ipr) ipr = foundCase.ipr;
      if (clinicEmail === undefined && foundCase?.clinic_email) clinicEmail = foundCase.clinic_email;
    } else {
      shareToken = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }

    // Patient ID resolution: use provided ID or auto-generate unique PT-XXXX ID
    const effectivePatientId =
      patientId?.trim() ||
      existingCaseRow?.patient_id ||
      `PT-${Math.floor(1000 + Math.random() * 9000)}`;

    const effectiveClinicEmail = clinicEmail?.trim() || undefined;

    let caseId = existingCaseId || "";

    if (isEdit) {
      const updatePayload: Record<string, unknown> = {
        patient_name: dbPatientName,
        total_stages: totalStages,
        updated_at: new Date().toISOString(),
        patient_id: effectivePatientId,
      };
      if (clinicName !== undefined) updatePayload.clinic_name = clinicName?.trim() || null;
      if (effectiveClinicEmail !== undefined) updatePayload.clinic_email = effectiveClinicEmail || null;
      if (patientAge != null && !isNaN(patientAge) && patientAge > 0) {
        updatePayload.patient_age = Math.round(patientAge);
      } else if (patientAge === null) {
        updatePayload.patient_age = null;
      }
      if (patientSex !== undefined) updatePayload.patient_sex = patientSex?.trim() || null;
      if (Array.isArray(ipr)) updatePayload.ipr = ipr;
      if (doctorNotes) {
        updatePayload.doctor_notes = {
          ...doctorNotes,
          ...(effectiveClinicEmail ? { clinic_email: effectiveClinicEmail } : {}),
        };
      } else if (effectiveClinicEmail) {
        updatePayload.doctor_notes = { clinic_email: effectiveClinicEmail };
      }

      const { data: updatedData, error: updateErr } = await supabase
        .from("cases")
        .update(updatePayload)
        .eq("id", existingCaseId!)
        .select()
        .single();

      if (
        updateErr &&
        (updateErr.message?.includes("column") ||
          updateErr.code === "PGRST204" ||
          updateErr.code === "42703")
      ) {
        delete updatePayload.clinic_email;
        const retry = await supabase
          .from("cases")
          .update(updatePayload)
          .eq("id", existingCaseId!)
          .select()
          .single();
        if (retry.error) {
          console.warn("Could not update case row in DB:", retry.error);
        }
      }
      caseId = existingCaseId!;
    } else {
      const insertPayload: Record<string, unknown> = {
        dentist_id: userId,
        patient_name: dbPatientName,
        total_stages: totalStages,
        share_token: shareToken,
        status: "ready",
        patient_id: effectivePatientId,
      };
      if (clinicName?.trim()) insertPayload.clinic_name = clinicName.trim();
      if (effectiveClinicEmail) insertPayload.clinic_email = effectiveClinicEmail;
      if (patientAge != null && !isNaN(patientAge) && patientAge > 0) {
        insertPayload.patient_age = Math.round(patientAge);
      }
      if (patientSex?.trim()) insertPayload.patient_sex = patientSex.trim();
      if (Array.isArray(ipr) && ipr.length > 0) insertPayload.ipr = ipr;
      if (doctorNotes) {
        insertPayload.doctor_notes = {
          ...doctorNotes,
          ...(effectiveClinicEmail ? { clinic_email: effectiveClinicEmail } : {}),
        };
      } else if (effectiveClinicEmail) {
        insertPayload.doctor_notes = { clinic_email: effectiveClinicEmail };
      }

      let caseRow: any = null;
      let { data: insertedData, error: caseErr } = await supabase
        .from("cases")
        .insert(insertPayload)
        .select()
        .single();

      if (
        caseErr &&
        (caseErr.message?.includes("column") ||
          caseErr.code === "PGRST204" ||
          caseErr.code === "42703")
      ) {
        delete insertPayload.clinic_email;
        const retry = await supabase.from("cases").insert(insertPayload).select().single();
        if (retry.error || !retry.data) {
          const fallbackPayload = {
            dentist_id: userId,
            patient_name: dbPatientName,
            total_stages: totalStages,
            share_token: shareToken,
            status: "ready",
          };
          const fallbackRetry = await supabase.from("cases").insert(fallbackPayload).select().single();
          if (fallbackRetry.error || !fallbackRetry.data) {
            throw new Error(`Failed to create case in database: ${fallbackRetry.error?.message || "Unknown error"}`);
          }
          caseRow = fallbackRetry.data;
        } else {
          caseRow = retry.data;
        }
      } else if (caseErr || !insertedData) {
        throw new Error(`Failed to create case in database: ${caseErr?.message || "Unknown error"}`);
      } else {
        caseRow = insertedData;
      }

      caseId = caseRow.id;
    }
    let completedSteps = 0;
    const totalSteps = totalStages * (archType === "both" ? 2 : 1);

    const archesToProcess: ("Upper" | "Lower")[] =
      archType === "both"
        ? ["Upper", "Lower"]
        : archType === "upper"
        ? ["Upper"]
        : ["Lower"];

    for (const stageNum of availableStages) {
      const pad = String(stageNum).padStart(2, "0");

      for (const arch of archesToProcess) {
        const stageData = arch === "Upper" ? upperStages.get(stageNum) : lowerStages.get(stageNum);

        if (!stageData || (!stageData.gum && stageData.teeth.length === 0 && !stageData.combined)) {
          completedSteps++;
          continue;
        }

        const stepPercent = 25 + Math.round((completedSteps / totalSteps) * 65);
        onProgress(`Processing Stage ${stageNum} ${arch} arch...`, stepPercent);

        const vertexMap = new Map<string, number>();
        const positions: number[] = [];
        const colors: number[] = [];
        const indices: number[] = [];

        // 1. Process Gum
        if (stageData.gum) {
          const text = new TextDecoder().decode(stageData.gum);
          const parsed = objLoader.parse(text);
          for (const child of parsed.children) {
            if (!(child as THREE.Mesh).isMesh) continue;
            let geom = (child as THREE.Mesh).geometry;
            geom = capPlanarOpenings(geom, arch === "Upper");
            // ClinCheck / 3Shape vascular coral-rose gingiva (#CC5C6A in linear)
            mergeGeometry(geom, 0.46, 0.085, 0.105, vertexMap, positions, colors, indices);
          }
        }

        // 2. Process Teeth
        for (const toothBytes of stageData.teeth) {
          const text = new TextDecoder().decode(toothBytes);
          const parsed = objLoader.parse(text);
          for (const child of parsed.children) {
            if (!(child as THREE.Mesh).isMesh) continue;
            const geom = (child as THREE.Mesh).geometry;
            // Warm natural ivory / beige enamel (#E8DEC8 in linear: 0.82, 0.76, 0.68)
            mergeGeometry(geom, 0.82, 0.76, 0.68, vertexMap, positions, colors, indices);
          }
        }

        // 3. Skip CAD Labels (e.g. label_01.obj, "NIYA 1", "NIYA 2") to keep models clean and aesthetic

        // 4. Process Solid / Combined Model if unsegmented
        if (stageData.combined && !stageData.gum && stageData.teeth.length === 0) {
          const text = new TextDecoder().decode(stageData.combined);
          const parsed = objLoader.parse(text);
          for (const child of parsed.children) {
            if (!(child as THREE.Mesh).isMesh) continue;
            let geom = (child as THREE.Mesh).geometry;
            geom = capPlanarOpenings(geom, arch === "Upper");
            computeAnatomicalColors(geom, { isUpper: arch === "Upper" });
            const pos = geom.getAttribute("position");
            const col = geom.getAttribute("color");
            if (pos) {
              for (let i = 0; i < pos.count; i++) {
                const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
                const key = `${Math.round(x * 1000)}_${Math.round(y * 1000)}_${Math.round(z * 1000)}`;
                let idx = vertexMap.get(key);
                if (idx === undefined) {
                  idx = positions.length / 3;
                  vertexMap.set(key, idx);
                  positions.push(x, y, z);
                  if (col) {
                    colors.push(col.getX(i), col.getY(i), col.getZ(i));
                  } else {
                    colors.push(0.82, 0.76, 0.68);
                  }
                }
                indices.push(idx);
              }
            }
          }
        }

        // 5. Process Attachments into a distinct submesh for instant toggle in 3D viewer
        const attPositions: number[] = [];
        const attColors: number[] = [];
        const attIndices: number[] = [];
        const attVertexMap = new Map<string, number>();

        if (stageData.attachments && stageData.attachments.length > 0) {
          for (const attBytes of stageData.attachments) {
            const text = new TextDecoder().decode(attBytes);
            const parsed = objLoader.parse(text);
            for (const child of parsed.children) {
              if (!(child as THREE.Mesh).isMesh) continue;
              const geom = (child as THREE.Mesh).geometry;
              // Orthodontic composite resin: vibrant clinical contrast amber-orange (#F97316: 0.96, 0.52, 0.16)
              mergeGeometry(geom, 0.96, 0.52, 0.16, attVertexMap, attPositions, attColors, attIndices);
            }
          }
        }

        const mergedGeom = new THREE.BufferGeometry();
        mergedGeom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        mergedGeom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
        mergedGeom.setIndex(indices);
        mergedGeom.computeVertexNormals();

        const mat = new THREE.MeshStandardMaterial({
          vertexColors: true,
          roughness: 0.26,
          metalness: 0.02,
        });
        const mesh = new THREE.Mesh(mergedGeom, mat);
        mesh.name = `${cleanPatientName} ${arch} jaw - ${pad} - Model`;

        const group = new THREE.Group();
        group.name = `${cleanPatientName} ${arch} jaw - ${pad}`;
        group.add(mesh);

        if (attPositions.length > 0) {
          const attGeom = new THREE.BufferGeometry();
          attGeom.setAttribute("position", new THREE.Float32BufferAttribute(attPositions, 3));
          attGeom.setAttribute("color", new THREE.Float32BufferAttribute(attColors, 3));
          attGeom.setIndex(attIndices);
          attGeom.computeVertexNormals();

          const attMesh = new THREE.Mesh(attGeom, mat);
          attMesh.name = "Attachments";
          group.add(attMesh);
        }

        const glbBuffer = (await gltfExporter.parseAsync(group, { binary: true })) as ArrayBuffer;
        const glbBlob = new Blob([glbBuffer], { type: "model/gltf-binary" });

        const filename = `${cleanPatientName} ${arch} jaw - ${pad} - Model.glb`;
        const storagePath = `${caseId}/${filename}`;

        let uploadSucceeded = false;
        let lastUploadError: { message?: string } | null = null;
        for (let attempt = 0; attempt < 3; attempt++) {
          const { error: uploadErr } = await supabase.storage
            .from("treatment-models")
            .upload(storagePath, glbBlob, {
              contentType: "model/gltf-binary",
              cacheControl: "31536000",
              upsert: true,
            });
          if (!uploadErr) {
            uploadSucceeded = true;
            break;
          }
          lastUploadError = uploadErr;
          await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
        }

        if (!uploadSucceeded) {
          throw new Error(
            `Failed uploading ${arch} stage ${stageNum} (${filename}): ${lastUploadError?.message || "Storage error"}`,
          );
        }

        completedSteps++;
      }
    }

    // ── 4. Generate & Upload case manifest.json ────────────────────────────────
    onProgress("Writing case configuration and cloud manifest...", 95);

    const baseStorage = `https://yrjulcwnabnhgtqebrtn.supabase.co/storage/v1/object/public/treatment-models/${caseId}`;

    const manifestData = {
      caseId,
      patientName: cleanPatientName,
      patientId: effectivePatientId,
      patientAge: patientAge != null && !isNaN(patientAge) && patientAge > 0 ? Math.round(patientAge) : undefined,
      patientSex: patientSex?.trim() || undefined,
      clinicName: clinicName?.trim() || undefined,
      clinicEmail: effectiveClinicEmail,
      archType,
      hasUpper,
      hasLower,
      ipr: Array.isArray(ipr) ? ipr : [],
      doctorNotes: doctorNotes || undefined,
      treatmentStages: availableStages.map((stageNum) => {
        const pad = String(stageNum).padStart(2, "0");

        let upperAsset: { filename: string; url: string } | undefined = undefined;
        let lowerAsset: { filename: string; url: string } | undefined = undefined;
        let effUpperNum: number | undefined = undefined;
        let effLowerNum: number | undefined = undefined;

        if (hasUpper) {
          const maxUpperStage = upperStages.size > 0 ? Math.max(...upperStages.keys()) : 0;
          const minUpperStage = upperStages.size > 0 ? Math.min(...upperStages.keys()) : 1;
          effUpperNum = upperStages.has(stageNum)
            ? stageNum
            : Math.max(minUpperStage, Math.min(maxUpperStage, stageNum));
          const padUpper = String(effUpperNum).padStart(2, "0");
          const upperFilename = `${cleanPatientName} Upper jaw - ${padUpper} - Model.glb`;
          upperAsset = {
            filename: upperFilename,
            url: `${baseStorage}/${encodeURIComponent(upperFilename)}`,
          };
        }

        if (hasLower) {
          const maxLowerStage = lowerStages.size > 0 ? Math.max(...lowerStages.keys()) : 0;
          const minLowerStage = lowerStages.size > 0 ? Math.min(...lowerStages.keys()) : 1;
          effLowerNum = lowerStages.has(stageNum)
            ? stageNum
            : Math.max(minLowerStage, Math.min(maxLowerStage, stageNum));
          const padLower = String(effLowerNum).padStart(2, "0");
          const lowerFilename = `${cleanPatientName} Lower jaw - ${padLower} - Model.glb`;
          lowerAsset = {
            filename: lowerFilename,
            url: `${baseStorage}/${encodeURIComponent(lowerFilename)}`,
          };
        }

        return {
          id: `stage-${pad}`,
          stageNumber: stageNum,
          upperStageNumber: effUpperNum,
          lowerStageNumber: effLowerNum,
          label: `Stage ${stageNum}`,
          doctorOnly: false,
          upper: upperAsset,
          lower: lowerAsset,
        };
      }),
      templateStages: [],
      ambiguities: [],
    };

    const manifestBlob = new Blob([JSON.stringify(manifestData, null, 2)], {
      type: "application/json",
    });

    await supabase.storage
      .from("treatment-models")
      .upload(`${caseId}/manifest.json`, manifestBlob, {
        contentType: "application/json",
        cacheControl: "0",
        upsert: true,
      });

    onProgress("Treatment case uploaded and ready!", 100);
    return {
      ok: true,
      caseId,
      shareToken,
      totalStages,
      archType,
      hasUpper,
      hasLower,
      patientId: effectivePatientId,
      patientAge: patientAge != null && !isNaN(patientAge) && patientAge > 0 ? Math.round(patientAge) : undefined,
      patientSex: patientSex?.trim() || undefined,
      clinicName: clinicName?.trim() || undefined,
      clinicEmail: effectiveClinicEmail,
    };
  } catch (err) {
    console.error("In-browser ingestion error:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

function mergeGeometry(
  geom: THREE.BufferGeometry,
  defaultR: number,
  defaultG: number,
  defaultB: number,
  vertexMap: Map<string, number>,
  positions: number[],
  colors: number[],
  indices: number[],
) {
  const pos = geom.attributes.position;
  const col = geom.attributes.color;
  if (!pos) return;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    const key = `${Math.round(x * 1000)}_${Math.round(y * 1000)}_${Math.round(z * 1000)}`;
    let idx = vertexMap.get(key);
    if (idx === undefined) {
      idx = positions.length / 3;
      vertexMap.set(key, idx);
      positions.push(x, y, z);

      if (col && i < col.count) {
        const cr = col.getX(i);
        const cg = col.getY(i);
        const cb = col.getZ(i);
        // Paint over any green CAD label markings (e.g. "NIYA 1", "NIYA 2") so gingiva is clean
        colors.push(defaultR, defaultG, defaultB);
      } else {
        colors.push(defaultR, defaultG, defaultB);
      }
    }
    indices.push(idx);
  }
}

export interface DentalZipMetadata {
  patientName: string;
  totalStages: number;
  hasUpper: boolean;
  hasLower: boolean;
  summary: string;
}

function isGenericFolderName(name: string): boolean {
  const s = name.toLowerCase().trim();
  return (
    /^\d+$/.test(s) ||
    /^(?:stage|step|segmented|template|upper|lower|models?|jaw|maxilla|mandible|archive|cad)$/i.test(s)
  );
}

export async function extractDentalZipMetadata(
  file: File,
  explicitArch?: "upper" | "lower",
): Promise<DentalZipMetadata> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);
    const topEntries = fflate.unzipSync(uint8);
    const entryKeys = Object.keys(topEntries);

    let detectedName = "";
    let hasUpper = explicitArch === "upper";
    let hasLower = explicitArch === "lower";
    const stages = new Set<number>();

    for (const rawKey of entryKeys) {
      const k = rawKey.replace(/\\/g, "/");
      const lk = k.toLowerCase();
      if (lk.includes("upper") || lk.includes("maxill")) hasUpper = true;
      if (lk.includes("lower") || lk.includes("mandib")) hasLower = true;

      const parts = k.split("/");
      const base = parts[parts.length - 1];

      if (base.toLowerCase().endsWith(".zip")) {
        const nameWithoutExt = base.replace(/\.zip$/i, "");
        const cleaned = nameWithoutExt
          .replace(/[\s_-]*(?:upper|lower|maxilla|mandible)[\s_-]*/gi, " ")
          .trim();
        if (cleaned && !isGenericFolderName(cleaned) && (!detectedName || cleaned.length > detectedName.length)) {
          detectedName = cleaned;
        }
        try {
          const innerEntries = fflate.unzipSync(topEntries[rawKey]);
          for (const rawIk of Object.keys(innerEntries)) {
            const ik = rawIk.replace(/\\/g, "/");
            const stageNum = parseStageFromPath(ik);
            if (stageNum !== null && stageNum > 0) stages.add(stageNum);
          }
        } catch {
          // ignore inner zip parse errors
        }
      } else {
        const stageNum = parseStageFromPath(k);
        if (stageNum !== null && stageNum > 0) stages.add(stageNum);
      }
    }

    // Fallback: check top-level folder names
    if (!detectedName) {
      for (const rawKey of entryKeys) {
        const k = rawKey.replace(/\\/g, "/");
        const parts = k.split("/").filter(Boolean);
        if (parts.length > 0 && !parts[0].startsWith("__") && !isGenericFolderName(parts[0])) {
          detectedName = parts[0].trim();
          break;
        }
      }
    }

    // Fallback: clean outer filename
    if (!detectedName) {
      detectedName = file.name
        .replace(/\.zip$/i, "")
        .replace(/-\d{8}T\d{6}Z.*$/i, "")
        .replace(/\s*\(\d+\)$/, "")
        .replace(/[_-]\d+$/, "")
        .replace(/[\s_-]*(?:upper|lower|maxilla|mandible|export|cad|model|models|treatment)[\s_-]*/gi, " ")
        .replace(/[_-]+/g, " ")
        .trim();
    }

    detectedName = detectedName
      .replace(/\b([a-z])/g, (_, c) => c.toUpperCase())
      .replace(/\s+/g, " ")
      .trim();

    const totalStages = stages.size || 1;
    const archLabel =
      explicitArch === "upper"
        ? "Upper Arch"
        : explicitArch === "lower"
        ? "Lower Arch"
        : hasUpper && hasLower
        ? "Upper & Lower Arches"
        : hasUpper
        ? "Upper Arch"
        : hasLower
        ? "Lower Arch"
        : "Dental Arch";

    return {
      patientName: detectedName || "Patient Treatment",
      totalStages,
      hasUpper,
      hasLower,
      summary: `${totalStages} Stages · ${archLabel}`,
    };
  } catch (err) {
    console.warn("Could not inspect zip metadata:", err);
    const cleanName = file.name
      .replace(/\.zip$/i, "")
      .replace(/-\d{8}T\d{6}Z.*$/i, "")
      .replace(/[_-]+/g, " ")
      .trim()
      .replace(/\b([a-z])/g, (_, c) => c.toUpperCase());

    return {
      patientName: cleanName || "Patient Treatment",
      totalStages: 1,
      hasUpper: explicitArch === "upper",
      hasLower: explicitArch === "lower",
      summary: explicitArch === "upper" ? "Upper Arch Archive" : explicitArch === "lower" ? "Lower Arch Archive" : "CAD Archive",
    };
  }
}
