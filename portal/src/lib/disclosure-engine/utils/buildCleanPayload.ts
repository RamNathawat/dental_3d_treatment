export type FlatFormData = Record<string, any>;

const PAGE_2_APPLIANCE_OFFSET = 19;

/**
 * Strip null values from an object so downstream code treats them as "not set".
 * This is critical for the Seller 2 flow: Seller 1's stored form_data may
 * contain explicit nulls for fields that were unset at save time. Without
 * stripping, the PDF renderer sees null and skips the field entirely.
 */
function stripNulls<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== "object") return obj;
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null) result[key] = value;
  }
  return result;
}
function normalizeYesNo(value: any): "YES" | "NO" | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  if (value === "YES" || value === "NO") return value;
  if (value === 0 || value === "0") return "YES";
  if (value === 1 || value === "1") return "NO";
  const v = String(value).toUpperCase();
  return v === "YES" || v === "NO" ? (v as "YES" | "NO") : undefined;
}

function isUnset(value: any): boolean {
  return value === null || value === undefined || value === "";
}


export function buildCleanPayload(
  flatValues: FlatFormData,
  allSteps: Record<string, FlatFormData>
): Record<string, any> {
  const safeMergeAll = (...objs: any[]) => {
    const res: Record<string, any> = {};
    objs.forEach((obj) => {
      if (!obj) return;
      Object.entries(obj).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") res[k] = v;
      });
    });
    return res;
  };

  const appliancesA = allSteps["Appliances"]?.appliances || {};
  const appliancesB = allSteps["Appliances Continued"]?.appliances || {};
  const appliancesC = allSteps["Systems"]?.appliances || {};
  const mergedAppliances: Record<string, string> = safeMergeAll(
    flatValues.appliances, appliancesA, appliancesB, appliancesC
  );

  const sys = allSteps["Systems"]?.systems || flatValues.systems || {};

  const systemToApplianceMap: Record<string, number> = {
    waterHeater: 3, waterSoftener: 5, sewer: 9, ac: 10,
    heating: 14, gasSupply: 17, propaneTank: 18,
    security: 23, fireSuppression: 25, solar: 36,
    generator: 37, waterSource: 38,
  };

  Object.entries(systemToApplianceMap).forEach(([sysKey, appIndex]) => {
    if (sys[sysKey] && sys[sysKey] !== "")
      mergedAppliances[appIndex.toString()] = sys[sysKey];
  });

  const questionsA = allSteps["Questions"]?.questions || {};
  const questionsB = allSteps["Questions Continued"]?.questions || {};
  const questionsC = allSteps["Questions Final"]?.questions || {};
  const mergedQuestions = safeMergeAll(flatValues.questions, questionsA, questionsB, questionsC);

  const commentsA = allSteps["Questions"]?.questionComments || {};
  const commentsB = allSteps["Questions Continued"]?.questionComments || {};
  const commentsC = allSteps["Questions Final"]?.questionComments || {};
  const mergedComments = safeMergeAll(flatValues.questionComments, commentsA, commentsB, commentsC);

  const q16 = allSteps["Questions"]?.q16Inline || flatValues.q16Inline || {};
  const q19 = allSteps["Questions"]?.q19Inline || flatValues.q19Inline || {};

  const q37MaintenanceRaw =
    allSteps["Questions Continued"]?.q37Inline?.maintenance ??
    flatValues?.q37Inline?.maintenance ??
    flatValues?.q37Inline;
    
  const q37Inline: 0 | 1 | undefined =
    q37MaintenanceRaw === "YES" || q37MaintenanceRaw === "0" || q37MaintenanceRaw === 0 ? 0 : 
    q37MaintenanceRaw === "NO" || q37MaintenanceRaw === "1" || q37MaintenanceRaw === 1 ? 1 : 
    undefined;

  const q41 = allSteps["Questions Final"]?.q41Inline || flatValues.q41Inline || {};
  const q46 = allSteps["Questions Final"]?.q46Inline || flatValues.q46Inline || {};
  const q47 = allSteps["Questions Final"]?.q47Details || flatValues.q47Details || {};

  const applianceCommentsPage1 = allSteps["Appliances"]?.applianceComments || {};
  const applianceCommentsPage2 = allSteps["Appliances Continued"]?.applianceComments || {};
  const allApplianceComments   = safeMergeAll(
    flatValues.applianceComments, applianceCommentsPage1, applianceCommentsPage2
  );

  const page1Notes = Object.entries(allApplianceComments)
    .filter(([key, val]) => Number(key) < PAGE_2_APPLIANCE_OFFSET && val)
    .map(([key, val]) => `Appliance ${key}: ${val}`).join("\n");

  const page2Notes = Object.entries(allApplianceComments)
    .filter(([key, val]) => Number(key) >= PAGE_2_APPLIANCE_OFFSET && val)
    .map(([key, val]) => `Appliance ${key}: ${val}`).join("\n");

  // ChipGroup (radio) stores the selected chip's index as a string ("0","1","2").
  // The label-based frequencyMap is the primary lookup; if it returns undefined
  // (because the value is already a numeric index string) fall back to Number().
  const frequencyMap: Record<string, 0 | 1 | 2> = { Monthly: 0, Quarterly: 1, Annually: 2 };
  const resolveFrequency = (raw: string | number | undefined): 0 | 1 | 2 | undefined => {
    if (raw === undefined || raw === null || raw === "") return undefined;
    if (typeof raw === "number") return raw as 0 | 1 | 2;
    const byLabel = frequencyMap[raw];
    if (byLabel !== undefined) return byLabel;
    const n = Number(raw);
    return Number.isNaN(n) ? undefined : (n as 0 | 1 | 2);
  };

  // ChipGroup (checkbox) stores selected indices as string arrays ("0","1").
  // utilityMap handles label strings; fall back to Number() for index strings.
  const utilityMap: Record<string, number> = { Water: 0, Garbage: 1, Sewer: 2, Other: 3 };
  const resolveUtilities = (services: string[]): number[] =>
    services
      .map((s) => (utilityMap[s] !== undefined ? utilityMap[s] : Number(s)))
      .filter((v) => !Number.isNaN(v));

  return {
    version: "01-01-2026",
    propertyIdentifier: allSteps["Property"]?.propertyIdentifier || flatValues.propertyIdentifier || "",
    sellerOccupying: allSteps["Property"]?.sellerOccupying ?? flatValues.sellerOccupying,
    appliances: mergedAppliances,
    systems: allSteps["Systems"]?.systems || flatValues.systems || {},
    inlineOptions: stripNulls(allSteps["Systems"]?.inlineOptions || flatValues.inlineOptions || {}),
    sewerSystem: stripNulls(allSteps["Systems"]?.sewerSystem || flatValues.sewerSystem || {}),
    page2Zoning: {
      ...stripNulls(allSteps["Zoning"]?.page2Zoning || flatValues.page2Zoning || {}),
      ...(mergedQuestions[2] && isUnset((allSteps["Zoning"]?.page2Zoning || flatValues.page2Zoning)?.historicalDistrict) ? {
        historicalDistrict: mergedQuestions[2] === "YES" ? "0" : mergedQuestions[2] === "NO" ? "1" : "2"
      } : {})
    },
    page2Flood: {
      ...stripNulls(allSteps["Zoning"]?.page2Flood || flatValues.page2Flood || {}),
      ...(mergedQuestions[4] && isUnset((allSteps["Zoning"]?.page2Flood || flatValues.page2Flood)?.q4) ? {
        q4: mergedQuestions[4] === "YES" ? "0" : mergedQuestions[4] === "NO" ? "1" : "2"
      } : {}),
      q5: normalizeYesNo((allSteps["Zoning"]?.page2Flood || flatValues.page2Flood || {}).q5) ?? (mergedQuestions[5] && (allSteps["Zoning"]?.page2Flood || flatValues.page2Flood)?.q5 == null ? mergedQuestions[5] : undefined),
      q6: normalizeYesNo((allSteps["Zoning"]?.page2Flood || flatValues.page2Flood || {}).q6) ?? (mergedQuestions[6] && (allSteps["Zoning"]?.page2Flood || flatValues.page2Flood)?.q6 == null ? mergedQuestions[6] : undefined)
    },
    questions: mergedQuestions,
    questionComments: mergedComments,
    q37Inline,
    q41Inline: {
      hoaAmount: q41.hoaAmount,
      specialAssessmentAmount: q41.specialAssessmentAmount,
      payableType: resolveFrequency(q41.frequency ?? q41.payableType),
      unpaid: q41.unpaid,
      ifYesAmount: q41.ifYesAmount,
      managerName: q41.managerName,
      phone: q41.managerPhone || q41.phone,
    },
    q46Inline: {
      amount: q46.amount,
      paidTo: q46.paidTo,
      payableType: resolveFrequency(q46.frequency ?? q46.payableType),
    },
    q47Details: {
      utilities: Array.isArray(q47.services)
        ? resolveUtilities(q47.services)
        : Array.isArray(q47.utilities)
        ? resolveUtilities(q47.utilities.map(String))
        : [],
      otherExplain: q47.other || q47.otherExplain,
      initialMembership: q47.initialMembershipFee || q47.initialMembership,
      annualMembership: q47.annualMembershipFee || q47.annualMembership,
    },
    page3TextFields: {
      roofAge: q16.roofAge,
      roofLayers: q16.layers,
      termiteBaitAnnualCost: q19.annualCost,
    },
    explanation: typeof flatValues.explanation === "string" ? flatValues.explanation : "",
    signatures: {
      ...(flatValues.signatures || {}),
      ...(allSteps["Signatures"]?.signatures || {}),
    },

    page1NotWorkingExplanation:
      allSteps["Appliances"]?.page1NotWorkingExplanation ||
      flatValues.page1NotWorkingExplanation || page1Notes || "",
    page2NotWorkingExplanation:
      allSteps["Appliances Continued"]?.page2NotWorkingExplanation ||
      flatValues.page2NotWorkingExplanation || page2Notes || "",
    additionalPages: allSteps["Financial"]?.additionalPages || flatValues.additionalPages,
    initials: allSteps["Property"]?.initials || flatValues.initials,
  };
}