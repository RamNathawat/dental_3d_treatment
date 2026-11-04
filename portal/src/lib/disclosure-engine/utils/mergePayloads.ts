export function mergePayloads(stepsArray: any[]) {
  const result: any = {};
  stepsArray.forEach((stepVals) => {
    if (!stepVals || typeof stepVals !== "object") return;
    
    Object.keys(stepVals).forEach((key) => {
      const val = stepVals[key];
      if (Array.isArray(val)) {
        if (!result[key] || !Array.isArray(result[key])) result[key] = [];
        val.forEach((item, index) => {
          if (item !== undefined && item !== null) {
            result[key][index] = item;
          }
        });
      } else if (typeof val === "object" && val !== null) {
        result[key] = { ...(result[key] || {}), ...val };
      } else {
        result[key] = val;
      }
    });
  });
  return result;
}
