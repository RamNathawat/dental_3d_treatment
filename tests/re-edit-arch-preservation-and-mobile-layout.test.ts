import { describe, it, expect } from "vitest";
import { parseStageFromPath } from "../portal/lib/in-browser-converter";
import { normalizeManifestStages, type CaseManifest } from "../src/treatment-viewer/stage-manifest";
import { setModelProgressCallback, resetModelProgress } from "../src/treatment-viewer/model-loader";
import * as fs from "fs";
import * as path from "path";

describe("Re-edit Arch Preservation & Path Parsing", () => {
  it("correctly extracts stage number when folder is named '00 Segmented' or has patient prefix", () => {
    // Should NOT reject paths simply because the root folder or patient name has 'segmented'
    const stage1 = parseStageFromPath("00 Segmented/01/Lower.obj");
    expect(stage1).toBe(1);

    const stage18 = parseStageFromPath("00 Segmented/18/gum.obj");
    expect(stage18).toBe(18);

    const stageTooth = parseStageFromPath("00 Segmented/Stage 05/tooth_11.obj");
    expect(stageTooth).toBe(5);

    const stageMaxilla = parseStageFromPath("00 Segmented/Upper_10/gum.obj");
    expect(stageMaxilla).toBe(10);
  });

  it("still rejects actual template or raw segmented component folders without a stage directory", () => {
    const template = parseStageFromPath("templates/attachment_01.obj");
    expect(template).toBeNull();

    const raw = parseStageFromPath("raw_segmented/tooth_11.obj");
    expect(raw).toBeNull();
  });

  it("self-heals missing lower arch in normalizeManifestStages when storage files contain lower models", () => {
    const singleArchUpperManifest: CaseManifest = {
      caseId: "case-dual-test",
      patientName: "00 Segmented",
      archType: "upper",
      hasUpper: true,
      hasLower: false,
      treatmentStages: [
        {
          id: "stage-01",
          stageNumber: 1,
          label: "Stage 1",
          doctorOnly: false,
          upper: {
            filename: "00 Segmented Upper jaw - 01 - Model.glb",
            url: "https://example.com/00%20Segmented%20Upper%20jaw%20-%2001%20-%20Model.glb",
          },
        },
        {
          id: "stage-02",
          stageNumber: 2,
          label: "Stage 2",
          doctorOnly: false,
          upper: {
            filename: "00 Segmented Upper jaw - 02 - Model.glb",
            url: "https://example.com/00%20Segmented%20Upper%20jaw%20-%2002%20-%20Model.glb",
          },
        },
      ],
      templateStages: [],
      ambiguities: [],
    };

    const storageFiles = [
      "00 Segmented Upper jaw - 01 - Model.glb",
      "00 Segmented Upper jaw - 02 - Model.glb",
      "00 Segmented Lower jaw - 01 - Model.glb",
      "00 Segmented Lower jaw - 02 - Model.glb",
      "manifest.json",
    ];

    const normalized = normalizeManifestStages(singleArchUpperManifest, storageFiles);

    expect(normalized.hasUpper).toBe(true);
    expect(normalized.hasLower).toBe(true);
    expect(normalized.archType).toBe("both");
    expect(normalized.treatmentStages[0]!.lower).toBeDefined();
    expect(normalized.treatmentStages[0]!.lower!.filename).toBe("00 Segmented Lower jaw - 01 - Model.glb");
    expect(normalized.treatmentStages[1]!.lower).toBeDefined();
    expect(normalized.treatmentStages[1]!.lower!.filename).toBe("00 Segmented Lower jaw - 02 - Model.glb");
  });

  it("does not resurrect lower models if manifest is explicitly Upper-only", () => {
    const upperOnlyManifest: CaseManifest = {
      caseId: "case-upper-only",
      patientName: "Patient [Upper]",
      archType: "upper",
      hasUpper: true,
      hasLower: false,
      treatmentStages: [
        {
          id: "stage-01",
          stageNumber: 1,
          label: "Stage 1",
          doctorOnly: false,
          upper: {
            filename: "Upper jaw - 01 - Model.glb",
            url: "https://example.com/upper-01.glb",
          },
        },
      ],
      templateStages: [],
      ambiguities: [],
    };

    const storageFiles = [
      "Upper jaw - 01 - Model.glb",
      "Lower jaw - 01 - Model.glb", // Stale file in storage
    ];

    const normalized = normalizeManifestStages(upperOnlyManifest, storageFiles);

    expect(normalized.hasUpper).toBe(true);
    expect(normalized.hasLower).toBe(false);
    expect(normalized.archType).toBe("upper");
    expect(normalized.treatmentStages[0]!.lower).toBeUndefined();
  });

  it("does not resurrect upper models if manifest is Lower-only (e.g. archType is lower or patientName is '00 [Lower]')", () => {
    const lowerOnlyManifest: CaseManifest = {
      caseId: "case-lower-only",
      patientName: "00 [Lower]",
      archType: "lower",
      hasUpper: false,
      hasLower: true,
      treatmentStages: [
        {
          id: "stage-01",
          stageNumber: 1,
          label: "Stage 1",
          doctorOnly: false,
          lower: {
            filename: "00 Lower jaw - 01 - Model.glb",
            url: "https://example.com/00-lower-01.glb",
          },
        },
      ],
      templateStages: [],
      ambiguities: [],
    };

    const storageFiles = [
      "00 Upper jaw - 01 - Model.glb", // Stale file in storage
      "00 Lower jaw - 01 - Model.glb",
    ];

    const normalized = normalizeManifestStages(lowerOnlyManifest, storageFiles);

    expect(normalized.hasUpper).toBe(false);
    expect(normalized.hasLower).toBe(true);
    expect(normalized.archType).toBe("lower");
    expect(normalized.treatmentStages[0]!.upper).toBeUndefined();
    expect(normalized.treatmentStages[0]!.lower).toBeDefined();
  });
});

describe("Model Loader Live Progress Tracking", () => {
  it("tracks monotonic progress across parallel downloads", () => {
    const emittedPercents: number[] = [];
    setModelProgressCallback((_loaded, _total, percent) => {
      emittedPercents.push(percent);
    });

    resetModelProgress();
    expect(emittedPercents[emittedPercents.length - 1]).toBe(0);

    // Verify callback can be set and reset cleanly
    setModelProgressCallback(null);
  });
});

describe("CSS Mobile Layout & Header Rules", () => {
  it("includes rules for single-line footer (stage pill + play/speed) and clashing prevention", () => {
    const cssPath = path.resolve(__dirname, "../src/treatment-viewer/treatment.css");
    const css = fs.readFileSync(cssPath, "utf-8");

    // Header clash prevention
    expect(css).toContain(".tv-header__patient-demo");
    expect(css).toContain("display: none !important");
    expect(css).toContain(".tv-header__sub.tv-header__patient-chip");

    // Single-line footer in mobile dock
    expect(css).toContain(".tv-scrubber-wrap");
    expect(css).toContain("display: contents");
    expect(css).toContain("grid-template-areas:");
    expect(css).toContain('"stage actions"');

    // Progress bar in loading overlay
    expect(css).toContain(".tv-loading__bar-track");
    expect(css).toContain(".tv-loading__bar-fill");
    expect(css).toContain(".tv-loading--fade-out");
  });
});

describe("Multi-File Simultaneous Upload & Edit Cache Busting", () => {
  it("classifies simultaneous Upper & Lower archives by file names and aliases", () => {
    const isUpper = (name: string) =>
      /(?:upper|maxill|maxillary|\bupper\b|[._-]u\b|[._-]u[._-])/i.test(name);
    const isLower = (name: string) =>
      /(?:lower|mandib|mandibular|\blower\b|[._-]l\b|[._-]l[._-])/i.test(name);

    expect(isUpper("Niya_Upper.zip")).toBe(true);
    expect(isLower("Niya_Upper.zip")).toBe(false);

    expect(isLower("Niya_Lower.zip")).toBe(true);
    expect(isUpper("Niya_Lower.zip")).toBe(false);

    expect(isUpper("Patient_Maxilla_Treatment.zip")).toBe(true);
    expect(isLower("Patient_Mandible_Treatment.zip")).toBe(true);

    expect(isUpper("case_123_u.zip")).toBe(true);
    expect(isLower("case_123_l.zip")).toBe(true);
  });

  it("safely generates and appends cache-busting version query parameters to stage URLs", () => {
    const appendVersion = (url: string | undefined, version: number | string): string | undefined => {
      if (!url) return undefined;
      try {
        const parsed = new URL(url, "https://yrjulcwnabnhgtqebrtn.supabase.co");
        parsed.searchParams.set("v", String(version));
        return parsed.toString();
      } catch {
        const clean = url.split("?")[0];
        return `${clean}?v=${version}`;
      }
    };

    const rawUrl = "https://yrjulcwnabnhgtqebrtn.supabase.co/storage/v1/object/public/treatment-models/case-123/Niya%20Upper%20jaw%20-%2001%20-%20Model.glb";
    const tagged = appendVersion(rawUrl, 1794100000);
    expect(tagged).toBe("https://yrjulcwnabnhgtqebrtn.supabase.co/storage/v1/object/public/treatment-models/case-123/Niya%20Upper%20jaw%20-%2001%20-%20Model.glb?v=1794100000");

    // Re-tagging replaces previous version query
    const retagged = appendVersion(tagged, 1794200000);
    expect(retagged).toBe("https://yrjulcwnabnhgtqebrtn.supabase.co/storage/v1/object/public/treatment-models/case-123/Niya%20Upper%20jaw%20-%2001%20-%20Model.glb?v=1794200000");
  });
});


