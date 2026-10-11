import { UI } from "@/lib/constants/ui-strings";
import type { Criterion, CriterionStatus } from "./types";

type Han = { name: string; score: number; male: number[]; female: number[] };

/** Tuổi mụ gặp từng hạn (bảng tra phổ biến, nam / nữ). Hạn càng nặng điểm càng thấp. */
const HAN: Han[] = [
  {
    name: "Huỳnh Tuyền",
    score: 0,
    male: [18, 27, 36, 45, 54, 63, 72, 81, 89, 90, 98],
    female: [14, 23, 32, 41, 49, 50, 58, 67, 76, 85, 94],
  },
  {
    name: "Tam Kheo",
    score: 0.5,
    male: [11, 19, 20, 28, 37, 46, 55, 64, 73, 82, 91],
    female: [13, 22, 31, 39, 40, 48, 57, 66, 75, 84, 93],
  },
  {
    name: "Ngũ Mộ",
    score: 0.5,
    male: [12, 21, 29, 30, 38, 47, 56, 65, 74, 83, 92],
    female: [12, 21, 29, 30, 38, 47, 56, 65, 74, 83, 92],
  },
  {
    name: "Thiên Tinh",
    score: 0.5,
    male: [13, 22, 31, 39, 40, 48, 57, 66, 75, 84, 93],
    female: [11, 19, 20, 28, 37, 46, 55, 64, 73, 82, 91],
  },
  {
    name: "Toán Tận",
    score: 0.25,
    male: [14, 23, 32, 41, 49, 50, 58, 67, 76, 85, 94],
    female: [18, 27, 36, 45, 54, 63, 72, 81, 89, 90, 98],
  },
  {
    name: "Thiên La",
    score: 0.5,
    male: [15, 24, 33, 42, 51, 59, 60, 68, 77, 86, 95],
    female: [17, 26, 35, 44, 53, 62, 71, 79, 80, 88, 97],
  },
  {
    name: "Địa Võng",
    score: 0.5,
    male: [16, 25, 34, 43, 52, 61, 69, 70, 78, 87, 96],
    female: [16, 25, 34, 43, 52, 61, 69, 70, 78, 87, 96],
  },
  {
    name: "Diêm Vương",
    score: 0.25,
    male: [17, 26, 35, 44, 53, 62, 71, 79, 80, 88, 97],
    female: [15, 24, 33, 42, 51, 59, 60, 68, 77, 86, 95],
  },
];

/** Vận hạn năm làm nhà theo tuổi mụ và giới tính. */
export const vanHan: Criterion = {
  key: "van-han",
  label: UI.XT_SECTION_HAN,
  maxScore: 1,
  note: UI.XT_THAI_TUE_NOTE,
  evaluate: ({ age, gender }) => {
    const han = HAN.find((h) => h[gender].includes(age));
    if (!han) {
      return { status: "neutral", score: 0.5, summary: UI.XT_HAN_NONE, details: [] };
    }
    const status: CriterionStatus = han.score <= 0.25 ? "bad" : "neutral";
    return {
      status,
      score: han.score,
      summary: UI.XT_HAN(han.name, status),
      details: [UI.XT_GENDER_BASED(gender)],
      impact: UI.XT_HAN_IMPACT[han.name],
      advice: status === "bad" ? UI.XT_BAD_ADVICE : undefined,
      shortLabel: han.name,
    };
  },
};
