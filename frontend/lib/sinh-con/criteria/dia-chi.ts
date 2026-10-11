import { CHI } from "@/lib/xem-tuoi/can-chi";
import { LUC_HOP, TAM_HOP } from "@/lib/xem-tuoi/criteria/dia-chi-hop";
import { UI } from "@/lib/constants/ui-strings";
import type { PairCriterion, PairResult } from "./types";

type Kind = "tam-hop" | "luc-hop" | "luc-xung" | "tu-hanh-xung" | "binh";

const RESULT: Record<Kind, Pick<PairResult, "status" | "score">> = {
  "tam-hop": { status: "good", score: 1 },
  "luc-hop": { status: "good", score: 1 },
  binh: { status: "neutral", score: 0.5 },
  "tu-hanh-xung": { status: "bad", score: 0.25 },
  "luc-xung": { status: "bad", score: 0 },
};

/**
 * Con giáp của con so với bố/mẹ: tam hợp, lục hợp là tốt; lục xung (cách 6) và
 * tứ hành xung (cách 3 trong cùng nhóm Tý–Ngọ–Mão–Dậu…) là xấu.
 */
export const diaChiPair: PairCriterion = {
  key: "dia-chi",
  label: UI.SC_SECTION_DIA_CHI,
  maxScore: 1,
  evaluate: ({ role, parentChi, childChi }) => {
    const diff = Math.abs(parentChi - childChi);
    const kind: Kind =
      parentChi !== childChi &&
      TAM_HOP.some((g) => g.includes(parentChi) && g.includes(childChi))
        ? "tam-hop"
        : LUC_HOP[parentChi] === childChi
          ? "luc-hop"
          : diff === 6
            ? "luc-xung"
            : diff === 3 || diff === 9
              ? "tu-hanh-xung"
              : "binh";
    return {
      ...RESULT[kind],
      summary: UI.SC_DIA_CHI[kind],
      detail: UI.SC_CHI_LINE(UI.SC_ROLE[role], CHI[parentChi], CHI[childChi]),
    };
  },
};
