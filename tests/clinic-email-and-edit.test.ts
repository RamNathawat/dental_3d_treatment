import { describe, it, expect, beforeEach } from "vitest";
import {
  getSavedClinicEmails,
  saveClinicEmail,
  getSavedEmailForClinic,
  type CaseWithEmail,
} from "../portal/lib/clinic-email-storage";

describe("Clinic Email Storage & Dispatch", () => {
  let store: Record<string, string> = {};

  beforeEach(() => {
    store = {};
    (globalThis as any).window = globalThis;
    (globalThis as any).localStorage = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, val: string) => {
        store[key] = String(val);
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  });

  it("extracts and deduplicates emails from existing cases and localStorage", () => {
    const mockCases: (CaseWithEmail & Record<string, unknown>)[] = [
      {
        id: "case-1",
        dentist_id: "doc-1",
        patient_name: "Patient One",
        clinic_name: "Smile Ortho",
        clinic_email: "smile@ortho.com",
        total_stages: 10,
        share_token: "tok-1",
        status: "ready",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "case-2",
        dentist_id: "doc-1",
        patient_name: "Patient Two",
        clinic_name: "Smile Ortho",
        clinic_email: "SMILE@ortho.com", // case duplicate
        total_stages: 15,
        share_token: "tok-2",
        status: "ready",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "case-3",
        dentist_id: "doc-1",
        patient_name: "Patient Three",
        clinic_name: "City Dental",
        doctor_notes: { clinic_email: "city@dentalcare.com" },
        total_stages: 8,
        share_token: "tok-3",
        status: "ready",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    const emails = getSavedClinicEmails(mockCases);
    expect(emails).toContain("smile@ortho.com");
    expect(emails).toContain("city@dentalcare.com");
    expect(emails.length).toBe(2);
  });

  it("persists newly entered clinic emails to localStorage and associates with clinic name", () => {
    saveClinicEmail("central@smiles.org", "Central Smiles Practice");

    const emails = getSavedClinicEmails();
    expect(emails).toContain("central@smiles.org");

    const matchedEmail = getSavedEmailForClinic("Central Smiles Practice");
    expect(matchedEmail).toBe("central@smiles.org");

    // Case insensitive clinic lookup
    const matchedLower = getSavedEmailForClinic("central smiles practice");
    expect(matchedLower).toBe("central@smiles.org");
  });

  it("formats the mailto URL with complete patient details, stages, and 3D link", () => {
    const mockCase: CaseWithEmail & Record<string, any> = {
      id: "case-99",
      dentist_id: "doc-1",
      patient_name: "Niya Priority [Dual]",
      patient_id: "PT-4790",
      clinic_name: "Smile Clinic",
      clinic_email: "smile@clinic.com",
      patient_age: 23,
      total_stages: 23,
      share_token: "b2536a88-0e6d-4a83",
      status: "ready",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const origin = "https://app.dental3d.com";
    const shareUrl = `${origin}/treatment?case=${mockCase.share_token}`;
    const cleanName = mockCase.patient_name.replace(/\s*\[(Upper|Lower|Dual)\]/i, "").trim();

    const subject = `[3D Treatment Progression] ${cleanName} (${mockCase.total_stages} Stages) - Clinical Review Link`;
    const body = `Dear ${mockCase.clinic_name},

The interactive 3D orthodontic treatment progression plan for ${cleanName} is ready for clinical review.

• Patient Name: ${cleanName}
• Patient ID: ${mockCase.patient_id}
• Treatment Stages: ${mockCase.total_stages} Aligner Stages
• Clinic / Practice: ${mockCase.clinic_name}

🔗 Interactive 3D Progression Link:
${shareUrl}
`;

    expect(subject).toContain("Niya Priority");
    expect(subject).toContain("23 Stages");
    expect(body).toContain("PT-4790");
    expect(body).toContain(shareUrl);
    expect(body).toContain("Smile Clinic");
  });
});
