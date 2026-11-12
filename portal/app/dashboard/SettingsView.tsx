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
} from "lucide-react";
import { PracticeProfile, FirmType } from "@/lib/practice-types";
import { savePracticeProfile } from "@/lib/practice-storage";

interface SettingsViewProps {
  userId: string;
  initialProfile: PracticeProfile | null;
  userEmail?: string;
  onProfileSaved: (profile: PracticeProfile) => void;
  onToast?: (msg: string) => void;
}

export default function SettingsView({
  userId,
  initialProfile,
  userEmail,
  onProfileSaved,
  onToast,
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-amber-500 dark:text-[#ffd166]" />
            <span>Settings</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your firm profile, white-label branding, and clinic contact preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Organization Type */}
        <div className="bg-white dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              1. Organization Type
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select your practice model to automatically customize navigation and workflow options.
            </p>
          </div>

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

        {/* Card 2: Practice & Brand Names */}
        <div className="bg-white dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              2. Practice Identity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              The official names shown across your team portal and client correspondence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Firm / Practice Name <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                placeholder="e.g. Sleek Smile Aligners"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131A26] text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                Your registered firm or laboratory entity name.
              </p>
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131A26] text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                The customer-facing brand name displayed to patients.
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Brand Logo */}
        <div className="bg-white dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                3. Brand Logo
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Occupies the top corner of your dashboard and is used to white-label patient links.
              </p>
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

          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Wide landscape logo preview */}
            <div className="h-24 w-full sm:w-64 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#131A26] flex items-center justify-center overflow-hidden p-3 flex-shrink-0 relative">
              {logoUrl && !logoPreviewError ? (
                <img
                  src={logoUrl}
                  alt="Brand Logo Preview"
                  onError={() => setLogoPreviewError(true)}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-slate-400">
                  <ImageIcon className="w-6 h-6" />
                  <span className="text-[11px] font-medium">No Logo Uploaded</span>
                </div>
              )}
            </div>

            <div className="space-y-2.5 flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Logo Image</span>
                </button>
                <span className="text-xs text-slate-400">Supports PNG, JPG, SVG, WebP of any dimensions</span>
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

        {/* Card 4: Contact & Practice Details */}
        <div className="bg-white dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              4. Contact & Location Information
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Contact information displayed on patient link request gates and doctor correspondence.
            </p>
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

        {/* Bottom Save Action */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-xs tracking-wide text-white dark:text-slate-950 bg-slate-900 dark:bg-gradient-to-r dark:from-[#e0b457] dark:to-[#c49a45] hover:brightness-105 active:scale-98 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
