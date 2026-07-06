import type { BreadcrumbItem } from "@/lib/seo/types";
import { buildAbsoluteUrl } from "@/config/site";

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  if (items.length === 0) return null;
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: buildAbsoluteUrl(item.path),
    })),
  };
}

const PATH_SEGMENT_LABELS: Record<string, string> = {
  "huong-dan": "Hướng dẫn",
  "bai-viet": "Kiến thức gia phả",
  "gioi-thieu": "Giới thiệu",
  "dich-vu": "Dịch vụ",
  "lien-he": "Liên hệ",
  "chinh-sach-bao-mat": "Chính sách bảo mật",
  "dieu-khoan-su-dung": "Điều khoản sử dụng",
  "bang-gia": "Bảng giá",
  "thanh-toan": "Thanh toán",
};

/** Build breadcrumbs from URL path; optional `lastLabel` overrides the final segment. */
export function breadcrumbsFromPath(
  path: string,
  lastLabel?: string,
): BreadcrumbItem[] {
  const normalized = path === "/" ? "" : path.replace(/^\//, "").replace(/\/$/, "");
  const items: BreadcrumbItem[] = [{ name: "Trang chủ", path: "/" }];
  if (!normalized) return items;

  const segments = normalized.split("/");
  let acc = "";
  segments.forEach((segment, index) => {
    acc += `/${segment}`;
    const isLast = index === segments.length - 1;
    const name = isLast && lastLabel
      ? lastLabel
      : PATH_SEGMENT_LABELS[segment] ?? segment;
    items.push({ name, path: acc });
  });
  return items;
}
