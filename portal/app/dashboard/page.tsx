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
  const { data: cases, error } = await supabase
    .from("cases")
    .select("*")
    .eq("dentist_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching cases for dentist:", error);
  }

  return (
    <DashboardClient
      email={user.email ?? "Doctor"}
      userId={user.id}
      initialCases={(cases as DentalCase[]) || []}
    />
  );
}