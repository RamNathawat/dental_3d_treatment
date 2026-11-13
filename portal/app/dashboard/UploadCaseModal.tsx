"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Layers,
  FileCheck,
  Check,
  Scissors,
  Plus,
  Trash2,
  Building2,
  Hash,
  Calendar,
  User,
  Mail,
  Stethoscope,
  Sparkles,
  Phone,
  MapPin,
  GraduationCap,
} from "lucide-react";
import { DoctorRecord, ClinicRecord } from "@/lib/practice-types";
import { saveClinic, saveDoctor } from "@/lib/practice-storage";
import {
  getSavedClinicEmails,
  saveClinicEmail,
  getSavedEmailForClinic,
} from "@/lib/clinic-email-storage";
import {
  processDentalZipInBrowser,
  extractDentalZipMetadata,
  cleanPatientNameFromFilename,
  DentalZipMetadata,
  IngestResult,
} from "@/lib/in-browser-converter";
import { DentalCase } from "./page";
import SearchableCombobox, { ComboboxItem } from "./SearchableCombobox";
import {
  UPPER_DENTAL_CONTACTS,
  LOWER_DENTAL_CONTACTS,
} from "@/lib/dental-contacts";

export interface IprDraftItem {
  id: string;
  arch: "upper" | "lower";
  contact: string;
  toothA: number;
  toothB: number;
  stage: number;
  amountMm: number;
}

interface UploadCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onCaseCreated: (newCase: DentalCase) => void;
  doctors?: DoctorRecord[];
  clinics?: ClinicRecord[];
  onOpenAddDoctor?: () => void;
  onOpenAddClinic?: () => void;
  isSoloDoctor?: boolean;
  defaultDoctorName?: string;
  onClinicCreated?: (newClinic: ClinicRecord) => void;
  onDoctorCreated?: (newDoctor: DoctorRecord) => void;
}

export default function UploadCaseModal({
  isOpen,
  onClose,
  userId,
  onCaseCreated,
  doctors = [],
  clinics = [],
  onOpenAddDoctor,
  onOpenAddClinic,
  isSoloDoctor = false,
  defaultDoctorName = "",
  onClinicCreated,
  onDoctorCreated,
}: UploadCaseModalProps) {
  const [isRefinement, setIsRefinement] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientSex, setPatientSex] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [doctorName, setDoctorName] = useState(() => (isSoloDoctor && defaultDoctorName ? defaultDoctorName : ""));
  const [clinicEmail, setClinicEmail] = useState("");
  const [savedEmails, setSavedEmails] = useState<string[]>([]);
  const [isEditingSoloDoctor, setIsEditingSoloDoctor] = useState(false);
  const [newClinicPhone, setNewClinicPhone] = useState("");
  const [newClinicAddress, setNewClinicAddress] = useState("");
  const [showNewClinicDetails, setShowNewClinicDetails] = useState(false);
  const [newDoctorSpecialization, setNewDoctorSpecialization] = useState("");
  const [newDoctorPhone, setNewDoctorPhone] = useState("");
  const [newDoctorEmail, setNewDoctorEmail] = useState("");
  const [showNewDoctorDetails, setShowNewDoctorDetails] = useState(false);
  const [isClinicOpen, setIsClinicOpen] = useState(false);
  const [isDoctorOpen, setIsDoctorOpen] = useState(false);

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

  useEffect(() => {
    if (isSoloDoctor && defaultDoctorName && !doctorName) {
      setDoctorName(defaultDoctorName);
    }
  }, [isSoloDoctor, defaultDoctorName]);

  // Load remembered clinic emails for 1-click autocomplete
  useState(() => {
    if (typeof window !== "undefined") {
      setSavedEmails(getSavedClinicEmails());
    }
  });

  function handleClinicNameChange(name: string) {
    setClinicName(name);
    // Auto-match email from clinics directory or saved emails
    const matchedClinic = clinics.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    if (matchedClinic?.email) {
      setClinicEmail(matchedClinic.email);
    } else if (!clinicEmail.trim()) {
      const match = getSavedEmailForClinic(name);
      if (match) setClinicEmail(match);
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
  const [upperFile, setUpperFile] = useState<File | null>(null);
  const [lowerFile, setLowerFile] = useState<File | null>(null);
  const [upperMeta, setUpperMeta] = useState<DentalZipMetadata | null>(null);
  const [lowerMeta, setLowerMeta] = useState<DentalZipMetadata | null>(null);

  const [isInspectingUpper, setIsInspectingUpper] = useState(false);
  const [isInspectingLower, setIsInspectingLower] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [progressPct, setProgressPct] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const [dragOverUpper, setDragOverUpper] = useState(false);
  const [dragOverLower, setDragOverLower] = useState(false);

  // IPR prescription state
  const [iprList, setIprList] = useState<IprDraftItem[]>([]);
  const [showIprSection, setShowIprSection] = useState(false);
  const [draftArch, setDraftArch] = useState<"upper" | "lower">("upper");
  const [draftContact, setDraftContact] = useState<string>("11-21");
  const [draftStage, setDraftStage] = useState<number>(1);
  const [draftAmountInput, setDraftAmountInput] = useState<string>("0.20");

  const upperInputRef = useRef<HTMLInputElement>(null);
  const lowerInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  async function handleUpperSelect(file: File) {
    if (!file.name.toLowerCase().endsWith(".zip")) {
      setErrorMsg("Please upload a .ZIP file for the Upper jaw CAD export.");
      return;
    }
    setErrorMsg("");
    setUpperFile(file);
    setIsInspectingUpper(true);

    try {
      const meta = await extractDentalZipMetadata(file, "upper");
      setUpperMeta(meta);
      if (meta.patientName) {
        setPatientName((curr) => (!curr.trim() ? meta.patientName : curr));
      }
    } catch (e) {
      console.warn("Could not extract metadata from upper zip:", e);
      const cleanName = cleanPatientNameFromFilename(file.name);
      if (cleanName) {
        setPatientName((curr) => (!curr.trim() ? cleanName : curr));
      }
    } finally {
      setIsInspectingUpper(false);
    }
  }

  async function handleLowerSelect(file: File) {
    if (!file.name.toLowerCase().endsWith(".zip")) {
      setErrorMsg("Please upload a .ZIP file for the Lower jaw CAD export.");
      return;
    }
    setErrorMsg("");
    setLowerFile(file);
    setIsInspectingLower(true);

    try {
      const meta = await extractDentalZipMetadata(file, "lower");
      setLowerMeta(meta);
      if (meta.patientName) {
        setPatientName((curr) => (!curr.trim() ? meta.patientName : curr));
      }
    } catch (e) {
      console.warn("Could not extract metadata from lower zip:", e);
      const cleanName = cleanPatientNameFromFilename(file.name);
      if (cleanName) {
        setPatientName((curr) => (!curr.trim() ? cleanName : curr));
      }
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
        // Filenames are ambiguous - inspect inner archive contents
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

    // Check if the single ZIP has both arches inside
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

  function cleanFilename(filename: string): string {
    return cleanPatientNameFromFilename(filename);
  }

  function handleResetUpper() {
    setUpperFile(null);
    setUpperMeta(null);
    if (!lowerFile) setPatientName("");
    if (lowerFile) {
      setDraftArch("lower");
      setDraftContact("41-31");
    }
    setErrorMsg("");
  }

  function handleResetLower() {
    setLowerFile(null);
    setLowerMeta(null);
    if (!upperFile) setPatientName("");
    if (upperFile) {
      setDraftArch("upper");
      setDraftContact("11-21");
    }
    setErrorMsg("");
  }

  function handleAddDraftIpr() {
    const contactList = draftArch === "upper" ? UPPER_DENTAL_CONTACTS : LOWER_DENTAL_CONTACTS;
    const found = contactList.find((c) => c.contact === draftContact);
    if (!found) return;
    const parsed = parseFloat(draftAmountInput);
    const finalAmount = isNaN(parsed) || parsed <= 0 ? 0.2 : parsed;
    setIprList((prev) => [
      ...prev.filter((item) => !(item.contact === draftContact && item.stage === draftStage)),
      {
        id: `ipr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        arch: draftArch,
        contact: found.contact,
        toothA: found.toothA,
        toothB: found.toothB,
        stage: draftStage,
        amountMm: finalAmount,
      },
    ]);
  }

  async function handleUploadAndProcess() {
    if (!upperFile && !lowerFile) {
      setErrorMsg("Please upload at least one jaw archive (Upper or Lower).");
      return;
    }
    if (!patientName.trim()) {
      setErrorMsg("Please enter the patient or case name.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg("");
    setProgressMsg("Initializing in-browser CAD engine...");
    setProgressPct(5);

    const resolvedPatientId =
      patientId.trim() || `PT-${Math.floor(1000 + Math.random() * 9000)}`;

    const parsedAge = parseInt(patientAge.trim(), 10);
    const resolvedAge = !isNaN(parsedAge) && parsedAge > 0 && parsedAge <= 120 ? parsedAge : undefined;
    const resolvedSex = patientSex.trim() || undefined;
    const resolvedClinicEmail = clinicEmail.trim() || undefined;

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
      iprList,
      undefined,
      resolvedPatientId,
      clinicName.trim() || undefined,
      resolvedAge,
      resolvedSex,
      resolvedClinicEmail,
    );

    if (result.ok && result.caseId) {
      if (resolvedClinicEmail) {
        saveClinicEmail(resolvedClinicEmail, clinicName.trim() || undefined);
      }

      // Auto-provision new clinic to directory if it doesn't exist
      if (trimmedClinicName && !matchedExistingClinic) {
        const autoClinicId = `CLN-${String(clinics.length + 1).padStart(2, "0")}`;
        void saveClinic(userId, {
          name: trimmedClinicName,
          clinicId: autoClinicId,
          email: resolvedClinicEmail || undefined,
          phone: newClinicPhone.trim() || undefined,
          address: newClinicAddress.trim() || undefined,
        })
          .then((createdClinic) => {
            if (onClinicCreated) {
              onClinicCreated(createdClinic);
            }
          })
          .catch((err) => {
            console.warn("Could not auto-save new clinic:", err);
          });
      }

      // Auto-provision new doctor to directory if it doesn't exist
      if (isNewDoctor && trimmedDoctorName) {
        const autoDoctorId = `DOC-${String(doctors.length + 1).padStart(2, "0")}`;
        void saveDoctor(userId, {
          name: trimmedDoctorName,
          doctorId: autoDoctorId,
          specialization: newDoctorSpecialization.trim() || undefined,
          phone: newDoctorPhone.trim() || undefined,
          email: newDoctorEmail.trim() || undefined,
        })
          .then((createdDoctor) => {
            if (onDoctorCreated) {
              onDoctorCreated(createdDoctor);
            }
          })
          .catch((err) => {
            console.warn("Could not auto-save new doctor:", err);
          });
      }
      const archType = result.archType || (upperFile && lowerFile ? "both" : upperFile ? "upper" : "lower");
      const cleanName = patientName.replace(/\s*\[(Upper|Lower|Dual)\]/i, "").trim();
      const dbName =
        archType === "upper"
          ? `${cleanName} [Upper]`
          : archType === "lower"
          ? `${cleanName} [Lower]`
          : cleanName;

      const createdCase: DentalCase = {
        id: result.caseId,
        dentist_id: userId,
        patient_name: dbName,
        clinic_name: clinicName.trim() || null,
        clinic_email: resolvedClinicEmail || null,
        doctor_name: doctorName.trim() || null,
        is_refinement: isRefinement,
        patient_id: result.patientId || resolvedPatientId,
        patient_age: resolvedAge ?? null,
        patient_sex: resolvedSex ?? null,
        total_stages: result.totalStages || Math.max(upperMeta?.totalStages || 1, lowerMeta?.totalStages || 1),
        upper_stages: result.upperStages ?? (archType === "lower" ? 0 : upperMeta?.totalStages || null),
        lower_stages: result.lowerStages ?? (archType === "upper" ? 0 : lowerMeta?.totalStages || null),
        expires_at: null,
        is_revoked: false,
        doctor_notes: {
          aligner_counts: {
            upper: result.upperStages,
            lower: result.lowerStages,
            total: result.totalAligners,
            is_unequal: result.isUnequal,
          },
          is_refinement: isRefinement,
          assigned_doctor: doctorName.trim() || undefined,
        },
        share_token: result.shareToken || "",
        status: "ready",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      onCaseCreated(createdCase);
      setIsProcessing(false);
      onClose();
    } else {
      setIsProcessing(false);
      setErrorMsg(result.error || "Failed to process the orthodontic models. Please verify your ZIP archives.");
    }
  }

  const isDualArch = Boolean(upperFile && lowerFile);
  const isUpperOnly = Boolean(upperFile && !lowerFile);
  const isLowerOnly = Boolean(!upperFile && lowerFile);
  const hasFiles = Boolean(upperFile || lowerFile);

  const submitButtonText = isDualArch
    ? "Convert & Upload (Dual-Arch)"
    : isUpperOnly
    ? "Convert & Upload (Upper Only)"
    : isLowerOnly
    ? "Convert & Upload (Lower Only)"
    : "Convert & Upload Case";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/75 backdrop-blur-sm animate-fadeIn"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          handleIncomingFiles(e.dataTransfer.files);
        }
      }}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#131A26] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleIncomingFiles(e.dataTransfer.files);
          }
        }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-[#ffd166] flex items-center justify-center border border-transparent dark:border-[#e0b457]/20">
              <Layers className="w-4 h-4 text-slate-700 dark:text-[#ffd166]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">New Treatment Case</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Supports separate Upper & Lower archives or Single-Arch cases
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

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* ─── Step 1: Patient, Clinic & Doctor Identification (TOP) ─── */}
          <div className="space-y-3.5">
            {/* Patient Name & Patient ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400 dark:text-[#ffd166]" />
                    <span>Patient / Case Name</span>
                    <span className="text-rose-500 font-bold">*</span>
                  </label>
                  {patientName.trim() ? (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      ✓ Ready
                    </span>
                  ) : (
                    <span className="text-[10px] text-rose-500 font-medium">Required</span>
                  )}
                </div>
                <input
                  type="text"
                  disabled={isProcessing}
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Niya"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all disabled:bg-slate-50 dark:disabled:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-slate-400 dark:text-[#ffd166]" />
                  <span>Patient ID</span>
                  <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  disabled={isProcessing}
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="e.g. PT-1049 (auto if blank)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all disabled:bg-slate-50 dark:disabled:bg-slate-900 font-mono"
                />
              </div>
            </div>

            {/* Practice Hierarchy: Clinic & Doctor Dropdowns */}
            {isSoloDoctor ? (
              <div className="space-y-2.5 min-w-0">
                {/* Treating Doctor Auto-Badge for Solo Doctor */}
                <div className="flex items-center justify-between text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 dark:text-[#ffd166] flex items-center justify-center flex-shrink-0">
                      <Stethoscope className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-slate-500 dark:text-slate-400 flex-shrink-0">Treating Doctor:</span>
                    {!isEditingSoloDoctor ? (
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {doctorName.startsWith("Dr.") ? doctorName : `Dr. ${doctorName || "Self"}`}
                      </span>
                    ) : (
                      <input
                        type="text"
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)}
                        placeholder="e.g. Dr. Your Name"
                        className="px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131A26] text-xs text-slate-800 dark:text-slate-100"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] text-amber-600 dark:text-[#ffd166] font-medium px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
                      Solo Practitioner
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsEditingSoloDoctor(!isEditingSoloDoctor)}
                      className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline cursor-pointer"
                    >
                      {isEditingSoloDoctor ? "Done" : "Edit"}
                    </button>
                  </div>
                </div>

                {/* Clinic Searchable Combobox (Full width) */}
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-1 min-w-0">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 truncate">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 dark:text-[#ffd166] flex-shrink-0" />
                      <span className="truncate">Clinic / Practice Branch</span>
                      <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">(Optional)</span>
                    </label>
                    {onOpenAddClinic && (
                      <button
                        type="button"
                        onClick={onOpenAddClinic}
                        className="text-[10px] font-semibold text-amber-600 dark:text-[#ffd166] hover:underline inline-flex items-center gap-0.5 flex-shrink-0 cursor-pointer"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>Directory +</span>
                      </button>
                    )}
                  </div>

                  <SearchableCombobox
                    entityName="Clinic"
                    icon={<Building2 className="w-3.5 h-3.5" />}
                    placeholder="Type to search or enter new clinic..."
                    value={clinicName}
                    disabled={isProcessing}
                    items={clinicComboboxItems}
                    onOpenChange={setIsClinicOpen}
                    onChange={(val) => handleClinicNameChange(val)}
                    onSelect={(item) => {
                      handleClinicNameChange(item.name);
                      if (item.raw?.email) {
                        setClinicEmail(item.raw.email);
                      }
                    }}
                  />

                  {/* Inline New Clinic Auto-Save Card (shown only when combobox is closed) */}
                  {isNewClinic && !isClinicOpen && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs transition-all animate-fadeIn">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <div className="flex items-center gap-1.5 text-amber-900 dark:text-[#ffd166] font-medium text-[11px] truncate">
                          <Sparkles className="w-3 h-3 text-amber-500 dark:text-[#ffd166] flex-shrink-0" />
                          <span className="truncate">
                            New clinic: <strong>&quot;{trimmedClinicName}&quot;</strong>
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowNewClinicDetails(!showNewClinicDetails)}
                          className="text-[10px] font-semibold text-amber-700 dark:text-[#ffd166] hover:underline cursor-pointer flex-shrink-0"
                        >
                          <span>{showNewClinicDetails ? "Hide" : "+ Details"}</span>
                        </button>
                      </div>

                      {showNewClinicDetails && (
                        <div className="space-y-1.5 mt-2 pt-2 border-t border-amber-500/20 animate-fadeIn">
                          <div>
                            <input
                              type="tel"
                              disabled={isProcessing}
                              value={newClinicPhone}
                              onChange={(e) => setNewClinicPhone(e.target.value)}
                              placeholder="Clinic Phone (+91...)"
                              className="w-full px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              disabled={isProcessing}
                              value={newClinicAddress}
                              onChange={(e) => setNewClinicAddress(e.target.value)}
                              placeholder="Address / City"
                              className="w-full px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0 items-start">
                {/* Clinic Searchable Combobox */}
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-1 min-w-0">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 truncate">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 dark:text-[#ffd166] flex-shrink-0" />
                      <span className="truncate">Clinic / Practice</span>
                    </label>
                    {onOpenAddClinic && (
                      <button
                        type="button"
                        onClick={onOpenAddClinic}
                        className="text-[10px] font-semibold text-amber-600 dark:text-[#ffd166] hover:underline inline-flex items-center gap-0.5 flex-shrink-0 cursor-pointer"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>Directory +</span>
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
                    onOpenChange={setIsClinicOpen}
                    onChange={(val) => handleClinicNameChange(val)}
                    onSelect={(item) => {
                      handleClinicNameChange(item.name);
                      if (item.raw?.email) {
                        setClinicEmail(item.raw.email);
                      }
                    }}
                  />

                  {/* Inline New Clinic Auto-Save Card (shown only when combobox is closed) */}
                  {isNewClinic && !isClinicOpen && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs transition-all animate-fadeIn">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <div className="flex items-center gap-1.5 text-amber-900 dark:text-[#ffd166] font-medium text-[11px] truncate">
                          <Sparkles className="w-3 h-3 text-amber-500 dark:text-[#ffd166] flex-shrink-0" />
                          <span className="truncate">
                            New clinic: <strong>&quot;{trimmedClinicName}&quot;</strong>
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowNewClinicDetails(!showNewClinicDetails)}
                          className="text-[10px] font-semibold text-amber-700 dark:text-[#ffd166] hover:underline cursor-pointer flex-shrink-0"
                        >
                          <span>{showNewClinicDetails ? "Hide" : "+ Details"}</span>
                        </button>
                      </div>

                      {showNewClinicDetails && (
                        <div className="space-y-1.5 mt-2 pt-2 border-t border-amber-500/20 animate-fadeIn">
                          <div>
                            <input
                              type="tel"
                              disabled={isProcessing}
                              value={newClinicPhone}
                              onChange={(e) => setNewClinicPhone(e.target.value)}
                              placeholder="Clinic Phone (+91...)"
                              className="w-full px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              disabled={isProcessing}
                              value={newClinicAddress}
                              onChange={(e) => setNewClinicAddress(e.target.value)}
                              placeholder="Address / City"
                              className="w-full px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Doctor Searchable Combobox */}
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-1 min-w-0">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 truncate">
                      <Stethoscope className="w-3.5 h-3.5 text-slate-400 dark:text-[#ffd166] flex-shrink-0" />
                      <span className="truncate">Treating Doctor</span>
                    </label>
                    {onOpenAddDoctor && (
                      <button
                        type="button"
                        onClick={onOpenAddDoctor}
                        className="text-[10px] font-semibold text-amber-600 dark:text-[#ffd166] hover:underline inline-flex items-center gap-0.5 flex-shrink-0 cursor-pointer"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>Directory +</span>
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
                    onOpenChange={setIsDoctorOpen}
                    onChange={(val) => handleDoctorNameChange(val)}
                    onSelect={(item) => {
                      handleDoctorNameChange(item.name);
                    }}
                  />

                  {/* Inline New Doctor Auto-Save Card (shown only when combobox is closed) */}
                  {isNewDoctor && !isDoctorOpen && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs transition-all animate-fadeIn">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <div className="flex items-center gap-1.5 text-amber-900 dark:text-[#ffd166] font-medium text-[11px] truncate">
                          <Sparkles className="w-3 h-3 text-amber-500 dark:text-[#ffd166] flex-shrink-0" />
                          <span className="truncate">
                            New doctor: <strong>&quot;{trimmedDoctorName}&quot;</strong>
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowNewDoctorDetails(!showNewDoctorDetails)}
                          className="text-[10px] font-semibold text-amber-700 dark:text-[#ffd166] hover:underline cursor-pointer flex-shrink-0"
                        >
                          <span>{showNewDoctorDetails ? "Hide" : "+ Contact"}</span>
                        </button>
                      </div>

                      {showNewDoctorDetails && (
                        <div className="space-y-1.5 mt-2 pt-2 border-t border-amber-500/20 animate-fadeIn">
                          <div>
                            <input
                              type="text"
                              disabled={isProcessing}
                              value={newDoctorSpecialization}
                              onChange={(e) => setNewDoctorSpecialization(e.target.value)}
                              placeholder="Specialization (e.g. Orthodontist)"
                              className="w-full px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            <input
                              type="tel"
                              disabled={isProcessing}
                              value={newDoctorPhone}
                              onChange={(e) => setNewDoctorPhone(e.target.value)}
                              placeholder="Phone"
                              className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
                            />
                            <input
                              type="email"
                              disabled={isProcessing}
                              value={newDoctorEmail}
                              onChange={(e) => setNewDoctorEmail(e.target.value)}
                              placeholder="Email"
                              className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Clinic Email */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-[#ffd166]" />
                  <span>Clinic Mailbox Email</span>
                  <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">(Auto-filled for 1-click sharing)</span>
                </label>
              </div>
              <input
                type="email"
                list="saved-clinic-emails-upload"
                disabled={isProcessing}
                value={clinicEmail}
                onChange={(e) => setClinicEmail(e.target.value)}
                placeholder="e.g. clinic@smiledental.com"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none"
              />
              <datalist id="saved-clinic-emails-upload">
                {savedEmails.map((em) => (
                  <option key={em} value={em} />
                ))}
              </datalist>
            </div>

            {/* Age & Sex */}
            <div className="grid grid-cols-2 gap-3 pt-0.5">
              <div className="relative">
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Patient Age
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  disabled={isProcessing}
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="e.g. 24"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Patient Sex
                </label>
                <select
                  disabled={isProcessing}
                  value={patientSex}
                  onChange={(e) => setPatientSex(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs"
                >
                  <option value="">Not Specified</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* ─── Step 2: 3D CAD Model ZIP Uploads ─── */}
          {!isProcessing ? (
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
              {/* Header with Title & Non-Obnoxious Refinement Checkbox */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                    Upload dental model archives:
                  </span>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                    Drag Upper &amp; Lower ZIPs simultaneously or select individually.
                  </p>
                </div>

                {/* Compact, clean Refinement toggle placed near upload */}
                <label className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all select-none border ${
                  isRefinement
                    ? "bg-amber-500/15 border-amber-500/40 text-amber-800 dark:text-[#ffd166]"
                    : "bg-slate-100 dark:bg-[#1A2234] border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                }`}>
                  <input
                    type="checkbox"
                    checked={isRefinement}
                    onChange={(e) => setIsRefinement(e.target.checked)}
                    disabled={isProcessing}
                    className="w-3.5 h-3.5 rounded text-amber-500 focus:ring-amber-500 dark:bg-slate-900 border-slate-300 dark:border-slate-700 cursor-pointer"
                  />
                  <span>Refinement Case</span>
                  {isRefinement && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  )}
                </label>
              </div>

              {/* Separate Upper & Lower Dropzones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. Upper Jaw Dropzone */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span>Upper Jaw (Maxilla)</span>
                      <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">.ZIP</span>
                    </label>
                    {upperFile && !isInspectingUpper && (
                      <button
                        type="button"
                        onClick={handleResetUpper}
                        className="text-[11px] font-medium text-slate-400 hover:text-red-500 dark:hover:text-red-400"
                        title="Remove Upper archive"
                      >
                        Remove
                      </button>
                    )}
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
                    className={`border-2 border-dashed rounded-xl p-4 text-center transition-all min-h-[135px] flex flex-col justify-center ${
                      upperFile
                        ? "border-sky-300 dark:border-sky-600/60 bg-sky-50/50 dark:bg-sky-950/20"
                        : dragOverUpper
                        ? "border-slate-800 dark:border-[#e0b457] bg-slate-50 dark:bg-[#1A2234] cursor-pointer"
                        : "border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-[#e0b457]/60 bg-transparent hover:bg-slate-50/50 dark:hover:bg-[#1A2234]/40 cursor-pointer"
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
                      <div className="space-y-1.5 text-left">
                        <div className="flex items-start gap-2 text-slate-900 dark:text-white">
                          <FileCheck className="w-5 h-5 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold truncate text-slate-900 dark:text-white" title={upperFile.name}>
                              {upperFile.name}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">
                              {(upperFile.size / (1024 * 1024)).toFixed(1)} MB
                            </p>
                          </div>
                        </div>

                        {isInspectingUpper ? (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Inspecting Maxilla...</span>
                          </div>
                        ) : upperMeta ? (
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-sky-100/70 dark:bg-sky-900/40 rounded-md text-[10px] font-semibold text-sky-800 dark:text-sky-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                            <span>{upperMeta.totalStages} Stages Detected</span>
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center mx-auto">
                          <UploadCloud className="w-4 h-4 text-slate-500 dark:text-[#ffd166]" />
                        </div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          Drop Upper ZIP
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">
                          Optional if Lower-only case
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Lower Jaw Dropzone */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span>Lower Jaw (Mandible)</span>
                      <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">.ZIP</span>
                    </label>
                    {lowerFile && !isInspectingLower && (
                      <button
                        type="button"
                        onClick={handleResetLower}
                        className="text-[11px] font-medium text-slate-400 hover:text-red-500 dark:hover:text-red-400"
                        title="Remove Lower archive"
                      >
                        Remove
                      </button>
                    )}
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
                    className={`border-2 border-dashed rounded-xl p-4 text-center transition-all min-h-[135px] flex flex-col justify-center ${
                      lowerFile
                        ? "border-purple-300 dark:border-purple-600/60 bg-purple-50/50 dark:bg-purple-950/20"
                        : dragOverLower
                        ? "border-slate-800 dark:border-[#e0b457] bg-slate-50 dark:bg-[#1A2234] cursor-pointer"
                        : "border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-[#e0b457]/60 bg-transparent hover:bg-slate-50/50 dark:hover:bg-[#1A2234]/40 cursor-pointer"
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
                      <div className="space-y-1.5 text-left">
                        <div className="flex items-start gap-2 text-slate-900 dark:text-white">
                          <FileCheck className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold truncate text-slate-900 dark:text-white" title={lowerFile.name}>
                              {lowerFile.name}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">
                              {(lowerFile.size / (1024 * 1024)).toFixed(1)} MB
                            </p>
                          </div>
                        </div>

                        {isInspectingLower ? (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Inspecting Mandible...</span>
                          </div>
                        ) : lowerMeta ? (
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-purple-100/70 dark:bg-purple-900/40 rounded-md text-[10px] font-semibold text-purple-800 dark:text-purple-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                            <span>{lowerMeta.totalStages} Stages Detected</span>
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center mx-auto">
                          <UploadCloud className="w-4 h-4 text-slate-500 dark:text-[#ffd166]" />
                        </div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          Drop Lower ZIP
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">
                          Optional if Upper-only case
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Case Configuration Pill */}
              {hasFiles && (
                <div className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0D121D] flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isDualArch
                          ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                          : isUpperOnly
                          ? "bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]"
                          : "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                      }`}
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {isDualArch
                        ? `Dual-Arch Case: Upper (${upperMeta?.totalStages || "?"} stg) + Lower (${lowerMeta?.totalStages || "?"} stg)`
                        : isUpperOnly
                        ? `Single-Arch Case: Maxilla Only (${upperMeta?.totalStages || "?"} stages)`
                        : `Single-Arch Case: Mandible Only (${lowerMeta?.totalStages || "?"} stages)`}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {isDualArch ? "Dual Arch" : isUpperOnly ? "Upper Only" : "Lower Only"}
                  </span>
                </div>
              )}
            </div>
          ) : (
            /* Progress State */
            <div className="py-6 px-4 text-center space-y-3 bg-slate-50 dark:bg-[#0D121D] rounded-xl border border-slate-200 dark:border-slate-800">
              <Loader2 className="w-8 h-8 text-slate-800 dark:text-[#ffd166] animate-spin mx-auto" />
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">{progressMsg}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Applying planar boundary capping & 60 FPS GLB compression in memory...
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-slate-900 dark:bg-gradient-to-r dark:from-[#e0b457] dark:to-[#c49a45] dark:shadow-[0_0_8px_rgba(224,180,87,0.35)] h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                {progressPct}% Completed
              </span>
            </div>
          )}

          {/* Optional Step 3: Interproximal Reduction (IPR) Plan */}
          <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-[#0D121D]">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => setShowIprSection((prev) => !prev)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-amber-600 dark:text-[#ffd166]" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Interproximal Reduction (IPR) Plan (Optional)
                </span>
                {iprList.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-[#ffd166] border border-amber-300 dark:border-amber-800">
                    {iprList.length} Planned
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                {showIprSection ? "Hide" : iprList.length > 0 ? "Edit" : "+ Add IPR"}
              </span>
            </button>

            {showIprSection && (
              <div className="p-4 pt-2 border-t border-slate-200/60 dark:border-slate-800/80 space-y-3.5">
                {/* Arch Selector Bar */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Prescribe Enamel Reduction
                  </span>
                  <div className="flex items-center gap-1 p-0.5 bg-slate-200/70 dark:bg-slate-800/90 rounded-lg border border-slate-300/40 dark:border-slate-700/60">
                    <button
                      type="button"
                      disabled={isLowerOnly}
                      onClick={() => {
                        setDraftArch("upper");
                        setDraftContact("11-21");
                      }}
                      className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        draftArch === "upper"
                          ? "bg-white dark:bg-[#1E293B] text-slate-900 dark:text-[#ffd166] shadow-xs"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                      } ${isLowerOnly ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      Upper Jaw
                    </button>
                    <button
                      type="button"
                      disabled={isUpperOnly}
                      onClick={() => {
                        setDraftArch("lower");
                        setDraftContact("41-31");
                      }}
                      className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        draftArch === "lower"
                          ? "bg-white dark:bg-[#1E293B] text-slate-900 dark:text-[#ffd166] shadow-xs"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                      } ${isUpperOnly ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      Lower Jaw
                    </button>
                  </div>
                </div>

                {/* Form Inputs Grid: 12-column layout with generous contact width */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                  {/* Tooth Contact Point: 6 of 12 cols (50% width) */}
                  <div className="sm:col-span-6 space-y-1">
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400">
                      Tooth Contact Point
                    </label>
                    <select
                      value={draftContact}
                      onChange={(e) => setDraftContact(e.target.value)}
                      className="w-full text-xs bg-white dark:bg-[#131A26] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#e0b457]/30 focus:border-[#e0b457] transition-all"
                    >
                      {(draftArch === "upper" ? UPPER_DENTAL_CONTACTS : LOWER_DENTAL_CONTACTS).map((c) => (
                        <option key={c.contact} value={c.contact}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Stage: 3 of 12 cols (25% width) */}
                  <div className="sm:col-span-3 space-y-1">
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400">
                      At Stage
                    </label>
                    <select
                      value={draftStage}
                      onChange={(e) => setDraftStage(Number(e.target.value))}
                      className="w-full text-xs bg-white dark:bg-[#131A26] border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#e0b457]/30 focus:border-[#e0b457] transition-all"
                    >
                      {Array.from(
                        { length: Math.max(upperMeta?.totalStages || lowerMeta?.totalStages || 1, 10) },
                        (_, i) => i + 1,
                      ).map((s) => (
                        <option key={s} value={s}>
                          Stage {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Reduction Amount + Add Button: 3 of 12 cols (25% width) */}
                  <div className="sm:col-span-3 space-y-1">
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400">
                      Amount
                    </label>
                    <div className="flex items-center gap-1.5">
                      <div className="relative flex-1 min-w-0">
                        <input
                          type="number"
                          step="0.05"
                          min="0.05"
                          max="1.5"
                          value={draftAmountInput}
                          onChange={(e) => setDraftAmountInput(e.target.value)}
                          placeholder="0.20"
                          className="w-full text-xs bg-white dark:bg-[#131A26] border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 pr-6 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-[#e0b457]/30 focus:border-[#e0b457] transition-all"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-semibold pointer-events-none">
                          mm
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddDraftIpr}
                        className="px-3 py-2 bg-slate-900 dark:bg-[#e0b457] hover:bg-slate-800 dark:hover:bg-[#f3c875] text-white dark:text-slate-950 font-bold rounded-xl text-xs cursor-pointer flex items-center justify-center shrink-0 transition-all shadow-xs"
                        title="Add IPR"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* List of draft IPR items */}
                {iprList.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {iprList.map((item) => (
                      <div
                        key={item.id}
                        className="px-2.5 py-1.5 bg-white dark:bg-[#182030] rounded-lg border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-[11px]"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 dark:text-slate-100">
                            {item.arch === "upper" ? "Upper" : "Lower"} {item.contact}
                          </span>
                          <span className="text-slate-400">At Stage {item.stage}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-600 dark:text-[#ffd166]">
                            {item.amountMm.toFixed(2)} mm
                          </span>
                          <button
                            type="button"
                            onClick={() => setIprList((prev) => prev.filter((x) => x.id !== item.id))}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Direct Cloud Storage Note */}
          <div className="bg-slate-50 dark:bg-[#0D121D]/70 rounded-xl p-3 border border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-slate-700 dark:text-[#ffd166] flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>Direct Cloud Storage:</strong> Raw 300+ MB OBJ files are processed
              in-memory with planar base capping and ClinCheck/3Shape anatomical coloring. Only lightweight,
              compressed 3D models are uploaded directly to Supabase Storage.
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-xl text-xs flex items-start gap-2 border border-red-100 dark:border-red-800/50">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-[#0D121D] border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-2.5">
          <button
            disabled={isProcessing}
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            disabled={
              isProcessing ||
              (!upperFile && !lowerFile) ||
              !patientName.trim() ||
              isInspectingUpper ||
              isInspectingLower
            }
            onClick={handleUploadAndProcess}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white dark:text-slate-950 bg-slate-900 dark:bg-gradient-to-r dark:from-[#e0b457] dark:via-[#f3c875] dark:to-[#c49a45] hover:bg-slate-800 dark:hover:brightness-105 active:scale-98 transition-all shadow-sm dark:shadow-[0_2px_12px_rgba(224,180,87,0.25)] disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 font-bold"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Processing...
              </>
            ) : (
              submitButtonText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
