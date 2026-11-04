import { PDFPage, PDFFont } from "pdf-lib";
import { DisclosureInput } from "../schema/disclosure.schema";
import { CHECKBOX_LAYOUT } from "../layout/rpcd_2026.semantic";
import { flattenObject } from "../utils/flatten";

export function renderCheckboxes(
  pages: PDFPage[],
  font: PDFFont,
  data: DisclosureInput
) {
  const flat = flattenObject(data);

  for (const [path, layout] of Object.entries(CHECKBOX_LAYOUT)) {
    const value = flat[path];
    if (!value) continue;

    const page = pages[layout.page];

    if (value === "YES") {
      page.drawText("X", {
        x: layout.yesX,
        y: layout.y,
        size: 11,
        font,
      });
    }

    if (value === "NO") {
      page.drawText("X", {
        x: layout.noX,
        y: layout.y,
        size: 11,
        font,
      });
    }
  }
}