import { hoangDao } from "./hoang-dao";
import { ngayKy } from "./ngay-ky";
import { truc } from "./truc";
import { xungTuoi } from "./xung-tuoi";
import type { DayCheck } from "./types";

export type * from "./types";

/** Danh sách tiêu chí chọn ngày — thêm tiêu chí mới vào đây. */
export const DAY_CHECKS: readonly DayCheck[] = [
  hoangDao,
  truc,
  ngayKy,
  xungTuoi,
];
