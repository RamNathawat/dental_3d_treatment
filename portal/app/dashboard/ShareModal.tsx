"use client";

import { useState, useEffect } from "react";
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
  Hash,
  Layers,
  Sparkles,
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

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseItem: DentalCase;
  doctorName?: string;
  allCases?: DentalCase[];
  onEmailUpdated?: (caseId: string, email: string) => void;
  onToast?: (msg: string) => void;
}

export default function ShareModal({
  isOpen,
  onClose,
  caseItem,
  doctorName = "Doctor",
  allCases,
  onEmailUpdated,
  onToast,
}: ShareModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [savedEmails, setSavedEmails] = useState<string[]>([]);
  const [saveAsDefault, setSaveAsDefault] = useState(true);
  const [isUpdatingDb, setIsUpdatingDb] = useState(false);

  const supabase = createClient();

  const stages = caseItem.total_stages || 1;
  const trayInfo = getCaseTrayInfo(caseItem);
  const displayName = caseItem.patient_name.replace(/\s*\[(Upper|Lower|Dual)\]/i, "").trim();

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = `${origin}/treatment?case=${caseItem.share_token}`;

  useEffect(() => {
    if (!isOpen) return;

    // Load remembered emails
    const remembered = getSavedClinicEmails(allCases);
    setSavedEmails(remembered);

    // Initial recipient resolution priority:
    // 1. Direct case clinic_email
    // 2. doctor_notes.clinic_email
    // 3. Saved email associated with clinic_name
    // 4. Most recent remembered email (if available)
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
  }, [isOpen, caseItem, allCases]);

  if (!isOpen) return null;

  const emailSubject = trayInfo.isUnequal
    ? `[3D Treatment Progression] ${displayName} (Upper: ${trayInfo.upper} · Lower: ${trayInfo.lower} · ${trayInfo.total} Trays) - Clinical Review Link`
    : `[3D Treatment Progression] ${displayName} (${stages} Stages · ${trayInfo.total} Trays) - Clinical Review Link`;

  const emailBody = `Dear ${caseItem.clinic_name || "Hope you are doing well"},

The interactive 3D orthodontic treatment progression plan for ${displayName} is ready for clinical review.

• Patient Name: ${displayName}
• Patient ID: ${caseItem.patient_id || "N/A"}
• Treatment Trays: ${trayInfo.metadataBadgeText}
• Progression Stages: ${stages} Stages (${trayInfo.archBadgeText})
${caseItem.clinic_name ? `• Clinic / Practice: ${caseItem.clinic_name}\n` : ""}${caseItem.patient_age ? `• Patient Age: ${caseItem.patient_age} yrs\n` : ""}
🔗 Interactive 3D Progression Link:
${shareUrl}

You can rotate, zoom, inspect individual aligner stages, examine tooth movements, and verify attachments directly in any browser on desktop or mobile without installing software.

Best regards,
Dr. ${doctorName}
Orthodontic 3D Clinical Studio`;

  async function persistEmailIfChanged(emailToSave: string) {
    const clean = emailToSave.trim().toLowerCase();
    if (!clean || !clean.includes("@")) return;

    saveClinicEmail(clean, caseItem.clinic_name);

    if (caseItem.clinic_email !== clean && saveAsDefault) {
      setIsUpdatingDb(true);
      try {
        const { error } = await supabase
          .from("cases")
          .update({
            clinic_email: clean,
            updated_at: new Date().toISOString(),
          })
          .eq("id", caseItem.id);

        if (!error && onEmailUpdated) {
          onEmailUpdated(caseItem.id, clean);
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
      patientId: caseItem.patient_id,
      stages,
      metadataBadgeText: trayInfo.metadataBadgeText,
      archBadgeText: trayInfo.archBadgeText,
      clinicName: caseItem.clinic_name,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#131A26] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
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
                Copy link or send straight to clinic mailbox
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
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Patient Summary Header */}
          <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0D121D] flex items-center justify-between gap-3">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white text-sm truncate">
                  {displayName}
                </span>
                {caseItem.patient_id && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-white dark:bg-[#1A2234] text-slate-700 dark:text-[#ffd166] border border-slate-200 dark:border-slate-700">
                    {caseItem.patient_id}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                {caseItem.clinic_name && (
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-400 dark:text-[#ffd166]" />
                    <span>{caseItem.clinic_name}</span>
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

          {/* ── Section 1: Copy Share Link & WhatsApp Direct ─────────────── */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-amber-500 dark:text-[#ffd166]" />
                <span>3D Progression Share Link</span>
              </span>
              <span className="text-[10px] font-normal text-slate-400">Ready to share</span>
            </label>

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
              {caseItem.clinic_email && (
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
        <div className="px-6 py-4 bg-slate-50/80 dark:bg-[#0D121D] border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
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

