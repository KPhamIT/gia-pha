/**
 * Bố trí phòng theo Bát trạch: mỗi phòng có cung nên đặt (tính từ tâm nhà) và
 * hướng nên quay về. Thêm phòng = thêm một dòng vào `ROOMS` + chữ trong ui-strings.
 */
import {
  DIRECTIONS,
  opposite,
  type CungPhi,
  type Direction,
  type Star,
} from "./bat-trach";

const GOOD: Star[] = ["sinh-khi", "thien-y", "dien-nien", "phuc-vi"];
const BAD: Star[] = ["tuyet-menh", "ngu-quy", "luc-sat", "hoa-hai"];

export type RoomKey =
  "phong-ngu" | "phong-ngu-con" | "bep" | "ve-sinh" | "ban-tho" | "lam-viec";

export type Room = {
  key: RoomKey;
  /** Cung nên đặt, ưu tiên từ trái sang. */
  place: Star[];
  /** Cung nên tránh. */
  avoid: Star[];
  /** Hướng nên quay về (đầu giường, hướng bếp, hướng bàn thờ…), nếu có. */
  face?: Star[];
  /** Không đặt ở giữa nhà (trung cung). */
  avoidCenter?: boolean;
};

export const ROOMS: readonly Room[] = [
  {
    key: "phong-ngu",
    place: ["dien-nien", "thien-y", "sinh-khi", "phuc-vi"],
    avoid: BAD,
    face: ["dien-nien", "thien-y", "sinh-khi", "phuc-vi"],
  },
  {
    key: "phong-ngu-con",
    place: ["phuc-vi", "sinh-khi", "thien-y"],
    avoid: BAD,
    face: ["phuc-vi", "sinh-khi"],
  },
  // "Tọa hung hướng cát": bếp đặt ở cung xấu để trấn, quay về hướng tốt.
  {
    key: "bep",
    place: BAD,
    avoid: GOOD,
    face: ["thien-y", "sinh-khi", "dien-nien", "phuc-vi"],
    avoidCenter: true,
  },
  { key: "ve-sinh", place: BAD, avoid: GOOD, avoidCenter: true },
  {
    key: "ban-tho",
    place: ["phuc-vi", "sinh-khi", "thien-y", "dien-nien"],
    avoid: BAD,
    face: ["sinh-khi", "thien-y", "dien-nien", "phuc-vi"],
  },
  {
    key: "lam-viec",
    place: ["sinh-khi", "phuc-vi"],
    avoid: BAD,
    face: ["sinh-khi", "phuc-vi"],
  },
];

export type PlanCell = { dir: Direction | null; star: Star | null };

/**
 * Mặt bằng 3×3 nhìn từ trên xuống, cửa chính ở cạnh dưới. Trả 9 ô theo thứ tự đọc
 * (trái→phải, trên→dưới); ô giữa là trung cung (dir = null).
 */
export function planCells(facing: Direction, cung: CungPhi): PlanCell[] {
  const top = DIRECTIONS.indexOf(opposite(facing));
  // Vị trí theo chiều kim đồng hồ tính từ ô giữa cạnh trên.
  const order = [7, 0, 1, 6, -1, 2, 5, 4, 3];
  return order.map((step) => {
    if (step < 0) return { dir: null, star: null };
    const dir = DIRECTIONS[(top + step) % 8];
    return { dir, star: cung.dirStar[dir] };
  });
}

export const roomByKey = (key: RoomKey) =>
  ROOMS.find((r) => r.key === key) ?? ROOMS[0];
