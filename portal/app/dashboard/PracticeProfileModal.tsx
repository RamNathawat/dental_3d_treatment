"use client";

import { useState, useRef } from "react";
import {
  Building2,
  Sparkles,
  Upload,
  X,
  Check,
  Globe,
  Phone,
  Mail,
  MapPin,
  Image as ImageIcon,
  ShieldCheck,
  Stethoscope,
  Layers,
} from "lucide-react";
import { PracticeProfile, FirmType } from "@/lib/practice-types";
import { savePracticeProfile } from "@/lib/practice-storage";

interface PracticeProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  initialProfile: PracticeProfile | null;
  userEmail: string;
  isOnboarding?: boolean;
  onProfileSaved: (profile: PracticeProfile) => void;
  onToast?: (msg: string) => void;
}

export default function PracticeProfileModal({
  isOpen,
  onClose,
  userId,
  initialProfile,
  userEmail,
  isOnboarding = false,
  onProfileSaved,
  onToast,
}: PracticeProfileModalProps) {
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

  if (!isOpen) return null;

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
        onToast("Practice profile and branding updated successfully");
      }
      onClose();
    } catch (err) {
      console.error("Failed to save practice profile:", err);
      alert("Could not save practice profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#0E1420] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-r from-slate-50 to-amber-50/30 dark:from-[#131A26] dark:to-[#171F30] flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-900 dark:bg-gradient-to-br dark:from-[#e0b457] dark:to-[#c49a45] text-white dark:text-slate-950 flex items-center justify-center shadow-md flex-shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  {isOnboarding ? "Welcome! Set Up Your Practice Profile" : "Practice & Brand Identity"}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-[#ffd166] border border-amber-500/20">
                  White-Label
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Brand your portal, doctor directory, and patient 3D treatment viewers.
              </p>
            </div>
          </div>

          {!isOnboarding && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Firm Type Selector */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-800 dark:text-slate-200 block">
              1. Organization Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFirmType("lab")}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  firmType === "lab"
                    ? "bg-amber-500/10 border-amber-500 text-slate-900 dark:text-white ring-1 ring-amber-500/30"
                    : "bg-slate-50 dark:bg-[#131A26] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Layers className="w-4 h-4 text-amber-500 dark:text-[#ffd166]" />
                  {firmType === "lab" && <Check className="w-3.5 h-3.5 text-amber-500 dark:text-[#ffd166]" />}
                </div>
                <div className="font-bold text-xs">Aligner Lab</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Fabricates aligners for multiple clinics & doctors
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFirmType("clinic")}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  firmType === "clinic"
                    ? "bg-amber-500/10 border-amber-500 text-slate-900 dark:text-white ring-1 ring-amber-500/30"
                    : "bg-slate-50 dark:bg-[#131A26] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Building2 className="w-4 h-4 text-amber-500 dark:text-[#ffd166]" />
                  {firmType === "clinic" && <Check className="w-3.5 h-3.5 text-amber-500 dark:text-[#ffd166]" />}
                </div>
                <div className="font-bold text-xs">Dental Clinic</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Clinic group or branch treating patients directly
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFirmType("solo")}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  firmType === "solo"
                    ? "bg-amber-500/10 border-amber-500 text-slate-900 dark:text-white ring-1 ring-amber-500/30"
                    : "bg-slate-50 dark:bg-[#131A26] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Stethoscope className="w-4 h-4 text-amber-500 dark:text-[#ffd166]" />
                  {firmType === "solo" && <Check className="w-3.5 h-3.5 text-amber-500 dark:text-[#ffd166]" />}
                </div>
                <div className="font-bold text-xs">Solo Doctor</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Individual orthodontist managing personal practice
                </div>
              </button>
            </div>
          </div>

          {/* Firm & Brand Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Firm / Practice Name <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                placeholder="e.g. Apex Aligner Studio"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#131A26] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-xs transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Brand Display Name <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. Apex 3D"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#131A26] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-xs transition-all"
              />
            </div>
          </div>

          {/* Brand Logo Upload & Preview */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>Brand Logo (Shown on Patient 3D Viewers)</span>
              {logoUrl && (
                <button
                  type="button"
                  onClick={() => setLogoUrl("")}
                  className="text-[10px] text-rose-500 hover:underline"
                >
                  Remove logo
                </button>
              )}
            </label>

            <div className="flex items-center gap-3">
              {/* Logo Preview Box */}
              <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#131A26] flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                {logoUrl && !logoPreviewError ? (
                  <img
                    src={logoUrl}
                    alt="Brand Logo"
                    onError={() => setLogoPreviewError(true)}
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                )}
              </div>

              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Logo Image</span>
                  </button>
                  <span className="text-[10px] text-slate-400">or paste image URL</span>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleLogoFileSelect}
                  className="hidden"
                />
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => {
                    setLogoUrl(e.target.value);
                    setLogoPreviewError(false);
                  }}
                  placeholder="https://yourpractice.com/logo.png"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#131A26] text-[11px] text-slate-700 dark:text-slate-300 font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Mail className="w-3 h-3 text-amber-500" />
                <span>Contact Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="lab@smilealigners.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#131A26] text-slate-900 dark:text-white text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Phone className="w-3 h-3 text-amber-500" />
                <span>Contact Phone</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#131A26] text-slate-900 dark:text-white text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Address & Website */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>Practice Address</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Suite 500, Ortho Tower"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#131A26] text-slate-900 dark:text-white text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Globe className="w-3 h-3 text-slate-400" />
                <span>Website (Optional)</span>
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://apexaligners.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#131A26] text-slate-900 dark:text-white text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-2.5">
            {!isOnboarding && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSaving || !firmName.trim()}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-gradient-to-r dark:from-[#e0b457] dark:to-[#c49a45] text-white dark:text-slate-950 hover:brightness-105 active:scale-98 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSaving ? "Saving..." : isOnboarding ? "Complete Setup & Continue" : "Save Practice Profile"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

