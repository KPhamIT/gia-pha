import { UI } from "@/lib/constants/ui-strings";
import type { Criterion } from "./types";

type KimLauKind = keyof typeof UI.XT_KIM_LAU;

/** Tuổi mụ chia 9 dư 1, 3, 6, 8 là phạm Kim Lâu (Thân, Thê, Tử, Lục Súc). */
const BY_REMAINDER: Record<number, KimLauKind> = { 1: "than", 3: "the", 6: "tu", 8: "luc-suc" };

export const kimLau: Criterion = {
  key: "kim-lau",
  label: UI.XT_SECTION_KIM_LAU,
  maxScore: 3,
  evaluate: ({ age }) => {
    const kind = BY_REMAINDER[age % 9] ?? "khong";
    const bad = kind !== "khong";
    return {
      status: bad ? "bad" : "good",
      score: bad ? 0 : 3,
      summary: UI.XT_KIM_LAU[kind],
      details: [UI.XT_KIM_LAU_HOW(age)],
    };
  },
};
