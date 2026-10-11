import { solarToLunar } from "@/lib/lich/am-lich";
import { elementRelation, napAm, type Element } from "@/lib/xem-tuoi/can-chi";
import {
  NAME_CRITERIA,
  type NameContext,
  type NameCriterion,
  type NameResult,
} from "./criteria";
import { NAMES, nameElement, type NameEntry } from "./names";
import { harmony, lifePath, nameNumbers, type Harmony } from "./numerology";

export const SCORE_SCALE = 10;

export type NameVerdict = "rat-dep" | "dep" | "can-nhac";

const VERDICT_RULES: { min: number; verdict: NameVerdict }[] = [
  { min: 7.5, verdict: "rat-dep" },
  { min: 5, verdict: "dep" },
  { min: 0, verdict: "can-nhac" },
];

export type NameInput = {
  surname: string;
  middle: string;
  given: string;
  /** YYYY-MM-DD dương lịch. */
  birthDate: string;
  /** Hành người dùng tự chọn cho tên chính / tên đệm khi không có trong từ điển. */
  givenElement?: Element | null;
  middleElement?: Element | null;
};

export function parseDate(ymd: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  return m
    ? { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) }
    : null;
}

/** Tên đệm có thể nhiều chữ — lấy chữ cuối để tra hành. */
const lastWord = (s: string) => s.trim().split(/\s+/).pop() ?? "";

export function buildContext(input: NameInput): NameContext | null {
  const birth = parseDate(input.birthDate);
  if (!birth) return null;
  const lunarYear = solarToLunar(birth.day, birth.month, birth.year).year;
  const fullName = [input.surname, input.middle, input.given]
    .map((s) => s.trim())
    .filter(Boolean)
    .join(" ");
  return {
    fullName,
    given: input.given.trim(),
    middle: input.middle.trim(),
    birth,
    lunarYear,
    menh: napAm(lunarYear),
    givenElement:
      nameElement(lastWord(input.given)) ?? input.givenElement ?? null,
    middleElement:
      nameElement(lastWord(input.middle)) ?? input.middleElement ?? null,
    numbers: nameNumbers(fullName),
    lifePath: lifePath(birth.day, birth.month, birth.year),
  };
}

export type NameAnalysis = {
  ctx: NameContext;
  outcomes: { criterion: NameCriterion; result: NameResult | null }[];
  score: number | null;
  verdict: NameVerdict | null;
};

/** Chấm các tiêu chí áp dụng được rồi quy về thang 10. */
export function analyzeName(
  ctx: NameContext,
  criteria = NAME_CRITERIA,
): NameAnalysis {
  const outcomes = criteria.map((criterion) => ({
    criterion,
    result: criterion.evaluate(ctx),
  }));
  const applied = outcomes.filter((o) => o.result);
  const max = applied.reduce((s, o) => s + o.criterion.maxScore, 0);
  if (!max) return { ctx, outcomes, score: null, verdict: null };
  const got = applied.reduce((s, o) => s + (o.result?.score ?? 0), 0);
  const score = Math.round((got / max) * SCORE_SCALE * 10) / 10;
  return {
    ctx,
    outcomes,
    score,
    verdict: VERDICT_RULES.find((r) => score >= r.min)?.verdict ?? "can-nhac",
  };
}

export type Suggestion = NameEntry & { sinh: boolean; harmony: Harmony };

/**
 * Gợi ý tên hợp mệnh con: hành sinh mệnh trước, cùng hành sau; trong mỗi nhóm
 * ưu tiên tên có số sứ mệnh hợp số chủ đạo.
 */
export function suggestNames(
  ctx: NameContext,
  surname: string,
  middle: string,
  gender: "m" | "f",
): Suggestion[] {
  const rank: Record<Harmony, number> = { trung: 0, hop: 1, binh: 2 };
  return NAMES.filter((n) => n.gender === gender || n.gender === "u")
    .map((n) => ({ n, rel: elementRelation(ctx.menh.element, n.element) }))
    .filter(({ rel }) => rel === "nam-sinh-menh" || rel === "binh-hoa")
    .map(({ n, rel }) => {
      const numbers = nameNumbers(`${surname} ${middle} ${n.name}`);
      return {
        ...n,
        sinh: rel === "nam-sinh-menh",
        harmony: numbers
          ? harmony(numbers.destiny, ctx.lifePath)
          : ("binh" as Harmony),
      };
    })
    .sort(
      (a, b) =>
        Number(b.sinh) - Number(a.sinh) || rank[a.harmony] - rank[b.harmony],
    );
}
