import { UI } from "@/lib/constants/ui-strings";
import { CAN } from "../can-chi";
import type { Criterion } from "./types";

/**
 * Thiên can năm so với can tuổi: cách 5 là hợp (Giáp–Kỷ, Ất–Canh, Bính–Tân,
 * Đinh–Nhâm, Mậu–Quý); cách 6 là xung (Giáp–Canh, Ất–Tân, Bính–Nhâm, Đinh–Quý).
 */
export const thienCan: Criterion = {
  key: "thien-can",
  label: UI.XT_SECTION_THIEN_CAN,
  maxScore: 1,
  note: UI.XT_THAI_TUE_NOTE,
  evaluate: ({ birthCan, yearCan }) => {
    const diff = Math.abs(birthCan - yearCan);
    const kind = diff === 5 ? "hop" : diff === 6 ? "xung" : "binh";
    return {
      status: kind === "hop" ? "good" : kind === "xung" ? "bad" : "neutral",
      score: kind === "hop" ? 1 : kind === "xung" ? 0 : 0.5,
      summary: UI.XT_THIEN_CAN[kind],
      details: [UI.XT_THIEN_CAN_LINE(CAN[birthCan], CAN[yearCan])],
    };
  },
};
