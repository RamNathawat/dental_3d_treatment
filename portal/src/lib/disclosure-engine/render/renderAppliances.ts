import { PDFPage, PDFFont } from "pdf-lib";
import * as raw from "../../../forms/orec/2026/layout";
import { DisclosureInput } from "../schema/disclosure.schema";

export function renderAppliances(
  pages: PDFPage[],
  font: PDFFont,
  data: DisclosureInput
) {
  if (!data.appliances) return;

  const resolveRowY = (i: number) => {
    const baseY =
      raw.APPLIANCE_FIRST_ROW_Y - i * raw.APPLIANCE_ROW_SPACING;
    return i === 9 ? 202.5 : i > 9 ? baseY - 12.5 : baseY;
  };

  Object.entries(data.appliances).forEach(([key, status]) => {
    const rowIndex = Number(key);

    // Page 1 owns appliance indexes 0–18 (PDF rows 0–18).
    // Indexes 19+ belong to page 2 (Step3AppliancesExtended) — skip here.
    if (rowIndex > 18) return;

    const y = resolveRowY(rowIndex);

    let x: number | undefined;
    switch (status) {
      case "WORKING":     x = raw.APPLIANCE_COLUMNS.WORKING; break;
      case "NOT_WORKING": x = raw.APPLIANCE_COLUMNS.NOT_WORKING; break;
      case "UNKNOWN":     x = raw.APPLIANCE_COLUMNS.DO_NOT_KNOW; break;
      case "NONE":        x = raw.APPLIANCE_COLUMNS.NONE; break;
    }

    if (typeof x !== "number") return;

    pages[0].drawText("X", {
      x,
      y,
      size: raw.CHECKBOX_SIZE,
      font,
    });
  });
}