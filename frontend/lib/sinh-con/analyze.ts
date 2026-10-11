import { canIndex, chiIndex, napAm } from "@/lib/xem-tuoi/can-chi";
import {
  PAIR_CRITERIA,
  type PairCriterion,
  type PairResult,
  type ParentRole,
} from "./criteria";

export const SCORE_SCALE = 10;

export type ChildVerdict = "rat-hop" | "hop" | "chua-hop";

/** Ngưỡng điểm (thang 10), xét từ trên xuống. */
const VERDICT_RULES: { min: number; verdict: ChildVerdict }[] = [
  { min: 7.5, verdict: "rat-hop" },
  { min: 5, verdict: "hop" },
  { min: 0, verdict: "chua-hop" },
];

export type ParentAnalysis = {
  role: ParentRole;
  year: number;
  outcomes: { criterion: PairCriterion; result: PairResult }[];
  score: number;
  max: number;
};

export type ChildAnalysis = {
  childYear: number;
  parents: ParentAnalysis[];
  /** Điểm tổng, thang 10. */
  score: number;
  verdict: ChildVerdict;
};

function analyzeParent(
  role: ParentRole,
  parentYear: number,
  childYear: number,
  criteria: readonly PairCriterion[],
) {
  const ctx = {
    role,
    parentYear,
    childYear,
    parentCan: canIndex(parentYear),
    childCan: canIndex(childYear),
    parentChi: chiIndex(parentYear),
    childChi: chiIndex(childYear),
    parentMenh: napAm(parentYear),
    childMenh: napAm(childYear),
  };
  const outcomes = criteria.map((criterion) => ({
    criterion,
    result: criterion.evaluate(ctx),
  }));
  return {
    role,
    year: parentYear,
    outcomes,
    score: outcomes.reduce((s, o) => s + o.result.score, 0),
    max: criteria.reduce((s, c) => s + c.maxScore, 0),
  };
}

/** Chấm năm sinh con với tuổi bố và mẹ; điểm cả hai cộng lại rồi quy về thang 10. */
export function analyzeChild(
  fatherYear: number,
  motherYear: number,
  childYear: number,
  criteria: readonly PairCriterion[] = PAIR_CRITERIA,
): ChildAnalysis {
  const parents = [
    analyzeParent("father", fatherYear, childYear, criteria),
    analyzeParent("mother", motherYear, childYear, criteria),
  ];
  const got = parents.reduce((s, p) => s + p.score, 0);
  const max = parents.reduce((s, p) => s + p.max, 0);
  const score = Math.round((got / max) * SCORE_SCALE * 10) / 10;
  const verdict =
    VERDICT_RULES.find((r) => score >= r.min)?.verdict ?? "chua-hop";
  return { childYear, parents, score, verdict };
}
