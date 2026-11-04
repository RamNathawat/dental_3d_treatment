/**
 * Entry point for the treatment viewer page.
 * Loads dynamic cases from Supabase Cloud Storage when `?case=<token>` is present.
 */
import "./treatment.css";
import { createTreatmentApp } from "./treatment-app";
import type { CaseManifest } from "./stage-manifest";

const root = document.querySelector<HTMLElement>("#app");
if (root === null) throw new Error("The page has no #app mount point.");

async function init() {
  const params = new URLSearchParams(window.location.search);
  const shareToken = params.get("case");

  if (shareToken && shareToken !== "demo") {
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
          const totalStages = caseRecord.total_stages || 1;
          const patientName = caseRecord.patient_name || "Patient";
          const caseId = caseRecord.id;

          const dynamicManifest: CaseManifest = {
            caseId: caseId,
            patientName: patientName,
            treatmentStages: Array.from({ length: totalStages }, (_, i) => {
              const stageNum = i + 1;
              const pad = String(stageNum).padStart(2, "0");
              const upperFilename = `${patientName} Upper jaw - ${pad} - Model.glb`;
              const lowerFilename = `${patientName} Lower jaw - ${pad} - Model.glb`;
              const baseStorage = `${supabaseUrl}/storage/v1/object/public/treatment-models/${caseId}`;

              return {
                id: `stage-${pad}`,
                stageNumber: stageNum,
                label: `Stage ${stageNum}`,
                doctorOnly: false,
                upper: {
                  filename: upperFilename,
                  url: `${baseStorage}/${encodeURIComponent(upperFilename)}`,
                },
                lower: {
                  filename: lowerFilename,
                  url: `${baseStorage}/${encodeURIComponent(lowerFilename)}`,
                },
              };
            }),
            templateStages: [],
            ambiguities: [],
          };

          createTreatmentApp(root!, { caseManifest: dynamicManifest });
          return;
        }
      }
    } catch (err) {
      console.warn("Could not load dynamic case from cloud:", err);
    }
  }

  // Fallback / default
  createTreatmentApp(root!);
}

init();
