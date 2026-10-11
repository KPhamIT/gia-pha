import { UI } from "@/lib/constants/ui-strings";
import { diaChiHop } from "./dia-chi-hop";
import { hoangOc } from "./hoang-oc";
import { kimLau } from "./kim-lau";
import { nguHanh } from "./ngu-hanh";
import { saoChieuMenh } from "./sao-chieu-menh";
import { tamTai } from "./tam-tai";
import { thaiTue } from "./thai-tue";
import { thienCan } from "./thien-can";
import type { Criterion, CriterionGroup } from "./types";
import { vanHan } from "./van-han";

/**
 * Các nhóm tiêu chí, theo thứ tự hiển thị.
 * Thêm tiêu chí mới: tạo module trả về `Criterion` rồi thêm vào nhóm phù hợp
 * (hoặc tạo nhóm mới) — giao diện, bảng 10 năm và tổng điểm tự cập nhật.
 */
export const CRITERIA_GROUPS: readonly CriterionGroup[] = [
  {
    key: "han-chinh",
    label: UI.XT_GROUP_HAN_CHINH,
    description: UI.XT_GROUP_HAN_CHINH_DESC,
    criteria: [kimLau, hoangOc, tamTai],
  },
  {
    key: "tuoi-hop-nam",
    label: UI.XT_GROUP_TUOI_HOP,
    description: UI.XT_GROUP_TUOI_HOP_DESC,
    criteria: [thaiTue, thienCan, diaChiHop, nguHanh],
  },
  {
    key: "sao-han",
    label: UI.XT_GROUP_SAO_HAN,
    description: UI.XT_GROUP_SAO_HAN_DESC,
    criteria: [saoChieuMenh, vanHan],
  },
];

/** Danh sách phẳng mọi tiêu chí (theo thứ tự nhóm). */
export const CRITERIA: readonly Criterion[] = CRITERIA_GROUPS.flatMap((g) => g.criteria);

export type {
  BuildContext,
  Criterion,
  CriterionGroup,
  CriterionResult,
  CriterionStatus,
  CriterionVisual,
  Gender,
} from "./types";
