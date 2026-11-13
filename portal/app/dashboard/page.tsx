import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export interface DentalCase {
  id: string;
  dentist_id: string;
  patient_name: string;
  clinic_name?: string | null;
  clinic_email?: string | null;
  doctor_name?: string | null;
  is_refinement?: boolean | null;
  patient_id?: string | null;
  patient_age?: number | null;
  patient_sex?: string | null;
  ipr?: any[] | null;
  doctor_notes?: any | null;
  total_stages: number;
  upper_stages?: number | null;
  lower_stages?: number | null;
  expires_at?: string | null;
  is_revoked?: boolean | null;
  share_token: string;
  status: "ready" | "processing" | "archived" | "revoked";
  created_at: string;
  updated_at: string;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Enforce authentication gate: unauthenticated visitors must log in
  if (!user) {
    redirect("/auth/login");
  }

  // Strict multi-account isolation: query only cases belonging to this specific doctor
  const { data: rawCases, error } = await supabase
    .from("cases")
    .select("*")
    .eq("dentist_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching cases for dentist:", error);
  }

  // Hydrate custom fields stored inside JSONB doctor_notes for databases without custom columns
  const initialCases: DentalCase[] = ((rawCases as any[]) || []).map((c) => {
    const notes =
      c.doctor_notes && typeof c.doctor_notes === "object" ? c.doctor_notes : {};
    return {
      ...c,
      doctor_name:
        c.doctor_name || notes.assigned_doctor || notes.doctor_name || null,
      clinic_name: c.clinic_name || notes.clinic_name || null,
      clinic_email: c.clinic_email || notes.clinic_email || null,
      patient_id: c.patient_id || notes.patient_id || null,
      is_refinement:
        c.is_refinement !== undefined && c.is_refinement !== null
          ? c.is_refinement
          : (notes.is_refinement ?? false),
    };
  });

  return (
    <DashboardClient
      email={user.email ?? "Doctor"}
      userId={user.id}
      initialCases={initialCases}
    />
  );
}