/**
 * Bài viết nhắm cụm từ khóa Google "Mọi người cũng tìm kiếm"
 * (gia phả dòng tộc, phần mềm gia phả, sổ gia phả, …).
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
};

function ctaBlock() {
  return `<p class="blog-cta">Dùng thử <strong><a href="${PAGES.home}">${BRAND}</a></strong> tại <a href="${PAGES.home}">coinguon.io.vn</a> — cây gia đình, sổ gia phả điện tử, website gia phả cho dòng họ. <a href="${PAGES.register}">Đăng ký dòng họ</a> · <a href="${PAGES.blog}">Đọc thêm bài viết</a></p>`;
}

/** @type {Record<string, { meta: string; excerpt: string; tags: string[]; build: (title: string, h: HtmlHelpers) => string }>} */
export const KEYWORD_ARTICLE_MAP = {
  'gia-pha-dong-toc-la-gi-vai-tro-cua-gia-pha-dong-toc-ngay-nay': {
    meta: `Gia phả dòng tộc là gì? Vai trò lưu giữ phả hệ, thế hệ và truyền thống họ tộc Việt Nam. Tìm hiểu tại coinguon.io.vn.`,
    excerpt: `Giải thích gia phả dòng tộc: khác gì gia phả dòng họ, vì sao dòng tộc cần ghi chép và chuyển số hóa.`,
    tags: [
      'gia phả dòng tộc',
      'gia phả dòng họ',
      'dòng tộc',
      'họ tộc Việt Nam',
      'gia phả',
      'tổ tiên',
    ],
    build: (title, { p, h2, ul }) =>
      [
        p(
          `${title}. Nhiều người tìm "gia phả dòng tộc" khi muốn hiểu phạm vi rộng hơn một gia đình nhỏ: toàn bộ họ tộc, các chi nhánh và thế hệ nối tiếp.`,
        ),
        h2('Gia phả dòng tộc là gì?'),
        p(
          'Gia phả dòng tộc là hệ thống ghi chép phả hệ của cả một dòng tộc — từ tổ tiên khởi đầu, các nhánh, chi họ, đến con cháu đời sau. Nội dung thường gồm tên húy, thụy hiệu, ngày sinh/ngày mất, nơi an táng, công đức và mối quan hệ huyết thống.',
        ),
        p(
          'Trong văn hóa Việt, gia phả dòng tộc gắn với nhà thờ họ, ngày giỗ tổ và vai trò trưởng họ — không chỉ là “danh sách tên” mà còn là kho nhớ tập thể của dòng tộc.',
        ),
        h2('Gia phả dòng tộc khác gia phả dòng họ như thế nào?'),
        ul([
          'Gia phả dòng họ thường dùng cho họ tộc theo họ (ví dụ họ Phạm, họ Nguyễn tại một làng).',
          'Gia phả dòng tộc nhấn mạnh phạm vi “tộc”: nhiều chi, nhiều nhánh cùng một gốc.',
          'Trong thực tế, hai cụm từ khóa thường được dùng xen kẽ; quan trọng là phạm vi ghi chép đã thỏa thuận với trưởng họ.',
        ]),
        h2('Vì sao nên số hóa gia phả dòng tộc?'),
        ul([
          'Con cháu phân tán nhiều tỉnh / nước ngoài vẫn tra cứu được.',
          'Giảm rủi ro mất sổ giấy do ẩm, cháy, hoặc thất lạc khi chuyển nhà thờ họ.',
          'Dễ cập nhật thêm đời mới, đính chính thông tin, xuất PDF in treo lễ.',
        ]),
        h2('Bắt đầu lập gia phả dòng tộc từ đâu?'),
        p(
          `Thu thập sổ cũ, bia mộ, lời truyền miệng từ người cao tuổi; chuẩn hóa thế hệ; rồi nhập lên website gia phả hoặc phần mềm gia phả online. Trên ${SITE} bạn có thể đăng ký dòng họ để dựng cây và sổ điện tử.`,
        ),
        `<p>Bắt đầu tại <a href="${PAGES.register}">đăng ký dòng họ</a> trên coinguon.io.vn.</p>`,
        ctaBlock(),
      ].join('\n'),
  },

  'gia-pha-dong-ho-khai-niem-cau-truc-va-cach-xay-dung': {
    meta: `Gia phả dòng họ: khái niệm, cấu trúc thế hệ–chi–nhánh và cách xây dựng từ sổ giấy đến gia phả online. coinguon.io.vn`,
    excerpt: `Tìm hiểu gia phả dòng họ là gì, gồm những phần nào và quy trình lập gia phả dòng họ đúng cách.`,
    tags: [
      'gia phả dòng họ',
      'gia phả',
      'dòng họ',
      'thế hệ',
      'phả hệ',
      'gia phả online',
    ],
    build: (title, { p, h2, ul }) =>
      [
        p(
          `${title}. "Gia phả dòng họ" là cụm từ khóa phổ biến trên Google khi người Việt tìm cách ghi chép và bảo tồn nguồn cội họ tộc.`,
        ),
        h2('Khái niệm gia phả dòng họ'),
        p(
          'Gia phả dòng họ là tài liệu hoặc hệ thống số ghi lại dòng dõi một dòng họ: tổ tiên, đời sau, quan hệ cha–con–vợ chồng, và thường kèm tiểu sử, ngày giỗ, mộ phần.',
        ),
        h2('Cấu trúc thường gặp'),
        ul([
          'Phần mở đầu: nguồn gốc họ, địa bàn (làng, xã, tỉnh).',
          'Phả hệ theo thế hệ: đời 1 (tổ), đời 2, đời 3…',
          'Chi / nhánh: tách theo các ông tổ chi.',
          'Phụ lục: công đức, biến cố lịch sử, quy ước đặt tên đời.',
        ]),
        h2('Cách xây dựng gia phả dòng họ'),
        ul([
          'Xác định phạm vi: một chi hay toàn họ tại địa phương.',
          'Thu thập & đối chiếu nhiều nguồn để tránh nhầm thế hệ.',
          'Chuẩn hóa cách ghi tên, giới tính, ngày âm/dương.',
          'Nhập vào cây gia đình / phần mềm gia phả để dễ tra cứu.',
        ]),
        h2('Gia phả dòng họ giấy và điện tử'),
        p(
          `Sổ giấy vẫn quý giá khi trình bày trong nhà thờ họ. Gia phả điện tử giúp cập nhật, tìm kiếm và chia sẻ. ${BRAND} tại ${SITE} kết hợp cả hai: quản lý online rồi xuất in khi cần.`,
        ),
        ctaBlock(),
      ].join('\n'),
  },

  'phan-mem-gia-pha-nen-chon-phan-mem-gia-pha-nao-cho-dong-ho': {
    meta: `Phần mềm gia phả là gì? Tiêu chí chọn phần mềm gia phả cho dòng họ Việt — so với Excel và website gia phả. coinguon.io.vn`,
    excerpt: `Hướng dẫn chọn phần mềm gia phả: tính năng cây phả hệ, sổ điện tử, nhắc giỗ, xuất PDF và bảo mật.`,
    tags: [
      'phần mềm gia phả',
      'gia phả online',
      'website gia phả',
      'phần mềm gia phả excel',
      'cây gia đình',
      'gia phả điện tử',
    ],
    build: (title, { p, h2, ul }) =>
      [
        p(
          `${title}. Nhiều trưởng họ và thư ký tìm "phần mềm gia phả" khi sổ giấy khó cập nhật và họ hàng ở xa cần xem chung một nguồn.`,
        ),
        h2('Phần mềm gia phả làm được gì?'),
        ul([
          'Vẽ / hiển thị cây gia đình nhiều đời.',
          'Quản lý hồ sơ thành viên, tiểu sử, mộ phần.',
          'Nhắc ngày giỗ âm lịch, sự kiện dòng họ.',
          'Xuất PDF, ảnh cây, sổ in cho lễ hội.',
          'Phân quyền: trưởng họ biên tập, con cháu xem.',
        ]),
        h2('Tiêu chí chọn phần mềm gia phả'),
        ul([
          'Hỗ trợ tiếng Việt, ngày âm lịch.',
          'Dùng được trên điện thoại (PWA / web).',
          'Sao lưu đám mây, không mất dữ liệu khi đổi máy.',
          'Có website gia phả hoặc cổng chia sẻ link tham gia.',
          'Xuất bản in đẹp — phục vụ nhà thờ họ.',
        ]),
        h2('Phần mềm gia phả so với Excel'),
        p(
          'Excel linh hoạt với người quen bảng tính, nhưng khó vẽ quan hệ phức tạp, dễ lỗi công thức và không thân thiện trên mobile. Phần mềm gia phả chuyên dụng tối ưu đúng bài toán phả hệ.',
        ),
        h2(`Gợi ý trên ${SITE}`),
        p(
          `${BRAND} là nền tảng website + phần mềm gia phả online: cây tương tác, sổ gia phả, nhắc giỗ. Bắt đầu tại <a href="${PAGES.register}">đăng ký dòng họ</a> hoặc xem <a href="${PAGES.guide}">hướng dẫn</a>.`,
        ),
        ctaBlock(),
      ].join('\n'),
  },

  'gia-pha-online-la-gi-huong-dan-dung-gia-pha-online-hieu-qua': {
    meta: `Gia phả online là gì? Lợi ích, rủi ro và hướng dẫn dùng gia phả online cho dòng họ. coinguon.io.vn`,
    excerpt: `Giải thích gia phả online: khác sổ giấy thế nào, ai nên dùng và cách bắt đầu an toàn.`,
    tags: [
      'gia phả online',
      'gia phả điện tử',
      'website gia phả',
      'phần mềm gia phả',
      'gia phả dòng họ',
      'cây gia đình',
    ],
    build: (title, { p, h2, ul }) =>
      [
        p(
          `${title}. "Gia phả online" thuộc nhóm từ khóa nhiều người tìm khi muốn quản lý phả hệ trên Internet thay vì chỉ giữ sổ trong nhà thờ họ.`,
        ),
        h2('Gia phả online là gì?'),
        p(
          'Gia phả online (hay gia phả điện tử trên web) là hệ thống lưu trữ và hiển thị phả hệ trên máy chủ/điện toán đám mây: bạn đăng nhập bằng trình duyệt hoặc ứng dụng, cập nhật thành viên và chia sẻ cho họ hàng theo quyền hạn.',
        ),
        h2('Lợi ích chính'),
        ul([
          'Cập nhật thời gian thực — ai cũng thấy bản mới nhất.',
          'Tra cứu nhanh theo tên, đời, nhánh.',
          'Con cháu ở xa vẫn tham gia biên tập / xem.',
          'Sao lưu giảm rủi ro mất sổ giấy.',
        ]),
        h2('Lưu ý khi dùng gia phả online'),
        ul([
          'Chọn nền tảng có đăng nhập và phân quyền.',
          'Không công khai toàn bộ dữ liệu nhạy cảm ra Internet mở.',
          'Vẫn nên xuất bản sao (PDF) định kỳ cho nhà thờ họ.',
        ]),
        h2('Cách bắt đầu'),
        p(
          `Tạo tổ chức dòng họ trên ${SITE}, mời trưởng họ / thư ký, nhập vài đời trước rồi mở rộng. Xem demo cây tại <a href="${PAGES.tree}">family-tree</a> và sổ tại <a href="${PAGES.book}">/book</a> sau khi đăng nhập.`,
        ),
        ctaBlock(),
      ].join('\n'),
  },

  'gia-pha-la-gi-giai-thich-gia-pha-don-gian-cho-nguoi-moi-bat-dau': {
    meta: `Gia phả là gì? Giải thích đơn giản về gia phả, khác cây gia đình / sổ hộ khẩu thế nào. coinguon.io.vn`,
    excerpt: `Gia phả là gì? Định nghĩa dễ hiểu, thành phần cơ bản và vì sao mỗi dòng họ nên có gia phả.`,
    tags: [
      'gia phả là gì',
      'gia phả',
      'gia phả dòng họ',
      'cây gia đình',
      'sổ gia phả',
      'tổ tiên',
    ],
    build: (title, { p, h2, ul }) =>
      [
        p(
          `${title}. Đây là câu hỏi được Google gợi ý trong mục "Mọi người cũng tìm kiếm" — bài viết trả lời ngắn gọn, đúng trọng tâm.`,
        ),
        h2('Gia phả là gì?'),
        p(
          'Gia phả là tập hợp thông tin về nguồn gốc và các thế hệ trong một dòng họ: tổ tiên là ai, con cháu thuộc đời thứ mấy, quan hệ huyết thống ra sao, kèm các ghi chép về ngày giỗ, nơi ở, công đức nếu có.',
        ),
        h2('Gia phả khác gì với…'),
        ul([
          'Sổ hộ khẩu: phục vụ hành chính nhà nước, không thay thế lịch sử dòng họ.',
          'Cây gia đình: sơ đồ trực quan quan hệ; gia phả thường giàu nội dung ghi chép hơn.',
          'Sổ gia phả: hình thức trình bày (sách/sổ) của nội dung gia phả.',
        ]),
        h2('Ai cần hiểu gia phả là gì?'),
        p(
          'Trưởng họ, thư ký dòng họ, và cả thế hệ trẻ muốn biết nguồn cội. Hiểu khái niệm giúp chọn đúng công cụ: sổ giấy, phần mềm gia phả Excel, hay website gia phả online.',
        ),
        h2('Bước tiếp theo'),
        p(
          `Sau khi nắm định nghĩa, hãy đọc thêm về <a href="${PAGES.blog}">cách lập gia phả</a> hoặc trải nghiệm ${BRAND} tại ${SITE}.`,
        ),
        ctaBlock(),
      ].join('\n'),
  },

  'phan-mem-gia-pha-excel-lam-gia-pha-bang-excel-va-han-che-can-biet': {
    meta: `Phần mềm gia phả Excel: cách làm gia phả bằng Excel, mẫu bảng và hạn chế so với website gia phả. coinguon.io.vn`,
    excerpt: `Hướng dẫn dùng Excel như phần mềm gia phả tạm thời — cấu trúc cột, lỗi thường gặp và khi nào nên chuyển online.`,
    tags: [
      'phần mềm gia phả excel',
      'phần mềm gia phả',
      'mẫu gia phả excel',
      'sơ đồ gia đình',
      'gia phả online',
      'gia phả dòng họ',
    ],
    build: (title, { p, h2, ul }) =>
      [
        p(
          `${title}. Nhiều gia đình bắt đầu với Excel vì quen thuộc — Google cũng ghi nhận nhu cầu tìm "phần mềm gia phả excel".`,
        ),
        h2('Excel có dùng làm phần mềm gia phả được không?'),
        p(
          'Được ở mức cơ bản: bạn có thể lập bảng thành viên, đánh số đời, lọc theo nhánh. Excel không phải phần mềm gia phả chuyên dụng, nhưng hữu ích khi mới thu thập dữ liệu.',
        ),
        h2('Gợi ý cấu trúc cột'),
        ul([
          'ID, ID cha, ID mẹ',
          'Họ tên, giới tính, đời / thế hệ',
          'Ngày sinh, ngày mất (âm/dương)',
          'Chi / nhánh, nơi sinh / nơi ở',
          'Ghi chú tiểu sử, nguồn tham khảo',
        ]),
        h2('Hạn chế của Excel'),
        ul([
          'Khó vẽ cây quan hệ phức tạp (hôn nhân nhiều đời, nhận nuôi).',
          'Dễ lệch ID khiến “mồ côi” dữ liệu.',
          'Khó chia sẻ đồng thời an toàn cho nhiều người biên tập.',
          'Trải nghiệm mobile kém so với website gia phả.',
        ]),
        h2('Khi nào nên chuyển sang phần mềm / website gia phả?'),
        p(
          `Khi dòng họ vượt vài chục người, cần nhắc giỗ, phân quyền hoặc in cây đẹp — hãy nhập dữ liệu Excel sang nền tảng như ${SITE} (${BRAND}) để quản lý lâu dài.`,
        ),
        ctaBlock(),
      ].join('\n'),
  },

  'website-gia-pha-tieu-chi-chon-website-gia-pha-cho-dong-ho': {
    meta: `Website gia phả: tiêu chí chọn website gia phả cho dòng họ — bảo mật, cây phả hệ, sổ điện tử. coinguon.io.vn`,
    excerpt: `Website gia phả là gì? Những tính năng cần có và cách đánh giá một website gia phả phù hợp dòng họ Việt.`,
    tags: [
      'website gia phả',
      'gia phả online',
      'phần mềm gia phả',
      'gia phả điện tử',
      'cây gia đình',
      'sổ gia phả',
    ],
    build: (title, { p, h2, ul }) =>
      [
        p(
          `${title}. "Website gia phả" là từ khóa gắn với nhu cầu có địa chỉ cố định trên mạng để họ hàng vào xem và cập nhật phả hệ.`,
        ),
        h2('Website gia phả khác gì fanpage / file Drive?'),
        p(
          'Fanpage tiện thông báo nhưng không phải kho phả hệ có cấu trúc. File Drive dễ thất lạc phiên bản. Website gia phả chuyên biệt lưu quan hệ huyết thống, tìm kiếm thành viên và phân quyền rõ ràng.',
        ),
        h2('Tiêu chí chọn website gia phả'),
        ul([
          'Cây gia đình zoom, kéo thả, tìm theo tên.',
          'Sổ gia phả / tiểu sử trên mobile.',
          'Ngày giỗ âm lịch và thông báo.',
          'Mời thành viên tham gia bằng link.',
          'Xuất PDF / ảnh in cho lễ và nhà thờ họ.',
          'HTTPS, sao lưu, phân quyền ADMIN/thành viên.',
        ]),
        h2(`Ví dụ ${SITE}`),
        p(
          `${BRAND} cung cấp website gia phả dạng ứng dụng web: đăng ký dòng họ một lần, dùng chung cho nhiều thiết bị. Tham khảo <a href="${PAGES.guide}">hướng dẫn</a> và <a href="${PAGES.register}">tạo dòng họ</a>.`,
        ),
        ctaBlock(),
      ].join('\n'),
  },

  'so-gia-pha-truyen-thong-va-so-gia-pha-dien-tu-so-sanh-chi-tiet': {
    meta: `Sổ gia phả truyền thống và sổ gia phả điện tử: so sánh, ưu nhược điểm và cách kết hợp cả hai. coinguon.io.vn`,
    excerpt: `Sổ gia phả là gì? Khác biệt sổ giấy và sổ điện tử, khi nào in sổ, khi nào dùng online.`,
    tags: [
      'sổ gia phả',
      'gia phả',
      'gia phả dòng họ',
      'gia phả điện tử',
      'gia phả online',
      'nhà thờ họ',
    ],
    build: (title, { p, h2, ul }) =>
      [
        p(
          `${title}. "Sổ gia phả" vẫn là hình ảnh quen thuộc trong nhà thờ họ — đồng thời ngày càng có thêm sổ gia phả điện tử trên website.`,
        ),
        h2('Sổ gia phả là gì?'),
        p(
          'Sổ gia phả là hình thức trình bày nội dung gia phả theo từng trang/mục: mở đầu nguồn gốc, phần phả hệ, tiểu sử, công đức. Có thể là sách đóng tay hoặc file số (PDF, web).',
        ),
        h2('Sổ truyền thống (giấy)'),
        ul([
          'Ưu: trang trọng trong nghi lễ, dễ đọc khi không có điện thoại.',
          'Nhược: khó sửa, dễ hỏng ẩm, khó sao chép cho mọi chi họ.',
        ]),
        h2('Sổ gia phả điện tử'),
        ul([
          'Ưu: sửa nhanh, tìm kiếm, chia sẻ, nhắc giỗ, xuất in lại bất cứ lúc nào.',
          'Nhược: cần thiết bị và quyền truy cập; cần chọn nền tảng uy tín.',
        ]),
        h2('Nên kết hợp thế nào?'),
        p(
          `Giữ sổ giấy (hoặc bản in năm) làm bản “trân trọng” tại nhà thờ họ; dùng sổ gia phả điện tử làm bản sống để cập nhật hàng ngày. ${BRAND} tại ${SITE} hỗ trợ xem sổ online và xuất bản in khi đến ngày giỗ tổ.`,
        ),
        ctaBlock(),
      ].join('\n'),
  },
};

export function buildKeywordContentBySlug(slug, title, helpers) {
  const article = KEYWORD_ARTICLE_MAP[slug];
  if (article) return article.build(title, helpers);
  return null;
}

export function getKeywordMetaBySlug(slug) {
  return KEYWORD_ARTICLE_MAP[slug]?.meta ?? null;
}

export function getKeywordExcerptBySlug(slug) {
  return KEYWORD_ARTICLE_MAP[slug]?.excerpt ?? null;
}

export function getKeywordTagsBySlug(slug) {
  return KEYWORD_ARTICLE_MAP[slug]?.tags ?? null;
}
