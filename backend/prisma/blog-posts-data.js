/** @typedef {'BASICS'|'HOWTO'|'CULTURE'|'FAMILY_TREE'|'ONLINE'|'SEO'} BlogCategory */

import {
  BLOG_ENTRIES_EXTRA,
  buildSeoContentHtml,
  buildSeoExcerpt,
  buildSeoMetaDescription,
  pickSeoTags,
} from './blog-posts-extra.js';

const CORE_KEYWORDS = [
  'gia phả',
  'gia phả dòng họ',
  'gia phả online',
  'gia phả điện tử',
  'cây gia đình',
  'sơ đồ gia đình',
  'tổ tiên',
  'dòng họ',
  'nhà thờ họ',
  'lịch sử dòng họ',
  'họ tộc Việt Nam',
];

const CATEGORY_TAGS = {
  BASICS: ['gia phả', 'gia phả dòng họ', 'tổ tiên', 'dòng họ', 'lịch sử dòng họ'],
  HOWTO: ['gia phả', 'cách lập gia phả', 'gia phả điện tử', 'sơ đồ gia đình', 'dòng họ'],
  CULTURE: ['dòng họ', 'nhà thờ họ', 'họ tộc Việt Nam', 'tổ tiên', 'gia phả dòng họ'],
  FAMILY_TREE: ['cây gia đình', 'sơ đồ gia đình', 'gia phả', 'tổ tiên', 'dòng họ'],
  ONLINE: ['gia phả online', 'gia phả điện tử', 'website gia phả', 'cây gia đình', 'dòng họ'],
  SEO: ['SEO', 'content marketing', 'viết bài chuẩn SEO', 'đưa website lên top', 'từ khóa Google'],
};

/** @type {{ title: string; category: BlogCategory }[]} */
const BLOG_ENTRIES_CORE = [
  { title: 'Gia phả là gì? Ý nghĩa của gia phả đối với mỗi dòng họ', category: 'BASICS' },
  { title: 'Nguồn gốc và lịch sử của gia phả tại Việt Nam', category: 'BASICS' },
  { title: 'Vì sao mỗi gia đình nên xây dựng gia phả?', category: 'BASICS' },
  { title: 'Gia phả dòng họ và cây gia đình khác nhau như thế nào?', category: 'BASICS' },
  { title: 'Những thông tin cần có trong một cuốn gia phả', category: 'BASICS' },
  { title: 'Gia phả điện tử là gì? Xu hướng lưu giữ gia phả thời đại số', category: 'BASICS' },
  { title: 'Vai trò của gia phả trong việc kết nối các thế hệ', category: 'BASICS' },
  { title: 'Tại sao con cháu cần tìm hiểu về nguồn cội tổ tiên?', category: 'BASICS' },
  { title: 'Gia phả có giá trị như thế nào đối với lịch sử dòng họ?', category: 'BASICS' },
  { title: 'Những sai lầm thường gặp khi lập gia phả', category: 'BASICS' },
  { title: 'Hướng dẫn cách lập gia phả dòng họ từ A đến Z', category: 'HOWTO' },
  { title: 'Các bước xây dựng gia phả cho gia đình mới bắt đầu', category: 'HOWTO' },
  { title: 'Cách thu thập thông tin để viết gia phả chính xác', category: 'HOWTO' },
  { title: 'Cách xác minh thông tin tổ tiên trong gia phả', category: 'HOWTO' },
  { title: 'Hướng dẫn phỏng vấn người cao tuổi để ghi chép gia phả', category: 'HOWTO' },
  { title: 'Cách lưu trữ gia phả an toàn qua nhiều thế hệ', category: 'HOWTO' },
  { title: 'Hướng dẫn số hóa gia phả giấy thành gia phả điện tử', category: 'HOWTO' },
  { title: 'Cách tạo cây gia đình trực tuyến đơn giản', category: 'HOWTO' },
  { title: 'Những lưu ý khi cập nhật thông tin thành viên trong gia phả', category: 'HOWTO' },
  { title: 'Làm thế nào để bảo tồn gia phả cho con cháu mai sau?', category: 'HOWTO' },
  { title: 'Ý nghĩa của việc thờ cúng tổ tiên trong văn hóa Việt Nam', category: 'CULTURE' },
  { title: 'Vai trò của trưởng họ trong việc gìn giữ truyền thống dòng tộc', category: 'CULTURE' },
  { title: 'Ngày giỗ tổ dòng họ có ý nghĩa gì?', category: 'CULTURE' },
  { title: 'Những phong tục truyền thống trong các dòng họ Việt Nam', category: 'CULTURE' },
  { title: 'Vì sao người Việt luôn coi trọng nguồn cội tổ tiên?', category: 'CULTURE' },
  { title: 'Văn hóa uống nước nhớ nguồn qua việc lập gia phả', category: 'CULTURE' },
  { title: 'Nhà thờ họ là gì? Vai trò của nhà thờ họ trong dòng tộc', category: 'CULTURE' },
  { title: 'Những nét đẹp trong truyền thống họ tộc Việt Nam', category: 'CULTURE' },
  { title: 'Cách tổ chức họp họ hiệu quả và ý nghĩa', category: 'CULTURE' },
  { title: 'Tầm quan trọng của việc giáo dục con cháu về lịch sử dòng họ', category: 'CULTURE' },
  { title: 'Cây gia đình là gì? Hướng dẫn xây dựng cây gia đình dễ hiểu', category: 'FAMILY_TREE' },
  { title: 'Lợi ích của việc tạo cây gia đình trực tuyến', category: 'FAMILY_TREE' },
  { title: 'Cách vẽ sơ đồ cây gia đình chuẩn và khoa học', category: 'FAMILY_TREE' },
  { title: 'Các ký hiệu thường dùng trong cây gia đình', category: 'FAMILY_TREE' },
  { title: 'Cách quản lý thông tin nhiều thế hệ trong cây gia đình', category: 'FAMILY_TREE' },
  { title: 'Những lỗi thường gặp khi xây dựng cây gia đình', category: 'FAMILY_TREE' },
  { title: 'Cây gia đình giúp con cháu hiểu về tổ tiên như thế nào?', category: 'FAMILY_TREE' },
  { title: 'So sánh cây gia đình truyền thống và cây gia đình online', category: 'FAMILY_TREE' },
  { title: 'Hướng dẫn tạo cây gia đình cho đại gia đình nhiều thế hệ', category: 'FAMILY_TREE' },
  { title: 'Những công cụ hỗ trợ xây dựng cây gia đình hiện nay', category: 'FAMILY_TREE' },
  { title: 'Lợi ích của việc sử dụng website gia phả trực tuyến', category: 'ONLINE' },
  { title: 'Vì sao gia phả online đang trở thành xu hướng?', category: 'ONLINE' },
  { title: 'Cách quản lý gia phả dòng họ bằng công nghệ số', category: 'ONLINE' },
  { title: 'Những tính năng cần có của một website gia phả hiện đại', category: 'ONLINE' },
  { title: 'Gia phả điện tử giúp kết nối họ hàng ở xa như thế nào?', category: 'ONLINE' },
  { title: 'So sánh gia phả giấy và gia phả online', category: 'ONLINE' },
  { title: 'Cách chia sẻ gia phả cho con cháu trên toàn thế giới', category: 'ONLINE' },
  { title: 'Bảo mật thông tin gia phả trên môi trường Internet', category: 'ONLINE' },
  { title: 'Tương lai của gia phả trong thời đại chuyển đổi số', category: 'ONLINE' },
  { title: 'Hướng dẫn tạo gia phả trực tuyến miễn phí cho dòng họ', category: 'ONLINE' },
];

export const BLOG_ENTRIES = [...BLOG_ENTRIES_CORE, ...BLOG_ENTRIES_EXTRA];

export function slugify(title) {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function pickTags(category) {
  const base = CATEGORY_TAGS[category] ?? ['gia phả', 'dòng họ'];
  const extra = CORE_KEYWORDS.filter((k) => !base.includes(k)).slice(0, 3);
  return [...new Set([...base, ...extra])].slice(0, 8);
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function p(text) {
  return `<p>${escapeHtml(text)}</p>`;
}

function h2(text) {
  return `<h2>${escapeHtml(text)}</h2>`;
}

function ul(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

const CATEGORY_INTROS = {
  BASICS:
    'Trong văn hóa họ tộc Việt Nam, gia phả dòng họ không chỉ là danh sách tên tuổi mà còn là cầu nối giữa quá khứ và hiện tại.',
  HOWTO:
    'Việc lập gia phả đòi hỏi phương pháp rõ ràng, từ thu thập dữ liệu đến lưu trữ lâu dài. Bài viết này hướng dẫn từng bước thực tế.',
  CULTURE:
    'Văn hóa dòng họ Việt Nam gắn chặt với đạo hiếu, thờ cúng tổ tiên và tinh thần uống nước nhớ nguồn — nền tảng để hiểu vì sao gia phả luôn được coi trọng.',
  FAMILY_TREE:
    'Cây gia đình và sơ đồ gia đình giúp hình dung quan hệ huyết thống trực quan, đặc biệt hữu ích khi dòng họ có nhiều nhánh và thế hệ.',
  ONLINE:
    'Gia phả online và gia phả điện tử đang thay đổi cách các dòng họ lưu giữ, cập nhật và chia sẻ lịch sử tổ tiên với con cháu ở khắp nơi.',
  SEO:
    'SEO và content marketing giúp website gia phả tiếp cận đúng người đang tìm kiếm trên Google — bài viết chất lượng là nền tảng lên top bền vững.',
};

const SECTION_TEMPLATES = {
  BASICS: [
    ['Khái niệm và bối cảnh', (title) => [
      `${title} là chủ đề nhiều gia đình quan tâm khi bắt đầu tìm hiểu nguồn cội. Gia phả dòng họ ghi lại dòng dõi, thế hệ, công đức tổ tiên và mối liên hệ giữa các thành viên trong họ tộc Việt Nam.`,
      `Khác với sổ hộ khẩu hay giấy khai sinh, một cuốn gia phả tập trung vào lịch sử dòng họ, phả hệ và truyền thống được truyền miệng qua nhiều đời.`,
    ]],
    ['Ý nghĩa thực tiễn', () => [
      'Gia phả giúp con cháu biết mình thuộc nhánh nào, đời thứ mấy, từ đó nuôi dưỡng lòng tự hào và trách nhiệm với tổ tiên.',
      'Khi kết hợp với cây gia đình trực quan, thông tin dễ tra cứu hơn cho cả người già lẫn thanh niên trong gia đình.',
    ]],
    ['Gợi ý bắt đầu', () => [
      'Bạn có thể bắt đầu từ những ghi chép sẵn có: sổ gia phả giấy, bản đồ phả hệ, hoặc ký ức của người cao tuổi trong dòng họ.',
      'Nhiều dòng họ hiện chuyển sang gia phả điện tử để dễ sao lưu, cập nhật và chia sẻ cho họ hàng ở xa.',
    ]],
  ],
  HOWTO: [
    ['Chuẩn bị trước khi bắt tay', (title) => [
      `Để triển khai "${title}" hiệu quả, hãy xác định phạm vi: chỉ một chi họ hay toàn bộ dòng tộc, bao nhiêu thế hệ cần ghi nhận.`,
      'Lập danh sách nguồn tin cậy: trưởng họ, thư ký dòng họ, sổ gia phả cũ, bia mộ tại nhà thờ họ và các tài liệu lưu trữ địa phương.',
    ]],
    ['Quy trình từng bước', () => [
      'Bước 1 — Thu thập: phỏng vấn người cao tuổi, chụp ảnh tài liệu, ghi chép ngày sinh, ngày mất, nơi an táng.',
      'Bước 2 — Đối chiếu: so khớp thông tin giữa nhiều nguồn để tránh nhầm lẫn tên đệm, nhánh và thế hệ.',
      'Bước 3 — Chuẩn hóa: thống nhất cách ghi tên, đánh số thế hệ, vẽ sơ đồ gia đình hoặc nhập vào phần mềm gia phả online.',
      'Bước 4 — Lưu trữ: sao lưu nhiều bản (giấy, file PDF, hệ thống điện tử) và giao nhiệm vụ cập nhật cho một người phụ trách.',
    ]],
    ['Mẹo chất lượng cao', () => [
      'Ghi rõ nguồn tham khảo cho từng thông tin quan trọng — đặc biệt với tổ tiên xa đời.',
      'Ưu tiên độ chính xác hơn số lượng: một gia phả ngắn mà đúng vẫn có giá trị hơn bản dài nhưng sai lệch.',
    ]],
  ],
  CULTURE: [
    ['Bối cảnh văn hóa Việt Nam', (title) => [
      `${title} phản ánh giá trị lâu đời của người Việt: hiếu nghĩa, đoàn kết dòng họ và tôn trọng tổ tiên.`,
      'Nhà thờ họ, ngày giỗ tổ và các nghi lễ họp họ là những dịp để con cháu ôn lại lịch sử dòng họ và củng cố tinh thần tương thân tương ái.',
    ]],
    ['Giá trị đối với thế hệ trẻ', () => [
      'Khi con cháu hiểu nguồn cội, họ dễ hình thành ý thức trách nhiệm với gia đình và cộng đồng dòng tộc.',
      'Gia phả và cây gia đình là công cụ giáo dục trực quan, giúp kể câu chuyện tổ tiên bằng ngôn ngữ dễ tiếp cận.',
    ]],
    ['Gìn giữ và phát huy', () => [
      'Trưởng họ và ban quản lý dòng họ nên kết hợp nghi lễ truyền thống với công nghệ — ví dụ chia sẻ gia phả online sau mỗi kỳ họp họ.',
      'Khuyến khích các thế hệ trẻ tham gia biên tập, không chỉ đóng vai trò người xem thụ động.',
    ]],
  ],
  FAMILY_TREE: [
    ['Cây gia đình là gì?', (title) => [
      `${title} — bài viết tập trung vào sơ đồ gia đình: mô hình trực quan thể hiện quan hệ cha mẹ, con cái, vợ chồng qua các thế hệ.`,
      'So với gia phả dạng văn bản, cây gia đình giúp nhìn nhanh cấu trúc nhánh và mối liên kết huyết thống trong dòng họ.',
    ]],
    ['Nguyên tắc xây dựng chuẩn', () => [
      'Thống nhất quy ước ký hiệu: hình vuông/tròn cho giới tính, đường nối cho quan hệ, đánh số thế hệ từ tổ tiên xuống.',
      'Sắp xếp trên trang hoặc màn hình theo thứ tự thời gian: tổ tiên ở trên, đời sau ở dưới; anh em cùng thế hệ nằm ngang hàng.',
      'Với đại gia đình nhiều nhánh, nên tách sơ đồ gia đình theo từng chi để dễ đọc, sau đó liên kết về một gốc chung.',
    ]],
    ['Công cụ hỗ trợ hiện đại', () => [
      'Website gia phả trực tuyến cho phép zoom, tìm kiếm thành viên và cập nhật thông tin mà không cần vẽ lại toàn bộ sơ đồ thủ công.',
      'Gia phả điện tử phù hợp khi họ hàng phân tán nhiều tỉnh thành hoặc sinh sống ở nước ngoài.',
    ]],
  ],
  ONLINE: [
    ['Xu hướng gia phả số', (title) => [
      `${title} — chủ đề nổi bật khi nhiều dòng họ chuyển từ sổ giấy sang nền tảng số để quản lý lịch sử tổ tiên.`,
      'Gia phả online giúp cập nhật theo thời gian thực, chia sẻ liên kết cho con cháu và giảm rủi ro mất dữ liệu do thiên tai hay hư hỏng tài liệu.',
    ]],
    ['Tính năng nên có', () => [
      'Cây gia phả tương tác, sổ gia phả điện tử, quản lý sự kiện dòng họ, nhắc ngày giỗ và phân quyền cho trưởng họ hoặc thư ký.',
      'Khả năng xuất bản in (PDF, ảnh) để phục vụ nghi lễ truyền thống song song với bản số.',
      'Liên kết truy cập an toàn cho người trong họ được xem mà không cần đăng ký phức tạp.',
    ]],
    ['Bảo mật và chia sẻ', () => [
      'Thông tin gia phả có thể nhạy cảm; nên chọn nền tảng có đăng nhập, phân quyền và sao lưu định kỳ.',
      'Chia sẻ gia phả cho con cháu ở xa qua link hoặc tài khoản riêng, kèm hướng dẫn sử dụng cho người lớn tuổi.',
    ]],
  ],
  SEO: [
    ['Chiến lược nội dung', (title) => [
      `${title} — trong bối cảnh website gia phả và dịch vụ dòng họ, content marketing là cách tiếp cận khách hàng có chủ đích: họ đang tìm "cách lập gia phả", "phần mềm gia phả" hay "cây gia đình online".`,
      'Mỗi bài viết giải quyết một vấn đề cụ thể, gắn từ khóa tự nhiên và dẫn người đọc tới trang đăng ký hoặc thử nghiệm sản phẩm.',
    ]],
    ['Thực hành SEO on-page', () => [
      'Tối ưu title, meta description, URL slug, heading H1–H3, alt ảnh (nếu có), và liên kết nội bộ.',
      'Dùng schema Article (JSON-LD) để Google hiển thị rich result; đảm bảo sitemap.xml cập nhật sau mỗi bài mới.',
      'Tránh duplicate content: mỗi bài một chủ đề, một từ khóa chính; không copy nguyên văn từ nguồn khác.',
    ]],
    ['Đo lường và tối ưu', () => [
      'Theo dõi Google Search Console: impression, click, CTR, vị trí trung bình theo từ khóa.',
      'Cập nhật bài cũ khi thông tin lỗi thời; thêm FAQ và ví dụ thực tế để tăng thời gian đọc.',
      'Kết hợp chia sẻ Zalo, Facebook nhóm họ tộc — traffic xã hội không thay thế SEO nhưng hỗ trợ lan tỏa.',
    ]],
  ],
};

function buildMetaDescription(title, category, slug) {
  if (category === 'SEO') return buildSeoMetaDescription(slug, title);
  const suffix =
    ' Tìm hiểu gia phả dòng họ trên coinguon.io.vn — cây gia đình, sổ gia phả điện tử, nhắc ngày giỗ âm lịch.';
  const base = title.endsWith('?') ? title.slice(0, -1) : title;
  const text = `${base}.${suffix}`;
  return text.length <= 320 ? text : text.slice(0, 317) + '...';
}

function buildExcerpt(title, category, slug) {
  if (category === 'SEO') return buildSeoExcerpt(slug, title);
  const intro = CATEGORY_INTROS[category];
  return `${title}. ${intro} Khám phá kiến thức về tổ tiên, dòng họ và cách ứng dụng gia phả điện tử hiệu quả.`;
}

function buildContentHtml(title, category, slug) {
  if (category === 'SEO') {
    return buildSeoContentHtml(slug, title, { p, h2, ul, escapeHtml });
  }
  const sections = SECTION_TEMPLATES[category] ?? SECTION_TEMPLATES.BASICS;
  const parts = [
    p(`${title}. ${CATEGORY_INTROS[category]} Bài viết tổng hợp kiến thức thực tiễn về gia phả dòng họ, cây gia đình và lịch sử dòng họ cho người Việt.`),
  ];

  for (const [heading, bodyFn] of sections) {
    parts.push(h2(heading));
    for (const paragraph of bodyFn(title)) {
      parts.push(p(paragraph));
    }
  }

  parts.push(h2('Câu hỏi thường gặp'));
  parts.push(
    '<h3>Gia phả khác gì cây gia đình?</h3>',
    p(
      'Gia phả thường là tài liệu ghi chép đầy đủ (tiểu sử, công đức, ngày giỗ), còn cây gia đình hoặc sơ đồ gia đình tập trung vào quan hệ huyết thống trực quan. Hai hình thức bổ sung cho nhau trong quản lý dòng họ.',
    ),
    '<h3>Có nên dùng gia phả online không?</h3>',
    p(
      'Gia phả online phù hợp khi cần cập nhật thường xuyên, nhiều người cùng tham gia biên tập và con cháu ở xa muốn tra cứu mọi lúc. Bạn vẫn nên giữ bản sao lưu và xuất file định kỳ.',
    ),
  );

  parts.push(h2('Kết luận'));
  parts.push(
    p(
      `${title} là bước quan trọng để gìn giữ nguồn cội tổ tiên và kết nối các thế hệ trong họ tộc Việt Nam. Hãy bắt đầu từ những thông tin chắc chắn, sau đó mở rộng dần sang gia phả điện tử hoặc website gia phả trực tuyến.`,
    ),
  );

  parts.push(
    '<p class="blog-cta">Dùng thử <strong><a href="https://www.coinguon.io.vn/">Gia phả điện tử</a></strong> tại coinguon.io.vn — <a href="/tao-dong-ho">đăng ký dòng họ</a>, <a href="/huong-dan">hướng dẫn</a> hoặc <a href="/bai-viet">đọc thêm bài viết</a>.</p>',
  );

  return parts.join('\n');
}

/** @param {{ title: string; category: BlogCategory }} entry */
export function buildBlogPost(entry, index) {
  const slug = slugify(entry.title);
  const tags =
    entry.category === 'SEO' ? pickSeoTags() : pickTags(entry.category);
  const publishedAt = new Date(Date.UTC(2025, 0, 1 + index));

  return {
    slug,
    title: entry.title,
    excerpt: buildExcerpt(entry.title, entry.category, slug),
    metaDescription: buildMetaDescription(entry.title, entry.category, slug),
    content: buildContentHtml(entry.title, entry.category, slug),
    category: entry.category,
    tags,
    published: true,
    publishedAt,
  };
}

export function buildAllBlogPosts() {
  return BLOG_ENTRIES.map((entry, index) => buildBlogPost(entry, index));
}
