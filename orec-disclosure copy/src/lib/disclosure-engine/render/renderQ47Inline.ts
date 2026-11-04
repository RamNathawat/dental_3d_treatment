import { PDFPage, PDFFont } from "pdf-lib";
import * as raw from "../../../forms/orec/2026/layout";
import { DisclosureInput } from "../schema/disclosure.schema";

export function renderQ47Inline(
  pages: PDFPage[],
  font: PDFFont,
  data: DisclosureInput
) {
  if (!data.q47Details) return;

  const page = pages[3];

  // --------------------------------------------------
  // Utilities checkboxes
  // --------------------------------------------------
  if (data.q47Details.utilities) {
    const base = raw.PAGE4_Q47_UTILITIES.firstX;
    const deltas = raw.PAGE4_Q47_UTILITIES.deltas;
    const y = raw.PAGE4_Q47_UTILITIES.y;

    data.q47Details.utilities.forEach((index) => {
      const numericIndex = Number(index);
      if (Number.isNaN(numericIndex)) return;
      let x = base;
      if (numericIndex > 0) {
        const d = deltas[numericIndex - 1];
        if (typeof d === "number") x += d;
      }
      if (!Number.isNaN(x)) page.drawText("X", { x, y, size: 11, font });
    });
  }

  // --------------------------------------------------
  // Other Explain
  // --------------------------------------------------
  if (data.q47Details.otherExplain) {
    page.drawText(data.q47Details.otherExplain, {
      x: raw.PAGE4_TEXT_FIELDS.q47IfOtherExplain.x,
      y: raw.PAGE4_TEXT_FIELDS.q47IfOtherExplain.y,
      size: 10,
      font,
    });
  }

  // --------------------------------------------------
  // Initial Membership Fee
  // --------------------------------------------------
  if (data.q47Details.initialMembership) {
    page.drawText(data.q47Details.initialMembership, {
      x: raw.PAGE4_TEXT_FIELDS.q47InitialMembership.x,
      y: raw.PAGE4_TEXT_FIELDS.q47InitialMembership.y,
      size: 10,
      font,
    });
  }

  // --------------------------------------------------
  // Annual Membership Fee
  // --------------------------------------------------
  if (data.q47Details.annualMembership) {
    page.drawText(data.q47Details.annualMembership, {
      x: raw.PAGE4_TEXT_FIELDS.q47AnnualMembership.x,
      y: raw.PAGE4_TEXT_FIELDS.q47AnnualMembership.y,
      size: 10,
      font,
    });
  }
}