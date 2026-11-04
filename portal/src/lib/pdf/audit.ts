import fs from "fs";
import path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

async function generateDebugGrid() {
  const filePath = path.join(
    process.cwd(),
    "src/forms/orec/2026/template.pdf"
  );

  const pdfBytes = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pages = pdfDoc.getPages();

  pages.forEach((page, pageIndex) => {
    const { width, height } = page.getSize();

    // Draw grid every 50 points
    for (let x = 0; x <= width; x += 50) {
      page.drawLine({
        start: { x, y: 0 },
        end: { x, y: height },
        thickness: 0.3,
        color: rgb(0.8, 0.8, 0.8),
      });

      page.drawText(`${x}`, {
        x: x + 2,
        y: height - 12,
        size: 6,
        font,
        color: rgb(1, 0, 0),
      });
    }

    for (let y = 0; y <= height; y += 50) {
      page.drawLine({
        start: { x: 0, y },
        end: { x: width, y },
        thickness: 0.3,
        color: rgb(0.8, 0.8, 0.8),
      });

      page.drawText(`${y}`, {
        x: 2,
        y: y + 2,
        size: 6,
        font,
        color: rgb(0, 0, 1),
      });
    }

    // Page index label
    page.drawText(`DEBUG GRID - Page ${pageIndex}`, {
      x: 200,
      y: height - 30,
      size: 12,
      font,
      color: rgb(1, 0, 0),
    });
  });

  const outputPath = path.join(
    process.cwd(),
    "src/forms/orec/2026/debug-grid.pdf"
  );

  const newPdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, newPdfBytes);

  console.log("Debug grid PDF generated.");
}

generateDebugGrid();