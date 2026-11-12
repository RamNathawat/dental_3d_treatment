// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from "vitest";
import {
  getLocalPracticeProfile,
  saveLocalPracticeProfile,
  getLocalDoctors,
  saveLocalDoctors,
  getLocalClinics,
  saveLocalClinics,
  saveClinic,
  saveDoctor,
} from "../portal/lib/practice-storage";
import type { PracticeProfile, DoctorRecord, ClinicRecord } from "../portal/lib/practice-types";

describe("Milestone 3 - Phase 2: Practice Hierarchy Storage", () => {
  const testUserId = "user-test-uuid-1234";

  beforeEach(() => {
    localStorage.clear();
  });

  it("saves and retrieves practice profile locally", () => {
    const profile: PracticeProfile = {
      id: "prof-1",
      userId: testUserId,
      firmType: "lab",
      firmName: "Apex Aligner Studio",
      brandName: "Apex 3D",
      logoUrl: "https://example.com/logo.png",
      email: "lab@apexaligners.com",
      phone: "+1-555-0199",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveLocalPracticeProfile(testUserId, profile);
    const retrieved = getLocalPracticeProfile(testUserId);

    expect(retrieved).not.toBeNull();
    expect(retrieved?.firmName).toBe("Apex Aligner Studio");
    expect(retrieved?.brandName).toBe("Apex 3D");
    expect(retrieved?.firmType).toBe("lab");
  });

  it("handles doctors list CRUD in localStorage", () => {
    const doc1: DoctorRecord = {
      id: "doc-1",
      userId: testUserId,
      name: "Dr. Sarah Jenkins",
      doctorId: "DOC-01",
      email: "sarah@smilestudio.com",
      specialization: "Orthodontist",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const doc2: DoctorRecord = {
      id: "doc-2",
      userId: testUserId,
      name: "Dr. Rajesh Kumar",
      doctorId: "DOC-02",
      email: "rajesh@metroortho.com",
      specialization: "Dentist",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveLocalDoctors(testUserId, [doc1, doc2]);
    const list = getLocalDoctors(testUserId);

    expect(list.length).toBe(2);
    expect(list[0]?.name).toBe("Dr. Sarah Jenkins");
    expect(list[1]?.name).toBe("Dr. Rajesh Kumar");
  });

  it("handles clinics list CRUD in localStorage", () => {
    const clinic: ClinicRecord = {
      id: "cln-1",
      userId: testUserId,
      name: "Downtown Smile Clinic",
      clinicId: "CLN-01",
      address: "123 Main St, Suite 400",
      email: "clinic@smiledental.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveLocalClinics(testUserId, [clinic]);
    const list = getLocalClinics(testUserId);

    expect(list.length).toBe(1);
    expect(list[0]?.name).toBe("Downtown Smile Clinic");
    expect(list[0]?.email).toBe("clinic@smiledental.com");
  });

  it("auto-provisions and persists a new clinic with optional phone and address", async () => {
    const created = await saveClinic(testUserId, {
      name: "Sunrise Orthodontic Studio",
      clinicId: "CLN-02",
      email: "contact@sunriseortho.com",
      phone: "+91 98765 43210",
      address: "124 Indiranagar, Bangalore",
    });

    expect(created.id).toBeDefined();
    expect(created.name).toBe("Sunrise Orthodontic Studio");
    expect(created.clinicId).toBe("CLN-02");
    expect(created.email).toBe("contact@sunriseortho.com");
    expect(created.phone).toBe("+91 98765 43210");
    expect(created.address).toBe("124 Indiranagar, Bangalore");

    const retrieved = getLocalClinics(testUserId);
    expect(retrieved.length).toBe(1);
    expect(retrieved[0]?.name).toBe("Sunrise Orthodontic Studio");
    expect(retrieved[0]?.clinicId).toBe("CLN-02");
  });

  it("auto-provisions and persists a new doctor with optional specialization and contact", async () => {
    const created = await saveDoctor(testUserId, {
      name: "Dr. Ananya Roy",
      doctorId: "DOC-02",
      specialization: "Orthodontist / MDS",
      phone: "+91 91234 56789",
      email: "ananya.roy@ortho.com",
    });

    expect(created.id).toBeDefined();
    expect(created.name).toBe("Dr. Ananya Roy");
    expect(created.doctorId).toBe("DOC-02");
    expect(created.specialization).toBe("Orthodontist / MDS");
    expect(created.phone).toBe("+91 91234 56789");
    expect(created.email).toBe("ananya.roy@ortho.com");

    const retrieved = getLocalDoctors(testUserId);
    expect(retrieved.length).toBe(1);
    expect(retrieved[0]?.name).toBe("Dr. Ananya Roy");
    expect(retrieved[0]?.specialization).toBe("Orthodontist / MDS");
  });
});
