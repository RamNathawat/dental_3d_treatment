import { PDFPage, PDFFont } from "pdf-lib";
import * as raw from "../../../forms/orec/2026/layout";
import { DisclosureInput } from "../schema/disclosure.schema";

export function renderQ41Q46Inline(
  pages: PDFPage[],
  font: PDFFont,
  data: DisclosureInput
) {
  const page = pages[3];

  // --------------------------------------------------
  // Q41 HOA Amount of Dues
  // --------------------------------------------------
  if (data.q41Inline?.hoaAmount) {
    page.drawText(data.q41Inline.hoaAmount, {
      x: raw.PAGE4_TEXT_FIELDS.q41AmountOfDues.x,
      y: raw.PAGE4_TEXT_FIELDS.q41AmountOfDues.y,
      size: 10,
      font,
    });
  }

  // --------------------------------------------------
  // Q41 Special Assessment Amount
  // --------------------------------------------------
  if (data.q41Inline?.specialAssessmentAmount) {
    page.drawText(data.q41Inline.specialAssessmentAmount, {
      x: raw.PAGE4_TEXT_FIELDS.q41SpecialAssessment.x,
      y: raw.PAGE4_TEXT_FIELDS.q41SpecialAssessment.y,
      size: 10,
      font,
    });
  }

  // --------------------------------------------------
  // Q41 Payable type checkbox — coerce to number
  // --------------------------------------------------
  if (data.q41Inline?.payableType !== undefined) {
    const pt = Number(data.q41Inline.payableType);
    const y = raw.PAGE4_Q41_PAYABLE.y;
    const base = raw.PAGE4_Q41_PAYABLE.firstX;

    let x = base;
    if (pt === 1) x = base + raw.PAGE4_Q41_PAYABLE.deltaToSecond;
    if (pt === 2) x = base + raw.PAGE4_Q41_PAYABLE.deltaToThird;

    if (!Number.isNaN(x)) page.drawText("X", { x, y, size: 11, font });
  }

  // --------------------------------------------------
  // Q41 Unpaid dues checkbox
  // --------------------------------------------------
  if (data.q41Inline?.unpaid) {
    const y = raw.PAGE4_Q41_UNPAID.y;
    const x =
      data.q41Inline.unpaid === "YES"
        ? raw.PAGE4_Q41_UNPAID.firstX
        : raw.PAGE4_Q41_UNPAID.firstX + raw.PAGE4_Q41_UNPAID.deltaToSecond;

    page.drawText("X", { x, y, size: 11, font });
  }

  // --------------------------------------------------
  // Q41 If yes amount
  // --------------------------------------------------
  if (data.q41Inline?.ifYesAmount) {
    page.drawText(data.q41Inline.ifYesAmount, {
      x: raw.PAGE4_TEXT_FIELDS.q41IfYesAmount.x,
      y: raw.PAGE4_TEXT_FIELDS.q41IfYesAmount.y,
      size: 10,
      font,
    });
  }

  // --------------------------------------------------
  // Q41 Manager Name
  // --------------------------------------------------
  if (data.q41Inline?.managerName) {
    page.drawText(data.q41Inline.managerName, {
      x: raw.PAGE4_TEXT_FIELDS.q41ManagerName.x,
      y: raw.PAGE4_TEXT_FIELDS.q41ManagerName.y,
      size: 10,
      font,
    });
  }

  // --------------------------------------------------
  // Q41 Phone Number
  // --------------------------------------------------
  if (data.q41Inline?.phone) {
    page.drawText(data.q41Inline.phone, {
      x: raw.PAGE4_TEXT_FIELDS.q41Phone.x,
      y: raw.PAGE4_TEXT_FIELDS.q41Phone.y,
      size: 10,
      font,
    });
  }

  // --------------------------------------------------
  // Q46 Payable type checkbox — coerce to number
  // --------------------------------------------------
  if (data.q46Inline?.payableType !== undefined) {
    const pt = Number(data.q46Inline.payableType);
    const y = raw.PAGE4_Q46_PAYABLE.y;
    const base = raw.PAGE4_Q46_PAYABLE.firstX;

    let x = base;
    if (pt === 1) x = base + raw.PAGE4_Q46_PAYABLE.deltaToSecond;
    if (pt === 2) x = base + raw.PAGE4_Q46_PAYABLE.deltaToThird;

    if (!Number.isNaN(x)) page.drawText("X", { x, y, size: 11, font });
  }

  // --------------------------------------------------
  // Q46 Amount
  // --------------------------------------------------
  if (data.q46Inline?.amount) {
    page.drawText(data.q46Inline.amount, {
      x: raw.PAGE4_TEXT_FIELDS.q46Amount.x,
      y: raw.PAGE4_TEXT_FIELDS.q46Amount.y,
      size: 10,
      font,
    });
  }

  // --------------------------------------------------
  // Q46 Paid To
  // --------------------------------------------------
  if (data.q46Inline?.paidTo) {
    page.drawText(data.q46Inline.paidTo, {
      x: raw.PAGE4_TEXT_FIELDS.q46PaidTo.x,
      y: raw.PAGE4_TEXT_FIELDS.q46PaidTo.y,
      size: 10,
      font,
    });
  }
}