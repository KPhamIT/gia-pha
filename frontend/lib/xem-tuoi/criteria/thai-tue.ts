import { UI } from "@/lib/constants/ui-strings";
import type { Criterion } from "./types";

/** Trùng Thái Tuế: năm cùng chi với tuổi. Xung: chi đối xung (cách 6). */
export const thaiTue: Criterion = {
  key: "thai-tue",
  label: UI.XT_SECTION_THAI_TUE,
  maxScore: 1,
  note: UI.XT_THAI_TUE_NOTE,
  evaluate: ({ birthChi, yearChi }) => {
    const kind = birthChi === yearChi ? "trung" : (birthChi + 6) % 12 === yearChi ? "xung" : "khong";
    return {
      status: kind === "khong" ? "good" : "bad",
      score: kind === "khong" ? 1 : 0.25,
      summary: UI.XT_THAI_TUE[kind],
      details: [],
    };
  },
};
