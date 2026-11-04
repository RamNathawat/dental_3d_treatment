import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts } from "pdf-lib";

import { DisclosureInput } from "./schema/disclosure.schema";
import { validateDisclosureInput } from "./validation/validateDisclosure";

import { renderPropertyIdentifier } from "./render/renderPropertyIdentifier";
import { renderAppliances } from "./render/renderAppliances";
import { renderInlineOptions } from "./render/renderInlineOptions";
import { renderSewerInline } from "./render/renderSewerInline";
import { renderPage2 } from "./render/renderPage2";
import { renderQuestions } from "./render/renderQuestions";
import { renderQ37Inline } from "./render/renderQ37Inline";
import { renderQ41Q46Inline } from "./render/renderQ41Q46Inline";
import { renderQ47Inline } from "./render/renderQ47Inline";
import { renderCheckboxes } from "./render/renderCheckboxes";
import { renderTextFields } from "./render/renderTextFields";
import { renderExplanations } from "./render/renderExplanations";
import { renderSignatures } from "./render/renderSignatures";

const TEMPLATE_PAGE_COUNT = 5;

export async function generateDisclosurePDF(
  data: DisclosureInput
): Promise<Buffer> {
  if (data.version !== "01-01-2026") {
    throw new Error("Unsupported disclosure version");
  }

  validateDisclosureInput(data);

  const templatePath = path.join(
    process.cwd(),
    "src/forms/orec/2026/template.pdf"
  );

  const templateBytes = fs.readFileSync(templatePath);
  const pdfDoc        = await PDFDocument.load(templateBytes);
  const font          = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages         = pdfDoc.getPages();

  /**
   * 1) Broad global renderers FIRST.
   *    Both explanation boxes receive pdfDoc so overflow text
   *    is automatically spilled onto appended continuation pages
   *    instead of being clipped.
   */
  renderCheckboxes(pages, font, data);
  renderTextFields(pages, font, data);
  renderExplanations(pages, font, data, pdfDoc);  // Page 4 explanation box

  /**
   * 2) Precise page renderers AFTER.
   */

  // PAGE 1
  renderPropertyIdentifier(pages, font, data);
  renderAppliances(pages, font, data);
  renderInlineOptions(pages, font, data);
  renderSewerInline(pages, font, data);

  // PAGE 2 — pass pdfDoc so the "not working" box also overflows cleanly
  renderPage2(pages, font, data, pdfDoc);

  // PAGES 3–4
  renderQuestions(pages, font, data);
  renderQ37Inline(pages, font, data);
  renderQ41Q46Inline(pages, font, data);
  renderQ47Inline(pages, font, data);

  /**
   * 3) Derive the real continuation page count NOW, after all overflow
   *    renderers have run and appended their pages.  This is the ground
   *    truth the page-5 checkbox must reflect — never trust the value
   *    the client sent, because the client estimates based on character
   *    counts while the server knows the actual rendered page count.
   */
  const continuationPageCount = pdfDoc.getPageCount() - TEMPLATE_PAGE_COUNT;
  const hasActualContinuation = continuationPageCount > 0;

  // Patch data so renderSignatures writes the correct YES/NO and count.
  const patchedData: DisclosureInput = {
    ...data,
    additionalPages: {
      hasAdditionalPages: hasActualContinuation ? "YES" : "NO",
      howMany: hasActualContinuation ? String(continuationPageCount) : "",
    },
  };

  /**
   * 4) Signatures LAST.
   *    Re-fetch pages after explanation/not-working overflow may have
   *    added continuation pages, so renderSignatures still targets
   *    the correct original page 5.
   */
  const updatedPages = pdfDoc.getPages();
  await renderSignatures(pdfDoc, updatedPages, font, patchedData);

  const finalBytes = await pdfDoc.save();
  return Buffer.from(finalBytes);
}