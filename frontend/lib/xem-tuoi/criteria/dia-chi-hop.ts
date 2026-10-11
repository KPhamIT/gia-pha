import { UI } from "@/lib/constants/ui-strings";
import { CHI } from "../can-chi";
import type { Criterion } from "./types";

export const TAM_HOP = [
  [8, 0, 4], // Thân Tý Thìn
  [2, 6, 10], // Dần Ngọ Tuất
  [11, 3, 7], // Hợi Mão Mùi
  [5, 9, 1], // Tỵ Dậu Sửu
];

/** Lục hợp: Tý–Sửu, Dần–Hợi, Mão–Tuất, Thìn–Dậu, Tỵ–Thân, Ngọ–Mùi. */
export const LUC_HOP: Record<number, number> = {
  0: 1,
  1: 0,
  2: 11,
  11: 2,
  3: 10,
  10: 3,
  4: 9,
  9: 4,
  5: 8,
  8: 5,
  6: 7,
  7: 6,
};

/**
 * Năm tam hợp / lục hợp với tuổi được cộng điểm. Không xét xung, trùng ở đây
 * (đã có tiêu chí Thái Tuế) để khỏi tính hai lần.
 */
export const diaChiHop: Criterion = {
  key: "dia-chi-hop",
  label: UI.XT_SECTION_DIA_CHI,
  maxScore: 1,
  note: UI.XT_THAI_TUE_NOTE,
  evaluate: ({ birthChi, yearChi }) => {
    const tamHop =
      birthChi !== yearChi &&
      TAM_HOP.some((g) => g.includes(birthChi) && g.includes(yearChi));
    const lucHop = LUC_HOP[birthChi] === yearChi;
    const kind = tamHop ? "tam-hop" : lucHop ? "luc-hop" : "khong";
    return {
      status: kind === "khong" ? "neutral" : "good",
      score: kind === "khong" ? 0.5 : 1,
      summary: UI.XT_DIA_CHI[kind],
      details: [UI.XT_DIA_CHI_LINE(CHI[birthChi], CHI[yearChi])],
    };
  },
};
