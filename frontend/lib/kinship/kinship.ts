/**
 * Tính cách xưng hô họ hàng theo chuỗi quan hệ (vd. Bố → Anh trai → Con trai).
 * Quy tắc "theo vai": con của anh/chị bố mẹ là anh/chị họ dù ít tuổi hơn.
 */
import { TERMS, pickTerm } from "./kinship-terms";

export type KinStep = "f" | "m" | "h" | "w" | "s" | "d" | "ob" | "yb" | "os" | "ys";
export type Region = "bac" | "trung" | "nam";
export type Gender = "male" | "female";

/** Giới tính của người ở cuối mỗi bước. */
const STEP_GENDER: Record<KinStep, Gender> = {
  f: "male",
  m: "female",
  h: "male",
  w: "female",
  s: "male",
  d: "female",
  ob: "male",
  yb: "male",
  os: "female",
  ys: "female",
};


/** Rút gọn các chuỗi tương đương (vợ của bố = mẹ, bố của anh = bố…). */
export function normalizeChain(steps: KinStep[], egoGender: Gender): KinStep[] {
  const out: KinStep[] = [];
  for (const step of steps) {
    const prev = out[out.length - 1];
    // Bố/mẹ của anh chị em = bố/mẹ mình.
    if ((step === "f" || step === "m") && prev && ["ob", "yb", "os", "ys"].includes(prev)) {
      out.pop();
      out.push(step);
      continue;
    }
    if (prev === "f" && step === "w") {
      out[out.length - 1] = "m";
      continue;
    }
    if (prev === "m" && step === "h") {
      out[out.length - 1] = "f";
      continue;
    }
    // Vợ/chồng của vợ/chồng mình = chính mình.
    if ((prev === "h" && step === "w") || (prev === "w" && step === "h")) {
      out.pop();
      continue;
    }
    // Bố/mẹ của con mình = mình hoặc vợ/chồng mình.
    if ((prev === "s" || prev === "d") && (step === "f" || step === "m")) {
      out.pop();
      const parentGender: Gender = step === "f" ? "male" : "female";
      const before = out.length ? STEP_GENDER[out[out.length - 1]] : egoGender;
      if (before !== parentGender) out.push(parentGender === "male" ? "h" : "w");
      continue;
    }
    out.push(step);
  }
  return out;
}

/** Bước ngược: nếu B là `step` của A thì A là gì của B (cần giới tính của A). */
function inverseStep(step: KinStep, gender: Gender): KinStep {
  const male = gender === "male";
  switch (step) {
    case "f":
    case "m":
      return male ? "s" : "d";
    case "s":
    case "d":
      return male ? "f" : "m";
    case "ob":
    case "os":
      return male ? "yb" : "ys";
    case "yb":
    case "ys":
      return male ? "ob" : "os";
    case "h":
      return "w";
    case "w":
      return "h";
  }
}

/** Chuỗi nhìn từ phía người kia về bạn. */
export function inverseChain(steps: KinStep[], egoGender: Gender): KinStep[] {
  const genders: Gender[] = [egoGender, ...steps.map((s) => STEP_GENDER[s])];
  return steps.map((step, i) => inverseStep(step, genders[i])).reverse();
}

/** Từ dùng để gọi trực tiếp: "anh họ" → "anh", "cháu nội" → "cháu", chồng → "anh". */
export function addressWord(term: string): string {
  if (term === "chồng") return "anh";
  if (term === "vợ") return "em";
  if (term.startsWith("cụ")) return "cụ";
  if (term.startsWith("ông cố") || term.startsWith("bà cố")) return term.slice(0, 6);
  return term.split(" ")[0];
}

export type KinshipResult = {
  /** Người đó là … của bạn (null nếu chưa có trong bảng). */
  relation: string | null;
  /** Bạn gọi người đó là … */
  call: string | null;
  /** Bạn là … của người đó. */
  backRelation: string | null;
  /** Người đó gọi bạn là … (bạn xưng như vậy). */
  back: string | null;
  chain: KinStep[];
};

export function lookupTerm(steps: KinStep[], region: Region): string | null {
  const term = TERMS[steps.join(".")];
  return term ? pickTerm(term, region) : null;
}

export function computeKinship(
  steps: KinStep[],
  egoGender: Gender,
  region: Region,
): KinshipResult {
  const chain = normalizeChain(steps, egoGender);
  const empty = { relation: null, call: null, backRelation: null, back: null, chain };
  if (chain.length === 0) return empty;
  const otherGender = STEP_GENDER[chain[chain.length - 1]];
  const backChain = normalizeChain(inverseChain(chain, egoGender), otherGender);
  const relation = lookupTerm(chain, region);
  const backRelation = lookupTerm(backChain, region);
  return {
    relation,
    call: relation ? addressWord(relation) : null,
    backRelation,
    back: backRelation ? addressWord(backRelation) : null,
    chain,
  };
}

export const KIN_STEP_GENDER = STEP_GENDER;
