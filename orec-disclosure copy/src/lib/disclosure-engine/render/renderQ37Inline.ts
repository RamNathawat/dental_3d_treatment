import { PDFPage, PDFFont } from "pdf-lib";
import * as raw from "../../../forms/orec/2026/layout";
import { DisclosureInput } from "../schema/disclosure.schema";

export function renderQ37Inline(
  pages: PDFPage[],
  font: PDFFont,
  data: DisclosureInput
) {
  if (data.q37Inline === undefined) return;

  const page = pages[2];

  const y =
    raw.PAGE3_ROW_Y[37] - raw.PAGE3_Q37_INLINE.offsetFromRow;

  const x =
    data.q37Inline === 0
      ? raw.PAGE3_Q37_INLINE.firstX
      : raw.PAGE3_Q37_INLINE.firstX +
        raw.PAGE3_Q37_INLINE.deltaToSecond;

  if (!Number.isNaN(x)) page.drawText("X", { x, y, size: 11, font });
}