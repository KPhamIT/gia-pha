import { UI } from "@/lib/constants/ui-strings";
import type { DayCheck } from "./types";

/** 12 trực: mỗi việc có trực hợp, trực kỵ. */
export const truc: DayCheck = {
  key: "truc",
  label: UI.XN_CHECK_TRUC,
  kind: "score",
  evaluate: ({ info, activity }) => {
    const status = activity.goodTruc.includes(info.truc)
      ? "good"
      : activity.badTruc.includes(info.truc)
        ? "bad"
        : "neutral";
    return {
      status,
      summary: UI.XN_TRUC(info.truc, UI.XN_TRUC_MEANING[info.truc], status),
    };
  },
};
