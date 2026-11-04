// src/lib/disclosure-engine/utils/drawWrappedText.ts
import { PDFPage, PDFFont, rgb } from "pdf-lib";

type DrawWrappedTextOptions = {
  page: PDFPage;
  text?: string | null;
  x?: number;
  y?: number;
  maxWidth?: number;
  font: PDFFont;
  size?: number;
  lineHeight?: number;
};

const toSafeNumber = (value: unknown, fallback: number) => {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
};

export function drawWrappedText({
  page,
  text,
  x,
  y,
  maxWidth,
  font,
  size = 10,
  lineHeight,
}: DrawWrappedTextOptions) {
  // ✅ root fix: never allow NaN coordinates into pdf-lib
  const safeX = toSafeNumber(x, 50);
  const safeY = toSafeNumber(y, 700);
  const safeSize = toSafeNumber(size, 10);
  const safeMaxWidth = toSafeNumber(maxWidth, 220);
  const safeLineHeight = toSafeNumber(lineHeight, safeSize + 2);

  const content = String(text ?? "").trim();
  if (!content) return { y: safeY };

  const words = content.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, safeSize);

    if (testWidth <= safeMaxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);

  let currentY = safeY;

  for (const line of lines) {
    // extra hardening in case future callers mutate values
    page.drawText(line, {
      x: toSafeNumber(safeX, 50),
      y: toSafeNumber(currentY, safeY),
      size: safeSize,
      font,
      color: rgb(0, 0, 0),
    });

    currentY -= safeLineHeight;
  }

  return { y: currentY };
}
