"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Search,
  Share2,
  Trash2,
  Check,
  LogOut,
  Layers,
  Calendar,
  Eye,
  Activity,
  FolderOpen,
  Users,
  Cpu,
  ArrowUpRight,
  Database,
  Sparkles,
  Copy,
} from "lucide-react";
import { DentalCase } from "./page";
import UploadCaseModal from "./UploadCaseModal";

interface DashboardClientProps {
  email: string;
  userId: string;
  initialCases: DentalCase[];
}

export default function DashboardClient({
  email,
  userId,
  initialCases,
}: DashboardClientProps) {
  const [cases, setCases] = useState<DentalCase[]>(initialCases);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "ready" | "processing">("all");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  async function handleDeleteCase(caseId: string, patientName: string) {
    if (!confirm(`Are you sure you want to delete case "${patientName}"? This action cannot be undone.`)) {
      return;
    }

    const { error } = await supabase.from("cases").delete().eq("id", caseId);
    if (error) {
      alert("Failed to delete case: " + error.message);
    } else {
      setCases((prev) => prev.filter((c) => c.id !== caseId));
      showToast(`Case "${patientName}" removed.`);
    }
  }

  function handleCopyShareLink(shareToken: string) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/treatment.html?case=${shareToken}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(shareToken);
    showToast("Patient share link copied to clipboard");
    setTimeout(() => setCopiedToken(null), 2500);
  }

  function handleCaseCreated(newCase: DentalCase) {
    setCases((prev) => [newCase, ...prev]);
    showToast(`Case "${newCase.patient_name}" created and synced to cloud`);
  }

  const filteredCases = cases.filter((c) => {
    const matchesSearch = c.patient_name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === "all") return matchesSearch;
    return matchesSearch && c.status === activeFilter;
  });

  const totalStagesCount = cases.reduce((sum, c) => sum + (c.total_stages || 0), 0);
  const doctorInitial = email ? email[0].toUpperCase() : "D";

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row text-slate-800 antialiased selection:bg-slate-900 selection:text-white">
      {/* ─── Toast Notification ────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-3 text-sm font-medium animate-slideUp">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── Desktop Sidebar ──────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/90 p-5 fixed inset-y-0 left-0 z-30 justify-between">
        <div className="space-y-6">
          {/* Brand */}
          <div className="flex items-center gap-3 px-1 py-1">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-sm">
              3D
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-bold text-slate-900 tracking-tight">Orthodontic 3D</h1>
                <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                  Pro
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 tracking-wider uppercase">
                Clinical Studio
              </p>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => setIsUploadOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs tracking-wide text-white bg-slate-900 hover:bg-slate-800 active:scale-98 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Treatment Case
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <Link
              href="/dashboard"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 text-slate-800" />
                <span>Patient Cases</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-700 shadow-2xs border border-slate-200/60">
                {cases.length}
              </span>
            </Link>

            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-default">
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-slate-400" />
                <span>Cloud Storage</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Supabase Active" />
            </div>
          </nav>
        </div>

        {/* Sidebar Footer: System Status & Doctor Profile */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          {/* Engine Status Card */}
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-slate-500" />
                In-Browser Engine
              </span>
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                60 FPS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Auto-capping & planar sealing active. Zero server queue.
            </p>
          </div>

          {/* Doctor Profile */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shadow-2xs flex-shrink-0">
                {doctorInitial}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  Dr. {email.split("@")[0]}
                </p>
                <p className="text-[10px] text-slate-400 truncate">Clinical Practice</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign out"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex-shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main Content Area ────────────────────────────────────────── */}
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs tracking-wider">
              3D
            </div>
            <div>
              <h1 className="text-xs font-bold text-slate-900">Orthodontic Studio</h1>
              <p className="text-[10px] text-slate-400 font-medium">Dr. {email.split("@")[0]}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-900 active:scale-95 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              New Case
            </button>
            <button
              onClick={handleSignOut}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Container */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-7">
          {/* Page Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60 inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Clinical Cloud Active
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500 font-medium">Supabase Storage Synced</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Treatment Cases
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Interactive 3D orthodontic progression plans, aligner stage simulations, and patient share links.
              </p>
            </div>

            <button
              onClick={() => setIsUploadOpen(true)}
              className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide text-white bg-slate-900 hover:bg-slate-800 active:scale-98 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Upload New Case
            </button>
          </div>

          {/* Clinical Overview Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Stat 1 */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Total Cases
                </p>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5 tabular-nums">
                  {cases.length}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Active treatment records</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Users className="w-5 h-5 text-slate-700" />
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Aligner Stages
                </p>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5 tabular-nums">
                  {totalStagesCount}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Progressive step geometries</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Layers className="w-5 h-5 text-slate-700" />
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  3D Processing
                </p>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                  Real-Time
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">In-browser CAD conversion</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-slate-700" />
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white rounded-2xl p-2 sm:p-2.5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient records by name..."
                className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-slate-50 transition-all"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl overflow-x-auto">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeFilter === "all"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                All Cases ({cases.length})
              </button>
              <button
                onClick={() => setActiveFilter("ready")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeFilter === "ready"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Ready ({cases.filter((c) => c.status === "ready").length})
              </button>
            </div>
          </div>

          {/* Case Records Grid */}
          {filteredCases.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-slate-200/80 shadow-xs space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto border border-slate-200">
                <FolderOpen className="w-6 h-6 text-slate-600" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {searchQuery ? "No matching patient cases found" : "No treatment cases uploaded yet"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  {searchQuery
                    ? `No records match "${searchQuery}". Clear your search query to view all treatment files.`
                    : "Drop your Maestro 3D ZIP export archive to automatically generate a 60 FPS interactive 3D progression model."}
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-slate-900 hover:bg-slate-800 active:scale-98 transition-all shadow-sm inline-flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Upload First Treatment Case
                </button>
              </div>
            </div>
          ) : (
            /* Rich Clinical Case Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredCases.map((item) => {
                const dateStr = new Date(item.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between gap-5 group relative"
                  >
                    {/* Top Row: Patient Title & Clinical Badges */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* 3D Arch Glyph */}
                          <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0">
                            3D
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate tracking-tight group-hover:text-slate-700 transition-colors">
                              {item.patient_name}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                {dateStr}
                              </span>
                              <span className="text-slate-300">·</span>
                              <span className="text-[11px] font-semibold text-slate-600">
                                {item.total_stages} Aligner Stages
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status & Delete */}
                        <div className="flex items-center gap-1">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/70 inline-flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Ready
                          </span>
                          <button
                            onClick={() => handleDeleteCase(item.id, item.patient_name)}
                            title="Delete case"
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors ml-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Visual Stage Stepper / Progress Bar */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1.5">
                          <span>Stage 01 (Initial)</span>
                          <span className="text-slate-400 font-normal">Dual-Arch Alignment</span>
                          <span>Stage {String(item.total_stages).padStart(2, "0")} (Final)</span>
                        </div>
                        {/* Segmented Track */}
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(item.total_stages, 12) }).map((_, idx) => (
                            <div
                              key={idx}
                              className="h-1.5 flex-1 rounded-full bg-slate-900 transition-all"
                              title={`Stage ${idx + 1}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Clinical Features Pills */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                          Upper & Lower Arches
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                          Planar Sealed Base
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                          Supabase Storage
                        </span>
                      </div>
                    </div>

                    {/* Bottom Actions Row */}
                    <div className="pt-4 border-t border-slate-100/90 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                      {/* Primary CTA: Launch 3D Progression */}
                      <a
                        href={`/treatment.html?case=${item.share_token}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98"
                      >
                        <Eye className="w-4 h-4 text-white" />
                        <span>3D Progression</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                      </a>

                      {/* Secondary CTA: Share Link */}
                      <button
                        onClick={() => handleCopyShareLink(item.share_token)}
                        className={`py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 active:scale-98 ${
                          copiedToken === item.share_token
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-2xs"
                        }`}
                      >
                        {copiedToken === item.share_token ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span>Link Copied</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-4 h-4 text-slate-500" />
                            <span>Share Link</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ─── Upload Case Modal ────────────────────────────────────────── */}
      <UploadCaseModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        userId={userId}
        onCaseCreated={handleCaseCreated}
      />
    </div>
  );
}
