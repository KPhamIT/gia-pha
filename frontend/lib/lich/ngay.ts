import { CAN, CHI } from "@/lib/xem-tuoi/can-chi";
import {
  jdFromDate,
  solarToLunar,
  sunLongitudeAtDayEnd,
  type LunarDate,
} from "./am-lich";

/** 12 thần trực ngày/giờ, bắt đầu từ Thanh Long; `good` = hoàng đạo. */
export const THAN = [
  { name: "Thanh Long", good: true },
  { name: "Minh Đường", good: true },
  { name: "Thiên Hình", good: false },
  { name: "Chu Tước", good: false },
  { name: "Kim Quỹ", good: true },
  { name: "Thiên Đức", good: true },
  { name: "Bạch Hổ", good: false },
  { name: "Ngọc Đường", good: true },
  { name: "Thiên Lao", good: false },
  { name: "Huyền Vũ", good: false },
  { name: "Tư Mệnh", good: true },
  { name: "Câu Trận", good: false },
] as const;

/** 12 trực, Kiến rơi vào ngày có chi trùng chi của tháng (theo tiết khí). */
export const TRUC = [
  "Kiến",
  "Trừ",
  "Mãn",
  "Bình",
  "Định",
  "Chấp",
  "Phá",
  "Nguy",
  "Thành",
  "Thu",
  "Khai",
  "Bế",
] as const;
export type Truc = (typeof TRUC)[number];

/** 24 tiết khí, bắt đầu từ Xuân Phân (kinh độ mặt trời 0°), mỗi tiết 15°. */
const TIET_KHI = [
  "Xuân Phân",
  "Thanh Minh",
  "Cốc Vũ",
  "Lập Hạ",
  "Tiểu Mãn",
  "Mang Chủng",
  "Hạ Chí",
  "Tiểu Thử",
  "Đại Thử",
  "Lập Thu",
  "Xử Thử",
  "Bạch Lộ",
  "Thu Phân",
  "Hàn Lộ",
  "Sương Giáng",
  "Lập Đông",
  "Tiểu Tuyết",
  "Đại Tuyết",
  "Đông Chí",
  "Tiểu Hàn",
  "Đại Hàn",
  "Lập Xuân",
  "Vũ Thủy",
  "Kinh Trập",
] as const;

export type DayInfo = {
  date: { day: number; month: number; year: number };
  lunar: LunarDate;
  /** Thứ trong tuần, 0 = Chủ nhật. */
  weekday: number;
  dayChi: number;
  dayCanChi: string;
  monthCanChi: string;
  yearCanChi: string;
  tietKhi: string;
  truc: Truc;
  than: (typeof THAN)[number];
};

const mod = (n: number, m: number) => ((n % m) + m) % m;

/** Chi khởi Thanh Long theo chi tháng (ngày) hoặc chi ngày (giờ): Tý/Ngọ → Thân, Sửu/Mùi → Tuất… */
const thanStart = (chi: number) => mod(8 + 2 * (chi % 6), 12);

export function dayInfo(day: number, month: number, year: number): DayInfo {
  const jd = jdFromDate(day, month, year);
  const lunar = solarToLunar(day, month, year);
  const sun = sunLongitudeAtDayEnd(jd);
  // Tháng tiết: Lập Xuân (315°) mở đầu tháng Dần.
  const monthChi = mod(2 + Math.floor(mod(sun - 315, 360) / 30), 12);
  const dayChi = mod(jd + 1, 12);
  const monthCan = mod(lunar.year * 12 + lunar.month + 3, 10);
  return {
    date: { day, month, year },
    lunar,
    weekday: mod(jd + 1, 7),
    dayChi,
    dayCanChi: `${CAN[mod(jd + 9, 10)]} ${CHI[dayChi]}`,
    monthCanChi: `${CAN[monthCan]} ${CHI[mod(lunar.month + 1, 12)]}`,
    yearCanChi: `${CAN[mod(lunar.year + 6, 10)]} ${CHI[mod(lunar.year + 8, 12)]}`,
    tietKhi: TIET_KHI[Math.floor(sun / 15)],
    truc: TRUC[mod(dayChi - monthChi, 12)],
    // Thanh Long của tháng: Dần/Thân → Tý, Mão/Dậu → Dần… (cùng quy tắc với giờ).
    than: THAN[mod(dayChi - thanStart(monthChi), 12)],
  };
}

export type HourInfo = {
  chi: string;
  range: string;
  than: (typeof THAN)[number];
};

/** 12 giờ trong ngày với thần trực; giờ hoàng đạo là giờ có `than.good`. */
export function hoursOfDay(dayChi: number): HourInfo[] {
  return CHI.map((chi, i) => ({
    chi,
    range: `${String(mod(2 * i - 1, 24)).padStart(2, "0")}h–${String(2 * i + 1).padStart(2, "0")}h`,
    than: THAN[mod(i - thanStart(dayChi), 12)],
  }));
}

/** Số ngày của tháng dương lịch. */
export const daysInMonth = (month: number, year: number) =>
  new Date(year, month, 0).getDate();
