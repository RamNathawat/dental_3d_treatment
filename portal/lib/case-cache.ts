import type { DentalCase } from "@/app/dashboard/page";

const CASE_CACHE_KEY_PREFIX = "dental_cases_cache_";

export function getLocalCasesCache(userId: string): Record<string, Partial<DentalCase>> {
  if (typeof window === "undefined" || !userId) return {};
  try {
    const raw = localStorage.getItem(`${CASE_CACHE_KEY_PREFIX}${userId}`);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveCaseToLocalCache(userId: string, caseItem: DentalCase): void {
  if (typeof window === "undefined" || !userId || !caseItem.id) return;
  try {
    const cache = getLocalCasesCache(userId);
    cache[caseItem.id] = {
      ...cache[caseItem.id],
      ...caseItem,
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(`${CASE_CACHE_KEY_PREFIX}${userId}`, JSON.stringify(cache));
  } catch (err) {
    console.warn("Could not save case to local cache:", err);
  }
}

export function mergeCasesWithLocalCache(userId: string, serverCases: DentalCase[]): DentalCase[] {
  if (typeof window === "undefined" || !userId) return serverCases;
  try {
    const cache = getLocalCasesCache(userId);
    if (!cache || Object.keys(cache).length === 0) return serverCases;

    return serverCases.map((c) => {
      const cached = cache[c.id];
      if (!cached) return c;

      const mergedNotes = {
        ...(c.doctor_notes && typeof c.doctor_notes === "object" ? c.doctor_notes : {}),
        ...(cached.doctor_notes && typeof cached.doctor_notes === "object" ? cached.doctor_notes : {}),
      };

      const resolvedDoc =
        cached.doctor_name ||
        mergedNotes.assigned_doctor ||
        mergedNotes.doctor_name ||
        c.doctor_name ||
        null;

      const resolvedClinic =
        cached.clinic_name ||
        mergedNotes.clinic_name ||
        c.clinic_name ||
        null;

      return {
        ...c,
        ...cached,
        patient_name: cached.patient_name || c.patient_name,
        clinic_name: resolvedClinic,
        doctor_name: resolvedDoc,
        clinic_email: cached.clinic_email ?? c.clinic_email,
        patient_id: cached.patient_id || c.patient_id,
        is_refinement: cached.is_refinement ?? mergedNotes.is_refinement ?? c.is_refinement,
        patient_age: cached.patient_age ?? c.patient_age,
        patient_sex: cached.patient_sex ?? c.patient_sex,
        doctor_notes: mergedNotes,
      };
    });
  } catch {
    return serverCases;
  }
}

