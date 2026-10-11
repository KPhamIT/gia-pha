/**
 * Xem tuổi làm nhà: chạy lần lượt các tiêu chí trong `CRITERIA`, cộng điểm,
 * quy về thang 10 rồi kết luận theo `VERDICT_RULES`. Các tiêu chí độc lập với
 * nhau — thêm/bớt tiêu chí không cần sửa file này.
 */
import { canChi, canIndex, chiIndex } from "./can-chi";
import { CRITERIA, type BuildContext, type Criterion, type CriterionResult, type Gender } from "./criteria";

export const SCORE_SCALE = 10;

/**
 * Mốc kết luận theo điểm (thang 10), xếp từ cao xuống thấp; lấy mốc đầu tiên
 * có `min` ≤ điểm. Muốn thêm mức (vd. "rất tốt" từ 8 điểm) chỉ cần thêm dòng.
 */
export const VERDICT_RULES = [
  { min: 5, verdict: "dat" },
  { min: 0, verdict: "chua-dat" },
] as const;

export type Verdict = (typeof VERDICT_RULES)[number]["verdict"];

export type CriterionOutcome = { criterion: Criterion; result: CriterionResult };

export type BuildAnalysis = BuildContext & {
  outcomes: CriterionOutcome[];
  /** Điểm trên thang 10, làm tròn 1 chữ số thập phân. */
  score: number;
  verdict: Verdict;
  /** Các tiêu chí bị phạm (status "bad"). */
  failed: Criterion[];
};

export function buildContext(birthYear: number, buildYear: number, gender: Gender = "male"): BuildContext {
  return {
    gender,
    birthYear,
    buildYear,
    age: buildYear - birthYear + 1,
    birthCan: canIndex(birthYear),
    yearCan: canIndex(buildYear),
    birthChi: chiIndex(birthYear),
    yearChi: chiIndex(buildYear),
    birthCanChi: canChi(birthYear),
    yearCanChi: canChi(buildYear),
  };
}

export function verdictFor(score: number): Verdict {
  return (VERDICT_RULES.find((rule) => score >= rule.min) ?? VERDICT_RULES[VERDICT_RULES.length - 1]).verdict;
}

export function analyzeBuild(
  birthYear: number,
  buildYear: number,
  gender: Gender = "male",
  criteria: readonly Criterion[] = CRITERIA,
): BuildAnalysis {
  const ctx = buildContext(birthYear, buildYear, gender);
  const outcomes = criteria.map((criterion) => ({ criterion, result: criterion.evaluate(ctx) }));
  const earned = outcomes.reduce((sum, o) => sum + Math.min(o.result.score, o.criterion.maxScore), 0);
  const max = criteria.reduce((sum, c) => sum + c.maxScore, 0);
  const score = max > 0 ? Math.round((earned / max) * SCORE_SCALE * 10) / 10 : 0;
  return {
    ...ctx,
    outcomes,
    score,
    verdict: verdictFor(score),
    failed: outcomes.filter((o) => o.result.status === "bad").map((o) => o.criterion),
  };
}

/** Ba nhóm tứ hành xung (theo chỉ số chi). */
const TU_HANH_XUNG = [
  [0, 6, 3, 9], // Tý Ngọ Mão Dậu
  [2, 8, 5, 11], // Dần Thân Tỵ Hợi
  [4, 10, 1, 7], // Thìn Tuất Sửu Mùi
];

/** Hai tuổi khác chi nhưng cùng nhóm tứ hành xung. */
export function isTuHanhXung(chiA: number, chiB: number): boolean {
  return chiA !== chiB && TU_HANH_XUNG.some((g) => g.includes(chiA) && g.includes(chiB));
}

/**
 * Tuổi mượn làm nhà trong `buildYear`: không phạm tiêu chí nào (xét theo nam
 * giới như thường lệ) và không tứ hành xung với tuổi gia chủ.
 */
export function goodBirthYears(
  buildYear: number,
  ownerBirthYear: number,
  criteria: readonly Criterion[] = CRITERIA,
  minAge = 20,
  maxAge = 75,
): BuildAnalysis[] {
  const ownerChi = chiIndex(ownerBirthYear);
  const out: BuildAnalysis[] = [];
  for (let age = minAge; age <= maxAge; age++) {
    const a = analyzeBuild(buildYear - age + 1, buildYear, "male", criteria);
    if (a.failed.length === 0 && !isTuHanhXung(a.birthChi, ownerChi)) out.push(a);
  }
  return out;
}
