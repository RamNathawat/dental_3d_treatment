import { PDFDocument, PDFPage, PDFFont } from "pdf-lib";
import { EXPLANATION_LAYOUT } from "../layout/rpcd_2026.semantic";
import { DisclosureInput } from "../schema/disclosure.schema";
import { drawOverflowText } from "../utils/drawOverflowText";

/**
 * IMPORTANT:
 *
 * Use ONLY:
 * - page1NotWorkingExplanation
 * - page2NotWorkingExplanation
 *
 * for appliance explanations.
 *
 * Do NOT render applianceComments separately,
 * otherwise comments get printed twice.
 */

function buildUnifiedExplanation(data: any): string {
  /**
   * CRITICAL FIX:
   *
   * Only render true additional-page explanation here.
   *
   * DO NOT render:
   * - questionComments
   * - systemComments
   * - page1NotWorkingExplanation
   * - page2NotWorkingExplanation
   *
   * Those are already rendered directly
   * inside the actual form pages.
   *
   * Rendering them here causes:
   * - duplicate comments
   * - duplicate overflow page
   * - repeated appliance comments
   * - repeated Q comments
   */

  if (data.explanation?.trim()) {
    return data.explanation.trim();
  }

  return "";
}

export function renderExplanations(
  pages: PDFPage[],
  font: PDFFont,
  data: DisclosureInput,
  pdfDoc?: PDFDocument
) {
  const text = buildUnifiedExplanation(data);

  if (!text.trim()) return;

  const layout = EXPLANATION_LAYOUT.explanation;
  const page = pages[layout.page - 1];

  if (!page) return;

  drawOverflowText({
    pdfDoc,
    page,
    font,
    text,

    x: layout.x,
    yTop: layout.yTop,
    yBottom: 40,
    maxWidth: layout.width,

    size: 10,
    lineHeight: layout.lineHeight,

    continuationHeader:
      "Oklahoma RPCD Disclosure — Continued",
  });
}