/**
 * Ngũ sắc theo ngũ hành và cách xếp hạng màu theo mệnh.
 * Gốc: Hoàng Đế Nội Kinh – Tố Vấn, thiên Kim quỹ chân ngôn luận (Đông–Mộc–xanh,
 * Nam–Hỏa–đỏ, Trung ương–Thổ–vàng, Tây–Kim–trắng, Bắc–Thủy–đen). Phần mở rộng
 * (xanh dương cho Thủy, tím/hồng/cam cho Hỏa, xám/bạc cho Kim, be/nâu cho Thổ)
 * theo cách dùng phổ biến ở Việt Nam. Xem docs/cong-cu-nguon-tham-khao.md.
 */
import type { Direction } from "@/lib/phong-thuy/bat-trach";
import {
  elementRelation,
  type Element,
  type ElementRelation,
} from "@/lib/xem-tuoi/can-chi";

export type Swatch = { name: string; hex: string };

export const ELEMENTS: readonly Element[] = ["Kim", "Mộc", "Thủy", "Hỏa", "Thổ"];

/** Màu tiêu biểu của mỗi hành — tông nhạt trước (hợp sơn tường), đậm sau. */
export const ELEMENT_SWATCHES: Record<Element, readonly Swatch[]> = {
  Kim: [
    { name: "Trắng", hex: "#FFFFFF" },
    { name: "Trắng kem", hex: "#F4F1EA" },
    { name: "Xám nhạt", hex: "#D9D9D6" },
    { name: "Ghi bạc", hex: "#B9BCBF" },
    { name: "Xám lông chuột", hex: "#8A8D8F" },
  ],
  Mộc: [
    { name: "Xanh bạc hà", hex: "#D4EBDD" },
    { name: "Xanh nõn chuối", hex: "#C5DC8A" },
    { name: "Xanh lá non", hex: "#8BC48A" },
    { name: "Xanh lá cây", hex: "#3E8E5A" },
    { name: "Xanh rêu", hex: "#5B6B3A" },
  ],
  Thủy: [
    { name: "Xanh da trời nhạt", hex: "#D6E8F5" },
    { name: "Xanh ngọc nhạt", hex: "#A9CFE3" },
    { name: "Xanh dương", hex: "#3F7CAC" },
    { name: "Xanh nước biển", hex: "#1F3F66" },
    { name: "Đen", hex: "#1E1E1E" },
  ],
  Hỏa: [
    { name: "Hồng phấn", hex: "#F6D6D6" },
    { name: "Cam đào", hex: "#F4B183" },
    { name: "Tím nhạt", hex: "#C9B6DA" },
    { name: "Đỏ gạch", hex: "#B5452E" },
    { name: "Đỏ", hex: "#C62828" },
  ],
  Thổ: [
    { name: "Vàng kem", hex: "#F6E7B8" },
    { name: "Be", hex: "#E3D3B5" },
    { name: "Vàng đất", hex: "#D9A441" },
    { name: "Nâu đất", hex: "#8B5E3C" },
    { name: "Nâu cà phê", hex: "#5D4030" },
  ],
};

/** Mức hợp của một hành màu đối với mệnh, xếp từ tốt đến xấu. */
export type ColorRank = "tuong-sinh" | "hoa-hop" | "che-khac" | "sinh-xuat" | "ky";

/** Quan hệ "màu → mệnh" (theo `elementRelation`) sang mức hợp. */
const RANK_OF: Record<ElementRelation, ColorRank> = {
  "nam-sinh-menh": "tuong-sinh", // hành màu sinh mệnh
  "binh-hoa": "hoa-hop", // cùng hành
  "menh-khac-nam": "che-khac", // mệnh khắc hành màu — chế ngự được
  "menh-sinh-nam": "sinh-xuat", // mệnh sinh hành màu — hao tổn
  "nam-khac-menh": "ky", // hành màu khắc mệnh
};

export const RANKS: readonly ColorRank[] = [
  "tuong-sinh",
  "hoa-hop",
  "che-khac",
  "sinh-xuat",
  "ky",
];

export const colorRank = (menh: Element, color: Element): ColorRank =>
  RANK_OF[elementRelation(menh, color)];

/** 5 hành màu xếp theo mức hợp với mệnh. */
export function rankedElements(menh: Element) {
  return ELEMENTS.map((element) => ({
    element,
    rank: colorRank(menh, element),
  })).sort((a, b) => RANKS.indexOf(a.rank) - RANKS.indexOf(b.rank));
}

/** Ngũ hành của 8 hướng theo Hậu thiên bát quái. */
export const DIRECTION_ELEMENT: Record<Direction, Element> = {
  N: "Thủy",
  NE: "Thổ",
  E: "Mộc",
  SE: "Mộc",
  S: "Hỏa",
  SW: "Thổ",
  W: "Kim",
  NW: "Kim",
};

/** Hướng nhận nắng gắt buổi chiều / trưa ở Việt Nam — nên sơn mặt tiền màu sáng. */
export const HOT_FACINGS: readonly Direction[] = ["W", "SW", "S", "NW"];

/** Hành nào khắc hành nào: Kim→Mộc→Thổ→Thủy→Hỏa→Kim. */
export const overcomes = (a: Element, b: Element) =>
  elementRelation(b, a) === "nam-khac-menh";
