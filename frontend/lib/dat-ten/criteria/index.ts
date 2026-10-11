import { demTen, menhTen } from "./phong-thuy";
import { linhHon, suMenh } from "./than-so";
import type { NameCriterion, NameGroupKey } from "./types";

export type * from "./types";

/** Danh sách tiêu chí đặt tên — thêm tiêu chí mới vào đây. */
export const NAME_CRITERIA: readonly NameCriterion[] = [
  menhTen,
  demTen,
  suMenh,
  linhHon,
];

export const NAME_GROUPS: readonly NameGroupKey[] = ["phong-thuy", "than-so"];
