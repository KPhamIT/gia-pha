/**
 * Khung tiêu chí đặt tên con: mỗi tiêu chí một module, trả `null` khi không áp dụng
 * được (vd. chưa biết hành của tên) — khi đó không tính vào điểm.
 * Thêm tiêu chí = viết module mới + đăng ký trong `index.ts`.
 */
import type { Element } from "@/lib/xem-tuoi/can-chi";
import type { NameNumbers } from "../numerology";

export type NameContext = {
  fullName: string;
  given: string;
  middle: string;
  birth: { day: number; month: number; year: number };
  /** Năm âm lịch của ngày sinh (để lấy mệnh). */
  lunarYear: number;
  menh: { name: string; element: Element };
  givenElement: Element | null;
  middleElement: Element | null;
  numbers: NameNumbers | null;
  lifePath: number;
};

export type NameStatus = "good" | "neutral" | "bad";

export type NameResult = {
  status: NameStatus;
  score: number;
  summary: string;
  detail: string;
};

export type NameGroupKey = "phong-thuy" | "than-so";

export type NameCriterion = {
  key: string;
  label: string;
  group: NameGroupKey;
  maxScore: number;
  evaluate: (ctx: NameContext) => NameResult | null;
};
