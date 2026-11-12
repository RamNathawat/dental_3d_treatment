"use client";

import { useState } from "react";
import {
  Building2,
  Plus,
  Search,
  Mail,
  Phone,
  Trash2,
  Pencil,
  MapPin,
  Hash,
  X,
  Check,
  FolderOpen,
} from "lucide-react";
import { ClinicRecord } from "@/lib/practice-types";
import { saveClinic, deleteClinic } from "@/lib/practice-storage";
import { DentalCase } from "./page";

interface ClinicsViewProps {
  userId: string;
  clinics: ClinicRecord[];
  cases: DentalCase[];
  onClinicsUpdated: (updatedList: ClinicRecord[]) => void;
  onToast?: (msg: string) => void;
}

export default function ClinicsView({
  userId,
  clinics,
  cases,
  onClinicsUpdated,
  onToast,
}: ClinicsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClinic, setEditingClinic] = useState<ClinicRecord | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [clinicId, setClinicId] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function openCreateModal() {
    setEditingClinic(null);
    setName("");
    setClinicId(`CLN-0${clinics.length + 1}`);
    setAddress("");
    setEmail("");
    setPhone("");
    setNotes("");
    setIsModalOpen(true);
  }

  function openEditModal(cln: ClinicRecord) {
    setEditingClinic(cln);
    setName(cln.name);
    setClinicId(cln.clinicId || "");
    setAddress(cln.address || "");
    setEmail(cln.email || "");
    setPhone(cln.phone || "");
    setNotes(cln.notes || "");
    setIsModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const saved = await saveClinic(userId, {
        id: editingClinic ? editingClinic.id : undefined,
        name: name.trim(),
        clinicId: clinicId.trim() || undefined,
        address: address.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      let updated: ClinicRecord[];
      if (editingClinic) {
        updated = clinics.map((c) => (c.id === saved.id ? saved : c));
      } else {
        updated = [...clinics, saved];
      }

      onClinicsUpdated(updated);
      setIsModalOpen(false);
      if (onToast) {
        onToast(editingClinic ? "Clinic details updated" : `Clinic "${saved.name}" added`);
      }
    } catch (err) {
      console.error("Could not save clinic:", err);
      alert("Failed to save clinic. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(cln: ClinicRecord) {
    if (!confirm(`Are you sure you want to remove "${cln.name}" from your clinics directory?`)) {
      return;
    }

    try {
      await deleteClinic(userId, cln.id);
      const updated = clinics.filter((c) => c.id !== cln.id);
      onClinicsUpdated(updated);
      if (onToast) {
        onToast(`Clinic "${cln.name}" removed`);
      }
    } catch (err) {
      console.error("Could not delete clinic:", err);
      alert("Failed to delete clinic.");
    }
  }

  // Count assigned cases for each clinic
  function getClinicCaseCount(clinicName: string) {
    const cleanCln = clinicName.toLowerCase().trim();
    return cases.filter((c) => {
      const assigned = (c.clinic_name || "").toLowerCase().trim();
      return assigned === cleanCln || assigned.includes(cleanCln) || cleanCln.includes(assigned);
    }).length;
  }

  const filteredClinics = clinics.filter((cln) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      cln.name.toLowerCase().includes(q) ||
      (cln.clinicId && cln.clinicId.toLowerCase().includes(q)) ||
      (cln.email && cln.email.toLowerCase().includes(q)) ||
      (cln.address && cln.address.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-amber-500 dark:text-[#ffd166]" />
            <span>Clinics Directory</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dental practices, multi-location branches, and clinic mailbox partners.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs tracking-wide text-white dark:text-slate-950 bg-slate-900 dark:bg-gradient-to-r dark:from-[#e0b457] dark:to-[#c49a45] hover:brightness-105 active:scale-98 transition-all shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Clinic</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by clinic name, ID, or location..."
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131A26] text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
        />
      </div>

      {/* Clinics Grid */}
      {filteredClinics.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-[#131A26]/50">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-[#ffd166] flex items-center justify-center mx-auto mb-3">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {searchQuery ? "No matching clinics found" : "No Clinics Registered Yet"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No clinics match "${searchQuery}". Try a different keyword.`
              : "Register your dental clinic branches to assign patient cases and auto-fill sharing emails."}
          </p>
          {!searchQuery && (
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-gradient-to-r dark:from-[#e0b457] dark:to-[#c49a45] text-white dark:text-slate-950 inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Clinic</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClinics.map((cln) => {
            const caseCount = getClinicCaseCount(cln.name);
            return (
              <div
                key={cln.id}
                className="bg-white dark:bg-[#131A26] rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-[#e0b457]/40 transition-all flex flex-col justify-between gap-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-[#1A2234] text-white dark:text-[#ffd166] flex items-center justify-center font-bold text-xs flex-shrink-0 border border-transparent dark:border-[#e0b457]/20">
                        {cln.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {cln.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {cln.clinicId && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 dark:bg-[#172033] text-slate-600 dark:text-[#ffd166] border border-slate-200 dark:border-slate-700/60 inline-flex items-center gap-0.5">
                              <Hash className="w-2.5 h-2.5 text-slate-400" />
                              <span>{cln.clinicId}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => openEditModal(cln)}
                        title="Edit Clinic Details"
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-amber-600 dark:hover:text-[#ffd166] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cln)}
                        title="Delete Clinic"
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 pt-1 text-[11px] text-slate-600 dark:text-slate-400">
                    {cln.address && (
                      <div className="flex items-center gap-2 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{cln.address}</span>
                      </div>
                    )}
                    {cln.email && (
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{cln.email}</span>
                      </div>
                    )}
                    {cln.phone && (
                      <div className="flex items-center gap-2 truncate">
                        <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{cln.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer: Cases Assigned */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Total Cases:</span>
                  <span className="font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    {caseCount} {caseCount === 1 ? "Case" : "Cases"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Clinic Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-[#0E1420] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-500" />
                <span>{editingClinic ? "Edit Clinic Details" : "Add New Clinic"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Clinic Name <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Downtown Smile Dental"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#131A26] text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Clinic Branch Code / ID
                </label>
                <input
                  type="text"
                  value={clinicId}
                  onChange={(e) => setClinicId(e.target.value)}
                  placeholder="e.g. CLN-01"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#131A26] text-slate-900 dark:text-white font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Clinic Address / Branch Location
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 450 Medical Plaza, Suite 200"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#131A26] text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Clinic Mailbox Email (For Sharing & Notifications)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="clinic@smiledental.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#131A26] text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#131A26] text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim()}
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-gradient-to-r dark:from-[#e0b457] dark:to-[#c49a45] text-white dark:text-slate-950 hover:brightness-105 active:scale-98 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "Saving..." : editingClinic ? "Save Changes" : "Add Clinic"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

