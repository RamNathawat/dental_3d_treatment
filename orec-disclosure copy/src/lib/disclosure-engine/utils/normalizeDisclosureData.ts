export function normalizeYesNo(value: any): "YES" | "NO" | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  if (value === "YES" || value === "NO") return value;
  if (value === 0 || value === "0") return "YES";
  if (value === 1 || value === "1") return "NO";
  const v = String(value).toUpperCase();
  return v === "YES" || v === "NO" ? (v as "YES" | "NO") : undefined;
}

export function toNum(v: any): number | undefined {
  if (v === null || v === undefined || v === "") return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}

function deepStripNulls(obj: any): any {
  if (obj === null) return undefined;
  if (typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => (item === null ? undefined : deepStripNulls(item)));
  }

  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null) {
      const stripped = deepStripNulls(value);
      if (stripped !== undefined) {
        result[key] = stripped;
      }
    }
  }
  return result;
}

function normalizeIndexedRecord<T>(obj: unknown): Record<number, T> | undefined {
  if (!obj) return undefined;

  if (typeof obj === "object" && !Array.isArray(obj)) {
    const entries = Object.entries(obj as Record<string, T>)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .map(([key, value]) => [Number(key), value] as const)
      .filter(([key]) => !Number.isNaN(key));

    return entries.length ? Object.fromEntries(entries) : undefined;
  }

  if (Array.isArray(obj)) {
    const entries = obj
      .map((value, index) => [index, value] as const)
      .filter(([, value]) => value !== undefined && value !== null && value !== "");

    return entries.length ? Object.fromEntries(entries) : undefined;
  }

  return undefined;
}

export function normalizeDisclosureData(rawData: any): Record<string, any> {
  const data = deepStripNulls(rawData || {});

  const questions = normalizeIndexedRecord<string>(data.questions) || {};

  const page2Zoning = { ...(data.page2Zoning || {}), ...(data.Zoning?.page2Zoning || {}) };
  if (questions[2] && page2Zoning.historicalDistrict === undefined) {
    page2Zoning.historicalDistrict = questions[2] === "YES" ? "0" : questions[2] === "NO" ? "1" : "2";
  }
  page2Zoning.historicalDistrict = toNum(page2Zoning.historicalDistrict);

  const page2Flood = { ...(data.page2Flood || {}), ...(data.Zoning?.page2Flood || {}) };
  if (questions[4] && page2Flood.q4 === undefined) {
    page2Flood.q4 = questions[4] === "YES" ? "0" : questions[4] === "NO" ? "1" : "2";
  }
  page2Flood.q3Main = toNum(page2Flood.q3Main);
  page2Flood.q3Municipal = toNum(page2Flood.q3Municipal);
  page2Flood.q4 = toNum(page2Flood.q4);
  
  if (Array.isArray(page2Flood.q3Types)) {
    page2Flood.q3Types = page2Flood.q3Types.map(toNum).filter((v: any) => v !== undefined);
  }

  const q5 = normalizeYesNo(page2Flood.q5) ?? (questions[5] ? questions[5] : undefined);
  if (q5 !== undefined) page2Flood.q5 = q5;

  const q6 = normalizeYesNo(page2Flood.q6) ?? (questions[6] ? questions[6] : undefined);
  if (q6 !== undefined) page2Flood.q6 = q6;

  const inlineOptions = { ...(data.inlineOptions || {}), ...(data.Systems?.inlineOptions || {}) };
  inlineOptions.waterHeaterType = toNum(inlineOptions.waterHeaterType);
  inlineOptions.waterSoftenerType = toNum(inlineOptions.waterSoftenerType);
  inlineOptions.acType = toNum(inlineOptions.acType);
  inlineOptions.heatingType = toNum(inlineOptions.heatingType);
  inlineOptions.gasSupplyType = toNum(inlineOptions.gasSupplyType);
  inlineOptions.propaneTankType = toNum(inlineOptions.propaneTankType);
  inlineOptions.generatorType = toNum(inlineOptions.generatorType);
  inlineOptions.waterSourceType = toNum(inlineOptions.waterSourceType);
  inlineOptions.securitySystemType = toNum(inlineOptions.securitySystemType);
  inlineOptions.solarPanelType = toNum(inlineOptions.solarPanelType);

  const sewerSystem = { ...(data.sewerSystem || {}), ...(data.Systems?.sewerSystem || {}) };
  sewerSystem.type = toNum(sewerSystem.type);
  sewerSystem.privateType = toNum(sewerSystem.privateType);

  const appliances = normalizeIndexedRecord<string>(data.appliances || data.Appliances?.appliances || data.Appliances) || {};

  const applianceCommentText = data.applianceComments
    ? Object.entries(data.applianceComments)
        .map(([k, v]) =>
          typeof v === "string" && v.trim()
            ? `Appliance ${Number(k) + 1}: ${v.trim()}`
            : null
        )
        .filter(Boolean)
        .join("\n")
    : undefined;

  return {
    ...data,
    appliances,
    questions,
    page2Zoning: Object.keys(page2Zoning).length ? page2Zoning : undefined,
    page2Flood: Object.keys(page2Flood).length ? page2Flood : undefined,
    inlineOptions: Object.keys(inlineOptions).length ? inlineOptions : undefined,
    sewerSystem: Object.keys(sewerSystem).length ? sewerSystem : undefined,
    sellerOccupying: toNum(data.sellerOccupying),
    q37Inline: toNum(data.q37Inline),
    page1NotWorkingExplanation: data.page1NotWorkingExplanation || applianceCommentText || "",
    page2NotWorkingExplanation: data.page2NotWorkingExplanation || "",
  };
}
