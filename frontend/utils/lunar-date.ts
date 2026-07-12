import { Lunar } from "lunar-javascript";

export type LunarDayMonth = {
  day: number;
  month: number;
};

/** YYYY-MM-DD (dương) → ngày/tháng âm (tháng nhuận = số âm). */
export function solarYmdToLunarDayMonth(ymd: string): LunarDayMonth | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (!y || !m || !d) return null;
  const lunar = Lunar.fromDate(new Date(y, m - 1, d));
  return { day: lunar.getDay(), month: lunar.getMonth() };
}

export const LUNAR_MONTH_OPTIONS: readonly { value: number; label: string }[] =
  [
    { value: 1, label: "Tháng Giêng" },
    { value: 2, label: "Tháng Hai" },
    { value: 3, label: "Tháng Ba" },
    { value: 4, label: "Tháng Tư" },
    { value: 5, label: "Tháng Năm" },
    { value: 6, label: "Tháng Sáu" },
    { value: 7, label: "Tháng Bảy" },
    { value: 8, label: "Tháng Tám" },
    { value: 9, label: "Tháng Chín" },
    { value: 10, label: "Tháng Mười" },
    { value: 11, label: "Tháng Mười một" },
    { value: 12, label: "Tháng Chạp" },
    { value: -1, label: "Nhuận Giêng" },
    { value: -2, label: "Nhuận Hai" },
    { value: -3, label: "Nhuận Ba" },
    { value: -4, label: "Nhuận Tư" },
    { value: -5, label: "Nhuận Năm" },
    { value: -6, label: "Nhuận Sáu" },
    { value: -7, label: "Nhuận Bảy" },
    { value: -8, label: "Nhuận Tám" },
    { value: -9, label: "Nhuận Chín" },
    { value: -10, label: "Nhuận Mười" },
    { value: -11, label: "Nhuận Mười một" },
    { value: -12, label: "Nhuận Chạp" },
  ];

export const LUNAR_DAY_OPTIONS: readonly number[] = Array.from(
  { length: 30 },
  (_, i) => i + 1,
);
