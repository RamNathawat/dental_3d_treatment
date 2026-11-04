import * as raw from "../../../forms/orec/2026/layout";

/* =========================
   YES/NO CHECKBOXES
   Q41 and Q46 YES/NO are handled purely by renderQuestions
   via questions.41 and questions.46 — NOT here
   ========================= */

export interface YesNoLayout {
  page: number;
  yesX: number;
  noX: number;
  y: number;
}

export const CHECKBOX_LAYOUT: Record<string, YesNoLayout> = {};

/* =========================
   TEXT FIELDS
   hoaAmount and specialAssessmentAmount now live in
   q41Inline — rendered by renderQ41Q46Inline directly
   ========================= */

export interface TextLayout {
  page: number;
  x: number;
  y: number;
  fontSize: number;
}

export const TEXT_LAYOUT: Record<string, TextLayout> = {};

/* =========================
   EXPLANATION BOX
   ========================= */

export const EXPLANATION_LAYOUT = {
  explanation: {
    page: 4,
    x: 38,
    yTop: 170,
    width: 545,
    lineHeight: 14,
    maxLines: 10,
  },
};

/* =========================
   SIGNATURES (Page 5)
   ========================= */

export interface SignatureLayout {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const SIGNATURE_LAYOUT = {
  seller: {
    page: 4,
    x: raw.PAGE5_SIGNATURES.seller1.x - 80,
    y: raw.PAGE5_SIGNATURES.seller1.y - 9,
    width: 180,
    height: 20,
  },
  seller2: {
    page: 4,
    x: raw.PAGE5_SIGNATURES.seller2.x - 80,
    y: raw.PAGE5_SIGNATURES.seller2.y - 9,
    width: 180,
    height: 20,
  },
  buyer: {
    page: 4,
    x: raw.PAGE5_SIGNATURES.buyer1.x - 80,
    y: raw.PAGE5_SIGNATURES.buyer1.y - 11,
    width: 180,
    height: 20,
  },
  buyer2: {
    page: 4,
    x: raw.PAGE5_SIGNATURES.buyer2.x - 80,
    y: raw.PAGE5_SIGNATURES.buyer2.y - 11,
    width: 180,
    height: 20,
  },
};