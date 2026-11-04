import { PDFDocument, PDFPage, PDFFont, rgb } from "pdf-lib";

interface OverflowTextOptions {
  pdfDoc?: PDFDocument;
  page: PDFPage;           // the page containing the built-in box
  font: PDFFont;
  text: string;
  x: number;
  yTop: number;            // top Y of the box (pdf-lib coords: 0 = bottom)
  yBottom: number;         // bottom Y of the box — lines stop here
  maxWidth: number;
  size?: number;
  lineHeight?: number;
  continuationHeader?: string;  // e.g. "Oklahoma RPCD Disclosure — Continued"
}

/**
 * Word-wraps text into lines, draws as many as fit in the built-in box,
 * then appends new full-size pages to pdfDoc for any remaining lines.
 *
 * This replaces the old drawWrappedText calls that silently clipped overflow.
 */
export function drawOverflowText({
  pdfDoc,
  page,
  font,
  text,
  x,
  yTop,
  yBottom,
  maxWidth,
  size = 10,
  lineHeight = 14,
  continuationHeader = "Oklahoma RPCD Disclosure — Continued",
}: OverflowTextOptions): void {
  const content = String(text ?? "").trim();
  if (!content) return;

  // ── 1. Word-wrap into lines ─────────────────────────────────
  const allLines: string[] = [];

  for (const paragraph of content.split("\n")) {
    if (!paragraph.trim()) {
      allLines.push("");
      continue;
    }
    const words = paragraph.split(/\s+/);
    let current = "";
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) <= maxWidth) {
        current = test;
      } else {
        if (current) allLines.push(current);
        current = word;
      }
    }
    if (current) allLines.push(current);
  }

  // ── 2. How many lines fit in the built-in box? ──────────────
  const linesPerBox = Math.max(1, Math.floor((yTop - yBottom) / lineHeight));

  // ── 3. Draw first batch into the built-in box ───────────────
  const firstBatch = allLines.slice(0, linesPerBox);
  let currentY = yTop;

  for (const line of firstBatch) {
    if (line) {
      page.drawText(line, {
        x,
        y: currentY,
        size,
        font,
        color: rgb(0, 0, 0),
      });
    }
    currentY -= lineHeight;
  }

  // ── 4. Overflow → continuation pages ────────────────────────
  let remaining = allLines.slice(linesPerBox);
  if (remaining.length === 0 || !pdfDoc) return;

  const { width, height } = pages0Size(pdfDoc);

  const CONT_Y_TOP = height - 60;
  const CONT_Y_BOTTOM = 50;
  const linesPerCont = Math.max(1, Math.floor((CONT_Y_TOP - CONT_Y_BOTTOM) / lineHeight));

  while (remaining.length > 0) {
    const contPage = pdfDoc.addPage([width, height]);

    // Header
    contPage.drawText(continuationHeader, {
      x,
      y: CONT_Y_TOP + 20,
      size: 9,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });

    // Horizontal rule under header
    contPage.drawLine({
      start: { x, y: CONT_Y_TOP + 14 },
      end: { x: x + maxWidth, y: CONT_Y_TOP + 14 },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    });

    const batch = remaining.slice(0, linesPerCont);
    remaining = remaining.slice(linesPerCont);
    let y = CONT_Y_TOP;

    for (const line of batch) {
      if (line) {
        contPage.drawText(line, {
          x,
          y,
          size,
          font,
          color: rgb(0, 0, 0),
        });
      }
      y -= lineHeight;
    }
  }
}

/** Helper: get the dimensions of the first page as the "standard" page size */
function pages0Size(pdfDoc: PDFDocument): { width: number; height: number } {
  const pages = pdfDoc.getPages();
  if (pages.length === 0) return { width: 612, height: 792 }; // US Letter fallback
  return pages[0].getSize();
}