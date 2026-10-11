import { UI } from "@/lib/constants/ui-strings";
import { elementRelation, napAm, type ElementRelation } from "../can-chi";
import type { Criterion, CriterionStatus } from "./types";

/** Điểm (trên 1) và trạng thái theo quan hệ ngũ hành của năm với mệnh tuổi. */
const SCORE: Record<ElementRelation, { score: number; status: CriterionStatus }> = {
  "nam-sinh-menh": { score: 1, status: "good" },
  "binh-hoa": { score: 0.75, status: "good" },
  "menh-sinh-nam": { score: 0.5, status: "neutral" },
  "menh-khac-nam": { score: 0.25, status: "neutral" },
  "nam-khac-menh": { score: 0, status: "bad" },
};

export const nguHanh: Criterion = {
  key: "ngu-hanh",
  label: UI.XT_SECTION_NGU_HANH,
  maxScore: 1,
  note: UI.XT_THAI_TUE_NOTE,
  evaluate: ({ birthYear, buildYear }) => {
    const person = napAm(birthYear);
    const year = napAm(buildYear);
    const relation = elementRelation(person.element, year.element);
    return {
      ...SCORE[relation],
      summary: UI.XT_NGU_HANH[relation],
      details: [UI.XT_NGU_HANH_LINE(person.name, year.name)],
    };
  },
};
