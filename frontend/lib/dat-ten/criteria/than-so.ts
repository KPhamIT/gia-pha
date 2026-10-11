import { UI } from "@/lib/constants/ui-strings";
import { formatNumber, harmony, type Harmony } from "../numerology";
import type { NameCriterion, NameStatus } from "./types";

const SCORED: Record<Harmony, { ratio: number; status: NameStatus }> = {
  trung: { ratio: 1, status: "good" },
  hop: { ratio: 0.8, status: "good" },
  binh: { ratio: 0.4, status: "neutral" },
};

/** Số sứ mệnh (từ họ tên) so với số chủ đạo (từ ngày sinh). */
export const suMenh: NameCriterion = {
  key: "su-menh",
  label: UI.DT_CRIT_SU_MENH,
  group: "than-so",
  maxScore: 1.5,
  evaluate: ({ numbers, lifePath }) => {
    if (!numbers) return null;
    const h = harmony(numbers.destiny, lifePath);
    return {
      status: SCORED[h].status,
      score: SCORED[h].ratio * 1.5,
      summary: UI.DT_HARMONY(UI.DT_NUM_LABEL.destiny, h),
      detail: UI.DT_NUM_LINE(
        UI.DT_NUM_LABEL.destiny,
        formatNumber(numbers.destiny),
        formatNumber(lifePath),
      ),
    };
  },
};

/** Số linh hồn (nguyên âm trong tên) so với số chủ đạo. */
export const linhHon: NameCriterion = {
  key: "linh-hon",
  label: UI.DT_CRIT_LINH_HON,
  group: "than-so",
  maxScore: 1,
  evaluate: ({ numbers, lifePath }) => {
    if (!numbers) return null;
    const h = harmony(numbers.soul, lifePath);
    return {
      status: SCORED[h].status,
      score: SCORED[h].ratio,
      summary: UI.DT_HARMONY(UI.DT_NUM_LABEL.soul, h),
      detail: UI.DT_NUM_LINE(
        UI.DT_NUM_LABEL.soul,
        formatNumber(numbers.soul),
        formatNumber(lifePath),
      ),
    };
  },
};
