// @ts-nocheck
import fs from "fs";
import path from "path";
import { generateDisclosurePDF } from "./generateDisclosurePDF";
import { DisclosureInput } from "./schema/disclosure.schema";
import { validateDisclosureInput } from "./validation/validateDisclosure";

// --------------------------------------------------
// VALID base data
// --------------------------------------------------
const validData: DisclosureInput = {
  version: "01-01-2026",

  propertyIdentifier: "1234 Elm Street, Tulsa, OK 74103",

  sellerOccupying: 0,

  sewerSystem: {
    type: 1,
    privateType: 0,
  },

  initials: {
    buyerInitial1: "J",
    buyerInitial2: "B",
    sellerInitial1: "M",
    sellerInitial2: "S",
  },

  additionalPages: {
    hasAdditionalPages: "YES",
    howMany: "2",
  },

  appliances: Object.fromEntries(
    Array.from({ length: 39 }, (_, i) => [
      i,
      i % 4 === 0
        ? "WORKING"
        : i % 4 === 1
        ? "NOT_WORKING"
        : i % 4 === 2
        ? "UNKNOWN"
        : "NONE",
    ])
  ),

  inlineOptions: {
    waterHeaterType: 1,
    waterSoftenerType: 0,
    acType: 2,
    heatingType: 1,
    gasSupplyType: 0,
    propaneTankType: 1,
    generatorType: 1,
    waterSourceType: 0,
    fireSuppresionDate: "01/15/2024",
    securitySystemType: 2,
    solarPanelType: 1,
  },

  page2Zoning: {
    zoningType: "residential",
    historicalDistrict: 1,
  },

  page2Flood: {
    q3Main: 0,
    q3Types: [0, 2],
    q3Municipal: 1,
    q4: 0,
    q5: "YES",
    q6: "NO",
  },

  page2NotWorkingExplanation:
    "Hot tub heating element requires repair. Garbage disposal not functioning.",

  questions: Object.fromEntries(
    Array.from({ length: 44 }, (_, i) => [
      i + 7,
      i % 2 === 0 ? "YES" : "NO",
    ])
  ),

  page3TextFields: {
    roofAge: "12 years",
    roofLayers: "2",
    termiteBaitAnnualCost: "150",
  },

  q37Inline: 1,

  q41Inline: {
    payableType: 2,
    unpaid: "YES",
    ifYesAmount: "500",
    managerName: "John Doe",
    phone: "555-0199",
  },

  q46Inline: {
    payableType: 1,
    amount: "300",
    paidTo: "City Fire Dept",
  },

  q47Details: {
    utilities: [0, 1, 2, 3],
    otherExplain: "Co-op",
    initialMembership: "1000",
    annualMembership: "350",
  },

  financial: {
    hoa: "YES",
    hoaAmount: "350",
    specialAssessment: "YES",
    specialAssessmentAmount: "1200",
  },

  explanation:
    "Seller discloses that the hot tub heating element requires repair. HOA special assessment issued in 2025. All known material defects are disclosed in good faith.",

  signatures: {
    sellerSignatureBase64: "use-file",
    buyerSignatureBase64: "use-file",
  },
};

// --------------------------------------------------
// VALIDATION TESTS
// --------------------------------------------------
function testValidation(
  label: string,
  mutateFn: (d: DisclosureInput) => void
) {
  const data = JSON.parse(JSON.stringify(validData)) as DisclosureInput;
  mutateFn(data);

  try {
    validateDisclosureInput(data);
    console.log(`❌ FAILED (should have thrown): ${label}`);
  } catch (e: any) {
    console.log(`✅ PASSED: ${label} → ${e.message}`);
  }
}

async function run() {
  console.log("\n========== VALIDATION TESTS ==========\n");

  testValidation("missing propertyIdentifier", (d) => {
    d.propertyIdentifier = "";
  });

  testValidation("missing sellerOccupying", (d) => {
    d.sellerOccupying = undefined as any;
  });

  testValidation("missing appliances", (d) => {
    d.appliances = undefined as any;
  });

  testValidation("missing financial", (d) => {
    d.financial = undefined as any;
  });

  testValidation("NOT_WORKING without explanation", (d) => {
    d.page2NotWorkingExplanation = undefined;
  });

  testValidation("additionalPages YES without howMany", (d) => {
    d.additionalPages = { hasAdditionalPages: "YES", howMany: "" };
  });

  testValidation("q41 unpaid YES without ifYesAmount", (d) => {
    d.q41Inline!.ifYesAmount = "";
  });

  testValidation("hoa YES without hoaAmount", (d) => {
    d.financial.hoaAmount = "";
  });

  testValidation("specialAssessment YES without amount", (d) => {
    d.financial.specialAssessmentAmount = "";
  });

  testValidation("initial too long", (d) => {
    d.initials!.buyerInitial1 = "AB";
  });

  testValidation("explanation too long", (d) => {
    d.explanation = "A".repeat(1501);
  });

  testValidation("page2NotWorkingExplanation too long", (d) => {
    d.page2NotWorkingExplanation = "A".repeat(1501);
  });

  console.log("\n========== GENERATING VALID PDF ==========\n");

  try {
    const buffer = await generateDisclosurePDF(validData);

    const outputPath = path.join(
      process.cwd(),
      "src/forms/orec/2026/output-FULLY-FILLED.pdf"
    );

    fs.writeFileSync(outputPath, buffer);
    console.log("✅ Valid PDF generated successfully.");
  } catch (e: any) {
    console.error("❌ PDF generation failed:", e.message);
  }
}

run().catch(console.error);