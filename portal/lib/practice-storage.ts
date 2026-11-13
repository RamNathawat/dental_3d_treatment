/**
 * Practice & Multi-Tenant Storage Service
 * Handles persistence for Practice Profiles, Doctors, and Clinics.
 * Scoped per user with seamless localStorage fallback and Supabase sync.
 */

import type { PracticeProfile, DoctorRecord, ClinicRecord } from "./practice-types";
import { createClient } from "./supabase/client";

const PROFILE_KEY_PREFIX = "dental_practice_profile_";
const DOCTORS_KEY_PREFIX = "dental_doctors_";
const CLINICS_KEY_PREFIX = "dental_clinics_";

// ── Profile Operations ──────────────────────────────────────────────────────

export function getLocalPracticeProfile(userId: string): PracticeProfile | null {
  if (typeof window === "undefined" || !userId) return null;
  try {
    const raw = localStorage.getItem(`${PROFILE_KEY_PREFIX}${userId}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveLocalPracticeProfile(userId: string, profile: PracticeProfile): void {
  if (typeof window === "undefined" || !userId) return;
  try {
    localStorage.setItem(`${PROFILE_KEY_PREFIX}${userId}`, JSON.stringify(profile));
  } catch {}
}

export async function fetchPracticeProfile(userId: string, defaultEmail?: string): Promise<PracticeProfile | null> {
  const local = getLocalPracticeProfile(userId);
  if (local) return local;

  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("practice_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!error && data) {
      const profile: PracticeProfile = {
        id: data.id,
        userId: data.user_id,
        firmType: data.firm_type || "lab",
        firmName: data.firm_name || "Orthodontic 3D Studio",
        brandName: data.brand_name || data.firm_name || "Orthodontic 3D",
        logoUrl: data.logo_url || null,
        email: data.email || defaultEmail || "",
        phone: data.phone || "",
        address: data.address || "",
        website: data.website || "",
        createdAt: data.created_at || new Date().toISOString(),
        updatedAt: data.updated_at || new Date().toISOString(),
      };
      saveLocalPracticeProfile(userId, profile);
      return profile;
    }
  } catch {
    // Supabase table may not exist yet, fallback cleanly
  }

  return local;
}

export async function savePracticeProfile(
  userId: string,
  updates: Partial<PracticeProfile> & { firmName: string; brandName: string }
): Promise<PracticeProfile> {
  const existing = getLocalPracticeProfile(userId);
  const now = new Date().toISOString();

  const profile: PracticeProfile = {
    id: existing?.id || crypto.randomUUID(),
    userId,
    firmType: updates.firmType || existing?.firmType || "lab",
    firmName: updates.firmName,
    brandName: updates.brandName,
    logoUrl: updates.logoUrl !== undefined ? updates.logoUrl : existing?.logoUrl || null,
    email: updates.email || existing?.email || "",
    phone: updates.phone || existing?.phone || "",
    address: updates.address || existing?.address || "",
    website: updates.website || existing?.website || "",
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  saveLocalPracticeProfile(userId, profile);

  // Background sync to Supabase if table exists
  const supabase = createClient();
  try {
    await supabase.from("practice_profiles").upsert(
      {
        id: profile.id,
        user_id: userId,
        firm_type: profile.firmType,
        firm_name: profile.firmName,
        brand_name: profile.brandName,
        logo_url: profile.logoUrl,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        website: profile.website,
        updated_at: now,
      },
      { onConflict: "user_id" }
    );
  } catch {}

  return profile;
}

// ── Doctors Operations ──────────────────────────────────────────────────────

export function getLocalDoctors(userId: string): DoctorRecord[] {
  if (typeof window === "undefined" || !userId) return [];
  try {
    const raw = localStorage.getItem(`${DOCTORS_KEY_PREFIX}${userId}`);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLocalDoctors(userId: string, doctors: DoctorRecord[]): void {
  if (typeof window === "undefined" || !userId) return;
  try {
    localStorage.setItem(`${DOCTORS_KEY_PREFIX}${userId}`, JSON.stringify(doctors));
  } catch {}
}

export async function fetchDoctors(userId: string): Promise<DoctorRecord[]> {
  let local = getLocalDoctors(userId);
  let hasHealed = false;

  // Auto-heal any doctors missing doctorId
  if (local.length > 0) {
    local = local.map((doc, idx) => {
      if (!doc.doctorId || !doc.doctorId.trim()) {
        hasHealed = true;
        return {
          ...doc,
          doctorId: `DOC-${String(idx + 1).padStart(2, "0")}`,
        };
      }
      return doc;
    });
    if (hasHealed) {
      saveLocalDoctors(userId, local);
    }
    return local;
  }

  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("doctors")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (!error && data && data.length > 0) {
      const records: DoctorRecord[] = data.map((d: any, idx: number) => ({
        id: d.id,
        userId: d.user_id,
        name: d.name,
        doctorId: d.doctor_id || `DOC-${String(idx + 1).padStart(2, "0")}`,
        email: d.email,
        phone: d.phone,
        specialization: d.specialization,
        notes: d.notes,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }));
      saveLocalDoctors(userId, records);
      return records;
    }
  } catch {}

  return local;
}

export async function saveDoctor(
  userId: string,
  doc: {
    id?: string;
    name: string;
    doctorId?: string;
    email?: string;
    phone?: string;
    specialization?: string;
    notes?: string;
  }
): Promise<DoctorRecord> {
  const current = getLocalDoctors(userId);
  const now = new Date().toISOString();

  // Ensure doctorId is always generated if empty/undefined
  let assignedDoctorId = doc.doctorId?.trim();
  if (!assignedDoctorId) {
    if (doc.id) {
      const existing = current.find((d) => d.id === doc.id);
      if (existing?.doctorId) assignedDoctorId = existing.doctorId;
    }
    if (!assignedDoctorId) {
      const existingNums = current
        .map((d) => {
          const m = (d.doctorId || "").match(/DOC-(\d+)/i);
          return m && m[1] ? parseInt(m[1], 10) : 0;
        })
        .filter((n) => !isNaN(n) && n > 0);
      const nextNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : current.length + 1;
      assignedDoctorId = `DOC-${String(nextNum).padStart(2, "0")}`;
    }
  }

  let target: DoctorRecord;
  let updatedList: DoctorRecord[];

  if (doc.id) {
    target = {
      ...doc,
      id: doc.id,
      userId,
      doctorId: assignedDoctorId,
      createdAt: current.find((d) => d.id === doc.id)?.createdAt || now,
      updatedAt: now,
    };
    updatedList = current.map((d) => (d.id === doc.id ? target : d));
  } else {
    target = {
      ...doc,
      id: crypto.randomUUID(),
      userId,
      doctorId: assignedDoctorId,
      createdAt: now,
      updatedAt: now,
    };
    updatedList = [...current, target];
  }

  saveLocalDoctors(userId, updatedList);

  const supabase = createClient();
  try {
    await supabase.from("doctors").upsert({
      id: target.id,
      user_id: userId,
      name: target.name,
      doctor_id: target.doctorId,
      email: target.email,
      phone: target.phone,
      specialization: target.specialization,
      notes: target.notes,
      updated_at: now,
    });
  } catch {}

  return target;
}

export async function deleteDoctor(userId: string, doctorId: string): Promise<void> {
  const current = getLocalDoctors(userId);
  const updatedList = current.filter((d) => d.id !== doctorId);
  saveLocalDoctors(userId, updatedList);

  const supabase = createClient();
  try {
    await supabase.from("doctors").delete().eq("id", doctorId).eq("user_id", userId);
  } catch {}
}

// ── Clinics Operations ──────────────────────────────────────────────────────

export function getLocalClinics(userId: string): ClinicRecord[] {
  if (typeof window === "undefined" || !userId) return [];
  try {
    const raw = localStorage.getItem(`${CLINICS_KEY_PREFIX}${userId}`);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLocalClinics(userId: string, clinics: ClinicRecord[]): void {
  if (typeof window === "undefined" || !userId) return;
  try {
    localStorage.setItem(`${CLINICS_KEY_PREFIX}${userId}`, JSON.stringify(clinics));
  } catch {}
}

export async function fetchClinics(userId: string, existingClinicNames: string[] = []): Promise<ClinicRecord[]> {
  let local = getLocalClinics(userId);
  let hasHealed = false;

  // Auto-seed from existing cases if clinics list is completely fresh
  if (local.length === 0 && existingClinicNames.length > 0) {
    const uniqueNames = Array.from(new Set(existingClinicNames.filter(Boolean)));
    if (uniqueNames.length > 0) {
      local = uniqueNames.map((name, idx) => ({
        id: crypto.randomUUID(),
        userId,
        name,
        clinicId: `CLN-0${idx + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      saveLocalClinics(userId, local);
      return local;
    }
  }

  // Auto-heal any existing clinics missing clinicId
  if (local.length > 0) {
    local = local.map((cln, idx) => {
      if (!cln.clinicId || !cln.clinicId.trim()) {
        hasHealed = true;
        return {
          ...cln,
          clinicId: `CLN-${String(idx + 1).padStart(2, "0")}`,
        };
      }
      return cln;
    });
    if (hasHealed) {
      saveLocalClinics(userId, local);
    }
    return local;
  }

  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("clinics")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (!error && data && data.length > 0) {
      const records: ClinicRecord[] = data.map((c: any, idx: number) => ({
        id: c.id,
        userId: c.user_id,
        name: c.name,
        clinicId: c.clinic_id || `CLN-${String(idx + 1).padStart(2, "0")}`,
        address: c.address,
        email: c.email,
        phone: c.phone,
        notes: c.notes,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      }));
      saveLocalClinics(userId, records);
      return records;
    }
  } catch {}

  return local;
}

export async function saveClinic(
  userId: string,
  clinic: {
    id?: string;
    name: string;
    clinicId?: string;
    address?: string;
    email?: string;
    phone?: string;
    notes?: string;
  }
): Promise<ClinicRecord> {
  const current = getLocalClinics(userId);
  const now = new Date().toISOString();

  // Ensure clinicId is always generated if empty/undefined
  let assignedClinicId = clinic.clinicId?.trim();
  if (!assignedClinicId) {
    if (clinic.id) {
      const existing = current.find((c) => c.id === clinic.id);
      if (existing?.clinicId) assignedClinicId = existing.clinicId;
    }
    if (!assignedClinicId) {
      const existingNums = current
        .map((c) => {
          const m = (c.clinicId || "").match(/CLN-(\d+)/i);
          return m && m[1] ? parseInt(m[1], 10) : 0;
        })
        .filter((n) => !isNaN(n) && n > 0);
      const nextNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : current.length + 1;
      assignedClinicId = `CLN-${String(nextNum).padStart(2, "0")}`;
    }
  }

  let target: ClinicRecord;
  let updatedList: ClinicRecord[];

  if (clinic.id) {
    target = {
      ...clinic,
      id: clinic.id,
      userId,
      clinicId: assignedClinicId,
      createdAt: current.find((c) => c.id === clinic.id)?.createdAt || now,
      updatedAt: now,
    };
    updatedList = current.map((c) => (c.id === clinic.id ? target : c));
  } else {
    target = {
      ...clinic,
      id: crypto.randomUUID(),
      userId,
      clinicId: assignedClinicId,
      createdAt: now,
      updatedAt: now,
    };
    updatedList = [...current, target];
  }

  saveLocalClinics(userId, updatedList);

  const supabase = createClient();
  try {
    await supabase.from("clinics").upsert({
      id: target.id,
      user_id: userId,
      name: target.name,
      clinic_id: target.clinicId,
      address: target.address,
      email: target.email,
      phone: target.phone,
      notes: target.notes,
      updated_at: now,
    });
  } catch {}

  return target;
}

export async function deleteClinic(userId: string, clinicId: string): Promise<void> {
  const current = getLocalClinics(userId);
  const updatedList = current.filter((c) => c.id !== clinicId);
  saveLocalClinics(userId, updatedList);

  const supabase = createClient();
  try {
    await supabase.from("clinics").delete().eq("id", clinicId).eq("user_id", userId);
  } catch {}
}

// ── Profile Health & Case Match Helpers ─────────────────────────────────────

export function isDoctorProfileIncomplete(doc: DoctorRecord): boolean {
  return !doc.email?.trim() || !doc.phone?.trim();
}

export function getDoctorMissingFields(doc: DoctorRecord): string[] {
  const missing: string[] = [];
  if (!doc.email?.trim()) missing.push("email");
  if (!doc.phone?.trim()) missing.push("phone");
  return missing;
}

export function isClinicProfileIncomplete(cln: ClinicRecord): boolean {
  return !cln.email?.trim() || !cln.phone?.trim() || !cln.address?.trim();
}

export function getClinicMissingFields(cln: ClinicRecord): string[] {
  const missing: string[] = [];
  if (!cln.email?.trim()) missing.push("email");
  if (!cln.phone?.trim()) missing.push("phone");
  if (!cln.address?.trim()) missing.push("address");
  return missing;
}

export function matchCaseToClinic(
  c: { clinic_name?: string | null; clinic_id?: string | null },
  cln: ClinicRecord
): boolean {
  const caseClinic = (c.clinic_name || "").trim().toLowerCase();
  const clnName = (cln.name || "").trim().toLowerCase();
  if (!caseClinic || !clnName) return false;
  return caseClinic === clnName;
}

export function matchCaseToDoctor(
  c: { doctor_name?: string | null; doctor_notes?: any },
  doc: DoctorRecord
): boolean {
  const notes = c.doctor_notes && typeof c.doctor_notes === "object" ? c.doctor_notes : {};
  const rawAssigned = (notes.assigned_doctor || c.doctor_name || "").trim();
  if (!rawAssigned) return false;
  const caseDocClean = rawAssigned.toLowerCase().replace(/^dr\.?\s*/i, "").trim();
  const docClean = (doc.name || "").toLowerCase().replace(/^dr\.?\s*/i, "").trim();
  if (!caseDocClean || !docClean) return false;
  return caseDocClean === docClean;
}

