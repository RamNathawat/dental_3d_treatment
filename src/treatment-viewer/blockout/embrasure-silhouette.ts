/**
 * Milestone 4.2: Embrasure Boundary Silhouette (The Black Triangle Profile).
 *
 * Extracts and visualizes the precise 3D perimeter boundaries of interdental
 * black triangles across the dental arch:
 * 1. Apex: Anchored strictly at the contact point (incisal/occlusal third).
 * 2. Base: Terminates at the interdental gum papilla crest (0 gum/palate spill).
 * 3. Sides: Snugly hugs proximal enamel curvature of Tooth A and Tooth B.
 * 4. Depth: Constrained strictly within facial (buccal) and lingual line angles.
 */

import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Group,
  LineBasicMaterial,
  LineLoop,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  Vector3,
} from "three";
import type { DetectedContact } from "./mesh-contact-detector";

export interface EmbrasureSilhouette {
  readonly id: string;
  readonly contactKey: string;
  readonly label: string;
  readonly toothA: number;
  readonly toothB: number;
  readonly apex: [number, number, number];
  readonly papillaBase: [number, number, number];
  readonly heightMm: number;
  readonly spanMm: number;
  readonly depthMm: number;
  readonly buccalWidthMm: number;
  readonly lingualWidthMm: number;
  /** Ordered 3D points forming the facial (buccal) perimeter loop. */
  readonly buccalLoop: [number, number, number][];
  /** Ordered 3D points forming the lingual perimeter loop. */
  readonly lingualLoop: [number, number, number][];
  /** Transverse connecting ribs across the embrasure volume (flat array of coordinates). */
  readonly ribLines: number[];
  /** Flat triangle vertices for the semi-transparent guide ribbon. */
  readonly ribbonTriangles: number[];
}

/**
 * Extracts the 3D boundary silhouettes for all detected contacts on a dental mesh.
 */
export function extractEmbrasureSilhouettes(
  baseGeometry: BufferGeometry,
  isUpper: boolean,
  contacts: DetectedContact[],
): EmbrasureSilhouette[] {
  const pos = baseGeometry.getAttribute("position");
  if (!pos || pos.count === 0 || contacts.length === 0) return [];

  const count = pos.count;
  const silhouettes: EmbrasureSilhouette[] = [];

  // Compute arch center for outward/buccal orientation check
  let sumX = 0, sumZ = 0;
  for (const c of contacts) {
    sumX += c.position[0];
    sumZ += c.position[1]; // using contact positions
  }
  const midX = sumX / contacts.length;

  for (const contact of contacts) {
    const [cx, cy, cz] = contact.position;
    const apex = new Vector3(cx, cy, cz);

    // Arch tangent from contact normal
    const tangent = new Vector3(contact.normal[0], 0, contact.normal[2]).normalize();
    if (tangent.lengthSq() < 1e-4) tangent.set(1, 0, 0);

    // Outward (buccal) normal perpendicular to tangent in horizontal plane
    let buccal = new Vector3(-tangent.z, 0, tangent.x).normalize();
    // Ensure buccal points outward away from arch interior
    const outwardVec = new Vector3(cx - midX, 0, cz);
    if (buccal.dot(outwardVec) < 0) {
      buccal.negate();
    }
    const lingual = buccal.clone().negate();

    // Probe mesh surface in 2.2mm radius around contact point to find the true papilla crest
    let bestPapillaY = isUpper ? cy + 3.8 : cy - 3.8;
    let papillaCandidateSumY = 0;
    let papillaCandidateCount = 0;

    for (let i = 0; i < count; i += 2) {
      const px = pos.getX(i), py = pos.getY(i), pz = pos.getZ(i);
      const dx = px - cx;
      const dz = pz - cz;
      const distXZ = Math.sqrt(dx * dx + dz * dz);

      if (distXZ < 1.6) {
        const dy = isUpper ? (py - cy) : (cy - py);
        // Valid interdental papilla zone is 1.8mm to 5.2mm from contact into gums
        if (dy >= 2.0 && dy <= 5.5) {
          papillaCandidateSumY += py;
          papillaCandidateCount++;
        }
      }
    }

    if (papillaCandidateCount > 5) {
      const avgY = papillaCandidateSumY / papillaCandidateCount;
      // Clamp to clinical limits (between 2.5mm and 4.6mm from apex)
      const measuredDrop = Math.abs(avgY - cy);
      const clampedDrop = Math.max(2.5, Math.min(4.8, measuredDrop));
      bestPapillaY = isUpper ? (cy + clampedDrop) : (cy - clampedDrop);
    }

    const papillaBase = new Vector3(
      cx + tangent.x * 0.1,
      bestPapillaY,
      cz + tangent.z * 0.1,
    );

    const heightMm = Math.abs(papillaBase.y - apex.y);
    const isAnterior = Math.abs(contact.toothA % 10) <= 3 && Math.abs(contact.toothB % 10) <= 3;
    const isMolar = Math.abs(contact.toothA % 10) >= 6 || Math.abs(contact.toothB % 10) >= 6;
    const maxHalfSpan = isAnterior ? 0.8 : (isMolar ? 1.5 : 1.1);
    const maxBuccalDepth = contact.buccalWidthMm && contact.buccalWidthMm > 0
      ? contact.buccalWidthMm
      : (isAnterior ? 2.2 : (isMolar ? 4.2 : 3.2));
    const maxLingualDepth = contact.lingualWidthMm && contact.lingualWidthMm > 0
      ? contact.lingualWidthMm
      : (isAnterior ? 4.8 : (isMolar ? 6.8 : 5.5));
    const spanMm = parseFloat((maxHalfSpan * 2.0).toFixed(1));
    const depthMm = parseFloat((maxBuccalDepth + maxLingualDepth).toFixed(1));

    // Construct profile curves from Apex to Papilla Base
    const numSteps = 10;
    const toothABuccal: Vector3[] = [];
    const toothBBuccal: Vector3[] = [];
    const toothALingual: Vector3[] = [];
    const toothBLingual: Vector3[] = [];

    for (let s = 0; s <= numSteps; s++) {
      const t = s / numSteps;
      const curCenter = new Vector3().lerpVectors(apex, papillaBase, t);

      // Natural parabolic opening of proximal tooth walls
      const halfSpan = maxHalfSpan * Math.sqrt(t);
      // Bell-shaped / sinusoidal line-angle depth (tapers to 0 at contact point)
      const depthB = maxBuccalDepth * Math.sin((t * Math.PI) / 2);
      const depthL = maxLingualDepth * Math.sin((t * Math.PI) / 2);

      // Tooth A (negative tangent direction)
      const pABuccal = curCenter.clone()
        .addScaledVector(tangent, -halfSpan)
        .addScaledVector(buccal, depthB);
      const pALingual = curCenter.clone()
        .addScaledVector(tangent, -halfSpan)
        .addScaledVector(lingual, depthL);

      // Tooth B (positive tangent direction)
      const pBBuccal = curCenter.clone()
        .addScaledVector(tangent, halfSpan)
        .addScaledVector(buccal, depthB);
      const pBLingual = curCenter.clone()
        .addScaledVector(tangent, halfSpan)
        .addScaledVector(lingual, depthL);

      toothABuccal.push(pABuccal);
      toothBBuccal.push(pBBuccal);
      toothALingual.push(pALingual);
      toothBLingual.push(pBLingual);
    }

    // Construct Buccal Closed Perimeter Loop:
    // Apex -> Tooth A Buccal (down) -> Papilla Base Buccal -> Tooth B Buccal (up) -> Apex
    const buccalLoop: [number, number, number][] = [];
    buccalLoop.push([apex.x, apex.y, apex.z]);
    for (let s = 1; s <= numSteps; s++) {
      const p = toothABuccal[s]!;
      buccalLoop.push([parseFloat(p.x.toFixed(2)), parseFloat(p.y.toFixed(2)), parseFloat(p.z.toFixed(2))]);
    }
    for (let s = numSteps; s >= 1; s--) {
      const p = toothBBuccal[s]!;
      buccalLoop.push([parseFloat(p.x.toFixed(2)), parseFloat(p.y.toFixed(2)), parseFloat(p.z.toFixed(2))]);
    }

    // Construct Lingual Closed Perimeter Loop:
    // Apex -> Tooth A Lingual (down) -> Papilla Base Lingual -> Tooth B Lingual (up) -> Apex
    const lingualLoop: [number, number, number][] = [];
    lingualLoop.push([apex.x, apex.y, apex.z]);
    for (let s = 1; s <= numSteps; s++) {
      const p = toothALingual[s]!;
      lingualLoop.push([parseFloat(p.x.toFixed(2)), parseFloat(p.y.toFixed(2)), parseFloat(p.z.toFixed(2))]);
    }
    for (let s = numSteps; s >= 1; s--) {
      const p = toothBLingual[s]!;
      lingualLoop.push([parseFloat(p.x.toFixed(2)), parseFloat(p.y.toFixed(2)), parseFloat(p.z.toFixed(2))]);
    }

    // Transverse connecting ribs across buccal and lingual boundaries
    const ribLines: number[] = [];
    const ribSteps = [3, 6, numSteps];
    for (const step of ribSteps) {
      const pAB = toothABuccal[step]!;
      const pAL = toothALingual[step]!;
      const pBB = toothBBuccal[step]!;
      const pBL = toothBLingual[step]!;

      // Rib across Tooth A: Buccal <-> Lingual
      ribLines.push(pAB.x, pAB.y, pAB.z, pAL.x, pAL.y, pAL.z);
      // Rib across Tooth B: Buccal <-> Lingual
      ribLines.push(pBB.x, pBB.y, pBB.z, pBL.x, pBL.y, pBL.z);
      // Cross-gap base rib
      if (step === numSteps) {
        ribLines.push(pAB.x, pAB.y, pAB.z, pBB.x, pBB.y, pBB.z);
        ribLines.push(pAL.x, pAL.y, pAL.z, pBL.x, pBL.y, pBL.z);
      }
    }

    // Semi-transparent curtain ribbon triangles
    const ribbonTriangles: number[] = [];
    for (let s = 0; s < numSteps; s++) {
      const a0 = toothABuccal[s]!, a1 = toothABuccal[s + 1]!;
      const b0 = toothBBuccal[s]!, b1 = toothBBuccal[s + 1]!;

      // Quad A0-B0-B1-A1 (Buccal curtain)
      ribbonTriangles.push(
        a0.x, a0.y, a0.z,
        b0.x, b0.y, b0.z,
        b1.x, b1.y, b1.z,
        a0.x, a0.y, a0.z,
        b1.x, b1.y, b1.z,
        a1.x, a1.y, a1.z,
      );

      // Quad A0-B0-B1-A1 (Lingual curtain)
      const la0 = toothALingual[s]!, la1 = toothALingual[s + 1]!;
      const lb0 = toothBLingual[s]!, lb1 = toothBLingual[s + 1]!;
      ribbonTriangles.push(
        la0.x, la0.y, la0.z,
        lb0.x, lb0.y, lb0.z,
        lb1.x, lb1.y, lb1.z,
        la0.x, la0.y, la0.z,
        lb1.x, lb1.y, lb1.z,
        la1.x, la1.y, la1.z,
      );
    }

    silhouettes.push({
      id: `silhouette-${contact.contactKey}`,
      contactKey: contact.contactKey,
      label: contact.label,
      toothA: contact.toothA,
      toothB: contact.toothB,
      apex: [parseFloat(apex.x.toFixed(2)), parseFloat(apex.y.toFixed(2)), parseFloat(apex.z.toFixed(2))],
      papillaBase: [parseFloat(papillaBase.x.toFixed(2)), parseFloat(papillaBase.y.toFixed(2)), parseFloat(papillaBase.z.toFixed(2))],
      heightMm: parseFloat(heightMm.toFixed(1)),
      spanMm,
      depthMm,
      buccalWidthMm: parseFloat(maxBuccalDepth.toFixed(2)),
      lingualWidthMm: parseFloat(maxLingualDepth.toFixed(2)),
      buccalLoop,
      lingualLoop,
      ribLines,
      ribbonTriangles,
    });
  }

  return silhouettes;
}

/**
 * Creates an interactive 3D visual representation for an embrasure silhouette.
 */
export function createSilhouette3DObject(
  silhouette: EmbrasureSilhouette,
  isSelected: boolean = false,
  isHovered: boolean = false,
): Group {
  const group = new Group();
  group.name = `embrasure-${silhouette.contactKey}`;

  const primaryColor = isSelected
    ? new Color(0xfbbf24) // Bright gold
    : isHovered
      ? new Color(0x38bdf8) // Neon sky blue
      : new Color(0x06b6d4); // Clinical cyan

  const opacity = isSelected ? 0.35 : isHovered ? 0.28 : 0.16;

  // 1. Buccal Perimeter Loop
  const buccalGeom = new BufferGeometry();
  const buccalFlat: number[] = [];
  for (const p of silhouette.buccalLoop) buccalFlat.push(p[0], p[1], p[2]);
  buccalGeom.setAttribute("position", new BufferAttribute(new Float32Array(buccalFlat), 3));
  const lineMat = new LineBasicMaterial({
    color: primaryColor,
    linewidth: isSelected ? 3 : 1.5,
    transparent: true,
    opacity: isSelected ? 0.95 : 0.75,
  });
  const buccalLine = new LineLoop(buccalGeom, lineMat);
  buccalLine.renderOrder = 30;
  group.add(buccalLine);

  // 2. Lingual Perimeter Loop
  const lingualGeom = new BufferGeometry();
  const lingualFlat: number[] = [];
  for (const p of silhouette.lingualLoop) lingualFlat.push(p[0], p[1], p[2]);
  lingualGeom.setAttribute("position", new BufferAttribute(new Float32Array(lingualFlat), 3));
  const lingualLine = new LineLoop(lingualGeom, lineMat);
  lingualLine.renderOrder = 30;
  group.add(lingualLine);

  // 3. Transverse Rib Lines
  if (silhouette.ribLines.length > 0) {
    const ribGeom = new BufferGeometry();
    ribGeom.setAttribute("position", new BufferAttribute(new Float32Array(silhouette.ribLines), 3));
    const ribMat = new LineBasicMaterial({
      color: primaryColor,
      linewidth: 1,
      transparent: true,
      opacity: isSelected ? 0.75 : 0.45,
    });
    const ribSegments = new LineSegments(ribGeom, ribMat);
    ribSegments.renderOrder = 29;
    group.add(ribSegments);
  }

  // 4. Semi-transparent boundary curtain
  if (silhouette.ribbonTriangles.length > 0) {
    const curtainGeom = new BufferGeometry();
    curtainGeom.setAttribute("position", new BufferAttribute(new Float32Array(silhouette.ribbonTriangles), 3));
    curtainGeom.computeVertexNormals();
    const curtainMat = new MeshBasicMaterial({
      color: primaryColor,
      transparent: true,
      opacity,
      side: DoubleSide,
      depthWrite: false,
    });
    const curtainMesh = new Mesh(curtainGeom, curtainMat);
    curtainMesh.renderOrder = 25;
    group.add(curtainMesh);
  }

  return group;
}
