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
  BLOG_ADMIN_TAB: "Bài viết",
  BLOG_ADMIN_CREATE: "Tạo bài viết",
  BLOG_ADMIN_EDIT: "Sửa",
  BLOG_ADMIN_DELETE: "Xóa",
  BLOG_ADMIN_DELETE_CONFIRM: "Xóa bài viết này? Hành động không thể hoàn tác.",
  BLOG_ADMIN_PUBLISHED: "Đã xuất bản",
  BLOG_ADMIN_DRAFT: "Bản nháp",
  BLOG_ADMIN_TITLE: "Tiêu đề",
  BLOG_ADMIN_SLUG: "Slug (URL)",
  BLOG_ADMIN_EXCERPT: "Tóm tắt",
  BLOG_ADMIN_CONTENT: "Nội dung (HTML)",
  BLOG_ADMIN_META: "Meta description (SEO)",
  BLOG_ADMIN_CATEGORY: "Chủ đề",
  BLOG_ADMIN_TAGS: "Từ khóa (phân cách bằng dấu phẩy)",
  BLOG_ADMIN_PUBLISHED_AT: "Ngày đăng",
  BLOG_ADMIN_PUBLISHED_LABEL: "Xuất bản công khai",
  BLOG_ADMIN_VIEW_PUBLIC: "Xem trang công khai",
  BLOG_ADMIN_EMPTY: "Chưa có bài viết nào.",
  TOAST_BLOG_CREATED: "Đã tạo bài viết",
  TOAST_BLOG_UPDATED: "Đã lưu bài viết",
  TOAST_BLOG_DELETED: "Đã xóa bài viết",
} as const;

export const BLOG_CATEGORIES: BlogCategory[] = [
  "BASICS",
  "HOWTO",
  "CULTURE",
  "FAMILY_TREE",
  "ONLINE",
  "SEO",
];
