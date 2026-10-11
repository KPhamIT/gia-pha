/**
 * Từ điển tên theo ngũ hành — chỉ gồm những tên mà cách phân loại dân gian phổ biến
 * (theo nghĩa Hán Việt / bộ thủ) khá thống nhất. Tên không có ở đây thì người dùng tự chọn hành.
 * Định dạng: "Tên:giới" — m = nam, f = nữ, u = cả hai.
 */
import type { Element } from "@/lib/xem-tuoi/can-chi";

export const ELEMENTS: Element[] = ["Kim", "Mộc", "Thủy", "Hỏa", "Thổ"];

export type NameGender = "m" | "f" | "u";
export type NameEntry = { name: string; element: Element; gender: NameGender };

const RAW: Record<Element, string> = {
  Kim: "Kim:u Ngân:f Cương:m Thiết:m Chung:m Kính:m Nhuệ:m Luyện:m Đoan:f Hân:f Ái:f Ân:u Khanh:u Liêm:m Nghĩa:m Nhi:f Xuyến:f Trang:f Thế:m Thắng:m Hiền:f Mỹ:f Phong:m Vân:f Hữu:m",
  Mộc: "Lâm:m Tùng:m Bách:m Sâm:m Đào:f Mai:f Lan:f Cúc:f Huệ:f Liễu:f Quỳnh:f Trúc:f Thảo:f Xuân:u Phương:u Quế:f Hạnh:f Trà:f Khôi:m Kỳ:m Nhân:m Đông:m Thư:f Giao:u Chi:f Diệp:f Hoa:f Vy:f",
  Thủy: "Hải:m Hà:f Giang:u Thủy:f Tuyền:f Uyên:f Băng:f Khê:f Hồ:m Sương:f Vũ:m Lệ:f Nguyên:m Thanh:u Triều:m Nhuận:m",
  Hỏa: "Ánh:f Cẩm:f Dung:f Đan:f Đăng:m Hạ:f Hồng:f Huân:m Huy:m Linh:f Minh:u Nam:m Nhật:m Quang:m Viêm:m Dương:m Hiển:m Đức:m Hoàng:m Nhiên:u Chiếu:m",
  Thổ: "Sơn:m Thạch:m Điền:m Kiên:m Bảo:m Ngọc:f Bích:f Châu:f Khuê:f Cát:u Thành:m Đại:m Long:m Trung:m An:u",
};

export const NAMES: NameEntry[] = ELEMENTS.flatMap((element) =>
  RAW[element].split(" ").map((token) => {
    const [name, gender] = token.split(":");
    return { name, element, gender: gender as NameGender };
  }),
);

const key = (s: string) => s.trim().toLocaleLowerCase("vi").normalize("NFC");
const BY_NAME = new Map(NAMES.map((n) => [key(n.name), n]));

/** Hành của một chữ trong tên (vd. "Hải" → Thủy), null nếu chưa có trong từ điển. */
export function nameElement(word: string): Element | null {
  return BY_NAME.get(key(word))?.element ?? null;
}
