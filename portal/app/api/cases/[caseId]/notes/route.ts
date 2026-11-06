import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  props: { params: Promise<{ caseId: string }> }
) {
  try {
    const params = await props.params;
    const { caseId } = params;

    // 1. Try public storage URL first (fastest and requires zero auth tokens)
    const publicUrl = `https://yrjulcwnabnhgtqebrtn.supabase.co/storage/v1/object/public/treatment-models/${caseId}/manifest.json?t=${Date.now()}`;
    const pubRes = await fetch(publicUrl, { cache: "no-store" });
    if (pubRes.ok) {
      const manifest = await pubRes.json();
      const dn = manifest.doctorNotes;
      if (
        dn &&
        (dn.general ||
          dn.doctorName ||
          dn.clinicName ||
          (Array.isArray(dn.stageRemarks) && dn.stageRemarks.length > 0))
      ) {
        return NextResponse.json({
          doctorNotes: manifest.doctorNotes,
          manifest,
        });
      }
    }

    // 2. Fallback: check database cases table (zero-cache, resilient to storage RLS)
    const supabase = await createServerClient();
    const adminSupabase = createAdminClient();
    const dbClient = adminSupabase || supabase;
    const { data: dbCase } = await dbClient
      .from("cases")
      .select("doctor_notes")
      .eq("id", caseId)
      .single();

    if (
      dbCase?.doctor_notes &&
      (dbCase.doctor_notes.general ||
        dbCase.doctor_notes.doctorName ||
        dbCase.doctor_notes.clinicName ||
        (Array.isArray(dbCase.doctor_notes.stageRemarks) &&
          dbCase.doctor_notes.stageRemarks.length > 0))
    ) {
      return NextResponse.json({ doctorNotes: dbCase.doctor_notes });
    }

    // 3. Fallback to authenticated storage download
    const { data: fileData, error: downloadErr } = await supabase.storage
      .from("treatment-models")
      .download(`${caseId}/manifest.json`);

    if (downloadErr || !fileData) {
      return NextResponse.json({ doctorNotes: null });
    }

    const text = await fileData.text();
    const manifest = JSON.parse(text);
    return NextResponse.json({
      doctorNotes: manifest.doctorNotes || null,
      manifest,
    });
  } catch (err: any) {
    return NextResponse.json({ doctorNotes: null });
  }
}

export async function POST(
  req: Request,
  props: { params: Promise<{ caseId: string }> }
) {
  try {
    const params = await props.params;
    const { caseId } = params;

    if (!caseId) {
      return NextResponse.json({ error: "Missing caseId parameter." }, { status: 400 });
    }

    // 1. Verify doctor session
    const supabase = await createServerClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const body = await req.json();
    const { doctorNotes } = body;

    if (!doctorNotes || typeof doctorNotes !== "object") {
      return NextResponse.json(
        { error: "Invalid payload: doctorNotes object required." },
        { status: 400 }
      );
    }

    // 1.5. Always persist to database cases table (instant, zero-cache, RLS-friendly)
    let dbUpdateSucceeded = false;
    const notesWithDate = {
      ...doctorNotes,
      updatedAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
    try {
      const adminClient = createAdminClient();
      const dbClient = adminClient || supabase;
      const { error: dbErr } = await dbClient
        .from("cases")
        .update({ doctor_notes: notesWithDate })
        .eq("id", caseId);
      if (!dbErr) dbUpdateSucceeded = true;
      else console.warn("Could not update doctor_notes in cases table:", dbErr.message);
    } catch (e) {
      console.warn("DB update error:", e);
    }

    // 2. Fetch existing manifest from public storage or storage client
    let existingManifest: any = {};
    try {
      const publicUrl = `https://yrjulcwnabnhgtqebrtn.supabase.co/storage/v1/object/public/treatment-models/${caseId}/manifest.json?t=${Date.now()}`;
      const pubRes = await fetch(publicUrl);
      if (pubRes.ok) {
        existingManifest = await pubRes.json();
      }
    } catch {
      existingManifest = {};
    }

    if (!existingManifest.caseId) {
      const { data: fileData } = await supabase.storage
        .from("treatment-models")
        .download(`${caseId}/manifest.json`);
      if (fileData) {
        try {
          existingManifest = JSON.parse(await fileData.text());
        } catch {}
      }
    }

    const updatedManifest = {
      ...existingManifest,
      caseId,
      doctorNotes: {
        ...doctorNotes,
        updatedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      },
    };

    const manifestBlob = new Blob([JSON.stringify(updatedManifest, null, 2)], {
      type: "application/json",
    });

    // 3. Choose storage client: admin client if valid JWT service_role key exists, otherwise doctor session client
    const adminSupabase = createAdminClient();
    const storageClient = adminSupabase || supabase;

    const { error: uploadErr } = await storageClient.storage
      .from("treatment-models")
      .upload(`${caseId}/manifest.json`, manifestBlob, {
        contentType: "application/json",
        cacheControl: "0",
        upsert: true,
      });

    if (uploadErr) {
      console.warn("Storage upload warning for doctor notes:", uploadErr);
      if (dbUpdateSucceeded) {
        return NextResponse.json({
          success: true,
          doctorNotes: updatedManifest.doctorNotes,
          source: "database",
        });
      }

      const isRls = uploadErr.message?.toLowerCase().includes("row-level security");
      const isJws = uploadErr.message?.toLowerCase().includes("compact jws");

      if (isRls) {
        return NextResponse.json(
          {
            error:
              "Storage UPDATE policy missing: Please add the UPDATE policy for 'treatment-models' in your Supabase SQL Editor (see portal/supabase/migrations/20261105_allow_update_treatment_models_storage.sql).",
          },
          { status: 403 }
        );
      }

      if (isJws) {
        return NextResponse.json(
          {
            error:
              "Invalid service_role key: Supabase Storage requires the JWT service_role key (starts with eyJ...) from Project Settings > API.",
          },
          { status: 403 }
        );
      }

      return NextResponse.json({ error: uploadErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      doctorNotes: updatedManifest.doctorNotes,
    });
  } catch (err: any) {
    console.error("API doctor notes update error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error occurred." },
      { status: 500 }
    );
  }
}
