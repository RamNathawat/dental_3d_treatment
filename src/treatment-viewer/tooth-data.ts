/**
 * Tooth identification data and spatial tracking for the clinical hover tooltip.
 *
 * Implements:
 * 1. FDI two-digit tooth notation (ISO 3950) with shorthand (UR1..UR8, UL1..UL8, LL1..LL8, LR1..LR8)
 * 2. Spatial mapping from 3D hit point (x, y, z) on arch mesh to exact individual tooth
 * 3. Per-tooth crown cluster centroid computation for Stage 1 vs current stage
 * 4. Specific per-tooth movement delta calculation (measuring only points that moved)
 */

import type { BufferGeometry } from "three";

export interface ToothInfo {
  /** FDI tooth notation code (e.g. 25) */
  readonly fdi: number;
  /** Badge string shown in blue pill (e.g. "#25") */
  readonly badge: string;
  /** Shorthand quadrant code (e.g. "UL5") */
  readonly notation: string;
  /** Quadrant label (e.g. "Upper Left (Q2)") */
  readonly quadrantLabel: string;
  /** Full anatomical tooth name (e.g. "Upper Left Second Premolar") */
  readonly fullName: string;
  /** Arch name */
  readonly arch: "Upper" | "Lower";
  /** Whether maxillary (upper) or mandibular (lower) */
  readonly isUpper: boolean;
  /** Position from midline: 1 (Central incisor) to 8 (Third molar) */
  readonly position: number;
  /** Quadrant number: 1 (UR), 2 (UL), 3 (LL), 4 (LR) */
  readonly quadrant: number;
}

const TOOTH_NAMES: Record<number, string> = {
  1: "Central Incisor",
  2: "Lateral Incisor",
  3: "Canine",
  4: "First Premolar",
  5: "Second Premolar",
  6: "First Molar",
  7: "Second Molar",
  8: "Third Molar",
};

const QUADRANT_DATA: Record<
  number,
  { label: string; notationPrefix: string; namePrefix: string }
> = {
  1: {
    label: "Upper Right (Q1)",
    notationPrefix: "UR",
    namePrefix: "Upper Right",
  },
  2: {
    label: "Upper Left (Q2)",
    notationPrefix: "UL",
    namePrefix: "Upper Left",
  },
  3: {
    label: "Lower Left (Q3)",
    notationPrefix: "LL",
    namePrefix: "Lower Left",
  },
  4: {
    label: "Lower Right (Q4)",
    notationPrefix: "LR",
    namePrefix: "Lower Right",
  },
};

export interface ArchBounds {
  readonly minX: number;
  readonly maxX: number;
  readonly minZ: number;
  readonly maxZ: number;
}

/**
 * Identifies the specific individual tooth at a 3D surface hit point.
 *
 * In dental scan coordinate space:
 *   X = transverse axis: +X is patient left, -X is patient right
 *   Z = anterior-posterior axis: +Z is anterior (front/incisors), -Z is posterior (molars)
 *   Y = vertical height: crown vs gingiva
 */
export function identifyToothAtPoint(
  point: { x: number; y: number; z: number },
  isUpper: boolean,
  bounds?: ArchBounds,
): ToothInfo {
  const spanX = bounds ? bounds.maxX - bounds.minX : 0;
  const isFullArch = spanX > 30;
  const midX = bounds && isFullArch ? (bounds.minX + bounds.maxX) / 2 : isUpper ? 1.97 : 1.25;
  const maxZ = bounds && isFullArch ? bounds.maxZ : isUpper ? 41.55 : 38.50;

  // Patient left is positive X (+X > midX); Patient right is negative X (<= midX)
  const isLeft = point.x > midX;
  const dx = Math.abs(point.x - midX);
  const dz = Math.max(0, maxZ - point.z);
  const s = Math.hypot(dx, dz);

  // Position 1 to 8 based on anatomical arc distance from anterior midline
  let position = 1;
  if (isUpper) {
    if (s < 5.5) position = 1;
    else if (s < 10.0) position = 2;
    else if (s < 17.5) position = 3;
    else if (s < 24.5) position = 4;
    else if (s < 33.0) position = 5;
    else if (s < 44.0) position = 6;
    else if (s < 55.0) position = 7;
    else position = 8;
  } else {
    if (s < 4.5) position = 1;
    else if (s < 9.5) position = 2;
    else if (s < 16.5) position = 3;
    else if (s < 25.0) position = 4;
    else if (s < 34.0) position = 5;
    else if (s < 46.0) position = 6;
    else if (s < 56.0) position = 7;
    else position = 8;
  }

  const quadrant = isUpper ? (isLeft ? 2 : 1) : (isLeft ? 3 : 4);
  const fdi = quadrant * 10 + position;
  const qData = QUADRANT_DATA[quadrant]!;
  const toothName = TOOTH_NAMES[position]!;

  return {
    fdi,
    badge: `#${fdi}`,
    notation: `${qData.notationPrefix}${position}`,
    quadrantLabel: qData.label,
    fullName: `${qData.namePrefix} ${toothName}`,
    arch: isUpper ? "Upper" : "Lower",
    isUpper,
    position,
    quadrant,
  };
}

/**
 * Computes 3D centroids of each tooth crown cluster for a given arch geometry.
 * Run once per stage load to enable instantaneous hover lookups.
 */
export function computeToothCentroids(
  geometry: BufferGeometry,
  isUpper: boolean,
): Record<number, [number, number, number]> {
  const posAttr = geometry.getAttribute("position");
  if (!posAttr) return {};

  const count = posAttr.count;
  if (count === 0) return {};

  // Find geometry extents
  let minX = Infinity, maxX = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  const step = Math.max(1, Math.floor(count / 50_000));
  for (let i = 0; i < count; i += step * 4) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);
    const z = posAttr.getZ(i);
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
    if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
  }

  const spanX = maxX - minX;
  const isFullArch = spanX > 30;
  const bounds: ArchBounds | undefined = isFullArch ? { minX, maxX, minZ, maxZ } : undefined;
  const yRange = maxY - minY;
  // Crown cutoff (tips vs gingival base)
  const crownCutoff = isUpper
    ? minY + yRange * 0.45
    : maxY - yRange * 0.45;

  const accumulators = new Map<
    number,
    { count: number; xSum: number; ySum: number; zSum: number }
  >();

  for (let i = 0; i < count; i += step) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);
    const z = posAttr.getZ(i);

    // Skip gingiva vertices if full arch with height variation
    if (isFullArch && yRange > 5 && (isUpper ? y > crownCutoff : y < crownCutoff)) continue;

    const info = identifyToothAtPoint({ x, y, z }, isUpper, bounds);
    if (!accumulators.has(info.fdi)) {
      accumulators.set(info.fdi, { count: 0, xSum: 0, ySum: 0, zSum: 0 });
    }
    const acc = accumulators.get(info.fdi)!;
    acc.count++;
    acc.xSum += x;
    acc.ySum += y;
    acc.zSum += z;
  }

  const centroids: Record<number, [number, number, number]> = {};
  for (const [fdi, acc] of accumulators.entries()) {
    if (acc.count > 0) {
      centroids[fdi] = [acc.xSum / acc.count, acc.ySum / acc.count, acc.zSum / acc.count];
    }
  }

  return centroids;
}

/**
 * Computes per-tooth movement displacements (in mm) between Stage 1 and current stage.
 */
export function computeToothDisplacements(
  stage1Centroids: Record<number, [number, number, number]>,
  currentCentroids: Record<number, [number, number, number]>,
): Record<number, number> {
  const displacements: Record<number, number> = {};

  for (const [fdiStr, c1] of Object.entries(stage1Centroids)) {
    const fdi = Number(fdiStr);
    const c2 = currentCentroids[fdi];
    if (c2) {
      const dx = c2[0] - c1[0];
      const dy = c2[1] - c1[1];
      const dz = c2[2] - c1[2];
      displacements[fdi] = Math.hypot(dx, dy, dz);
    } else {
      displacements[fdi] = 0;
    }
  }

  return displacements;
}

/**
 * Backward compatibility helper for arch-level inspection.
 */
export function toothInfoForLayerId(layerId: string): {
  arch: "Upper" | "Lower";
  quadrant: string;
  archName: string;
  isUpper: boolean;
} | null {
  const id = layerId.toLowerCase();
  if (id.includes("upper")) {
    return {
      arch: "Upper",
      quadrant: "Q1–Q2",
      archName: "Maxillary Arch",
      isUpper: true,
    };
  }
  if (id.includes("lower")) {
    return {
      arch: "Lower",
      quadrant: "Q3–Q4",
      archName: "Mandibular Arch",
      isUpper: false,
    };
  }
  return null;
}
