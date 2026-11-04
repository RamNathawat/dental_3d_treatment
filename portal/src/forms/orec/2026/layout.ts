// ==================================================
// GLOBAL & PAGE 1
// ==================================================
export const CHECKBOX_SIZE = 11;
export const PROPERTY_IDENTIFIER = { x: 200, y: 770, fontSize: 10 };

// Page 1 — "LOCATION OF SUBJECT PROPERTY" field in body
export const PROPERTY_IDENTIFIER_PAGE1 = { x: 200, y: 500, fontSize: 10 };

// Pages 1–5 — repeating header at top of every page
export const PROPERTY_IDENTIFIER_HEADER = { x: 138, y: 765, fontSize: 10 };

export const SELLER_OCCUPYING = { y: 477, occupyingX: 81, notOccupyingX: 124 };

export const APPLIANCE_COLUMNS = { WORKING: 370, NOT_WORKING: 426.5, DO_NOT_KNOW: 484, NONE: 541.5 };
export const APPLIANCE_FIRST_ROW_Y = 345;
export const APPLIANCE_ROW_SPACING = 15.1;

export const SEWER_INLINE = { y: 209.5, publicX: 105, deltaToPrivate: 44, size: 10.5 };
export const SEPTIC_INLINE = { y: 198, firstX: 119, deltaToSecond: 68, deltaToThird: 155, size: 10.5 };
export const WATER_HEATER_INLINE = { rowIndex: 3, firstX: 100, deltaToSecond: 50, deltaToThird: 87, size: 10.5 };
export const WATER_SOFTENER_INLINE = { rowIndex: 5, firstX: 106.5, deltaToSecond: 51, size: 10.5 };
export const AC_INLINE = { rowIndex: 10, firstX: 145, deltaToSecond: 50, deltaToThird: 86.5, size: 10.5 };
export const HEATING_INLINE = { rowIndex: 14, firstX: 110.5, deltaToSecond: 50.5, deltaToThird: 87, size: 10.5 };
export const GAS_SUPPLY_INLINE = { rowIndex: 17, firstX: 93, deltaToSecond: 44.5, deltaToThird: 98.5, size: 10.5 };
export const PROPANE_TANK_INLINE = { rowIndex: 18, firstX: 101, deltaToSecond: 51, size: 10.5 };

// Initials — two boxes each for buyer and seller, on every page
// Pages 1–4 share the same y, page 5 has its own
export const PAGE_INITIALS_DEFAULT = {
  buyer1X: 165,
  buyer2X: 195,
  seller1X: 290,
  seller2X: 322,
  y: 40,
};
export const PAGE5_INITIALS_BOXES = {
  buyer1X: 165,
  buyer2X: 195,
  seller1X: 290,
  seller2X: 322,
  y: 40,
};

// Page 5 — "additional pages attached" question
export const PAGE5_ADDITIONAL_PAGES = {
  yesX: 271,
  noX: 307,
  y: 696,
  howManyX: 420,
};

// ==================================================
// PAGE 2
// ==================================================
export const PAGE2_ROW_Y: Record<number, number> = {
  0: 697.4, 1: 682.3, 2: 667.2, 3: 652.1, 4: 637.0, 5: 621.9, 6: 606.8, 7: 591.7,
  8: 576.6, 9: 561.5, 10: 548, 11: 533.5, 12: 518, 13: 504, 14: 489, 15: 473.5,
  16: 459, 17: 444, 18: 428, 19: 412,
};
export const PAGE2_SECURITY_INLINE = { rowIndex: 4, firstX: 112, deltaToSecond: 50.5, deltaToThird: 99.5, deltaToFourth: 161 };
export const PAGE2_SOLAR_INLINE = { rowIndex: 17, firstX: 97, deltaToSecond: 50.5, deltaToThird: 100 };
export const PAGE2_GENERATORS_INLINE = { rowIndex: 18, firstX: 90, deltaToSecond: 50.5, deltaToThird: 100 };
export const PAGE2_WATER_SOURCE_INLINE = { rowIndex: 19, firstX: 160, deltaToSecond: 43, deltaToThird: 81 };
export const PAGE2_FLOOD_VERTICAL_COLUMNS = { YES: 526.5, NO: 554.5 };
export const PAGE2_ZONING_Q1_ROW1 = { y: 280, firstX: 185, deltas: [62, 128.5, 185.5, 227, 289.5] };
export const PAGE2_ZONING_Q1_ROW2 = { y: 268, firstX: 44, deltas: [100, 141, 198] };
export const PAGE2_ZONING_Q2 = { y: 241.5, firstX: 45, deltas: [33, 64.5] };
export const PAGE2_FLOOD_Q3_MAIN = { y: 193.5, firstX: 45.5, deltas: [33, 64.5] };
export const PAGE2_FLOOD_Q3_TYPES = { y: 159, firstX: 47, deltas: [101, 203, 258.5] };
export const PAGE2_FLOOD_Q3_MUNICIPAL = { y: 123, firstX: 105, deltas: [34, 64.5] };
export const PAGE2_FLOOD_Q4 = { y: 96, firstX: 127, deltas: [33, 64.5] };
export const PAGE2_FLOOD_Q5_Y = 81;
export const PAGE2_FLOOD_Q6_Y = 65;
export const PAGE2_NOT_WORKING_BOX = { x: 40, yTop: 370, width: 530, lineHeight: 14, maxLines: 6 };
export const PAGE2_FIRE_SUPPRESSION_DATE = { x: 250, y: 607 };

// ==================================================
// PAGE 3 TEXT FIELDS
// ==================================================
export const PAGE3_Q16_ROOF_AGE = { x: 290, y: 503 };
export const PAGE3_Q16_ROOF_LAYERS = { x: 173, y: 490 };
export const PAGE3_Q19_TERMITE_COST = { x: 430, y: 445.5 };

// ==================================================
// PAGE 3, 4, 5
// ==================================================
export const PAGE3_YES_NO_COLUMNS = { YES: 526.5, NO: 554.5 };
export const PAGE3_ROW_Y: Record<number, number> = {
  7: 713.5, 8: 686, 9: 665.5, 10: 644, 11: 603, 12: 587.5, 13: 573, 14: 551.5, 15: 524.5,
  16: 500, 17: 475.5, 18: 460.5, 19: 445.5, 20: 430, 21: 415, 22: 393, 23: 372.5,
  24: 337, 25: 321.5, 26: 306.5, 27: 291, 28: 276, 29: 260.5, 30: 245.5, 31: 224,
  32: 203.5, 33: 188, 34: 172.5, 35: 157.5, 36: 142.5, 37: 121, 38: 74,
};
export const PAGE3_Q37_INLINE = { offsetFromRow: 5.5, firstX: 322, deltaToSecond: 35 };

export const PAGE4_YES_NO_COLUMNS = { YES: 526.5, NO: 554.5 };
export const PAGE4_ROW_Y: Record<number, number> = {
  39: 714.5, 40: 693, 41: 623, 42: 542, 43: 521, 44: 500,
  45: 479.5, 46: 434, 47: 351, 48: 274.5, 49: 253, 50: 227,
};
export const PAGE4_Q41_PAYABLE = { y: 629.5, firstX: 150, deltaToSecond: 53.5, deltaToThird: 112.5 };
export const PAGE4_Q41_UNPAID = { y: 605.5, firstX: 305, deltaToSecond: 38 };
export const PAGE4_Q46_PAYABLE = { y: 409.5, firstX: 152, deltaToSecond: 54, deltaToThird: 111.5 };
export const PAGE4_Q47_UTILITIES = { y: 370, firstX: 133.5, deltas: [45, 103, 150] };
export const PAGE4_TEXT_FIELDS = {
  q41AmountOfDues: { x: 130, y: 652.5 },
  q41SpecialAssessment: { x: 280, y: 652.5 },
  q41IfYesAmount: { x: 180, y: 580.5 },
  q41ManagerName: { x: 300, y: 580.5 },
  q41Phone: { x: 305, y: 556 },
  q46Amount: { x: 152, y: 433 },
  q46PaidTo: { x: 265, y: 433 },
  q47IfOtherExplain: { x: 125, y: 345 },
  q47InitialMembership: { x: 156, y: 321 },
  q47AnnualMembership: { x: 335, y: 321 },
};
export const PAGE4_EXPLANATION_BOX = { x: 40, yTop: 205, lineHeight: 12 };
export const PAGE4_INITIALS = { buyerX: 160, sellerX: 282, y: 40 };

export const PAGE5_YES_NO = { y: 696, firstX: 271, deltaToSecond: 36 };
export const PAGE5_SIGNATURES = {
  seller1: { x: 150, y: 670 }, seller2: { x: 360, y: 670 },
  buyer1: { x: 150, y: 505 }, buyer2: { x: 360, y: 505 },
};
export const PAGE5_INITIALS = { buyerX: 160, sellerX: 290, y: 50 };