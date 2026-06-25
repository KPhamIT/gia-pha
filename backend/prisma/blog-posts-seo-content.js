/**
 * Nội dung SEO thực chiến — gắn domain coinguon.io.vn.
 * @typedef {{ p: (t: string) => string; h2: (t: string) => string; ul: (items: string[]) => string }} HtmlHelpers
 */

const SITE = 'https://www.coinguon.io.vn';
const BRAND = 'Gia phả điện tử';

const PAGES = {
  home: `${SITE}/`,
  blog: `${SITE}/bai-viet`,
  register: `${SITE}/tao-dong-ho`,
  guide: `${SITE}/huong-dan`,
  book: `${SITE}/book`,
  tree: `${SITE}/family-tree`,
  join: `${SITE}/join`,
  contact: `${SITE}/lien-he`,
  about: `${SITE}/gioi-thieu`,
  sitemap: `${SITE}/sitemap.xml`,
};

function ctaBlock() {
  return `<p class="blog-cta">Dùng thử <strong><a href="${PAGES.home}">${BRAND}</a></strong> tại <a href="${PAGES.home}">coinguon.io.vn</a> — tra cứu sổ gia phả, cây phả hệ, nhắc ngày giỗ âm lịch trên điện thoại. <a href="${PAGES.register}">Đăng ký dòng họ</a> · <a href="${PAGES.blog}">Đọc thêm bài viết</a></p>`;
}

/** @type {Record<string, { meta: string; excerpt: string; build: (title: string, h: HtmlHelpers) => string }>} */
export const SEO_ARTICLE_MAP = {
  'cach-dua-website-len-top-google-bang-viet-bai-chuan-seo': {
    meta: `Chiến lược đưa coinguon.io.vn lên top Google bằng viết bài chuẩn SEO — content marketing cho website gia phả điện tử.`,
    excerpt: `Cách đưa ${SITE} lên top Google: xây thư viện bài viết gia phả, tối ưu on-page và theo dõi Search Console.`,
    build: (title, { p, h2, ul }) =>
      [
        p(`${title}. Website ${BRAND} (${SITE}) đang triển khai mô hình này: thay vì chỉ có trang chủ, chúng tôi xây hàng chục bài trả lời câu hỏi thật của trưởng họ và con cháu.`),
        h2(`Tại sao ${SITE} cần blog, không chỉ landing page?`),
        p(`Trang chủ tối ưu cho "gia phả điện tử", nhưng Google còn đưa người dùng qua câu hỏi nhỏ: "nhắc ngày giỗ âm lịch", "phần mềm gia phả miễn phí". Mỗi bài tại ${PAGES.blog} là một cửa tìm kiếm mới.`),
        h2('Quy trình 5 bước trên coinguon.io.vn'),
        ul([
          'Liệt kê câu hỏi khách hàng thật — trưởng họ, thư ký, con cháu xa quê.',
          'Mỗi câu hỏi = một bài: từ khóa trong H1, meta description riêng, slug không dấu.',
          `Xuất bản tại ${PAGES.blog}, link nội bộ về ${PAGES.register} và ${PAGES.guide}.`,
          `Gửi ${PAGES.sitemap} trong Google Search Console.`,
          'Sau 28 ngày: tối ưu title/meta theo CTR.',
        ]),
        h2('Câu hỏi thường gặp'),
        '<h3>Bao nhiêu bài để có traffic ổn định?</h3>',
        p(`${SITE} hiện có ~90 bài — mục tiêu 100–150 bài năm đầu, phủ gia phả, cây gia đình, ngày giỗ, in ấn.`),
        ctaBlock(),
      ].join('\n'),
  },

  'content-marketing-la-gi-vi-sao-viet-blog-giup-website-duoc-tim-thay': {
    meta: `Content marketing cho ${SITE}: blog gia phả giúp khách tìm thấy sổ gia phả, cây phả hệ và nhắc giỗ âm lịch.`,
    excerpt: `Content marketing trên coinguon.io.vn: chia sẻ kiến thức gia phả miễn phí, chuyển đổi sang dùng sản phẩm.`,
    build: (title, { p, h2, ul }) =>
      [
        p(`${title}. Với ${BRAND}, content marketing giải đáp thắc mắc thật: lưu gia phả trên điện thoại, nhắc giỗ, in bài cúng.`),
        h2('Khác quảng cáo trả phí'),
        p(`Ads dừng khi hết tiền. Bài SEO trên ${PAGES.blog} vẫn trên Google nhiều năm — traffic tích lũy miễn phí.`),
        h2(`Ví dụ trên ${SITE}`),
        ul([
          `Bài lập gia phả → CTA ${PAGES.register}`,
          `Bài nhắc giỗ âm lịch → tính năng thông báo → ${PAGES.book}`,
          `Bài hướng dẫn → ${PAGES.guide}`,
        ]),
        ctaBlock(),
      ].join('\n'),
  },

  'huong-dan-viet-bai-chuan-seo-tu-a-den-z-cho-nguoi-moi-bat-dau': {
    meta: `Viết bài SEO A–Z cho blog coinguon.io.vn/bai-viet: title, meta, H2, FAQ, sitemap.`,
    excerpt: `Quy trình viết bài chuẩn SEO cho ${SITE}: từ khóa, heading, meta, FAQ, đăng /bai-viet.`,
    build: (title, { p, h2, ul }) =>
      [
        p(`${title}. Checklist đội ${BRAND} dùng cho mỗi bài trên ${PAGES.blog}.`),
        h2('Bước 1–5'),
        ul([
          'Nghiên cứu từ khóa (Search Console, Google Suggest).',
          'Title H1 + meta description 150–160 ký tự.',
          'Nội dung H2/H3, FAQ, đọc tốt trên mobile.',
          'Slug, tags, 3–6 internal link, JSON-LD Article.',
          `Kiểm tra ${PAGES.sitemap}, theo dõi Search Console.`,
        ]),
        ctaBlock(),
      ].join('\n'),
  },

  'cach-chon-tu-khoa-seo-cho-website-gia-pha-dong-ho': {
    meta: `Từ khóa SEO cho coinguon.io.vn: gia phả online, sổ gia phả, nhắc giỗ âm lịch, đăng ký dòng họ.`,
    excerpt: `Chọn từ khóa cho ${SITE}: map trưởng họ → /tao-dong-ho, con cháu → /book, kiến thức → /bai-viet.`,
    build: (title, { p, h2, ul }) =>
      [
        p(`${title}. ${SITE} phục vụ nhiều persona — mỗi nhóm tìm từ khóa khác.`),
        h2('Nhóm từ khóa'),
        ul([
          'Trưởng họ: phần mềm gia phả dòng họ, quản lý ngày giỗ',
          'Con cháu: tra cứu phả hệ, sổ gia phả điện thoại',
          'Thư ký: sổ công đức, in gia phả PDF',
        ]),
        h2('Map từ khóa → trang'),
        ul([
          `Sản phẩm → ${PAGES.home}`,
          `Hướng dẫn → ${PAGES.guide}`,
          `Câu hỏi → ${PAGES.blog}`,
          `Đăng ký → ${PAGES.register}`,
        ]),
        ctaBlock(),
      ].join('\n'),
  },

  'long-tail-keyword-la-gi-ap-dung-cho-nganh-gia-pha-va-pha-he': {
    meta: `Long-tail cho gia phả: coinguon.io.vn nhắm "nhắc giỗ âm lịch điện thoại", "in bài cúng giỗ tổ".`,
    excerpt: `Long-tail keyword ngành gia phả — ${SITE} ưu tiên câu dài, conversion cao.`,
    build: (title, { p, h2, ul }) =>
      [
        p(`${title}. Long-tail = cụm dài, ít cạnh tranh — phù hợp ${SITE}.`),
        h2('Ví dụ long-tail'),
        ul([
          'phần mềm gia phả miễn phí cho dòng họ Việt Nam',
          'nhắc ngày giỗ âm lịch trên điện thoại',
          'cách in bài cúng giỗ tổ từ điện thoại',
          'đăng ký dòng họ online làm quản trị viên',
        ]),
        p(`Mỗi tính năng ${BRAND} (${PAGES.book}, ${PAGES.tree}, thông báo giỗ) = một chủ đề long-tail.`),
        ctaBlock(),
      ].join('\n'),
  },

  'cau-truc-bai-viet-seo-title-meta-description-heading-h1-h2-h3': {
    meta: `Cấu trúc H1/H2/H3 và meta — chuẩn bài trên coinguon.io.vn/bai-viet.`,
    excerpt: `Cấu trúc bài SEO ${SITE}: một H1, H2 mục chính, H3 FAQ, meta riêng.`,
    build: (title, { p, h2, ul }) =>
      [
        p(`${title}. Mỗi bài ${PAGES.blog} tuân thủ cấu trúc sau.`),
        h2('Heading'),
        ul([
          'H1: một lần, có từ khóa',
          'H2: 3–5 mục chính',
          'H3: FAQ — featured snippet',
        ]),
        p(`Title tab: "[Bài] | Gia phả". Meta description ~160 ký tự, gợi ý truy cập coinguon.io.vn.`),
        ctaBlock(),
      ].join('\n'),
  },

  'sitemap-xml-va-robots-txt-vai-tro-trong-seo-website': {
    meta: `Sitemap ${SITE}/sitemap.xml và robots.txt — Google index 90+ bài /bai-viet.`,
    excerpt: `Sitemap & robots trên coinguon.io.vn: liệt kê blog, chặn /system, /org-users.`,
    build: (title, { p, h2, ul }) =>
      [
        p(`${title}. ${SITE} dùng sitemap động + robots.txt chuẩn.`),
        h2(`Sitemap ${PAGES.sitemap}`),
        p(`Liệt kê trang chủ, ${PAGES.guide}, ${PAGES.blog} và từng /bai-viet/[slug] với lastModified.`),
        h2('robots.txt'),
        ul([
          'Allow: /',
          'Disallow: /system, /org-users, /api/',
          `Sitemap: ${PAGES.sitemap}`,
        ]),
        p('Gửi sitemap trong Google Search Console sau khi verify domain.'),
        ctaBlock(),
      ].join('\n'),
  },

  'schema-org-json-ld-giup-google-hieu-bai-viet-nhu-the-nao': {
    meta: `JSON-LD Article trên coinguon.io.vn/bai-viet — schema Google cho bài gia phả.`,
    excerpt: `Schema.org trên ${SITE}: Article với headline, datePublished, publisher Gia phả điện tử.`,
    build: (title, { p, h2, ul }) =>
      [
        p(`${title}. Mỗi bài ${PAGES.blog} có JSON-LD type Article.`),
        h2('Trường chính'),
        ul([
          'headline, description, datePublished, dateModified',
          'keywords (tags), inLanguage: vi',
          `publisher: ${BRAND} — ${SITE}`,
        ]),
        p('Kiểm tra bằng Google Rich Results Test với URL bài bất kỳ.'),
        ctaBlock(),
      ].join('\n'),
  },

  'internal-linking-lien-ket-noi-bo-tang-thu-hang-tim-kiem': {
    meta: `Internal linking coinguon.io.vn: blog ↔ /tao-dong-ho ↔ /huong-dan ↔ trang chủ.`,
    excerpt: `Liên kết nội bộ ${SITE}: hub /bai-viet, CTA đăng ký, footer Kiến thức gia phả.`,
    build: (title, { p, h2 }) =>
      [
        p(`${title}. ${PAGES.blog} là hub — mỗi bài link 2–3 bài liên quan + ${PAGES.register} + ${PAGES.guide}.`),
        h2('Topic cluster'),
        p('Cluster "cây gia đình": khái niệm + hướng dẫn + tính năng ${PAGES.tree} trên coinguon.io.vn — link chéo.'),
        ctaBlock(),
      ].join('\n'),
  },

  'seo-on-page-12-yeu-to-can-toi-uu-truoc-khi-xuat-ban-bai': {
    meta: `12 yếu tố on-page cho bài coinguon.io.vn: title, slug, meta, H1–H3, tags, schema.`,
    excerpt: `Checklist on-page ${SITE} trước khi publish /bai-viet.`,
    build: (title, { p, h2, ul }) =>
      [
        p(`${title}. 12 hạng mục kiểm tra mỗi bài.`),
        h2('Checklist'),
        ul([
          'Từ khóa trong title, H1, 2–3 H2',
          'Meta 150–160 ký tự',
          'Slug sạch, 5–8 tags',
          '3–6 internal links + CTA',
          'JSON-LD, sitemap, mobile-friendly',
        ]),
        ctaBlock(),
      ].join('\n'),
  },

  'cach-len-ke-hoach-50-100-bai-viet-cho-website-gia-pha': {
    meta: `Kế hoạch 90–150 bài cho coinguon.io.vn — 6 nhóm chủ đề gia phả.`,
    excerpt: `${SITE} đã có ~90 bài — lộ trình mở rộng content gia phả.`,
    build: (title, { p, h2, ul }) =>
      [
        p(`${title}. ${SITE}: ~90 bài, 6 nhóm (cơ bản, hướng dẫn, văn hóa, cây gia đình, online, SEO).`),
        h2('Lịch gợi ý'),
        ul([
          'Q1: 30 bài long-tail',
          'Q2: 30 bài map tính năng (sổ, cây, giỗ, bài cúng)',
          'Q3–Q4: refresh + bài mới từ Search Console',
        ]),
        ctaBlock(),
      ].join('\n'),
  },

  'google-search-console-theo-doi-thu-hang-va-luot-tim-kiem': {
    meta: `Search Console cho coinguon.io.vn: query gia phả, CTR /bai-viet, index sitemap.`,
    excerpt: `Theo dõi SEO ${SITE} qua Google Search Console — verify, sitemap, Performance.`,
    build: (title, { p, h2, ul }) =>
      [
        p(`${title}. Công cụ miễn phí bắt buộc cho ${SITE}.`),
        h2('Thiết lập'),
        ul([
          'Thêm property coinguon.io.vn',
          'Verify DNS hoặc HTML',
          `Gửi ${PAGES.sitemap}`,
        ]),
        h2('Đọc báo cáo'),
        p('Performance: query có impression nhưng CTR thấp → sửa title. Position 5–15 → bổ sung nội dung + internal link.'),
        ctaBlock(),
      ].join('\n'),
  },

  'backlink-la-gi-xay-dung-uy-tin-website-gia-pha-an-toan': {
    meta: `Backlink an toàn cho coinguon.io.vn — hội họ, văn hóa, không spam.`,
    excerpt: `Xây backlink uy tín cho ${SITE}: dòng họ đối tác, guest post, tránh mua link.`,
    build: (title, { p, h2, ul }) =>
      [
        p(`${title}. Backlink = link từ site khác về ${SITE}.`),
        h2('Cách an toàn'),
        ul([
          'Dòng họ dùng sản phẩm link về coinguon.io.vn',
          'Guest post blog văn hóa',
          'Báo địa phương về số hóa gia phả',
        ]),
        h2('Tránh'),
        p('Mua backlink spam — Google có thể phạt cả domain.'),
        ctaBlock(),
      ].join('\n'),
  },

  'viet-bai-tra-loi-cau-hoi-nguoi-dung-chien-luoc-featured-snippet': {
    meta: `Featured snippet: FAQ bài coinguon.io.vn — "gia phả là gì", "nhắc giỗ âm lịch".`,
    excerpt: `Snippet Google cho ${SITE}: H3 câu hỏi + trả lời 40–60 từ.`,
    build: (title, { p, h2 }) =>
      [
        p(`${title}. Mục FAQ mỗi bài ${PAGES.blog} nhắm featured snippet.`),
        h2('Định dạng'),
        p('H3 dạng câu hỏi + đoạn ngắn hoặc danh sách bước. Ví dụ: "Gia phả điện tử là gì?" — trả lời trực tiếp, nhắc ${BRAND}.'),
        ctaBlock(),
      ].join('\n'),
  },

  'cap-nhat-noi-dung-cu-giu-thu-hang-seo-ben-vung': {
    meta: `Refresh bài cũ coinguon.io.vn/bai-viet — giữ thứ hạng SEO gia phả.`,
    excerpt: `Cập nhật content ${SITE} 6–12 tháng/lần: tính năng mới, FAQ, dateModified.`,
    build: (title, { p, h2, ul }) =>
      [
        p(`${title}. Review bài ${PAGES.blog} định kỳ.`),
        h2('Khi nào update'),
        ul([
          'Position giảm trên Search Console',
          'Số bài/tính năng coinguon.io.vn đã đổi',
          'CTR giảm — thử title mới',
        ]),
        p('Giữ nguyên slug URL — tránh mất thứ hạng.'),
        ctaBlock(),
      ].join('\n'),
  },

  'toc-do-tai-trang-mobile-va-core-web-vitals-anh-huong-seo-ra-sao': {
    meta: `Core Web Vitals coinguon.io.vn — mobile-first cho tra cứu gia phả.`,
    excerpt: `${SITE} tối ưu mobile: SSG blog, font swap, PageSpeed cho SEO.`,
    build: (title, { p, h2, ul }) =>
      [
        p(`${title}. User ${BRAND} chủ yếu dùng điện thoại — Google mobile-first.`),
        h2('Core Web Vitals'),
        ul(['LCP < 2.5s', 'INP phản hồi nhanh', 'CLS ổn định layout']),
        p(`Trang /bai-viet dùng SSG — HTML tĩnh tải nhanh. Kiểm tra PageSpeed Insights cho ${PAGES.home} và một bài blog.`),
        ctaBlock(),
      ].join('\n'),
  },

  'chia-se-bai-viet-len-mang-xa-hoi-co-giup-seo-khong': {
    meta: `Share bài coinguon.io.vn lên Zalo/Facebook — traffic & brand search.`,
    excerpt: `Social cho ${SITE}: gián tiếp SEO qua traffic và tìm kiếm thương hiệu.`,
    build: (title, { p, h2, ul }) =>
      [
        p(`${title}. Share không phải ranking factor trực tiếp nhưng hữu ích cho ${SITE}.`),
        h2('Lợi ích'),
        ul([
          'Traffic từ nhóm Zalo dòng họ',
          'Brand search: "coinguon", "gia phả điện tử"',
          'Open Graph — preview đẹp khi share link /bai-viet',
        ]),
        ctaBlock(),
      ].join('\n'),
  },

  'checklist-seo-truoc-khi-dang-moi-bai-viet-len-website': {
    meta: `Checklist 15 mục trước khi đăng bài coinguon.io.vn/bai-viet.`,
    excerpt: `Publish checklist ${SITE}: keyword, meta, links, sitemap, mobile.`,
    build: (title, { p, h2, ul }) =>
      [
        p(`${title}. Dùng mỗi lần thêm bài ${PAGES.blog}.`),
        h2('15 mục'),
        ul([
          'Từ khóa, title, meta, H1, ≥3 H2, FAQ',
          'Slug, tags, internal links, CTA',
          'Mobile, JSON-LD, sitemap',
          '(Tuỳ chọn) Request indexing Search Console',
        ]),
        ctaBlock(),
      ].join('\n'),
  },

  'seo-dia-phuong-tiep-can-nguoi-tim-gia-pha-theo-tinh-thanh': {
    meta: `Local SEO coinguon.io.vn — gia phả + địa danh, dịch vụ nhập liệu.`,
    excerpt: `SEO địa phương ${SITE}: bài theo tỉnh/họ tộc, liên hệ ${PAGES.contact}.`,
    build: (title, { p, h2, ul }) =>
      [
        p(`${title}. Trưởng họ hay tìm "gia phả + địa phương".`),
        h2('Chiến lược'),
        ul([
          'Bài gia phả theo tỉnh (ưu tiên nơi có khách)',
          `CTA dịch vụ nhập liệu → ${PAGES.contact}`,
          'Google Business nếu có dịch vụ tại chỗ',
        ]),
        ctaBlock(),
      ].join('\n'),
  },

  'ap-dung-e-e-a-t-khi-viet-bai-ve-gia-pha-va-lich-su-dong-ho': {
    meta: `E-E-A-T cho nội dung gia phả trên coinguon.io.vn — chính xác, có nguồn.`,
    excerpt: `E-E-A-T ${SITE}: uy tín chủ đề gia phả, ${PAGES.about}, chính sách bảo mật.`,
    build: (title, { p, h2, ul }) =>
      [
        p(`${title}. Nội dung lịch sử dòng họ cần đáng tin — ${SITE} tuân thủ E-E-A-T.`),
        h2('Áp dụng'),
        ul([
          'Experience: case dòng họ thật (có phép)',
          'Expertise: biên tập bởi người am hiểu phong tục',
          `Trust: HTTPS, ${PAGES.contact}, chính sách bảo mật`,
        ]),
        h2('Tránh'),
        p('Bịa lịch sử, copy không kiểm chứng. Ghi "cần đối chiếu sổ địa phương" khi cần.'),
        ctaBlock(),
      ].join('\n'),
  },
};

export function buildSeoContentBySlug(slug, title, helpers) {
  const article = SEO_ARTICLE_MAP[slug];
  if (article) return article.build(title, helpers);
  return null;
}

export function getSeoMetaBySlug(slug, title) {
  const article = SEO_ARTICLE_MAP[slug];
  if (article) return article.meta;
  const base = title.endsWith('?') ? title.slice(0, -1) : title;
  return `${base}. Hướng dẫn SEO cho ${SITE} — ${BRAND}.`;
}

export function getSeoExcerptBySlug(slug, title) {
  const article = SEO_ARTICLE_MAP[slug];
  if (article) return article.excerpt;
  return `${title}. Áp dụng SEO cho website gia phả tại coinguon.io.vn.`;
}
