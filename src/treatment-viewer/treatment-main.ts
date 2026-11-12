/**
 * Entry point for the treatment viewer page.
 * Loads dynamic cases from Supabase Cloud Storage when `?case=<token>` is present.
 */
import "./treatment.css";
import { createTreatmentApp, type TreatmentAppHandle } from "./treatment-app";
import { normalizeManifestStages, type CaseManifest } from "./stage-manifest";
import { purgeStaleIndexedDBCache } from "./model-loader";

declare global {
  interface Window {
    __dentalTreatmentApp?: TreatmentAppHandle | null;
    __initDentalTreatmentViewer?: () => Promise<void>;
  }
}

function getRoot(): HTMLElement | null {
  return document.querySelector<HTMLElement>("#app");
}

function showEmptyState(
  title: string,
  message: string,
  buttonHref: string,
  buttonText: string,
) {
  const root = getRoot();
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

function showSecurityGateState(opts: {
  type: "revoked" | "expired";
  patientName: string;
  clinicName?: string | null;
  clinicEmail?: string | null;
  expiredDate?: Date | null;
}) {
  const root = getRoot();
  if (!root) return;

  const isRevoked = opts.type === "revoked";
  const title = isRevoked ? "Link No Longer Active" : "Treatment Link Expired";
  const iconSvg = `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>`;

  const badgeBg = "rgba(245, 158, 11, 0.12)";
  const badgeBorder = "rgba(245, 158, 11, 0.3)";
  const badgeShadow = "rgba(245, 158, 11, 0.2)";

  const dateFormatted = opts.expiredDate
    ? opts.expiredDate.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "its scheduled duration";

  const message = isRevoked
    ? "This 3D treatment preview is no longer available or the preview session has concluded. For patient privacy and data security, this link is no longer accessible."
    : `This shared treatment plan link expired on ${dateFormatted}. Treatment progression links are time-limited for patient privacy.`;

  const clinicName = opts.clinicName ? opts.clinicName : "your dental clinic or care team";
  const contactEmail = opts.clinicEmail ? opts.clinicEmail.trim() : null;

  root.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; width: 100vw; background: radial-gradient(circle at 50% 28%, #161b26 0%, #090c13 100%); color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center; padding: 24px; box-sizing: border-box;">
      <div style="width: 72px; height: 72px; border-radius: 20px; background: ${badgeBg}; border: 1px solid ${badgeBorder}; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; box-shadow: 0 0 35px ${badgeShadow};">
        ${iconSvg}
      </div>
      <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 12px 0; color: #ffffff; letter-spacing: -0.02em;">${title}</h1>
      <p style="font-size: 14px; line-height: 1.6; color: #94a3b8; max-width: 480px; margin: 0 0 28px 0;">${message}</p>
      
      <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 18px 24px; max-width: 420px; width: 100%; margin-bottom: 24px; box-sizing: border-box;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; color: #64748b; margin-bottom: 6px;">Next Step</div>
        <div style="font-size: 14px; color: #e2e8f0; font-weight: 500; margin-bottom: ${contactEmail ? "14px" : "0"};">
          Please contact <strong style="color: #ffd166;">${clinicName}</strong> to request an updated or extended link.
        </div>
        ${
          contactEmail
            ? `<a href="mailto:${contactEmail}?subject=${encodeURIComponent(
                `[3D Treatment Plan] Request New Link - ${opts.patientName}`,
              )}&body=${encodeURIComponent(
                `Hello,\n\nThe 3D progression link for ${opts.patientName} is no longer active. Could you please generate and send a new link?\n\nThank you!`,
              )}" style="display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: #38bdf8; text-decoration: none; font-weight: 500; background: rgba(56, 189, 248, 0.1); padding: 8px 16px; border-radius: 8px; border: 1px solid rgba(56, 189, 248, 0.25);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                Email Clinic: ${contactEmail}
              </a>`
            : ""
        }
      </div>
    </div>
  `;
}

export async function initTreatmentViewer(): Promise<void> {
  // Dispose any existing viewer instance before initializing a new one
  if (typeof window !== "undefined" && window.__dentalTreatmentApp) {
    try {
      window.__dentalTreatmentApp.dispose();
    } catch (e) {
      console.warn("Disposal of previous viewer instance:", e);
    }
    window.__dentalTreatmentApp = null;
  }

  const root = getRoot();
  if (root === null) return;

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
        cache: "no-store",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
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

        // Parse doctor_notes if string or object
        const notesObj =
          typeof caseRecord.doctor_notes === "string"
            ? (() => {
                try {
                  return JSON.parse(caseRecord.doctor_notes);
                } catch {
                  return {};
                }
              })()
            : caseRecord.doctor_notes && typeof caseRecord.doctor_notes === "object"
            ? caseRecord.doctor_notes
            : {};

        // Milestone 3: Access Control & Expiration Validation
        let localCache: any = null;
        if (typeof window !== "undefined" && caseId) {
          try {
            const raw = localStorage.getItem(`dental_link_access_${caseId}`);
            if (raw) localCache = JSON.parse(raw);
          } catch {}
        }

        const isRevoked = Boolean(
          caseRecord.is_revoked === true ||
            caseRecord.is_revoked === "true" ||
            caseRecord.status === "revoked" ||
            notesObj?.link_access?.is_revoked === true ||
            notesObj?.link_access?.is_revoked === "true" ||
            localCache?.isRevoked === true
        );
        if (isRevoked) {
          showSecurityGateState({
            type: "revoked",
            patientName,
            clinicName: caseRecord.clinic_name,
            clinicEmail: caseRecord.clinic_email,
          });
          return;
        }

        const expiresAtStr =
          caseRecord.expires_at ??
          notesObj?.link_access?.expires_at ??
          localCache?.expiresAt ??
          null;
        if (expiresAtStr) {
          const expiresAtTime = new Date(expiresAtStr).getTime();
          if (!isNaN(expiresAtTime) && expiresAtTime < Date.now()) {
            showSecurityGateState({
              type: "expired",
              patientName,
              clinicName: caseRecord.clinic_name,
              clinicEmail: caseRecord.clinic_email,
              expiredDate: new Date(expiresAtStr),
            });
            return;
          }
        }

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
        const versionTag = caseRecord.updated_at
          ? new Date(caseRecord.updated_at).getTime()
          : Date.now();

        // Purge any stale IndexedDB and memory cache entries for this case that don't match versionTag
        await purgeStaleIndexedDBCache(caseId, versionTag);

        const appendVersion = (url: string | undefined, version: number | string): string | undefined => {
          if (!url) return undefined;
          try {
            const parsed = new URL(url, window.location.href);
            parsed.searchParams.set("v", String(version));
            return parsed.toString();
          } catch {
            const clean = url.split("?")[0];
            return `${clean}?v=${version}`;
          }
        };

        // Live sync: if the user edits or re-enters models in another tab, auto-reload this view
        if (typeof window !== "undefined" && !(window as any).__dentalViewerSyncListenerAttached) {
          (window as any).__dentalViewerSyncListenerAttached = true;
          window.addEventListener("storage", (e) => {
            if (e.key === "dental_viewer_sync" && e.newValue) {
              try {
                const syncData = JSON.parse(e.newValue);
                if (syncData.caseId === caseId) {
                  window.location.reload();
                }
              } catch {}
            }
          });
        }

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
              // Check actual model assets present in the manifest
              const manifestHasUpper = storedManifest.treatmentStages.some((st: any) => Boolean(st.upper));
              const manifestHasLower = storedManifest.treatmentStages.some((st: any) => Boolean(st.lower));

              if (manifestHasUpper && manifestHasLower) {
                storedManifest.archType = "both";
                storedManifest.hasUpper = true;
                storedManifest.hasLower = true;
                // Strip obsolete single-arch [Upper] or [Lower] suffix if both arches exist
                if (storedManifest.patientName) {
                  storedManifest.patientName = storedManifest.patientName
                    .replace(/\s*\[(Upper|Lower|Dual)\]/i, "")
                    .trim();
                }
              } else if (manifestHasUpper && !manifestHasLower) {
                storedManifest.archType = "upper";
                storedManifest.hasUpper = true;
                storedManifest.hasLower = false;
              } else if (!manifestHasUpper && manifestHasLower) {
                storedManifest.archType = "lower";
                storedManifest.hasUpper = false;
                storedManifest.hasLower = true;
              } else {
                // If manifest stages do not specify, fallback to DB designation
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
              }

              normalizeManifestStages(storedManifest, storageFiles);

              // Ensure every model URL has the case version tag to bypass stale browser & IndexedDB caches
              for (const st of storedManifest.treatmentStages) {
                if (st.upper?.url) {
                  (st as any).upper = {
                    ...st.upper,
                    url: appendVersion(st.upper.url, versionTag)!,
                  };
                }
                if (st.lower?.url) {
                  (st as any).lower = {
                    ...st.lower,
                    url: appendVersion(st.lower.url, versionTag)!,
                  };
                }
              }

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
              if (!storedManifest.doctorName && (caseRecord.doctor_name || notesObj?.assigned_doctor)) {
                (storedManifest as any).doctorName = caseRecord.doctor_name || notesObj?.assigned_doctor;
              }
              if (caseRecord.is_refinement || notesObj?.is_refinement) {
                (storedManifest as any).isRefinement = true;
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
          doctorName: caseRecord.doctor_name || notesObj?.assigned_doctor || undefined,
          isRefinement: Boolean(caseRecord.is_refinement || notesObj?.is_refinement),
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

        // Ensure every model URL has the case version tag to bypass stale browser & IndexedDB caches
        for (const st of dynamicManifest.treatmentStages) {
          if (st.upper?.url) {
            (st as any).upper = {
              ...st.upper,
              url: appendVersion(st.upper.url, versionTag)!,
            };
          }
          if (st.lower?.url) {
            (st as any).lower = {
              ...st.lower,
              url: appendVersion(st.lower.url, versionTag)!,
            };
          }
        }

        const app = createTreatmentApp(root!, { caseManifest: dynamicManifest });
        if (typeof window !== "undefined") {
          window.__dentalTreatmentApp = app;
        }
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
    const errMsg = err instanceof Error ? err.message : String(err);
    const isWebGLError = /webgl|context/i.test(errMsg);

    if (isWebGLError) {
      showEmptyState(
        "WebGL Hardware Acceleration Needed",
        "Your browser or graphics hardware temporarily suspended WebGL context. Please ensure hardware acceleration is enabled in your browser settings and click below to reload the viewer.",
        window.location.href,
        "Reload 3D Viewer",
      );
    } else {
      showEmptyState(
        "Error Loading Case",
        "Could not retrieve this treatment case. Please check your connection or return to the dashboard.",
        "/dashboard",
        "Go to Dashboard",
      );
    }
  }
}

if (typeof window !== "undefined") {
  window.__initDentalTreatmentViewer = initTreatmentViewer;
}

initTreatmentViewer();
