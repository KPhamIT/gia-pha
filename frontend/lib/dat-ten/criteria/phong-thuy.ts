import { elementRelation, type ElementRelation } from "@/lib/xem-tuoi/can-chi";
import { UI } from "@/lib/constants/ui-strings";
import type { NameCriterion, NameStatus } from "./types";

type Scored = { score: number; status: NameStatus };

/** `elementRelation(mệnh, tên)`: "nam-sinh-menh" nghĩa là tên sinh mệnh. */
const MENH_TEN: Record<ElementRelation, Scored> = {
  "nam-sinh-menh": { score: 2, status: "good" },
  "binh-hoa": { score: 1.75, status: "good" },
  "menh-sinh-nam": { score: 1, status: "neutral" },
  "menh-khac-nam": { score: 0.75, status: "neutral" },
  "nam-khac-menh": { score: 0, status: "bad" },
};

/** Hành của tên chính so với mệnh nạp âm của con. */
export const menhTen: NameCriterion = {
  key: "menh-ten",
  label: UI.DT_CRIT_MENH_TEN,
  group: "phong-thuy",
  maxScore: 2,
  evaluate: ({ given, givenElement, menh }) => {
    if (!givenElement) return null;
    const relation = elementRelation(menh.element, givenElement);
    return {
      ...MENH_TEN[relation],
      summary: UI.DT_MENH_TEN[relation],
      detail: UI.DT_MENH_TEN_LINE(given, givenElement, menh.name),
    };
  },
};

/** `elementRelation(tên, đệm)`: "nam-sinh-menh" nghĩa là tên đệm sinh tên chính. */
const DEM_TEN: Record<ElementRelation, Scored> = {
  "nam-sinh-menh": { score: 1, status: "good" },
  "binh-hoa": { score: 0.75, status: "good" },
  "menh-sinh-nam": { score: 0.5, status: "neutral" },
  "menh-khac-nam": { score: 0.5, status: "neutral" },
  "nam-khac-menh": { score: 0, status: "bad" },
};

/** Tên đệm và tên chính nên tương sinh (đệm sinh tên) hoặc cùng hành. */
export const demTen: NameCriterion = {
  key: "dem-ten",
  label: UI.DT_CRIT_DEM_TEN,
  group: "phong-thuy",
  maxScore: 1,
  evaluate: ({ middle, given, middleElement, givenElement }) => {
    if (!middleElement || !givenElement) return null;
    const relation = elementRelation(givenElement, middleElement);
    return {
      ...DEM_TEN[relation],
      summary: UI.DT_DEM_TEN[relation],
      detail: UI.DT_DEM_TEN_LINE(middle, middleElement, given, givenElement),
    };
  },
};
