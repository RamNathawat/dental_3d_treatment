/**
 * Entry point for the treatment viewer page.
 * Loads dynamic cases from Supabase Cloud Storage when `?case=<token>` is present.
 */
import "./treatment.css";
import { createTreatmentApp } from "./treatment-app";
import { normalizeManifestStages, type CaseManifest } from "./stage-manifest";

const root = document.querySelector<HTMLElement>("#app");
if (root === null) throw new Error("The page has no #app mount point.");

function showEmptyState(
  title: string,
  message: string,
  buttonHref: string,
  buttonText: string,
) {
  if (!root) return;
  root.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; width: 100vw; background: radial-gradient(circle at 50% 30%, #151821 0%, #0a0b0e 100%); color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center; padding: 24px; box-sizing: border-box;">
      <div style="width: 64px; height: 64px; border-radius: 16px; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.25); display: flex; align-items: center; justify-content: center; margin-bottom: 24px; box-shadow: 0 0 30px rgba(56, 189, 248, 0.15);">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 12px 0; color: #ffffff; letter-spacing: -0.02em;">${title}</h1>
      <p style="font-size: 14px; line-height: 1.6; color: #94a3b8; max-width: 440px; margin: 0 0 28px 0;">${message}</p>
      <a href="${buttonHref}" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; border-radius: 10px; background: #2563eb; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 500; transition: background 0.15s ease; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);">
        ${buttonText}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14"/>
          <path d="m12 5 7 7-7 7"/>
        </svg>
      </a>
    </div>
  `;
}

async function init() {
  const params = new URLSearchParams(window.location.search);
  const shareToken = params.get("case");

  if (!shareToken || shareToken === "demo") {
    showEmptyState(
      "No Case Selected",
      "Only uploaded treatment cases can be viewed. Please select or upload a case from the Doctor Dashboard.",
      "/dashboard",
      "Go to Dashboard",
    );
    return;
  }

  try {
    const supabaseUrl = "https://yrjulcwnabnhgtqebrtn.supabase.co";
    const supabaseKey = "sb_publishable_REBvv8NOv8KPkDHw3mVnnQ_rzM2165H";
    const res = await fetch(
      `${supabaseUrl}/rest/v1/cases?share_token=eq.${encodeURIComponent(shareToken)}&select=*`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      },
    );

    if (res.ok) {
      const rows = await res.json();
      if (rows && rows.length > 0) {
        const caseRecord = rows[0];
        const totalStages = caseRecord.total_stages || 0;
        const patientName = caseRecord.patient_name || "Patient";
        const caseId = caseRecord.id;

        if (totalStages === 0) {
          showEmptyState(
            "No 3D Models in Case",
            `Case "${patientName}" has no stages uploaded yet. Please upload aligner stages from the dashboard.`,
            "/dashboard",
            "Go to Dashboard",
          );
          return;
        }

        const baseStorage = `${supabaseUrl}/storage/v1/object/public/treatment-models/${caseId}`;

        // Discover genuine uploaded model files for each arch to safely resolve unequal upper/lower stage counts
        let storageFiles: string[] | undefined = undefined;
        try {
          const listRes = await fetch(`${supabaseUrl}/storage/v1/object/list/treatment-models`, {
            method: "POST",
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ prefix: caseId, limit: 300 }),
          });
          if (listRes.ok) {
            const rawList = await listRes.json();
            if (Array.isArray(rawList)) {
              storageFiles = rawList.map((f: { name: string }) => f.name);
            }
          }
        } catch (listErr) {
          console.info("Could not list storage files, relying on manifest/runtime fallback:", listErr);
        }

        // 1. First attempt to load stored manifest.json if present (with zero-cache buster)
        try {
          const manifestRes = await fetch(`${baseStorage}/manifest.json?t=${Date.now()}`, {
            cache: "no-store",
          });
          if (manifestRes.ok) {
            const storedManifest = await manifestRes.json();
            if (
              storedManifest &&
              Array.isArray(storedManifest.treatmentStages) &&
              storedManifest.treatmentStages.length > 0
            ) {
              // Sync single-arch designation from database caseRecord if present
              const isDbUpperOnly = caseRecord.patient_name?.includes("[Upper]");
              const isDbLowerOnly = caseRecord.patient_name?.includes("[Lower]");

              if (isDbUpperOnly) {
                storedManifest.archType = "upper";
                storedManifest.hasUpper = true;
                storedManifest.hasLower = false;
                if (!storedManifest.patientName?.includes("[Upper]")) {
                  storedManifest.patientName = `${storedManifest.patientName || ""} [Upper]`.trim();
                }
              } else if (isDbLowerOnly) {
                storedManifest.archType = "lower";
                storedManifest.hasUpper = false;
                storedManifest.hasLower = true;
                if (!storedManifest.patientName?.includes("[Lower]")) {
                  storedManifest.patientName = `${storedManifest.patientName || ""} [Lower]`.trim();
                }
              }

              normalizeManifestStages(storedManifest, storageFiles);

              // Merge in database records if manifest is missing any recent fields
              if ((!storedManifest.ipr || storedManifest.ipr.length === 0) && Array.isArray(caseRecord.ipr) && caseRecord.ipr.length > 0) {
                storedManifest.ipr = caseRecord.ipr;
              }
              const dbNotes = caseRecord.doctor_notes || caseRecord.doctorNotes;
              const storedHasNotes = Boolean(
                storedManifest.doctorNotes &&
                (storedManifest.doctorNotes.general ||
                 storedManifest.doctorNotes.doctorName ||
                 storedManifest.doctorNotes.clinicName ||
                 (Array.isArray(storedManifest.doctorNotes.stageRemarks) && storedManifest.doctorNotes.stageRemarks.length > 0))
              );
              if (dbNotes && (!storedHasNotes || !storedManifest.doctorNotes)) {
                storedManifest.doctorNotes = dbNotes;
              }
              if (!storedManifest.patientId && caseRecord.patient_id) {
                storedManifest.patientId = caseRecord.patient_id;
              }
              if (!storedManifest.clinicName && caseRecord.clinic_name) {
                storedManifest.clinicName = caseRecord.clinic_name;
              }
              if (storedManifest.patientAge == null && caseRecord.patient_age != null) {
                storedManifest.patientAge = Number(caseRecord.patient_age);
              }
              if (!storedManifest.patientSex && caseRecord.patient_sex) {
                storedManifest.patientSex = caseRecord.patient_sex;
              }

              createTreatmentApp(root!, { caseManifest: storedManifest });
              return;
            }
          }
        } catch (manifestErr) {
          console.info("Using fallback dynamic manifest generator:", manifestErr);
        }

        // 2. Dynamic manifest fallback (supports Upper-only, Lower-only, or Dual-arch)
        const isUpperOnly = patientName.includes("[Upper]");
        const isLowerOnly = patientName.includes("[Lower]");
        const hasUpper = !isLowerOnly;
        const hasLower = !isUpperOnly;
        const cleanPatientName = patientName.replace(/\s*\[(Upper|Lower|Dual)\]/i, "").trim();

        const dynamicManifest: CaseManifest = {
          caseId: caseId,
          patientName: isUpperOnly ? `${cleanPatientName} [Upper]` : isLowerOnly ? `${cleanPatientName} [Lower]` : cleanPatientName,
          patientId: caseRecord.patient_id || undefined,
          patientAge: caseRecord.patient_age != null ? Number(caseRecord.patient_age) : undefined,
          patientSex: caseRecord.patient_sex || undefined,
          clinicName: caseRecord.clinic_name || undefined,
          archType: isUpperOnly ? "upper" : isLowerOnly ? "lower" : "both",
          hasUpper,
          hasLower,
          ipr: (Array.isArray(caseRecord.ipr) ? caseRecord.ipr : []) as any,
          doctorNotes: caseRecord.doctor_notes || caseRecord.doctorNotes || undefined,
          treatmentStages: Array.from({ length: totalStages }, (_, i) => {
            const stageNum = i + 1;
            const pad = String(stageNum).padStart(2, "0");
            const upperFilename = `${cleanPatientName} Upper jaw - ${pad} - Model.glb`;
            const lowerFilename = `${cleanPatientName} Lower jaw - ${pad} - Model.glb`;

            return {
              id: `stage-${pad}`,
              stageNumber: stageNum,
              label: `Stage ${stageNum}`,
              doctorOnly: false,
              upper: hasUpper
                ? {
                    filename: upperFilename,
                    url: `${baseStorage}/${encodeURIComponent(upperFilename)}`,
                  }
                : undefined,
              lower: hasLower
                ? {
                    filename: lowerFilename,
                    url: `${baseStorage}/${encodeURIComponent(lowerFilename)}`,
                  }
                : undefined,
            };
          }),
          templateStages: [],
          ambiguities: [],
        };

        normalizeManifestStages(dynamicManifest, storageFiles);
        createTreatmentApp(root!, { caseManifest: dynamicManifest });
        return;
      }
    }
    showEmptyState(
      "Case Not Found",
      "The requested treatment case could not be found or has no uploaded models.",
      "/dashboard",
      "Go to Dashboard",
    );
  } catch (err) {
    console.warn("Could not load dynamic case from cloud:", err);
    showEmptyState(
      "Error Loading Case",
      "Could not retrieve this treatment case. Please check your connection or return to the dashboard.",
      "/dashboard",
      "Go to Dashboard",
    );
  }
}

init();
