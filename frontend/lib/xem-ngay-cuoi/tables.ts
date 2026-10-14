/**
 * Bảng tra cho xem ngày cưới hỏi. Tháng, ngày đều theo âm lịch Việt Nam.
 * Nguồn: "Nữ mệnh hành giá nguyệt" (Tam Liêu đại thông thư), "Giá thú Chu đường"
 * (Khâm định Hiệp kỷ biện phương thư, q.55), bảng Sát chủ – Thụ tử – Không phòng
 * trong lịch vạn sự Việt Nam.
 */
import { solarToLunar } from "@/lib/lich/am-lich";

/* ---------------- Tháng cưới theo tuổi cô dâu ---------------- */

export type MonthKind =
  | "dai-loi"
  | "tieu-loi"
  | "ong-co"
  | "phu-mau"
  | "phu-chu"
  | "nu-than";

export const MONTH_KINDS: readonly MonthKind[] = [
  "dai-loi",
  "tieu-loi",
  "ong-co",
  "phu-mau",
  "phu-chu",
  "nu-than",
];

/**
 * Theo cặp chi tuổi cô dâu (Tý-Ngọ, Sửu-Mùi, Dần-Thân, Mão-Dậu, Thìn-Tuất, Tỵ-Hợi):
 * tháng đầu của mỗi loại theo thứ tự `MONTH_KINDS`; tháng thứ hai = tháng đầu + 6.
 */
const MONTH_TABLE: readonly (readonly number[])[] = [
  [6, 1, 2, 3, 4, 5], // Tý, Ngọ
  [5, 4, 3, 2, 1, 6], // Sửu, Mùi
  [2, 3, 4, 5, 6, 1], // Dần, Thân
  [1, 6, 5, 4, 3, 2], // Mão, Dậu
  [4, 5, 6, 1, 2, 3], // Thìn, Tuất
  [3, 2, 1, 6, 5, 4], // Tỵ, Hợi
];

/** Loại tháng âm `lunarMonth` đối với cô dâu tuổi `brideChi`. */
export function monthKind(brideChi: number, lunarMonth: number): MonthKind {
  const first = ((lunarMonth - 1) % 6) + 1;
  return MONTH_KINDS[MONTH_TABLE[brideChi % 6].indexOf(first)];
}

/** Hai tháng âm ứng với một loại tháng của cô dâu, vd. đại lợi tuổi Tý → [6, 12]. */
export function monthsOf(brideChi: number, kind: MonthKind): [number, number] {
  const first = MONTH_TABLE[brideChi % 6][MONTH_KINDS.indexOf(kind)];
  return [first, first + 6];
}

/* ---------------- Chu đường giá thú ---------------- */

/** 8 cung Chu đường theo chiều thuận: Phu, Cô, Đường, Ông, Đệ, Táo, Phụ, Trù. */
export type ChuDuong =
  | "phu"
  | "co"
  | "duong"
  | "ong"
  | "de"
  | "tao"
  | "phu-dau"
  | "tru";

const CHU_DUONG: readonly ChuDuong[] = [
  "phu",
  "co",
  "duong",
  "ong",
  "de",
  "tao",
  "phu-dau",
  "tru",
];

/** Tháng đủ (đại nguyệt) đếm thuận từ Phu, tháng thiếu (tiểu nguyệt) đếm nghịch từ Phụ. */
export function chuDuong(lunarDay: number, bigMonth: boolean): ChuDuong {
  const step = lunarDay - 1;
  const index = bigMonth ? step % 8 : (((6 - step) % 8) + 8) % 8;
  return CHU_DUONG[index];
}

/** Tháng âm chứa ngày dương này có 30 ngày không. */
export function isBigLunarMonth(
  date: { day: number; month: number; year: number },
  lunarDay: number,
): boolean {
  const later = new Date(
    Date.UTC(date.year, date.month - 1, date.day + 30 - lunarDay),
  );
  return (
    solarToLunar(
      later.getUTCDate(),
      later.getUTCMonth() + 1,
      later.getUTCFullYear(),
    ).day === 30
  );
}

/* ---------------- Ngày bách kỵ theo tháng âm (chi ngày) ---------------- */

/** Sát chủ (âm): tháng Giêng ngày Tỵ, tháng 2 ngày Tý… (chỉ số chi, 0 = Tý). */
export const SAT_CHU = [5, 0, 7, 3, 8, 10, 1, 11, 6, 9, 2, 4];
/** Thụ tử: tháng Giêng ngày Tuất, tháng 2 ngày Thìn… */
export const THU_TU = [10, 4, 11, 5, 0, 6, 1, 7, 2, 8, 3, 9];
/**
 * Không phòng (kỵ giá thú) theo mùa: "Xuân Long Xà Thử, Hạ Khuyển Trư Dương,
 * Thu Mã Thố Dần, Đông Kê Hầu Sửu".
 */
export const KHONG_PHONG = [
  [4, 5, 0],
  [10, 11, 7],
  [6, 3, 2],
  [9, 8, 1],
];

/* ---------------- Quan hệ địa chi ---------------- */

export const isLucXung = (a: number, b: number) => (a - b + 12) % 12 === 6;
export const isLucHop = (a: number, b: number) => (a + b) % 12 === 1;
export const isTamHop = (a: number, b: number) => a !== b && a % 4 === b % 4;
