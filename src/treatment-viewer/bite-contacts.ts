import { BufferAttribute, type BufferGeometry } from "three";

export interface BiteContactsResult {
  readonly heavyCount: number;
  readonly mediumCount: number;
  readonly lightCount: number;
}

const CELL_SIZE_MM = 0.6;
const GRID_SIZE = 160;

/**
 * Calculates occlusal clearance between upper and lower dental meshes and applies
 * real-time vertex colors (Red = Heavy <0.25mm, Amber = Medium <0.6mm, Green = Light <1.0mm, Ivory = Clear).
 */
export function applyBiteContacts(
  upperGeometry: BufferGeometry,
  lowerGeometry: BufferGeometry,
): BiteContactsResult {
  const upperPos = upperGeometry.getAttribute("position");
  const lowerPos = lowerGeometry.getAttribute("position");

  if (!upperPos || !lowerPos) {
    return { heavyCount: 0, mediumCount: 0, lightCount: 0 };
  }

  // 1. Build a 2D heightmap for the lower surface (occlusal table) of the upper jaw
  const minX = -40;
  const minZ = -25;
  const heightMap = new Float32Array(GRID_SIZE * GRID_SIZE).fill(999);

  const uCount = upperPos.count;
  for (let i = 0; i < uCount; i++) {
    const ux = upperPos.getX(i);
    const uy = upperPos.getY(i);
    const uz = upperPos.getZ(i);

    const gx = Math.floor((ux - minX) / CELL_SIZE_MM);
    const gz = Math.floor((uz - minZ) / CELL_SIZE_MM);
    if (gx >= 0 && gx < GRID_SIZE && gz >= 0 && gz < GRID_SIZE) {
      const idx = gz * GRID_SIZE + gx;
      if (uy < heightMap[idx]!) {
        heightMap[idx] = uy;
      }
    }
  }

  // 2. Prepare color buffers: copy existing anatomical colors if present, otherwise default to ivory
  const existingLowerColors = lowerGeometry.getAttribute("color");
  const lCount = lowerPos.count;
  const lowerColors = new Float32Array(lCount * 3);
  const IVORY_R = 0.91;
  const IVORY_G = 0.88;
  const IVORY_B = 0.84;

  if (existingLowerColors && existingLowerColors.count === lCount) {
    for (let i = 0; i < lCount * 3; i++) {
      lowerColors[i] = existingLowerColors.array[i]!;
    }
  } else {
    for (let i = 0; i < lCount; i++) {
      lowerColors[i * 3] = IVORY_R;
      lowerColors[i * 3 + 1] = IVORY_G;
      lowerColors[i * 3 + 2] = IVORY_B;
    }
  }

  let heavy = 0;
  let medium = 0;
  let light = 0;

  for (let i = 0; i < lCount; i++) {
    const lx = lowerPos.getX(i);
    const ly = lowerPos.getY(i);
    const lz = lowerPos.getZ(i);

    const gx = Math.floor((lx - minX) / CELL_SIZE_MM);
    const gz = Math.floor((lz - minZ) / CELL_SIZE_MM);

    if (gx >= 0 && gx < GRID_SIZE && gz >= 0 && gz < GRID_SIZE) {
      const uy = heightMap[gz * GRID_SIZE + gx]!;
      if (uy < 900) {
        // Vertical clearance along biting axis
        const dist = Math.abs(uy - ly);
        const cIdx = i * 3;
        if (dist <= 0.25) {
          // Heavy contact / collision: Vivid Crimson Red
          lowerColors[cIdx] = 0.94;
          lowerColors[cIdx + 1] = 0.22;
          lowerColors[cIdx + 2] = 0.22;
          heavy++;
        } else if (dist <= 0.6) {
          // Medium contact: Vivid Amber / Yellow
          lowerColors[cIdx] = 0.96;
          lowerColors[cIdx + 1] = 0.65;
          lowerColors[cIdx + 2] = 0.08;
          medium++;
        } else if (dist <= 1.0) {
          // Light proximity: Mint / Emerald Teal
          lowerColors[cIdx] = 0.12;
          lowerColors[cIdx + 1] = 0.76;
          lowerColors[cIdx + 2] = 0.52;
          light++;
        }
      }
    }
  }

  // 3. Attach vertex color attribute to lower geometry
  lowerGeometry.setAttribute("color", new BufferAttribute(lowerColors, 3));
  lowerGeometry.attributes["color"]!.needsUpdate = true;

  // 4. Also build lower jaw peak heightmap to color the upper jaw contact points
  const lowerPeakMap = new Float32Array(GRID_SIZE * GRID_SIZE).fill(-999);
  for (let i = 0; i < lCount; i++) {
    const lx = lowerPos.getX(i);
    const ly = lowerPos.getY(i);
    const lz = lowerPos.getZ(i);

    const gx = Math.floor((lx - minX) / CELL_SIZE_MM);
    const gz = Math.floor((lz - minZ) / CELL_SIZE_MM);
    if (gx >= 0 && gx < GRID_SIZE && gz >= 0 && gz < GRID_SIZE) {
      const idx = gz * GRID_SIZE + gx;
      if (ly > lowerPeakMap[idx]!) {
        lowerPeakMap[idx] = ly;
      }
    }
  }

  const existingUpperColors = upperGeometry.getAttribute("color");
  const upperColors = new Float32Array(uCount * 3);
  if (existingUpperColors && existingUpperColors.count === uCount) {
    for (let i = 0; i < uCount * 3; i++) {
      upperColors[i] = existingUpperColors.array[i]!;
    }
  } else {
    for (let i = 0; i < uCount; i++) {
      upperColors[i * 3] = IVORY_R;
      upperColors[i * 3 + 1] = IVORY_G;
      upperColors[i * 3 + 2] = IVORY_B;
    }
  }

  for (let i = 0; i < uCount; i++) {
    const ux = upperPos.getX(i);
    const uy = upperPos.getY(i);
    const uz = upperPos.getZ(i);

    const gx = Math.floor((ux - minX) / CELL_SIZE_MM);
    const gz = Math.floor((uz - minZ) / CELL_SIZE_MM);

    if (gx >= 0 && gx < GRID_SIZE && gz >= 0 && gz < GRID_SIZE) {
      const ly = lowerPeakMap[gz * GRID_SIZE + gx]!;
      if (ly > -900) {
        const dist = Math.abs(uy - ly);
        const cIdx = i * 3;
        if (dist <= 0.25) {
          upperColors[cIdx] = 0.94;
          upperColors[cIdx + 1] = 0.22;
          upperColors[cIdx + 2] = 0.22;
        } else if (dist <= 0.6) {
          upperColors[cIdx] = 0.96;
          upperColors[cIdx + 1] = 0.65;
          upperColors[cIdx + 2] = 0.08;
        } else if (dist <= 1.0) {
          upperColors[cIdx] = 0.12;
          upperColors[cIdx + 1] = 0.76;
          upperColors[cIdx + 2] = 0.52;
        }
      }
    }
  }

  upperGeometry.setAttribute("color", new BufferAttribute(upperColors, 3));
  upperGeometry.attributes["color"]!.needsUpdate = true;

  return { heavyCount: heavy, mediumCount: medium, lightCount: light };
}
