export type FirmType = "lab" | "clinic" | "solo";

export interface PracticeProfile {
  id: string;
  userId: string;
  firmType: FirmType;
  firmName: string;
  brandName: string;
  logoUrl: string | null;
  email: string;
  phone?: string;
  address?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorRecord {
  id: string;
  userId: string;
  name: string;
  doctorId?: string;
  email?: string;
  phone?: string;
  specialization?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClinicRecord {
  id: string;
  userId: string;
  name: string;
  clinicId?: string;
  address?: string;
  email?: string;
  phone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

