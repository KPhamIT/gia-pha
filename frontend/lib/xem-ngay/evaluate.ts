import { dayInfo, daysInMonth, type DayInfo } from "@/lib/lich/ngay";
import {
  DAY_CHECKS,
  type Activity,
  type ActivityKey,
  type CheckResult,
  type DayCheck,
} from "./checks";

export const ACTIVITIES: readonly Activity[] = [
  {
    key: "dong-tho",
    goodTruc: ["Định", "Chấp", "Thành", "Khai"],
    badTruc: ["Kiến", "Phá", "Nguy", "Thu", "Bế"],
  },
  {
    key: "nhap-trach",
    goodTruc: ["Mãn", "Định", "Thành", "Khai"],
    badTruc: ["Phá", "Nguy", "Bế"],
  },
  {
    key: "cuoi-hoi",
    goodTruc: ["Mãn", "Định", "Thành", "Khai"],
    badTruc: ["Trừ", "Phá", "Nguy", "Bế"],
  },
  {
    key: "khai-truong",
    goodTruc: ["Mãn", "Định", "Thành", "Khai"],
    badTruc: ["Phá", "Nguy", "Thu", "Bế"],
  },
  {
    key: "xuat-hanh",
    goodTruc: ["Kiến", "Mãn", "Thành", "Khai"],
    badTruc: ["Phá", "Nguy", "Bế"],
  },
];

export const activityByKey = (key: ActivityKey) =>
  ACTIVITIES.find((a) => a.key === key) ?? ACTIVITIES[0];

export type DayVerdict = "tot" | "kha" | "binh" | "xau";

export type DayEvaluation = {
  info: DayInfo;
  outcomes: Outcome[];
  verdict: DayVerdict;
};

type Outcome = { check: DayCheck; result: CheckResult };

/** Gộp kết quả: phạm tiêu chí lọc → xấu; còn lại cộng điểm các tiêu chí chấm. */
function verdictOf(outcomes: Outcome[]): DayVerdict {
  if (
    outcomes.some(
      ({ check, result }) => check.kind === "filter" && result.status === "bad",
    )
  )
    return "xau";
  const score = outcomes
    .filter(({ check }) => check.kind === "score")
    .reduce(
      (s, { result }) =>
        s + (result.status === "good" ? 1 : result.status === "bad" ? -1 : 0),
      0,
    );
  if (score >= 2) return "tot";
  if (score === 1) return "kha";
  return score === 0 ? "binh" : "xau";
}

export function evaluateDay(
  info: DayInfo,
  activity: Activity,
  ownerChi: number | null,
): DayEvaluation {
  const outcomes = DAY_CHECKS.map((check) => ({
    check,
    result: check.evaluate({ info, activity, ownerChi }),
  }));
  return { info, outcomes, verdict: verdictOf(outcomes) };
}

export function evaluateMonth(
  month: number,
  year: number,
  activity: Activity,
  ownerChi: number | null,
) {
  return Array.from({ length: daysInMonth(month, year) }, (_, i) =>
    evaluateDay(dayInfo(i + 1, month, year), activity, ownerChi),
  );
}
