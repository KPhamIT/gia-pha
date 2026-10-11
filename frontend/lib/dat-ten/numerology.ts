/**
 * Thần số học (Pythagoras) theo cách dùng phổ biến ở Việt Nam: bỏ dấu tiếng Việt,
 * A=1 … I=9, J=1 … R=9, S=1 … Z=8; nguyên âm gồm A, E, I, O, U, Y.
 */

const VOWELS = new Set(["A", "E", "I", "O", "U", "Y"]);

/** "Nguyễn Đức Anh" → "NGUYENDUCANH". */
export function normalizeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
}

const letterValue = (ch: string) => ((ch.charCodeAt(0) - 65) % 9) + 1;
const digitSum = (n: number) =>
  String(n)
    .split("")
    .reduce((s, d) => s + Number(d), 0);

/** Rút gọn về 1–9, giữ số bậc thầy 11 và 22. */
export function reduceNumber(n: number): number {
  let v = n;
  while (v > 9 && v !== 11 && v !== 22) v = digitSum(v);
  return v;
}

export type NameNumbers = {
  /** Số sứ mệnh (biểu đạt): tổng mọi chữ cái. */
  destiny: number;
  /** Số linh hồn: tổng nguyên âm. */
  soul: number;
  /** Số nhân cách: tổng phụ âm. */
  personality: number;
};

export function nameNumbers(fullName: string): NameNumbers | null {
  const letters = normalizeName(fullName).split("");
  if (!letters.length) return null;
  const sum = (filter: (ch: string) => boolean) =>
    reduceNumber(
      letters.filter(filter).reduce((s, ch) => s + letterValue(ch), 0),
    );
  return {
    destiny: sum(() => true),
    soul: sum((ch) => VOWELS.has(ch)),
    personality: sum((ch) => !VOWELS.has(ch)),
  };
}

/**
 * Số chủ đạo từ ngày sinh dương lịch: cộng mọi chữ số, rút gọn đến khi ≤ 11
 * (giữ 10, 11 và 22 — 22 thường viết 22/4).
 */
export function lifePath(day: number, month: number, year: number): number {
  let v = digitSum(day) + digitSum(month) + digitSum(year);
  while (v > 11 && v !== 22) v = digitSum(v);
  return v;
}

/** Số gốc để so sánh: 10 → 1, 11 → 2, 22 → 4. */
const base = (n: number) => (n === 10 ? 1 : n === 11 ? 2 : n === 22 ? 4 : n);

/** Ba nhóm số hòa hợp thường dùng: (1, 5, 7), (2, 4, 8), (3, 6, 9). */
const GROUPS = [
  [1, 5, 7],
  [2, 4, 8],
  [3, 6, 9],
];

export type Harmony = "trung" | "hop" | "binh";

/** Mức hòa hợp giữa hai con số: trùng số gốc, cùng nhóm, hay bình thường. */
export function harmony(a: number, b: number): Harmony {
  const [x, y] = [base(a), base(b)];
  if (x === y) return "trung";
  return GROUPS.some((g) => g.includes(x) && g.includes(y)) ? "hop" : "binh";
}

/** Hiển thị số: 22 → "22/4". */
export const formatNumber = (n: number) => (n === 22 ? "22/4" : String(n));
