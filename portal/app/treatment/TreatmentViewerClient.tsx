"use client";

import { useEffect, useState, useRef } from "react";
import { Lock, Clock, Mail, AlertCircle, ArrowLeft } from "lucide-react";

interface SecurityGateData {
  type: "revoked" | "expired";
  patientName: string;
  clinicName: string | null;
  clinicEmail: string | null;
  expiredDateFormatted?: string | null;
}

export default function TreatmentViewerClient() {
  const [gateState, setGateState] = useState<SecurityGateData | null>(null);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [hasNoCase, setHasNoCase] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function checkAccessAndInit() {
      if (typeof window === "undefined") return;

      const params = new URLSearchParams(window.location.search);
      const shareToken = params.get("case");

      if (!shareToken || shareToken === "demo") {
        if (isMounted) {
          setIsCheckingAccess(false);
          setHasNoCase(true);
        }
        return;
      }

      try {
        const supabaseUrl =
          process.env.NEXT_PUBLIC_SUPABASE_URL ||
          "https://yrjulcwnabnhgtqebrtn.supabase.co";
        const supabaseKey =
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
          "sb_publishable_REBvv8NOv8KPkDHw3mVnnQ_rzM2165H";

        // Query case metadata with no-cache headers
        const res = await fetch(
          `${supabaseUrl}/rest/v1/cases?share_token=eq.${encodeURIComponent(
            shareToken,
          )}&select=*`,
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

        if (!isMounted) return;

        if (res.ok) {
          const rows = await res.json();
          if (rows && rows.length > 0) {
            const caseRecord = rows[0];
            const patientName = caseRecord.patient_name || "Patient";
            const clinicName = caseRecord.clinic_name || null;
            const clinicEmail = caseRecord.clinic_email || null;

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
                : caseRecord.doctor_notes &&
                  typeof caseRecord.doctor_notes === "object"
                ? caseRecord.doctor_notes
                : {};

            let localCache: any = null;
            if (typeof window !== "undefined" && caseRecord.id) {
              try {
                const raw = localStorage.getItem(`dental_link_access_${caseRecord.id}`);
                if (raw) localCache = JSON.parse(raw);
              } catch {}
            }

            // 1. Check Revocation status
            const isRevoked = Boolean(
              caseRecord.is_revoked === true ||
                caseRecord.is_revoked === "true" ||
                caseRecord.status === "revoked" ||
                notesObj?.link_access?.is_revoked === true ||
                notesObj?.link_access?.is_revoked === "true" ||
                localCache?.isRevoked === true,
            );

            if (isRevoked) {
              setGateState({
                type: "revoked",
                patientName,
                clinicName,
                clinicEmail,
              });
              setIsCheckingAccess(false);
              return;
            }

            // 2. Check Expiration date
            const expiresAtStr =
              caseRecord.expires_at ??
              notesObj?.link_access?.expires_at ??
              localCache?.expiresAt ??
              null;

            if (expiresAtStr) {
              const expiresAtTime = new Date(expiresAtStr).getTime();
              if (!isNaN(expiresAtTime) && expiresAtTime < Date.now()) {
                const expDate = new Date(expiresAtStr);
                setGateState({
                  type: "expired",
                  patientName,
                  clinicName,
                  clinicEmail,
                  expiredDateFormatted: expDate.toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  }),
                });
                setIsCheckingAccess(false);
                return;
              }
            }
          }
        }
      } catch (err) {
        console.warn("Fast access check caught error, falling through to viewer:", err);
      }

      if (!isMounted) return;
      setIsCheckingAccess(false);

      // Access is valid — initialize 3D viewer
      // 1. Ensure stylesheet is loaded
      const expectedCss = "/assets/treatment-main-Dqz2MdVi.css";
      const existingLink = document.querySelector('link[href*="treatment-main"]');
      if (existingLink) {
        if (existingLink.getAttribute("href") !== expectedCss) {
          existingLink.setAttribute("href", expectedCss);
        }
      } else {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = expectedCss;
        document.head.appendChild(link);
      }

      // 2. Load latest viewer bundle with cache-busting timestamp
      if (typeof window !== "undefined" && (window as any).__initDentalTreatmentViewer) {
        (window as any).__initDentalTreatmentViewer();
      } else {
        const script = document.createElement("script");
        script.type = "module";
        script.src = `/assets/treatment-main-D6duOs0o.js?t=${Date.now()}`;
        document.body.appendChild(script);
      }
    }

    checkAccessAndInit();

    // Listen for cross-tab sync events (e.g., when doctor clicks Revoke/Restore in dashboard)
    function handleStorageSync(e: StorageEvent) {
      if (e.key === "dental_viewer_sync" && e.newValue) {
        try {
          const syncData = JSON.parse(e.newValue);
          if (syncData.type === "access") {
            window.location.reload();
          }
        } catch {}
      }
    }

    window.addEventListener("storage", handleStorageSync);

    return () => {
      isMounted = false;
      window.removeEventListener("storage", handleStorageSync);

      // Clean up previous 3D viewer instance on unmount
      if (typeof window !== "undefined" && (window as any).__dentalTreatmentApp) {
        try {
          (window as any).__dentalTreatmentApp.dispose();
        } catch (e) {
          console.warn("Failed to dispose viewer on unmount:", e);
        }
        (window as any).__dentalTreatmentApp = null;
      }
    };
  }, []);

  // ── Render Revoked or Expired Security Gate ────────────────────────────────
  if (gateState) {
    const isRevoked = gateState.type === "revoked";
    const clinicDisplayName =
      gateState.clinicName || "your dental clinic or care team";

    return (
      <div className="fixed inset-0 w-screen h-screen z-50 flex items-center justify-center p-6 bg-[#090c13] text-slate-100 font-sans select-none overflow-y-auto">
        {/* Subtle radial glow background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,#161b26_0%,#090c13_100%)] -z-10" />

        <div className="max-w-md w-full flex flex-col items-center text-center animate-fadeIn">
          {/* Neutral Status Icon Badge */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-6 border shadow-2xl transition-transform bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-amber-500/20">
            <Clock className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            {isRevoked ? "Link No Longer Active" : "Treatment Link Expired"}
          </h1>

          {/* Explanation */}
          <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-sm">
            {isRevoked
              ? "This 3D treatment preview is no longer available or the preview session has concluded. For patient privacy and data security, this link is no longer accessible."
              : `This shared treatment plan link expired on ${
                  gateState.expiredDateFormatted || "its scheduled date"
                }. Treatment progression links are time-limited for patient privacy.`}
          </p>

          {/* Next Step Guidance Card */}
          <div className="w-full p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
              Next Step
            </span>
            <p className="text-sm text-slate-200 font-medium">
              Please contact{" "}
              <strong className="text-[#ffd166]">{clinicDisplayName}</strong> to
              request an updated or extended link.
            </p>

            {gateState.clinicEmail && (
              <div className="pt-1">
                <a
                  href={`mailto:${gateState.clinicEmail}?subject=${encodeURIComponent(
                    `[3D Treatment Plan] Request New Link - ${gateState.patientName}`,
                  )}&body=${encodeURIComponent(
                    `Hello,\n\nThe 3D progression link for ${gateState.patientName} is no longer active. Could you please generate and send a new link?\n\nThank you!`,
                  )}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 transition-colors shadow-2xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Clinic: {gateState.clinicEmail}</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Render No Case Selected ───────────────────────────────────────────────
  if (hasNoCase) {
    return (
      <div className="fixed inset-0 w-screen h-screen z-50 flex items-center justify-center p-6 bg-[#090c13] text-slate-100 font-sans select-none">
        <div className="max-w-md w-full flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-5">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">No Case Selected</h1>
          <p className="text-xs text-slate-400 mb-6 max-w-sm">
            Only uploaded treatment cases can be viewed. Please select or upload a
            case from the Doctor Dashboard.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#e0b457] to-[#c49a45] text-slate-950 hover:brightness-105 transition-all shadow-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go to Dashboard</span>
          </a>
        </div>
      </div>
    );
  }

  // ── Default / Active: Render 3D Viewer Mount Point ─────────────────────────
  return (
    <div
      id="app"
      className="fixed inset-0 w-screen h-screen z-50 bg-[#ebe7e0] dark:bg-[#0f141f] text-slate-800 dark:text-slate-200 overflow-hidden"
    >
      {isCheckingAccess && (
        <div className="flex flex-col items-center justify-center w-full h-full gap-3">
          <div className="w-10 h-10 border-[3.5px] border-amber-300/20 border-t-[#ffd166] rounded-full animate-spin shadow-[0_0_16px_rgba(255,209,102,0.35)]" />
          <p className="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-100">
            Loading 3D Models…
          </p>
        </div>
      )}
    </div>
  );
}
