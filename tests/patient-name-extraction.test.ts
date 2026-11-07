import { describe, it, expect } from "vitest";
import {
  isGenericOrTechnicalName,
  cleanPatientNameFromFilename,
} from "../portal/lib/in-browser-converter";

describe("Patient Name Extraction & Generic Filter", () => {
  it("rejects generic CAD and orthodontic folder names", () => {
    expect(isGenericOrTechnicalName("00 Segmented")).toBe(true);
    expect(isGenericOrTechnicalName("00_segmented")).toBe(true);
    expect(isGenericOrTechnicalName("00")).toBe(true);
    expect(isGenericOrTechnicalName("01")).toBe(true);
    expect(isGenericOrTechnicalName("Stage 00")).toBe(true);
    expect(isGenericOrTechnicalName("Step 01")).toBe(true);
    expect(isGenericOrTechnicalName("Upper")).toBe(true);
    expect(isGenericOrTechnicalName("Lower")).toBe(true);
    expect(isGenericOrTechnicalName("Upper Jaw")).toBe(true);
    expect(isGenericOrTechnicalName("Maxilla")).toBe(true);
    expect(isGenericOrTechnicalName("Mandible")).toBe(true);
    expect(isGenericOrTechnicalName("Segmented")).toBe(true);
    expect(isGenericOrTechnicalName("Unsegmented")).toBe(true);
    expect(isGenericOrTechnicalName("Models")).toBe(true);
    expect(isGenericOrTechnicalName("CAD Export")).toBe(true);
    expect(isGenericOrTechnicalName("")).toBe(true);
  });

  it("accepts real patient names", () => {
    expect(isGenericOrTechnicalName("Niya")).toBe(false);
    expect(isGenericOrTechnicalName("Aibel")).toBe(false);
    expect(isGenericOrTechnicalName("Irene")).toBe(false);
    expect(isGenericOrTechnicalName("John Doe")).toBe(false);
  });

  it("extracts patient name accurately from upper/lower zip files", () => {
    expect(cleanPatientNameFromFilename("Niya_Upper.zip")).toBe("Niya");
    expect(cleanPatientNameFromFilename("Niya - Upper Jaw.zip")).toBe("Niya");
    expect(cleanPatientNameFromFilename("Niya_Lower.zip")).toBe("Niya");
    expect(cleanPatientNameFromFilename("Niya 10.zip")).toBe("Niya");
    expect(cleanPatientNameFromFilename("Aibel-upper.zip")).toBe("Aibel");
    expect(cleanPatientNameFromFilename("Irene_Maxilla_18.zip")).toBe("Irene");
  });

  it("returns empty string for generic zip names so user is prompted to enter manually", () => {
    expect(cleanPatientNameFromFilename("upper.zip")).toBe("");
    expect(cleanPatientNameFromFilename("Lower.zip")).toBe("");
    expect(cleanPatientNameFromFilename("Upper_Jaw.zip")).toBe("");
    expect(cleanPatientNameFromFilename("00_Segmented.zip")).toBe("");
    expect(cleanPatientNameFromFilename("Export.zip")).toBe("");
  });
});

