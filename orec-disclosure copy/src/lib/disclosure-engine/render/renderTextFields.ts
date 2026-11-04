import { PDFPage, PDFFont } from "pdf-lib";
import { DisclosureInput } from "../schema/disclosure.schema";
import { TEXT_LAYOUT } from "../layout/rpcd_2026.semantic";
import { flattenObject } from "../utils/flatten";

export function renderTextFields(
  pages: PDFPage[],
  font: PDFFont,
  data: DisclosureInput
) {
  const flat = flattenObject(data);

  for (const [path, layout] of Object.entries(TEXT_LAYOUT)) {
    const value = flat[path];
    if (!value) continue;

    const page = pages[layout.page - 1];
    if (!page) continue;

    const x = Number(layout.x);
    const y = Number(layout.y);
    const size = Number(layout.fontSize);

    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;

    page.drawText(String(value), {
      x,
      y,
      size: Number.isFinite(size) ? size : 10,
      font,
    });
  }
}