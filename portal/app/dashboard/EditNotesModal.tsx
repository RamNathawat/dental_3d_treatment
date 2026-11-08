"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, FileText, Check, AlertCircle, Loader2, Clock, Calendar } from "lucide-react";
import { DentalCase } from "./page";

export interface StageRemarkItem {
  stage: number;
  note: string;
}

export interface DoctorNotesData {
  general?: string;
  stageRemarks?: StageRemarkItem[];
  doctorName?: string;
  clinicName?: string;
  wearHoursPerDay?: number;
  daysPerStage?: number;
  updatedAt?: string;
}

interface EditNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseItem: DentalCase;
  doctorDefaultName?: string;
  onSaved?: () => void;
}

export default function EditNotesModal({
  isOpen,
  onClose,
  caseItem,
  doctorDefaultName,
  onSaved,
}: EditNotesModalProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Doctor Notes State
  const [generalNotes, setGeneralNotes] = useState("");
  const [doctorName, setDoctorName] = useState(doctorDefaultName || "");
  const [clinicName, setClinicName] = useState("");
  const [wearHours, setWearHours] = useState(22);
  const [daysPerStage, setDaysPerStage] = useState(10);
  const [stageRemarks, setStageRemarks] = useState<StageRemarkItem[]>([]);
  const [initialNotesJson, setInitialNotesJson] = useState<string | null>(null);

  // Draft stage remark
  const [newRemarkStage, setNewRemarkStage] = useState(1);
  const [newRemarkText, setNewRemarkText] = useState("");

  const currentNotesJson = JSON.stringify({
    general: generalNotes.trim(),
    doctorName: doctorName.trim(),
    clinicName: clinicName.trim(),
    wearHours: Number(wearHours) || 22,
    daysPerStage: Number(daysPerStage) || 10,
    stageRemarks: stageRemarks
      .map((r) => ({ stage: r.stage, note: r.note.trim() }))
      .sort((a, b) => a.stage - b.stage),
  });

  const hasUnsavedChanges =
    initialNotesJson !== null && currentNotesJson !== initialNotesJson;

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    async function fetchNotes() {
      try {
        let loadedNotes: DoctorNotesData | null = null;
        const res = await fetch(`/api/cases/${caseItem.id}/notes?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.doctorNotes) {
            loadedNotes = data.doctorNotes;
          }
        }

        if (!loadedNotes) {
          // Fallback to public storage manifest
          const url = `https://yrjulcwnabnhgtqebrtn.supabase.co/storage/v1/object/public/treatment-models/${caseItem.id}/manifest.json?t=${Date.now()}`;
          const sRes = await fetch(url);
          if (sRes.ok) {
            const manifest = await sRes.json();
            if (manifest.doctorNotes) {
              loadedNotes = manifest.doctorNotes;
            }
          }
        }

        const g = loadedNotes?.general || "";
        const doc = loadedNotes?.doctorName || doctorDefaultName || "";
        const c = loadedNotes?.clinicName || caseItem.clinic_name || "";
        const w = loadedNotes?.wearHoursPerDay ?? 22;
        const d = loadedNotes?.daysPerStage ?? 10;
        const s = Array.isArray(loadedNotes?.stageRemarks) ? [...loadedNotes.stageRemarks] : [];

        setGeneralNotes(g);
        setDoctorName(doc);
        setClinicName(c);
        setWearHours(w);
        setDaysPerStage(d);
        setStageRemarks(s);
        setInitialNotesJson(
          JSON.stringify({
            general: g.trim(),
            doctorName: doc.trim(),
            clinicName: c.trim(),
            wearHours: Number(w) || 22,
            daysPerStage: Number(d) || 10,
            stageRemarks: s.map((r) => ({ stage: r.stage, note: r.note.trim() })).sort((a, b) => a.stage - b.stage),
          })
        );
      } catch (err) {
        console.warn("Could not fetch doctor notes:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, [isOpen, caseItem.id, caseItem.clinic_name, doctorDefaultName]);

  if (!isOpen) return null;

  function handleAddStageRemark() {
    if (!newRemarkText.trim()) return;

    setStageRemarks((prev) => [
      ...prev.filter((r) => r.stage !== newRemarkStage),
      { stage: newRemarkStage, note: newRemarkText.trim() },
    ]);
    setNewRemarkText("");
  }

  function handleRemoveStageRemark(stage: number) {
    setStageRemarks((prev) => prev.filter((r) => r.stage !== stage));
  }

  async function handleSave() {
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const payload: DoctorNotesData = {
        general: generalNotes.trim(),
        doctorName: doctorName.trim(),
        clinicName: clinicName.trim(),
        wearHoursPerDay: Number(wearHours) || 22,
        daysPerStage: Number(daysPerStage) || 10,
        stageRemarks: [...stageRemarks].sort((a, b) => a.stage - b.stage),
      };

      const res = await fetch(`/api/cases/${caseItem.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorNotes: payload }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save doctor notes.");
      }

      setInitialNotesJson(currentNotesJson);

      // Broadcast update to any open viewer tabs in real time
      try {
        localStorage.setItem(
          "dental_viewer_sync",
          JSON.stringify({
            caseId: caseItem.id,
            type: "notes",
            timestamp: Date.now(),
          })
        );
      } catch {}

      setSuccessMsg("Treatment plan saved successfully!");
      onSaved?.();
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      console.error("Error saving doctor notes:", err);
      setErrorMsg(err instanceof Error ? err.message : "Failed to save treatment plan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0f141f] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#131A26]/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800/80 flex items-center justify-center text-amber-700 dark:text-[#ffd166] shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Treatment Plan</span>
                <span className="text-xs font-normal text-slate-400">
                  · {caseItem.patient_name} {caseItem.patient_id ? `(#${caseItem.patient_id})` : ""}{" "}
                  {[caseItem.patient_sex, caseItem.patient_age != null ? `${caseItem.patient_age} yrs` : null].filter(Boolean).length > 0
                    ? `· ${[caseItem.patient_sex, caseItem.patient_age != null ? `${caseItem.patient_age} yrs` : null].filter(Boolean).join(", ")}`
                    : ""}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Prescribe wear guidelines, treatment plan instructions, and stage remarks for the patient
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 dark:text-slate-300">
          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-amber-500 dark:text-[#ffd166]" />
              <span>Loading treatment plan...</span>
            </div>
          ) : (
            <>
              {/* Doctor & Clinic Identity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Treating Doctor
                  </label>
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="e.g. Dr. Sarath Kumar, Orthodontist"
                    className="w-full text-xs bg-white dark:bg-[#131A26] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Clinic / Practice Name
                  </label>
                  <input
                    type="text"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    placeholder="e.g. Elite Dental & Orthodontic Care"
                    className="w-full text-xs bg-white dark:bg-[#131A26] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400 font-medium"
                  />
                </div>
              </div>

              {/* Wear Guidelines Section */}
              <div className="p-3.5 bg-slate-50 dark:bg-[#131A26]/80 rounded-xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-[#ffd166]" />
                  Wear Guidelines
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                      Daily Wear Time (Hours/Day)
                    </label>
                    <input
                      type="number"
                      min={12}
                      max={24}
                      value={wearHours}
                      onChange={(e) => setWearHours(Number(e.target.value))}
                      className="w-full text-xs bg-white dark:bg-[#0f141f] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400 font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                      Duration Per Aligner (Days/Stage)
                    </label>
                    <input
                      type="number"
                      min={3}
                      max={30}
                      value={daysPerStage}
                      onChange={(e) => setDaysPerStage(Number(e.target.value))}
                      className="w-full text-xs bg-white dark:bg-[#0f141f] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400 font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* General Treatment Instructions */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>General Treatment Plan & Instructions</span>
                  <span className="text-[10px] font-normal text-slate-400">Visible to patient in 3D viewer</span>
                </label>
                <textarea
                  rows={4}
                  value={generalNotes}
                  onChange={(e) => setGeneralNotes(e.target.value)}
                  placeholder="e.g. Wear your aligners at least 22 hours per day. Only remove for meals and oral hygiene. Use chewies for 5 minutes after inserting every new tray. Clean trays only with lukewarm water and mild antibacterial soap..."
                  className="w-full text-xs bg-white dark:bg-[#131A26] border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400 leading-relaxed font-normal"
                />
              </div>

              {/* Stage-by-Stage Remarks */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-500 dark:text-[#ffd166]" />
                    Stage-Specific Treatment Plan & Milestones
                  </span>
                  <span className="text-[10px] text-slate-400">Optional notes assigned to specific aligner stages</span>
                </div>

                {/* Add new stage remark row */}
                <div className="p-3 bg-slate-50 dark:bg-[#131A26]/60 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                  <div className="w-full sm:w-28 shrink-0">
                    <select
                      value={newRemarkStage}
                      onChange={(e) => setNewRemarkStage(Number(e.target.value))}
                      className="w-full text-xs bg-white dark:bg-[#0f141f] border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-400"
                    >
                      {Array.from({ length: caseItem.total_stages || 10 }, (_, i) => i + 1).map((s) => (
                        <option key={s} value={s}>
                          Stage {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    value={newRemarkText}
                    onChange={(e) => setNewRemarkText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddStageRemark();
                      }
                    }}
                    placeholder="e.g. Attachment bonding in clinic / IPR scheduled / Mid-course review"
                    className="flex-1 text-xs bg-white dark:bg-[#0f141f] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400 font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleAddStageRemark}
                    className="px-3 py-2 bg-slate-900 dark:bg-[#e0b457] hover:bg-slate-800 dark:hover:bg-[#f3c875] text-white dark:text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center shrink-0 cursor-pointer shadow-xs gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Plan Note</span>
                  </button>
                </div>

                {/* List of stage remarks */}
                {stageRemarks.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {[...stageRemarks]
                      .sort((a, b) => a.stage - b.stage)
                      .map((item) => (
                        <div
                          key={item.stage}
                          className="px-3 py-2 bg-white dark:bg-[#151D2C] rounded-lg border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                            <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-[#ffd166] border border-amber-300 dark:border-amber-800 shrink-0">
                              Stage {item.stage}
                            </span>
                            <span className="text-slate-800 dark:text-slate-200 font-medium break-words break-all min-w-0">{item.note}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveStageRemark(item.stage)}
                            className="p-1 text-slate-400 hover:text-red-500 rounded-md transition-colors"
                            title="Delete plan note"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2.5 bg-slate-50/50 dark:bg-[#131A26]/50 shrink-0">
          <div>
            {hasUnsavedChanges && (
              <span className="text-[11px] font-semibold text-amber-600 dark:text-[#ffd166] flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-[#ffd166]" />
                <span>Unsaved changes — click &quot;Save Treatment Plan&quot; to apply to 3D viewer</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saving || loading}
              onClick={handleSave}
              className={`px-5 py-2 rounded-xl text-xs font-bold text-white dark:text-slate-950 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                hasUnsavedChanges
                  ? "bg-slate-900 dark:bg-[#e0b457] hover:bg-slate-800 dark:hover:bg-[#f3c875] ring-2 ring-amber-400/40 dark:ring-[#ffd166]/50 shadow-md"
                  : "bg-slate-900 dark:bg-[#e0b457] hover:bg-slate-800 dark:hover:bg-[#f3c875]"
              }`}
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Treatment Plan...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Treatment Plan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

