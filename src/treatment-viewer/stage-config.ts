/**
 * Treatment stage configuration & default case setup.
 *
 * Provides:
 * - The default supplied case manifest (Soumya Sarath) with explicit pairings.
 * - Separation between patient-visible progression stages and doctor-only template stages.
 * - Compatibility helpers for stage retrieval by progression index.
 */

import type { CaseManifest, StageDefinition } from "./stage-manifest";

export const SOUMYA_SARATH_MANIFEST: CaseManifest = {
  caseId: "soumya-sarath",
  patientName: "Soumya Sarath",
  treatmentStages: [
    {
      id: "stage-01",
      stageNumber: 1,
      label: "Stage 1",
      doctorOnly: false,
      upper: {
        filename: "Soumya Sarath Upper jaw - 01 - Model.glb",
        url: "/models/Soumya Sarath Upper jaw - 01 - Model.glb",
      },
      lower: {
        filename: "Soumya Sarath Lower jaw - 01 - Model.glb",
        url: "/models/Soumya Sarath Lower jaw - 01 - Model.glb",
      },
    },
    {
      id: "stage-02",
      stageNumber: 2,
      label: "Stage 2",
      doctorOnly: false,
      upper: {
        filename: "Soumya Sarath Upper jaw - 02 - Model.glb",
        url: "/models/Soumya Sarath Upper jaw - 02 - Model.glb",
      },
      lower: {
        filename: "Soumya Sarath Lower jaw - 02 - Model.glb",
        url: "/models/Soumya Sarath Lower jaw - 02 - Model.glb",
      },
    },
  ],
  templateStages: [
    {
      id: "template-01",
      label: "Template (Doctor Reference)",
      doctorOnly: true,
      upper: {
        filename: "Soumya Sarath Upper jaw - 01 - Template.glb",
        url: "/models/Soumya Sarath Upper jaw - 01 - Template.glb",
      },
      lower: {
        filename: "Soumya Sarath Lower jaw - 01 - Template.glb",
        url: "/models/Soumya Sarath Lower jaw - 01 - Template.glb",
      },
    },
  ],
  ambiguities: [],
};

/**
 * 10-Stage Treatment Progression for Patient "Niya Priority" (Ashina Models).
 * Contains full 10 progressive aligner stages + reference template scan.
 */
export const NIYA_PRIORITY_MANIFEST: CaseManifest = {
  caseId: "niya-priority",
  patientName: "Niya Priority",
  treatmentStages: Array.from({ length: 10 }, (_, i) => {
    const stageNum = i + 1;
    const pad = String(stageNum).padStart(2, "0");
    const upperFilename = `Niya Priority Upper jaw - ${pad} - Model.glb`;
    const lowerFilename = `Niya Priority Lower jaw - ${pad} - Model.glb`;
    return {
      id: `stage-${pad}`,
      stageNumber: stageNum,
      label: `Stage ${stageNum}`,
      doctorOnly: false,
      upper: {
        filename: upperFilename,
        url: `/models/Ashina%20models/${encodeURIComponent(upperFilename)}?v=clean2`,
      },
      lower: {
        filename: lowerFilename,
        url: `/models/Ashina%20models/${encodeURIComponent(lowerFilename)}?v=clean2`,
      },
    };
  }),
  templateStages: [
    {
      id: "template-01",
      label: "Template (Doctor Reference)",
      doctorOnly: true,
      upper: {
        filename: "Niya Priority Upper jaw - 01 - Template.glb",
        url: `/models/Ashina%20models/${encodeURIComponent("Niya Priority Upper jaw - 01 - Template.glb")}?v=clean2`,
      },
      lower: {
        filename: "Niya Priority Lower jaw - 01 - Template.glb",
        url: `/models/Ashina%20models/${encodeURIComponent("Niya Priority Lower jaw - 01 - Template.glb")}?v=clean2`,
      },
    },
  ],
  ambiguities: [],
};

/** Default active case is the 10-stage Niya Priority clinical progression */
export const DEFAULT_CASE_MANIFEST: CaseManifest = NIYA_PRIORITY_MANIFEST;

/** Available pre-loaded demonstration cases */
export const BUILTIN_CASES: readonly CaseManifest[] = [
  NIYA_PRIORITY_MANIFEST,
  SOUMYA_SARATH_MANIFEST,
];

// ─── Legacy compatibility interface ──────────────────────────────────────────

export interface TreatmentStage {
  /** Actual stage number or sequence index. */
  readonly stage: number;
  /** Human-readable label (e.g. "Stage 1", "Stage 5"). */
  readonly label: string;
  /** URL for the upper jaw STL. */
  readonly upperUrl: string;
  /** URL for the lower jaw STL. */
  readonly lowerUrl: string;
}

export const TREATMENT_STAGES: readonly TreatmentStage[] =
  DEFAULT_CASE_MANIFEST.treatmentStages.map((s) => ({
    stage: s.stageNumber ?? 1,
    label: s.label,
    upperUrl: s.upper.url ?? "",
    lowerUrl: s.lower.url ?? "",
  }));

export const STAGE_COUNT = TREATMENT_STAGES.length;

/**
 * Returns the stage definition at a 0-based progression index within a given manifest.
 */
export function stageAt(
  index: number,
  manifest: CaseManifest = DEFAULT_CASE_MANIFEST,
): StageDefinition | null {
  return manifest.treatmentStages[index] ?? null;
}
