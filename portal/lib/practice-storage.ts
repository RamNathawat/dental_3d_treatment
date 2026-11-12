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
  const local = getLocalDoctors(userId);
  if (local.length > 0) return local;

  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("doctors")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (!error && data && data.length > 0) {
      const records: DoctorRecord[] = data.map((d: any) => ({
        id: d.id,
        userId: d.user_id,
        name: d.name,
        doctorId: d.doctor_id,
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

  let target: DoctorRecord;
  let updatedList: DoctorRecord[];

  if (doc.id) {
    target = {
      ...doc,
      id: doc.id,
      userId,
      createdAt: current.find((d) => d.id === doc.id)?.createdAt || now,
      updatedAt: now,
    };
    updatedList = current.map((d) => (d.id === doc.id ? target : d));
  } else {
    target = {
      ...doc,
      id: crypto.randomUUID(),
      userId,
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

  if (local.length > 0) return local;

  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("clinics")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (!error && data && data.length > 0) {
      const records: ClinicRecord[] = data.map((c: any) => ({
        id: c.id,
        userId: c.user_id,
        name: c.name,
        clinicId: c.clinic_id,
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

  let target: ClinicRecord;
  let updatedList: ClinicRecord[];

  if (clinic.id) {
    target = {
      ...clinic,
      id: clinic.id,
      userId,
      createdAt: current.find((c) => c.id === clinic.id)?.createdAt || now,
      updatedAt: now,
    };
    updatedList = current.map((c) => (c.id === clinic.id ? target : c));
  } else {
    target = {
      ...clinic,
      id: crypto.randomUUID(),
      userId,
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

