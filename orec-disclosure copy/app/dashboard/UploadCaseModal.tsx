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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Layers className="w-4 h-4 text-slate-700" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">New Treatment Case</h2>
              <p className="text-[11px] text-slate-500">Auto-detecting CAD stages & 3D cloud upload</p>
            </div>
          </div>
          {!isProcessing && (
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
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
                <label className="block text-xs font-semibold text-slate-700">
                  Maestro 3D CAD Export (.ZIP)
                </label>
                {selectedFile && !isInspecting && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-[11px] font-medium text-slate-400 hover:text-slate-700 underline"
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
                    ? "border-slate-300 bg-slate-50/70"
                    : dragOver
                    ? "border-slate-800 bg-slate-50 cursor-pointer"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 cursor-pointer"
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
                    <div className="flex items-center justify-center gap-3 text-slate-900">
                      <FileCheck className="w-6 h-6 text-slate-800 flex-shrink-0" />
                      <div className="text-left min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-semibold truncate text-slate-900">
                          {selectedFile.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB · Ready for conversion
                        </p>
                      </div>
                    </div>

                    {/* Metadata Pill */}
                    {isInspecting ? (
                      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 py-1">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Inspecting CAD archive...</span>
                      </div>
                    ) : detectedMeta ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 shadow-2xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{detectedMeta.summary}</span>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
                      <UploadCloud className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-800">
                        Click or drag & drop Maestro 3D ZIP
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Accepts direct export archives or nested jaw ZIP folders
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Progress State */
            <div className="py-6 px-4 text-center space-y-3 bg-slate-50 rounded-xl border border-slate-200">
              <Loader2 className="w-8 h-8 text-slate-800 animate-spin mx-auto" />
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-900">{progressMsg}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Converting CAD meshes to 60 FPS GLBs directly in your browser...
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-slate-900 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-slate-700 tabular-nums">
                {progressPct}% Completed
              </span>
            </div>
          )}

          {/* Step 2: Patient / Case Name (Auto-populated from ZIP) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Patient / Case Name
              </label>
              {detectedMeta && (
                <span className="text-[10px] text-slate-500 font-medium">
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
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all disabled:bg-slate-50"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Extracted from your CAD export. You can edit or customize this name.
            </p>
          </div>

          {/* Cloud Storage Note */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-slate-700 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-600 leading-relaxed">
              <strong>Direct Cloud Storage:</strong> The raw 300+ MB OBJ files are processed
              in-memory and discarded. Only lightweight, compressed 3D models are uploaded
              directly to your Supabase Cloud Storage.
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-start gap-2 border border-red-100">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            disabled={isProcessing}
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            disabled={isProcessing || !selectedFile || isInspecting}
            onClick={handleUploadAndProcess}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-98 transition-all shadow-sm disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
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
