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
  const stages = item.total_stages || 1;

  const rawUpper =
    item.upper_stages ??
    item.doctor_notes?.aligner_counts?.upper ??
    cachedCounts?.upper;
  const rawLower =
    item.lower_stages ??
    item.doctor_notes?.aligner_counts?.lower ??
    cachedCounts?.lower;

  const hasBoth = rawUpper != null && rawUpper > 0 && rawLower != null && rawLower > 0;

  const isUpperOnly = !hasBoth && item.patient_name.includes("[Upper]");
  const isLowerOnly = !hasBoth && item.patient_name.includes("[Lower]");

  if (isUpperOnly) {
    const upper = rawUpper || stages;
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
    const lower = rawLower || stages;
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
  const upper = rawUpper ?? stages;
  const lower = rawLower ?? stages;

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

export function buildWhatsAppShareText({
  patientName,
  patientId,
  stages,
  metadataBadgeText,
  archBadgeText,
  clinicName,
  shareUrl,
}: {
  patientName: string;
  patientId?: string | null;
  stages: number;
  metadataBadgeText?: string;
  archBadgeText?: string;
  clinicName?: string | null;
  shareUrl: string;
}): string {
  const lines: string[] = [
    `🦷 *Orthodontic 3D Treatment Progression*`,
    `*Patient:* ${patientName}${patientId ? ` (#${patientId})` : ""}`,
  ];

  if (metadataBadgeText) {
    lines.push(`*Prescription:* ${metadataBadgeText}`);
  }
  if (stages) {
    lines.push(`*Stages:* ${stages} Stages${archBadgeText ? ` (${archBadgeText})` : ""}`);
  }
  if (clinicName) {
    lines.push(`*Clinic:* ${clinicName}`);
  }

  lines.push(
    ``,
    `🔗 *Interactive 3D Progression Link:*`,
    `${shareUrl}`,
    ``,
    `_Open in your browser to inspect 3D tooth movements, aligner stages & attachments._`
  );

  return lines.join("\n");
}

export function getWhatsAppShareUrl({
  text,
  phoneNumber,
}: {
  text: string;
  phoneNumber?: string;
}): string {
  const encodedText = encodeURIComponent(text);
  const cleanPhone = (phoneNumber || "").replace(/[^\d]/g, "");
  if (cleanPhone) {
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
  }
  return `https://api.whatsapp.com/send?text=${encodedText}`;
}

