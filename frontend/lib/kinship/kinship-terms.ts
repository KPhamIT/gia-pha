import type { KinStep, Region } from "./kinship";

/** Cách gọi; có thể khác nhau theo miền (Bắc / Trung / Nam). */
export type Term = string | { bac: string; trung?: string; nam?: string };

const r = (bac: string, trung: string, nam: string): Term => ({ bac, trung, nam });

/** Bảng chuỗi → cách gọi. Khoá là các bước nối bằng dấu chấm. */
const BASE_TERMS: Record<string, Term> = {
  // Đời cha mẹ
  f: r("bố", "ba", "ba"),
  m: r("mẹ", "mạ", "má"),
  "f.ob": "bác",
  "f.yb": "chú",
  "f.os": r("bác", "o", "cô"),
  "f.ys": r("cô", "o", "cô"),
  "m.ob": r("bác", "cậu", "cậu"),
  "m.yb": "cậu",
  "m.os": r("bác", "dì", "dì"),
  "m.ys": "dì",
  "f.ob.w": "bác",
  "f.yb.w": "thím",
  "f.os.h": r("bác", "dượng", "dượng"),
  "f.ys.h": r("chú", "dượng", "dượng"),
  "m.ob.w": r("bác", "mợ", "mợ"),
  "m.yb.w": "mợ",
  "m.os.h": r("bác", "dượng", "dượng"),
  "m.ys.h": r("chú", "dượng", "dượng"),

  // Đời ông bà, cụ
  "f.f": "ông nội",
  "f.m": "bà nội",
  "m.f": "ông ngoại",
  "m.m": "bà ngoại",
  "f.f.f": r("cụ ông", "ông cố", "ông cố"),
  "f.f.m": r("cụ bà", "bà cố", "bà cố"),
  "f.m.f": r("cụ ông", "ông cố", "ông cố"),
  "f.m.m": r("cụ bà", "bà cố", "bà cố"),
  "m.f.f": r("cụ ông (bên ngoại)", "ông cố ngoại", "ông cố ngoại"),
  "m.f.m": r("cụ bà (bên ngoại)", "bà cố ngoại", "bà cố ngoại"),
  "m.m.f": r("cụ ông (bên ngoại)", "ông cố ngoại", "ông cố ngoại"),
  "m.m.m": r("cụ bà (bên ngoại)", "bà cố ngoại", "bà cố ngoại"),
  "f.f.ob": "ông bác",
  "f.f.yb": "ông chú",
  "f.f.os": "bà bác",
  "f.f.ys": "bà cô",
  "f.m.ob": "ông cậu",
  "f.m.yb": "ông cậu",
  "f.m.os": "bà dì",
  "f.m.ys": "bà dì",
  "m.f.ob": "ông bác",
  "m.f.yb": "ông chú",
  "m.f.os": "bà bác",
  "m.f.ys": "bà cô",
  "m.m.ob": "ông cậu",
  "m.m.yb": "ông cậu",
  "m.m.os": "bà dì",
  "m.m.ys": "bà dì",

  // Cùng đời
  ob: "anh",
  yb: "em trai",
  os: "chị",
  ys: "em gái",
  h: "chồng",
  w: "vợ",
  "ob.w": "chị dâu",
  "yb.w": "em dâu",
  "os.h": "anh rể",
  "ys.h": "em rể",
  "f.ob.s": "anh họ",
  "f.ob.d": "chị họ",
  "f.os.s": "anh họ",
  "f.os.d": "chị họ",
  "m.ob.s": "anh họ",
  "m.ob.d": "chị họ",
  "m.os.s": "anh họ",
  "m.os.d": "chị họ",
  "f.yb.s": "em họ",
  "f.yb.d": "em họ",
  "f.ys.s": "em họ",
  "f.ys.d": "em họ",
  "m.yb.s": "em họ",
  "m.yb.d": "em họ",
  "m.ys.s": "em họ",
  "m.ys.d": "em họ",

  // Bên chồng / vợ
  "h.f": r("bố chồng", "ba chồng", "ba chồng"),
  "h.m": r("mẹ chồng", "mạ chồng", "má chồng"),
  "w.f": r("bố vợ", "ba vợ", "ba vợ"),
  "w.m": r("mẹ vợ", "mạ vợ", "má vợ"),
  "h.ob": "anh chồng",
  "h.os": "chị chồng",
  "h.yb": "em chồng",
  "h.ys": "em chồng",
  "w.ob": "anh vợ",
  "w.os": "chị vợ",
  "w.yb": "em vợ",
  "w.ys": "em vợ",

  // Đời con cháu
  s: "con trai",
  d: "con gái",
  "s.w": "con dâu",
  "d.h": "con rể",
  "s.s": "cháu nội",
  "s.d": "cháu nội",
  "d.s": "cháu ngoại",
  "d.d": "cháu ngoại",
  "s.s.s": "chắt",
  "s.s.d": "chắt",
  "s.d.s": "chắt",
  "s.d.d": "chắt",
  "d.s.s": "chắt",
  "d.s.d": "chắt",
  "d.d.s": "chắt",
  "d.d.d": "chắt",
  "ob.s": "cháu",
  "ob.d": "cháu",
  "yb.s": "cháu",
  "yb.d": "cháu",
  "os.s": "cháu",
  "os.d": "cháu",
  "ys.s": "cháu",
  "ys.d": "cháu",
};

const SIBLINGS: KinStep[] = ["ob", "yb", "os", "ys"];
const CHILDREN: KinStep[] = ["s", "d"];

/** Cháu của vợ/chồng (con anh chị em bên kia) và cháu gọi bằng ông/bà (cháu của anh chị em). */
function generatedTerms(): Record<string, Term> {
  const out: Record<string, Term> = {};
  for (const sib of SIBLINGS) {
    for (const c1 of CHILDREN) {
      for (const spouse of ["h", "w"]) out[`${spouse}.${sib}.${c1}`] = "cháu";
      for (const c2 of CHILDREN) out[`${sib}.${c1}.${c2}`] = "cháu";
    }
  }
  return out;
}

export const TERMS: Record<string, Term> = { ...generatedTerms(), ...BASE_TERMS };

export function pickTerm(term: Term, region: Region): string {
  if (typeof term === "string") return term;
  return term[region] ?? term.bac;
}
