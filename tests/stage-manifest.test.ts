import { describe, expect, it } from "vitest";
import {
  pairTreatmentFiles,
  validateCaseManifest,
  type RawFileDescriptor,
} from "../src/treatment-viewer/stage-manifest";
import { DEFAULT_CASE_MANIFEST } from "../src/treatment-viewer/stage-config";

describe("Stage Manifest Validation", () => {
  it("validates the default supplied case manifest", () => {
    const result = validateCaseManifest(DEFAULT_CASE_MANIFEST);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.manifest.treatmentStages.length).toBeGreaterThanOrEqual(2);
      expect(result.manifest.templateStages.length).toBeGreaterThanOrEqual(1);
      expect(result.manifest.treatmentStages[0]?.label).toBe("Stage 1");
      // Doctor template must be excluded from treatment stages
      expect(result.manifest.treatmentStages.some((s) => s.doctorOnly)).toBe(
        false,
      );
      expect(result.manifest.templateStages[0]?.doctorOnly).toBe(true);
    }
  });

  it("supports cases whose first patient stage starts at Stage 5 or Stage 6", () => {
    const rawManifest = {
      caseId: "case-delayed-start",
      patientName: "Patient B",
      treatmentStages: [
        {
          id: "stage-05",
          stageNumber: 5,
          label: "Stage 5",
          doctorOnly: false,
          upper: { filename: "PatientB_Upper_Stage05.stl" },
          lower: { filename: "PatientB_Lower_Stage05.stl" },
        },
        {
          id: "stage-06",
          stageNumber: 6,
          label: "Stage 6",
          doctorOnly: false,
          upper: { filename: "PatientB_Upper_Stage06.stl" },
          lower: { filename: "PatientB_Lower_Stage06.stl" },
        },
      ],
      templateStages: [
        {
          id: "template-preop",
          label: "Pre-Op Template",
          doctorOnly: true,
          upper: { filename: "PatientB_Upper_Template.stl" },
          lower: { filename: "PatientB_Lower_Template.stl" },
        },
      ],
    };

    const result = validateCaseManifest(rawManifest);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.manifest.treatmentStages[0]?.stageNumber).toBe(5);
      expect(result.manifest.treatmentStages[0]?.label).toBe("Stage 5");
      expect(result.manifest.treatmentStages[1]?.stageNumber).toBe(6);
      expect(result.manifest.treatmentStages[1]?.label).toBe("Stage 6");
      expect(result.manifest.templateStages.length).toBe(1);
    }
  });

  it("rejects invalid manifests missing required fields or paired models", () => {
    const badManifest = {
      caseId: "bad-case",
      treatmentStages: [
        {
          id: "stage-01",
          upper: { filename: "upper.stl" },
          // missing lower!
        },
      ],
    };

    const result = validateCaseManifest(badManifest);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(
        result.errors.some((e) => e.includes("treatmentStages[0].lower")),
      ).toBe(true);
    }
  });

  it("rejects doctorOnly stages incorrectly placed in treatmentStages", () => {
    const badManifest = {
      caseId: "bad-case",
      treatmentStages: [
        {
          id: "stage-01",
          doctorOnly: true,
          upper: { filename: "upper.stl" },
          lower: { filename: "lower.stl" },
        },
      ],
    };

    const result = validateCaseManifest(badManifest);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.includes("doctorOnly: true"))).toBe(
        true,
      );
    }
  });

  it("successfully validates single-arch treatment manifests (Upper only or Lower only)", () => {
    const upperOnlyManifest = {
      caseId: "case-upper-only",
      patientName: "Patient Single Upper",
      archType: "upper",
      treatmentStages: [
        {
          id: "stage-01",
          stageNumber: 1,
          label: "Stage 1",
          doctorOnly: false,
          upper: { filename: "Patient_Upper_01.glb" },
        },
        {
          id: "stage-02",
          stageNumber: 2,
          label: "Stage 2",
          doctorOnly: false,
          upper: { filename: "Patient_Upper_02.glb" },
        },
      ],
    };

    const upperResult = validateCaseManifest(upperOnlyManifest);
    expect(upperResult.ok).toBe(true);
    if (upperResult.ok) {
      expect(upperResult.manifest.archType).toBe("upper");
      expect(upperResult.manifest.hasUpper).toBe(true);
      expect(upperResult.manifest.hasLower).toBe(false);
      expect(upperResult.manifest.treatmentStages[0]?.upper?.filename).toBe("Patient_Upper_01.glb");
      expect(upperResult.manifest.treatmentStages[0]?.lower).toBeUndefined();
    }

    const lowerOnlyManifest = {
      caseId: "case-lower-only",
      patientName: "Patient Single Lower",
      archType: "lower",
      treatmentStages: [
        {
          id: "stage-01",
          stageNumber: 1,
          label: "Stage 1",
          doctorOnly: false,
          lower: { filename: "Patient_Lower_01.glb" },
        },
      ],
    };

    const lowerResult = validateCaseManifest(lowerOnlyManifest);
    expect(lowerResult.ok).toBe(true);
    if (lowerResult.ok) {
      expect(lowerResult.manifest.archType).toBe("lower");
      expect(lowerResult.manifest.hasUpper).toBe(false);
      expect(lowerResult.manifest.hasLower).toBe(true);
      expect(lowerResult.manifest.treatmentStages[0]?.lower?.filename).toBe("Patient_Lower_01.glb");
    }
  });
});

describe("Dynamic Pairing & Ambiguity Detection", () => {
  it("accurately pairs the actual supplied dental models", () => {
    const suppliedFiles: RawFileDescriptor[] = [
      { name: "Soumya Sarath Lower jaw - 01 - Model.stl" },
      { name: "Soumya Sarath Lower jaw - 01 - Template.stl" },
      { name: "Soumya Sarath Lower jaw - 02 - Model.stl" },
      { name: "Soumya Sarath Upper jaw - 01 - Model.stl" },
      { name: "Soumya Sarath Upper jaw - 01 - Template.stl" },
      { name: "Soumya Sarath Upper jaw - 02 - Model.stl" },
    ];

    const paired = pairTreatmentFiles(
      suppliedFiles,
      "soumya-sarath",
      "Soumya Sarath",
    );

    expect(paired.ambiguities).toEqual([]);
    expect(paired.treatmentStages.length).toBe(2);
    expect(paired.templateStages.length).toBe(1);

    // Stage 1 pairing
    const s1 = paired.treatmentStages[0];
    expect(s1?.stageNumber).toBe(1);
    expect(s1?.label).toBe("Stage 1");
    expect(s1?.upper?.filename).toBe("Soumya Sarath Upper jaw - 01 - Model.stl");
    expect(s1?.lower?.filename).toBe("Soumya Sarath Lower jaw - 01 - Model.stl");
    expect(s1?.doctorOnly).toBe(false);

    // Stage 2 pairing
    const s2 = paired.treatmentStages[1];
    expect(s2?.stageNumber).toBe(2);
    expect(s2?.label).toBe("Stage 2");
    expect(s2?.upper?.filename).toBe("Soumya Sarath Upper jaw - 02 - Model.stl");
    expect(s2?.lower?.filename).toBe("Soumya Sarath Lower jaw - 02 - Model.stl");
    expect(s2?.doctorOnly).toBe(false);

    // Template doctor-only pairing
    const tmpl = paired.templateStages[0];
    expect(tmpl?.doctorOnly).toBe(true);
    expect(tmpl?.upper?.filename).toBe(
      "Soumya Sarath Upper jaw - 01 - Template.stl",
    );
    expect(tmpl?.lower?.filename).toBe(
      "Soumya Sarath Lower jaw - 01 - Template.stl",
    );
  });

  it("pairs cases starting at stage 5 and preserves stage numbers", () => {
    const files: RawFileDescriptor[] = [
      { name: "CaseA_Upper_jaw - 05 - Model.stl" },
      { name: "CaseA_Lower_jaw - 05 - Model.stl" },
      { name: "CaseA_Upper_jaw - 06 - Model.stl" },
      { name: "CaseA_Lower_jaw - 06 - Model.stl" },
    ];

    const paired = pairTreatmentFiles(files, "case-a");
    expect(paired.ambiguities).toEqual([]);
    expect(paired.treatmentStages.length).toBe(2);
    expect(paired.treatmentStages[0]?.stageNumber).toBe(5);
    expect(paired.treatmentStages[0]?.label).toBe("Stage 5");
    expect(paired.treatmentStages[1]?.stageNumber).toBe(6);
    expect(paired.treatmentStages[1]?.label).toBe("Stage 6");
  });

  it("reports ambiguity when a lower jaw model is missing", () => {
    const files: RawFileDescriptor[] = [
      { name: "Upper jaw - 01 - Model.stl" },
      { name: "Lower jaw - 01 - Model.stl" },
      { name: "Upper jaw - 02 - Model.stl" }, // no lower jaw for stage 2!
    ];

    const paired = pairTreatmentFiles(files, "unpaired-case");
    expect(paired.ambiguities.length).toBeGreaterThan(0);
    expect(paired.ambiguities[0]).toContain("Missing lower jaw model");
    expect(paired.treatmentStages.length).toBe(1); // stage 1 succeeds, stage 2 flagged
  });

  it("reports ambiguity when conflicting models exist for the same arch and stage", () => {
    const files: RawFileDescriptor[] = [
      { name: "Patient_Upper_Stage1_v1.stl" },
      { name: "Patient_Upper_Stage1_v2.stl" },
      { name: "Patient_Lower_Stage1.stl" },
    ];

    const paired = pairTreatmentFiles(files, "conflict-case");
    expect(paired.ambiguities.length).toBeGreaterThan(0);
    expect(paired.ambiguities[0]).toContain("Multiple upper jaw models");
  });

  it("reports ambiguity when a file has an uncertain arch or stage number", () => {
    const files: RawFileDescriptor[] = [
      { name: "DentalScan_Export.stl" }, // no upper/lower indicator
      { name: "Upper jaw Model.stl" }, // no stage number indicator
    ];

    const paired = pairTreatmentFiles(files, "uncertain-case");
    expect(paired.ambiguities.length).toBe(2);
    expect(paired.ambiguities.some((a) => a.includes("Ambiguous arch"))).toBe(
      true,
    );
    expect(
      paired.ambiguities.some((a) => a.includes("Ambiguous stage number")),
    ).toBe(true);
  });
});
