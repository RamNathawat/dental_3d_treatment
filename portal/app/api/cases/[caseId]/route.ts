import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  props: { params: Promise<{ caseId: string }> }
) {
  try {
    const params = await props.params;
    const { caseId } = params;

    if (!caseId) {
      return NextResponse.json({ error: "Missing caseId parameter." }, { status: 400 });
    }

    // 1. Verify user session
    const supabase = await createServerClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const body = await req.json();
    const {
      patient_name,
      clinic_name,
      clinic_email,
      doctor_name,
      is_refinement,
      patient_id,
      patient_age,
      patient_sex,
      doctor_notes,
    } = body;

    const adminClient = createAdminClient();
    const dbClient = adminClient || supabase;

    // Fetch existing case to merge notes
    const { data: existingCase } = await dbClient
      .from("cases")
      .select("*")
      .eq("id", caseId)
      .maybeSingle();

    const existingNotes =
      existingCase?.doctor_notes && typeof existingCase.doctor_notes === "object"
        ? existingCase.doctor_notes
        : {};

    const updatedDoctorNotes = {
      ...existingNotes,
      ...(doctor_notes || {}),
      assigned_doctor: doctor_name || existingNotes.assigned_doctor || undefined,
      doctor_name: doctor_name || existingNotes.doctor_name || undefined,
      clinic_name: clinic_name || existingNotes.clinic_name || undefined,
      clinic_email: clinic_email || existingNotes.clinic_email || undefined,
      is_refinement: is_refinement !== undefined ? is_refinement : existingNotes.is_refinement,
      updatedAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    // 2. Try updating database row with full payload
    const updatePayload: Record<string, unknown> = {
      patient_name: patient_name || existingCase?.patient_name,
      doctor_notes: updatedDoctorNotes,
      updated_at: new Date().toISOString(),
    };

    if (clinic_name !== undefined) updatePayload.clinic_name = clinic_name;
    if (clinic_email !== undefined) updatePayload.clinic_email = clinic_email;
    if (patient_id !== undefined) updatePayload.patient_id = patient_id;
    if (patient_age !== undefined) updatePayload.patient_age = patient_age;
    if (patient_sex !== undefined) updatePayload.patient_sex = patient_sex;

    let dbUpdateSuccess = false;
    const { error: updateErr } = await dbClient
      .from("cases")
      .update(updatePayload)
      .eq("id", caseId);

    if (!updateErr) {
      dbUpdateSuccess = true;
    } else {
      console.warn("Primary DB update returned error, attempting fallback:", updateErr.message);
      // Fallback: strip optional columns that might not exist in database schema
      delete updatePayload.clinic_email;
      delete updatePayload.patient_age;
      delete updatePayload.patient_sex;
      const { error: retryErr } = await dbClient
        .from("cases")
        .update(updatePayload)
        .eq("id", caseId);

      if (!retryErr) {
        dbUpdateSuccess = true;
      } else {
        console.warn("Fallback DB update failed, saving core patient_name & notes:", retryErr.message);
        await dbClient
          .from("cases")
          .update({
            patient_name: patient_name || existingCase?.patient_name,
            doctor_notes: updatedDoctorNotes,
            updated_at: new Date().toISOString(),
          })
          .eq("id", caseId);
      }
    }

    // 3. Update manifest.json in Supabase Storage
    try {
      const publicUrl = `https://yrjulcwnabnhgtqebrtn.supabase.co/storage/v1/object/public/treatment-models/${caseId}/manifest.json?t=${Date.now()}`;
      const pubRes = await fetch(publicUrl, { cache: "no-store" });
      let manifest: any = {};
      if (pubRes.ok) {
        manifest = await pubRes.json();
      }

      if (patient_name) manifest.patientName = patient_name.replace(/\s*\[(Upper|Lower|Dual)\]/i, "").trim();
      if (patient_id) manifest.patientId = patient_id;
      if (clinic_name !== undefined) manifest.clinicName = clinic_name || undefined;
      if (clinic_email !== undefined) manifest.clinicEmail = clinic_email || undefined;
      if (doctor_name !== undefined) manifest.doctorName = doctor_name || undefined;
      if (is_refinement !== undefined) manifest.isRefinement = is_refinement;
      if (patient_age !== undefined) manifest.patientAge = patient_age ?? undefined;
      if (patient_sex !== undefined) manifest.patientSex = patient_sex ?? undefined;
      manifest.doctorNotes = updatedDoctorNotes;

      const blob = new Blob([JSON.stringify(manifest, null, 2)], {
        type: "application/json",
      });

      await dbClient.storage
        .from("treatment-models")
        .upload(`${caseId}/manifest.json`, blob, {
          contentType: "application/json",
          cacheControl: "0",
          upsert: true,
        });
    } catch (storageErr) {
      console.warn("Could not update manifest.json in storage:", storageErr);
    }

    return NextResponse.json({
      ok: true,
      case: {
        id: caseId,
        patient_name: patient_name || existingCase?.patient_name,
        clinic_name: clinic_name ?? existingCase?.clinic_name,
        clinic_email: clinic_email ?? existingCase?.clinic_email,
        doctor_name: doctor_name ?? existingNotes.assigned_doctor,
        is_refinement: is_refinement ?? existingNotes.is_refinement,
        patient_id: patient_id ?? existingCase?.patient_id,
        patient_age: patient_age ?? existingCase?.patient_age,
        patient_sex: patient_sex ?? existingCase?.patient_sex,
        doctor_notes: updatedDoctorNotes,
      },
    });
  } catch (err: any) {
    console.error("Error in case update API route:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error." },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  props: { params: Promise<{ caseId: string }> }
) {
  return PATCH(req, props);
}

