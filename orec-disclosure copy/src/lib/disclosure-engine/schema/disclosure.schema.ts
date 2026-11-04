export type YesNo = "YES" | "NO";
export type ApplianceStatus = "WORKING" | "NOT_WORKING" | "UNKNOWN" | "NONE";

export type ZoningType =
  | "residential"
  | "commercial"
  | "historical"
  | "office"
  | "agricultural"
  | "industrial"
  | "urban_conservation"
  | "other"
  | "unknown"
  | "no_zoning";

export type SecuritySystemType = 0 | 1 | 2 | 3;
// 0 = Leased, 1 = Owned, 2 = Monitored, 3 = Financed

export type SolarPanelType = 0 | 1 | 2;
// 0 = Leased, 1 = Owned, 2 = Financed

export interface SignatureBlock {
  sellerSignatureBase64?: string;
  sellerName?: string;
  sellerDate?: string;
  seller2SignatureBase64?: string;
  seller2Name?: string;
  seller2Date?: string;
  buyerSignatureBase64?: string;
}

export interface InitialsBlock {
  buyerInitial1?: string;
  buyerInitial2?: string;
  sellerInitial1?: string;
  sellerInitial2?: string;
}

export interface InlineOptions {
  waterHeaterType?: 0 | 1 | 2;
  waterSoftenerType?: 0 | 1;
  acType?: 0 | 1 | 2;
  heatingType?: 0 | 1 | 2;
  gasSupplyType?: 0 | 1 | 2;
  propaneTankType?: 0 | 1;
  generatorType?: 0 | 1 | 2;
  waterSourceType?: 0 | 1 | 2;
  fireSuppressionDate?: string;
  securitySystemType?: SecuritySystemType;
  solarPanelType?: SolarPanelType;
}

export interface Page2FloodSection {
  /** Q3 main: 0 = YES, 1 = NO, 2 = UNKNOWN */
  q3Main?: 0 | 1 | 2;
  /** Q3 flood types: array of indices (0=100yr, 1=500yr, 2=floodway, 3=outside hazard area) */
  q3Types?: number[];
  /** Q3 municipal: 0 = YES, 1 = NO, 2 = UNKNOWN */
  q3Municipal?: 0 | 1 | 2;
  /** Q4: 0 = YES, 1 = NO, 2 = UNKNOWN */
  q4?: 0 | 1 | 2;
  /** Q5: YES or NO */
  q5?: YesNo;
  /** Q6: YES or NO */
  q6?: YesNo;
}

export interface Page2ZoningSection {
  zoningType?: ZoningType;
  /** Q2 historical district: 0 = YES, 1 = NO, 2 = UNKNOWN */
  historicalDistrict?: 0 | 1 | 2;
}

export interface Q41Inline {
  hoaAmount?: string;
  specialAssessmentAmount?: string;
  payableType?: 0 | 1 | 2;
  unpaid?: YesNo;
  ifYesAmount?: string;
  managerName?: string;
  phone?: string;
}

export interface Q46Inline {
  payableType?: 0 | 1 | 2;
  amount?: string;
  paidTo?: string;
}

export interface Q47Details {
  utilities?: number[];
  otherExplain?: string;
  initialMembership?: string;
  annualMembership?: string;
}

export interface SewerSystem {
  type?: 0 | 1;
  privateType?: 0 | 1 | 2;
}

export interface Page3TextFields {
  roofAge?: string;
  roofLayers?: string;
  termiteBaitAnnualCost?: string;
}

export interface AdditionalPages {
  hasAdditionalPages: YesNo;
  howMany?: string;
}

export interface DisclosureInput {
  version: "01-01-2026";

  propertyIdentifier?: string;

  /** 0 = OCCUPYING, 1 = NOT OCCUPYING */
  sellerOccupying?: 0 | 1;

  appliances?: Record<number, ApplianceStatus>;

  inlineOptions?: InlineOptions;

  questions?: Record<number, YesNo>;

  /** Q37 dam maintenance responsibility: 0 = Yes, 1 = No */
  q37Inline?: 0 | 1;

  /** Q37 dam maintenance: YES or NO */
  q37DamMaintenance?: YesNo;

  q41Inline?: Q41Inline;

  q46Inline?: Q46Inline;

  q47Details?: Q47Details;

  sewerSystem?: SewerSystem;

  /** @deprecated use page2Zoning.zoningType instead */
  zoningType?: ZoningType;

  page2Zoning?: Page2ZoningSection;

  page2Flood?: Page2FloodSection;

  /**
   * Explanation for NOT_WORKING items on page 1 (appliance indexes 0–11).
   * Required when any page 1 appliance is marked NOT_WORKING.
   */
  page1NotWorkingExplanation?: string;

  /**
   * Explanation for NOT_WORKING items on page 2 (appliance indexes 12+).
   * Required when any page 2 appliance is marked NOT_WORKING.
   */
  page2NotWorkingExplanation?: string;

  page3TextFields?: Page3TextFields;

  initials?: InitialsBlock;

  additionalPages?: AdditionalPages;

  explanation?: string;

  signatures?: SignatureBlock;
}