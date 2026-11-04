import { DisclosureInput } from "../schema/disclosure.schema";

// Page 1 appliance indexes: 0–18 (PDF rows 0–18).
// Page 2 appliance indexes: 19–38 (PAGE2_ROW_Y keys 0–19).
const PAGE_2_APPLIANCE_OFFSET = 19;

export function validateDisclosureInput(data: DisclosureInput) {

  if (data.version !== "01-01-2026") {
    throw new Error("Unsupported disclosure version");
  }

  if (!data.propertyIdentifier || data.propertyIdentifier.trim() === "") {
    throw new Error("propertyIdentifier is required");
  }

  if (data.initials) {
    const { buyerInitial1, buyerInitial2, sellerInitial1, sellerInitial2 } = data.initials;
    if (buyerInitial1 && buyerInitial1.length > 5)
      throw new Error("initials.buyerInitial1 must be 5 characters or less");
    if (buyerInitial2 && buyerInitial2.length > 5)
      throw new Error("initials.buyerInitial2 must be 5 characters or less");
    if (sellerInitial1 && sellerInitial1.length > 5)
      throw new Error("initials.sellerInitial1 must be 5 characters or less");
    if (sellerInitial2 && sellerInitial2.length > 5)
      throw new Error("initials.sellerInitial2 must be 5 characters or less");
  }

  if (data.appliances) {
    const entries = Object.entries(data.appliances);

    const hasNotWorkingPage1 = entries.some(
      ([key, status]) => Number(key) < PAGE_2_APPLIANCE_OFFSET && status === "NOT_WORKING"
    );
    const hasNotWorkingPage2 = entries.some(
      ([key, status]) => Number(key) >= PAGE_2_APPLIANCE_OFFSET && status === "NOT_WORKING"
    );

    if (hasNotWorkingPage1 && !data.page1NotWorkingExplanation?.trim()) {
      throw new Error(
        "page1NotWorkingExplanation is required when any page 1 appliance is marked NOT_WORKING"
      );
    }
    if (hasNotWorkingPage2 && !data.page2NotWorkingExplanation?.trim()) {
      throw new Error(
        "page2NotWorkingExplanation is required when any page 2 appliance is marked NOT_WORKING"
      );
    }
  }

  // ── Character limits removed ──────────────────────────────────
  // Text overflow is handled automatically by renderExplanations.ts
  // which appends continuation pages to the PDF when needed.
  // There is no upper bound on explanation length.

  if (data.sewerSystem?.type === 1 && data.sewerSystem.privateType === undefined) {
    throw new Error("sewerSystem.privateType is required when sewer type is Private");
  }

  if (data.questions?.[41] === "YES" && !data.q41Inline?.hoaAmount?.trim()) {
    throw new Error("q41Inline.hoaAmount is required when Q41 is YES");
  }
  if (data.q41Inline?.unpaid === "YES" && !data.q41Inline.ifYesAmount?.trim()) {
    throw new Error("q41Inline.ifYesAmount is required when unpaid is YES");
  }
  if (data.questions?.[46] === "YES" && !data.q46Inline?.amount?.trim()) {
    throw new Error("q46Inline.amount is required when Q46 is YES");
  }
}