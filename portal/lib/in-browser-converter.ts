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
function capPlanarOpenings(geometry: THREE.BufferGeometry, isUpper: boolean): THREE.BufferGeometry {
  const posAttr = geometry.getAttribute("position");
  if (!posAttr) return geometry;

  const positions = posAttr.array;
  let targetPlaneY = isUpper ? -Infinity : Infinity;

  // Find planar extreme Y
  for (let i = 1; i < positions.length; i += 3) {
    const y = positions[i];
    if (isUpper) {
      if (y > targetPlaneY) targetPlaneY = y;
    } else {
      if (y < targetPlaneY) targetPlaneY = y;
    }
  }

  const boundaryEpsilon = 0.45;
  const edgeCounts = new Map<string, number>();
  const vertexCoords = new Map<string, [number, number, number]>();

  const vertexCount = posAttr.count;
  for (let i = 0; i < vertexCount; i += 3) {
    const p1 = [posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i)] as const;
    const p2 = [posAttr.getX(i + 1), posAttr.getY(i + 1), posAttr.getZ(i + 1)] as const;
    const p3 = [posAttr.getX(i + 2), posAttr.getY(i + 2), posAttr.getZ(i + 2)] as const;

    const near1 = Math.abs(p1[1] - targetPlaneY) < boundaryEpsilon;
    const near2 = Math.abs(p2[1] - targetPlaneY) < boundaryEpsilon;
    const near3 = Math.abs(p3[1] - targetPlaneY) < boundaryEpsilon;

    if (near1 && near2) recordEdge(p1, p2, edgeCounts, vertexCoords);
    if (near2 && near3) recordEdge(p2, p3, edgeCounts, vertexCoords);
    if (near3 && near1) recordEdge(p3, p1, edgeCounts, vertexCoords);
  }

  const boundaryPoints: [number, number, number][] = [];
  for (const [key, count] of edgeCounts.entries()) {
    if (count === 1) {
      const pt = vertexCoords.get(key.split("::")[0]);
      if (pt) boundaryPoints.push(pt);
    }
  }

  if (boundaryPoints.length < 3) return geometry;

  let sumX = 0;
  let sumZ = 0;
  for (const pt of boundaryPoints) {
    sumX += pt[0];
    sumZ += pt[2];
  }
  const centroid: [number, number, number] = [
    sumX / boundaryPoints.length,
    targetPlaneY,
    sumZ / boundaryPoints.length,
  ];

  const sorted = boundaryPoints.slice().sort((a, b) => {
    return Math.atan2(a[2] - centroid[2], a[0] - centroid[0]) -
           Math.atan2(b[2] - centroid[2], b[0] - centroid[0]);
  });

  const newPos: number[] = Array.from(positions);
  const colorAttr = geometry.getAttribute("color");
  const newCol: number[] = colorAttr ? Array.from(colorAttr.array) : [];
  const gumR = 0.792, gumG = 0.565, gumB = 0.565;

  for (let i = 0; i < sorted.length; i++) {
    const pCur = sorted[i];
    const pNext = sorted[(i + 1) % sorted.length];

    if (isUpper) {
      newPos.push(centroid[0], centroid[1], centroid[2]);
      newPos.push(pCur[0], pCur[1], pCur[2]);
      newPos.push(pNext[0], pNext[1], pNext[2]);
    } else {
      newPos.push(centroid[0], centroid[1], centroid[2]);
      newPos.push(pNext[0], pNext[1], pNext[2]);
      newPos.push(pCur[0], pCur[1], pCur[2]);
    }

    if (colorAttr) {
      for (let k = 0; k < 3; k++) {
        newCol.push(gumR, gumG, gumB);
      }
    }
  }

  const capped = new THREE.BufferGeometry();
  capped.setAttribute("position", new THREE.Float32BufferAttribute(newPos, 3));
  if (colorAttr) {
    capped.setAttribute("color", new THREE.Float32BufferAttribute(newCol, 3));
  }
  capped.computeVertexNormals();
  return capped;
}

function recordEdge(
  p1: readonly [number, number, number],
  p2: readonly [number, number, number],
  edgeCounts: Map<string, number>,
  coords: Map<string, [number, number, number]>,
) {
  const k1 = `${Math.round(p1[0] * 100)}_${Math.round(p1[2] * 100)}`;
  const k2 = `${Math.round(p2[0] * 100)}_${Math.round(p2[2] * 100)}`;
  if (k1 === k2) return;
  coords.set(k1, [p1[0], p1[1], p1[2]]);
  coords.set(k2, [p2[0], p2[1], p2[2]]);
  const edgeKey = k1 < k2 ? `${k1}::${k2}` : `${k2}::${k1}`;
  edgeCounts.set(edgeKey, (edgeCounts.get(edgeKey) || 0) + 1);
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
            mergeGeometry(geom, 0.792, 0.565, 0.565, vertexMap, positions, colors, indices);
          }
        }

        // 2. Process Teeth
        for (const toothBytes of stageData.teeth) {
          const text = new TextDecoder().decode(toothBytes);
          const parsed = objLoader.parse(text);
          for (const child of parsed.children) {
            if (!(child as THREE.Mesh).isMesh) continue;
            const geom = (child as THREE.Mesh).geometry;
            mergeGeometry(geom, 1.0, 1.0, 1.0, vertexMap, positions, colors, indices);
          }
        }

        const mergedGeom = new THREE.BufferGeometry();
        mergedGeom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        mergedGeom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
        mergedGeom.setIndex(indices);
        mergedGeom.computeVertexNormals();

        const mat = new THREE.MeshStandardMaterial({
          vertexColors: true,
          roughness: 0.35,
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
        colors.push(col.getX(i), col.getY(i), col.getZ(i));
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

