import { UI } from "@/lib/constants/ui-strings";
import type { Criterion } from "./types";

export const HOANG_OC_CUNG = [
  { label: "Nhất Cát", good: true },
  { label: "Nhì Nghi", good: true },
  { label: "Tam Địa Sát", good: false },
  { label: "Tứ Tấn Tài", good: true },
  { label: "Ngũ Thọ Tử", good: false },
  { label: "Lục Hoang Ốc", good: false },
] as const;

/** 10 tuổi ở Nhất Cát, mỗi chục tiến một cung, tuổi lẻ đếm tiếp. Dưới 10 không xét. */
export function hoangOcIndex(age: number): number | null {
  if (age < 10) return null;
  return (Math.floor(age / 10) - 1 + (age % 10)) % 6;
}

export const hoangOc: Criterion = {
  key: "hoang-oc",
  label: UI.XT_SECTION_HOANG_OC,
  maxScore: 3,
  evaluate: ({ age }) => {
    const index = hoangOcIndex(age);
    if (index == null) {
      return { status: "neutral", score: 3, summary: UI.XT_HOANG_OC_YOUNG, details: [] };
    }
    const cung = HOANG_OC_CUNG[index];
    return {
      status: cung.good ? "good" : "bad",
      score: cung.good ? 3 : 0,
      summary: `${cung.label} — ${UI.XT_HOANG_OC_MEANING[index]}`,
      details: [UI.XT_HOANG_OC_HOW],
      visual: { kind: "hoang-oc-ring", activeIndex: index },
      shortLabel: cung.label,
    };
  },
};
