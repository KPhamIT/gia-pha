/** Can chi, ngũ hành nạp âm theo năm âm lịch. */

export const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"] as const;
export const CHI = [
  "Tý",
  "Sửu",
  "Dần",
  "Mão",
  "Thìn",
  "Tỵ",
  "Ngọ",
  "Mùi",
  "Thân",
  "Dậu",
  "Tuất",
  "Hợi",
] as const;

export type Element = "Kim" | "Mộc" | "Thủy" | "Hỏa" | "Thổ";

/** 30 cặp nạp âm theo thứ tự lục thập hoa giáp (bắt đầu Giáp Tý, Ất Sửu). */
const NAP_AM = [
  "Hải Trung Kim",
  "Lư Trung Hỏa",
  "Đại Lâm Mộc",
  "Lộ Bàng Thổ",
  "Kiếm Phong Kim",
  "Sơn Đầu Hỏa",
  "Giản Hạ Thủy",
  "Thành Đầu Thổ",
  "Bạch Lạp Kim",
  "Dương Liễu Mộc",
  "Tuyền Trung Thủy",
  "Ốc Thượng Thổ",
  "Tích Lịch Hỏa",
  "Tùng Bách Mộc",
  "Trường Lưu Thủy",
  "Sa Trung Kim",
  "Sơn Hạ Hỏa",
  "Bình Địa Mộc",
  "Bích Thượng Thổ",
  "Kim Bạch Kim",
  "Phú Đăng Hỏa",
  "Thiên Hà Thủy",
  "Đại Trạch Thổ",
  "Thoa Xuyến Kim",
  "Tang Đố Mộc",
  "Đại Khê Thủy",
  "Sa Trung Thổ",
  "Thiên Thượng Hỏa",
  "Thạch Lựu Mộc",
  "Đại Hải Thủy",
] as const;

const mod = (n: number, m: number) => ((n % m) + m) % m;

export function canIndex(year: number): number {
  return mod(year - 4, 10);
}

export function chiIndex(year: number): number {
  return mod(year - 4, 12);
}

/** "Đinh Mùi" */
export function canChi(year: number): string {
  return `${CAN[canIndex(year)]} ${CHI[chiIndex(year)]}`;
}

export function napAm(year: number): { name: string; element: Element } {
  const name = NAP_AM[Math.floor(mod(year - 4, 60) / 2)];
  return { name, element: name.split(" ").pop() as Element };
}

const GENERATES: Record<Element, Element> = {
  Kim: "Thủy",
  Thủy: "Mộc",
  Mộc: "Hỏa",
  Hỏa: "Thổ",
  Thổ: "Kim",
};
const OVERCOMES: Record<Element, Element> = {
  Kim: "Mộc",
  Mộc: "Thổ",
  Thổ: "Thủy",
  Thủy: "Hỏa",
  Hỏa: "Kim",
};

/** Quan hệ ngũ hành của năm đối với mệnh người. */
export type ElementRelation = "nam-sinh-menh" | "binh-hoa" | "menh-sinh-nam" | "menh-khac-nam" | "nam-khac-menh";

export function elementRelation(person: Element, year: Element): ElementRelation {
  if (person === year) return "binh-hoa";
  if (GENERATES[year] === person) return "nam-sinh-menh";
  if (GENERATES[person] === year) return "menh-sinh-nam";
  if (OVERCOMES[person] === year) return "menh-khac-nam";
  return "nam-khac-menh";
}
