import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import * as fflate from "fflate";
import { createClient } from "@/lib/supabase/client";

export interface ProgressCallback {
  (step: string, percent: number): void;
}

export interface IngestResult {
  ok: boolean;
  caseId?: string;
  shareToken?: string;
  totalStages?: number;
  error?: string;
}

/**
 * Plans and seals the open planar boundary of the dental model.
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

/**
 * Plans and seals the open planar boundary of the dental model using
 * exact polygon triangulation (Earcut). Properly handles horseshoe/concave arches.
 */
function capPlanarOpenings(
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
 * Ingests a Maestro 3D export ZIP entirely in the browser:
 * 1. Unzips in memory
 * 2. Parses OBJ files (teeth & gums)
 * 3. Caches & caps planar roofs/bases
 * 4. Exports optimized GLB
 * 5. Uploads to Supabase Storage
 * 6. Creates case database row
 */
export async function processDentalZipInBrowser(
  file: File,
  patientName: string,
  userId: string,
  onProgress: ProgressCallback,
): Promise<IngestResult> {
  const supabase = createClient();
  const objLoader = new OBJLoader();
  const gltfExporter = new GLTFExporter();

  try {
    onProgress("Reading ZIP archive...", 5);
    const arrayBuffer = await file.arrayBuffer();
    const zipBytes = new Uint8Array(arrayBuffer);

    onProgress("Uncompressing CAD models in memory...", 15);
    const unzipped = fflate.unzipSync(zipBytes);

    // Support nested ZIP files (e.g. archives containing Upper.zip & Lower.zip)
    const allFilesMap: Record<string, Uint8Array> = {};
    for (const [name, content] of Object.entries(unzipped)) {
      if (name.toLowerCase().endsWith(".zip")) {
        try {
          const nested = fflate.unzipSync(content);
          for (const [nestedName, nestedContent] of Object.entries(nested)) {
            allFilesMap[`${name}/${nestedName}`] = nestedContent;
          }
        } catch (e) {
          console.warn("Could not unpack nested ZIP:", name, e);
        }
      } else {
        allFilesMap[name] = content;
      }
    }

    const filenames = Object.keys(allFilesMap);
    if (filenames.length === 0) {
      return { ok: false, error: "The provided ZIP file is empty." };
    }

    // Group files by stage and jaw
    interface StageFiles {
      gum?: Uint8Array;
      teeth: Uint8Array[];
    }
    const upperStages = new Map<number, StageFiles>();
    const lowerStages = new Map<number, StageFiles>();

    for (const rawName of filenames) {
      if (rawName.endsWith("/") || rawName.includes("__MACOSX")) continue;
      const lowerName = rawName.toLowerCase();
      if (!lowerName.endsWith(".obj")) continue;

      const isUpper = lowerName.includes("upper") || lowerName.includes("maxill");
      const isLower = lowerName.includes("lower") || lowerName.includes("mandib");
      if (!isUpper && !isLower) continue;

      const parts = rawName.split("/");
      const folder = parts[parts.length - 2] || "";

      // Extract stage number (e.g. "01", "02", "1", "Stage 1")
      const folderMatch = folder.match(/^0*(\d{1,2})$/);
      let stageNum: number | null = null;
      if (folderMatch) {
        stageNum = parseInt(folderMatch[1], 10);
      } else {
        const stageMatch = rawName.match(/(?:stage|step|[\/\s_-])0*(\d{1,2})(?:[\/\s_-]|$)/i);
        if (stageMatch) {
          stageNum = parseInt(stageMatch[1], 10);
        }
      }

      if (stageNum === null || stageNum === 0) continue;

      const targetMap = isUpper ? upperStages : lowerStages;
      if (!targetMap.has(stageNum)) {
        targetMap.set(stageNum, { teeth: [] });
      }
      const entry = targetMap.get(stageNum)!;

      const baseName = parts[parts.length - 1].toLowerCase();
      if (baseName === "gum.obj" || baseName.includes("gingiva")) {
        entry.gum = allFilesMap[rawName];
      } else if (baseName.startsWith("tooth") || baseName.includes("teeth")) {
        entry.teeth.push(allFilesMap[rawName]);
      }
    }

    const availableStages = Array.from(
      new Set([...upperStages.keys(), ...lowerStages.keys()]),
    ).sort((a, b) => a - b);

    if (availableStages.length === 0) {
      return {
        ok: false,
        error: "No recognizable orthodontic OBJ stages (gum.obj, tooth_*.obj) found in the ZIP.",
      };
    }

    const totalStages = availableStages.length;
    onProgress(`Found ${totalStages} clinical treatment stages. Processing 3D geometries...`, 25);

    // Create case row in database
    const shareToken = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const { data: caseRow, error: caseErr } = await supabase
      .from("cases")
      .insert({
        dentist_id: userId,
        patient_name: patientName.trim() || file.name.replace(/\.zip$/i, ""),
        total_stages: totalStages,
        share_token: shareToken,
        status: "ready",
      })
      .select()
      .single();

    if (caseErr || !caseRow) {
      throw new Error(`Failed to create case in database: ${caseErr?.message || "Unknown error"}`);
    }

    const caseId = caseRow.id;
    let completedSteps = 0;
    const totalSteps = totalStages * 2; // upper & lower

    for (const stageNum of availableStages) {
      const pad = String(stageNum).padStart(2, "0");

      for (const arch of ["Upper", "Lower"] as const) {
        const stageData = arch === "Upper" ? upperStages.get(stageNum) : lowerStages.get(stageNum);

        if (!stageData || (!stageData.gum && stageData.teeth.length === 0)) {
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
            // ClinCheck / 3Shape natural healthy vascular coral-rose gingiva (#CC5C6A in linear)
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
            // Pristine natural pearlescent enamel (#E1E0DF in linear)
            mergeGeometry(geom, 0.76, 0.74, 0.72, vertexMap, positions, colors, indices);
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
        mesh.name = `${patientName} ${arch} jaw - ${pad} - Model`;

        const glbBuffer = (await gltfExporter.parseAsync(mesh, { binary: true })) as ArrayBuffer;
        const glbBlob = new Blob([glbBuffer], { type: "model/gltf-binary" });

        const filename = `${patientName} ${arch} jaw - ${pad} - Model.glb`;
        const storagePath = `${caseId}/${filename}`;

        const { error: uploadErr } = await supabase.storage
          .from("treatment-models")
          .upload(storagePath, glbBlob, {
            contentType: "model/gltf-binary",
            cacheControl: "31536000",
            upsert: true,
          });

        if (uploadErr) {
          console.warn(`Warning: failed uploading ${storagePath}:`, uploadErr);
        }

        completedSteps++;
      }
    }

    onProgress("Finalizing treatment case...", 100);
    return {
      ok: true,
      caseId,
      shareToken,
      totalStages,
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
        // Preserve distinct green CAD labels or attachment markings (e.g., "NIYA 1", "NIYA 2")
        if (cg > 0.40 && cg > cr * 1.30) {
          colors.push(cr, cg, cb);
        } else {
          // Standardize all gums & teeth to calibrated ClinCheck / 3Shape aesthetics
          colors.push(defaultR, defaultG, defaultB);
        }
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

export async function extractDentalZipMetadata(file: File): Promise<DentalZipMetadata> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);
    const topEntries = fflate.unzipSync(uint8);
    const entryKeys = Object.keys(topEntries);

    let detectedName = "";
    let hasUpper = false;
    let hasLower = false;
    const stages = new Set<number>();

    for (const k of entryKeys) {
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
          const innerEntries = fflate.unzipSync(topEntries[k]);
          for (const ik of Object.keys(innerEntries)) {
            const match = ik.match(/(?:^|\/)0*(\d{1,2})(?:\/|$)/);
            if (match) stages.add(parseInt(match[1], 10));
          }
        } catch {
          // ignore inner zip parse errors
        }
      } else {
        const match = k.match(/(?:^|\/)0*(\d{1,2})(?:\/|$)/);
        if (match) stages.add(parseInt(match[1], 10));
      }
    }

    // Fallback: check top-level folder names
    if (!detectedName) {
      for (const k of entryKeys) {
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
        .replace(/-\d{8}T\d{6}Z.*$/i, "") // Google Drive download timestamp
        .replace(/\s*\(\d+\)$/, "")      // Browser duplicate (1)
        .replace(/[_-]\d+$/, "")         // trailing id
        .replace(/[\s_-]*(?:upper|lower|maxilla|mandible|export|cad|model|models|treatment)[\s_-]*/gi, " ")
        .replace(/[_-]+/g, " ")
        .trim();
    }

    // Clean formatting and title case
    detectedName = detectedName
      .replace(/\b([a-z])/g, (_, c) => c.toUpperCase())
      .replace(/\s+/g, " ")
      .trim();

    const totalStages = stages.size || 1;
    const archLabel =
      hasUpper && hasLower
        ? "Upper & Lower Arches"
        : hasUpper
        ? "Upper Arch"
        : hasLower
        ? "Lower Arch"
        : "Dental Arches";

    return {
      patientName: detectedName || "Patient Treatment",
      totalStages,
      hasUpper,
      hasLower,
      summary: `${totalStages} Aligner Stages · ${archLabel}`,
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
      hasUpper: false,
      hasLower: false,
      summary: "Direct CAD Archive",
    };
  }
}

