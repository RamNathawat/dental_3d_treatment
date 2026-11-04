import { PDFPage, PDFFont } from "pdf-lib";
import * as raw from "../../../forms/orec/2026/layout";
import { DisclosureInput } from "../schema/disclosure.schema";

export function renderQuestions(
  pages: PDFPage[],
  font: PDFFont,
  data: DisclosureInput
) {
  if (!data.questions) return;

  Object.entries(data.questions).forEach(([key, value]) => {
    // ✅ skip null/undefined entries (sparse array gaps)
    if (value === null || value === undefined) return;

    const qNum = Number(key);

    if (qNum >= 7 && qNum <= 38) {
      const y = raw.PAGE3_ROW_Y[qNum];
      if (!y) return;

      // Q16 has no Yes/No checkbox — skip it
      if (qNum === 16) return;

      const x =
        value === "YES"
          ? raw.PAGE3_YES_NO_COLUMNS.YES
          : raw.PAGE3_YES_NO_COLUMNS.NO;

      pages[2].drawText("X", { x, y, size: 11, font });
    }

    if (qNum >= 39 && qNum <= 50) {
      const y = raw.PAGE4_ROW_Y[qNum];
      if (!y) return;

      const x =
        value === "YES"
          ? raw.PAGE4_YES_NO_COLUMNS.YES
          : raw.PAGE4_YES_NO_COLUMNS.NO;

      pages[3].drawText("X", { x, y, size: 11, font });
    }
  });

  // Q16 text fields — roof age and layers
  if (data.page3TextFields?.roofAge) {
    pages[2].drawText(data.page3TextFields.roofAge, {
      x: raw.PAGE3_Q16_ROOF_AGE.x,
      y: raw.PAGE3_Q16_ROOF_AGE.y,
      size: 10,
      font,
    });
  }

  if (data.page3TextFields?.roofLayers) {
    pages[2].drawText(data.page3TextFields.roofLayers, {
      x: raw.PAGE3_Q16_ROOF_LAYERS.x,
      y: raw.PAGE3_Q16_ROOF_LAYERS.y,
      size: 10,
      font,
    });
  }

  // Q19 termite bait annual cost
  if (data.page3TextFields?.termiteBaitAnnualCost) {
    pages[2].drawText(data.page3TextFields.termiteBaitAnnualCost, {
      x: raw.PAGE3_Q19_TERMITE_COST.x,
      y: raw.PAGE3_Q19_TERMITE_COST.y,
      size: 10,
      font,
    });
  }
}