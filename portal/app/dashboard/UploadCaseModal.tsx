"use client";

import { useState, useRef } from "react";
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  FileArchive,
  Layers,
  Sparkles,
  FileCheck,
} from "lucide-react";
import {
  processDentalZipInBrowser,
  extractDentalZipMetadata,
  DentalZipMetadata,
  IngestResult,
} from "@/lib/in-browser-converter";
import { DentalCase } from "./page";

interface UploadCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onCaseCreated: (newCase: DentalCase) => void;
}

export default function UploadCaseModal({
  isOpen,
  onClose,
  userId,
  onCaseCreated,
}: UploadCaseModalProps) {
  const [patientName, setPatientName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [detectedMeta, setDetectedMeta] = useState<DentalZipMetadata | null>(null);
  const [isInspecting, setIsInspecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [progressPct, setProgressPct] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  async function handleFileSelect(file: File) {
    if (!file.name.toLowerCase().endsWith(".zip")) {
      setErrorMsg("Please upload a .ZIP file containing your Maestro 3D stage export folders.");
      return;
    }
    setErrorMsg("");
    setSelectedFile(file);
    setIsInspecting(true);

    try {
      const meta = await extractDentalZipMetadata(file);
      setDetectedMeta(meta);
      setPatientName(meta.patientName);
    } catch (e) {
      console.warn("Could not extract metadata from zip:", e);
      // Fallback: clean outer name
      const cleanName = file.name
        .replace(/\.zip$/i, "")
        .replace(/-\d{8}T\d{6}Z.*$/i, "")
        .replace(/[_-]+/g, " ")
        .trim()
        .replace(/\b([a-z])/g, (_, c) => c.toUpperCase());
      setPatientName(cleanName);
    } finally {
      setIsInspecting(false);
    }
  }

  async function handleUploadAndProcess() {
    if (!selectedFile) {
      setErrorMsg("Please select a ZIP file first.");
      return;
    }
    if (!patientName.trim()) {
      setErrorMsg("Please enter the patient or case name.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg("");
    setProgressMsg("Initializing in-browser engine...");
    setProgressPct(5);

    const result: IngestResult = await processDentalZipInBrowser(
      selectedFile,
      patientName,
      userId,
      (msg, pct) => {
        setProgressMsg(msg);
        setProgressPct(pct);
      },
    );

    if (result.ok && result.caseId) {
      const createdCase: DentalCase = {
        id: result.caseId,
        dentist_id: userId,
        patient_name: patientName.trim(),
        total_stages: result.totalStages || detectedMeta?.totalStages || 1,
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
      setErrorMsg(result.error || "Failed to process the orthodontic models. Please check your ZIP archive.");
    }
  }

  function handleReset() {
    setSelectedFile(null);
    setDetectedMeta(null);
    setPatientName("");
    setErrorMsg("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#131A26] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-[#ffd166] flex items-center justify-center border border-transparent dark:border-[#e0b457]/20">
              <Layers className="w-4 h-4 text-slate-700 dark:text-[#ffd166]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">New Treatment Case</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Auto-detecting CAD stages & 3D cloud upload</p>
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
          {/* Step 1: Drag & Drop Zone First */}
          {!isProcessing ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Maestro 3D CAD Export (.ZIP)
                </label>
                {selectedFile && !isInspecting && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-[11px] font-medium text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-[#ffd166] underline"
                  >
                    Change archive
                  </button>
                )}
              </div>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileSelect(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => (!selectedFile ? fileInputRef.current?.click() : null)}
                className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
                  selectedFile
                    ? "border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-[#0D121D]"
                    : dragOver
                    ? "border-slate-800 dark:border-[#e0b457] bg-slate-50 dark:bg-[#1A2234] cursor-pointer"
                    : "border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-[#e0b457]/60 bg-transparent hover:bg-slate-50/50 dark:hover:bg-[#1A2234]/40 cursor-pointer"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".zip"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                />

                {selectedFile ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-3 text-slate-900 dark:text-white">
                      <FileCheck className="w-6 h-6 text-slate-800 dark:text-[#ffd166] flex-shrink-0" />
                      <div className="text-left min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-semibold truncate text-slate-900 dark:text-white">
                          {selectedFile.name}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB · Ready for conversion
                        </p>
                      </div>
                    </div>

                    {/* Metadata Pill */}
                    {isInspecting ? (
                      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 py-1">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Inspecting CAD archive...</span>
                      </div>
                    ) : detectedMeta ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-[#1E293B] rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 shadow-2xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{detectedMeta.summary}</span>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-[#ffd166] flex items-center justify-center mx-auto border border-transparent dark:border-[#e0b457]/20">
                      <UploadCloud className="w-5 h-5 text-slate-500 dark:text-[#ffd166]" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                        Click or drag & drop Maestro 3D ZIP
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                        Accepts direct export archives or nested jaw ZIP folders
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Progress State */
            <div className="py-6 px-4 text-center space-y-3 bg-slate-50 dark:bg-[#0D121D] rounded-xl border border-slate-200 dark:border-slate-800">
              <Loader2 className="w-8 h-8 text-slate-800 dark:text-[#ffd166] animate-spin mx-auto" />
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">{progressMsg}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Converting CAD meshes to 60 FPS GLBs directly in your browser...
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

          {/* Step 2: Patient / Case Name (Auto-populated from ZIP) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                Patient / Case Name
              </label>
              {detectedMeta && (
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  Auto-populated from ZIP
                </span>
              )}
            </div>
            <input
              type="text"
              disabled={isProcessing}
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder={
                selectedFile
                  ? "Enter patient or case name"
                  : "Drop ZIP above to auto-populate patient name"
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-[#e0b457]/20 focus:border-slate-900 dark:focus:border-[#e0b457] transition-all disabled:bg-slate-50 dark:disabled:bg-slate-900"
            />
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Extracted from your CAD export. You can edit or customize this name.
            </p>
          </div>

          {/* Cloud Storage Note */}
          <div className="bg-slate-50 dark:bg-[#0D121D]/70 rounded-xl p-3 border border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-slate-700 dark:text-[#ffd166] flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>Direct Cloud Storage:</strong> The raw 300+ MB OBJ files are processed
              in-memory and discarded. Only lightweight, compressed 3D models are uploaded
              directly to your Supabase Cloud Storage.
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
            disabled={isProcessing || !selectedFile || isInspecting}
            onClick={handleUploadAndProcess}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white dark:text-slate-950 bg-slate-900 dark:bg-gradient-to-r dark:from-[#e0b457] dark:via-[#f3c875] dark:to-[#c49a45] hover:bg-slate-800 dark:hover:brightness-105 active:scale-98 transition-all shadow-sm dark:shadow-[0_2px_12px_rgba(224,180,87,0.25)] disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 font-bold"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Processing...
              </>
            ) : (
              "Convert & Upload Case"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
