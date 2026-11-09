"use client";

import { useState, useRef, useEffect } from "react";
import {
  X,
  Pencil,
  UploadCloud,
  FileCheck,
  Loader2,
  Check,
  AlertCircle,
  Building2,
  Hash,
  Calendar,
  User,
  Mail,
  Layers,
  RefreshCw,
  Trash2,
  Undo2,
} from "lucide-react";
import { DentalCase } from "./page";
import { createClient } from "@/lib/supabase/client";
import {
  processDentalZipInBrowser,
  extractDentalZipMetadata,
  DentalZipMetadata,
  IngestResult,
} from "@/lib/in-browser-converter";
import {
  getSavedClinicEmails,
  saveClinicEmail,
  getSavedEmailForClinic,
} from "@/lib/clinic-email-storage";

interface EditCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseItem: DentalCase;
  userId: string;
  allCases?: DentalCase[];
  onCaseUpdated: (updatedCase: DentalCase) => void;
  onToast?: (msg: string) => void;
}

export default function EditCaseModal({
  isOpen,
  onClose,
  caseItem,
  userId,
  allCases,
  onCaseUpdated,
  onToast,
}: EditCaseModalProps) {
  // Form Details
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientSex, setPatientSex] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [clinicEmail, setClinicEmail] = useState("");
  const [savedEmails, setSavedEmails] = useState<string[]>([]);

  // Re-enter 3D Models
  const [upperFile, setUpperFile] = useState<File | null>(null);
  const [lowerFile, setLowerFile] = useState<File | null>(null);
  const [upperMeta, setUpperMeta] = useState<DentalZipMetadata | null>(null);
  const [lowerMeta, setLowerMeta] = useState<DentalZipMetadata | null>(null);
  const [removeExistingUpper, setRemoveExistingUpper] = useState(false);
  const [removeExistingLower, setRemoveExistingLower] = useState(false);

  const [isInspectingUpper, setIsInspectingUpper] = useState(false);
  const [isInspectingLower, setIsInspectingLower] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [progressPct, setProgressPct] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const [dragOverUpper, setDragOverUpper] = useState(false);
  const [dragOverLower, setDragOverLower] = useState(false);

  const upperInputRef = useRef<HTMLInputElement>(null);
  const lowerInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  useEffect(() => {
    if (!isOpen) return;

    const cleanName = caseItem.patient_name.replace(/\s*\[(Upper|Lower|Dual)\]/i, "").trim();
    setPatientName(cleanName);
    setPatientId(caseItem.patient_id || "");
    setPatientAge(caseItem.patient_age != null ? String(caseItem.patient_age) : "");
    setPatientSex(caseItem.patient_sex || "");
    setClinicName(caseItem.clinic_name || "");

    const remembered = getSavedClinicEmails(allCases);
    setSavedEmails(remembered);

    let initialEmail = caseItem.clinic_email || "";
    if (!initialEmail && caseItem.doctor_notes && typeof caseItem.doctor_notes === "object") {
      initialEmail = caseItem.doctor_notes.clinic_email || "";
    }
    if (!initialEmail && caseItem.clinic_name) {
      initialEmail = getSavedEmailForClinic(caseItem.clinic_name) || "";
    }
    setClinicEmail(initialEmail);

    // Reset model upload state
    setUpperFile(null);
    setLowerFile(null);
    setUpperMeta(null);
    setLowerMeta(null);
    setRemoveExistingUpper(false);
    setRemoveExistingLower(false);
    setErrorMsg("");
    setIsProcessing(false);
  }, [isOpen, caseItem, allCases]);

  if (!isOpen) return null;

  const currentStages = caseItem.total_stages || 1;
  const isUpperOnly = caseItem.patient_name.includes("[Upper]");
  const isLowerOnly = caseItem.patient_name.includes("[Lower]");
  const existingUpperStages =
    caseItem.upper_stages ??
    caseItem.doctor_notes?.aligner_counts?.upper ??
    currentStages;
  const existingLowerStages =
    caseItem.lower_stages ??
    caseItem.doctor_notes?.aligner_counts?.lower ??
    currentStages;
  const isUnequalStages =
    !isUpperOnly && !isLowerOnly && existingUpperStages !== existingLowerStages;
  const hasExistingUpper = !isLowerOnly;
  const hasExistingLower = !isUpperOnly;
  const archLabel = isUpperOnly ? "Upper Arch Only" : isLowerOnly ? "Lower Arch Only" : "Dual-Arch Alignment";

  const hasNewFiles = Boolean(upperFile || lowerFile);

  function handleClinicNameChange(name: string) {
    setClinicName(name);
    if (!clinicEmail.trim()) {
      const match = getSavedEmailForClinic(name);
      if (match) setClinicEmail(match);
    }
  }

  async function handleUpperSelect(file: File) {
    if (!file.name.toLowerCase().endsWith(".zip")) {
      setErrorMsg("Please upload a .ZIP file for the Upper jaw CAD models.");
      return;
    }
    setErrorMsg("");
    setRemoveExistingUpper(false);
    setUpperFile(file);
    setIsInspectingUpper(true);
    try {
      const meta = await extractDentalZipMetadata(file, "upper");
      setUpperMeta(meta);
    } catch (e) {
      console.warn("Could not extract metadata from upper zip:", e);
    } finally {
      setIsInspectingUpper(false);
    }
  }

  async function handleLowerSelect(file: File) {
    if (!file.name.toLowerCase().endsWith(".zip")) {
      setErrorMsg("Please upload a .ZIP file for the Lower jaw CAD models.");
      return;
    }
    setErrorMsg("");
    setRemoveExistingLower(false);
    setLowerFile(file);
    setIsInspectingLower(true);
    try {
      const meta = await extractDentalZipMetadata(file, "lower");
      setLowerMeta(meta);
    } catch (e) {
      console.warn("Could not extract metadata from lower zip:", e);
    } finally {
      setIsInspectingLower(false);
    }
  }

  async function handleIncomingFiles(
    files: FileList | File[] | null,
    targetArchHint?: "upper" | "lower"
  ) {
    if (!files || files.length === 0) return;

    const zipFiles = Array.from(files).filter((f) =>
      f.name.toLowerCase().endsWith(".zip")
    );

    if (zipFiles.length === 0) {
      setErrorMsg("Please upload .ZIP archives containing CAD model exports.");
      return;
    }

    setErrorMsg("");

    // ──────────────────────────────────────────────────────────────────────────
    // Scenario A: 2 or more files selected or dropped simultaneously
    // ──────────────────────────────────────────────────────────────────────────
    if (zipFiles.length >= 2) {
      const fileA = zipFiles[0]!;
      const fileB = zipFiles[1]!;

      const isUpperName = (name: string) =>
        /(?:upper|maxill|maxillary|\bupper\b|[._-]u\b|[._-]u[._-])/i.test(name);
      const isLowerName = (name: string) =>
        /(?:lower|mandib|mandibular|\blower\b|[._-]l\b|[._-]l[._-])/i.test(name);

      let uFile: File | null = null;
      let lFile: File | null = null;

      if (isUpperName(fileA.name) && isLowerName(fileB.name)) {
        uFile = fileA;
        lFile = fileB;
      } else if (isLowerName(fileA.name) && isUpperName(fileB.name)) {
        uFile = fileB;
        lFile = fileA;
      } else if (isUpperName(fileA.name) && !isUpperName(fileB.name)) {
        uFile = fileA;
        lFile = fileB;
      } else if (isLowerName(fileA.name) && !isLowerName(fileB.name)) {
        lFile = fileA;
        uFile = fileB;
      } else if (isUpperName(fileB.name) && !isUpperName(fileA.name)) {
        uFile = fileB;
        lFile = fileA;
      } else if (isLowerName(fileB.name) && !isLowerName(fileA.name)) {
        lFile = fileB;
        uFile = fileA;
      } else {
        try {
          const [metaA, metaB] = await Promise.all([
            extractDentalZipMetadata(fileA),
            extractDentalZipMetadata(fileB),
          ]);
          if (metaA.hasUpper && !metaA.hasLower && metaB.hasLower && !metaB.hasUpper) {
            uFile = fileA;
            lFile = fileB;
          } else if (metaB.hasUpper && !metaB.hasLower && metaA.hasLower && !metaA.hasUpper) {
            uFile = fileB;
            lFile = fileA;
          } else {
            if (targetArchHint === "lower") {
              lFile = fileA;
              uFile = fileB;
            } else {
              uFile = fileA;
              lFile = fileB;
            }
          }
        } catch {
          uFile = fileA;
          lFile = fileB;
        }
      }

      if (uFile && lFile) {
        await Promise.all([handleUpperSelect(uFile), handleLowerSelect(lFile)]);
      } else if (uFile) {
        await handleUpperSelect(uFile);
      } else if (lFile) {
        await handleLowerSelect(lFile);
      }
      return;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Scenario B: Exactly 1 file selected or dropped
    // ──────────────────────────────────────────────────────────────────────────
    const file = zipFiles[0]!;
    const isUpper = /(?:upper|maxill|maxillary|\bupper\b|[._-]u\b|[._-]u[._-])/i.test(file.name);
    const isLower = /(?:lower|mandib|mandibular|\blower\b|[._-]l\b|[._-]l[._-])/i.test(file.name);

    if (targetArchHint === "lower") {
      await handleLowerSelect(file);
      return;
    }
    if (targetArchHint === "upper") {
      await handleUpperSelect(file);
      return;
    }

    if (isLower && !isUpper) {
      await handleLowerSelect(file);
      return;
    }
    if (isUpper && !isLower) {
      await handleUpperSelect(file);
      return;
    }

    try {
      const meta = await extractDentalZipMetadata(file);
      if (meta.hasUpper && meta.hasLower) {
        await handleUpperSelect(file);
        await handleLowerSelect(file);
        return;
      } else if (meta.hasLower && !meta.hasUpper) {
        await handleLowerSelect(file);
        return;
      }
    } catch {
      // Fallback
    }

    if (!upperFile) {
      await handleUpperSelect(file);
    } else {
      await handleLowerSelect(file);
    }
  }

  async function handleSave() {
    if (!patientName.trim()) {
      setErrorMsg("Patient / Case name cannot be blank.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg("");

    const resolvedPatientId = patientId.trim() || caseItem.patient_id || `PT-${Math.floor(1000 + Math.random() * 9000)}`;
    const parsedAge = parseInt(patientAge.trim(), 10);
    const resolvedAge = !isNaN(parsedAge) && parsedAge > 0 && parsedAge <= 120 ? parsedAge : null;
    const resolvedSex = patientSex.trim() || null;
    const resolvedClinicName = clinicName.trim() || null;
    const resolvedClinicEmail = clinicEmail.trim() || null;

    if (resolvedClinicEmail) {
      saveClinicEmail(resolvedClinicEmail, resolvedClinicName);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // CASE A: Re-entering / replacing 3D Models or Removing an Existing Arch
    // ──────────────────────────────────────────────────────────────────────────
    const hasModelChanges = Boolean(upperFile || lowerFile || removeExistingUpper || removeExistingLower);

    if (hasModelChanges) {
      const willHaveUpper = Boolean(upperFile || (hasExistingUpper && !removeExistingUpper));
      const willHaveLower = Boolean(lowerFile || (hasExistingLower && !removeExistingLower));

      if (!willHaveUpper && !willHaveLower) {
        setIsProcessing(false);
        setErrorMsg("A treatment case must contain at least one arch (Upper or Lower). To delete the entire case, use the delete button on the dashboard.");
        return;
      }

      setProgressMsg(
        upperFile || lowerFile
          ? "Re-processing and uploading new 3D models..."
          : "Updating treatment arches and removing selected models..."
      );
      setProgressPct(15);

      const result: IngestResult = await processDentalZipInBrowser(
        {
          upperZip: upperFile,
          lowerZip: lowerFile,
        },
        patientName.trim(),
        userId,
        (msg, pct) => {
          setProgressMsg(msg);
          setProgressPct(pct);
        },
        caseItem.ipr || undefined,
        caseItem.doctor_notes || undefined,
        resolvedPatientId,
        resolvedClinicName || undefined,
        resolvedAge ?? undefined,
        resolvedSex ?? undefined,
        resolvedClinicEmail ?? undefined,
        caseItem.id, // existingCaseId: overwrites models for this case!
        {
          removeExistingUpper,
          removeExistingLower,
        },
      );

      if (result.ok && result.caseId) {
        const willBeBoth = Boolean((result.hasUpper && result.hasLower) || (willHaveUpper && willHaveLower));
        const archType = willBeBoth ? "both" : (result.archType || (willHaveUpper ? "upper" : "lower"));
        const cleanName = patientName.replace(/\s*\[(Upper|Lower|Dual)\]/i, "").trim();
        const dbName =
          archType === "upper"
            ? `${cleanName} [Upper]`
            : archType === "lower"
            ? `${cleanName} [Lower]`
            : cleanName;

        const resolvedUpperStages =
          result.upperStages ??
          (willHaveUpper ? (caseItem.upper_stages ?? caseItem.total_stages) : null);
        const resolvedLowerStages =
          result.lowerStages ??
          (willHaveLower ? (caseItem.lower_stages ?? (result.totalStages ? 1 : null)) : null);

        const updatedCase: DentalCase = {
          ...caseItem,
          patient_name: dbName,
          clinic_name: resolvedClinicName,
          clinic_email: resolvedClinicEmail,
          patient_id: result.patientId || resolvedPatientId,
          patient_age: resolvedAge,
          patient_sex: resolvedSex,
          total_stages: result.totalStages || caseItem.total_stages || 1,
          upper_stages: resolvedUpperStages,
          lower_stages: resolvedLowerStages,
          doctor_notes: {
            ...(caseItem.doctor_notes || {}),
            aligner_counts: {
              upper: resolvedUpperStages ?? undefined,
              lower: resolvedLowerStages ?? undefined,
              total: result.totalAligners || ((resolvedUpperStages || 0) + (resolvedLowerStages || 0)),
              is_unequal: result.isUnequal ?? (Boolean(resolvedUpperStages && resolvedLowerStages && resolvedUpperStages !== resolvedLowerStages)),
            },
          },
          updated_at: new Date().toISOString(),
        };

        onCaseUpdated(updatedCase);
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "dental_viewer_sync",
            JSON.stringify({
              caseId: caseItem.id,
              updatedAt: new Date().toISOString(),
              action: "case_updated",
            })
          );
        }
        setIsProcessing(false);
        if (onToast) {
          onToast(
            removeExistingUpper || removeExistingLower
              ? `Case "${dbName}" updated: removed selected arch models (${updatedCase.total_stages} stages)`
              : `Case "${dbName}" models re-entered and updated successfully (${updatedCase.total_stages} stages)`
          );
        }
        onClose();
      } else {
        setIsProcessing(false);
        setErrorMsg(result.error || "Failed to update orthodontic archives.");
      }
      return;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // CASE B: Details update only (no new model files selected)
    // ──────────────────────────────────────────────────────────────────────────
    setProgressMsg("Updating patient & clinic details...");
    setProgressPct(50);

    try {
      const cleanName = patientName.replace(/\s*\[(Upper|Lower|Dual)\]/i, "").trim();
      const dbName = isUpperOnly
        ? `${cleanName} [Upper]`
        : isLowerOnly
        ? `${cleanName} [Lower]`
        : cleanName;

      const updatePayload: Record<string, unknown> = {
        patient_name: dbName,
        clinic_name: resolvedClinicName,
        clinic_email: resolvedClinicEmail,
        patient_id: resolvedPatientId,
        patient_age: resolvedAge,
        patient_sex: resolvedSex,
        updated_at: new Date().toISOString(),
      };

      const { error: dbErr } = await supabase
        .from("cases")
        .update(updatePayload)
        .eq("id", caseItem.id);

      if (dbErr && (dbErr.message?.includes("column") || dbErr.code === "PGRST204" || dbErr.code === "42703")) {
        delete updatePayload.clinic_email;
        const retry = await supabase.from("cases").update(updatePayload).eq("id", caseItem.id);
        if (retry.error) {
          const fallbackPayload = {
            patient_name: dbName,
            updated_at: new Date().toISOString(),
          };
          await supabase.from("cases").update(fallbackPayload).eq("id", caseItem.id);
        }
      } else if (dbErr) {
        throw new Error(dbErr.message);
      }

      // Also attempt to update manifest.json in storage with fresh metadata
      try {
        const manifestUrl = `https://yrjulcwnabnhgtqebrtn.supabase.co/storage/v1/object/public/treatment-models/${caseItem.id}/manifest.json?t=${Date.now()}`;
        const mRes = await fetch(manifestUrl);
        if (mRes.ok) {
          const currentManifest = await mRes.json();
          currentManifest.patientName = cleanName;
          currentManifest.patientId = resolvedPatientId;
          currentManifest.clinicName = resolvedClinicName || undefined;
          currentManifest.clinicEmail = resolvedClinicEmail || undefined;
          currentManifest.patientAge = resolvedAge ?? undefined;
          currentManifest.patientSex = resolvedSex ?? undefined;

          const updatedBlob = new Blob([JSON.stringify(currentManifest, null, 2)], {
            type: "application/json",
          });
          await supabase.storage
            .from("treatment-models")
            .upload(`${caseItem.id}/manifest.json`, updatedBlob, {
              contentType: "application/json",
              cacheControl: "0",
              upsert: true,
            });
        }
      } catch (mErr) {
        console.warn("Could not update manifest.json metadata:", mErr);
      }

      const updatedCase: DentalCase = {
        ...caseItem,
        patient_name: dbName,
        clinic_name: resolvedClinicName,
        clinic_email: resolvedClinicEmail,
        patient_id: resolvedPatientId,
        patient_age: resolvedAge,
        patient_sex: resolvedSex,
        updated_at: new Date().toISOString(),
      };

      onCaseUpdated(updatedCase);
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "dental_viewer_sync",
          JSON.stringify({
            caseId: caseItem.id,
            updatedAt: new Date().toISOString(),
            action: "case_updated",
          })
        );
      }
      setIsProcessing(false);
      if (onToast) {
        onToast(`Case "${dbName}" updated successfully`);
      }
      onClose();
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMsg(err.message || "Failed to update case details.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          handleIncomingFiles(e.dataTransfer.files);
        }
      }}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-[#131A26] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleIncomingFiles(e.dataTransfer.files);
          }
        }}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-[#ffd166] flex items-center justify-center border border-amber-200/60 dark:border-amber-800/50">
              <Pencil className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Edit Case & Re-enter Models</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-[#ffd166]">
                  {isUnequalStages
                    ? `${existingUpperStages + existingLowerStages} Trays (U: ${existingUpperStages} · L: ${existingLowerStages})`
                    : `${currentStages} Stages`}
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Update details or re-upload 3D models without deleting the case or changing share links
              </p>
            </div>
          </div>
          {!isProcessing && (
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isProcessing ? (
            /* Progress State */
            <div className="py-8 px-4 text-center space-y-3 bg-slate-50 dark:bg-[#0D121D] rounded-xl border border-slate-200 dark:border-slate-800">
              <Loader2 className="w-8 h-8 text-amber-600 dark:text-[#ffd166] animate-spin mx-auto" />
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                  {progressMsg}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Overwriting models for Case {caseItem.patient_id || caseItem.id.slice(0, 8)} while preserving share links...
                </p>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-slate-900 dark:bg-gradient-to-r dark:from-[#e0b457] dark:to-[#c49a45] h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                {progressPct}% Completed
              </span>
            </div>
          ) : (
            <>
              {/* ── Section 1: Re-enter Models (Optional) ────────────────────────── */}
              <div className="p-4 rounded-xl border border-amber-200/70 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-amber-600 dark:text-[#ffd166]" />
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                      Re-enter / Replace 3D Models (Optional)
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    {isUnequalStages
                      ? `Current: Upper: ${existingUpperStages} stg · Lower: ${existingLowerStages} stg (${existingUpperStages + existingLowerStages} Total Trays)`
                      : `Current: ${currentStages} stages (${archLabel})`}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Drop new CAD export ZIP files below only if you want to replace the current models.
                  The existing share link will stay the same. If left empty, existing 3D models are kept.
                  <span className="text-[10px] text-amber-600 dark:text-[#ffd166] font-medium block pt-0.5">
                    Tip: You can select or drop both Upper &amp; Lower ZIPs simultaneously.
                  </span>
                </p>

                {/* Dropzones for Upper & Lower Jaw */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Upper Jaw */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        Upper Jaw .ZIP
                      </span>
                      {upperFile ? (
                        <button
                          type="button"
                          onClick={() => {
                            setUpperFile(null);
                            setUpperMeta(null);
                          }}
                          className="text-[10px] text-red-500 hover:underline"
                        >
                          Remove new ZIP
                        </button>
                      ) : hasExistingUpper ? (
                        removeExistingUpper ? (
                          <button
                            type="button"
                            onClick={() => setRemoveExistingUpper(false)}
                            className="text-[10px] text-amber-600 dark:text-[#ffd166] hover:underline font-semibold flex items-center gap-1"
                          >
                            <Undo2 className="w-3 h-3" />
                            <span>Undo</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setRemoveExistingUpper(true)}
                            className="text-[10px] text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 hover:underline flex items-center gap-1 font-medium"
                            title="Remove already added Upper models from this case"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove Models</span>
                          </button>
                        )
                      ) : null}
                    </div>
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverUpper(true);
                      }}
                      onDragLeave={() => setDragOverUpper(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOverUpper(false);
                        handleIncomingFiles(e.dataTransfer.files, "upper");
                      }}
                      onClick={() => (!upperFile ? upperInputRef.current?.click() : null)}
                      className={`border-2 border-dashed rounded-xl p-3 text-center transition-all min-h-[90px] flex flex-col justify-center cursor-pointer ${
                        upperFile
                          ? "border-sky-400 dark:border-sky-500 bg-sky-50/50 dark:bg-sky-950/20"
                          : removeExistingUpper
                          ? "border-rose-300 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20"
                          : dragOverUpper
                          ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-600 bg-white dark:bg-[#131A26]"
                      }`}
                    >
                      <input
                        ref={upperInputRef}
                        type="file"
                        accept=".zip"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          handleIncomingFiles(e.target.files, "upper");
                          e.target.value = "";
                        }}
                      />
                      {upperFile ? (
                        <div className="text-left space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-900 dark:text-white">
                            <FileCheck className="w-4 h-4 text-sky-600 dark:text-sky-400 flex-shrink-0" />
                            <span className="font-semibold truncate text-[11px]">{upperFile.name}</span>
                          </div>
                          {isInspectingUpper ? (
                            <span className="text-[10px] text-slate-400">Inspecting...</span>
                          ) : upperMeta ? (
                            <span className="inline-block text-[10px] font-bold text-sky-700 dark:text-sky-300">
                              {upperMeta.totalStages} stages detected
                            </span>
                          ) : null}
                        </div>
                      ) : removeExistingUpper ? (
                        <div className="space-y-1 text-center py-0.5">
                          <div className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                            <Trash2 className="w-3.5 h-3.5" />
                          </div>
                          <p className="font-bold text-rose-600 dark:text-rose-400 text-[11px]">
                            Upper Models Removed
                          </p>
                          <p className="text-[9px] text-slate-500 dark:text-slate-400">
                            Will be deleted on save · Drop new ZIP to replace
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setRemoveExistingUpper(false);
                            }}
                            className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900/60 transition-colors"
                          >
                            <Undo2 className="w-3 h-3" />
                            <span>Keep original models</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          {hasExistingUpper ? (
                            <>
                              <Check className="w-4 h-4 mx-auto text-emerald-500" />
                              <p className="font-semibold text-emerald-700 dark:text-emerald-400 text-[11px]">
                                Keeping Upper Models ({existingUpperStages} stg)
                              </p>
                              <p className="text-[9px] text-slate-400">Drop new ZIP to replace</p>
                            </>
                          ) : (
                            <>
                              <UploadCloud className="w-4 h-4 mx-auto text-sky-500" />
                              <p className="font-semibold text-sky-700 dark:text-sky-400 text-[11px]">
                                + Add Upper Jaw ZIP
                              </p>
                              <p className="text-[9px] text-slate-400">Converts to Dual-Arch</p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Lower Jaw */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        Lower Jaw .ZIP
                      </span>
                      {lowerFile ? (
                        <button
                          type="button"
                          onClick={() => {
                            setLowerFile(null);
                            setLowerMeta(null);
                          }}
                          className="text-[10px] text-red-500 hover:underline"
                        >
                          Remove new ZIP
                        </button>
                      ) : hasExistingLower ? (
                        removeExistingLower ? (
                          <button
                            type="button"
                            onClick={() => setRemoveExistingLower(false)}
                            className="text-[10px] text-amber-600 dark:text-[#ffd166] hover:underline font-semibold flex items-center gap-1"
                          >
                            <Undo2 className="w-3 h-3" />
                            <span>Undo</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setRemoveExistingLower(true)}
                            className="text-[10px] text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 hover:underline flex items-center gap-1 font-medium"
                            title="Remove already added Lower models from this case"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove Models</span>
                          </button>
                        )
                      ) : null}
                    </div>
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverLower(true);
                      }}
                      onDragLeave={() => setDragOverLower(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOverLower(false);
                        handleIncomingFiles(e.dataTransfer.files, "lower");
                      }}
                      onClick={() => (!lowerFile ? lowerInputRef.current?.click() : null)}
                      className={`border-2 border-dashed rounded-xl p-3 text-center transition-all min-h-[90px] flex flex-col justify-center cursor-pointer ${
                        lowerFile
                          ? "border-purple-400 dark:border-purple-500 bg-purple-50/50 dark:bg-purple-950/20"
                          : removeExistingLower
                          ? "border-rose-300 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20"
                          : dragOverLower
                          ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-600 bg-white dark:bg-[#131A26]"
                      }`}
                    >
                      <input
                        ref={lowerInputRef}
                        type="file"
                        accept=".zip"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          handleIncomingFiles(e.target.files, "lower");
                          e.target.value = "";
                        }}
                      />
                      {lowerFile ? (
                        <div className="text-left space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-900 dark:text-white">
                            <FileCheck className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                            <span className="font-semibold truncate text-[11px]">{lowerFile.name}</span>
                          </div>
                          {isInspectingLower ? (
                            <span className="text-[10px] text-slate-400">Inspecting...</span>
                          ) : lowerMeta ? (
                            <span className="inline-block text-[10px] font-bold text-purple-700 dark:text-purple-300">
                              {lowerMeta.totalStages} stages detected
                            </span>
                          ) : null}
                        </div>
                      ) : removeExistingLower ? (
                        <div className="space-y-1 text-center py-0.5">
                          <div className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                            <Trash2 className="w-3.5 h-3.5" />
                          </div>
                          <p className="font-bold text-rose-600 dark:text-rose-400 text-[11px]">
                            Lower Models Removed
                          </p>
                          <p className="text-[9px] text-slate-500 dark:text-slate-400">
                            Will be deleted on save · Drop new ZIP to replace
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setRemoveExistingLower(false);
                            }}
                            className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900/60 transition-colors"
                          >
                            <Undo2 className="w-3 h-3" />
                            <span>Keep original models</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          {hasExistingLower ? (
                            <>
                              <Check className="w-4 h-4 mx-auto text-emerald-500" />
                              <p className="font-semibold text-emerald-700 dark:text-emerald-400 text-[11px]">
                                Keeping Lower Models ({existingLowerStages} stg)
                              </p>
                              <p className="text-[9px] text-slate-400">Drop new ZIP to replace</p>
                            </>
                          ) : (
                            <>
                              <UploadCloud className="w-4 h-4 mx-auto text-purple-500" />
                              <p className="font-semibold text-purple-700 dark:text-purple-400 text-[11px]">
                                + Add Lower Jaw ZIP
                              </p>
                              <p className="text-[9px] text-slate-400">Converts to Dual-Arch</p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Section 2: Patient & Clinic Details ──────────────────────────── */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                    Patient / Case Name <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={isProcessing}
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Niya"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5 text-slate-400 dark:text-[#ffd166]" />
                      <span>Patient ID</span>
                    </label>
                    <input
                      type="text"
                      disabled={isProcessing}
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                      placeholder="e.g. PT-4790"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 dark:text-[#ffd166]" />
                      <span>Clinic / Practice Name</span>
                    </label>
                    <input
                      type="text"
                      disabled={isProcessing}
                      value={clinicName}
                      onChange={(e) => handleClinicNameChange(e.target.value)}
                      placeholder="e.g. Smile Dental Clinic"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>

                {/* Clinic Email with Autocomplete & Remembered Chips */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                      <span>Clinic Email</span>
                      <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">
                        (for 1-click mail button)
                      </span>
                    </label>
                    {savedEmails.length > 0 && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {savedEmails.length} remembered
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      list="saved-clinic-emails-edit"
                      disabled={isProcessing}
                      value={clinicEmail}
                      onChange={(e) => setClinicEmail(e.target.value)}
                      placeholder="e.g. clinic@smiledental.com"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    />
                    <datalist id="saved-clinic-emails-edit">
                      {savedEmails.map((em) => (
                        <option key={em} value={em} />
                      ))}
                    </datalist>
                  </div>
                  {savedEmails.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">Recent:</span>
                      {savedEmails.slice(0, 3).map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => setClinicEmail(em)}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-[#ffd166] hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-[#ffd166]" />
                      <span>Age</span>
                      <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">(Years)</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      disabled={isProcessing}
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      placeholder="e.g. 23"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400 dark:text-[#ffd166]" />
                      <span>Sex</span>
                    </label>
                    <select
                      disabled={isProcessing}
                      value={patientSex}
                      onChange={(e) => setPatientSex(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer"
                    >
                      <option value="">Not Specified</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50/80 dark:bg-[#0D121D] border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={isProcessing}
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide text-white dark:text-slate-950 bg-slate-900 dark:bg-gradient-to-r dark:from-[#e0b457] dark:via-[#f3c875] dark:to-[#c49a45] hover:bg-slate-800 dark:hover:brightness-105 active:scale-98 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {hasNewFiles ? (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-upload Models & Save</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Save Case Details</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

