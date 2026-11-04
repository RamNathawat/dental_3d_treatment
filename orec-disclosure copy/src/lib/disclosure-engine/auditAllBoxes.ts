// src/lib/disclosure-engine/auditAllBoxes.ts
//
// Draws EVERY possible X on EVERY row across all pages.
// One PDF — use it to visually audit coordinate alignment.
//
// Run: npx tsx src/lib/disclosure-engine/auditAllBoxes.ts
//
import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts } from "pdf-lib";
import * as raw from "../../forms/orec/2026/layout";

async function run() {
  const templatePath = path.join(
    process.cwd(),
    "src/forms/orec/2026/template.pdf"
  );
  const templateBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const S = 11; // font size for all X marks

  // ─────────────────────────────────────────────
  // PAGE 1
  // ─────────────────────────────────────────────

  const p1 = pages[0];

  // Property identifier
  p1.drawText("123 Audit Lane, Oklahoma City, OK 73101", {
    x: raw.PROPERTY_IDENTIFIER_HEADER.x,
    y: raw.PROPERTY_IDENTIFIER_HEADER.y,
    size: raw.PROPERTY_IDENTIFIER_HEADER.fontSize,
    font,
  });
  p1.drawText("123 Audit Lane, Oklahoma City, OK 73101", {
    x: raw.PROPERTY_IDENTIFIER_PAGE1.x,
    y: raw.PROPERTY_IDENTIFIER_PAGE1.y,
    size: raw.PROPERTY_IDENTIFIER_PAGE1.fontSize,
    font,
  });

  // Seller occupying — both options
  p1.drawText("X", { x: raw.SELLER_OCCUPYING.occupyingX,    y: raw.SELLER_OCCUPYING.y, size: S, font });
  p1.drawText("X", { x: raw.SELLER_OCCUPYING.notOccupyingX, y: raw.SELLER_OCCUPYING.y, size: S, font });

  // Appliance rows 0–18 — all 4 columns every row
  const resolveRowY = (i: number) => {
    const baseY = raw.APPLIANCE_FIRST_ROW_Y - i * raw.APPLIANCE_ROW_SPACING;
    return i === 9 ? 202.5 : i > 9 ? baseY - 12.5 : baseY;
  };

  for (let i = 0; i <= 18; i++) {
    const y = resolveRowY(i);
    p1.drawText("X", { x: raw.APPLIANCE_COLUMNS.WORKING,     y, size: S, font });
    p1.drawText("X", { x: raw.APPLIANCE_COLUMNS.NOT_WORKING, y, size: S, font });
    p1.drawText("X", { x: raw.APPLIANCE_COLUMNS.DO_NOT_KNOW, y, size: S, font });
    p1.drawText("X", { x: raw.APPLIANCE_COLUMNS.NONE,        y, size: S, font });
  }

  // Sewer inline — Public + Private
  p1.drawText("X", { x: raw.SEWER_INLINE.publicX,                           y: raw.SEWER_INLINE.y, size: raw.SEWER_INLINE.size, font });
  p1.drawText("X", { x: raw.SEWER_INLINE.publicX + raw.SEWER_INLINE.deltaToPrivate, y: raw.SEWER_INLINE.y, size: raw.SEWER_INLINE.size, font });

  // Septic private subtype — all 3
  p1.drawText("X", { x: raw.SEPTIC_INLINE.firstX,                                             y: raw.SEPTIC_INLINE.y, size: raw.SEPTIC_INLINE.size, font });
  p1.drawText("X", { x: raw.SEPTIC_INLINE.firstX + raw.SEPTIC_INLINE.deltaToSecond,           y: raw.SEPTIC_INLINE.y, size: raw.SEPTIC_INLINE.size, font });
  p1.drawText("X", { x: raw.SEPTIC_INLINE.firstX + raw.SEPTIC_INLINE.deltaToThird,            y: raw.SEPTIC_INLINE.y, size: raw.SEPTIC_INLINE.size, font });

  // Water heater inline — all 3
  const whY = resolveRowY(raw.WATER_HEATER_INLINE.rowIndex);
  p1.drawText("X", { x: raw.WATER_HEATER_INLINE.firstX,                                                    y: whY, size: raw.WATER_HEATER_INLINE.size, font });
  p1.drawText("X", { x: raw.WATER_HEATER_INLINE.firstX + raw.WATER_HEATER_INLINE.deltaToSecond,            y: whY, size: raw.WATER_HEATER_INLINE.size, font });
  p1.drawText("X", { x: raw.WATER_HEATER_INLINE.firstX + raw.WATER_HEATER_INLINE.deltaToThird,             y: whY, size: raw.WATER_HEATER_INLINE.size, font });

  // Water softener inline — both
  const wsY = resolveRowY(raw.WATER_SOFTENER_INLINE.rowIndex);
  p1.drawText("X", { x: raw.WATER_SOFTENER_INLINE.firstX,                                     y: wsY, size: raw.WATER_SOFTENER_INLINE.size, font });
  p1.drawText("X", { x: raw.WATER_SOFTENER_INLINE.firstX + raw.WATER_SOFTENER_INLINE.deltaToSecond, y: wsY, size: raw.WATER_SOFTENER_INLINE.size, font });

  // AC inline — all 3
  const acY = resolveRowY(raw.AC_INLINE.rowIndex);
  p1.drawText("X", { x: raw.AC_INLINE.firstX,                                    y: acY, size: raw.AC_INLINE.size, font });
  p1.drawText("X", { x: raw.AC_INLINE.firstX + raw.AC_INLINE.deltaToSecond,      y: acY, size: raw.AC_INLINE.size, font });
  p1.drawText("X", { x: raw.AC_INLINE.firstX + raw.AC_INLINE.deltaToThird,       y: acY, size: raw.AC_INLINE.size, font });

  // Heating inline — all 3
  const htY = resolveRowY(raw.HEATING_INLINE.rowIndex);
  p1.drawText("X", { x: raw.HEATING_INLINE.firstX,                                    y: htY, size: raw.HEATING_INLINE.size, font });
  p1.drawText("X", { x: raw.HEATING_INLINE.firstX + raw.HEATING_INLINE.deltaToSecond, y: htY, size: raw.HEATING_INLINE.size, font });
  p1.drawText("X", { x: raw.HEATING_INLINE.firstX + raw.HEATING_INLINE.deltaToThird,  y: htY, size: raw.HEATING_INLINE.size, font });

  // Gas supply inline — all 3
  const gsY = resolveRowY(raw.GAS_SUPPLY_INLINE.rowIndex);
  p1.drawText("X", { x: raw.GAS_SUPPLY_INLINE.firstX,                                      y: gsY, size: raw.GAS_SUPPLY_INLINE.size, font });
  p1.drawText("X", { x: raw.GAS_SUPPLY_INLINE.firstX + raw.GAS_SUPPLY_INLINE.deltaToSecond, y: gsY, size: raw.GAS_SUPPLY_INLINE.size, font });
  p1.drawText("X", { x: raw.GAS_SUPPLY_INLINE.firstX + raw.GAS_SUPPLY_INLINE.deltaToThird,  y: gsY, size: raw.GAS_SUPPLY_INLINE.size, font });

  // Propane tank inline — both
  const ptY = resolveRowY(raw.PROPANE_TANK_INLINE.rowIndex);
  p1.drawText("X", { x: raw.PROPANE_TANK_INLINE.firstX,                                         y: ptY, size: raw.PROPANE_TANK_INLINE.size, font });
  p1.drawText("X", { x: raw.PROPANE_TANK_INLINE.firstX + raw.PROPANE_TANK_INLINE.deltaToSecond, y: ptY, size: raw.PROPANE_TANK_INLINE.size, font });

  // ─────────────────────────────────────────────
  // PAGE 2
  // ─────────────────────────────────────────────

  const p2 = pages[1];

  // Header on page 2
  p2.drawText("123 Audit Lane, Oklahoma City, OK 73101", {
    x: raw.PROPERTY_IDENTIFIER_HEADER.x,
    y: raw.PROPERTY_IDENTIFIER_HEADER.y,
    size: raw.PROPERTY_IDENTIFIER_HEADER.fontSize,
    font,
  });

  // Appliance rows 19–38 — all 4 columns every row
  // PAGE2_ROW_Y keys 0–19 map to appliance indexes 19–38
  Object.entries(raw.PAGE2_ROW_Y).forEach(([keyStr, y]) => {
    p2.drawText("X", { x: raw.APPLIANCE_COLUMNS.WORKING,     y, size: S, font });
    p2.drawText("X", { x: raw.APPLIANCE_COLUMNS.NOT_WORKING, y, size: S, font });
    p2.drawText("X", { x: raw.APPLIANCE_COLUMNS.DO_NOT_KNOW, y, size: S, font });
    p2.drawText("X", { x: raw.APPLIANCE_COLUMNS.NONE,        y, size: S, font });
  });

  // Security system inline — all 4
  const secY = raw.PAGE2_ROW_Y[4];
  p2.drawText("X", { x: raw.PAGE2_SECURITY_INLINE.firstX,                                                           y: secY, size: S, font });
  p2.drawText("X", { x: raw.PAGE2_SECURITY_INLINE.firstX + raw.PAGE2_SECURITY_INLINE.deltaToSecond,                 y: secY, size: S, font });
  p2.drawText("X", { x: raw.PAGE2_SECURITY_INLINE.firstX + raw.PAGE2_SECURITY_INLINE.deltaToThird,                  y: secY, size: S, font });
  p2.drawText("X", { x: raw.PAGE2_SECURITY_INLINE.firstX + raw.PAGE2_SECURITY_INLINE.deltaToFourth,                 y: secY, size: S, font });

  // Solar panels inline — all 3
  const solY = raw.PAGE2_ROW_Y[17];
  p2.drawText("X", { x: raw.PAGE2_SOLAR_INLINE.firstX,                                    y: solY, size: S, font });
  p2.drawText("X", { x: raw.PAGE2_SOLAR_INLINE.firstX + raw.PAGE2_SOLAR_INLINE.deltaToSecond, y: solY, size: S, font });
  p2.drawText("X", { x: raw.PAGE2_SOLAR_INLINE.firstX + raw.PAGE2_SOLAR_INLINE.deltaToThird,  y: solY, size: S, font });

  // Generator inline — all 3
  const genY = raw.PAGE2_ROW_Y[18];
  p2.drawText("X", { x: raw.PAGE2_GENERATORS_INLINE.firstX,                                         y: genY, size: S, font });
  p2.drawText("X", { x: raw.PAGE2_GENERATORS_INLINE.firstX + raw.PAGE2_GENERATORS_INLINE.deltaToSecond, y: genY, size: S, font });
  p2.drawText("X", { x: raw.PAGE2_GENERATORS_INLINE.firstX + raw.PAGE2_GENERATORS_INLINE.deltaToThird,  y: genY, size: S, font });

  // Water source inline — all 3
  const wsrcY = raw.PAGE2_ROW_Y[19];
  p2.drawText("X", { x: raw.PAGE2_WATER_SOURCE_INLINE.firstX,                                           y: wsrcY, size: S, font });
  p2.drawText("X", { x: raw.PAGE2_WATER_SOURCE_INLINE.firstX + raw.PAGE2_WATER_SOURCE_INLINE.deltaToSecond, y: wsrcY, size: S, font });
  p2.drawText("X", { x: raw.PAGE2_WATER_SOURCE_INLINE.firstX + raw.PAGE2_WATER_SOURCE_INLINE.deltaToThird,  y: wsrcY, size: S, font });

  // Fire suppression date
  p2.drawText("01/15/2024", { x: raw.PAGE2_FIRE_SUPPRESSION_DATE.x, y: raw.PAGE2_FIRE_SUPPRESSION_DATE.y, size: 10, font });

  // Zoning Q1 row 1 — all 6
  const zr1Y = raw.PAGE2_ZONING_Q1_ROW1.y;
  p2.drawText("X", { x: raw.PAGE2_ZONING_Q1_ROW1.firstX,                                         y: zr1Y, size: S, font });
  raw.PAGE2_ZONING_Q1_ROW1.deltas.forEach((d) => {
    p2.drawText("X", { x: raw.PAGE2_ZONING_Q1_ROW1.firstX + d, y: zr1Y, size: S, font });
  });

  // Zoning Q1 row 2 — all 4
  const zr2Y = raw.PAGE2_ZONING_Q1_ROW2.y;
  p2.drawText("X", { x: raw.PAGE2_ZONING_Q1_ROW2.firstX, y: zr2Y, size: S, font });
  raw.PAGE2_ZONING_Q1_ROW2.deltas.forEach((d) => {
    p2.drawText("X", { x: raw.PAGE2_ZONING_Q1_ROW2.firstX + d, y: zr2Y, size: S, font });
  });

  // Zoning Q2 — YES / NO / UNKNOWN
  p2.drawText("X", { x: raw.PAGE2_ZONING_Q2.firstX,                                   y: raw.PAGE2_ZONING_Q2.y, size: S, font });
  p2.drawText("X", { x: raw.PAGE2_ZONING_Q2.firstX + raw.PAGE2_ZONING_Q2.deltas[0],   y: raw.PAGE2_ZONING_Q2.y, size: S, font });
  p2.drawText("X", { x: raw.PAGE2_ZONING_Q2.firstX + raw.PAGE2_ZONING_Q2.deltas[1],   y: raw.PAGE2_ZONING_Q2.y, size: S, font });

  // Flood Q3 main — YES / NO / UNKNOWN
  p2.drawText("X", { x: raw.PAGE2_FLOOD_Q3_MAIN.firstX,                                       y: raw.PAGE2_FLOOD_Q3_MAIN.y, size: S, font });
  p2.drawText("X", { x: raw.PAGE2_FLOOD_Q3_MAIN.firstX + raw.PAGE2_FLOOD_Q3_MAIN.deltas[0],   y: raw.PAGE2_FLOOD_Q3_MAIN.y, size: S, font });
  p2.drawText("X", { x: raw.PAGE2_FLOOD_Q3_MAIN.firstX + raw.PAGE2_FLOOD_Q3_MAIN.deltas[1],   y: raw.PAGE2_FLOOD_Q3_MAIN.y, size: S, font });

  // Flood Q3 types — all 4
  p2.drawText("X", { x: raw.PAGE2_FLOOD_Q3_TYPES.firstX, y: raw.PAGE2_FLOOD_Q3_TYPES.y, size: S, font });
  raw.PAGE2_FLOOD_Q3_TYPES.deltas.forEach((d) => {
    p2.drawText("X", { x: raw.PAGE2_FLOOD_Q3_TYPES.firstX + d, y: raw.PAGE2_FLOOD_Q3_TYPES.y, size: S, font });
  });

  // Flood Q3 municipal — YES / NO / UNKNOWN
  p2.drawText("X", { x: raw.PAGE2_FLOOD_Q3_MUNICIPAL.firstX,                                           y: raw.PAGE2_FLOOD_Q3_MUNICIPAL.y, size: S, font });
  p2.drawText("X", { x: raw.PAGE2_FLOOD_Q3_MUNICIPAL.firstX + raw.PAGE2_FLOOD_Q3_MUNICIPAL.deltas[0],  y: raw.PAGE2_FLOOD_Q3_MUNICIPAL.y, size: S, font });
  p2.drawText("X", { x: raw.PAGE2_FLOOD_Q3_MUNICIPAL.firstX + raw.PAGE2_FLOOD_Q3_MUNICIPAL.deltas[1],  y: raw.PAGE2_FLOOD_Q3_MUNICIPAL.y, size: S, font });

  // Flood Q4 — YES / NO / UNKNOWN
  p2.drawText("X", { x: raw.PAGE2_FLOOD_Q4.firstX,                               y: raw.PAGE2_FLOOD_Q4.y, size: S, font });
  p2.drawText("X", { x: raw.PAGE2_FLOOD_Q4.firstX + raw.PAGE2_FLOOD_Q4.deltas[0], y: raw.PAGE2_FLOOD_Q4.y, size: S, font });
  p2.drawText("X", { x: raw.PAGE2_FLOOD_Q4.firstX + raw.PAGE2_FLOOD_Q4.deltas[1], y: raw.PAGE2_FLOOD_Q4.y, size: S, font });

  // Flood Q5 — YES + NO
  p2.drawText("X", { x: raw.PAGE2_FLOOD_VERTICAL_COLUMNS.YES, y: raw.PAGE2_FLOOD_Q5_Y, size: S, font });
  p2.drawText("X", { x: raw.PAGE2_FLOOD_VERTICAL_COLUMNS.NO,  y: raw.PAGE2_FLOOD_Q5_Y, size: S, font });

  // Flood Q6 — YES + NO
  p2.drawText("X", { x: raw.PAGE2_FLOOD_VERTICAL_COLUMNS.YES, y: raw.PAGE2_FLOOD_Q6_Y, size: S, font });
  p2.drawText("X", { x: raw.PAGE2_FLOOD_VERTICAL_COLUMNS.NO,  y: raw.PAGE2_FLOOD_Q6_Y, size: S, font });

  // Not-working explanation text
  p2.drawText("AUDIT: Not working explanation box — checking wrap and position.", {
    x: raw.PAGE2_NOT_WORKING_BOX.x,
    y: raw.PAGE2_NOT_WORKING_BOX.yTop,
    size: 10,
    font,
  });

  // ─────────────────────────────────────────────
  // PAGE 3
  // ─────────────────────────────────────────────

  const p3 = pages[2];

  p3.drawText("123 Audit Lane, Oklahoma City, OK 73101", {
    x: raw.PROPERTY_IDENTIFIER_HEADER.x,
    y: raw.PROPERTY_IDENTIFIER_HEADER.y,
    size: raw.PROPERTY_IDENTIFIER_HEADER.fontSize,
    font,
  });

  // Questions Q7–Q38 (skip Q16 — no checkbox) — YES + NO both
  Object.entries(raw.PAGE3_ROW_Y).forEach(([keyStr, y]) => {
    const qNum = Number(keyStr);
    if (qNum === 16) return; // no checkbox
    p3.drawText("X", { x: raw.PAGE3_YES_NO_COLUMNS.YES, y, size: S, font });
    p3.drawText("X", { x: raw.PAGE3_YES_NO_COLUMNS.NO,  y, size: S, font });
  });

  // Q16 text fields
  p3.drawText("15 years", { x: raw.PAGE3_Q16_ROOF_AGE.x,    y: raw.PAGE3_Q16_ROOF_AGE.y,    size: 10, font });
  p3.drawText("3",        { x: raw.PAGE3_Q16_ROOF_LAYERS.x, y: raw.PAGE3_Q16_ROOF_LAYERS.y, size: 10, font });
  p3.drawText("200",      { x: raw.PAGE3_Q19_TERMITE_COST.x, y: raw.PAGE3_Q19_TERMITE_COST.y, size: 10, font });

  // Q37 inline — both options
  const q37Y = raw.PAGE3_ROW_Y[37] - raw.PAGE3_Q37_INLINE.offsetFromRow;
  p3.drawText("X", { x: raw.PAGE3_Q37_INLINE.firstX,                                   y: q37Y, size: S, font });
  p3.drawText("X", { x: raw.PAGE3_Q37_INLINE.firstX + raw.PAGE3_Q37_INLINE.deltaToSecond, y: q37Y, size: S, font });

  // ─────────────────────────────────────────────
  // PAGE 4
  // ─────────────────────────────────────────────

  const p4 = pages[3];

  p4.drawText("123 Audit Lane, Oklahoma City, OK 73101", {
    x: raw.PROPERTY_IDENTIFIER_HEADER.x,
    y: raw.PROPERTY_IDENTIFIER_HEADER.y,
    size: raw.PROPERTY_IDENTIFIER_HEADER.fontSize,
    font,
  });

  // Questions Q39–Q50 — YES + NO both
  Object.entries(raw.PAGE4_ROW_Y).forEach(([keyStr, y]) => {
    p4.drawText("X", { x: raw.PAGE4_YES_NO_COLUMNS.YES, y, size: S, font });
    p4.drawText("X", { x: raw.PAGE4_YES_NO_COLUMNS.NO,  y, size: S, font });
  });

  // Q41 payable type — all 3
  p4.drawText("X", { x: raw.PAGE4_Q41_PAYABLE.firstX,                                         y: raw.PAGE4_Q41_PAYABLE.y, size: S, font });
  p4.drawText("X", { x: raw.PAGE4_Q41_PAYABLE.firstX + raw.PAGE4_Q41_PAYABLE.deltaToSecond,   y: raw.PAGE4_Q41_PAYABLE.y, size: S, font });
  p4.drawText("X", { x: raw.PAGE4_Q41_PAYABLE.firstX + raw.PAGE4_Q41_PAYABLE.deltaToThird,    y: raw.PAGE4_Q41_PAYABLE.y, size: S, font });

  // Q41 unpaid — YES + NO
  p4.drawText("X", { x: raw.PAGE4_Q41_UNPAID.firstX,                                   y: raw.PAGE4_Q41_UNPAID.y, size: S, font });
  p4.drawText("X", { x: raw.PAGE4_Q41_UNPAID.firstX + raw.PAGE4_Q41_UNPAID.deltaToSecond, y: raw.PAGE4_Q41_UNPAID.y, size: S, font });

  // Q41 text fields
  p4.drawText("$400",         { x: raw.PAGE4_TEXT_FIELDS.q41AmountOfDues.x,    y: raw.PAGE4_TEXT_FIELDS.q41AmountOfDues.y,    size: 10, font });
  p4.drawText("$1500",        { x: raw.PAGE4_TEXT_FIELDS.q41SpecialAssessment.x, y: raw.PAGE4_TEXT_FIELDS.q41SpecialAssessment.y, size: 10, font });
  p4.drawText("$999",         { x: raw.PAGE4_TEXT_FIELDS.q41IfYesAmount.x,     y: raw.PAGE4_TEXT_FIELDS.q41IfYesAmount.y,     size: 10, font });
  p4.drawText("Audit Mgr",    { x: raw.PAGE4_TEXT_FIELDS.q41ManagerName.x,     y: raw.PAGE4_TEXT_FIELDS.q41ManagerName.y,     size: 10, font });
  p4.drawText("555-9999",     { x: raw.PAGE4_TEXT_FIELDS.q41Phone.x,           y: raw.PAGE4_TEXT_FIELDS.q41Phone.y,           size: 10, font });

  // Q46 payable type — all 3
  p4.drawText("X", { x: raw.PAGE4_Q46_PAYABLE.firstX,                                         y: raw.PAGE4_Q46_PAYABLE.y, size: S, font });
  p4.drawText("X", { x: raw.PAGE4_Q46_PAYABLE.firstX + raw.PAGE4_Q46_PAYABLE.deltaToSecond,   y: raw.PAGE4_Q46_PAYABLE.y, size: S, font });
  p4.drawText("X", { x: raw.PAGE4_Q46_PAYABLE.firstX + raw.PAGE4_Q46_PAYABLE.deltaToThird,    y: raw.PAGE4_Q46_PAYABLE.y, size: S, font });

  // Q46 text fields
  p4.drawText("$500",       { x: raw.PAGE4_TEXT_FIELDS.q46Amount.x, y: raw.PAGE4_TEXT_FIELDS.q46Amount.y, size: 10, font });
  p4.drawText("City Audit", { x: raw.PAGE4_TEXT_FIELDS.q46PaidTo.x, y: raw.PAGE4_TEXT_FIELDS.q46PaidTo.y, size: 10, font });

  // Q47 utilities — all 4
  const q47Base = raw.PAGE4_Q47_UTILITIES.firstX;
  p4.drawText("X", { x: q47Base, y: raw.PAGE4_Q47_UTILITIES.y, size: S, font });
  raw.PAGE4_Q47_UTILITIES.deltas.forEach((d) => {
    p4.drawText("X", { x: q47Base + d, y: raw.PAGE4_Q47_UTILITIES.y, size: S, font });
  });

  // Q47 text fields
  p4.drawText("Co-op Audit", { x: raw.PAGE4_TEXT_FIELDS.q47IfOtherExplain.x,    y: raw.PAGE4_TEXT_FIELDS.q47IfOtherExplain.y,    size: 10, font });
  p4.drawText("$2000",       { x: raw.PAGE4_TEXT_FIELDS.q47InitialMembership.x, y: raw.PAGE4_TEXT_FIELDS.q47InitialMembership.y, size: 10, font });
  p4.drawText("$500",        { x: raw.PAGE4_TEXT_FIELDS.q47AnnualMembership.x,  y: raw.PAGE4_TEXT_FIELDS.q47AnnualMembership.y,  size: 10, font });

  // ─────────────────────────────────────────────
  // PAGE 5
  // ─────────────────────────────────────────────

  const p5 = pages[4];

  // Additional pages — YES + NO
  p5.drawText("X", { x: raw.PAGE5_ADDITIONAL_PAGES.yesX, y: raw.PAGE5_ADDITIONAL_PAGES.y, size: S, font });
  p5.drawText("X", { x: raw.PAGE5_ADDITIONAL_PAGES.noX,  y: raw.PAGE5_ADDITIONAL_PAGES.y, size: S, font });
  p5.drawText("3", { x: raw.PAGE5_ADDITIONAL_PAGES.howManyX, y: raw.PAGE5_ADDITIONAL_PAGES.y, size: 10, font });

  // ─────────────────────────────────────────────
  // WRITE OUTPUT
  // ─────────────────────────────────────────────

  const finalBytes = await pdfDoc.save();
  const outputPath = path.join(
    process.cwd(),
    "src/forms/orec/2026/output-AUDIT-ALL-BOXES.pdf"
  );
  fs.writeFileSync(outputPath, Buffer.from(finalBytes));
  console.log(`✅ Audit PDF written to: ${outputPath}`);
  console.log("Every possible X is drawn. Compare each against its printed box.");
}

run().catch((e) => {
  console.error("❌ Failed:", e.message);
  console.error(e.stack);
});