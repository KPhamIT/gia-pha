/**
 * Xem màu sơn, màu gạch: lấy hành của mệnh (nạp âm hoặc cung phi), xếp 5 hành màu
 * theo sinh – khắc, rồi gợi ý cho từng khu vực. Khu vực có hành riêng (bếp – Hỏa,
 * nhà vệ sinh – Thủy, mặt tiền – hành của hướng nhà) thì tránh thêm màu khắc hành đó.
 */
import { cungPhi, type Direction } from "@/lib/phong-thuy/bat-trach";
import { napAm, type Element } from "@/lib/xem-tuoi/can-chi";
import type { Gender } from "@/lib/xem-tuoi/criteria";
import {
  colorRank,
  DIRECTION_ELEMENT,
  HOT_FACINGS,
  overcomes,
  rankedElements,
  type ColorRank,
} from "./palette";

/** Tính mệnh theo nạp âm năm sinh (phổ biến) hay theo cung phi Bát trạch. */
export type Basis = "nap-am" | "cung-phi";

export type AreaKey =
  | "phong-khach"
  | "phong-ngu"
  | "bep"
  | "ve-sinh"
  | "mat-tien";

export type AreaAdvice = {
  key: AreaKey;
  /** Hành riêng của khu vực, null nếu chỉ theo mệnh gia chủ. */
  areaElement: Element | null;
  /** Hành màu nên dùng, tốt trước. */
  use: Element[];
  /** Hành màu nên tránh làm màu chủ đạo. */
  avoid: Element[];
};

export type ColorAnalysis = {
  menh: Element;
  /** Tên mệnh để hiển thị: nạp âm (vd. "Hải Trung Kim") hoặc cung (vd. "Càn Kim"). */
  menhName: string;
  ranked: { element: Element; rank: ColorRank }[];
  areas: AreaAdvice[];
  facing: Direction | null;
  /** Mặt tiền hướng nắng gắt — nên dùng tông sáng. */
  hotFacing: boolean;
};

const GOOD_RANKS: readonly ColorRank[] = ["tuong-sinh", "hoa-hop", "che-khac"];

function advise(
  key: AreaKey,
  menh: Element,
  areaElement: Element | null,
): AreaAdvice {
  const ranked = rankedElements(menh);
  const clash = (e: Element) => areaElement !== null && overcomes(e, areaElement);
  const use = ranked
    .filter((r) => GOOD_RANKS.includes(r.rank) && !clash(r.element))
    .map((r) => r.element);
  // Khu vực có hành riêng: ưu tiên màu sinh hành đó (vd. Mộc cho bếp) nếu không kỵ mệnh.
  if (areaElement) {
    const feeder = ranked.find(
      (r) =>
        colorRank(areaElement, r.element) === "tuong-sinh" && r.rank !== "ky",
    );
    if (feeder && !use.includes(feeder.element)) use.push(feeder.element);
  }
  const avoid = ranked
    .filter((r) => r.rank === "ky" || clash(r.element))
    .map((r) => r.element);
  return { key, areaElement, use, avoid };
}

export function analyzeColors(
  birthYear: number,
  gender: Gender,
  basis: Basis,
  facing: Direction | null,
): ColorAnalysis {
  const cung = cungPhi(birthYear, gender);
  const nap = napAm(birthYear);
  const menh = basis === "nap-am" ? nap.element : (cung.element as Element);
  const menhName =
    basis === "nap-am" ? nap.name : `${cung.trigram} ${cung.element}`;
  const areas: AreaAdvice[] = [
    advise("phong-khach", menh, null),
    advise("phong-ngu", menh, null),
    advise("bep", menh, "Hỏa"),
    advise("ve-sinh", menh, "Thủy"),
    advise("mat-tien", menh, facing ? DIRECTION_ELEMENT[facing] : null),
  ];
  return {
    menh,
    menhName,
    ranked: rankedElements(menh),
    areas,
    facing,
    hotFacing: facing !== null && HOT_FACINGS.includes(facing),
  };
}
