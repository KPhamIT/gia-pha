/**
 * Khung tiêu chí chọn ngày — giống xem tuổi làm nhà: mỗi tiêu chí một module độc lập,
 * thêm tiêu chí = viết module mới + đăng ký trong `checks/index.ts`.
 */
import type { DayInfo } from "@/lib/lich/ngay";
import type { Truc } from "@/lib/lich/ngay";

export type ActivityKey =
  "dong-tho" | "nhap-trach" | "cuoi-hoi" | "khai-truong" | "xuat-hanh";

export type Activity = {
  key: ActivityKey;
  /** Trực hợp và trực kỵ cho việc này; trực còn lại là bình thường. */
  goodTruc: readonly Truc[];
  badTruc: readonly Truc[];
};

export type DayContext = {
  info: DayInfo;
  activity: Activity;
  /** Chi năm sinh gia chủ (0 = Tý), null nếu không xét tuổi. */
  ownerChi: number | null;
};

export type CheckStatus = "good" | "neutral" | "bad";

export type CheckResult = {
  status: CheckStatus;
  summary: string;
};

export type DayCheck = {
  key: string;
  label: string;
  /**
   * `score`: tốt +1, xấu −1 vào điểm ngày.
   * `filter`: chỉ loại ngày — phạm là ngày xấu, không phạm thì không cộng điểm.
   */
  kind: "score" | "filter";
  evaluate: (ctx: DayContext) => CheckResult;
};
