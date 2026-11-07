export interface TrayBreakdownCase {
  patient_name: string;
  total_stages: number;
  upper_stages?: number | null;
  lower_stages?: number | null;
  doctor_notes?: {
    aligner_counts?: {
      upper: number;
      lower: number;
      total: number;
      is_unequal: boolean;
    };
    [key: string]: unknown;
  } | null;
}

export interface CaseTrayInfo {
  upper: number;
  lower: number;
  total: number;
  isUnequal: boolean;
  isSingle: boolean;
  archType: "upper" | "lower" | "dual";
  archBadgeText: string;
  stepperCenterText: string;
  stepperFinalText: string;
  metadataBadgeText: string;
}

export function getCaseTrayInfo(
  item: TrayBreakdownCase,
  cachedCounts?: { upper: number; lower: number; total: number; isUnequal: boolean }
): CaseTrayInfo {
  const isUpperOnly = item.patient_name.includes("[Upper]");
  const isLowerOnly = item.patient_name.includes("[Lower]");
  const stages = item.total_stages || 1;

  if (isUpperOnly) {
    const upper = item.upper_stages || stages;
    return {
      upper,
      lower: 0,
      total: upper,
      isUnequal: false,
      isSingle: true,
      archType: "upper",
      archBadgeText: `Upper Arch (${upper} Trays)`,
      stepperCenterText: `Upper Arch Alignment • ${upper} Trays`,
      stepperFinalText: `Stage ${String(upper).padStart(2, "0")} (Final)`,
      metadataBadgeText: `${upper} Aligner Trays (Upper Arch Only)`,
    };
  }

  if (isLowerOnly) {
    const lower = item.lower_stages || stages;
    return {
      upper: 0,
      lower,
      total: lower,
      isUnequal: false,
      isSingle: true,
      archType: "lower",
      archBadgeText: `Lower Arch (${lower} Trays)`,
      stepperCenterText: `Lower Arch Alignment • ${lower} Trays`,
      stepperFinalText: `Stage ${String(lower).padStart(2, "0")} (Final)`,
      metadataBadgeText: `${lower} Aligner Trays (Lower Arch Only)`,
    };
  }

  // Dual-arch case: inspect columns, doctor_notes, and cached manifest
  const upper =
    item.upper_stages ??
    item.doctor_notes?.aligner_counts?.upper ??
    cachedCounts?.upper ??
    stages;
  const lower =
    item.lower_stages ??
    item.doctor_notes?.aligner_counts?.lower ??
    cachedCounts?.lower ??
    stages;

  const isUnequal = upper > 0 && lower > 0 && upper !== lower;
  const total = upper + lower;

  if (isUnequal) {
    return {
      upper,
      lower,
      total,
      isUnequal: true,
      isSingle: false,
      archType: "dual",
      archBadgeText: `Dual-Arch (U: ${upper} · L: ${lower})`,
      stepperCenterText: `Dual-Arch (Unequal) • Upper: ${upper} Trays | Lower: ${lower} Trays`,
      stepperFinalText: `Stage ${String(Math.max(upper, lower)).padStart(2, "0")} (Final)`,
      metadataBadgeText: `${total} Total Trays (Upper: ${upper} · Lower: ${lower})`,
    };
  }

  // Equal dual-arch
  return {
    upper,
    lower,
    total,
    isUnequal: false,
    isSingle: false,
    archType: "dual",
    archBadgeText: `Dual-Arch (${total} Trays)`,
    stepperCenterText: `Dual-Arch Alignment • ${upper} Trays Each (${total} Total)`,
    stepperFinalText: `Stage ${String(stages).padStart(2, "0")} (Final)`,
    metadataBadgeText: `${total} Total Trays (${upper} Upper + ${lower} Lower)`,
  };
}

