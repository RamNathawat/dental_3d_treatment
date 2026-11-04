import { PDFPage, PDFFont } from "pdf-lib";
import * as raw from "../../../forms/orec/2026/layout";
import { DisclosureInput } from "../schema/disclosure.schema";

const n = (value: unknown, fallback: number) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

export function renderPropertyIdentifier(
  pages: PDFPage[],
  font: PDFFont,
  data: DisclosureInput
) {
  if (!data.propertyIdentifier) return;

  const headerX = n(raw.PROPERTY_IDENTIFIER_HEADER?.x, 50);
  const headerY = n(raw.PROPERTY_IDENTIFIER_HEADER?.y, 750);
  const headerSize = n(raw.PROPERTY_IDENTIFIER_HEADER?.fontSize, 10);

  const bodyX = n(raw.PROPERTY_IDENTIFIER_PAGE1?.x, 50);
  const bodyY = n(raw.PROPERTY_IDENTIFIER_PAGE1?.y, 700);
  const bodySize = n(raw.PROPERTY_IDENTIFIER_PAGE1?.fontSize, 10);

  pages[0]?.drawText(data.propertyIdentifier, {
    x: headerX,
    y: headerY,
    size: headerSize,
    font,
  });

  pages[0]?.drawText(data.propertyIdentifier, {
    x: bodyX,
    y: bodyY,
    size: bodySize,
    font,
  });

  pages.slice(1).forEach((page) => {
    page.drawText(data.propertyIdentifier!, {
      x: headerX,
      y: headerY,
      size: headerSize,
      font,
    });
  });

  if (data.sellerOccupying !== undefined) {
    const checkX =
      data.sellerOccupying === 0
        ? n(raw.SELLER_OCCUPYING?.occupyingX, 400)
        : n(raw.SELLER_OCCUPYING?.notOccupyingX, 460);

    const checkY = n(raw.SELLER_OCCUPYING?.y, 650);

    pages[0]?.drawText("X", {
      x: checkX,
      y: checkY,
      size: n(raw.CHECKBOX_SIZE, 11),
      font,
    });
  }
}