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

export interface ClinicalToothItem {
  readonly fdi: number;
  readonly sidePrefix: "(R)" | "(L)";
  readonly toothName: string;
  readonly fullLabel: string;
  readonly isUpper: boolean;
  readonly displacementMm: number;
}

export const UPPER_TEETH_ORDER: readonly { fdi: number; sidePrefix: "(R)" | "(L)"; name: string }[] = [
  { fdi: 18, sidePrefix: "(R)", name: "Third Molar" },
  { fdi: 17, sidePrefix: "(R)", name: "Second Molar" },
  { fdi: 16, sidePrefix: "(R)", name: "First Molar" },
  { fdi: 15, sidePrefix: "(R)", name: "Second Premolar" },
  { fdi: 14, sidePrefix: "(R)", name: "First Premolar" },
  { fdi: 13, sidePrefix: "(R)", name: "Canine" },
  { fdi: 12, sidePrefix: "(R)", name: "Lateral Incisor" },
  { fdi: 11, sidePrefix: "(R)", name: "Central Incisor" },
  { fdi: 21, sidePrefix: "(L)", name: "Central Incisor" },
  { fdi: 22, sidePrefix: "(L)", name: "Lateral Incisor" },
  { fdi: 23, sidePrefix: "(L)", name: "Canine" },
  { fdi: 24, sidePrefix: "(L)", name: "First Premolar" },
  { fdi: 25, sidePrefix: "(L)", name: "Second Premolar" },
  { fdi: 26, sidePrefix: "(L)", name: "First Molar" },
  { fdi: 27, sidePrefix: "(L)", name: "Second Molar" },
  { fdi: 28, sidePrefix: "(L)", name: "Third Molar" },
];

export const LOWER_TEETH_ORDER: readonly { fdi: number; sidePrefix: "(R)" | "(L)"; name: string }[] = [
  { fdi: 38, sidePrefix: "(L)", name: "Third Molar" },
  { fdi: 37, sidePrefix: "(L)", name: "Second Molar" },
  { fdi: 36, sidePrefix: "(L)", name: "First Molar" },
  { fdi: 35, sidePrefix: "(L)", name: "Second Premolar" },
  { fdi: 34, sidePrefix: "(L)", name: "First Premolar" },
  { fdi: 33, sidePrefix: "(L)", name: "Canine" },
  { fdi: 32, sidePrefix: "(L)", name: "Lateral Incisor" },
  { fdi: 31, sidePrefix: "(L)", name: "Central Incisor" },
  { fdi: 41, sidePrefix: "(R)", name: "Central Incisor" },
  { fdi: 42, sidePrefix: "(R)", name: "Lateral Incisor" },
  { fdi: 43, sidePrefix: "(R)", name: "Canine" },
  { fdi: 44, sidePrefix: "(R)", name: "First Premolar" },
  { fdi: 45, sidePrefix: "(R)", name: "Second Premolar" },
  { fdi: 46, sidePrefix: "(R)", name: "First Molar" },
  { fdi: 47, sidePrefix: "(R)", name: "Second Molar" },
  { fdi: 48, sidePrefix: "(R)", name: "Third Molar" },
];

/**
 * Returns structured clinical tooth list with real-time displacement values.
 */
export function getClinicalToothList(
  isUpper: boolean,
  displacements?: Record<number, number> | null,
): ClinicalToothItem[] {
  const order = isUpper ? UPPER_TEETH_ORDER : LOWER_TEETH_ORDER;
  return order.map((item) => {
    const d = displacements?.[item.fdi] ?? 0;
    return {
      fdi: item.fdi,
      sidePrefix: item.sidePrefix,
      toothName: item.name,
      fullLabel: `${item.sidePrefix} ${item.name}`,
      isUpper,
      displacementMm: d,
    };
  });
}

export interface DentalContactDefinition {
  readonly contact: string;
  readonly toothA: number;
  readonly toothB: number;
  readonly label: string;
  readonly arch: "upper" | "lower";
}

export const UPPER_DENTAL_CONTACTS: readonly DentalContactDefinition[] = [
  { contact: "17-16", toothA: 17, toothB: 16, label: "17 - 16 (UR7 - UR6)", arch: "upper" },
  { contact: "16-15", toothA: 16, toothB: 15, label: "16 - 15 (UR6 - UR5)", arch: "upper" },
  { contact: "15-14", toothA: 15, toothB: 14, label: "15 - 14 (UR5 - UR4)", arch: "upper" },
  { contact: "14-13", toothA: 14, toothB: 13, label: "14 - 13 (UR4 - UR3)", arch: "upper" },
  { contact: "13-12", toothA: 13, toothB: 12, label: "13 - 12 (UR3 - UR2)", arch: "upper" },
  { contact: "12-11", toothA: 12, toothB: 11, label: "12 - 11 (UR2 - UR1)", arch: "upper" },
  { contact: "11-21", toothA: 11, toothB: 21, label: "11 - 21 (UR1 - UL1 / Midline)", arch: "upper" },
  { contact: "21-22", toothA: 21, toothB: 22, label: "21 - 22 (UL1 - UL2)", arch: "upper" },
  { contact: "22-23", toothA: 22, toothB: 23, label: "22 - 23 (UL2 - UL3)", arch: "upper" },
  { contact: "23-24", toothA: 23, toothB: 24, label: "23 - 24 (UL3 - UL4)", arch: "upper" },
  { contact: "24-25", toothA: 24, toothB: 25, label: "24 - 25 (UL4 - UL5)", arch: "upper" },
  { contact: "25-26", toothA: 25, toothB: 26, label: "25 - 26 (UL5 - UL6)", arch: "upper" },
  { contact: "26-27", toothA: 26, toothB: 27, label: "26 - 27 (UL6 - UL7)", arch: "upper" },
];

export const LOWER_DENTAL_CONTACTS: readonly DentalContactDefinition[] = [
  { contact: "47-46", toothA: 47, toothB: 46, label: "47 - 46 (LR7 - LR6)", arch: "lower" },
  { contact: "46-45", toothA: 46, toothB: 45, label: "46 - 45 (LR6 - LR5)", arch: "lower" },
  { contact: "45-44", toothA: 45, toothB: 44, label: "45 - 44 (LR5 - LR4)", arch: "lower" },
  { contact: "44-43", toothA: 44, toothB: 43, label: "44 - 43 (LR4 - LR3)", arch: "lower" },
  { contact: "43-42", toothA: 43, toothB: 42, label: "43 - 42 (LR3 - LR2)", arch: "lower" },
  { contact: "42-41", toothA: 42, toothB: 41, label: "42 - 41 (LR2 - LR1)", arch: "lower" },
  { contact: "41-31", toothA: 41, toothB: 31, label: "41 - 31 (LR1 - LL1 / Midline)", arch: "lower" },
  { contact: "31-32", toothA: 31, toothB: 32, label: "31 - 32 (LL1 - LL2)", arch: "lower" },
  { contact: "32-33", toothA: 32, toothB: 33, label: "32 - 33 (LL2 - LL3)", arch: "lower" },
  { contact: "33-34", toothA: 33, toothB: 34, label: "33 - 34 (LL3 - LL4)", arch: "lower" },
  { contact: "34-35", toothA: 34, toothB: 35, label: "34 - 35 (LL4 - LL5)", arch: "lower" },
  { contact: "35-36", toothA: 35, toothB: 36, label: "35 - 36 (LL5 - LL6)", arch: "lower" },
  { contact: "36-37", toothA: 36, toothB: 37, label: "36 - 37 (LL6 - LL7)", arch: "lower" },
];

export const ALL_DENTAL_CONTACTS: readonly DentalContactDefinition[] = [
  ...UPPER_DENTAL_CONTACTS,
  ...LOWER_DENTAL_CONTACTS,
];

/**
 * Calculates the 3D contact point between two teeth.
 * Uses real mesh centroids if available; falls back to anatomical midpoint.
 */
export function getContactPoint(
  toothA: number,
  toothB: number,
  upperCentroids?: Record<number, [number, number, number]>,
  lowerCentroids?: Record<number, [number, number, number]>,
): [number, number, number] | null {
  const isUpper = toothA < 30;
  const centroids = isUpper ? upperCentroids : lowerCentroids;
  const posA = centroids?.[toothA];
  const posB = centroids?.[toothB];

  if (posA && posB) {
    return [
      (posA[0] + posB[0]) / 2,
      (posA[1] + posB[1]) / 2,
      (posA[2] + posB[2]) / 2,
    ];
  }
  if (posA) return [posA[0], posA[1], posA[2]];
  if (posB) return [posB[0], posB[1], posB[2]];
  return null;
}

