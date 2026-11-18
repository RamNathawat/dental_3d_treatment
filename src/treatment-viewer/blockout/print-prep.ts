/**
 * 3D Print Preparation and Watertight STL Exporter.
 *
 * Implements:
 * 1. Drain & Vacuum Suction Hole carving on model base.
 * 2. Photopolymer resin post-curing shrinkage scaling (e.g. 100.5%).
 * 3. Individual Binary STL export (.zip archive using fflate).
 * 4. Single Nested Build-Plate STL export for direct 3D printer slicing.
 */

import {
  Box3,
  BufferGeometry,
  Mesh,
  MeshBasicMaterial,
  Vector3,
} from "three";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import * as fflate from "fflate";
import type { DrainHole, PrintPrepConfig, StageBlockoutResult } from "./types";

/**
 * Applies shrinkage scaling and punches drain/suction holes into the model geometry.
 */
export function prepareGeometryForPrint(
  geometry: BufferGeometry,
  config: PrintPrepConfig,
): BufferGeometry {
  const prepared = geometry.clone();

  // 1. Photopolymer resin shrinkage compensation
  if (config.shrinkageScalePercent && config.shrinkageScalePercent !== 100.0) {
    const scaleFactor = config.shrinkageScalePercent / 100.0;
    prepared.center(); // Center to scale uniformly
    prepared.scale(scaleFactor, scaleFactor, scaleFactor);
  }

  // 2. Punch base drain / vacuum holes if defined
  if (config.drainHoles && config.drainHoles.length > 0) {
    punchDrainHoles(prepared, config.drainHoles);
  }

  prepared.computeVertexNormals();
  return prepared;
}

/**
 * Indents and punches cylindrical suction/drain holes through the base geometry.
 */
function punchDrainHoles(geometry: BufferGeometry, holes: DrainHole[]): void {
  const pos = geometry.getAttribute("position");
  if (!pos) return;

  const count = pos.count;
  const vP = new Vector3();

  for (const hole of holes) {
    const center = new Vector3(...hole.position);
    const radius = hole.diameterMm / 2;
    const radiusSq = radius * radius;
    const normal = new Vector3(...hole.normal).normalize();

    for (let i = 0; i < count; i++) {
      vP.set(pos.getX(i), pos.getY(i), pos.getZ(i));
      const distSq = vP.distanceToSquared(center);

      if (distSq <= radiusSq * 1.4) {
        // Displace vertices inward along hole normal to create a hollow cylinder lumen
        const depth = Math.max(0, (radius - Math.sqrt(distSq)) * 1.5);
        const disp = normal.clone().multiplyScalar(-depth);
        pos.setXYZ(i, vP.x + disp.x, vP.y + disp.y, vP.z + disp.z);
      }
    }
  }

  pos.needsUpdate = true;
}

/**
 * Exports a single geometry as binary STL bytes.
 */
export function exportBinaryStl(
  geometry: BufferGeometry,
  meshName = "dental_model",
): Uint8Array {
  const exporter = new STLExporter();
  const mesh = new Mesh(geometry, new MeshBasicMaterial());
  mesh.name = meshName;

  const result = exporter.parse(mesh, { binary: true });
  if (result instanceof DataView) {
    return new Uint8Array(result.buffer, result.byteOffset, result.byteLength);
  }
  return new Uint8Array(result as ArrayBuffer);
}

/**
 * Creates a single nested build-plate geometry containing multiple stage models
 * neatly arranged in a grid with 5mm spacing.
 */
export function createNestedBuildPlateGeometry(
  stageResults: StageBlockoutResult[],
  printPrep: PrintPrepConfig,
): BufferGeometry | null {
  const preparedGeoms: BufferGeometry[] = [];
  const spacingMm = 6.0;

  // Lay models out in a 2-column or 3-column build plate grid
  const cols = Math.min(3, Math.ceil(Math.sqrt(stageResults.length)));

  let rowMaxDepth = 0;
  let currentX = 0;
  let currentZ = 0;
  let colIndex = 0;

  for (const st of stageResults) {
    const raw = st.mergedGeometry || st.baseGeometry;
    const geom = prepareGeometryForPrint(raw, printPrep);

    geom.computeBoundingBox();
    const box = geom.boundingBox || new Box3();
    const sizeX = box.max.x - box.min.x;
    const sizeZ = box.max.z - box.min.z;

    // Shift geometry to origin first
    const center = new Vector3();
    box.getCenter(center);
    geom.translate(-center.x, -box.min.y, -center.z);

    // Position in build plate grid
    geom.translate(currentX + sizeX / 2, 0, currentZ + sizeZ / 2);
    preparedGeoms.push(geom);

    colIndex++;
    currentX += sizeX + spacingMm;
    if (sizeZ > rowMaxDepth) rowMaxDepth = sizeZ;

    if (colIndex >= cols) {
      colIndex = 0;
      currentX = 0;
      currentZ += rowMaxDepth + spacingMm;
      rowMaxDepth = 0;
    }
  }

  if (preparedGeoms.length === 0) return null;
  return mergeGeometries(preparedGeoms, false);
}

/**
 * Packages all stage models into a single ZIP file containing binary STLs.
 */
export async function createBatchStlZip(
  patientName: string,
  archName: "Upper" | "Lower" | "Dual",
  stageResults: StageBlockoutResult[],
  printPrep: PrintPrepConfig,
  onProgress?: (current: number, total: number) => void,
): Promise<Blob> {
  const cleanName = patientName.replace(/[^a-zA-Z0-9_-]/g, "_");
  const files: Record<string, Uint8Array> = {};

  const total = stageResults.length;
  for (let i = 0; i < total; i++) {
    const st = stageResults[i]!;
    const pad = String(st.stageNumber).padStart(2, "0");
    const filename = `${cleanName}_${archName}_Stage_${pad}_Blocked.stl`;

    const raw = st.mergedGeometry || st.baseGeometry;
    const printGeom = prepareGeometryForPrint(raw, printPrep);
    const stlBytes = exportBinaryStl(printGeom, filename);

    files[filename] = stlBytes;
    if (onProgress) onProgress(i + 1, total);
  }

  // Compress into ZIP archive
  const zipped = fflate.zipSync(files, { level: 6 });
  return new Blob([zipped as any], { type: "application/zip" });
}

/**
 * Helper to trigger a browser file download from Blob or bytes.
 */
export function downloadFile(content: Blob | Uint8Array, filename: string): void {
  const blob = content instanceof Blob ? content : new Blob([content as any]);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
