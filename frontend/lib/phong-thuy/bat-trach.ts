/**
 * Bát trạch: cung phi (cung mệnh) theo năm sinh âm lịch + giới tính, và 8 hướng
 * tốt/xấu tương ứng. Dùng chung cho xem hướng nhà và xem vị trí phòng.
 */
import type { Gender } from "@/lib/xem-tuoi/criteria";

/** 8 hướng theo chiều kim đồng hồ, bắt đầu từ Bắc. */
export const DIRECTIONS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;
export type Direction = (typeof DIRECTIONS)[number];

/** 4 cát tinh rồi 4 hung tinh, xếp từ tốt nhất đến xấu nhất. */
export const STARS = [
  "sinh-khi",
  "thien-y",
  "dien-nien",
  "phuc-vi",
  "hoa-hai",
  "luc-sat",
  "ngu-quy",
  "tuyet-menh",
] as const;
export type Star = (typeof STARS)[number];
export const isGoodStar = (star: Star) => STARS.indexOf(star) < 4;

type Trigram = "Khảm" | "Khôn" | "Chấn" | "Tốn" | "Càn" | "Đoài" | "Cấn" | "Ly";

/** Theo số quái (1–9, không có 5): quái, ngũ hành, nhóm, và hướng theo thứ tự `STARS`. */
const KUA: Record<
  number,
  {
    trigram: Trigram;
    element: string;
    group: "dong" | "tay";
    dirs: Direction[];
  }
> = {
  1: {
    trigram: "Khảm",
    element: "Thủy",
    group: "dong",
    dirs: ["SE", "E", "S", "N", "W", "NW", "NE", "SW"],
  },
  2: {
    trigram: "Khôn",
    element: "Thổ",
    group: "tay",
    dirs: ["NE", "W", "NW", "SW", "E", "S", "SE", "N"],
  },
  3: {
    trigram: "Chấn",
    element: "Mộc",
    group: "dong",
    dirs: ["S", "N", "SE", "E", "SW", "NE", "NW", "W"],
  },
  4: {
    trigram: "Tốn",
    element: "Mộc",
    group: "dong",
    dirs: ["N", "S", "E", "SE", "NW", "W", "SW", "NE"],
  },
  6: {
    trigram: "Càn",
    element: "Kim",
    group: "tay",
    dirs: ["W", "NE", "SW", "NW", "SE", "N", "E", "S"],
  },
  7: {
    trigram: "Đoài",
    element: "Kim",
    group: "tay",
    dirs: ["NW", "SW", "NE", "W", "N", "SE", "S", "E"],
  },
  8: {
    trigram: "Cấn",
    element: "Thổ",
    group: "tay",
    dirs: ["SW", "NW", "W", "NE", "S", "E", "N", "SE"],
  },
  9: {
    trigram: "Ly",
    element: "Hỏa",
    group: "dong",
    dirs: ["E", "SE", "N", "S", "NE", "SW", "W", "NW"],
  },
};

const digitSum = (n: number): number =>
  n < 10 ? n : digitSum(Math.floor(n / 10) + (n % 10));

/** Số quái (Kua) theo năm sinh âm lịch. Nam ra 5 → Khôn (2), nữ ra 5 → Cấn (8). */
export function kuaNumber(birthYear: number, gender: Gender): number {
  const r = digitSum(birthYear % 100);
  const before2000 = birthYear < 2000;
  let kua =
    gender === "male"
      ? digitSum((before2000 ? 10 : 9) - r + 9) // +9 giữ kết quả 1–9
      : digitSum((before2000 ? 5 : 6) + r);
  if (kua === 5) kua = gender === "male" ? 2 : 8;
  return kua;
}

export type CungPhi = {
  kua: number;
  trigram: Trigram;
  element: string;
  /** Đông tứ mệnh hay Tây tứ mệnh. */
  group: "dong" | "tay";
  /** Hướng của từng sao. */
  starDir: Record<Star, Direction>;
  /** Sao của từng hướng. */
  dirStar: Record<Direction, Star>;
};

export function cungPhi(birthYear: number, gender: Gender): CungPhi {
  const kua = kuaNumber(birthYear, gender);
  const { trigram, element, group, dirs } = KUA[kua];
  const starDir = Object.fromEntries(
    STARS.map((s, i) => [s, dirs[i]]),
  ) as Record<Star, Direction>;
  const dirStar = Object.fromEntries(
    STARS.map((s, i) => [dirs[i], s]),
  ) as Record<Direction, Star>;
  return { kua, trigram, element, group, starDir, dirStar };
}

/** Hướng đối diện (vd. nhà hướng Nam thì tọa Bắc). */
export const opposite = (dir: Direction): Direction =>
  DIRECTIONS[(DIRECTIONS.indexOf(dir) + 4) % 8];
