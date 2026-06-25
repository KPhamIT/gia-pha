import type { BlogCategory } from "@/lib/blog/types";

export const BLOG_CATEGORY_LABELS: Record<BlogCategory, string> = {
  BASICS: "Kiến thức cơ bản",
  HOWTO: "Hướng dẫn lập gia phả",
  CULTURE: "Văn hóa dòng họ",
  FAMILY_TREE: "Cây gia đình",
  ONLINE: "Gia phả online",
  SEO: "SEO & quảng bá",
};

export const BLOG_UI = {
  BLOG_LIST_TITLE: "Kiến thức gia phả",
  BLOG_LIST_SUBTITLE:
    "Tổng hợp bài viết về gia phả dòng họ, cây gia đình, SEO website và chiến lược content marketing",
  BLOG_ALL_CATEGORIES: "Tất cả chủ đề",
  BLOG_READ_MORE: "Đọc tiếp",
  BLOG_BACK_TO_LIST: "Danh sách bài viết",
  BLOG_TAGS_LABEL: "Từ khóa",
  BLOG_PUBLISHED_AT: "Đăng ngày",
  BLOG_RELATED_CTA_TITLE: "Bắt đầu gia phả cho dòng họ của bạn",
  BLOG_RELATED_CTA_BODY:
    "Tạo gia phả online miễn phí — cây gia phả, sổ gia phả điện tử và chia sẻ cho cả họ hàng.",
  BLOG_RELATED_CTA_BUTTON: "Đăng ký dòng họ",
  BLOG_EMPTY: "Chưa có bài viết.",
} as const;

export const BLOG_CATEGORIES: BlogCategory[] = [
  "BASICS",
  "HOWTO",
  "CULTURE",
  "FAMILY_TREE",
  "ONLINE",
  "SEO",
];
