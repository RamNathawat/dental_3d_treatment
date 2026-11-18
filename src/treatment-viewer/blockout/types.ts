/**
 * Types and interfaces for Milestone 4:
 * Automated Undercut & Blockout Studio, Review & Multi-Model Workflow.
 */

import type { BufferGeometry } from "three";

/** Insertion axis vector defining the draw direction for clear aligners. */
export interface InsertionAxis {
  x: number;
  y: number;
  z: number;
  /** Manual tilt adjustment in degrees along X (mesial-distal) */
  tiltX: number;
  /** Manual tilt adjustment in degrees along Y/Z (buccal-lingual) */
  tiltY: number;
}

/** Result of automated surveying and undercut depth analysis. */
export interface SurveyAnalysis {
  /** Depth of undercut in millimeters for each vertex in the mesh. */
  readonly depths: Float32Array;
  /** Color attribute array (RGB) representing the clinical heatmap. */
  readonly heatmapColors: Float32Array;
  /** Maximum undercut depth observed (mm). */
  readonly maxDepthMm: number;
  /** Average undercut depth across affected areas (mm). */
  readonly avgDepthMm: number;
  /** Estimated undercut surface area (mm²). */
  readonly undercutAreaMm2: number;
  /** Indices of vertices located on or below the survey line (maximum contour). */
  readonly undercutIndices: Uint32Array;
}

/** Configuration for Interproximal Wax Blockout (Component 1). */
export interface InterproximalConfig {
  /** Master toggle to apply interproximal wax. */
  enabled: boolean;
  /** Thickness of wax added between adjacent teeth (mm). Default: 0.6 mm. */
  thicknessMm: number;
  /** Whether to bridge wider edentulous spans / missing tooth gaps. */
  bridgeSpaces: boolean;
}

/** Configuration for Gingival Line Blockout (Component 2). */
export interface GingivalConfig {
  /** Master toggle for gingival margin relief. Doctor decides per case. */
  enabled: boolean;
  /** Offset relief along the cervical sulcus margin (mm). Default: 0.3 mm. */
  reliefMm: number;
  /** Exclude flat edentulous ridges where teeth are missing. */
  excludeEdentulous: boolean;
}

/** Configuration for Dentition Undercut Blockout (Component 3). */
export interface UndercutConfig {
  /** Master toggle for undercut fill. */
  enabled: boolean;
  /** Maximum allowable undercut depth before blockout occurs (mm). Default: 0.5 mm. */
  maxDepthMm: number;
  /** Minimum draft angle relative to insertion vector (degrees). Default: 2.0 deg. */
  draftAngleDeg: number;
  /**
   * Per-tooth overrides using ISO/FDI numbering (11–18, 21–28, 31–38, 41–48).
   * True = enabled, False = excluded from blockout.
   */
  perTooth: Record<number, boolean>;
}

/** 3D Sculpt Tool (Digital Wax Carver) state (Component 4). */
export type SculptMode = "off" | "add" | "remove" | "smooth";

export interface SculptConfig {
  mode: SculptMode;
  /** Brush sphere radius in millimeters (1.0 mm – 10.0 mm). Default: 3.5 mm. */
  radiusMm: number;
  /** Flow strength / intensity (0.1 – 1.0). Default: 0.5. */
  strength: number;
}

/** Suction or resin drainage hole placed on model base. */
export interface DrainHole {
  id: string;
  position: [number, number, number];
  normal: [number, number, number];
  diameterMm: number;
}

/** 3D Print Preparation and Slicing settings. */
export interface PrintPrepConfig {
  /** Scale factor to compensate for photopolymer resin post-curing shrinkage (e.g. 100.5%). */
  shrinkageScalePercent: number;
  /** Base drainage and vacuum thermoforming suction holes. */
  drainHoles: DrainHole[];
}

/** Full blockout protocol that can be configured on Stage 1 and propagated to all stages. */
export interface BlockoutProtocol {
  insertionAxis: InsertionAxis;
  interproximal: InterproximalConfig;
  gingival: GingivalConfig;
  undercut: UndercutConfig;
  printPrep: PrintPrepConfig;
}

/** Active state of a specific transitional stage within the Blockout Studio. */
export interface StageBlockoutResult {
  readonly stageId: string;
  readonly stageNumber: number;
  /** Original base model geometry. */
  readonly baseGeometry: BufferGeometry;
  /** Discrete digital wax overlay geometry (rendered in wax red). */
  waxGeometry: BufferGeometry | null;
  /** Final merged, watertight geometry ready for STL slicing. */
  mergedGeometry: BufferGeometry | null;
  /** Survey analysis metrics. */
  survey?: SurveyAnalysis;
  /** Sculpt vertex displacement offsets recorded for this stage. */
  sculptDeltas?: Map<number, [number, number, number]>;
  /** Timestamp when blockout was generated or modified. */
  lastUpdated: number;
}
