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

    const adminSupabase = createAdminClient();
    const { data: fileData, error: downloadErr } = await adminSupabase.storage
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

    // 2. Use admin client with service role key to bypass storage RLS on updates
    const adminSupabase = createAdminClient();

    // Fetch existing manifest so we preserve patientName, archType, stages, etc.
    let existingManifest: any = {};
    const { data: fileData, error: downloadErr } = await adminSupabase.storage
      .from("treatment-models")
      .download(`${caseId}/manifest.json`);

    if (!downloadErr && fileData) {
      try {
        const text = await fileData.text();
        existingManifest = JSON.parse(text);
      } catch {
        existingManifest = {};
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

    const { error: uploadErr } = await adminSupabase.storage
      .from("treatment-models")
      .upload(`${caseId}/manifest.json`, manifestBlob, {
        contentType: "application/json",
        cacheControl: "0",
        upsert: true,
      });

    if (uploadErr) {
      console.error("Storage upload error with admin client:", uploadErr);
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

