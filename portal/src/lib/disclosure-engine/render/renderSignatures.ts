// src/lib/disclosure-engine/render/renderSignatures.ts

import { PDFPage, PDFDocument, PDFFont } from "pdf-lib";
import { DisclosureInput } from "../schema/disclosure.schema";
import { SIGNATURE_LAYOUT } from "../layout/rpcd_2026.semantic";
import * as raw from "../../../forms/orec/2026/layout";

/**
 * Width of each initials box in points
 */
const INITIALS_BOX_WIDTH = 18;

/**
 * FINAL FIX:
 *
 * Auto-resize + auto-center initials so they
 * never touch borders or spill over the black line.
 *
 * Fixes:
 * - RN / DNS overflow
 * - seller2 initials overflow
 * - 3-letter initials touching line
 */

function getInitialPlacement(
  boxLeftX: number,
  text: string,
  font: PDFFont
) {
  /**
   * Start slightly smaller for safer fit
   */
  let size = 9;

  let width = font.widthOfTextAtSize(text, size);

  /**
   * Keep shrinking until safely inside the box
   */
  while (
    width > INITIALS_BOX_WIDTH - 4 &&
    size > 6
  ) {
    size--;
    width = font.widthOfTextAtSize(text, size);
  }

  /**
   * True horizontal center
   */
  const x =
    boxLeftX +
    (INITIALS_BOX_WIDTH - width) / 2;

  return {
    x,
    size,
  };
}

export async function renderSignatures(
  pdfDoc: PDFDocument,
  pages: PDFPage[],
  font: PDFFont,
  data: DisclosureInput
) {
  /**
   * ─────────────────────────────────────────────
   * Seller 1 signature + name + date
   * ─────────────────────────────────────────────
   */
  if (data.signatures?.sellerSignatureBase64) {
    await drawSignatureFromBase64(
      pdfDoc,
      pages,
      SIGNATURE_LAYOUT.seller,
      data.signatures.sellerSignatureBase64
    );
  }

  const sig5 = pages[4];
  if (sig5) {
    if (data.signatures?.sellerName) {
      sig5.drawText(String(data.signatures.sellerName), {
        x: raw.PAGE5_SIGNATURES.seller1.x - 100,
        y: raw.PAGE5_SIGNATURES.seller1.y - 30,
        size: 9,
        font,
      });
    }
    if (data.signatures?.sellerDate) {
      sig5.drawText(String(data.signatures.sellerDate), {
        x: raw.PAGE5_SIGNATURES.seller1.x + 70,
        y: raw.PAGE5_SIGNATURES.seller1.y - 30,
        size: 9,
        font,
      });
    }
  }

  /**
   * ─────────────────────────────────────────────
   * Seller 2 signature + name + date
   * ─────────────────────────────────────────────
   */
  if (data.signatures?.seller2SignatureBase64) {
    await drawSignatureFromBase64(
      pdfDoc,
      pages,
      SIGNATURE_LAYOUT.seller2,
      data.signatures.seller2SignatureBase64
    );
  }

  if (sig5) {
    if (data.signatures?.seller2Name) {
      sig5.drawText(String(data.signatures.seller2Name), {
        x: raw.PAGE5_SIGNATURES.seller2.x - 50,
        y: raw.PAGE5_SIGNATURES.seller2.y - 30,
        size: 9,
        font,
      });
    }
    if (data.signatures?.seller2Date) {
      sig5.drawText(String(data.signatures.seller2Date), {
        x: raw.PAGE5_SIGNATURES.seller2.x + 120,
        y: raw.PAGE5_SIGNATURES.seller2.y - 30,
        size: 9,
        font,
      });
    }
  }

  /**
   * ─────────────────────────────────────────────
   * Buyer signatures
   * ─────────────────────────────────────────────
   */
  if (data.signatures?.buyerSignatureBase64) {
    await drawSignatureFromBase64(
      pdfDoc,
      pages,
      SIGNATURE_LAYOUT.buyer,
      data.signatures.buyerSignatureBase64
    );

    await drawSignatureFromBase64(
      pdfDoc,
      pages,
      SIGNATURE_LAYOUT.buyer2,
      data.signatures.buyerSignatureBase64
    );
  }

  /**
   * ─────────────────────────────────────────────
   * Additional pages checkbox
   * ─────────────────────────────────────────────
   */
  if (data.additionalPages) {
    const page5 = pages[4];
    if (!page5) return;

    const checkX =
      data.additionalPages.hasAdditionalPages === "YES"
        ? raw.PAGE5_ADDITIONAL_PAGES.yesX
        : raw.PAGE5_ADDITIONAL_PAGES.noX;

    const numX = Number(checkX);

    if (!Number.isNaN(numX)) {
      page5.drawText("X", {
        x: numX,
        y: Number(raw.PAGE5_ADDITIONAL_PAGES.y),
        size: raw.CHECKBOX_SIZE,
        font,
      });
    }

    if (
      data.additionalPages.hasAdditionalPages === "YES" &&
      data.additionalPages.howMany
    ) {
      page5.drawText(data.additionalPages.howMany, {
        x: Number(raw.PAGE5_ADDITIONAL_PAGES.howManyX),
        y: Number(raw.PAGE5_ADDITIONAL_PAGES.y),
        size: 10,
        font,
      });
    }
  }

  /**
   * ─────────────────────────────────────────────
   * Initials on every page
   * ─────────────────────────────────────────────
   */
  if (data.initials) {
    pages.forEach((page, pageIndex) => {
      const isLastPage = pageIndex === pages.length - 1;

      const coords = isLastPage
        ? raw.PAGE5_INITIALS_BOXES
        : raw.PAGE_INITIALS_DEFAULT;

      const safeY = Number(coords.y);

      if (!Number.isFinite(safeY)) return;

      /**
       * Buyer Initial 1
       */
      if (data.initials?.buyerInitial1) {
        const placement = getInitialPlacement(
          coords.buyer1X,
          data.initials.buyerInitial1,
          font
        );

        page.drawText(data.initials.buyerInitial1, {
          x: placement.x,
          y: safeY + 1,
          size: placement.size,
          font,
        });
      }

      /**
       * Buyer Initial 2
       */
      if (data.initials?.buyerInitial2) {
        const placement = getInitialPlacement(
          coords.buyer2X,
          data.initials.buyerInitial2,
          font
        );

        page.drawText(data.initials.buyerInitial2, {
          x: placement.x,
          y: safeY + 1,
          size: placement.size,
          font,
        });
      }

      /**
       * Seller Initial 1
       */
      if (data.initials?.sellerInitial1) {
        const placement = getInitialPlacement(
          coords.seller1X,
          data.initials.sellerInitial1,
          font
        );

        page.drawText(data.initials.sellerInitial1, {
          x: placement.x,
          y: safeY + 1,
          size: placement.size,
          font,
        });
      }

      /**
       * Seller Initial 2
       */
      if (data.initials?.sellerInitial2) {
        const placement = getInitialPlacement(
          coords.seller2X,
          data.initials.sellerInitial2,
          font
        );

        page.drawText(data.initials.sellerInitial2, {
          x: placement.x,
          y: safeY + 1,
          size: placement.size,
          font,
        });
      }
    });
  }
}

async function drawSignatureFromBase64(
  pdfDoc: PDFDocument,
  pages: PDFPage[],
  layout: {
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
  },
  base64: string
) {
  const page = pages[layout.page];

  if (!page) return;

  /**
   * Strip data URL prefix if present
   * Example:
   * data:image/png;base64,...
   */
  const rawBase64 = base64.includes(",")
    ? base64.split(",")[1]
    : base64;

  const imageBytes = Uint8Array.from(
    atob(rawBase64),
    (c) => c.charCodeAt(0)
  );

  let image;

  try {
    image = await pdfDoc.embedPng(imageBytes);
  } catch {
    image = await pdfDoc.embedJpg(imageBytes);
  }

  const scale = Math.min(
    layout.width / image.width,
    layout.height / image.height
  );

  const scaledWidth = image.width * scale;
  const scaledHeight = image.height * scale;

  const offsetX =
    Number(layout.x) +
    (layout.width - scaledWidth) / 2;

  const offsetY =
    Number(layout.y) +
    (layout.height - scaledHeight) / 2;

  if (
    !Number.isFinite(offsetX) ||
    !Number.isFinite(offsetY)
  ) {
    return;
  }

  page.drawImage(image, {
    x: offsetX,
    y: offsetY,
    width: scaledWidth,
    height: scaledHeight,
  });
}