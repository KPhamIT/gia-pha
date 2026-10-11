/**
 * Khung tiêu chí xem tuổi sinh con: mỗi tiêu chí so năm sinh của con với tuổi
 * một người (bố hoặc mẹ). Thêm tiêu chí = viết module mới + đăng ký trong `index.ts`.
 */
import type { Element } from "@/lib/xem-tuoi/can-chi";

export type ParentRole = "father" | "mother";

export type PairContext = {
  role: ParentRole;
  parentYear: number;
  childYear: number;
  parentCan: number;
  childCan: number;
  parentChi: number;
  childChi: number;
  parentMenh: { name: string; element: Element };
  childMenh: { name: string; element: Element };
};

export type PairStatus = "good" | "neutral" | "bad";

export type PairResult = {
  status: PairStatus;
  /** Điểm đạt được, từ 0 đến `maxScore`. */
  score: number;
  summary: string;
  detail: string;
};

export type PairCriterion = {
  key: string;
  label: string;
  /** Trọng số: điểm tối đa. Tổng của cả bố và mẹ được quy về thang 10. */
  maxScore: number;
  evaluate: (ctx: PairContext) => PairResult;
};
