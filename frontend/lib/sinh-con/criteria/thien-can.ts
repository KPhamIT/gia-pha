import { CAN } from "@/lib/xem-tuoi/can-chi";
import { UI } from "@/lib/constants/ui-strings";
import type { PairCriterion } from "./types";

/** Can cách 5 là hợp (Giáp–Kỷ…), cách 6 là xung (Giáp–Canh…). */
export const thienCanPair: PairCriterion = {
  key: "thien-can",
  label: UI.SC_SECTION_THIEN_CAN,
  maxScore: 1,
  evaluate: ({ role, parentCan, childCan }) => {
    const diff = Math.abs(parentCan - childCan);
    const kind = diff === 5 ? "hop" : diff === 6 ? "xung" : "binh";
    return {
      status: kind === "hop" ? "good" : kind === "xung" ? "bad" : "neutral",
      score: kind === "hop" ? 1 : kind === "xung" ? 0 : 0.5,
      summary: UI.SC_THIEN_CAN[kind],
      detail: UI.SC_CAN_LINE(UI.SC_ROLE[role], CAN[parentCan], CAN[childCan]),
    };
  },
};
