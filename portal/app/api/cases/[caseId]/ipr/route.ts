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
      if (Array.isArray(manifest.ipr) && manifest.ipr.length > 0) {
        return NextResponse.json({ ipr: manifest.ipr, manifest });
      }
    }

    // 2. Fallback: check database cases table
    const supabase = await createServerClient();
    const { data: dbCase } = await supabase
      .from("cases")
      .select("ipr")
      .eq("id", caseId)
      .single();

    if (dbCase && Array.isArray(dbCase.ipr) && dbCase.ipr.length > 0) {
      return NextResponse.json({ ipr: dbCase.ipr });
    }

    // 3. Fallback to authenticated storage download
    const { data: fileData, error: downloadErr } = await supabase.storage
      .from("treatment-models")
      .download(`${caseId}/manifest.json`);

    if (downloadErr || !fileData) {
      return NextResponse.json({ ipr: [] });
    }

    const text = await fileData.text();
    const manifest = JSON.parse(text);
    return NextResponse.json({ ipr: manifest.ipr || [], manifest });
  } catch (err: any) {
    return NextResponse.json({ ipr: [] });
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
    const { ipr } = body;

    if (!Array.isArray(ipr)) {
      return NextResponse.json({ error: "Invalid IPR payload: expected an array." }, { status: 400 });
    }

    // 1.5. Always persist to database cases table (instant, zero-cache, RLS-friendly)
    let dbUpdateSucceeded = false;
    try {
      const { error: dbErr } = await supabase
        .from("cases")
        .update({ ipr })
        .eq("id", caseId);
      if (!dbErr) dbUpdateSucceeded = true;
      else console.warn("Could not update ipr column in cases table:", dbErr.message);
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
      ipr,
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
      console.warn("Storage upload warning with storage client:", uploadErr);
      if (dbUpdateSucceeded) {
        // Saved safely to Postgres database
        return NextResponse.json({ success: true, count: ipr.length, source: "database" });
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

    return NextResponse.json({ success: true, count: ipr.length });
  } catch (err: any) {
    console.error("API IPR update error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error occurred." },
      { status: 500 }
    );
  }
}
