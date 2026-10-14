import { UI } from "@/lib/constants/ui-strings";
import { CHI } from "../can-chi";
import type { Criterion } from "./types";

/** Nhóm tam hợp (theo chỉ số chi) → ba năm Tam Tai. */
const TAM_TAI: { group: number[]; years: number[] }[] = [
  { group: [8, 0, 4], years: [2, 3, 4] }, // Thân Tý Thìn → Dần Mão Thìn
  { group: [2, 6, 10], years: [8, 9, 10] }, // Dần Ngọ Tuất → Thân Dậu Tuất
  { group: [11, 3, 7], years: [5, 6, 7] }, // Hợi Mão Mùi → Tỵ Ngọ Mùi
  { group: [5, 9, 1], years: [11, 0, 1] }, // Tỵ Dậu Sửu → Hợi Tý Sửu
];

/** Ba chi năm Tam Tai của một tuổi. */
export const tamTaiYears = (birthChi: number) =>
  TAM_TAI.find((t) => t.group.includes(birthChi))!.years;

export const tamTai: Criterion = {
  key: "tam-tai",
  label: UI.XT_SECTION_TAM_TAI,
  maxScore: 2,
  evaluate: ({ birthChi, yearChi, yearCanChi }) => {
    const years = tamTaiYears(birthChi);
    const bad = years.includes(yearChi);
    return {
      status: bad ? "bad" : "good",
      score: bad ? 0 : 2,
      summary: bad ? UI.XT_TAM_TAI_YES(yearCanChi) : UI.XT_TAM_TAI_NO,
      details: [UI.XT_TAM_TAI_HOW(years.map((i) => CHI[i]).join(", "))],
      impact: bad ? UI.XT_TAM_TAI_IMPACT : undefined,
      advice: bad ? UI.XT_BAD_ADVICE : undefined,
    };
  },
};
