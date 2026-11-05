/**
 * Stage Manifest & Pairing Architecture.
 *
 * Requirements:
 * 1. Each treatment stage is a paired upper-jaw and lower-jaw model.
 * 2. Explicit mappings / configurable stage manifest defines stage order and assets.
 * 3. Doctor-only template stages are strictly distinguished and excluded from patient progression.
 * 4. Preserves actual stage numbers (e.g. Stage 5, Stage 6) without auto-renumbering from 1.
 * 5. Automatic file pairer detects ambiguities and reports them rather than guessing.
 */

export type ArchKind = "upper" | "lower";
export type StageRole = "treatment" | "doctor-template";

export interface ArchAsset {
  readonly filename: string;
  readonly url?: string;
  readonly file?: File | Blob;
  readonly sizeBytes?: number;
}

export interface StageDefinition {
  /** Unique stage identifier (e.g. "stage-01", "stage-05", "template-01"). */
  readonly id: string;
  /** Actual stage number if numeric (e.g. 1, 2, 5, 6). */
  readonly stageNumber?: number;
  /** Human-readable label: "Stage 5", "Template (Doctor Reference)", etc. */
  readonly label: string;
  /** Whether this stage is doctor-only (excluded from patient progression). */
  readonly doctorOnly: boolean;
  /** Upper jaw (maxillary) model asset (optional for lower-only cases). */
  readonly upper?: ArchAsset;
  /** Lower jaw (mandibular) model asset (optional for upper-only cases). */
  readonly lower?: ArchAsset;
}

export interface IprEntry {
  /** Unique ID for the IPR item */
  readonly id: string;
  /** Arch: "upper" (maxillary) or "lower" (mandibular) */
  readonly arch: "upper" | "lower";
  /** Shorthand contact code (e.g. "11-21", "31-41") */
  readonly contact: string;
  /** FDI tooth notation code for first tooth (e.g. 11) */
  readonly toothA: number;
  /** FDI tooth notation code for second tooth (e.g. 21) */
  readonly toothB: number;
  /** Treatment stage number at which IPR is performed (defaults to 1) */
  readonly stage: number;
  /** Amount of interproximal reduction in millimeters (e.g. 0.2, 0.3) */
  readonly amountMm: number;
  /** Optional clinical note */
  readonly note?: string;
}

export interface CaseManifest {
  /** Unique case or patient identifier. */
  readonly caseId: string;
  /** Patient name if available. */
  readonly patientName?: string;
  /** Treatment arch type: "both" (default), "upper", or "lower". */
  readonly archType?: "both" | "upper" | "lower";
  /** Whether upper arch assets exist in this case. */
  readonly hasUpper?: boolean;
  /** Whether lower arch assets exist in this case. */
  readonly hasLower?: boolean;
  /** Planned Interproximal Reduction (IPR) prescriptions */
  readonly ipr?: readonly IprEntry[];
  /**
   * Patient-visible treatment stages in progression sequence.
   * Template stages MUST NOT be included here.
   */
  readonly treatmentStages: readonly StageDefinition[];
  /**
   * Doctor-only template stages (reference scans).
   * Kept distinguishable and excluded from patient slider.
   */
  readonly templateStages: readonly StageDefinition[];
  /**
   * Reported ambiguities or warnings during pairing/validation.
   * If non-empty, viewer flags the issues rather than guessing.
   */
  readonly ambiguities: readonly string[];
}

export interface RawFileDescriptor {
  readonly name: string;
  readonly url?: string;
  readonly file?: File | Blob;
  readonly size?: number;
  /** Explicit classification if specified by dentist/manifest. */
  readonly role?: StageRole;
  /** Explicit arch if specified. */
  readonly arch?: ArchKind;
  /** Explicit stage number or identifier. */
  readonly stageKey?: string;
}

// ─── Manifest Validation ─────────────────────────────────────────────────────

export interface ManifestValidationSuccess {
  readonly ok: true;
  readonly manifest: CaseManifest;
}

export interface ManifestValidationError {
  readonly ok: false;
  readonly errors: readonly string[];
}

export type ManifestValidationResult =
  ManifestValidationSuccess | ManifestValidationError;

/**
 * Validates a JSON object against the CaseManifest specification.
 */
export function validateCaseManifest(raw: unknown): ManifestValidationResult {
  const errors: string[] = [];

  if (typeof raw !== "object" || raw === null) {
    return { ok: false, errors: ["Manifest root must be an object."] };
  }

  const obj = raw as Record<string, unknown>;
  const caseId = typeof obj.caseId === "string" ? obj.caseId.trim() : "";
  if (!caseId) {
    errors.push("Missing required 'caseId'.");
  }

  const patientName =
    typeof obj.patientName === "string" ? obj.patientName : undefined;

  const archType =
    typeof obj.archType === "string" && ["both", "upper", "lower"].includes(obj.archType)
      ? (obj.archType as "both" | "upper" | "lower")
      : undefined;

  const allowSingleArch =
    archType === "upper" ||
    archType === "lower" ||
    Boolean(obj.allowSingleArch);

  const rawTreatmentStages = Array.isArray(obj.treatmentStages)
    ? obj.treatmentStages
    : [];
  if (!Array.isArray(obj.treatmentStages)) {
    errors.push("Missing or invalid 'treatmentStages' array.");
  }

  const rawTemplateStages = Array.isArray(obj.templateStages)
    ? obj.templateStages
    : [];

  const treatmentStages: StageDefinition[] = [];
  const templateStages: StageDefinition[] = [];

  for (const [idx, item] of rawTreatmentStages.entries()) {
    const stageRes = validateStageDefinition(
      item,
      `treatmentStages[${idx}]`,
      false,
      allowSingleArch,
    );
    if (stageRes.ok) {
      if (stageRes.stage.doctorOnly) {
        errors.push(
          `treatmentStages[${idx}] ('${stageRes.stage.label}') is marked doctorOnly: true. Template stages must be placed in 'templateStages', not 'treatmentStages'.`,
        );
      }
      treatmentStages.push(stageRes.stage);
    } else {
      errors.push(...stageRes.errors);
    }
  }

  for (const [idx, item] of rawTemplateStages.entries()) {
    const stageRes = validateStageDefinition(
      item,
      `templateStages[${idx}]`,
      true,
      allowSingleArch,
    );
    if (stageRes.ok) {
      templateStages.push(stageRes.stage);
    } else {
      errors.push(...stageRes.errors);
    }
  }

  if (treatmentStages.length === 0 && errors.length === 0) {
    errors.push("Case manifest must contain at least one treatment stage.");
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const hasUpper = treatmentStages.some((s) => Boolean(s.upper));
  const hasLower = treatmentStages.some((s) => Boolean(s.lower));

  return {
    ok: true,
    manifest: {
      caseId,
      patientName,
      archType: archType || (hasUpper && hasLower ? "both" : hasUpper ? "upper" : "lower"),
      hasUpper,
      hasLower,
      treatmentStages,
      templateStages,
      ambiguities: [],
    },
  };
}

function validateStageDefinition(
  raw: unknown,
  path: string,
  forceDoctorOnly = false,
  allowSingleArch = false,
): { ok: true; stage: StageDefinition } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, errors: [`${path}: stage must be an object.`] };
  }

  const s = raw as Record<string, unknown>;
  const id = typeof s.id === "string" ? s.id.trim() : "";
  if (!id) errors.push(`${path}: missing 'id'.`);

  const stageNumber =
    typeof s.stageNumber === "number" && !isNaN(s.stageNumber)
      ? s.stageNumber
      : undefined;

  const label =
    typeof s.label === "string" && s.label.trim()
      ? s.label.trim()
      : stageNumber !== undefined
        ? `Stage ${stageNumber}`
        : id;

  const doctorOnly = forceDoctorOnly || Boolean(s.doctorOnly);

  const upper = s.upper ? validateArchAsset(s.upper, `${path}.upper`) : null;
  const lower = s.lower ? validateArchAsset(s.lower, `${path}.lower`) : null;

  if (s.upper && upper && !upper.ok) errors.push(...upper.errors);
  if (s.lower && lower && !lower.ok) errors.push(...lower.errors);

  if (!allowSingleArch) {
    if (!s.upper) errors.push(`${path}.upper: missing required asset.`);
    if (!s.lower) errors.push(`${path}.lower: missing required asset.`);
  } else {
    if (!s.upper && !s.lower) {
      errors.push(`${path}: stage must have at least an upper or lower arch asset.`);
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    stage: {
      id,
      stageNumber,
      label,
      doctorOnly,
      upper: upper && upper.ok ? upper.asset : undefined,
      lower: lower && lower.ok ? lower.asset : undefined,
    },
  };
}

function validateArchAsset(
  raw: unknown,
  path: string,
): { ok: true; asset: ArchAsset } | { ok: false; errors: string[] } {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, errors: [`${path}: must be an asset object.`] };
  }
  const a = raw as Record<string, unknown>;
  const filename = typeof a.filename === "string" ? a.filename.trim() : "";
  if (!filename) {
    return { ok: false, errors: [`${path}: missing 'filename'.`] };
  }
  const url = typeof a.url === "string" ? a.url : undefined;
  const sizeBytes = typeof a.sizeBytes === "number" ? a.sizeBytes : undefined;

  return {
    ok: true,
    asset: {
      filename,
      url,
      sizeBytes,
    },
  };
}

// ─── Dynamic Pairing & Ambiguity Detection ───────────────────────────────────

/**
 * Attempts to pair a collection of raw STL files into structured stages.
 * If ambiguities, missing pairs, or conflicting assignments occur, they are
 * recorded in `ambiguities` rather than guessed.
 */
export function pairTreatmentFiles(
  files: readonly RawFileDescriptor[],
  caseId = "dental-case",
  patientName?: string,
): CaseManifest {
  const ambiguities: string[] = [];

  interface ClassifiedFile {
    readonly descriptor: RawFileDescriptor;
    readonly arch: ArchKind;
    readonly role: StageRole;
    readonly stageKey: string;
    readonly stageNumber?: number;
  }

  const classified: ClassifiedFile[] = [];

  for (const file of files) {
    const filename = file.name;
    const nameLower = filename.toLowerCase();

    // 1. Determine Arch
    let arch: ArchKind | null = file.arch ?? null;
    if (!arch) {
      const isUpper =
        nameLower.includes("upper") ||
        nameLower.includes("maxillary") ||
        nameLower.includes("_u_") ||
        nameLower.includes("_u.") ||
        nameLower.startsWith("u_");
      const isLower =
        nameLower.includes("lower") ||
        nameLower.includes("mandibular") ||
        nameLower.includes("_l_") ||
        nameLower.includes("_l.") ||
        nameLower.startsWith("l_");

      if (isUpper && !isLower) {
        arch = "upper";
      } else if (isLower && !isUpper) {
        arch = "lower";
      } else {
        ambiguities.push(
          `Ambiguous arch for file "${filename}": cannot definitively identify whether it is upper or lower jaw.`,
        );
        continue;
      }
    }

    // 2. Determine Role (doctor template vs treatment model)
    let role: StageRole = file.role ?? "treatment";
    if (!file.role) {
      if (
        nameLower.includes("template") ||
        nameLower.includes("reference") ||
        nameLower.includes("original") ||
        nameLower.includes("pre-op")
      ) {
        role = "doctor-template";
      } else {
        role = "treatment";
      }
    }

    // 3. Determine Stage Key & Stage Number
    let stageKey = file.stageKey;
    let stageNumber: number | undefined;

    if (!stageKey) {
      if (role === "doctor-template") {
        // Template stages may have stage tags or simply be "template"
        const numMatch = filename.match(/\b0*(\d+)\b/);
        stageKey = numMatch ? `template-${numMatch[1]}` : "template";
      } else {
        // Look for stage number pattern e.g. " - 01 - ", "Stage 5", "_05", "step 2"
        const stageMatch =
          filename.match(/stage[_\s-]*(\d+)/i) ??
          filename.match(/step[_\s-]*(\d+)/i) ??
          filename.match(/-\s*0*(\d+)\s*-/) ??
          filename.match(/[_\s]0*(\d+)[_\s]/) ??
          filename.match(/(\d+)/);

        if (stageMatch?.[1]) {
          stageNumber = parseInt(stageMatch[1], 10);
          stageKey = `stage-${String(stageNumber).padStart(2, "0")}`;
        } else {
          ambiguities.push(
            `Ambiguous stage number for file "${filename}": could not extract stage number from filename.`,
          );
          continue;
        }
      }
    }

    classified.push({
      descriptor: file,
      arch,
      role,
      stageKey,
      stageNumber,
    });
  }

  // 4. Group by stageKey
  const stageGroups = new Map<
    string,
    {
      role: StageRole;
      stageNumber?: number;
      uppers: ClassifiedFile[];
      lowers: ClassifiedFile[];
    }
  >();

  for (const item of classified) {
    let group = stageGroups.get(item.stageKey);
    if (!group) {
      group = {
        role: item.role,
        stageNumber: item.stageNumber,
        uppers: [],
        lowers: [],
      };
      stageGroups.set(item.stageKey, group);
    }
    if (item.arch === "upper") {
      group.uppers.push(item);
    } else {
      group.lowers.push(item);
    }
  }

  const treatmentStages: StageDefinition[] = [];
  const templateStages: StageDefinition[] = [];

  // 5. Verify 1:1 pairings for every stage
  for (const [key, group] of stageGroups.entries()) {
    const stageLabel =
      group.role === "doctor-template"
        ? "Template (Doctor Reference)"
        : group.stageNumber !== undefined
          ? `Stage ${group.stageNumber}`
          : key;

    if (group.uppers.length === 0) {
      ambiguities.push(
        `Missing upper jaw model for ${stageLabel} (key: "${key}"). Lower model "${group.lowers[0]?.descriptor.name}" has no pair.`,
      );
      continue;
    }
    if (group.lowers.length === 0) {
      ambiguities.push(
        `Missing lower jaw model for ${stageLabel} (key: "${key}"). Upper model "${group.uppers[0]?.descriptor.name}" has no pair.`,
      );
      continue;
    }
    if (group.uppers.length > 1) {
      ambiguities.push(
        `Multiple upper jaw models for ${stageLabel}: [${group.uppers.map((u) => `"${u.descriptor.name}"`).join(", ")}]. Explicit manifest mapping required.`,
      );
      continue;
    }
    if (group.lowers.length > 1) {
      ambiguities.push(
        `Multiple lower jaw models for ${stageLabel}: [${group.lowers.map((l) => `"${l.descriptor.name}"`).join(", ")}]. Explicit manifest mapping required.`,
      );
      continue;
    }

    const upperFile = group.uppers[0]!.descriptor;
    const lowerFile = group.lowers[0]!.descriptor;

    const stageDef: StageDefinition = {
      id: key,
      stageNumber: group.stageNumber,
      label: stageLabel,
      doctorOnly: group.role === "doctor-template",
      upper: {
        filename: upperFile.name,
        url: upperFile.url,
        file: upperFile.file,
        sizeBytes: upperFile.size,
      },
      lower: {
        filename: lowerFile.name,
        url: lowerFile.url,
        file: lowerFile.file,
        sizeBytes: lowerFile.size,
      },
    };

    if (group.role === "doctor-template") {
      templateStages.push(stageDef);
    } else {
      treatmentStages.push(stageDef);
    }
  }

  // Sort treatment stages by stageNumber if present, or by stageKey
  treatmentStages.sort((a, b) => {
    if (a.stageNumber !== undefined && b.stageNumber !== undefined) {
      return a.stageNumber - b.stageNumber;
    }
    return a.id.localeCompare(b.id, undefined, { numeric: true });
  });

  return {
    caseId,
    patientName,
    treatmentStages,
    templateStages,
    ambiguities,
  };
}
