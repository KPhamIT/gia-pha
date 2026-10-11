import { UI } from "@/lib/constants/ui-strings";
import type { Criterion, CriterionStatus, Gender } from "./types";

type Star = { name: string; status: CriterionStatus };

/** Vòng Cửu Diệu bắt đầu từ tuổi mụ 10, lặp mỗi 9 năm (nam và nữ khác thứ tự). */
const STARS: Record<Gender, Star[]> = {
  male: [
    { name: "La Hầu", status: "bad" },
    { name: "Thổ Tú", status: "neutral" },
    { name: "Thủy Diệu", status: "neutral" },
    { name: "Thái Bạch", status: "bad" },
    { name: "Thái Dương", status: "good" },
    { name: "Vân Hán", status: "neutral" },
    { name: "Kế Đô", status: "bad" },
    { name: "Thái Âm", status: "good" },
    { name: "Mộc Đức", status: "good" },
  ],
  female: [
    { name: "Kế Đô", status: "bad" },
    { name: "Vân Hán", status: "neutral" },
    { name: "Mộc Đức", status: "good" },
    { name: "Thái Âm", status: "good" },
    { name: "Thổ Tú", status: "neutral" },
    { name: "La Hầu", status: "bad" },
    { name: "Thái Dương", status: "good" },
    { name: "Thái Bạch", status: "bad" },
    { name: "Thủy Diệu", status: "neutral" },
  ],
};

const SCORE: Record<CriterionStatus, number> = { good: 1, neutral: 0.5, bad: 0 };

/** Sao chiếu mệnh năm làm nhà: 3 sao tốt, 3 sao trung bình, 3 sao xấu. */
export const saoChieuMenh: Criterion = {
  key: "sao-chieu-menh",
  label: UI.XT_SECTION_SAO,
  maxScore: 1,
  note: UI.XT_THAI_TUE_NOTE,
  evaluate: ({ age, gender }) => {
    const star = STARS[gender][(((age - 10) % 9) + 9) % 9];
    return {
      status: star.status,
      score: SCORE[star.status],
      summary: UI.XT_SAO(star.name, star.status),
      details: [UI.XT_GENDER_BASED(gender)],
      impact: UI.XT_STAR_IMPACT[star.name],
      advice: star.status === "bad" ? UI.XT_BAD_ADVICE : undefined,
      shortLabel: star.name,
    };
  },
};
