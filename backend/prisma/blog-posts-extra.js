/** @typedef {'BASICS'|'HOWTO'|'CULTURE'|'FAMILY_TREE'|'ONLINE'|'SEO'} BlogCategory */

import {
  buildSeoContentBySlug,
  getSeoExcerptBySlug,
  getSeoMetaBySlug,
} from './blog-posts-seo-content.js';

/** Bài viết SEO, content marketing và long-tail bổ sung */
export const BLOG_ENTRIES_EXTRA = [
  // Nhóm 6: SEO & đưa website lên top
  { title: 'Cách đưa website lên top Google bằng viết bài chuẩn SEO', category: 'SEO' },
  { title: 'Content marketing là gì? Vì sao viết blog giúp website được tìm thấy?', category: 'SEO' },
  { title: 'Hướng dẫn viết bài chuẩn SEO từ A đến Z cho người mới bắt đầu', category: 'SEO' },
  { title: 'Cách chọn từ khóa SEO cho website gia phả dòng họ', category: 'SEO' },
  { title: 'Long-tail keyword là gì? Áp dụng cho ngành gia phả và phả hệ', category: 'SEO' },
  { title: 'Cấu trúc bài viết SEO: title, meta description, heading H1 H2 H3', category: 'SEO' },
  { title: 'Sitemap XML và robots.txt — vai trò trong SEO website', category: 'SEO' },
  { title: 'Schema.org JSON-LD giúp Google hiểu bài viết như thế nào?', category: 'SEO' },
  { title: 'Internal linking: liên kết nội bộ tăng thứ hạng tìm kiếm', category: 'SEO' },
  { title: 'SEO on-page: 12 yếu tố cần tối ưu trước khi xuất bản bài', category: 'SEO' },
  { title: 'Cách lên kế hoạch 50–100 bài viết cho website gia phả', category: 'SEO' },
  { title: 'Google Search Console: theo dõi thứ hạng và lượt tìm kiếm', category: 'SEO' },
  { title: 'Backlink là gì? Xây dựng uy tín website gia phả an toàn', category: 'SEO' },
  { title: 'Viết bài trả lời câu hỏi người dùng — chiến lược featured snippet', category: 'SEO' },
  { title: 'Cập nhật nội dung cũ: giữ thứ hạng SEO bền vững', category: 'SEO' },
  { title: 'Tốc độ tải trang mobile và Core Web Vitals ảnh hưởng SEO ra sao?', category: 'SEO' },
  { title: 'Chia sẻ bài viết lên mạng xã hội có giúp SEO không?', category: 'SEO' },
  { title: 'Checklist SEO trước khi đăng mỗi bài viết lên website', category: 'SEO' },
  { title: 'SEO địa phương: tiếp cận người tìm gia phả theo tỉnh thành', category: 'SEO' },
  { title: 'Áp dụng E-E-A-T khi viết bài về gia phả và lịch sử dòng họ', category: 'SEO' },
  // Long-tail gia phả — tăng lượng từ khóa ngách
  { title: 'Phần mềm làm gia phả miễn phí tốt nhất cho dòng họ Việt Nam', category: 'ONLINE' },
  { title: 'Cách tra cứu phả hệ và nguồn gốc họ tộc trên mạng', category: 'HOWTO' },
  { title: 'Gia phả 3 đời, 5 đời là gì? Cách ghi đúng thế hệ', category: 'BASICS' },
  { title: 'Thế hệ, chi, nhánh trong gia phả dòng họ — giải thích dễ hiểu', category: 'BASICS' },
  { title: 'Mẫu sơ đồ phả hệ Word và Excel cho dòng họ', category: 'HOWTO' },
  { title: 'Cách in gia phả ra sách đẹp cho lễ giỗ tổ dòng họ', category: 'HOWTO' },
  { title: 'Ghi chép tiểu sử tổ tiên trong gia phả — mẫu và gợi ý', category: 'HOWTO' },
  { title: 'Quy tắc đặt tên thế hệ trong các dòng họ Việt Nam', category: 'CULTURE' },
  { title: 'Lễ tảo mộ và ghi nhận mộ phần trong gia phả', category: 'CULTURE' },
  { title: 'Phụ nữ trong gia phả dòng họ: cách ghi nhận đúng truyền thống', category: 'CULTURE' },
  { title: 'Gia phả song ngữ Việt — Hán: khi nào cần và cách trình bày', category: 'BASICS' },
  { title: 'Tìm họ nội, họ ngoại trên cây gia đình — hướng dẫn nhanh', category: 'FAMILY_TREE' },
  { title: 'Xuất PDF cây gia phả để in khổ lớn treo nhà thờ họ', category: 'ONLINE' },
  { title: 'Quản lý ngày giỗ âm lịch trong gia phả điện tử', category: 'ONLINE' },
  { title: 'Gia phả và GDPR: bảo vệ dữ liệu cá nhân họ hàng', category: 'ONLINE' },
  { title: 'So sánh ứng dụng gia phả trên điện thoại và website', category: 'ONLINE' },
  { title: 'Cách thuyết phục trưởng họ đầu tư vào gia phả online', category: 'HOWTO' },
  { title: 'Gia phả cho dòng họ ít người: bắt đầu từ đâu?', category: 'BASICS' },
  { title: 'Kể chuyện tổ tiên cho trẻ em qua cây gia đình tương tác', category: 'FAMILY_TREE' },
  { title: 'Hợp tác biên tập gia phả: nhiều người cùng cập nhật online', category: 'ONLINE' },
];

const SEO_TAGS = [
  'SEO',
  'coinguon.io.vn',
  'content marketing',
  'viết bài chuẩn SEO',
  'đưa website lên top',
  'từ khóa Google',
  'gia phả online',
  'website gia phả',
];

export function pickSeoTags() {
  return [...SEO_TAGS];
}

export function buildSeoContentHtml(slug, title, helpers) {
  return buildSeoContentBySlug(slug, title, helpers) ?? '';
}

export function buildSeoMetaDescription(slug, title) {
  return getSeoMetaBySlug(slug, title);
}

export function buildSeoExcerpt(slug, title) {
  return getSeoExcerptBySlug(slug, title);
}
