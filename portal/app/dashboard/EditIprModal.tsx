"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, Plus, Trash2, Scissors, Check, AlertCircle, Loader2 } from "lucide-react";
import { DentalCase } from "./page";
import {
  UPPER_DENTAL_CONTACTS,
  LOWER_DENTAL_CONTACTS,
  DentalContactDefinition,
} from "@/lib/dental-contacts";

export interface IprItem {
  id: string;
  arch: "upper" | "lower";
  contact: string;
  toothA: number;
  toothB: number;
  stage: number;
  amountMm: number;
  note?: string;
}

interface EditIprModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseItem: DentalCase;
  onSaved?: (count: number) => void;
}

export default function EditIprModal({
  isOpen,
  onClose,
  caseItem,
  onSaved,
}: EditIprModalProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [iprList, setIprList] = useState<IprItem[]>([]);
  const [manifestData, setManifestData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // New item draft inputs
  const [arch, setArch] = useState<"upper" | "lower">("upper");
  const [contactCode, setContactCode] = useState<string>("11-21");
  const [stageNum, setStageNum] = useState<number>(1);
  const [amountInput, setAmountInput] = useState<string>("0.20");

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setErrorMsg("");

    async function fetchManifest() {
      try {
        // First try the API route
        const apiRes = await fetch(`/api/cases/${caseItem.id}/ipr?t=${Date.now()}`);
        if (apiRes.ok) {
          const apiData = await apiRes.json();
          if (Array.isArray(apiData.ipr)) {
            setIprList(apiData.ipr);
          }
          if (apiData.manifest) {
            setManifestData(apiData.manifest);
          }
          return;
        }

        // Fallback to public storage URL
        const url = `https://yrjulcwnabnhgtqebrtn.supabase.co/storage/v1/object/public/treatment-models/${caseItem.id}/manifest.json?t=${Date.now()}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setManifestData(data);
          if (Array.isArray(data.ipr)) {
            setIprList(data.ipr);
          } else {
            setIprList([]);
          }
        } else {
          setIprList([]);
          setManifestData({});
        }
      } catch (err) {
        console.warn("Could not fetch manifest for IPR editing:", err);
        setIprList([]);
      } finally {
        setLoading(false);
      }
    }

    fetchManifest();
  }, [isOpen, caseItem.id]);

  if (!isOpen) return null;

  const contactsForArch = arch === "upper" ? UPPER_DENTAL_CONTACTS : LOWER_DENTAL_CONTACTS;

  function handleArchChange(newArch: "upper" | "lower") {
    setArch(newArch);
    const firstContact = newArch === "upper" ? "11-21" : "41-31";
    setContactCode(firstContact);
  }

  function handleAddEntry() {
    const contactDef = contactsForArch.find((c) => c.contact === contactCode);
    if (!contactDef) return;

    const parsedMm = parseFloat(amountInput);
    if (isNaN(parsedMm) || parsedMm <= 0) {
      setErrorMsg("Please enter a valid reduction amount in mm (e.g. 0.20).");
      return;
    }

    // Check if this contact is already planned for the exact same stage
    const exists = iprList.some(
      (item) => item.contact === contactCode && item.stage === stageNum,
    );
    if (exists) {
      setErrorMsg(`An IPR entry for contact ${contactCode} at Stage ${stageNum} already exists.`);
      return;
    }
    setErrorMsg("");

    const newItem: IprItem = {
      id: `ipr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      arch,
      contact: contactDef.contact,
      toothA: contactDef.toothA,
      toothB: contactDef.toothB,
      stage: Math.max(1, stageNum),
      amountMm: parsedMm,
    };

    setIprList((prev) => [...prev, newItem]);
  }

  function handleRemoveEntry(id: string) {
    setIprList((prev) => prev.filter((item) => item.id !== id));
  }

  async function handleSave() {
    setSaving(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/cases/${caseItem.id}/ipr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ipr: iprList }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save IPR prescription.");
      }

      onSaved?.(iprList.length);
      onClose();
    } catch (err) {
      console.error("Error saving IPR manifest:", err);
      setErrorMsg(err instanceof Error ? err.message : "Failed to save IPR prescription to storage.");
    } finally {
      setSaving(false);
    }
  }

  const totalMm = iprList.reduce((sum, item) => sum + (item.amountMm || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-xl bg-white dark:bg-[#131A26] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-[#ffd166] flex items-center justify-center border border-amber-200/50 dark:border-[#e0b457]/20">
              <Scissors className="w-4 h-4 text-amber-600 dark:text-[#ffd166]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Interproximal Reduction (IPR)</span>
                <span className="text-[11px] font-normal text-slate-400">
                  • {caseItem.patient_name}
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Prescribe enamel reduction between contact teeth and assign stages
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
              <p className="text-xs">Loading case prescription...</p>
            </div>
          ) : (
            <>
              {errorMsg && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Add New IPR Entry Form */}
              <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-[#182030] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Add IPR Value
                  </span>
                  <div className="flex items-center gap-1 p-0.5 bg-slate-200/60 dark:bg-slate-800 rounded-lg">
                    <button
                      type="button"
                      onClick={() => handleArchChange("upper")}
                      className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all ${
                        arch === "upper"
                          ? "bg-white dark:bg-[#232D42] text-slate-900 dark:text-[#ffd166] shadow-xs"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                      }`}
                    >
                      Upper Jaw
                    </button>
                    <button
                      type="button"
                      onClick={() => handleArchChange("lower")}
                      className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all ${
                        arch === "lower"
                          ? "bg-white dark:bg-[#232D42] text-slate-900 dark:text-[#ffd166] shadow-xs"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                      }`}
                    >
                      Lower Jaw
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Contact pair select */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                      Tooth Contact Point
                    </label>
                    <select
                      value={contactCode}
                      onChange={(e) => setContactCode(e.target.value)}
                      className="w-full text-xs bg-white dark:bg-[#131A26] border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    >
                      {contactsForArch.map((c) => (
                        <option key={c.contact} value={c.contact}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Stage input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 flex items-center justify-between">
                      <span>At Stage</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">Default: 1</span>
                    </label>
                    <select
                      value={stageNum}
                      onChange={(e) => setStageNum(Number(e.target.value))}
                      className="w-full text-xs bg-white dark:bg-[#131A26] border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    >
                      {Array.from({ length: Math.max(caseItem.total_stages || 1, 10) }, (_, i) => i + 1).map((s) => (
                        <option key={s} value={s}>
                          {s === 1 ? "Stage 1" : `Stage ${s}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Reduction amount input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                      Reduction (mm)
                    </label>
                    <div className="flex gap-1.5">
                      <div className="relative w-full">
                        <input
                          type="number"
                          step="0.05"
                          min="0.05"
                          max="1.5"
                          value={amountInput}
                          onChange={(e) => setAmountInput(e.target.value)}
                          placeholder="0.20"
                          className="w-full text-xs bg-white dark:bg-[#131A26] border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 pr-7 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400 font-semibold"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-semibold pointer-events-none">
                          mm
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddEntry}
                        className="px-3 py-2 bg-slate-900 dark:bg-[#e0b457] hover:bg-slate-800 dark:hover:bg-[#f3c875] text-white dark:text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center shrink-0 shadow-xs cursor-pointer"
                        title="Add this IPR entry"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">
                  Note: If stage is not specified, IPR defaults to the initial attachment/template stage (Stage 1).
                </p>
              </div>

              {/* Existing IPR Entries Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Planned IPR Entries ({iprList.length})
                  </span>
                  {iprList.length > 0 && (
                    <span className="text-[11px] font-bold text-amber-600 dark:text-[#ffd166]">
                      Total Reduction: {totalMm.toFixed(2)} mm
                    </span>
                  )}
                </div>

                {iprList.length === 0 ? (
                  <div className="py-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 dark:text-slate-500 text-xs">
                    No IPR entries added yet. Use the form above to prescribe interproximal reduction.
                  </div>
                ) : (
                  <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-[#131A26]">
                    {iprList.map((item) => (
                      <div
                        key={item.id}
                        className="px-3.5 py-2.5 flex items-center justify-between text-xs hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              item.arch === "upper"
                                ? "bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
                                : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            }`}
                          >
                            {item.arch}
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-100">
                            Tooth {item.contact}
                          </span>
                          <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                            • At Stage {item.stage}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-[#ffd166] font-bold text-[11px]">
                            {item.amountMm.toFixed(2)} mm
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveEntry(item.id)}
                            className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded transition-colors"
                            title="Remove this IPR item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-2.5 bg-slate-50/40 dark:bg-[#0f141f]/60">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white dark:text-slate-950 bg-slate-900 dark:bg-gradient-to-r dark:from-[#e0b457] dark:via-[#f3c875] dark:to-[#c49a45] hover:bg-slate-800 dark:hover:brightness-105 shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Save IPR Prescription</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

