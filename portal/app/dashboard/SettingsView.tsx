"use client";

import { useState, useRef, useEffect } from "react";
import {
  Settings,
  Layers,
  Building2,
  Stethoscope,
  Check,
  Upload,
  Trash2,
  Image as ImageIcon,
  Mail,
  Phone,
  MapPin,
  Globe,
  Loader2,
  Sparkles,
  Shield,
  LogOut,
  Copy,
  CheckCheck,
} from "lucide-react";
import { PracticeProfile, FirmType } from "@/lib/practice-types";
import { savePracticeProfile } from "@/lib/practice-storage";

interface SettingsViewProps {
  userId: string;
  initialProfile: PracticeProfile | null;
  userEmail?: string;
  onProfileSaved: (profile: PracticeProfile) => void;
  onToast?: (msg: string) => void;
  onSignOut?: () => void;
}

export default function SettingsView({
  userId,
  initialProfile,
  userEmail,
  onProfileSaved,
  onToast,
  onSignOut,
}: SettingsViewProps) {
  const [firmType, setFirmType] = useState<FirmType>(initialProfile?.firmType || "lab");
  const [firmName, setFirmName] = useState(initialProfile?.firmName || "");
  const [brandName, setBrandName] = useState(initialProfile?.brandName || "");
  const [logoUrl, setLogoUrl] = useState(initialProfile?.logoUrl || "");
  const [email, setEmail] = useState(initialProfile?.email || userEmail || "");
  const [phone, setPhone] = useState(initialProfile?.phone || "");
  const [address, setAddress] = useState(initialProfile?.address || "");
  const [website, setWebsite] = useState(initialProfile?.website || "");
  const [isSaving, setIsSaving] = useState(false);
  const [logoPreviewError, setLogoPreviewError] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialProfile) {
      setFirmType(initialProfile.firmType || "lab");
      setFirmName(initialProfile.firmName || "");
      setBrandName(initialProfile.brandName || "");
      setLogoUrl(initialProfile.logoUrl || "");
      setEmail(initialProfile.email || userEmail || "");
      setPhone(initialProfile.phone || "");
      setAddress(initialProfile.address || "");
      setWebsite(initialProfile.website || "");
    }
  }, [initialProfile, userEmail]);

  function handleLogoFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, SVG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setLogoUrl(reader.result);
        setLogoPreviewError(false);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const cleanFirm = firmName.trim() || "Orthodontic Practice";
    const cleanBrand = brandName.trim() || cleanFirm;

    setIsSaving(true);
    try {
      const saved = await savePracticeProfile(userId, {
        firmType,
        firmName: cleanFirm,
        brandName: cleanBrand,
        logoUrl: logoUrl.trim() || null,
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        website: website.trim(),
      });

      onProfileSaved(saved);
      if (onToast) {
        onToast("Settings saved successfully");
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
      alert("Could not save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleCopyUserId() {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(userId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
    if (onToast) {
      onToast("Account ID copied to clipboard");
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* ─── Page Header with Single Save Action ────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-amber-500 dark:text-[#ffd166]" />
            <span>Settings</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your firm identity, white-label branding, and account preferences.
          </p>
        </div>

        {/* The single save action */}
        <button
          type="button"
          onClick={() => handleSave()}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl font-semibold text-xs tracking-wide text-white dark:text-slate-950 bg-slate-900 dark:bg-gradient-to-r dark:from-[#e0b457] dark:to-[#c49a45] hover:brightness-105 active:scale-98 transition-all shadow-sm cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ─── Section 1: Practice & Organization ──────────────────────── */}
        <div className="bg-white dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 dark:text-[#ffd166] flex items-center justify-center flex-shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Practice & Organization
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Operational structure and registered organization name.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Organization Model
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFirmType("lab")}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  firmType === "lab"
                    ? "bg-amber-500/10 border-amber-500 text-slate-900 dark:text-white ring-1 ring-amber-500/30"
                    : "bg-slate-50 dark:bg-[#131A26] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Layers className="w-5 h-5 text-amber-500 dark:text-[#ffd166]" />
                  {firmType === "lab" && <Check className="w-4 h-4 text-amber-500 dark:text-[#ffd166]" />}
                </div>
                <div className="font-bold text-xs">Aligner Lab</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  Fabricates aligners for multiple clinics and doctors
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFirmType("clinic")}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  firmType === "clinic"
                    ? "bg-amber-500/10 border-amber-500 text-slate-900 dark:text-white ring-1 ring-amber-500/30"
                    : "bg-slate-50 dark:bg-[#131A26] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Building2 className="w-5 h-5 text-amber-500 dark:text-[#ffd166]" />
                  {firmType === "clinic" && <Check className="w-4 h-4 text-amber-500 dark:text-[#ffd166]" />}
                </div>
                <div className="font-bold text-xs">Dental Clinic</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  Clinic branch or dental group treating patients directly
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFirmType("solo")}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  firmType === "solo"
                    ? "bg-amber-500/10 border-amber-500 text-slate-900 dark:text-white ring-1 ring-amber-500/30"
                    : "bg-slate-50 dark:bg-[#131A26] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Stethoscope className="w-5 h-5 text-amber-500 dark:text-[#ffd166]" />
                  {firmType === "solo" && <Check className="w-4 h-4 text-amber-500 dark:text-[#ffd166]" />}
                </div>
                <div className="font-bold text-xs">Solo Doctor</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  Individual orthodontist managing their personal practice
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Registered Practice / Firm Name <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              required
              value={firmName}
              onChange={(e) => setFirmName(e.target.value)}
              placeholder="e.g. Sleek Smile Aligners"
              className="w-full max-w-lg px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131A26] text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Used as the legal or business entity title on export summaries and invoices.
            </p>
          </div>
        </div>

        {/* ─── Section 2: Branding & White-Labeling ────────────────────────── */}
        <div className="bg-white dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 dark:text-[#ffd166] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Branding & White-Labeling
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Custom logo and brand display shown to patients on shared 3D treatment links.
                </p>
              </div>
            </div>

            {logoUrl && (
              <button
                type="button"
                onClick={() => setLogoUrl("")}
                className="text-xs font-semibold text-rose-500 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Logo</span>
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Brand Display Name
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Sleek Smile"
              className="w-full max-w-lg px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131A26] text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              The customer-facing name displayed in the top corner of the dashboard and patient links.
            </p>
          </div>

          {/* Logo Management with Dual Theme Previews */}
          <div className="space-y-3 pt-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Brand Logo
            </label>

            {/* Dual Previews: Dark & Light theme rendering */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
              {/* Dark Theme Preview */}
              <div className="rounded-xl border border-slate-800 bg-[#0A0E17] p-3 flex flex-col items-center justify-between gap-2 text-center min-h-[110px]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 self-start">
                  Dark Mode Preview
                </span>
                <div className="h-14 w-full flex items-center justify-center overflow-hidden">
                  {logoUrl && !logoPreviewError ? (
                    <img
                      src={logoUrl}
                      alt="Logo Dark Preview"
                      onError={() => setLogoPreviewError(true)}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                      <ImageIcon className="w-4 h-4" />
                      <span>No Logo</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Light Theme Preview */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex flex-col items-center justify-between gap-2 text-center min-h-[110px]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 self-start">
                  Light Mode Preview
                </span>
                <div className="h-14 w-full flex items-center justify-center overflow-hidden">
                  {logoUrl && !logoPreviewError ? (
                    <img
                      src={logoUrl}
                      alt="Logo Light Preview"
                      onError={() => setLogoPreviewError(true)}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                      <ImageIcon className="w-4 h-4" />
                      <span>No Logo</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Upload & URL Input Controls */}
            <div className="space-y-3 max-w-2xl pt-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Logo Image</span>
                </button>
                <span className="text-[11px] text-slate-400">
                  Supports PNG, JPG, SVG, WebP of any dimensions
                </span>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoFileSelect}
                accept="image/*"
                className="hidden"
              />

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Or paste direct logo image URL:
                </label>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => {
                    setLogoUrl(e.target.value);
                    setLogoPreviewError(false);
                  }}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131A26] text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ─── Section 3: Contact & Public Profile ────────────────────────── */}
        <div className="bg-white dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 dark:text-[#ffd166] flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Contact & Public Profile
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Contact details displayed on patient consultation headers and case referral sheets.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-[#ffd166]" />
                <span>Primary / Support Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@practice.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131A26] text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-[#ffd166]" />
                <span>Phone Number</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131A26] text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-[#ffd166]" />
                <span>Clinic Address / City</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 124 MG Road, Bangalore"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131A26] text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400 dark:text-[#ffd166]" />
                <span>Website URL</span>
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://sleeksmile.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131A26] text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* ─── Section 4: Account & Authentication ────────────────────────── */}
        <div className="bg-white dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 dark:text-[#ffd166] flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Account & Authentication
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your sign-in identity and account security.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#131A26] border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-medium text-slate-400">Signed In As</span>
                <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                  {userEmail || email || "Authenticated User"}
                </div>
              </div>

              {/* Google OAuth Provider Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 self-start sm:self-auto shadow-2xs">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google Account</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-medium text-slate-400">Account ID</span>
                <div className="font-mono text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 truncate max-w-xs sm:max-w-md">
                  {userId}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyUserId}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1A2234] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  {copiedId ? (
                    <>
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy ID</span>
                    </>
                  )}
                </button>

                {onSignOut && (
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1">
              Your account is authenticated via Google Single Sign-On (SSO). Profile security, multi-factor authentication, and email management are managed directly through your Google Account.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
