import { PDFPage, PDFFont } from "pdf-lib";
import * as raw from "../../../forms/orec/2026/layout";
import { DisclosureInput } from "../schema/disclosure.schema";

export function renderSewerInline(
  pages: PDFPage[],
  font: PDFFont,
  data: DisclosureInput
) {
  if (!data.sewerSystem) return;

  const page = pages[0];

  // ----------------------------
  // Public / Private
  // ----------------------------
  if (data.sewerSystem.type !== undefined) {
    const y = raw.SEWER_INLINE.y;

    const x =
      data.sewerSystem.type === 0
        ? raw.SEWER_INLINE.publicX
        : raw.SEWER_INLINE.publicX +
          raw.SEWER_INLINE.deltaToPrivate;

    if (!Number.isNaN(x)) {
      page.drawText("X", {
        x,
        y,
        size: raw.SEWER_INLINE.size,
        font,
      });
    }
  }

  // ----------------------------
  // Private subtype
  // ----------------------------
  if (
    data.sewerSystem.type === 1 &&
    data.sewerSystem.privateType !== undefined
  ) {
    const septicY = raw.SEPTIC_INLINE.y;

    let x = raw.SEPTIC_INLINE.firstX;

    if (data.sewerSystem.privateType === 1) {
      x =
        raw.SEPTIC_INLINE.firstX +
        raw.SEPTIC_INLINE.deltaToSecond;
    }

    if (data.sewerSystem.privateType === 2) {
      x =
        raw.SEPTIC_INLINE.firstX +
        raw.SEPTIC_INLINE.deltaToThird;
    }

    if (!Number.isNaN(x)) {
      page.drawText("X", {
        x,
        y: septicY,
        size: raw.SEPTIC_INLINE.size,
        font,
      });
    }
  }
}