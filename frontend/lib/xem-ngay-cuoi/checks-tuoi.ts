/** Tiêu chí theo tuổi cô dâu, chú rể: lục xung (loại ngày), lục hợp / tam hợp (cộng điểm). */
import { CHI } from "@/lib/xem-tuoi/can-chi";
import { UI } from "@/lib/constants/ui-strings";
import { isLucHop, isLucXung, isTamHop } from "./tables";
import type { WeddingCheck } from "./types";

export const xungTuoi: WeddingCheck = {
  key: "xung-tuoi",
  label: UI.XC_CHECK_XUNG,
  kind: "filter",
  evaluate: ({ info, brideChi, groomChi }) => {
    const hits = [
      isLucXung(info.dayChi, brideChi) && UI.XC_BRIDE(CHI[brideChi]),
      isLucXung(info.dayChi, groomChi) && UI.XC_GROOM(CHI[groomChi]),
    ].filter(Boolean) as string[];
    return hits.length
      ? { status: "bad", summary: UI.XC_XUNG(CHI[info.dayChi], hits) }
      : { status: "good", summary: UI.XC_XUNG_NONE };
  },
};

export const hopTuoi: WeddingCheck = {
  key: "hop-tuoi",
  label: UI.XC_CHECK_HOP,
  kind: "score",
  evaluate: ({ info, brideChi, groomChi }) => {
    const hop = (chi: number) =>
      isLucHop(info.dayChi, chi)
        ? UI.XC_LUC_HOP
        : isTamHop(info.dayChi, chi)
          ? UI.XC_TAM_HOP
          : null;
    const hits = [
      hop(brideChi) && `${UI.XC_BRIDE(CHI[brideChi])} (${hop(brideChi)})`,
      hop(groomChi) && `${UI.XC_GROOM(CHI[groomChi])} (${hop(groomChi)})`,
    ].filter(Boolean) as string[];
    return hits.length
      ? { status: "good", summary: UI.XC_HOP(CHI[info.dayChi], hits) }
      : { status: "neutral", summary: UI.XC_HOP_NONE };
  },
};
