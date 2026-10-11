import { diaChiPair } from "./dia-chi";
import { nguHanhPair } from "./ngu-hanh";
import { thienCanPair } from "./thien-can";
import type { PairCriterion } from "./types";

export type * from "./types";

/** Danh sách tiêu chí so tuổi con với bố/mẹ — thêm tiêu chí mới vào đây. */
export const PAIR_CRITERIA: readonly PairCriterion[] = [
  nguHanhPair,
  thienCanPair,
  diaChiPair,
];
