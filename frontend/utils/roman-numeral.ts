/** Chuyển số dương sang số La Mã (I, II, III…). Trả về chuỗi gốc nếu không hợp lệ. */
export function toRomanNumeral(value: number | string | null | undefined): string {
  if (value == null) return "";
  const n =
    typeof value === "number" ? value : Number.parseInt(String(value).trim(), 10);
  if (!Number.isFinite(n) || n <= 0 || n >= 4000) {
    const raw = String(value ?? "").trim();
    return raw;
  }

  const parts: Array<[number, string]> = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];

  let remaining = Math.floor(n);
  let out = "";
  for (const [unit, glyph] of parts) {
    while (remaining >= unit) {
      out += glyph;
      remaining -= unit;
    }
  }
  return out;
}
