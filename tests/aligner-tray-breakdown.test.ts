import { describe, it, expect } from "vitest";
import {
  getCaseTrayInfo,
  buildWhatsAppShareText,
  getWhatsAppShareUrl,
  type TrayBreakdownCase,
} from "../portal/lib/case-tray-info";

describe("Aligner Tray Breakdown for Equal & Unequal Arch Stages", () => {
  it("formats unequal dual-arch cases with explicit Upper and Lower tray counts", () => {
    const unequalCase: TrayBreakdownCase = {
      patient_name: "00 Segmented",
      total_stages: 23,
      upper_stages: 23,
      lower_stages: 18,
      doctor_notes: {
        aligner_counts: {
          upper: 23,
          lower: 18,
          total: 41,
          is_unequal: true,
        },
      },
    };

    const info = getCaseTrayInfo(unequalCase);
    expect(info.isUnequal).toBe(true);
    expect(info.total).toBe(41);
    expect(info.upper).toBe(23);
    expect(info.lower).toBe(18);
    expect(info.archBadgeText).toBe("Dual-Arch (U: 23 · L: 18)");
    expect(info.stepperCenterText).toBe(
      "Dual-Arch (Unequal) • Upper: 23 Trays | Lower: 18 Trays",
    );
    expect(info.stepperFinalText).toBe("Stage 23 (Final)");
    expect(info.metadataBadgeText).toBe(
      "41 Total Trays (Upper: 23 · Lower: 18)",
    );
  });

  it("formats equal dual-arch cases showing total trays and stages", () => {
    const equalCase: TrayBreakdownCase = {
      patient_name: "John Doe",
      total_stages: 23,
      upper_stages: 23,
      lower_stages: 23,
      doctor_notes: {
        aligner_counts: {
          upper: 23,
          lower: 23,
          total: 46,
          is_unequal: false,
        },
      },
    };

    const info = getCaseTrayInfo(equalCase);
    expect(info.isUnequal).toBe(false);
    expect(info.total).toBe(46);
    expect(info.upper).toBe(23);
    expect(info.lower).toBe(23);
    expect(info.archBadgeText).toBe("Dual-Arch (46 Trays)");
    expect(info.stepperCenterText).toBe(
      "Dual-Arch Alignment • 23 Trays Each (46 Total)",
    );
    expect(info.metadataBadgeText).toBe(
      "46 Total Trays (23 Upper + 23 Lower)",
    );
  });

  it("handles older cases where arch counts are resolved from cached manifest", () => {
    const olderCase: TrayBreakdownCase = {
      patient_name: "00 Segmented",
      total_stages: 23,
      doctor_notes: null,
    };

    const cached = {
      upper: 23,
      lower: 18,
      total: 41,
      isUnequal: true,
    };

    const info = getCaseTrayInfo(olderCase, cached);
    expect(info.isUnequal).toBe(true);
    expect(info.total).toBe(41);
    expect(info.metadataBadgeText).toBe(
      "41 Total Trays (Upper: 23 · Lower: 18)",
    );
    expect(info.stepperCenterText).toBe(
      "Dual-Arch (Unequal) • Upper: 23 Trays | Lower: 18 Trays",
    );
  });

  it("properly labels single-arch Upper cases", () => {
    const upperCase: TrayBreakdownCase = {
      patient_name: "Niya [Upper]",
      total_stages: 14,
      upper_stages: 14,
      lower_stages: null,
      doctor_notes: null,
    };

    const info = getCaseTrayInfo(upperCase);
    expect(info.isSingle).toBe(true);
    expect(info.archType).toBe("upper");
    expect(info.metadataBadgeText).toBe("14 Aligner Trays (Upper Arch Only)");
    expect(info.stepperCenterText).toBe("Upper Arch Alignment • 14 Trays");
  });

  it("properly labels single-arch Lower cases", () => {
    const lowerCase: TrayBreakdownCase = {
      patient_name: "Niya [Lower]",
      total_stages: 12,
      upper_stages: null,
      lower_stages: 12,
      doctor_notes: null,
    };

    const info = getCaseTrayInfo(lowerCase);
    expect(info.isSingle).toBe(true);
    expect(info.archType).toBe("lower");
    expect(info.metadataBadgeText).toBe("12 Aligner Trays (Lower Arch Only)");
    expect(info.stepperCenterText).toBe("Lower Arch Alignment • 12 Trays");
  });

  it("builds formatted WhatsApp share message with patient details, tray count, and link", () => {
    const text = buildWhatsAppShareText({
      patientName: "00 Segmented",
      patientId: "PT-2026",
      stages: 23,
      metadataBadgeText: "41 Total Trays (Upper: 23 · Lower: 18)",
      archBadgeText: "Dual-Arch (U: 23 · L: 18)",
      clinicName: "Smile Dental Clinic",
      shareUrl: "https://example.com/treatment?case=tok123",
    });

    expect(text).toContain("🦷 *Orthodontic 3D Treatment Progression*");
    expect(text).toContain("*Patient:* 00 Segmented (#PT-2026)");
    expect(text).toContain("*Prescription:* 41 Total Trays (Upper: 23 · Lower: 18)");
    expect(text).toContain("*Stages:* 23 Stages (Dual-Arch (U: 23 · L: 18))");
    expect(text).toContain("*Clinic:* Smile Dental Clinic");
    expect(text).toContain("https://example.com/treatment?case=tok123");
  });

  it("generates WhatsApp URL for picking any contact when no phone number is provided", () => {
    const url = getWhatsAppShareUrl({
      text: "Hello 3D Link: https://example.com",
    });
    expect(url).toBe(
      "https://api.whatsapp.com/send?text=Hello%203D%20Link%3A%20https%3A%2F%2Fexample.com",
    );
  });

  it("generates WhatsApp URL with direct target phone number when provided", () => {
    const url = getWhatsAppShareUrl({
      text: "Review 3D: https://example.com",
      phoneNumber: "+91 70342 24326",
    });
    expect(url).toBe(
      "https://api.whatsapp.com/send?phone=917034224326&text=Review%203D%3A%20https%3A%2F%2Fexample.com",
    );
  });
});
