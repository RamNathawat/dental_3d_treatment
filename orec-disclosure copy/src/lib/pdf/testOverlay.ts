import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts } from "pdf-lib";
import * as layout from "../../forms/orec/2026/layout";

async function runOverlay() {
  const templatePath = path.join(process.cwd(), "src/forms/orec/2026/template.pdf");
  const pdfBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();

  // --- PAGE 1 ---
  const p1 = pages[0];
  const resolveRowY = (i: number) => {
    const baseY = layout.APPLIANCE_FIRST_ROW_Y - i * layout.APPLIANCE_ROW_SPACING;
    return i === 9 ? 202.5 : (i > 9 ? baseY - 12.5 : baseY);
  };
  for (let i = 0; i < 19; i++) {
    const y = resolveRowY(i);
    [layout.APPLIANCE_COLUMNS.WORKING, layout.APPLIANCE_COLUMNS.NOT_WORKING, 
     layout.APPLIANCE_COLUMNS.DO_NOT_KNOW, layout.APPLIANCE_COLUMNS.NONE].forEach(x => drawX(p1, font, x, y));
  }

  // --- PAGE 2 ---
  const p2 = pages[1];
  Object.values(layout.PAGE2_ROW_Y).forEach(y => drawX(p2, font, layout.APPLIANCE_COLUMNS.WORKING, y));
  drawQuad(p2, font, layout.PAGE2_SECURITY_INLINE, layout.PAGE2_ROW_Y);
  drawTriple(p2, font, layout.PAGE2_SOLAR_INLINE, layout.PAGE2_ROW_Y);
  drawMulti(p2, font, layout.PAGE2_ZONING_Q1_ROW1);
  drawMulti(p2, font, layout.PAGE2_ZONING_Q1_ROW2);
  drawMulti(p2, font, layout.PAGE2_ZONING_Q2);
  drawMulti(p2, font, layout.PAGE2_FLOOD_Q3_MAIN);
  drawMulti(p2, font, layout.PAGE2_FLOOD_Q3_TYPES);
  drawMulti(p2, font, layout.PAGE2_FLOOD_Q3_MUNICIPAL);
  drawMulti(p2, font, layout.PAGE2_FLOOD_Q4);
  drawYesNo(p2, font, layout.PAGE2_FLOOD_Q5_Y, layout.PAGE2_FLOOD_VERTICAL_COLUMNS);
  drawYesNo(p2, font, layout.PAGE2_FLOOD_Q6_Y, layout.PAGE2_FLOOD_VERTICAL_COLUMNS);

  // --- PAGE 3 ---
  const p3 = pages[2];
  Object.entries(layout.PAGE3_ROW_Y).forEach(([key, y]) => {
    if (Number(key) !== 16) drawYesNo(p3, font, y, layout.PAGE3_YES_NO_COLUMNS);
  });
  const q37Y = layout.PAGE3_ROW_Y[37] - layout.PAGE3_Q37_INLINE.offsetFromRow;
  drawX(p3, font, layout.PAGE3_Q37_INLINE.firstX, q37Y);
  drawX(p3, font, layout.PAGE3_Q37_INLINE.firstX + layout.PAGE3_Q37_INLINE.deltaToSecond, q37Y);

  // --- PAGE 4 ---
  const p4 = pages[3];
  Object.values(layout.PAGE4_ROW_Y).forEach(y => drawYesNo(p4, font, y, layout.PAGE4_YES_NO_COLUMNS));
  drawTriple(p4, font, layout.PAGE4_Q41_PAYABLE);
  drawDouble(p4, font, layout.PAGE4_Q41_UNPAID);
  drawTriple(p4, font, layout.PAGE4_Q46_PAYABLE);
  drawMulti(p4, font, layout.PAGE4_Q47_UTILITIES);
  
  // PAGE 4 TEXT FIELDS
  drawTextVal(p4, font, "250", layout.PAGE4_TEXT_FIELDS.q41AmountOfDues);
  drawTextVal(p4, font, "100", layout.PAGE4_TEXT_FIELDS.q41SpecialAssessment);
  drawTextVal(p4, font, "500", layout.PAGE4_TEXT_FIELDS.q41IfYesAmount);
  drawTextVal(p4, font, "John Doe", layout.PAGE4_TEXT_FIELDS.q41ManagerName);
  drawTextVal(p4, font, "555-0199", layout.PAGE4_TEXT_FIELDS.q41Phone);
  drawTextVal(p4, font, "300", layout.PAGE4_TEXT_FIELDS.q46Amount);
  drawTextVal(p4, font, "City Dept", layout.PAGE4_TEXT_FIELDS.q46PaidTo);
  drawTextVal(p4, font, "Co-op", layout.PAGE4_TEXT_FIELDS.q47IfOtherExplain);
  drawTextVal(p4, font, "1000", layout.PAGE4_TEXT_FIELDS.q47InitialMembership);
  drawTextVal(p4, font, "350", layout.PAGE4_TEXT_FIELDS.q47AnnualMembership);
  
  drawMultiline(p4, font, "Explanation text goes here.", layout.PAGE4_EXPLANATION_BOX);
  drawTextVal(p4, font, "AB", { x: layout.PAGE4_INITIALS.buyerX, y: layout.PAGE4_INITIALS.y });
  drawTextVal(p4, font, "CD", { x: layout.PAGE4_INITIALS.sellerX, y: layout.PAGE4_INITIALS.y });

  // --- PAGE 5 ---
  const p5 = pages[4];
  drawX(p5, font, layout.PAGE5_YES_NO.firstX, layout.PAGE5_YES_NO.y);
  drawX(p5, font, layout.PAGE5_YES_NO.firstX + layout.PAGE5_YES_NO.deltaToSecond, layout.PAGE5_YES_NO.y);
  
  drawTextVal(p5, font, "Sig: Seller", layout.PAGE5_SIGNATURES.seller1);
  drawTextVal(p5, font, "Sig: Seller2", layout.PAGE5_SIGNATURES.seller2);
  drawTextVal(p5, font, "Sig: Buyer", layout.PAGE5_SIGNATURES.buyer1);
  drawTextVal(p5, font, "Sig: Buyer2", layout.PAGE5_SIGNATURES.buyer2);
  
  drawTextVal(p5, font, "AB", { x: layout.PAGE5_INITIALS.buyerX, y: layout.PAGE5_INITIALS.y });
  drawTextVal(p5, font, "CD", { x: layout.PAGE5_INITIALS.sellerX, y: layout.PAGE5_INITIALS.y });

  const outputPath = path.join(process.cwd(), "src/forms/orec/2026/test-overlay.pdf");
  fs.writeFileSync(outputPath, await pdfDoc.save());
}

// HELPERS
function drawX(p: any, f: any, x: number, y: number) { p.drawText("X", { x, y, size: layout.CHECKBOX_SIZE, font: f }); }
function drawYesNo(p: any, f: any, y: number, c: any) { drawX(p, f, c.YES, y); drawX(p, f, c.NO, y); }
function drawTriple(p: any, f: any, c: any, rm?: any) { const y = rm ? rm[c.rowIndex] : c.y; drawX(p, f, c.firstX, y); drawX(p, f, c.firstX + c.deltaToSecond, y); drawX(p, f, c.firstX + c.deltaToThird, y); }
function drawQuad(p: any, f: any, c: any, rm: any) { const y = rm[c.rowIndex]; drawX(p, f, c.firstX, y); drawX(p, f, c.firstX + c.deltaToSecond, y); drawX(p, f, c.firstX + c.deltaToThird, y); drawX(p, f, c.firstX + c.deltaToFourth, y); }
function drawDouble(p: any, f: any, c: any) { drawX(p, f, c.firstX, c.y); drawX(p, f, c.firstX + c.deltaToSecond, c.y); }
function drawMulti(p: any, f: any, c: any) { drawX(p, f, c.firstX, c.y); c.deltas.forEach((d: number) => drawX(p, f, c.firstX + d, c.y)); }
function drawTextVal(p: any, f: any, v: string, pos: any) { p.drawText(v, { x: pos.x, y: pos.y, size: 10, font: f }); }
function drawMultiline(p: any, f: any, txt: string, box: any) { txt.split("\n").forEach((l, i) => p.drawText(l, { x: box.x, y: box.yTop - (i * box.lineHeight), size: 10, font: f })); }

runOverlay().catch(console.error);