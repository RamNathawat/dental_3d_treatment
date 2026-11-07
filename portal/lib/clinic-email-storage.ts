export interface CaseWithEmail {
  clinic_email?: string | null;
  doctor_notes?: Record<string, unknown> | null;
}

const STORAGE_KEY_EMAILS = "dental_saved_clinic_emails";
const STORAGE_KEY_MAP = "dental_clinic_email_map";

/**
 * Returns distinct remembered clinic emails from localStorage and from existing case records.
 */
export function getSavedClinicEmails(cases?: CaseWithEmail[]): string[] {
  const emailSet = new Set<string>();

  // 1. Discover from existing case records (works across fresh sessions & devices)
  if (cases && Array.isArray(cases)) {
    for (const c of cases) {
      if (c.clinic_email && typeof c.clinic_email === "string" && c.clinic_email.includes("@")) {
        emailSet.add(c.clinic_email.trim().toLowerCase());
      }
      if (c.doctor_notes && typeof c.doctor_notes === "object" && c.doctor_notes.clinic_email) {
        emailSet.add(String(c.doctor_notes.clinic_email).trim().toLowerCase());
      }
    }
  }

  // 2. Load from localStorage
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_EMAILS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((e) => {
            if (typeof e === "string" && e.includes("@")) {
              emailSet.add(e.trim().toLowerCase());
            }
          });
        }
      }
    } catch {
      // Ignore storage read errors
    }
  }

  return Array.from(emailSet);
}

/**
 * Persists a clinic email to localStorage and optionally associates it with a clinic name.
 */
export function saveClinicEmail(email: string, clinicName?: string | null): void {
  if (typeof window === "undefined" || !email || !email.includes("@")) return;

  const cleanEmail = email.trim().toLowerCase();

  try {
    const raw = localStorage.getItem(STORAGE_KEY_EMAILS);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.map((e) => e.toLowerCase()).includes(cleanEmail)) {
      list.unshift(cleanEmail);
      localStorage.setItem(STORAGE_KEY_EMAILS, JSON.stringify(list.slice(0, 30)));
    }

    if (clinicName && clinicName.trim()) {
      const rawMap = localStorage.getItem(STORAGE_KEY_MAP);
      const map: Record<string, string> = rawMap ? JSON.parse(rawMap) : {};
      map[clinicName.trim().toLowerCase()] = cleanEmail;
      localStorage.setItem(STORAGE_KEY_MAP, JSON.stringify(map));
    }
  } catch {
    // Ignore storage write errors
  }
}

/**
 * Finds the saved email associated with a particular clinic name if previously remembered.
 */
export function getSavedEmailForClinic(clinicName: string): string | null {
  if (typeof window === "undefined" || !clinicName) return null;
  try {
    const rawMap = localStorage.getItem(STORAGE_KEY_MAP);
    if (!rawMap) return null;
    const map = JSON.parse(rawMap);
    return map[clinicName.trim().toLowerCase()] || null;
  } catch {
    return null;
  }
}
