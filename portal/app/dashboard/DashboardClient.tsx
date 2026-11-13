"use client";

import { useState, useEffect } from "react";
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
  ArrowUpRight,
  Clock,
  Copy,
  Sun,
  Moon,
  Scissors,
  FileText,
  Building2,
  Hash,
  Mail,
  Pencil,
  Stethoscope,
  Settings,
  Sparkles,
  Filter,
  LayoutGrid,
  SlidersHorizontal,
} from "lucide-react";
import { DentalCase } from "./page";
import UploadCaseModal from "./UploadCaseModal";
import EditIprModal from "./EditIprModal";
import EditNotesModal from "./EditNotesModal";
import ShareModal from "./ShareModal";
import EditCaseModal from "./EditCaseModal";
import PracticeProfileModal from "./PracticeProfileModal";
import DoctorsView from "./DoctorsView";
import ClinicsView from "./ClinicsView";
import SettingsView from "./SettingsView";
import { PracticeProfile, DoctorRecord, ClinicRecord } from "@/lib/practice-types";
import {
  fetchPracticeProfile,
  fetchDoctors,
  fetchClinics,
  isDoctorProfileIncomplete,
  isClinicProfileIncomplete,
} from "@/lib/practice-storage";
import { getCaseTrayInfo } from "@/lib/case-tray-info";
import { getCaseLinkAccess } from "@/lib/link-access";
export { getCaseTrayInfo, getCaseLinkAccess };

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
  const [selectedIprCase, setSelectedIprCase] = useState<DentalCase | null>(null);
  const [selectedNotesCase, setSelectedNotesCase] = useState<DentalCase | null>(null);
  const [selectedShareCase, setSelectedShareCase] = useState<DentalCase | null>(null);
  const [selectedEditCase, setSelectedEditCase] = useState<DentalCase | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDark, setIsDark] = useState<boolean>(false);
  const [archCountsMap, setArchCountsMap] = useState<
    Record<string, { upper: number; lower: number; total: number; isUnequal: boolean }>
  >({});
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<"cases" | "doctors" | "clinics" | "settings">("cases");
  const [practiceProfile, setPracticeProfile] = useState<PracticeProfile | null>(null);
  const [doctors, setDoctors] = useState<DoctorRecord[]>([]);
  const [clinics, setClinics] = useState<ClinicRecord[]>([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [selectedClinicFilter, setSelectedClinicFilter] = useState<string>("all");
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState<string>("all");
  const [dashboardLayout, setDashboardLayout] = useState<"streamlined" | "classic">("streamlined");

  useEffect(() => {
    if (typeof window !== "undefined" && userId) {
      const saved = localStorage.getItem(`dental_dashboard_layout_${userId}`);
      if (saved === "classic" || saved === "streamlined") {
        setDashboardLayout(saved as "streamlined" | "classic");
      }
    }
  }, [userId]);

  function handleLayoutChange(mode: "streamlined" | "classic") {
    setDashboardLayout(mode);
    if (typeof window !== "undefined" && userId) {
      localStorage.setItem(`dental_dashboard_layout_${userId}`, mode);
    }
  }

  const isSoloDoctor = practiceProfile?.firmType === "solo";
  const defaultDoctorName =
    practiceProfile?.firmName || (email ? email.split("@")[0] : "");

  useEffect(() => {
    if (isSoloDoctor && currentTab === "doctors") {
      setCurrentTab("cases");
    }
  }, [isSoloDoctor, currentTab]);

  useEffect(() => {
    setIsMounted(true);
    if (!userId) return;

    const isDismissed =
      typeof window !== "undefined" &&
      localStorage.getItem(`dental_onboarding_dismissed_${userId}`) === "true";

    fetchPracticeProfile(userId, email).then((prof) => {
      setPracticeProfile(prof);
      if (!prof && !isDismissed) {
        setIsOnboarding(true);
        setIsProfileModalOpen(true);
      }
    });

    fetchDoctors(userId).then(setDoctors);

    const existingClinicNames = cases.map((c) => c.clinic_name || "").filter(Boolean);
    fetchClinics(userId, existingClinicNames).then(setClinics);
  }, [userId, email]);

  const router = useRouter();
  const supabase = createClient();

  // Self-healing: load and cache upper & lower aligner stage counts for dual-arch cases
  useEffect(() => {
    const casesNeedingCounts = cases.filter((c) => {
      const isSingle = c.patient_name.includes("[Upper]") || c.patient_name.includes("[Lower]");
      if (isSingle) return false;
      const hasDbCounts = c.upper_stages != null && c.lower_stages != null;
      const hasNoteCounts = Boolean(c.doctor_notes?.aligner_counts);
      const hasMapCounts = Boolean(archCountsMap[c.id]);
      return !hasDbCounts && !hasNoteCounts && !hasMapCounts;
    });

    if (casesNeedingCounts.length === 0) return;

    let isMounted = true;

    async function resolveArchCounts() {
      for (const c of casesNeedingCounts) {
        try {
          const res = await fetch(
            `https://yrjulcwnabnhgtqebrtn.supabase.co/storage/v1/object/public/treatment-models/${c.id}/manifest.json?t=${Date.now()}`
          );
          if (!res.ok) continue;
          const manifest = await res.json();

          let upper = (manifest.upperStagesCount as number) || 0;
          let lower = (manifest.lowerStagesCount as number) || 0;

          if (manifest.doctorNotes?.aligner_counts) {
            upper = manifest.doctorNotes.aligner_counts.upper ?? upper;
            lower = manifest.doctorNotes.aligner_counts.lower ?? lower;
          }

          if (!upper || !lower) {
            if (Array.isArray(manifest.treatmentStages)) {
              let uCount = 0;
              let lCount = 0;
              for (const st of manifest.treatmentStages) {
                if (st.upper) uCount++;
                if (st.lower) lCount++;
              }
              if (!upper && uCount > 0) upper = uCount;
              if (!lower && lCount > 0) lower = lCount;
            }
          }

          if (!upper) upper = c.total_stages || 1;
          if (!lower) lower = c.total_stages || 1;

          const isUnequal = upper !== lower;
          const total = upper + lower;

          if (isMounted) {
            setArchCountsMap((prev) => ({
              ...prev,
              [c.id]: { upper, lower, total, isUnequal },
            }));
          }

          // Silently cache in Supabase doctor_notes if not yet present
          if (!c.doctor_notes?.aligner_counts) {
            const currentNotes =
              c.doctor_notes && typeof c.doctor_notes === "object" ? c.doctor_notes : {};
            const updatedNotes = {
              ...currentNotes,
              aligner_counts: {
                upper,
                lower,
                total,
                is_unequal: isUnequal,
              },
            };
            supabase
              .from("cases")
              .update({
                upper_stages: upper,
                lower_stages: lower,
                doctor_notes: updatedNotes,
              })
              .eq("id", c.id)
              .then(({ error }) => {
                if (error) {
                  // Fallback to doctor_notes only if columns do not exist
                  supabase
                    .from("cases")
                    .update({ doctor_notes: updatedNotes })
                    .eq("id", c.id);
                }
              });
          }
        } catch (err) {
          console.warn(`Could not resolve arch counts for case ${c.id}:`, err);
        }
      }
    }

    void resolveArchCounts();

    return () => {
      isMounted = false;
    };
  }, [cases, archCountsMap, supabase]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("dental_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme ? savedTheme === "dark" : prefersDark;
    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  function toggleTheme() {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        document.documentElement.setAttribute("data-theme", "dark");
        try {
          localStorage.setItem("dental_theme", "dark");
        } catch {}
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.setAttribute("data-theme", "light");
        try {
          localStorage.setItem("dental_theme", "light");
        } catch {}
      }
      return next;
    });
  }

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
    const url = `${origin}/treatment?case=${shareToken}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(shareToken);
    showToast("Patient share link copied to clipboard");
    setTimeout(() => setCopiedToken(null), 2500);
  }

  function handleCaseCreated(newCase: DentalCase) {
    setCases((prev) => [newCase, ...prev]);
    showToast(`Case "${newCase.patient_name}" created and synced to cloud`);
  }

  function handleCaseUpdated(updatedCase: DentalCase) {
    setCases((prev) =>
      prev.map((c) => (c.id === updatedCase.id ? updatedCase : c))
    );
    setSelectedShareCase((prev) =>
      prev && prev.id === updatedCase.id ? updatedCase : prev,
    );
    setSelectedEditCase((prev) =>
      prev && prev.id === updatedCase.id ? updatedCase : prev,
    );
    setSelectedNotesCase((prev) =>
      prev && prev.id === updatedCase.id ? updatedCase : prev,
    );
    setSelectedIprCase((prev) =>
      prev && prev.id === updatedCase.id ? updatedCase : prev,
    );
  }

  function handleEmailUpdated(caseId: string, email: string) {
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, clinic_email: email } : c))
    );
  }

  const filteredCases = cases.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    const docName = (c.doctor_name || c.doctor_notes?.assigned_doctor || "").toLowerCase();
    const matchesSearch =
      !q ||
      c.patient_name.toLowerCase().includes(q) ||
      Boolean(c.patient_id && c.patient_id.toLowerCase().includes(q)) ||
      Boolean(c.clinic_name && c.clinic_name.toLowerCase().includes(q)) ||
      Boolean(docName && docName.includes(q)) ||
      Boolean(c.patient_sex && c.patient_sex.toLowerCase().includes(q)) ||
      Boolean(c.patient_age && String(c.patient_age).includes(q));

    const matchesStatus =
      activeFilter === "all"
        ? true
        : activeFilter === "ready"
        ? c.status === "ready" || c.status === "revoked"
        : c.status === activeFilter;

    const matchesClinic =
      selectedClinicFilter === "all" ||
      (c.clinic_name && c.clinic_name.toLowerCase() === selectedClinicFilter.toLowerCase());

    const matchesDoctor =
      selectedDoctorFilter === "all" ||
      docName.includes(selectedDoctorFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesClinic && matchesDoctor;
  });

  const doctorInitial = email ? email[0].toUpperCase() : "D";

  return (
    <div
      data-theme={isDark ? "dark" : "light"}
      className={`min-h-screen ${isDark ? "dark" : ""} bg-[#f8fafc] dark:bg-[#0B0F17] flex flex-col lg:flex-row text-slate-800 dark:text-slate-100 antialiased selection:bg-[#e0b457]/30 selection:text-slate-900 dark:selection:text-[#ffd166] transition-colors duration-200`}
    >
      {/* ─── Toast Notification ────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 dark:bg-[#131A26]/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-800 dark:border-[#e0b457]/30 flex items-center gap-3 text-sm font-medium animate-slideUp">
          <Check className="w-4 h-4 text-[#ffd166]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── Desktop Sidebar ──────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-[#0D121D] border-r border-slate-200/90 dark:border-slate-800/90 p-5 fixed inset-y-0 left-0 z-30 justify-between transition-colors duration-200">
        <div className="space-y-6">
          {/* Top Corner Brand Area */}
          <div className="w-full">
            {practiceProfile?.logoUrl ? (
              <div
                onClick={() => setCurrentTab("settings")}
                title="Practice & Brand Settings"
                className="w-full flex items-center justify-start cursor-pointer group"
              >
                {/* Dynamically fits logos of ANY aspect ratio: wide banner, square, or tall */}
                <img
                  src={practiceProfile.logoUrl}
                  alt={practiceProfile.brandName || "Brand Logo"}
                  className="max-h-28 sm:max-h-32 w-auto max-w-full object-contain object-left group-hover:opacity-90 transition-opacity"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-gradient-to-br dark:from-[#e0b457] dark:to-[#c49a45] text-white dark:text-slate-950 flex items-center justify-center font-bold text-xs tracking-wider shadow-sm transition-colors flex-shrink-0">
                  3D
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight truncate">
                    {practiceProfile?.brandName || "Orthodontic 3D"}
                  </h1>
                  <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 tracking-wider uppercase truncate">
                    {practiceProfile?.firmType === "lab"
                      ? "Aligner Lab"
                      : practiceProfile?.firmType === "clinic"
                      ? "Dental Practice"
                      : "Clinical Studio"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => setIsUploadOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs tracking-wide text-white dark:text-slate-950 bg-slate-900 dark:bg-gradient-to-r dark:from-[#e0b457] dark:via-[#f3c875] dark:to-[#c49a45] hover:bg-slate-800 dark:hover:brightness-105 active:scale-98 transition-all shadow-sm dark:shadow-[0_2px_12px_rgba(224,180,87,0.25)]"
          >
            <Plus className="w-4 h-4" />
            New Treatment Case
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setCurrentTab("cases")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === "cases"
                  ? "bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className={`w-4 h-4 ${currentTab === "cases" ? "text-slate-900 dark:text-[#ffd166]" : "text-slate-400"}`} />
                <span>Patient Cases</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-2xs border border-slate-200/60 dark:border-slate-700/60">
                {cases.length}
              </span>
            </button>

            {/* Doctors Directory (hidden for Solo Doctors) */}
            {!isSoloDoctor && (
              <button
                onClick={() => setCurrentTab("doctors")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  currentTab === "doctors"
                    ? "bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Stethoscope className={`w-4 h-4 ${currentTab === "doctors" ? "text-slate-900 dark:text-[#ffd166]" : "text-slate-400"}`} />
                  <span>Doctors Directory</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {doctors.filter(isDoctorProfileIncomplete).length > 0 && (
                    <span
                      title={`${doctors.filter(isDoctorProfileIncomplete).length} doctor(s) have incomplete contact details`}
                      className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/15 text-amber-700 dark:text-[#ffd166] border border-amber-500/30 inline-flex items-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      <span>{doctors.filter(isDoctorProfileIncomplete).length}</span>
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-2xs border border-slate-200/60 dark:border-slate-700/60">
                    {doctors.length}
                  </span>
                </div>
              </button>
            )}

            <button
              onClick={() => setCurrentTab("clinics")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === "clinics"
                  ? "bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building2 className={`w-4 h-4 ${currentTab === "clinics" ? "text-slate-900 dark:text-[#ffd166]" : "text-slate-400"}`} />
                <span>Clinics Directory</span>
              </div>
              <div className="flex items-center gap-1.5">
                {clinics.filter(isClinicProfileIncomplete).length > 0 && (
                  <span
                    title={`${clinics.filter(isClinicProfileIncomplete).length} clinic(s) have incomplete details`}
                    className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/15 text-amber-700 dark:text-[#ffd166] border border-amber-500/30 inline-flex items-center gap-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span>{clinics.filter(isClinicProfileIncomplete).length}</span>
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-2xs border border-slate-200/60 dark:border-slate-700/60">
                  {clinics.length}
                </span>
              </div>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer: Doctor Profile, Brand Settings & Sign Out */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
          <button
            onClick={() => setCurrentTab("settings")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentTab === "settings"
                ? "bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className={`w-4 h-4 ${currentTab === "settings" ? "text-slate-900 dark:text-[#ffd166]" : "text-slate-400"}`} />
              <span>Settings</span>
            </div>
          </button>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-800 text-white dark:text-[#ffd166] font-bold flex items-center justify-center text-xs shadow-2xs flex-shrink-0 border border-transparent dark:border-[#e0b457]/30">
                {doctorInitial}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {practiceProfile?.firmName || `Dr. ${email.split("@")[0]}`}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                  {practiceProfile?.brandName || "Clinical Practice"}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign out"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main Content Area ────────────────────────────────────────── */}
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-20 bg-white/95 dark:bg-[#0D121D]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3 space-y-2.5 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {practiceProfile?.logoUrl ? (
                <div className="h-8 flex items-center justify-start overflow-hidden">
                  <img
                    src={practiceProfile.logoUrl}
                    alt={practiceProfile.brandName || "Brand Logo"}
                    className="max-h-8 w-auto max-w-[160px] object-contain object-left"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-gradient-to-br dark:from-[#e0b457] dark:to-[#c49a45] text-white dark:text-slate-950 flex items-center justify-center font-bold text-xs tracking-wider">
                    3D
                  </div>
                  <div>
                    <h1 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
                      {practiceProfile?.brandName || "Orthodontic Studio"}
                    </h1>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                      {practiceProfile?.firmName || `Dr. ${email.split("@")[0]}`}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentTab("settings")}
                title="Settings"
                className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors cursor-pointer ${
                  currentTab === "settings"
                    ? "border-amber-500 bg-amber-500/10 text-amber-500 dark:text-[#ffd166]"
                    : "border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-[#131A26] text-slate-600 dark:text-slate-300"
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={toggleTheme}
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 dark:border-[#e0b457]/30 bg-slate-100 dark:bg-[#131A26] text-slate-600 dark:text-[#ffd166] transition-colors"
              >
                {isDark ? <Sun className="w-3.5 h-3.5 text-[#ffd166]" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsUploadOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white dark:text-slate-950 bg-slate-900 dark:bg-gradient-to-r dark:from-[#e0b457] dark:to-[#c49a45] active:scale-95 transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
              <button
                onClick={handleSignOut}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Tab Switcher */}
          <div className={`grid ${isSoloDoctor ? "grid-cols-2" : "grid-cols-3"} gap-1 p-1 bg-slate-100 dark:bg-[#0B0F17] rounded-xl text-xs font-semibold`}>
            <button
              onClick={() => setCurrentTab("cases")}
              className={`py-1.5 rounded-lg text-center transition-all ${
                currentTab === "cases"
                  ? "bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              Cases ({cases.length})
            </button>
            {!isSoloDoctor && (
              <button
                onClick={() => setCurrentTab("doctors")}
                className={`py-1.5 rounded-lg text-center transition-all ${
                  currentTab === "doctors"
                    ? "bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                Doctors ({doctors.length})
              </button>
            )}
            <button
              onClick={() => setCurrentTab("clinics")}
              className={`py-1.5 rounded-lg text-center transition-all ${
                currentTab === "clinics"
                  ? "bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              Clinics ({clinics.length})
            </button>
          </div>
        </header>

        {/* Content Container */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-7">
          {currentTab === "settings" ? (
            <SettingsView
              userId={userId}
              initialProfile={practiceProfile}
              userEmail={email}
              onProfileSaved={(prof) => {
                setPracticeProfile(prof);
                showToast("Settings saved successfully");
              }}
              onToast={showToast}
              onSignOut={handleSignOut}
              dashboardLayout={dashboardLayout}
              onLayoutChange={handleLayoutChange}
            />
          ) : currentTab === "doctors" ? (
            <DoctorsView
              doctors={doctors}
              onDoctorsUpdated={setDoctors}
              cases={cases}
              userId={userId}
              onToast={showToast}
            />
          ) : currentTab === "clinics" ? (
            <ClinicsView
              clinics={clinics}
              onClinicsUpdated={setClinics}
              cases={cases}
              userId={userId}
              onToast={showToast}
            />
          ) : (
            <>
              {/* Page Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Treatment Cases
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Interactive 3D orthodontic progression plans and patient consultation links.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
                  {/* Layout Switcher (Streamlined vs Classic) */}
                  <div className="flex items-center p-1 rounded-xl bg-white dark:bg-[#131A26] border border-slate-200/90 dark:border-slate-800 text-xs font-semibold shadow-2xs">
                    <button
                      type="button"
                      onClick={() => handleLayoutChange("streamlined")}
                      title="Streamlined Layout: compact, clean & high efficiency"
                      className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                        dashboardLayout === "streamlined"
                          ? "bg-slate-900 dark:bg-[#1E293B] text-white dark:text-[#ffd166] shadow-2xs"
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Streamlined</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLayoutChange("classic")}
                      title="Classic Layout: original expanded cards"
                      className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                        dashboardLayout === "classic"
                          ? "bg-slate-900 dark:bg-[#1E293B] text-white dark:text-[#ffd166] shadow-2xs"
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Classic</span>
                    </button>
                  </div>

                  {/* Site-Wide Dark/Light Theme Switcher */}
                  <button
                    onClick={toggleTheme}
                    title={isDark ? "Switch to Daytime Light Mode" : "Switch to Clinical Dark Mode"}
                    className="p-2.5 rounded-xl border transition-all flex items-center justify-center gap-2 bg-white dark:bg-[#131A26] border-slate-200 dark:border-[#e0b457]/30 text-slate-700 dark:text-[#ffd166] hover:bg-slate-50 dark:hover:bg-[#1A2234] dark:hover:border-[#e0b457]/60 shadow-xs active:scale-95 text-xs font-semibold"
                  >
                    {isDark ? (
                      <>
                        <Sun className="w-4 h-4 text-[#ffd166]" />
                        <span className="hidden sm:inline">Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-4 h-4 text-slate-600" />
                        <span className="hidden sm:inline">Dark Mode</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide text-white dark:text-slate-950 bg-slate-900 dark:bg-gradient-to-r dark:from-[#e0b457] dark:via-[#f3c875] dark:to-[#c49a45] hover:bg-slate-800 dark:hover:brightness-105 active:scale-98 transition-all shadow-sm dark:shadow-[0_2px_12px_rgba(224,180,87,0.25)]"
                  >
                    <Plus className="w-4 h-4" />
                    Upload New Case
                  </button>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="bg-white dark:bg-[#131A26] rounded-2xl p-2 sm:p-2.5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-2.5 transition-colors">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by patient name, ID, clinic, or doctor..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-transparent focus:outline-none focus:bg-slate-50 dark:focus:bg-[#1A2234] transition-all"
                  />
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Status Filters */}
                  <div className="flex items-center gap-1 p-1 bg-slate-100/90 dark:bg-[#0B0F17] rounded-xl overflow-x-auto transition-colors">
                    <button
                      onClick={() => setActiveFilter("all")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        activeFilter === "all"
                          ? "bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white shadow-xs"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      All ({cases.length})
                    </button>
                    <button
                      onClick={() => setActiveFilter("ready")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        activeFilter === "ready"
                          ? "bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white shadow-xs"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      Ready ({cases.filter((c) => c.status === "ready" || c.status === "revoked").length})
                    </button>
                  </div>

                  {/* Clinic Filter Dropdown */}
                  {clinics.length > 0 && (
                    <div className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100/90 dark:bg-[#0B0F17] rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 dark:text-[#ffd166]" />
                      <select
                        value={selectedClinicFilter}
                        onChange={(e) => setSelectedClinicFilter(e.target.value)}
                        className="bg-transparent font-semibold text-slate-700 dark:text-slate-200 border-none focus:outline-none cursor-pointer pr-1"
                      >
                        <option value="all">All Clinics</option>
                        {clinics.map((c) => (
                          <option key={c.id} value={c.name} className="dark:bg-[#131A26]">
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Doctor Filter Dropdown (hidden for Solo Doctors) */}
                  {!isSoloDoctor && doctors.length > 0 && (
                    <div className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100/90 dark:bg-[#0B0F17] rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs">
                      <Stethoscope className="w-3.5 h-3.5 text-slate-400 dark:text-[#ffd166]" />
                      <select
                        value={selectedDoctorFilter}
                        onChange={(e) => setSelectedDoctorFilter(e.target.value)}
                        className="bg-transparent font-semibold text-slate-700 dark:text-slate-200 border-none focus:outline-none cursor-pointer pr-1"
                      >
                        <option value="all">All Doctors</option>
                        {doctors.map((d) => (
                          <option key={d.id} value={d.name} className="dark:bg-[#131A26]">
                            Dr. {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

          {/* Case Records Grid */}
          {filteredCases.length === 0 ? (
            /* Empty State */
            <div className="bg-white dark:bg-[#131A26] rounded-3xl p-12 sm:p-16 text-center border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-[#ffd166] flex items-center justify-center mx-auto border border-slate-200 dark:border-[#e0b457]/20">
                <FolderOpen className="w-6 h-6 text-slate-600 dark:text-[#ffd166]" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {searchQuery ? "No matching patient cases found" : "No treatment cases uploaded yet"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {searchQuery
                    ? `No records match "${searchQuery}". Clear your search query to view all treatment files.`
                    : "Drop your Maestro 3D ZIP export archive to automatically generate a 60 FPS interactive 3D progression model."}
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white dark:text-slate-950 bg-slate-900 dark:bg-gradient-to-r dark:from-[#e0b457] dark:via-[#f3c875] dark:to-[#c49a45] hover:bg-slate-800 dark:hover:brightness-105 active:scale-98 transition-all shadow-sm dark:shadow-[0_2px_12px_rgba(224,180,87,0.25)] inline-flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Upload First Treatment Case
                </button>
              </div>
            </div>
          ) : (
            /* Rich Clinical Case Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
              {filteredCases.map((item) => {
                const dateStr = new Date(item.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                const stages = item.total_stages || 1;
                const minMonths = Math.max(1, Math.round(((stages * 10) / 30) * 10) / 10);
                const maxMonths = Math.max(1, Math.round(((stages * 14) / 30) * 10) / 10);
                const minWeeks = Math.round((stages * 10) / 7);
                const maxWeeks = Math.round((stages * 14) / 7);

                const trayInfo = getCaseTrayInfo(item, archCountsMap[item.id]);
                const linkAccess = getCaseLinkAccess(item, { readLocalCache: isMounted });
                const displayName = item.patient_name.replace(/\s*\[(Upper|Lower|Dual)\]/i, "").trim();

                {/* ─── Streamlined UI Layout (Modern, Clean & Mobile Optimized) ─── */}
                if (dashboardLayout === "streamlined") {
                  return (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-[#131A26] rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-[#e0b457]/40 transition-all duration-200 flex flex-col justify-between gap-3.5 group relative h-fit self-start"
                    >
                      <div className="space-y-3">
                        {/* Top Header: Patient Title & Clinical Badges */}
                        <div className="flex items-start justify-between gap-2.5">
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate tracking-tight group-hover:text-slate-700 dark:group-hover:text-[#ffd166] transition-colors">
                                {displayName}
                              </h3>
                              {item.patient_id && (
                                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 dark:bg-[#1A2234] text-slate-700 dark:text-[#ffd166] border border-slate-200 dark:border-slate-700/80 inline-flex items-center gap-0.5">
                                  <Hash className="w-2.5 h-2.5 text-slate-400 dark:text-[#ffd166]" />
                                  <span>{item.patient_id}</span>
                                </span>
                              )}
                              {(item.is_refinement || item.doctor_notes?.is_refinement) && (
                                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-800 dark:text-[#ffd166] border border-amber-500/30 inline-flex items-center gap-1">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  <span>Refinement</span>
                                </span>
                              )}
                              {(item.patient_sex || item.patient_age != null) && (
                                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-slate-100/90 dark:bg-[#151D2A] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 inline-flex items-center gap-1">
                                  <span>
                                    {[
                                      item.patient_sex,
                                      item.patient_age != null ? `${item.patient_age} yrs` : null,
                                    ]
                                      .filter(Boolean)
                                      .join(" · ")}
                                  </span>
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                              {item.clinic_name && (
                                <>
                                  <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
                                    <Building2 className="w-3 h-3 text-slate-400 dark:text-[#ffd166]" />
                                    <span className="truncate max-w-[140px] sm:max-w-none">{item.clinic_name}</span>
                                  </span>
                                  <span className="text-slate-300 dark:text-slate-700">•</span>
                                </>
                              )}
                              {(item.doctor_name || item.doctor_notes?.assigned_doctor) && (
                                <>
                                  <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
                                    <Stethoscope className="w-3 h-3 text-slate-400 dark:text-[#ffd166]" />
                                    <span className="truncate max-w-[140px] sm:max-w-none">
                                      {(() => {
                                        const docRaw = (item.doctor_name || item.doctor_notes?.assigned_doctor || "").trim();
                                        return docRaw.toLowerCase().startsWith("dr.") ? docRaw : `Dr. ${docRaw}`;
                                      })()}
                                    </span>
                                  </span>
                                  <span className="text-slate-300 dark:text-slate-700">•</span>
                                </>
                              )}
                              <span suppressHydrationWarning>Created {dateStr}</span>
                            </div>
                          </div>

                          {/* Top-Right Badges & Actions */}
                          <div className="flex items-center gap-1 flex-wrap justify-end flex-shrink-0">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 border ${
                                trayInfo.isSingle && trayInfo.archType === "upper"
                                  ? "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200/70 dark:border-sky-800/50"
                                  : trayInfo.isSingle && trayInfo.archType === "lower"
                                  ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200/70 dark:border-purple-800/50"
                                  : trayInfo.isUnequal
                                  ? "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-[#ffd166] border-amber-300 dark:border-amber-700/60 shadow-2xs"
                                  : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-[#ffd166] border-amber-200/70 dark:border-amber-800/50"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  trayInfo.isSingle && trayInfo.archType === "upper"
                                    ? "bg-sky-500"
                                    : trayInfo.isSingle && trayInfo.archType === "lower"
                                    ? "bg-purple-500"
                                    : "bg-amber-500"
                                }`}
                              />
                              {trayInfo.archBadgeText}
                            </span>

                            <button
                              type="button"
                              suppressHydrationWarning
                              onClick={() => setSelectedShareCase(item)}
                              title={`Link Access: ${linkAccess.relativeTimeText}`}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 border transition-all hover:scale-105 active:scale-95 ${linkAccess.badgeColorClass}`}
                            >
                              <span suppressHydrationWarning className={`w-1.5 h-1.5 rounded-full ${linkAccess.badgeDotClass}`} />
                              <span suppressHydrationWarning>{linkAccess.badgeLabel}</span>
                            </button>

                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-800/50 inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Ready
                            </span>

                            <button
                              onClick={() => setSelectedEditCase(item)}
                              title="Edit case details & re-enter 3D models"
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-amber-600 dark:hover:text-[#ffd166] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-0.5"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCase(item.id, item.patient_name)}
                              title="Delete case"
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Continuous Streamlined Stage Progression Bar */}
                        <div className="space-y-1.5 pt-0.5">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                            <span>Stage 01 (Initial)</span>
                            <span
                              className={`text-center px-1 truncate max-w-[200px] sm:max-w-none ${
                                trayInfo.isUnequal
                                  ? "text-amber-700 dark:text-[#ffd166] font-semibold"
                                  : "text-slate-400 dark:text-slate-500 font-normal"
                              }`}
                            >
                              {trayInfo.stepperCenterText}
                            </span>
                            <span>{trayInfo.stepperFinalText}</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-[#0D121D] border border-slate-200/60 dark:border-slate-800 overflow-hidden">
                            <div className="h-full w-full rounded-full bg-slate-900 dark:bg-gradient-to-r dark:from-[#e0b457] dark:via-[#f3c875] dark:to-[#c49a45] dark:shadow-[0_0_8px_rgba(224,180,87,0.35)] transition-all" />
                          </div>
                        </div>

                        {/* Consolidated Clinical Info Strip */}
                        <div className="rounded-xl bg-slate-50 dark:bg-[#0E1420] border border-slate-200/70 dark:border-slate-800/80 px-3 py-2 text-xs flex items-center justify-between gap-2 flex-wrap text-slate-700 dark:text-slate-300 font-medium">
                          <div className="inline-flex items-center gap-1.5 truncate">
                            <Layers className="w-3.5 h-3.5 text-amber-600 dark:text-[#ffd166] flex-shrink-0" />
                            <span className="font-semibold text-slate-900 dark:text-white truncate">{trayInfo.metadataBadgeText}</span>
                          </div>
                          <div className="hidden sm:inline text-slate-300 dark:text-slate-700">•</div>
                          <div className="inline-flex items-center gap-1.5 flex-shrink-0">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-[#ffd166] flex-shrink-0" />
                            <span>~{minMonths}–{maxMonths} Mo ({minWeeks}–{maxWeeks} wks)</span>
                          </div>
                          <div className="hidden sm:inline text-slate-300 dark:text-slate-700">•</div>
                          <div className="inline-flex items-center gap-1.5 flex-shrink-0">
                            <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-[#ffd166] flex-shrink-0" />
                            <span>10–14 Days/Stage</span>
                          </div>
                        </div>
                      </div>

                      {/* Streamlined Action Buttons */}
                      <div className="pt-3 border-t border-slate-100/90 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <a
                          href={`/treatment?case=${item.share_token}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 px-3.5 rounded-xl text-xs font-semibold text-white dark:text-slate-950 bg-slate-900 dark:bg-gradient-to-r dark:from-[#e0b457] dark:via-[#f3c875] dark:to-[#c49a45] hover:bg-slate-800 dark:hover:brightness-105 shadow-sm dark:shadow-[0_2px_10px_rgba(224,180,87,0.2)] transition-all flex items-center justify-center gap-2 active:scale-98"
                        >
                          <Eye className="w-4 h-4 text-white dark:text-slate-950" />
                          <span>View 3D Progression</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-900" />
                        </a>

                        {/* Action buttons cluster: 3 equal buttons on mobile, compact pills on desktop */}
                        <div className="grid grid-cols-3 sm:flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedShareCase(item)}
                            className="py-2 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 active:scale-98 bg-white dark:bg-[#1A2234] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#232D42] border-slate-200 dark:border-slate-700 shadow-2xs hover:dark:border-[#e0b457]/40 cursor-pointer"
                            title="Share 3D progression"
                          >
                            <Share2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                            <span>Share</span>
                            {item.clinic_email && (
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" title="Email connected" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedIprCase(item)}
                            className="py-2 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 active:scale-98 bg-white dark:bg-[#1A2234] text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-950/30 border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 hover:text-amber-800 dark:hover:text-[#ffd166] shadow-2xs cursor-pointer"
                            title="View & edit IPR plan"
                          >
                            <Scissors className="w-3.5 h-3.5 text-amber-600 dark:text-[#ffd166]" />
                            <span>IPR</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedNotesCase(item)}
                            className="py-2 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 active:scale-98 bg-white dark:bg-[#1A2234] text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-950/30 border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 hover:text-amber-800 dark:hover:text-[#ffd166] shadow-2xs cursor-pointer truncate"
                            title="Treatment Plan & Doctor Remarks"
                          >
                            <FileText className="w-3.5 h-3.5 text-amber-500 dark:text-[#ffd166]" />
                            <span className="truncate">Plan</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                {/* ─── Classic UI Layout (Expanded Original View) ─── */}
                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-[#131A26] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-[#e0b457]/40 transition-all duration-200 flex flex-col justify-between gap-5 group relative h-fit self-start"
                  >
                    {/* Top Row: Patient Title & Clinical Badges */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* 3D Arch Glyph */}
                          <div className="w-11 h-11 rounded-xl bg-slate-900 dark:bg-[#1A2234] text-white dark:text-[#ffd166] flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0 border border-transparent dark:border-[#e0b457]/20">
                            3D
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate tracking-tight group-hover:text-slate-700 dark:group-hover:text-[#ffd166] transition-colors">
                                {displayName}
                              </h3>
                              {item.patient_id && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 dark:bg-[#1A2234] text-slate-700 dark:text-[#ffd166] border border-slate-200 dark:border-slate-700/80 inline-flex items-center gap-1">
                                  <Hash className="w-2.5 h-2.5 text-slate-400 dark:text-[#ffd166]" />
                                  <span>{item.patient_id}</span>
                                </span>
                              )}
                              {(item.is_refinement || item.doctor_notes?.is_refinement) && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-800 dark:text-[#ffd166] border border-amber-500/30 inline-flex items-center gap-1">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  <span>Refinement</span>
                                </span>
                              )}
                              {(item.patient_sex || item.patient_age != null) && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100/90 dark:bg-[#151D2A] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 inline-flex items-center gap-1">
                                  <span>
                                    {[
                                      item.patient_sex,
                                      item.patient_age != null ? `${item.patient_age} yrs` : null,
                                    ]
                                      .filter(Boolean)
                                      .join(" · ")}
                                  </span>
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                              {item.clinic_name && (
                                <>
                                  <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
                                    <Building2 className="w-3 h-3 text-slate-400 dark:text-[#ffd166]" />
                                    <span>{item.clinic_name}</span>
                                  </span>
                                  <span className="text-slate-300 dark:text-slate-700">•</span>
                                </>
                              )}
                              {(item.doctor_name || item.doctor_notes?.assigned_doctor) && (
                                <>
                                  <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
                                    <Stethoscope className="w-3 h-3 text-slate-400 dark:text-[#ffd166]" />
                                    <span>
                                      {(() => {
                                        const docRaw = (item.doctor_name || item.doctor_notes?.assigned_doctor || "").trim();
                                        return docRaw.toLowerCase().startsWith("dr.") ? docRaw : `Dr. ${docRaw}`;
                                      })()}
                                    </span>
                                  </span>
                                  <span className="text-slate-300 dark:text-slate-700">•</span>
                                </>
                              )}
                              <span suppressHydrationWarning>Created {dateStr}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status & Delete */}
                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 border ${
                              trayInfo.isSingle && trayInfo.archType === "upper"
                                ? "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200/70 dark:border-sky-800/50"
                                : trayInfo.isSingle && trayInfo.archType === "lower"
                                ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200/70 dark:border-purple-800/50"
                                : trayInfo.isUnequal
                                ? "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-[#ffd166] border-amber-300 dark:border-amber-700/60 shadow-2xs"
                                : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-[#ffd166] border-amber-200/70 dark:border-amber-800/50"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                trayInfo.isSingle && trayInfo.archType === "upper"
                                  ? "bg-sky-500"
                                  : trayInfo.isSingle && trayInfo.archType === "lower"
                                  ? "bg-purple-500"
                                  : "bg-amber-500"
                              }`}
                            />
                            {trayInfo.archBadgeText}
                          </span>
                          {/* Milestone 3: Live Link Status & Expiry Badge */}
                          <button
                            type="button"
                            suppressHydrationWarning
                            onClick={() => setSelectedShareCase(item)}
                            title={`Link Access: ${linkAccess.relativeTimeText}. Click to configure expiry or revoke access.`}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 border transition-all hover:scale-105 active:scale-95 ${linkAccess.badgeColorClass}`}
                          >
                            <span suppressHydrationWarning className={`w-1.5 h-1.5 rounded-full ${linkAccess.badgeDotClass}`} />
                            <span suppressHydrationWarning>{linkAccess.badgeLabel}</span>
                          </button>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-800/50 inline-flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Ready
                          </span>
                          <button
                            onClick={() => setSelectedEditCase(item)}
                            title="Edit case details & re-enter 3D models"
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-amber-600 dark:hover:text-[#ffd166] hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors ml-1"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCase(item.id, item.patient_name)}
                            title="Delete case"
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Visual Stage Stepper / Progress Bar */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                          <span>Stage 01 (Initial)</span>
                          <span
                            className={`text-center px-1 truncate max-w-[200px] sm:max-w-none ${
                              trayInfo.isUnequal
                                ? "text-amber-700 dark:text-[#ffd166] font-semibold"
                                : "text-slate-400 dark:text-slate-500 font-normal"
                            }`}
                          >
                            {trayInfo.stepperCenterText}
                          </span>
                          <span>{trayInfo.stepperFinalText}</span>
                        </div>
                        {/* Segmented Track */}
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(item.total_stages, 12) }).map((_, idx) => (
                            <div
                              key={idx}
                              className="h-1.5 flex-1 rounded-full bg-slate-900 dark:bg-[#e0b457] dark:shadow-[0_0_8px_rgba(224,180,87,0.35)] transition-all"
                              title={`Stage ${idx + 1}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Clinical Metadata Badges */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border inline-flex items-center gap-1.5 ${
                            trayInfo.isUnequal
                              ? "bg-amber-50/90 dark:bg-amber-950/40 text-amber-800 dark:text-[#ffd166] border-amber-300 dark:border-amber-700/60 shadow-2xs"
                              : "bg-slate-100 dark:bg-[#1A2234] text-slate-700 dark:text-slate-200 border-slate-200/70 dark:border-slate-700/60"
                          }`}
                        >
                          <Layers
                            className={`w-3.5 h-3.5 ${
                              trayInfo.isUnequal
                                ? "text-amber-600 dark:text-[#ffd166]"
                                : "text-slate-500 dark:text-[#ffd166]"
                            }`}
                          />
                          {trayInfo.metadataBadgeText}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-[#1A2234] text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700/60 inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-[#ffd166]" />
                          Est. Duration: ~{minMonths}–{maxMonths} Mo ({minWeeks}–{maxWeeks} wks)
                        </span>
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-[#1A2234] text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700/60 inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-[#ffd166]" />
                          10–14 Days / Stage
                        </span>
                      </div>
                    </div>

                    {/* Bottom Actions Row */}
                    <div className="pt-4 border-t border-slate-100/90 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                      {/* Primary CTA: Launch 3D Progression Viewer */}
                      <a
                        href={`/treatment?case=${item.share_token}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-white dark:text-slate-950 bg-slate-900 dark:bg-gradient-to-r dark:from-[#e0b457] dark:via-[#f3c875] dark:to-[#c49a45] hover:bg-slate-800 dark:hover:brightness-105 shadow-sm dark:shadow-[0_4px_16px_rgba(224,180,87,0.25)] transition-all flex items-center justify-center gap-2 active:scale-98"
                      >
                        <Eye className="w-4 h-4 text-white dark:text-slate-950" />
                        <span>View 3D Progression</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-900" />
                      </a>

                      {/* Secondary CTA: Share Link (Opens popup with Copy Link, WhatsApp & Clinic Mailbox) */}
                      <button
                        onClick={() => setSelectedShareCase(item)}
                        className="py-2.5 px-3.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 active:scale-98 bg-white dark:bg-[#1A2234] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#232D42] border-slate-200 dark:border-slate-700 shadow-2xs hover:dark:border-[#e0b457]/40"
                        title="Share 3D progression: copy patient link, send on WhatsApp, or email to clinic"
                      >
                        <Share2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <span>Share</span>
                        {item.clinic_email && (
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-sky-500 ml-0.5"
                            title="Clinic email connected"
                          />
                        )}
                      </button>

                      {/* Tertiary CTA: IPR Plan */}
                      <button
                        onClick={() => setSelectedIprCase(item)}
                        className="py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 active:scale-98 bg-white dark:bg-[#1A2234] text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-950/30 border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 hover:text-amber-800 dark:hover:text-[#ffd166] shadow-2xs"
                        title="View and edit planned Interproximal Reduction (IPR) values"
                      >
                        <Scissors className="w-3.5 h-3.5 text-amber-600 dark:text-[#ffd166]" />
                        <span>IPR</span>
                      </button>

                      {/* Quaternary CTA: Treatment Plan / Doctor Remarks */}
                      <button
                        onClick={() => setSelectedNotesCase(item)}
                        className="py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 active:scale-98 bg-white dark:bg-[#1A2234] text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-950/30 border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 hover:text-amber-800 dark:hover:text-[#ffd166] shadow-2xs"
                        title="Treatment plan, instructions & case remarks"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-500 dark:text-[#ffd166]" />
                        <span>Treatment Plan</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
            </>
          )}
        </div>
      </main>

      {/* ─── Upload Case Modal ────────────────────────────────────────── */}
      <UploadCaseModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        userId={userId}
        onCaseCreated={handleCaseCreated}
        doctors={doctors}
        clinics={clinics}
        isSoloDoctor={isSoloDoctor}
        defaultDoctorName={defaultDoctorName}
        onClinicCreated={(newClinic) => {
          setClinics((prev) => {
            if (prev.some((c) => c.id === newClinic.id || c.name.toLowerCase() === newClinic.name.toLowerCase())) {
              return prev;
            }
            return [...prev, newClinic];
          });
          showToast(`Clinic "${newClinic.name}" saved to directory`);
        }}
        onDoctorCreated={(newDoctor) => {
          setDoctors((prev) => {
            if (prev.some((d) => d.id === newDoctor.id || d.name.toLowerCase() === newDoctor.name.toLowerCase())) {
              return prev;
            }
            return [...prev, newDoctor];
          });
          const doctorDisplay = newDoctor.name.startsWith("Dr.") ? newDoctor.name : `Dr. ${newDoctor.name}`;
          showToast(`${doctorDisplay} saved to directory`);
        }}
        onOpenAddDoctor={() => {
          setIsUploadOpen(false);
          setCurrentTab("doctors");
        }}
        onOpenAddClinic={() => {
          setIsUploadOpen(false);
          setCurrentTab("clinics");
        }}
      />

      {/* ─── Practice Profile & Brand Setup Modal ───────────────────────── */}
      <PracticeProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setIsOnboarding(false);
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(`dental_onboarding_dismissed_${userId}`, "true");
            } catch {}
          }
        }}
        userId={userId}
        userEmail={email}
        initialProfile={practiceProfile}
        onProfileSaved={(prof) => {
          setPracticeProfile(prof);
          if (typeof window !== "undefined") {
            try {
              localStorage.removeItem(`dental_onboarding_dismissed_${userId}`);
            } catch {}
          }
          showToast("Practice brand profile updated");
        }}
        isOnboarding={isOnboarding}
      />

      {/* ─── Edit IPR Modal ───────────────────────────────────────────── */}
      {selectedIprCase && (
        <EditIprModal
          isOpen={Boolean(selectedIprCase)}
          onClose={() => setSelectedIprCase(null)}
          caseItem={selectedIprCase}
          onSaved={(cnt) =>
            showToast(
              `IPR prescription updated for ${selectedIprCase.patient_name} (${cnt} planned reductions)`,
            )
          }
        />
      )}

      {/* ─── Edit Doctor Notes Modal ─────────────────────────────────────── */}
      {selectedNotesCase && (
        <EditNotesModal
          isOpen={Boolean(selectedNotesCase)}
          onClose={() => setSelectedNotesCase(null)}
          caseItem={selectedNotesCase}
          doctorDefaultName={email !== "Doctor" ? email.split("@")[0] : undefined}
          onSaved={() =>
            showToast(
              `Treatment plan updated for ${selectedNotesCase.patient_name}`,
            )
          }
        />
      )}

      {/* ─── Share Modal (Copy Link & Send to Doctor / Clinic) ───────────── */}
      {selectedShareCase && (
        <ShareModal
          isOpen={Boolean(selectedShareCase)}
          onClose={() => setSelectedShareCase(null)}
          caseItem={selectedShareCase}
          doctorName={email !== "Doctor" ? email.split("@")[0] : undefined}
          allCases={cases}
          doctors={doctors}
          clinics={clinics}
          practiceProfile={practiceProfile}
          onEmailUpdated={handleEmailUpdated}
          onCaseUpdated={handleCaseUpdated}
          onToast={showToast}
        />
      )}

      {/* ─── Edit Case & Re-enter Models Modal ────────────────────────────── */}
      {selectedEditCase && (
        <EditCaseModal
          isOpen={Boolean(selectedEditCase)}
          onClose={() => setSelectedEditCase(null)}
          caseItem={selectedEditCase}
          userId={userId}
          allCases={cases}
          doctors={doctors}
          clinics={clinics}
          isSoloDoctor={isSoloDoctor}
          defaultDoctorName={defaultDoctorName}
          onClinicCreated={(newClinic) => {
            setClinics((prev) => {
              if (prev.some((c) => c.id === newClinic.id || c.name.toLowerCase() === newClinic.name.toLowerCase())) {
                return prev;
              }
              return [...prev, newClinic];
            });
            showToast(`Clinic "${newClinic.name}" saved to directory`);
          }}
          onDoctorCreated={(newDoctor) => {
            setDoctors((prev) => {
              if (prev.some((d) => d.id === newDoctor.id || d.name.toLowerCase() === newDoctor.name.toLowerCase())) {
                return prev;
              }
              return [...prev, newDoctor];
            });
            const doctorDisplay = newDoctor.name.startsWith("Dr.") ? newDoctor.name : `Dr. ${newDoctor.name}`;
            showToast(`${doctorDisplay} saved to directory`);
          }}
          onCaseUpdated={handleCaseUpdated}
          onToast={showToast}
        />
      )}
    </div>
  );
}
