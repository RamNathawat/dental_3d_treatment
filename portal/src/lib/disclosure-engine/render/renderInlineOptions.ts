import { PDFPage, PDFFont } from "pdf-lib";
import * as raw from "../../../forms/orec/2026/layout";
import { DisclosureInput } from "../schema/disclosure.schema";

export function renderInlineOptions(
  pages: PDFPage[],
  font: PDFFont,
  data: DisclosureInput
) {
  if (!data.inlineOptions) return;

  const page = pages[0];

  const resolveRowY = (i: number) => {
    const baseY = raw.APPLIANCE_FIRST_ROW_Y - i * raw.APPLIANCE_ROW_SPACING;
    return i === 9 ? 202.5 : i > 9 ? baseY - 12.5 : baseY;
  };

  const drawInline = (
    rowIndex: number,
    firstX: number,
    deltas: number[],
    selectedIndex?: number | null
  ) => {
    if (selectedIndex === undefined || selectedIndex === null) return;

    const y = resolveRowY(rowIndex);

    const idx = selectedIndex - 1;
    const x =
      selectedIndex === 0 || typeof deltas[idx] !== "number"
        ? firstX
        : firstX + deltas[idx];

    if (Number.isNaN(x)) return;

    page.drawText("X", {
      x,
      y,
      size: raw.CHECKBOX_SIZE,
      font,
    });
  };

  drawInline(
    raw.WATER_HEATER_INLINE.rowIndex,
    raw.WATER_HEATER_INLINE.firstX,
    [
      raw.WATER_HEATER_INLINE.deltaToSecond,
      raw.WATER_HEATER_INLINE.deltaToThird,
    ],
    data.inlineOptions.waterHeaterType
  );

  drawInline(
    raw.WATER_SOFTENER_INLINE.rowIndex,
    raw.WATER_SOFTENER_INLINE.firstX,
    [raw.WATER_SOFTENER_INLINE.deltaToSecond],
    data.inlineOptions.waterSoftenerType
  );

  drawInline(
    raw.AC_INLINE.rowIndex,
    raw.AC_INLINE.firstX,
    [raw.AC_INLINE.deltaToSecond, raw.AC_INLINE.deltaToThird],
    data.inlineOptions.acType
  );

  drawInline(
    raw.HEATING_INLINE.rowIndex,
    raw.HEATING_INLINE.firstX,
    [raw.HEATING_INLINE.deltaToSecond, raw.HEATING_INLINE.deltaToThird],
    data.inlineOptions.heatingType
  );

  drawInline(
    raw.GAS_SUPPLY_INLINE.rowIndex,
    raw.GAS_SUPPLY_INLINE.firstX,
    [raw.GAS_SUPPLY_INLINE.deltaToSecond, raw.GAS_SUPPLY_INLINE.deltaToThird],
    data.inlineOptions.gasSupplyType
  );

  drawInline(
    raw.PROPANE_TANK_INLINE.rowIndex,
    raw.PROPANE_TANK_INLINE.firstX,
    [raw.PROPANE_TANK_INLINE.deltaToSecond],
    data.inlineOptions.propaneTankType
  );
}