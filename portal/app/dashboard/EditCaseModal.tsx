"use client";

import { useState, useRef, useEffect, useMemo } from "react";
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
  Stethoscope,
  Plus,
  Sparkles,
  Phone,
  MapPin,
  GraduationCap,
} from "lucide-react";
import { DentalCase } from "./page";
import SearchableCombobox, { ComboboxItem } from "./SearchableCombobox";
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
import { DoctorRecord, ClinicRecord } from "@/lib/practice-types";
import { saveClinic, saveDoctor } from "@/lib/practice-storage";

interface EditCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseItem: DentalCase;
  userId: string;
  allCases?: DentalCase[];
  doctors?: DoctorRecord[];
  clinics?: ClinicRecord[];
  isSoloDoctor?: boolean;
  defaultDoctorName?: string;
  onClinicCreated?: (newClinic: ClinicRecord) => void;
  onDoctorCreated?: (newDoctor: DoctorRecord) => void;
  onCaseUpdated: (updatedCase: DentalCase) => void;
  onToast?: (msg: string) => void;
}

export default function EditCaseModal({
  isOpen,
  onClose,
  caseItem,
  userId,
  allCases,
  doctors = [],
  clinics = [],
  isSoloDoctor = false,
  defaultDoctorName = "",
  onClinicCreated,
  onDoctorCreated,
  onCaseUpdated,
  onToast,
}: EditCaseModalProps) {
  // Form Details
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientSex, setPatientSex] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [isRefinement, setIsRefinement] = useState(false);
  const [clinicEmail, setClinicEmail] = useState("");
  const [savedEmails, setSavedEmails] = useState<string[]>([]);

  // Inline Doctor/Clinic Creation State
  const [newClinicPhone, setNewClinicPhone] = useState("");
  const [newClinicAddress, setNewClinicAddress] = useState("");
  const [showNewClinicDetails, setShowNewClinicDetails] = useState(false);
  const [newDoctorSpecialization, setNewDoctorSpecialization] = useState("");
  const [newDoctorPhone, setNewDoctorPhone] = useState("");
  const [newDoctorEmail, setNewDoctorEmail] = useState("");
  const [showNewDoctorDetails, setShowNewDoctorDetails] = useState(false);

  // Re-enter 3D Models State
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

    const initialDocName =
      caseItem.doctor_name ||
      (typeof caseItem.doctor_notes === "object" && caseItem.doctor_notes?.doctor_name) ||
      (typeof caseItem.doctor_notes === "object" && caseItem.doctor_notes?.assigned_doctor) ||
      (isSoloDoctor && defaultDoctorName ? defaultDoctorName : "");
    setDoctorName(initialDocName || "");

    const initialRefinement =
      Boolean(caseItem.is_refinement) ||
      Boolean(
        caseItem.doctor_notes &&
          typeof caseItem.doctor_notes === "object" &&
          caseItem.doctor_notes?.is_refinement
      );
    setIsRefinement(initialRefinement);

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
    setShowNewClinicDetails(false);
    setShowNewDoctorDetails(false);
  }, [isOpen, caseItem, allCases, isSoloDoctor, defaultDoctorName]);

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
  const hasExistingUpper = !isLowerOnly;
  const hasExistingLower = !isUpperOnly;
  const archLabel = isUpperOnly ? "Upper Arch Only" : isLowerOnly ? "Lower Arch Only" : "Dual-Arch Alignment";

  const trimmedClinicName = clinicName.trim();
  const matchedExistingClinic = clinics.find(
    (c) => c.name.toLowerCase() === trimmedClinicName.toLowerCase()
  );
  const isNewClinic = Boolean(trimmedClinicName && !matchedExistingClinic);

  const trimmedDoctorName = doctorName.trim();
  const cleanDoctorName = trimmedDoctorName.replace(/^dr\.?\s+/i, "").toLowerCase();
  const matchedExistingDoctor = doctors.find((d) => {
    const existingClean = d.name.replace(/^dr\.?\s+/i, "").toLowerCase();
    return (
      d.name.toLowerCase() === trimmedDoctorName.toLowerCase() ||
      existingClean === cleanDoctorName
    );
  });
  const isNewDoctor = Boolean(
    trimmedDoctorName &&
      !matchedExistingDoctor &&
      !(isSoloDoctor && defaultDoctorName && trimmedDoctorName.toLowerCase() === defaultDoctorName.toLowerCase())
  );

  function handleClinicNameChange(name: string) {
    setClinicName(name);
    const trimmed = name.trim();
    if (!trimmed) return;
    const matchedClinic = clinics.find(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (matchedClinic?.email) {
      setClinicEmail(matchedClinic.email);
    } else {
      const match = getSavedEmailForClinic(name);
      if (match) {
        setClinicEmail(match);
      }
    }
  }

  function handleDoctorNameChange(name: string) {
    setDoctorName(name);
  }

  const clinicComboboxItems: ComboboxItem[] = useMemo(() => {
    return clinics.map((c) => ({
      id: c.id,
      name: c.name,
      subtitle: c.address || c.email || (c.phone ? `Ph: ${c.phone}` : undefined),
      badge: c.clinicId || undefined,
      searchTerms: [c.name, c.clinicId || "", c.address || "", c.email || "", c.phone || ""],
      raw: c,
    }));
  }, [clinics]);

  const doctorComboboxItems: ComboboxItem[] = useMemo(() => {
    return doctors.map((d) => {
      const formattedName = d.name.startsWith("Dr.") ? d.name : `Dr. ${d.name}`;
      return {
        id: d.id,
        name: formattedName,
        subtitle: d.specialization || d.email || (d.phone ? `Ph: ${d.phone}` : undefined),
        badge: d.doctorId || d.specialization || undefined,
        searchTerms: [d.name, formattedName, d.doctorId || "", d.specialization || "", d.phone || "", d.email || ""],
        raw: d,
      };
    });
  }, [doctors]);

  async function handleUpperSelect(file: File) {
    setUpperFile(file);
    setRemoveExistingUpper(false);
    setIsInspectingUpper(true);
    setErrorMsg("");
    try {
      const meta = await extractDentalZipMetadata(file);
      setUpperMeta(meta);
    } catch {
      setUpperMeta(null);
    } finally {
      setIsInspectingUpper(false);
    }
  }

  async function handleLowerSelect(file: File) {
    setLowerFile(file);
    setRemoveExistingLower(false);
    setIsInspectingLower(true);
    setErrorMsg("");
    try {
      const meta = await extractDentalZipMetadata(file);
      setLowerMeta(meta);
    } catch {
      setLowerMeta(null);
    } finally {
      setIsInspectingLower(false);
    }
  }

  async function handleIncomingFiles(fileList: FileList | null, preferredArch?: "upper" | "lower") {
    if (!fileList || fileList.length === 0) return;
    setErrorMsg("");

    const files = Array.from(fileList).filter((f) => f.name.toLowerCase().endsWith(".zip"));
    if (files.length === 0) {
      setErrorMsg("Please select valid .ZIP files containing orthodontic STL stages.");
      return;
    }

    if (files.length >= 2) {
      const f1 = files[0];
      const f2 = files[1];
      if (!f1 || !f2) return;
      const n1 = f1.name.toLowerCase();
      const n2 = f2.name.toLowerCase();

      if (
        (n1.includes("upper") || n1.includes("maxill")) &&
        (n2.includes("lower") || n2.includes("mandib"))
      ) {
        await handleUpperSelect(f1);
        await handleLowerSelect(f2);
        return;
      } else if (
        (n2.includes("upper") || n2.includes("maxill")) &&
        (n1.includes("lower") || n1.includes("mandib"))
      ) {
        await handleUpperSelect(f2);
        await handleLowerSelect(f1);
        return;
      }
      await handleUpperSelect(f1);
      await handleLowerSelect(f2);
      return;
    }

    const file = files[0];
    if (!file) return;
    const name = file.name.toLowerCase();

    if (preferredArch === "upper") {
      await handleUpperSelect(file);
      return;
    }
    if (preferredArch === "lower") {
      await handleLowerSelect(file);
      return;
    }

    if (name.includes("upper") || name.includes("maxill")) {
      await handleUpperSelect(file);
      return;
    }
    if (name.includes("lower") || name.includes("mandib")) {
      await handleLowerSelect(file);
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

    const resolvedPatientId =
      patientId.trim() || caseItem.patient_id || `PT-${Math.floor(1000 + Math.random() * 9000)}`;
    const parsedAge = parseInt(patientAge.trim(), 10);
    const resolvedAge = !isNaN(parsedAge) && parsedAge > 0 && parsedAge <= 120 ? parsedAge : null;
    const resolvedSex = patientSex.trim() || null;
    const resolvedClinicName = clinicName.trim() || null;
    const resolvedClinicEmail = clinicEmail.trim() || null;
    const resolvedDoctorName = doctorName.trim() || null;

    // Auto-save new clinic to CRM database
    if (isNewClinic && resolvedClinicName && onClinicCreated) {
      try {
        const createdClinic = await saveClinic(userId, {
          name: resolvedClinicName,
          email: resolvedClinicEmail || undefined,
          phone: newClinicPhone.trim() || undefined,
          address: newClinicAddress.trim() || undefined,
        });
        onClinicCreated(createdClinic);
      } catch (err) {
        console.warn("Failed to auto-save new clinic:", err);
      }
    }

    // Auto-save new doctor to CRM database
    if (isNewDoctor && resolvedDoctorName && onDoctorCreated) {
      try {
        const createdDoctor = await saveDoctor(userId, {
          name: resolvedDoctorName,
          specialization: newDoctorSpecialization.trim() || undefined,
          phone: newDoctorPhone.trim() || undefined,
          email: newDoctorEmail.trim() || undefined,
        });
        onDoctorCreated(createdDoctor);
      } catch (err) {
        console.warn("Failed to auto-save new doctor:", err);
      }
    }

    if (resolvedClinicEmail) {
      saveClinicEmail(resolvedClinicEmail, resolvedClinicName);
    }

    const existingNotes =
      caseItem.doctor_notes && typeof caseItem.doctor_notes === "object"
        ? caseItem.doctor_notes
        : {};

    const updatedDoctorNotes = {
      ...existingNotes,
      doctor_name: resolvedDoctorName || undefined,
      assigned_doctor: resolvedDoctorName || undefined,
      doctor_id: matchedExistingDoctor?.id || (existingNotes as any).doctor_id || undefined,
      is_refinement: isRefinement,
      clinic_email: resolvedClinicEmail || undefined,
    };

    // ──────────────────────────────────────────────────────────────────────────
    // CASE A: Re-entering / replacing 3D Models or Removing an Existing Arch
    // ──────────────────────────────────────────────────────────────────────────
    const hasModelChanges = Boolean(upperFile || lowerFile || removeExistingUpper || removeExistingLower);

    if (hasModelChanges) {
      const willHaveUpper = Boolean(upperFile || (hasExistingUpper && !removeExistingUpper));
      const willHaveLower = Boolean(lowerFile || (hasExistingLower && !removeExistingLower));

      if (!willHaveUpper && !willHaveLower) {
        setIsProcessing(false);
        setErrorMsg(
          "A treatment case must contain at least one arch (Upper or Lower). To delete the entire case, use the delete button on the dashboard."
        );
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
        updatedDoctorNotes,
        resolvedPatientId,
        resolvedClinicName || undefined,
        resolvedAge ?? undefined,
        resolvedSex ?? undefined,
        resolvedClinicEmail ?? undefined,
        caseItem.id, // existingCaseId: overwrites models for this case!
        {
          removeExistingUpper,
          removeExistingLower,
        }
      );

      if (result.ok && result.caseId) {
        const willBeBoth = Boolean((result.hasUpper && result.hasLower) || (willHaveUpper && willHaveLower));
        const archType = willBeBoth ? "both" : result.archType || (willHaveUpper ? "upper" : "lower");
        const cleanName = patientName.replace(/\s*\[(Upper|Lower|Dual)\]/i, "").trim();
        const dbName =
          archType === "upper"
            ? `${cleanName} [Upper]`
            : archType === "lower"
            ? `${cleanName} [Lower]`
            : cleanName;

        const resolvedUpperStages =
          result.upperStages ?? (willHaveUpper ? (caseItem.upper_stages ?? caseItem.total_stages) : null);
        const resolvedLowerStages =
          result.lowerStages ??
          (willHaveLower ? (caseItem.lower_stages ?? (result.totalStages ? 1 : null)) : null);

        const updatedCase: DentalCase = {
          ...caseItem,
          patient_name: dbName,
          clinic_name: resolvedClinicName,
          clinic_email: resolvedClinicEmail,
          doctor_name: resolvedDoctorName,
          is_refinement: isRefinement,
          patient_id: result.patientId || resolvedPatientId,
          patient_age: resolvedAge,
          patient_sex: resolvedSex,
          total_stages: result.totalStages || caseItem.total_stages || 1,
          upper_stages: resolvedUpperStages,
          lower_stages: resolvedLowerStages,
          doctor_notes: {
            ...updatedDoctorNotes,
            aligner_counts: {
              upper: resolvedUpperStages ?? undefined,
              lower: resolvedLowerStages ?? undefined,
              total: result.totalAligners || (resolvedUpperStages || 0) + (resolvedLowerStages || 0),
              is_unequal:
                result.isUnequal ??
                Boolean(
                  resolvedUpperStages &&
                    resolvedLowerStages &&
                    resolvedUpperStages !== resolvedLowerStages
                ),
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
    setProgressMsg("Updating case details and assignments...");
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
        doctor_name: resolvedDoctorName,
        is_refinement: isRefinement,
        doctor_notes: updatedDoctorNotes,
        patient_id: resolvedPatientId,
        patient_age: resolvedAge,
        patient_sex: resolvedSex,
        updated_at: new Date().toISOString(),
      };

      const { error: dbErr } = await supabase
        .from("cases")
        .update(updatePayload)
        .eq("id", caseItem.id);

      if (
        dbErr &&
        (dbErr.message?.includes("column") || dbErr.code === "PGRST204" || dbErr.code === "42703")
      ) {
        // Fallback: omit extra columns if database schema hasn't run migrations
        delete updatePayload.clinic_email;
        delete updatePayload.is_refinement;
        delete updatePayload.doctor_name;
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

      // Also update manifest.json in storage
      try {
        const manifestUrl = `https://yrjulcwnabnhgtqebrtn.supabase.co/storage/v1/object/public/treatment-models/${caseItem.id}/manifest.json?t=${Date.now()}`;
        const mRes = await fetch(manifestUrl);
        if (mRes.ok) {
          const currentManifest = await mRes.json();
          currentManifest.patientName = cleanName;
          currentManifest.patientId = resolvedPatientId;
          currentManifest.clinicName = resolvedClinicName || undefined;
          currentManifest.clinicEmail = resolvedClinicEmail || undefined;
          currentManifest.doctorName = resolvedDoctorName || undefined;
          currentManifest.isRefinement = isRefinement;
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
        doctor_name: resolvedDoctorName,
        is_refinement: isRefinement,
        patient_id: resolvedPatientId,
        patient_age: resolvedAge,
        patient_sex: resolvedSex,
        doctor_notes: updatedDoctorNotes,
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
      console.error("Failed to update case details:", err);
      setIsProcessing(false);
      setErrorMsg(err.message || "Failed to update case. Please try again.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-xl bg-white dark:bg-[#131A26] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-[#ffd166] flex items-center justify-center border border-amber-500/20">
              <Pencil className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Edit Case &amp; Re-enter Models</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {currentStages} Stages
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Update case details, assigned doctor, clinic, or re-upload 3D progression models.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Progress / Spinner Overlay */}
          {isProcessing && (
            <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-[#1A2234] border border-amber-200 dark:border-[#e0b457]/30 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-500 dark:text-[#ffd166]" />
              <div>
                <p className="font-semibold text-xs text-slate-800 dark:text-slate-100">
                  {progressMsg || "Processing case update..."}
                </p>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
                  <div
                    className="bg-amber-500 dark:bg-[#ffd166] h-1.5 transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!isProcessing && (
            <>
              {/* ── Section 1: Patient & Assignment Details (Unified with New Case) ── */}
              <div className="space-y-3">
                {/* Patient Name & Patient ID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1 flex items-center justify-between">
                      <span>
                        Patient / Case Name <span className="text-amber-500">*</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      disabled={isProcessing}
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Niya"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5 text-slate-400 dark:text-[#ffd166]" />
                      <span>Patient ID (Optional)</span>
                    </label>
                    <input
                      type="text"
                      disabled={isProcessing}
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                      placeholder="e.g. PT-1049"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Clinic & Doctor Searchable Comboboxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
                  {/* Clinic Searchable Combobox */}
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center justify-between gap-1 min-w-0">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 truncate">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 dark:text-[#ffd166] flex-shrink-0" />
                        <span className="truncate">Clinic / Practice</span>
                      </label>
                      {clinicName && (
                        <button
                          type="button"
                          onClick={() => setClinicName("")}
                          className="text-[10px] font-semibold text-amber-600 dark:text-[#ffd166] hover:underline inline-flex items-center gap-0.5 flex-shrink-0 cursor-pointer"
                        >
                          <Plus className="w-2.5 h-2.5" />
                          <span>New</span>
                        </button>
                      )}
                    </div>

                    <SearchableCombobox
                      entityName="Clinic"
                      icon={<Building2 className="w-3.5 h-3.5" />}
                      placeholder="Type to search or enter clinic..."
                      value={clinicName}
                      disabled={isProcessing}
                      items={clinicComboboxItems}
                      onChange={(val) => handleClinicNameChange(val)}
                      onSelect={(item) => {
                        handleClinicNameChange(item.name);
                        if (item.raw?.email) {
                          setClinicEmail(item.raw.email);
                        }
                      }}
                    />
                  </div>

                  {/* Doctor Searchable Combobox */}
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center justify-between gap-1 min-w-0">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 truncate">
                        <Stethoscope className="w-3.5 h-3.5 text-slate-400 dark:text-[#ffd166] flex-shrink-0" />
                        <span className="truncate">Treating Doctor</span>
                      </label>
                      {doctorName && (
                        <button
                          type="button"
                          onClick={() => setDoctorName("")}
                          className="text-[10px] font-semibold text-amber-600 dark:text-[#ffd166] hover:underline inline-flex items-center gap-0.5 flex-shrink-0 cursor-pointer"
                        >
                          <Plus className="w-2.5 h-2.5" />
                          <span>New</span>
                        </button>
                      )}
                    </div>

                    <SearchableCombobox
                      entityName="Doctor"
                      icon={<Stethoscope className="w-3.5 h-3.5" />}
                      placeholder="Type to search or enter doctor..."
                      value={doctorName}
                      disabled={isProcessing}
                      items={doctorComboboxItems}
                      onChange={(val) => handleDoctorNameChange(val)}
                      onSelect={(item) => {
                        handleDoctorNameChange(item.name);
                      }}
                    />
                  </div>
                </div>

                {/* Inline New Clinic Auto-Save Card */}
                {isNewClinic && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs transition-all animate-fadeIn">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 text-amber-900 dark:text-[#ffd166] font-medium text-xs">
                        <Sparkles className="w-4 h-4 text-amber-500 dark:text-[#ffd166] flex-shrink-0" />
                        <span>
                          New clinic <strong>&quot;{trimmedClinicName}&quot;</strong> will be saved to your directory
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowNewClinicDetails(!showNewClinicDetails)}
                        className="text-xs font-semibold text-amber-700 dark:text-[#ffd166] hover:underline cursor-pointer flex items-center gap-1 flex-shrink-0"
                      >
                        <span>{showNewClinicDetails ? "Hide details" : "+ Add phone & address"}</span>
                      </button>
                    </div>

                    {showNewClinicDetails && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2.5 pt-2.5 border-t border-amber-500/20 animate-fadeIn">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-400 dark:text-[#ffd166]" />
                            <span>Clinic Phone</span>
                          </label>
                          <input
                            type="tel"
                            disabled={isProcessing}
                            value={newClinicPhone}
                            onChange={(e) => setNewClinicPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-slate-400 dark:text-[#ffd166]" />
                            <span>Address / City</span>
                          </label>
                          <input
                            type="text"
                            disabled={isProcessing}
                            value={newClinicAddress}
                            onChange={(e) => setNewClinicAddress(e.target.value)}
                            placeholder="e.g. 124 MG Road, Bangalore"
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Inline New Doctor Auto-Save Card */}
                {isNewDoctor && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs transition-all animate-fadeIn">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 text-amber-900 dark:text-[#ffd166] font-medium text-xs">
                        <Sparkles className="w-4 h-4 text-amber-500 dark:text-[#ffd166]" />
                        <span>
                          New doctor <strong>&quot;{trimmedDoctorName}&quot;</strong> will be saved to your directory
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowNewDoctorDetails(!showNewDoctorDetails)}
                        className="text-xs font-semibold text-amber-700 dark:text-[#ffd166] hover:underline cursor-pointer flex items-center gap-1 flex-shrink-0"
                      >
                        <span>{showNewDoctorDetails ? "Hide details" : "+ Add contact"}</span>
                      </button>
                    </div>

                    {showNewDoctorDetails && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2.5 pt-2.5 border-t border-amber-500/20 animate-fadeIn">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                            <GraduationCap className="w-3 h-3 text-slate-400 dark:text-[#ffd166]" />
                            <span>Specialization</span>
                          </label>
                          <input
                            type="text"
                            disabled={isProcessing}
                            value={newDoctorSpecialization}
                            onChange={(e) => setNewDoctorSpecialization(e.target.value)}
                            placeholder="e.g. Orthodontist"
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-400 dark:text-[#ffd166]" />
                            <span>Phone</span>
                          </label>
                          <input
                            type="tel"
                            disabled={isProcessing}
                            value={newDoctorPhone}
                            onChange={(e) => setNewDoctorPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-slate-400 dark:text-[#ffd166]" />
                            <span>Email</span>
                          </label>
                          <input
                            type="email"
                            disabled={isProcessing}
                            value={newDoctorEmail}
                            onChange={(e) => setNewDoctorEmail(e.target.value)}
                            placeholder="doctor@clinic.com"
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Clinic Mailbox Email */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-[#ffd166]" />
                      <span>Clinic Mailbox Email</span>
                      <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">
                        (Auto-filled for 1-click sharing)
                      </span>
                    </label>
                  </div>
                  <input
                    type="email"
                    list="saved-clinic-emails-edit"
                    disabled={isProcessing}
                    value={clinicEmail}
                    onChange={(e) => setClinicEmail(e.target.value)}
                    placeholder="e.g. clinic@smiledental.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                  />
                  <datalist id="saved-clinic-emails-edit">
                    {savedEmails.map((em) => (
                      <option key={em} value={em} />
                    ))}
                  </datalist>
                </div>

                {/* Age & Sex & Refinement Checkbox */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-[#ffd166]" />
                      <span>Patient Age</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      disabled={isProcessing}
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      placeholder="e.g. 24"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400 dark:text-[#ffd166]" />
                      <span>Patient Sex</span>
                    </label>
                    <select
                      disabled={isProcessing}
                      value={patientSex}
                      onChange={(e) => setPatientSex(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    >
                      <option value="">Not Specified</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Refinement Case Checkbox Toggle */}
                  <div className="pt-2 sm:pt-0">
                    <label
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all select-none border w-full justify-center ${
                        isRefinement
                          ? "bg-amber-500/15 border-amber-500/40 text-amber-800 dark:text-[#ffd166]"
                          : "bg-slate-100 dark:bg-[#1A2234] border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isRefinement}
                        onChange={(e) => setIsRefinement(e.target.checked)}
                        disabled={isProcessing}
                        className="w-3.5 h-3.5 rounded text-amber-500 focus:ring-amber-500 dark:bg-slate-900 border-slate-300 dark:border-slate-700 cursor-pointer"
                      />
                      <span className="font-semibold">Refinement Case</span>
                      {isRefinement && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                    </label>
                  </div>
                </div>
              </div>

              {/* ── Section 2: Re-enter / Replace 3D Models (Optional) ──────── */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0E1420] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-amber-500 dark:text-[#ffd166]" />
                    <span className="font-semibold text-slate-900 dark:text-white text-xs">
                      Re-enter / Replace 3D Models (Optional)
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    Current: {currentStages} stages ({archLabel})
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Drop new CAD export ZIP files below only if you want to replace the current models.
                  The existing share link will stay the same. If left empty, existing 3D models are kept.
                </p>

                {/* Dropzones */}
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
                          className="text-[10px] text-red-500 hover:underline cursor-pointer"
                        >
                          Remove new ZIP
                        </button>
                      ) : hasExistingUpper ? (
                        removeExistingUpper ? (
                          <button
                            type="button"
                            onClick={() => setRemoveExistingUpper(false)}
                            className="text-[10px] text-amber-600 dark:text-[#ffd166] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Undo2 className="w-3 h-3" />
                            <span>Undo</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setRemoveExistingUpper(true)}
                            className="text-[10px] text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
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
                            className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
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
                          className="text-[10px] text-red-500 hover:underline cursor-pointer"
                        >
                          Remove new ZIP
                        </button>
                      ) : hasExistingLower ? (
                        removeExistingLower ? (
                          <button
                            type="button"
                            onClick={() => setRemoveExistingLower(false)}
                            className="text-[10px] text-amber-600 dark:text-[#ffd166] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Undo2 className="w-3 h-3" />
                            <span>Undo</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setRemoveExistingLower(true)}
                            className="text-[10px] text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
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
                            className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
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
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-4 bg-slate-50/80 dark:bg-[#0D121D] border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isProcessing || !patientName.trim()}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white dark:text-slate-950 bg-slate-900 dark:bg-gradient-to-r dark:from-[#e0b457] dark:to-[#c49a45] hover:brightness-105 active:scale-98 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
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
