export function flattenObject(
  obj: any,
  parentKey = "",
  result: Record<string, any> = {}
): Record<string, any> {

  for (const key in obj) {
    const value = obj[key];
    const newKey = parentKey ? `${parentKey}.${key}` : key;

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      flattenObject(value, newKey, result);
    } else {
      result[newKey] = value;
    }
  }

  return result;
}