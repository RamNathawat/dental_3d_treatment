/**
 * Curvature-Guided Dental Segmentation and Anatomical Coloring.
 *
 * Traces the natural cervical margin (gingival sulcus) separating tooth crowns
 * from gingival gum tissue.
 *
 * Dental Anatomy Calibration:
 * 1. The dental arch follows the Curve of Spee and Curve of Wilson:
 *    Local crown peak heights Y_tip(s) are tracked along 120 angular arch sectors
 *    projected from a posterior focal center.
 * 2. True clinical crown heights:
 *    - Upper Anterior incisors: ~5.3mm - 5.6mm; Canines: ~5.8mm - 6.2mm; Molars: ~4.5mm - 5.0mm.
 *    - Lower Anterior incisors: ~4.6mm - 5.0mm; Canines: ~5.2mm - 5.6mm; Molars: ~4.0mm - 4.5mm.
 * 3. Normal-guided scalloping:
 *    - Facial tooth zeniths arch deeper away from the incisal edge.
 *    - Interdental papillae between adjacent teeth project closer toward the incisal edge.
 * 4. Realistic clinical color palette:
 *    - Teeth: Polychromatic ceramic depth from translucent incisal pearl (#f5f2ed)
 *      through mid-crown body (#ede6d6) to warm cervical neck (#e0d4bd).
 *    - Gums: Natural anatomical gingiva from delicate free margin (#c75c70)
 *      through healthy attached gingiva (#bd4d61) to deep vascular mucosa (#9e384d).
 * 5. Clean triangle coherence:
 *    - Zero horizontal color bleeding, smooth continuous margins without jagged noise.
 */

import { Float32BufferAttribute, type BufferGeometry } from "three";

export interface SegmentationOptions {
  /** Label used to determine Upper vs Lower arch (default: check for 'lower') */
  readonly isUpper?: boolean;
}

/**
 * Computes anatomical vertex colors separating tooth enamel from gingival gum tissue
 * along the true anatomical cervical margin.
 */
export function computeAnatomicalColors(
  geometry: BufferGeometry,
  labelOrOptions?: string | SegmentationOptions,
): void {
  const pos = geometry.getAttribute("position");
  if (!pos || pos.count === 0) return;

  const count = pos.count;
  const numTris = Math.floor(count / 3);

  // Determine if upper or lower arch
  let isUpper = true;
  if (typeof labelOrOptions === "string") {
    isUpper = !labelOrOptions.toLowerCase().includes("lower");
  } else if (labelOrOptions && typeof labelOrOptions.isUpper === "boolean") {
    isUpper = labelOrOptions.isUpper;
  }

  // Ensure vertex normals exist
  if (!geometry.getAttribute("normal")) {
    geometry.computeVertexNormals();
  }
  const norm = geometry.getAttribute("normal");

  // ── Realistic Clinical Palette (Matches Veer / 3Shape Reference) ───────────
  // Tooth enamel: warm natural ivory / off-white ceramic depth.
  const tipR = 0.82, tipG = 0.79, tipB = 0.72; // Incisal edge & cusp tips (warm ivory highlight)
  const midR = 0.76, midG = 0.71, midB = 0.63; // Mid-crown body (natural warm ivory/beige enamel)
  const nckR = 0.68, nckG = 0.61, nckB = 0.50; // Cervical neck warmth (natural dentin depth)
  const shdR = 0.46, shdG = 0.40, shdB = 0.32; // Interproximal shadow / fissure depth

  // Gingival tissue: natural vascular coral-rose.
  const gumMarginR = 0.68, gumMarginG = 0.18, gumMarginB = 0.24; // Free gingival margin
  const gumAttachR = 0.60, gumAttachG = 0.14, gumAttachB = 0.20; // Attached gingiva
  const gumDeepR   = 0.50, gumDeepG   = 0.10, gumDeepB   = 0.14; // Deep alveolar mucosa

  // ── Step 1: Compute Arch Extents and Center in (X, Z) ──────────────────────
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
  // Place arch focal center behind the posterior molars so angles are smooth across the entire arch
  const focalZ = minZ - 12.0;
  const maxSpanAngle = 0.95; // ~54 degrees each side

  // ── Step 2: Track Local Occlusal Crown Peak along Arch Curve ───────────────
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

  // Smooth peak Y along sectors
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

  // ── Step 3: Classify and Color Vertices along Scalloped Cervical Margin ────
  const colors = new Float32Array(count * 3);
  const isGumVertex = new Uint8Array(count);

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

    // Anatomical crown height calibration:
    // Anterior central/lateral incisors: Upper ~5.4mm, Lower ~4.8mm
    // Canines (angle ~0.25 to ~0.45 rad): Upper ~6.0mm, Lower ~5.4mm
    // Posterior premolars/molars (angle > 0.45 rad): Upper ~4.6mm, Lower ~4.1mm
    const absAngle = Math.abs(angle);
    let baseCrownHeight = isUpper ? 5.4 : 4.8;
    if (absAngle > 0.22 && absAngle < 0.46) {
      baseCrownHeight += 0.55; // Canine elevation
    } else if (absAngle >= 0.46) {
      baseCrownHeight -= 0.55; // Molar reduction
    }

    // Normal-guided scalloping:
    // Facial crown zeniths arch deeper away from incisal tip (+0.4mm)
    // Interdental papillae between adjacent teeth project closer toward tip (-0.8mm)
    const scallop = Math.max(
      -0.9,
      Math.min(
        0.5,
        0.4 * Math.max(0, nRadial) - 0.85 * Math.pow(absTangent, 1.6),
      ),
    );
    const effectiveCrownHeight = baseCrownHeight + scallop;

    // Gingival outward slope:
    // In lower jaw: gingiva slopes downward towards mandibular base (ny < 0).
    // In upper jaw: gingiva slopes upward towards maxillary base (ny > 0).
    const gingivalSlope = isUpper ? ny : -ny;
    const marginScore =
      distFromTip - effectiveCrownHeight + gingivalSlope * 0.45;

    const marginHalfWidth = 0.35; // mm transition zone

    if (marginScore < -marginHalfWidth) {
      // 100% Tooth Enamel (Polychromatic Ceramic Depth)
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
      // Interproximal contact shadow
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
      isGumVertex[i] = 0;
    } else if (marginScore > marginHalfWidth) {
      // 100% Gingiva (Realistic Vascular Coral-Rose)
      const gumDepth = distFromTip - effectiveCrownHeight;
      const gumT = Math.max(0, Math.min(1, gumDepth / 6.0));
      let r: number, g: number, b: number;
      if (gumT < 0.25) {
        const t = gumT / 0.25;
        r = gumMarginR + (gumAttachR - gumMarginR) * t;
        g = gumMarginG + (gumAttachG - gumMarginG) * t;
        b = gumMarginB + (gumAttachB - gumMarginB) * t;
      } else {
        const t = (gumT - 0.25) / 0.75;
        r = gumAttachR + (gumDeepR - gumAttachR) * t;
        g = gumAttachG + (gumDeepG - gumAttachG) * t;
        b = gumAttachB + (gumDeepB - gumAttachB) * t;
      }
      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
      isGumVertex[i] = 1;
    } else {
      // Cervical margin boundary zone
      const tMargin = (marginScore + marginHalfWidth) / (2 * marginHalfWidth);
      if (tMargin < 0.5) {
        // Tooth cervical collar
        colors[i * 3] = nckR;
        colors[i * 3 + 1] = nckG;
        colors[i * 3 + 2] = nckB;
        isGumVertex[i] = 0;
      } else {
        // Free gingival margin
        colors[i * 3] = gumMarginR;
        colors[i * 3 + 1] = gumMarginG;
        colors[i * 3 + 2] = gumMarginB;
        isGumVertex[i] = 1;
      }
    }
  }

  // ── Step 4: Ensure Triangle Coherence across Soup Vertices ─────────────────
  for (let t = 0; t < numTris; t++) {
    const i0 = t * 3;
    const i1 = i0 + 1;
    const i2 = i0 + 2;

    const g0 = isGumVertex[i0]!;
    const g1 = isGumVertex[i1]!;
    const g2 = isGumVertex[i2]!;
    const sum = g0 + g1 + g2;

    if (sum === 2) {
      // Majority gum: promote the single non-gum vertex to free gingival margin
      const target = g0 === 0 ? i0 : g1 === 0 ? i1 : i2;
      colors[target * 3] = gumMarginR;
      colors[target * 3 + 1] = gumMarginG;
      colors[target * 3 + 2] = gumMarginB;
      isGumVertex[target] = 1;
    } else if (sum === 1) {
      // Majority tooth: demote the single gum vertex to cervical neck
      const target = g0 === 1 ? i0 : g1 === 1 ? i1 : i2;
      colors[target * 3] = nckR;
      colors[target * 3 + 1] = nckG;
      colors[target * 3 + 2] = nckB;
      isGumVertex[target] = 0;
    }
  }

  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
}

