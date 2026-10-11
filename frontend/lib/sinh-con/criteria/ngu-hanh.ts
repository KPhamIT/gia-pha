import { elementRelation, type ElementRelation } from "@/lib/xem-tuoi/can-chi";
import { UI } from "@/lib/constants/ui-strings";
import type { PairCriterion, PairStatus } from "./types";

/**
 * Quan hệ ngũ hành nạp âm giữa mệnh con và mệnh bố/mẹ. `elementRelation(con, bố mẹ)`:
 * "nam-sinh-menh" = bố mẹ sinh con, "menh-sinh-nam" = con sinh bố mẹ…
 */
const SCORE: Record<ElementRelation, { score: number; status: PairStatus }> = {
  "nam-sinh-menh": { score: 2, status: "good" },
  "menh-sinh-nam": { score: 2, status: "good" },
  "binh-hoa": { score: 1.25, status: "neutral" },
  "nam-khac-menh": { score: 0.5, status: "bad" },
  "menh-khac-nam": { score: 0, status: "bad" },
};

export const nguHanhPair: PairCriterion = {
  key: "ngu-hanh",
  label: UI.SC_SECTION_NGU_HANH,
  maxScore: 2,
  evaluate: ({ role, parentMenh, childMenh }) => {
    const relation = elementRelation(childMenh.element, parentMenh.element);
    return {
      ...SCORE[relation],
      summary: UI.SC_NGU_HANH(relation, UI.SC_ROLE[role]),
      detail: UI.SC_NGU_HANH_LINE(
        UI.SC_ROLE[role],
        parentMenh.name,
        childMenh.name,
      ),
    };
  },
};
