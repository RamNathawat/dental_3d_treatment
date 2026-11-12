"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Share2,
  Copy,
  Check,
  Mail,
  ExternalLink,
  Building2,
  Send,
  Eye,
  Clock,
  Shield,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Sliders,
  Calendar,
  Lock,
  Unlock,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { DentalCase } from "./page";
import {
  getCaseTrayInfo,
  buildWhatsAppShareText,
  getWhatsAppShareUrl,
} from "@/lib/case-tray-info";
import WhatsAppIcon from "./WhatsAppIcon";
import { createClient } from "@/lib/supabase/client";
import {
  getSavedClinicEmails,
  saveClinicEmail,
  getSavedEmailForClinic,
} from "@/lib/clinic-email-storage";
import {
  getCaseLinkAccess,
  calculateExpiryFromDays,
  formatForDateTimeInput,
} from "@/lib/link-access";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseItem: DentalCase;
  doctorName?: string;
  allCases?: DentalCase[];
  onEmailUpdated?: (caseId: string, email: string) => void;
  onCaseUpdated?: (updatedCase: DentalCase) => void;
  onToast?: (msg: string) => void;
}

export default function ShareModal({
  isOpen,
  onClose,
  caseItem,
  doctorName = "Doctor",
  allCases,
  onEmailUpdated,
  onCaseUpdated,
  onToast,
}: ShareModalProps) {
  const [currentCase, setCurrentCase] = useState<DentalCase>(caseItem);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [savedEmails, setSavedEmails] = useState<string[]>([]);
  const [saveAsDefault, setSaveAsDefault] = useState(true);
  const [isUpdatingDb, setIsUpdatingDb] = useState(false);

  // Milestone 3: Expiry & Access Control State (Concept 1: Dual-Linked Hybrid)
  const [neverExpires, setNeverExpires] = useState<boolean>(false);
  const [sliderDays, setSliderDays] = useState<number>(1);
  const [customDate, setCustomDate] = useState<string>("");
  const [isRevoked, setIsRevoked] = useState<boolean>(false);
  const [isSavingAccess, setIsSavingAccess] = useState<boolean>(false);
  const [isRegeneratingToken, setIsRegeneratingToken] = useState<boolean>(false);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const loadedCaseIdRef = useRef<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    if (!isOpen) {
      loadedCaseIdRef.current = null;
      return;
    }

    // Preserve user form adjustments if modal is already open for this case
    if (loadedCaseIdRef.current === caseItem.id) {
      return;
    }

    loadedCaseIdRef.current = caseItem.id;
    setCurrentCase(caseItem);

    // Initialize access state
    const access = getCaseLinkAccess(caseItem);
    setIsRevoked(access.isRevoked);

    if (access.expiresAtDate) {
      setNeverExpires(false);
      setCustomDate(formatForDateTimeInput(access.expiresAtDate));
      const now = Date.now();
      const diffMs = access.expiresAtDate.getTime() - now;
      const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
      setSliderDays(Math.max(1, Math.min(7, days)));
    } else if (caseItem.doctor_notes?.link_access?.never_expires === true) {
      // Explicitly saved by doctor as Never Expires
      setNeverExpires(true);
      setSliderDays(1);
      const defaultFuture = new Date();
      defaultFuture.setDate(defaultFuture.getDate() + 1);
      setCustomDate(formatForDateTimeInput(defaultFuture));
    } else {
      // Default state: 1 Day with Never Expires UNCHECKED
      setNeverExpires(false);
      setSliderDays(1);
      const defaultFuture = new Date();
      defaultFuture.setDate(defaultFuture.getDate() + 1);
      setCustomDate(formatForDateTimeInput(defaultFuture));
    }

    // Load remembered emails
    const remembered = getSavedClinicEmails(allCases);
    setSavedEmails(remembered);

    let initialEmail = "";
    if (caseItem.clinic_email && caseItem.clinic_email.includes("@")) {
      initialEmail = caseItem.clinic_email.trim();
    } else if (
      caseItem.doctor_notes &&
      typeof caseItem.doctor_notes === "object" &&
      caseItem.doctor_notes.clinic_email
    ) {
      initialEmail = String(caseItem.doctor_notes.clinic_email).trim();
    } else if (caseItem.clinic_name) {
      const match = getSavedEmailForClinic(caseItem.clinic_name);
      if (match) initialEmail = match;
    }

    if (!initialEmail && remembered.length > 0) {
      initialEmail = remembered[0];
    }

    setRecipientEmail(initialEmail);
    setCopiedLink(false);
    setCopiedDraft(false);
    setShowRegenerateConfirm(false);
    setShowDatePicker(false);
  }, [isOpen, caseItem, allCases]);

  if (!isOpen) return null;

  const stages = currentCase.total_stages || 1;
  const trayInfo = getCaseTrayInfo(currentCase);
  const displayName = currentCase.patient_name
    .replace(/\s*\[(Upper|Lower|Dual)\]/i, "")
    .trim();

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = `${origin}/treatment?case=${currentCase.share_token}`;
  const accessInfo = getCaseLinkAccess(currentCase);

  // Format projected expiration & duration labels for Concept 1: Dual-Linked Hybrid
  let formattedDateLabel = "Pick Date";
  let formattedDurationLabel = `${sliderDays} Days`;
  let subtextLabel = "";

  if (neverExpires) {
    formattedDurationLabel = "Indefinite";
    formattedDateLabel = "No expiration date";
    subtextLabel = "Link remains accessible indefinitely until manually revoked";
  } else if (customDate) {
    const customD = new Date(customDate);
    if (!isNaN(customD.getTime())) {
      formattedDateLabel = customD.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });

      const diffMs = customD.getTime() - Date.now();
      if (diffMs <= 0) {
        formattedDurationLabel = "Expired";
        subtextLabel = `Link expired on ${formattedDateLabel}`;
      } else {
        const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        if (diffHours <= 24) {
          formattedDurationLabel = `${diffHours} Hour${diffHours === 1 ? "" : "s"}`;
          subtextLabel = `Expires in ${diffHours} hour${diffHours === 1 ? "" : "s"} (${formattedDateLabel})`;
        } else {
          formattedDurationLabel = `${diffDays} Day${diffDays === 1 ? "" : "s"}`;
          subtextLabel = `Expires in ${diffDays} days (${formattedDateLabel})`;
        }
      }
    }
  }

  function handleSliderChange(val: number) {
    setSliderDays(val);
    setNeverExpires(false);
    const d = new Date();
    d.setDate(d.getDate() + val);
    setCustomDate(formatForDateTimeInput(d));
  }

  function handleCustomDateChange(val: string) {
    setCustomDate(val);
    setNeverExpires(false);
    const target = new Date(val);
    if (!isNaN(target.getTime())) {
      const diffMs = target.getTime() - Date.now();
      const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
      setSliderDays(Math.max(1, Math.min(7, days)));
    }
  }

  function handleToggleNeverExpires(checked: boolean) {
    setNeverExpires(checked);
    if (!checked) {
      const days = sliderDays || 1;
      const d = new Date();
      d.setDate(d.getDate() + days);
      setCustomDate(formatForDateTimeInput(d));
      setSliderDays(days);
    }
  }

  function handleToggleDatePicker() {
    if (neverExpires) {
      setNeverExpires(false);
    }
    const nextState = !showDatePicker;
    setShowDatePicker(nextState);
    if (nextState) {
      setTimeout(() => {
        if (dateInputRef.current) {
          try {
            if (typeof dateInputRef.current.showPicker === "function") {
              dateInputRef.current.showPicker();
            } else {
              dateInputRef.current.focus();
            }
          } catch {}
        }
      }, 50);
    }
  }

  function handleQuickAddDays(days: number) {
    setNeverExpires(false);
    const d = new Date();
    d.setDate(d.getDate() + days);
    setCustomDate(formatForDateTimeInput(d));
    if (days <= 7) {
      setSliderDays(days);
    } else {
      setSliderDays(7);
    }
  }

  const emailSubject = trayInfo.isUnequal
    ? `[3D Treatment Progression] ${displayName} (Upper: ${trayInfo.upper} · Lower: ${trayInfo.lower} · ${trayInfo.total} Trays) - Clinical Review Link`
    : `[3D Treatment Progression] ${displayName} (${stages} Stages · ${trayInfo.total} Trays) - Clinical Review Link`;

  const emailBody = `Dear ${currentCase.clinic_name || "Hope you are doing well"},

The interactive 3D orthodontic treatment progression plan for ${displayName} is ready for clinical review.

• Patient Name: ${displayName}
• Patient ID: ${currentCase.patient_id || "N/A"}
• Treatment Trays: ${trayInfo.metadataBadgeText}
• Progression Stages: ${stages} Stages (${trayInfo.archBadgeText})
${currentCase.clinic_name ? `• Clinic / Practice: ${currentCase.clinic_name}\n` : ""}${currentCase.patient_age ? `• Patient Age: ${currentCase.patient_age} yrs\n` : ""}
🔗 Interactive 3D Progression Link:
${shareUrl}

You can rotate, zoom, inspect individual aligner stages, examine tooth movements, and verify attachments directly in any browser on desktop or mobile without installing software.

Best regards,
Dr. ${doctorName}
Orthodontic 3D Clinical Studio`;

  async function persistEmailIfChanged(emailToSave: string) {
    const clean = emailToSave.trim().toLowerCase();
    if (!clean || !clean.includes("@")) return;

    saveClinicEmail(clean, currentCase.clinic_name);

    if (currentCase.clinic_email !== clean && saveAsDefault) {
      setIsUpdatingDb(true);
      try {
        const { error } = await supabase
          .from("cases")
          .update({
            clinic_email: clean,
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentCase.id);

        if (!error && onEmailUpdated) {
          onEmailUpdated(currentCase.id, clean);
        }
      } catch (err) {
        console.warn("Could not persist clinic_email to cases table:", err);
      } finally {
        setIsUpdatingDb(false);
      }
    }
  }

  function handleCopyDirectLink() {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    if (onToast) {
      onToast("Patient share link copied to clipboard");
    }
    setTimeout(() => setCopiedLink(false), 2500);
  }

  function handleShareWhatsApp() {
    const text = buildWhatsAppShareText({
      patientName: displayName,
      patientId: currentCase.patient_id,
      stages,
      metadataBadgeText: trayInfo.metadataBadgeText,
      archBadgeText: trayInfo.archBadgeText,
      clinicName: currentCase.clinic_name,
      shareUrl,
    });
    const url = getWhatsAppShareUrl({ text });
    window.open(url, "_blank", "noopener,noreferrer");
    if (onToast) {
      onToast("WhatsApp opened with 3D progression link");
    }
  }

  function handleOpenMailClient() {
    const to = recipientEmail.trim();
    if (!to) {
      alert("Please enter a recipient email address.");
      return;
    }
    persistEmailIfChanged(to);

    const mailtoUrl = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(
      emailSubject,
    )}&body=${encodeURIComponent(emailBody)}`;

    window.location.href = mailtoUrl;

    if (onToast) {
      onToast(`Email client opened for ${to}`);
    }
  }

  function handleOpenGmail() {
    const to = recipientEmail.trim();
    if (!to) {
      alert("Please enter a recipient email address.");
      return;
    }
    persistEmailIfChanged(to);

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      to,
    )}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    window.open(gmailUrl, "_blank", "noopener,noreferrer");

    if (onToast) {
      onToast(`Gmail compose opened for ${to}`);
    }
  }

  function handleCopyEmailDraft() {
    navigator.clipboard.writeText(`Subject: ${emailSubject}\n\n${emailBody}`);
    setCopiedDraft(true);
    if (recipientEmail.trim()) {
      persistEmailIfChanged(recipientEmail.trim());
    }
    if (onToast) {
      onToast("Formatted message & link copied to clipboard");
    }
    setTimeout(() => setCopiedDraft(false), 2500);
  }

  // ── Milestone 3: Expiry & Access Control Actions ─────────────────────────

  async function handleSaveAccessSettings() {
    setIsSavingAccess(true);
    try {
      const newExpiresAt = neverExpires
        ? null
        : customDate
        ? new Date(customDate).toISOString()
        : calculateExpiryFromDays(sliderDays);

      const existingNotes =
        currentCase.doctor_notes && typeof currentCase.doctor_notes === "object"
          ? currentCase.doctor_notes
          : {};

      const updatedNotes = {
        ...existingNotes,
        link_access: {
          expires_at: newExpiresAt,
          is_revoked: isRevoked,
          never_expires: neverExpires,
          updated_at: new Date().toISOString(),
        },
      };

      // 1. Dual-write to database: try columns first, with resilient fallback to status & updated_at
      let dbError: any = null;
      try {
        const { error } = await supabase
          .from("cases")
          .update({
            expires_at: newExpiresAt,
            is_revoked: isRevoked,
            status: isRevoked ? "revoked" : "ready",
            doctor_notes: updatedNotes,
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentCase.id);

        if (error && (error.code === "PGRST204" || error.message?.includes("column"))) {
          const { error: fbErr } = await supabase
            .from("cases")
            .update({
              status: isRevoked ? "revoked" : "ready",
              updated_at: new Date().toISOString(),
            })
            .eq("id", currentCase.id);
          dbError = fbErr;
        } else {
          dbError = error;
        }
      } catch (e) {
        dbError = e;
      }

      // 2. Persist to localStorage cache so settings immediately survive hard refreshes
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            `dental_link_access_${currentCase.id}`,
            JSON.stringify({
              expiresAt: newExpiresAt,
              isRevoked: isRevoked,
              neverExpires: neverExpires,
              updatedAt: new Date().toISOString(),
            })
          );
        } catch {}
      }

      const updatedCase: DentalCase = {
        ...currentCase,
        status: isRevoked ? "revoked" : "ready",
        expires_at: newExpiresAt,
        is_revoked: isRevoked,
        doctor_notes: updatedNotes,
        updated_at: new Date().toISOString(),
      };

      setCurrentCase(updatedCase);
      setShowDatePicker(false);
      setNeverExpires(newExpiresAt === null);
      if (newExpiresAt) {
        setCustomDate(formatForDateTimeInput(new Date(newExpiresAt)));
        const diffMs = new Date(newExpiresAt).getTime() - Date.now();
        const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
        setSliderDays(Math.max(1, Math.min(7, days)));
      } else {
        setSliderDays(1);
      }
      if (onCaseUpdated) onCaseUpdated(updatedCase);

      // Broadcast real-time access change to any open viewer tabs
      try {
        localStorage.setItem(
          "dental_viewer_sync",
          JSON.stringify({
            caseId: currentCase.id,
            type: "access",
            isRevoked: isRevoked,
            expiresAt: newExpiresAt,
            timestamp: Date.now(),
          })
        );
      } catch {}

      if (onToast) onToast("Link access settings updated successfully");
    } catch (err) {
      console.error("Failed to save access settings:", err);
      if (onToast) onToast("Could not update link access");
    } finally {
      setIsSavingAccess(false);
    }
  }

  async function handleToggleRevoke() {
    const nextRevoked = !isRevoked;
    setIsRevoked(nextRevoked);
    setIsSavingAccess(true);
    try {
      const existingNotes =
        currentCase.doctor_notes && typeof currentCase.doctor_notes === "object"
          ? currentCase.doctor_notes
          : {};

      const updatedNotes = {
        ...existingNotes,
        link_access: {
          expires_at: currentCase.expires_at ?? null,
          is_revoked: nextRevoked,
          updated_at: new Date().toISOString(),
        },
      };

      // 1. Database update: update status (and is_revoked if column exists)
      let { error } = await supabase
        .from("cases")
        .update({
          is_revoked: nextRevoked,
          status: nextRevoked ? "revoked" : "ready",
          doctor_notes: updatedNotes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentCase.id);

      if (error && (error.code === "PGRST204" || error.message?.includes("column"))) {
        const { error: fbErr } = await supabase
          .from("cases")
          .update({
            status: nextRevoked ? "revoked" : "ready",
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentCase.id);
        error = fbErr;
      }

      // 2. Persist to localStorage cache
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem(`dental_link_access_${currentCase.id}`);
          const parsed = raw ? JSON.parse(raw) : {};
          localStorage.setItem(
            `dental_link_access_${currentCase.id}`,
            JSON.stringify({
              ...parsed,
              isRevoked: nextRevoked,
              updatedAt: new Date().toISOString(),
            })
          );
        } catch {}
      }

      const updatedCase: DentalCase = {
        ...currentCase,
        status: nextRevoked ? "revoked" : "ready",
        is_revoked: nextRevoked,
        doctor_notes: updatedNotes,
        updated_at: new Date().toISOString(),
      };

      setCurrentCase(updatedCase);
      if (onCaseUpdated) onCaseUpdated(updatedCase);

      // Broadcast real-time access change to any open viewer tabs
      try {
        localStorage.setItem(
          "dental_viewer_sync",
          JSON.stringify({
            caseId: currentCase.id,
            type: "access",
            isRevoked: nextRevoked,
            timestamp: Date.now(),
          })
        );
      } catch {}

      if (onToast) {
        onToast(
          nextRevoked
            ? "Link access REVOKED instantly. Patient access is blocked."
            : "Link access RESTORED. Patient can now view the progression.",
        );
      }
    } catch (err) {
      console.error("Failed to toggle link revocation:", err);
      if (onToast) onToast("Could not change revocation status");
    } finally {
      setIsSavingAccess(false);
    }
  }

  async function handleRegenerateToken() {
    setIsRegeneratingToken(true);
    try {
      // Generate clean 32-character hex token matching database convention
      const newToken =
        typeof crypto !== "undefined" && crypto.getRandomValues
          ? Array.from(crypto.getRandomValues(new Uint8Array(16)))
              .map((b) => b.toString(16).padStart(2, "0"))
              .join("")
          : "pt" + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);

      const existingNotes =
        currentCase.doctor_notes && typeof currentCase.doctor_notes === "object"
          ? currentCase.doctor_notes
          : {};

      const updatedNotes = {
        ...existingNotes,
        link_access: {
          ...(existingNotes.link_access || {}),
          is_revoked: false,
          token_regenerated_at: new Date().toISOString(),
        },
      };

      // 1. Try full update
      let { error } = await supabase
        .from("cases")
        .update({
          share_token: newToken,
          is_revoked: false,
          status: "ready",
          doctor_notes: updatedNotes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentCase.id);

      // 2. Safe fallback if is_revoked or doctor_notes column is missing from PostgreSQL schema
      if (error && (error.code === "PGRST204" || error.message?.includes("column"))) {
        const { error: fbErr } = await supabase
          .from("cases")
          .update({
            share_token: newToken,
            status: "ready",
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentCase.id);
        error = fbErr;
      }

      if (error) {
        throw error;
      }

      // 3. Update localStorage cache
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem(`dental_link_access_${currentCase.id}`);
          const parsed = raw ? JSON.parse(raw) : {};
          localStorage.setItem(
            `dental_link_access_${currentCase.id}`,
            JSON.stringify({
              ...parsed,
              isRevoked: false,
              token: newToken,
              updatedAt: new Date().toISOString(),
            })
          );
        } catch {}
      }

      const updatedCase: DentalCase = {
        ...currentCase,
        share_token: newToken,
        status: "ready",
        is_revoked: false,
        doctor_notes: updatedNotes,
        updated_at: new Date().toISOString(),
      };

      setCurrentCase(updatedCase);
      setIsRevoked(false);
      setShowRegenerateConfirm(false);

      if (onCaseUpdated) onCaseUpdated(updatedCase);

      const freshShareUrl = `${origin}/treatment?case=${newToken}`;
      try {
        await navigator.clipboard.writeText(freshShareUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      } catch {}

      if (onToast) onToast("New private link generated and copied to clipboard!");
    } catch (err: any) {
      console.error("Failed to regenerate share token:", err?.message || err);
      if (onToast) onToast(`Failed to regenerate link: ${err?.message || "database error"}`);
    } finally {
      setIsRegeneratingToken(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#131A26] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[94vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-[#ffd166] flex items-center justify-center border border-slate-200 dark:border-[#e0b457]/20">
              <Share2 className="w-4 h-4 text-slate-700 dark:text-[#ffd166]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Share 3D Treatment Plan</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-[#ffd166]">
                  {stages} Stages
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Private patient link, configurable expiry & clinic mailbox
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Patient Summary Header */}
          <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0D121D] flex items-center justify-between gap-3">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white text-sm truncate">
                  {displayName}
                </span>
                {currentCase.patient_id && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-white dark:bg-[#1A2234] text-slate-700 dark:text-[#ffd166] border border-slate-200 dark:border-slate-700">
                    {currentCase.patient_id}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                {currentCase.clinic_name && (
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-400 dark:text-[#ffd166]" />
                    <span>{currentCase.clinic_name}</span>
                  </span>
                )}
                <span>•</span>
                <span>{trayInfo.metadataBadgeText}</span>
              </div>
            </div>

            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-[#1A2234] border border-slate-200 dark:border-slate-700 shadow-2xs inline-flex items-center gap-1 hover:border-slate-300 dark:hover:border-[#e0b457]/40 flex-shrink-0"
            >
              <Eye className="w-3 h-3" />
              <span>Preview</span>
            </a>
          </div>

          {/* ── Milestone 3: Link Expiry & Access Control Card ─────────────── */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0E1420] space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-[#ffd166]" />
                <span className="font-semibold text-slate-900 dark:text-white text-xs">
                  Link Expiration & Access Control
                </span>
              </div>

              {/* Status Badge showing current saved state in cloud */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium hidden sm:inline">
                  Current Status:
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${accessInfo.badgeColorClass}`}
                  title="Current active status saved in the cloud database"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${accessInfo.badgeDotClass}`} />
                  <span>{accessInfo.badgeLabel}</span>
                </span>
              </div>
            </div>


            {/* Concept 1: Combined Duration & Clickable Calendar Pill (Dual-Linked Hybrid) */}
            <div className="space-y-2.5 pt-0.5">
              <div className="flex items-center justify-between text-[11px] gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Duration:
                  </span>
                  <span
                    className={`font-bold text-xs sm:text-sm truncate ${
                      neverExpires
                        ? "text-slate-400 dark:text-slate-500"
                        : "text-amber-600 dark:text-[#ffd166]"
                    }`}
                  >
                    {formattedDurationLabel}
                  </span>
                </div>

                {/* Clickable Date Pill that opens the picker */}
                <button
                  type="button"
                  onClick={handleToggleDatePicker}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all inline-flex items-center gap-1.5 shadow-2xs ${
                    showDatePicker
                      ? "bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-[#ffd166] border-amber-400 dark:border-amber-600"
                      : "bg-white dark:bg-[#151D2C] text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-[#ffd166]/50 cursor-pointer"
                  }`}
                  title="Click to choose a custom expiration date & time"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-500 dark:text-[#ffd166]" />
                  <span className="max-w-[150px] sm:max-w-[190px] truncate">
                    {neverExpires ? "Set Custom Date" : formattedDateLabel}
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                      showDatePicker ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Expandable Custom Date & Time Picker */}
              {showDatePicker && (
                <div className="p-3 rounded-xl bg-white dark:bg-[#151D2C] border border-amber-300 dark:border-amber-700/80 shadow-md space-y-2.5 animate-fadeIn">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-500 dark:text-[#ffd166]" />
                      <span>Select Exact Expiration Date & Time:</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowDatePicker(false)}
                      className="text-[10px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      Done ✕
                    </button>
                  </div>

                  <input
                    ref={dateInputRef}
                    type="datetime-local"
                    value={customDate}
                    onChange={(e) => handleCustomDateChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0D121D] text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  />

                  {/* Quick Preset Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                      Quick presets:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuickAddDays(1)}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-slate-700 dark:text-slate-300 hover:text-amber-800 dark:hover:text-[#ffd166] transition-colors"
                    >
                      +1 Day (24h)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAddDays(2)}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-slate-700 dark:text-slate-300 hover:text-amber-800 dark:hover:text-[#ffd166] transition-colors"
                    >
                      +2 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAddDays(7)}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-slate-700 dark:text-slate-300 hover:text-amber-800 dark:hover:text-[#ffd166] transition-colors"
                    >
                      +7 Days (1 wk)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAddDays(14)}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-slate-700 dark:text-slate-300 hover:text-amber-800 dark:hover:text-[#ffd166] transition-colors"
                    >
                      +14 Days (2 wks)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAddDays(30)}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-slate-700 dark:text-slate-300 hover:text-amber-800 dark:hover:text-[#ffd166] transition-colors"
                    >
                      +30 Days (1 mo)
                    </button>
                  </div>
                </div>
              )}

              {/* 1-Week Range Slider */}
              <div
                className={`relative flex flex-col gap-1 transition-opacity ${
                  neverExpires ? "opacity-35 pointer-events-none" : "opacity-100"
                }`}
              >
                <input
                  type="range"
                  min="1"
                  max="7"
                  step="1"
                  disabled={neverExpires}
                  value={sliderDays}
                  onChange={(e) => handleSliderChange(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500 dark:accent-[#ffd166]"
                />
                <div className="flex justify-between text-[9px] font-semibold text-slate-400 dark:text-slate-500 px-0.5">
                  <span>1d</span>
                  <span>2d</span>
                  <span>3d</span>
                  <span>4d</span>
                  <span>5d</span>
                  <span>6d</span>
                  <span>7d (1 wk)</span>
                </div>
              </div>

              {/* Subtext info & "Never expires" inline checkbox */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0.5">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                  {subtextLabel}
                </p>

                <label className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 cursor-pointer select-none flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={neverExpires}
                    onChange={(e) => handleToggleNeverExpires(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-amber-500 focus:ring-amber-500 dark:bg-[#1A2234] border-slate-300 dark:border-slate-700"
                  />
                  <span>Never expires</span>
                </label>
              </div>
            </div>

            {/* Action Bar: Save Expiry & Instant Revoke Kill Switch */}
            <div className="pt-1 flex items-center justify-between gap-2 border-t border-slate-200/60 dark:border-slate-800/80">
              <button
                type="button"
                onClick={handleToggleRevoke}
                disabled={isSavingAccess}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                  isRevoked
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs"
                    : "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60"
                }`}
                aria-label={
                  isRevoked
                    ? "Restore access to this shared link"
                    : "Revoke link access"
                }
              >
                {isRevoked ? (
                  <>
                    <Unlock className="w-3 h-3" />
                    <span>Restore Access</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3" />
                    <span>Revoke Link Access</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSaveAccessSettings}
                disabled={isSavingAccess}
                className="px-3.5 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-900 dark:bg-gradient-to-r dark:from-[#e0b457] dark:to-[#c49a45] text-white dark:text-slate-950 hover:brightness-105 active:scale-98 transition-all flex items-center gap-1.5 shadow-2xs"
              >
                {isSavingAccess ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Save Expiry</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── Section 1: Copy Share Link, Regenerate & WhatsApp Direct ──── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-amber-500 dark:text-[#ffd166]" />
                <span>3D Progression Share Link</span>
              </label>

              {/* Regenerate Token / Fresh Link Button */}
              <button
                type="button"
                onClick={() => setShowRegenerateConfirm((prev) => !prev)}
                disabled={isRegeneratingToken}
                className="px-2 py-1 rounded-lg text-[10px] font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-[#ffd166] hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 flex items-center gap-1.5 transition-all"
                aria-label="Generate a new private share link"
              >
                <RefreshCw
                  className={`w-3 h-3 ${isRegeneratingToken ? "animate-spin" : ""}`}
                />
                <span>Regenerate Link</span>
              </button>
            </div>

            {/* Regenerate Confirmation Popover */}
            {showRegenerateConfirm && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800 shadow-lg space-y-3 text-[11px] animate-fadeIn transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-[#ffd166]/10 text-amber-600 dark:text-[#ffd166] flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-500/20 dark:border-[#ffd166]/20">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        Regenerate Private Link?
                      </h4>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-rose-500/10 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-500/20 dark:border-rose-900/50">
                        Revokes Old Link
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      The current link will stop working immediately. Anyone with the previous link will lose access until you send them this new one.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-slate-200/70 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowRegenerateConfirm(false)}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleRegenerateToken}
                    disabled={isRegeneratingToken}
                    className="px-3.5 py-1.5 rounded-lg text-[11px] font-bold bg-slate-900 dark:bg-[#ffd166] text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-[#ffe082] active:scale-95 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isRegeneratingToken ? "animate-spin" : ""}`} />
                    <span>{isRegeneratingToken ? "Regenerating..." : "Yes, Generate New Link"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Link input + Copy Link & Quick WhatsApp buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1 min-w-0">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0D121D] text-xs font-mono text-slate-700 dark:text-slate-300 select-all truncate focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleCopyDirectLink}
                  className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                    copiedLink
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-slate-900 dark:bg-gradient-to-r dark:from-[#e0b457] dark:to-[#c49a45] text-white dark:text-slate-950 hover:brightness-105 shadow-sm"
                  }`}
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#154D38] hover:bg-[#1b5e45] text-white active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-[#154D38]/25"
                  title="Share 3D progression directly via WhatsApp (choose any chat or group)"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-white" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── Divider ──────────────────────────────────────────────────────── */}
          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
            <span className="flex-shrink mx-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Or Send to Clinic Mailbox
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
          </div>

          {/* ── Section 2: Send directly to Clinic Mailbox ──────────────────── */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Enter email id</span>
              </label>
              {currentCase.clinic_email && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center gap-1">
                  <Check className="w-2.5 h-2.5" />
                  <span>Linked</span>
                </span>
              )}
            </div>

            <div className="relative">
              <input
                type="email"
                list="saved-clinic-emails-share"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="e.g. clinic@smiledental.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 dark:focus:border-sky-400 transition-all font-medium"
              />
              <datalist id="saved-clinic-emails-share">
                {savedEmails.map((em) => (
                  <option key={em} value={em} />
                ))}
              </datalist>
            </div>

            {/* Remembered Quick-Chips */}
            {savedEmails.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  Remembered:
                </span>
                {savedEmails.slice(0, 4).map((em) => {
                  const isSelected = recipientEmail.toLowerCase() === em.toLowerCase();
                  return (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setRecipientEmail(em)}
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-md transition-colors ${
                        isSelected
                          ? "bg-sky-600 text-white font-bold"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {em}
                    </button>
                  );
                })}
              </div>
            )}

            <label className="flex items-center gap-2 pt-1 text-[11px] text-slate-600 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={saveAsDefault}
                onChange={(e) => setSaveAsDefault(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-sky-600 focus:ring-sky-500 dark:bg-[#1A2234] border-slate-300 dark:border-slate-700"
              />
              <span>Remember and save this email for this clinic & case</span>
            </label>
          </div>
        </div>

        {/* Modal Footer: Email Dispatch CTAs */}
        <div className="px-5 sm:px-6 py-4 bg-slate-50/80 dark:bg-[#0D121D] border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Copy Full Message Draft */}
          <button
            type="button"
            onClick={handleCopyEmailDraft}
            className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
              copiedDraft
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
                : "bg-white dark:bg-[#1A2234] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#232D42] border-slate-200 dark:border-slate-700 shadow-2xs"
            }`}
          >
            {copiedDraft ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Message Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Copy Draft & Link</span>
              </>
            )}
          </button>

          {/* Mail Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenGmail}
              className="flex-1 sm:flex-initial py-2 px-3 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1A2234] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#232D42] transition-all flex items-center justify-center gap-1.5 shadow-2xs"
              title="Open pre-filled draft in Gmail web"
            >
              <ExternalLink className="w-3.5 h-3.5 text-red-500" />
              <span>Gmail</span>
            </button>

            <button
              type="button"
              onClick={handleOpenMailClient}
              className="flex-1 sm:flex-initial py-2 px-4 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-sky-600/30"
              title="Send directly to clinic mailbox via native mail app"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send to Clinic Mailbox</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
