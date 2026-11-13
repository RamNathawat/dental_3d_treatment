"use client";

import { useState } from "react";
import {
  Stethoscope,
  Plus,
  Search,
  Mail,
  Phone,
  Trash2,
  Pencil,
  Hash,
  X,
  Check,
  UserCheck,
  FolderOpen,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  ExternalLink,
  Building2,
} from "lucide-react";
import { DoctorRecord } from "@/lib/practice-types";
import {
  saveDoctor,
  deleteDoctor,
  isDoctorProfileIncomplete,
  getDoctorMissingFields,
  matchCaseToDoctor,
} from "@/lib/practice-storage";
import { DentalCase } from "./page";

interface DoctorsViewProps {
  userId: string;
  doctors: DoctorRecord[];
  cases: DentalCase[];
  onDoctorsUpdated: (updatedList: DoctorRecord[]) => void;
  onToast?: (msg: string) => void;
}

export default function DoctorsView({
  userId,
  doctors,
  cases,
  onDoctorsUpdated,
  onToast,
}: DoctorsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<DoctorRecord | null>(null);
  const [expandedDoctorIds, setExpandedDoctorIds] = useState<Record<string, boolean>>({});

  // Form states
  const [name, setName] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialization, setSpecialization] = useState("Orthodontist");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleDoctorExpand(docId: string) {
    setExpandedDoctorIds((prev) => ({
      ...prev,
      [docId]: !prev[docId],
    }));
  }

  function openCreateModal() {
    setEditingDoctor(null);
    setName("");
    setDoctorId(`DOC-0${doctors.length + 1}`);
    setEmail("");
    setPhone("");
    setSpecialization("Orthodontist");
    setNotes("");
    setIsModalOpen(true);
  }

  function openEditModal(doc: DoctorRecord) {
    setEditingDoctor(doc);
    setName(doc.name);
    setDoctorId(doc.doctorId || "");
    setEmail(doc.email || "");
    setPhone(doc.phone || "");
    setSpecialization(doc.specialization || "Orthodontist");
    setNotes(doc.notes || "");
    setIsModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const saved = await saveDoctor(userId, {
        id: editingDoctor ? editingDoctor.id : undefined,
        name: name.trim(),
        doctorId: doctorId.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        specialization: specialization.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      let updated: DoctorRecord[];
      if (editingDoctor) {
        updated = doctors.map((d) => (d.id === saved.id ? saved : d));
      } else {
        updated = [...doctors, saved];
      }

      onDoctorsUpdated(updated);
      setIsModalOpen(false);
      if (onToast) {
        onToast(editingDoctor ? "Doctor details updated" : `Doctor "${saved.name}" added`);
      }
    } catch (err) {
      console.error("Could not save doctor:", err);
      alert("Failed to save doctor. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(doc: DoctorRecord) {
    if (!confirm(`Are you sure you want to remove ${doc.name} from your practice directory?`)) {
      return;
    }

    try {
      await deleteDoctor(userId, doc.id);
      const updated = doctors.filter((d) => d.id !== doc.id);
      onDoctorsUpdated(updated);
      if (onToast) {
        onToast(`Doctor "${doc.name}" removed`);
      }
    } catch (err) {
      console.error("Could not delete doctor:", err);
      alert("Failed to delete doctor.");
    }
  }

  // Count assigned cases for each doctor
  function getDoctorCaseCount(doctorName: string) {
    const cleanDoc = doctorName.toLowerCase().replace(/^dr\.?\s*/i, "").trim();
    return cases.filter((c) => {
      const notes = c.doctor_notes && typeof c.doctor_notes === "object" ? c.doctor_notes : {};
      const assignedDoctor = (notes.assigned_doctor || c.doctor_name || "").toLowerCase();
      return assignedDoctor.includes(cleanDoc);
    }).length;
  }

  const filteredDoctors = doctors.filter((doc) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      doc.name.toLowerCase().includes(q) ||
      (doc.doctorId && doc.doctorId.toLowerCase().includes(q)) ||
      (doc.email && doc.email.toLowerCase().includes(q)) ||
      (doc.specialization && doc.specialization.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Stethoscope className="w-6 h-6 text-amber-500 dark:text-[#ffd166]" />
            <span>Doctors Directory</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Registered orthodontists and treating dentists in your practice.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs tracking-wide text-white dark:text-slate-950 bg-slate-900 dark:bg-gradient-to-r dark:from-[#e0b457] dark:to-[#c49a45] hover:brightness-105 active:scale-98 transition-all shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Doctor</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, ID, or specialization..."
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131A26] text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
        />
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-[#131A26]/50">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-[#ffd166] flex items-center justify-center mx-auto mb-3">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {searchQuery ? "No matching doctors found" : "No Doctors Registered Yet"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No doctors match "${searchQuery}". Try a different keyword.`
              : "Add the orthodontists and dentists working with your firm to assign treatment cases with 1 click."}
          </p>
          {!searchQuery && (
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-gradient-to-r dark:from-[#e0b457] dark:to-[#c49a45] text-white dark:text-slate-950 inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Doctor</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
          {filteredDoctors.map((doc) => {
            const assignedCases = cases.filter((c) => matchCaseToDoctor(c, doc));
            const isIncomplete = isDoctorProfileIncomplete(doc);
            const missingFields = getDoctorMissingFields(doc);
            const isExpanded = Boolean(expandedDoctorIds[doc.id]);

            return (
              <div
                key={doc.id}
                className="bg-white dark:bg-[#131A26] rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-[#e0b457]/40 transition-all flex flex-col gap-3 group h-fit"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-[#1A2234] text-white dark:text-[#ffd166] flex items-center justify-center font-bold text-xs flex-shrink-0 border border-transparent dark:border-[#e0b457]/20">
                        {doc.name.replace(/^dr\.?\s*/i, "").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {doc.name.startsWith("Dr.") ? doc.name : `Dr. ${doc.name}`}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {doc.doctorId && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 dark:bg-[#172033] text-slate-600 dark:text-[#ffd166] border border-slate-200 dark:border-slate-700/60 inline-flex items-center gap-0.5">
                              <Hash className="w-2.5 h-2.5 text-slate-400" />
                              <span>{doc.doctorId}</span>
                            </span>
                          )}
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-600 dark:text-[#ffd166]">
                            {doc.specialization || "Orthodontist"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => openEditModal(doc)}
                        title="Edit Doctor Details"
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-amber-600 dark:hover:text-[#ffd166] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(doc)}
                        title="Delete Doctor"
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Incomplete Profile Alert Badge */}
                  {isIncomplete && (
                    <div className="flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-900 dark:text-[#ffd166] animate-fadeIn">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500 dark:text-[#ffd166] flex-shrink-0" />
                        <span className="truncate">
                          Missing {missingFields.join(", ")}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(doc);
                        }}
                        className="text-[10px] font-bold underline hover:brightness-125 flex-shrink-0 cursor-pointer"
                      >
                        Complete
                      </button>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="space-y-1.5 pt-1 text-[11px] text-slate-600 dark:text-slate-400">
                    {doc.email && (
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{doc.email}</span>
                      </div>
                    )}
                    {doc.phone && (
                      <div className="flex items-center gap-2 truncate">
                        <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{doc.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer: Cases Assigned & Expand Toggle */}
                <button
                  type="button"
                  onClick={() => toggleDoctorExpand(doc.id)}
                  className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] w-full text-left cursor-pointer group/btn hover:text-amber-600 dark:hover:text-[#ffd166] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 group-hover/btn:text-slate-600 dark:group-hover/btn:text-slate-300">
                      Assigned Cases:
                    </span>
                    <span className="font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      {assignedCases.length} {assignedCases.length === 1 ? "Case" : "Cases"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    <span>{isExpanded ? "Hide Cases" : "View Cases"}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>

                {/* Expanded Cases Drawer */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      <span>Assigned Cases ({assignedCases.length})</span>
                    </div>

                    {assignedCases.length === 0 ? (
                      <p className="text-xs text-slate-400 dark:text-slate-500 italic py-2 text-center bg-slate-50 dark:bg-slate-900/30 rounded-xl">
                        No cases assigned to this doctor yet.
                      </p>
                    ) : (
                      <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 divide-y divide-slate-100 dark:divide-slate-800/40">
                        {assignedCases.map((c) => (
                          <div
                            key={c.id}
                            className="pt-1.5 first:pt-0 flex items-center justify-between gap-2 text-xs"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                                  {c.patient_name}
                                </span>
                                {c.patient_id && (
                                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                                    #{c.patient_id}
                                  </span>
                                )}
                                {c.is_refinement && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/10 text-amber-700 dark:text-[#ffd166]">
                                    Refinement
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 truncate">
                                {c.clinic_name && (
                                  <span className="inline-flex items-center gap-0.5 truncate">
                                    <Building2 className="w-2.5 h-2.5 text-slate-400" />
                                    <span>{c.clinic_name}</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            <a
                              href={`/treatment?case=${c.share_token}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Open 3D Progression"
                              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-[#1A2234] hover:bg-amber-500/20 text-slate-700 dark:text-slate-200 hover:text-amber-800 dark:hover:text-[#ffd166] text-[10px] font-semibold transition-colors flex-shrink-0"
                            >
                              <Eye className="w-3 h-3 text-amber-500 dark:text-[#ffd166]" />
                              <span>3D View</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Doctor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-[#0E1420] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-amber-500" />
                <span>{editingDoctor ? "Edit Doctor Details" : "Add New Doctor"}</span>
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
                  Doctor Full Name <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Kumar"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#131A26] text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-800 dark:text-slate-200">
                    Doctor ID / Code
                  </label>
                  <input
                    type="text"
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    placeholder="e.g. DOC-01"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#131A26] text-slate-900 dark:text-white font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-800 dark:text-slate-200">
                    Specialization
                  </label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g. Orthodontist"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#131A26] text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@practice.com"
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
                  placeholder="+91 98765 43210"
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
                  <span>{isSubmitting ? "Saving..." : editingDoctor ? "Save Changes" : "Add Doctor"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

