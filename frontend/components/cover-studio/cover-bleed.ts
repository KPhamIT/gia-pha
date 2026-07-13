/** Khổ cắt A4 (trim) và bleed cho in bìa cứng. */

export const TRIM_WIDTH_MM = 210;
export const TRIM_HEIGHT_MM = 297;
export const DEFAULT_BLEED_MM = 3;
export const SAFE_MARGIN_MM = 5;
export const BLEED_OPTIONS_MM = [0, 3, 5] as const;

export type BleedMm = (typeof BLEED_OPTIONS_MM)[number];

export function sheetSizeMm(bleedMm: number): { width: number; height: number } {
  const bleed = Math.max(0, bleedMm);
  return {
    width: TRIM_WIDTH_MM + bleed * 2,
    height: TRIM_HEIGHT_MM + bleed * 2,
  };
}

export function isBleedMm(value: number): value is BleedMm {
  return (BLEED_OPTIONS_MM as readonly number[]).includes(value);
}
