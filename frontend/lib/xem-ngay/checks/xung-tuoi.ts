import { CHI } from "@/lib/xem-tuoi/can-chi";
import { UI } from "@/lib/constants/ui-strings";
import type { DayCheck } from "./types";

/** Chi ngày lục xung với chi tuổi gia chủ (vd. ngày Ngọ xung tuổi Tý). */
export const xungTuoi: DayCheck = {
  key: "xung-tuoi",
  label: UI.XN_CHECK_XUNG,
  kind: "filter",
  evaluate: ({ info, ownerChi }) => {
    if (ownerChi === null)
      return { status: "neutral", summary: UI.XN_XUNG_SKIP };
    const xung = (info.dayChi - ownerChi + 12) % 12 === 6;
    return xung
      ? { status: "bad", summary: UI.XN_XUNG(CHI[info.dayChi], CHI[ownerChi]) }
      : { status: "good", summary: UI.XN_XUNG_NONE(CHI[ownerChi]) };
  },
};
