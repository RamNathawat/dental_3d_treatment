import { PDFDocument, PDFPage, PDFFont } from "pdf-lib";
import * as raw from "../../../forms/orec/2026/layout";
import { DisclosureInput, ZoningType } from "../schema/disclosure.schema";
import { drawOverflowText } from "../utils/drawOverflowText";

function normalizeYesNo(value: unknown): "YES" | "NO" | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  if (value === "YES" || value === "NO") return value;
  if (value === 0 || value === "0") return "YES";
  if (value === 1 || value === "1") return "NO";
  const v = String(value).toUpperCase();
  return v === "YES" || v === "NO" ? (v as "YES" | "NO") : undefined;
}

const ZONING_X: Record<ZoningType, { y: number; x: number }> = {
  residential:        { y: raw.PAGE2_ZONING_Q1_ROW1.y, x: raw.PAGE2_ZONING_Q1_ROW1.firstX },
  commercial:         { y: raw.PAGE2_ZONING_Q1_ROW1.y, x: raw.PAGE2_ZONING_Q1_ROW1.firstX + raw.PAGE2_ZONING_Q1_ROW1.deltas[0] },
  historical:         { y: raw.PAGE2_ZONING_Q1_ROW1.y, x: raw.PAGE2_ZONING_Q1_ROW1.firstX + raw.PAGE2_ZONING_Q1_ROW1.deltas[1] },
  office:             { y: raw.PAGE2_ZONING_Q1_ROW1.y, x: raw.PAGE2_ZONING_Q1_ROW1.firstX + raw.PAGE2_ZONING_Q1_ROW1.deltas[2] },
  agricultural:       { y: raw.PAGE2_ZONING_Q1_ROW1.y, x: raw.PAGE2_ZONING_Q1_ROW1.firstX + raw.PAGE2_ZONING_Q1_ROW1.deltas[3] },
  industrial:         { y: raw.PAGE2_ZONING_Q1_ROW1.y, x: raw.PAGE2_ZONING_Q1_ROW1.firstX + raw.PAGE2_ZONING_Q1_ROW1.deltas[4] },
  urban_conservation: { y: raw.PAGE2_ZONING_Q1_ROW2.y, x: raw.PAGE2_ZONING_Q1_ROW2.firstX },
  other:              { y: raw.PAGE2_ZONING_Q1_ROW2.y, x: raw.PAGE2_ZONING_Q1_ROW2.firstX + raw.PAGE2_ZONING_Q1_ROW2.deltas[0] },
  unknown:            { y: raw.PAGE2_ZONING_Q1_ROW2.y, x: raw.PAGE2_ZONING_Q1_ROW2.firstX + raw.PAGE2_ZONING_Q1_ROW2.deltas[1] },
  no_zoning:          { y: raw.PAGE2_ZONING_Q1_ROW2.y, x: raw.PAGE2_ZONING_Q1_ROW2.firstX + raw.PAGE2_ZONING_Q1_ROW2.deltas[2] },
};

// The layout previously allowed 6 lines, but the 6th line's baseline (y ≈ 300) 
// overlaps the text of the "Zoning and Historical" heading just above the checkboxes (y=280).
// We restrict maxLines to 5 by raising the yBottom coordinate by one line height.
const NOT_WORKING_BOX_Y_BOTTOM = raw.PAGE2_NOT_WORKING_BOX.yTop - ((raw.PAGE2_NOT_WORKING_BOX.maxLines - 1) * raw.PAGE2_NOT_WORKING_BOX.lineHeight);

export function renderPage2(
  pages: PDFPage[],
  font: PDFFont,
  data: DisclosureInput,
  pdfDoc?: PDFDocument
) {
  const page = pages[1];

  // --------------------------------------------------
  // Appliance continuation grid (page 2 rows)
  // --------------------------------------------------
  if (data.appliances) {
    Object.entries(raw.PAGE2_ROW_Y).forEach(([keyStr, y]) => {
      const page2RowKey    = Number(keyStr);
      const applianceIndex = page2RowKey + 19;
      const status         = data.appliances![applianceIndex];
      if (!status) return;

      let x: number | undefined;
      switch (status) {
        case "WORKING":     x = raw.APPLIANCE_COLUMNS.WORKING;     break;
        case "NOT_WORKING": x = raw.APPLIANCE_COLUMNS.NOT_WORKING; break;
        case "UNKNOWN":     x = raw.APPLIANCE_COLUMNS.DO_NOT_KNOW; break;
        case "NONE":        x = raw.APPLIANCE_COLUMNS.NONE;        break;
      }
      if (typeof x === "number") page.drawText("X", { x, y, size: 11, font });
    });
  }

  // --------------------------------------------------
  // Security system inline (rowIndex 4)
  // --------------------------------------------------
  if (data.inlineOptions?.securitySystemType !== undefined && data.inlineOptions.securitySystemType !== null) {
    const securityY = raw.PAGE2_ROW_Y[4];
    const base      = raw.PAGE2_SECURITY_INLINE.firstX;
    const deltas    = [raw.PAGE2_SECURITY_INLINE.deltaToSecond, raw.PAGE2_SECURITY_INLINE.deltaToThird, raw.PAGE2_SECURITY_INLINE.deltaToFourth];
    const idx       = data.inlineOptions.securitySystemType - 1;
    const x         = data.inlineOptions.securitySystemType === 0 || typeof deltas[idx] !== "number" ? base : base + deltas[idx];
    if (!Number.isNaN(x)) page.drawText("X", { x, y: securityY, size: 11, font });
  }

  // --------------------------------------------------
  // Solar panels inline (rowIndex 17)
  // --------------------------------------------------
  if (data.inlineOptions?.solarPanelType !== undefined && data.inlineOptions.solarPanelType !== null) {
    const solarY = raw.PAGE2_ROW_Y[17];
    const base   = raw.PAGE2_SOLAR_INLINE.firstX;
    const deltas = [raw.PAGE2_SOLAR_INLINE.deltaToSecond, raw.PAGE2_SOLAR_INLINE.deltaToThird];
    const idx    = data.inlineOptions.solarPanelType - 1;
    const x      = data.inlineOptions.solarPanelType === 0 || typeof deltas[idx] !== "number" ? base : base + deltas[idx];
    if (!Number.isNaN(x)) page.drawText("X", { x, y: solarY, size: 11, font });
  }

  // --------------------------------------------------
  // Generators inline (rowIndex 18)
  // --------------------------------------------------
  if (data.inlineOptions?.generatorType !== undefined && data.inlineOptions.generatorType !== null) {
    const generatorY = raw.PAGE2_ROW_Y[18];
    const base       = raw.PAGE2_GENERATORS_INLINE.firstX;
    const deltas     = [raw.PAGE2_GENERATORS_INLINE.deltaToSecond, raw.PAGE2_GENERATORS_INLINE.deltaToThird];
    const idx        = data.inlineOptions.generatorType - 1;
    const x          = data.inlineOptions.generatorType === 0 || typeof deltas[idx] !== "number" ? base : base + deltas[idx];
    if (!Number.isNaN(x)) page.drawText("X", { x, y: generatorY, size: 11, font });
  }

  // --------------------------------------------------
  // Source of Household Water inline (rowIndex 19)
  // --------------------------------------------------
  if (data.inlineOptions?.waterSourceType !== undefined && data.inlineOptions.waterSourceType !== null) {
    const waterSourceY = raw.PAGE2_ROW_Y[19];
    const base         = raw.PAGE2_WATER_SOURCE_INLINE.firstX;
    const deltas       = [raw.PAGE2_WATER_SOURCE_INLINE.deltaToSecond, raw.PAGE2_WATER_SOURCE_INLINE.deltaToThird];
    const idx          = data.inlineOptions.waterSourceType - 1;
    const x            = data.inlineOptions.waterSourceType === 0 || typeof deltas[idx] !== "number" ? base : base + deltas[idx];
    if (!Number.isNaN(x)) page.drawText("X", { x, y: waterSourceY, size: 11, font });
  }

  // --------------------------------------------------
  // Fire Suppression System date
  // --------------------------------------------------
  if (data.inlineOptions?.fireSuppressionDate) {
    page.drawText(data.inlineOptions.fireSuppressionDate, {
      x: raw.PAGE2_FIRE_SUPPRESSION_DATE.x,
      y: raw.PAGE2_FIRE_SUPPRESSION_DATE.y,
      size: 10,
      font,
    });
  }

  // --------------------------------------------------
  // Page 2 "Not Working" explanation box
  // Uses drawOverflowText with the CORRECT yBottom so lines
  // never cross into the Zoning section below.
  // --------------------------------------------------
  const notWorkingText = [
    data.page1NotWorkingExplanation,
    data.page2NotWorkingExplanation,
  ]
    .filter(Boolean)
    .join("\n")
    .trim();

  if (notWorkingText) {
    const box = raw.PAGE2_NOT_WORKING_BOX;

    drawOverflowText({
      pdfDoc,
      page,
      font,
      text:       notWorkingText,
      x:          box.x,
      yTop:       box.yTop,
      yBottom:    NOT_WORKING_BOX_Y_BOTTOM,
      maxWidth:   box.width,
      size:       10,
      lineHeight: box.lineHeight,
      continuationHeader: "Oklahoma RPCD Disclosure — Not Working Details (Continued)",
    });
  }

  // --------------------------------------------------
  // Zoning Q1
  // --------------------------------------------------
  const zoningType = data.page2Zoning?.zoningType ?? (data as any).zoningType;
  if (zoningType) {
    const coord = ZONING_X[zoningType as ZoningType];
    if (coord) page.drawText("X", { x: coord.x, y: coord.y, size: 11, font });
  }

  // --------------------------------------------------
  // Zoning Q2 — historical district (0=YES, 1=NO, 2=UNKNOWN)
  // --------------------------------------------------
  if (data.page2Zoning?.historicalDistrict !== undefined && data.page2Zoning.historicalDistrict !== null) {
    const val = Number(data.page2Zoning.historicalDistrict);
    const x   = val === 0 ? raw.PAGE2_ZONING_Q2.firstX
              : val === 1 ? raw.PAGE2_ZONING_Q2.firstX + raw.PAGE2_ZONING_Q2.deltas[0]
              :             raw.PAGE2_ZONING_Q2.firstX + (raw.PAGE2_ZONING_Q2.deltas[1] || 0);
    if (!Number.isNaN(x)) page.drawText("X", { x, y: raw.PAGE2_ZONING_Q2.y, size: 11, font });
  }

  // --------------------------------------------------
  // Flood Q3 Main (0=YES, 1=NO, 2=UNKNOWN)
  // --------------------------------------------------
  if (data.page2Flood?.q3Main !== undefined && data.page2Flood.q3Main !== null) {
    const val = Number(data.page2Flood.q3Main);
    const x   = val === 0 ? raw.PAGE2_FLOOD_Q3_MAIN.firstX
              : val === 1 ? raw.PAGE2_FLOOD_Q3_MAIN.firstX + raw.PAGE2_FLOOD_Q3_MAIN.deltas[0]
              :             raw.PAGE2_FLOOD_Q3_MAIN.firstX + (raw.PAGE2_FLOOD_Q3_MAIN.deltas[1] || 0);
    if (!Number.isNaN(x)) page.drawText("X", { x, y: raw.PAGE2_FLOOD_Q3_MAIN.y, size: 11, font });
  }

  // --------------------------------------------------
  // Flood Q3 Types
  // --------------------------------------------------
  if (data.page2Flood?.q3Types) {
    data.page2Flood.q3Types.forEach((index) => {
      const numIndex = Number(index);
      if (Number.isNaN(numIndex)) return;
      let x = raw.PAGE2_FLOOD_Q3_TYPES.firstX;
      if (numIndex > 0) {
        const d = raw.PAGE2_FLOOD_Q3_TYPES.deltas[numIndex - 1];
        if (typeof d === "number") x += d;
      }
      if (!Number.isNaN(x)) page.drawText("X", { x, y: raw.PAGE2_FLOOD_Q3_TYPES.y, size: 11, font });
    });
  }

  // --------------------------------------------------
  // Flood Q3 Municipal (0=YES, 1=NO, 2=UNKNOWN)
  // --------------------------------------------------
  if (data.page2Flood?.q3Municipal !== undefined && data.page2Flood.q3Municipal !== null) {
    const val = Number(data.page2Flood.q3Municipal);
    const x   = val === 0 ? raw.PAGE2_FLOOD_Q3_MUNICIPAL.firstX
              : val === 1 ? raw.PAGE2_FLOOD_Q3_MUNICIPAL.firstX + raw.PAGE2_FLOOD_Q3_MUNICIPAL.deltas[0]
              :             raw.PAGE2_FLOOD_Q3_MUNICIPAL.firstX + (raw.PAGE2_FLOOD_Q3_MUNICIPAL.deltas[1] || 0);
    if (!Number.isNaN(x)) page.drawText("X", { x, y: raw.PAGE2_FLOOD_Q3_MUNICIPAL.y, size: 11, font });
  }

  // --------------------------------------------------
  // Flood Q4 (0=YES, 1=NO, 2=UNKNOWN)
  // --------------------------------------------------
  if (data.page2Flood?.q4 !== undefined && data.page2Flood.q4 !== null) {
    const val = Number(data.page2Flood.q4);
    const x   = val === 0 ? raw.PAGE2_FLOOD_Q4.firstX
              : val === 1 ? raw.PAGE2_FLOOD_Q4.firstX + raw.PAGE2_FLOOD_Q4.deltas[0]
              :             raw.PAGE2_FLOOD_Q4.firstX + (raw.PAGE2_FLOOD_Q4.deltas[1] || 0);
    if (!Number.isNaN(x)) page.drawText("X", { x, y: raw.PAGE2_FLOOD_Q4.y, size: 11, font });
  }

  // --------------------------------------------------
  // Flood Q5 — ALWAYS rendered (not conditional)
  // --------------------------------------------------
  if (data.page2Flood?.q5 !== undefined && data.page2Flood?.q5 !== null) {
    const v = normalizeYesNo(data.page2Flood.q5);
    const x = v === "YES" ? raw.PAGE2_FLOOD_VERTICAL_COLUMNS.YES : v === "NO" ? raw.PAGE2_FLOOD_VERTICAL_COLUMNS.NO : undefined;
    if (x !== undefined) page.drawText("X", { x, y: raw.PAGE2_FLOOD_Q5_Y, size: 11, font });
  }

  // --------------------------------------------------
  // Flood Q6 — ALWAYS rendered (not conditional)
  // --------------------------------------------------
  if (data.page2Flood?.q6 !== undefined && data.page2Flood?.q6 !== null) {
    const v = normalizeYesNo(data.page2Flood.q6);
    const x = v === "YES" ? raw.PAGE2_FLOOD_VERTICAL_COLUMNS.YES : v === "NO" ? raw.PAGE2_FLOOD_VERTICAL_COLUMNS.NO : undefined;
    if (x !== undefined) page.drawText("X", { x, y: raw.PAGE2_FLOOD_Q6_Y, size: 11, font });
  }
}