export interface DentalContactDefinition {
  readonly contact: string;
  readonly toothA: number;
  readonly toothB: number;
  readonly label: string;
  readonly arch: "upper" | "lower";
}

export const UPPER_DENTAL_CONTACTS: readonly DentalContactDefinition[] = [
  { contact: "17-16", toothA: 17, toothB: 16, label: "17 - 16 (UR7 - UR6)", arch: "upper" },
  { contact: "16-15", toothA: 16, toothB: 15, label: "16 - 15 (UR6 - UR5)", arch: "upper" },
  { contact: "15-14", toothA: 15, toothB: 14, label: "15 - 14 (UR5 - UR4)", arch: "upper" },
  { contact: "14-13", toothA: 14, toothB: 13, label: "14 - 13 (UR4 - UR3)", arch: "upper" },
  { contact: "13-12", toothA: 13, toothB: 12, label: "13 - 12 (UR3 - UR2)", arch: "upper" },
  { contact: "12-11", toothA: 12, toothB: 11, label: "12 - 11 (UR2 - UR1)", arch: "upper" },
  { contact: "11-21", toothA: 11, toothB: 21, label: "11 - 21 (UR1 - UL1 / Midline)", arch: "upper" },
  { contact: "21-22", toothA: 21, toothB: 22, label: "21 - 22 (UL1 - UL2)", arch: "upper" },
  { contact: "22-23", toothA: 22, toothB: 23, label: "22 - 23 (UL2 - UL3)", arch: "upper" },
  { contact: "23-24", toothA: 23, toothB: 24, label: "23 - 24 (UL3 - UL4)", arch: "upper" },
  { contact: "24-25", toothA: 24, toothB: 25, label: "24 - 25 (UL4 - UL5)", arch: "upper" },
  { contact: "25-26", toothA: 25, toothB: 26, label: "25 - 26 (UL5 - UL6)", arch: "upper" },
  { contact: "26-27", toothA: 26, toothB: 27, label: "26 - 27 (UL6 - UL7)", arch: "upper" },
];

export const LOWER_DENTAL_CONTACTS: readonly DentalContactDefinition[] = [
  { contact: "47-46", toothA: 47, toothB: 46, label: "47 - 46 (LR7 - LR6)", arch: "lower" },
  { contact: "46-45", toothA: 46, toothB: 45, label: "46 - 45 (LR6 - LR5)", arch: "lower" },
  { contact: "45-44", toothA: 45, toothB: 44, label: "45 - 44 (LR5 - LR4)", arch: "lower" },
  { contact: "44-43", toothA: 44, toothB: 43, label: "44 - 43 (LR4 - LR3)", arch: "lower" },
  { contact: "43-42", toothA: 43, toothB: 42, label: "43 - 42 (LR3 - LR2)", arch: "lower" },
  { contact: "42-41", toothA: 42, toothB: 41, label: "42 - 41 (LR2 - LR1)", arch: "lower" },
  { contact: "41-31", toothA: 41, toothB: 31, label: "41 - 31 (LR1 - LL1 / Midline)", arch: "lower" },
  { contact: "31-32", toothA: 31, toothB: 32, label: "31 - 32 (LL1 - LL2)", arch: "lower" },
  { contact: "32-33", toothA: 32, toothB: 33, label: "32 - 33 (LL2 - LL3)", arch: "lower" },
  { contact: "33-34", toothA: 33, toothB: 34, label: "33 - 34 (LL3 - LL4)", arch: "lower" },
  { contact: "34-35", toothA: 34, toothB: 35, label: "34 - 35 (LL4 - LL5)", arch: "lower" },
  { contact: "35-36", toothA: 35, toothB: 36, label: "35 - 36 (LL5 - LL6)", arch: "lower" },
  { contact: "36-37", toothA: 36, toothB: 37, label: "36 - 37 (LL6 - LL7)", arch: "lower" },
];

export const ALL_DENTAL_CONTACTS: readonly DentalContactDefinition[] = [
  ...UPPER_DENTAL_CONTACTS,
  ...LOWER_DENTAL_CONTACTS,
];

