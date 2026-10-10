/**
 * Viết lại bài blog (10/2026) — nội dung riêng từng bài, ảnh chụp màn hình thật
 * (dòng họ mẫu hư cấu "Họ Nguyễn Đình", không phải dữ liệu người dùng). Ưu tiên ảnh desktop.
 */

const SITE = 'https://www.coinguon.io.vn';

const IMAGES = {
  tree: { src: '/images/blog/cay-gia-pha-nhieu-doi.webp', w: 1040, h: 1080 },
  filter: { src: '/images/blog/loc-cay-gia-pha-theo-chi-doi-desktop.webp', w: 1280, h: 800 },
  settings: { src: '/images/blog/cai-dat-hien-thi-cay-gia-pha.webp', w: 1200, h: 750 },
  cover: { src: '/images/blog/bia-so-gia-pha-desktop.webp', w: 840, h: 1100, narrow: true },
  preface: { src: '/images/blog/loi-tua-so-gia-pha-desktop.webp', w: 840, h: 1100, narrow: true },
  person: { src: '/images/blog/ho-so-thanh-vien-so-gia-pha-desktop.webp', w: 840, h: 1100, narrow: true },
  bio: { src: '/images/blog/tieu-su-mo-phan-desktop.webp', w: 840, h: 1100, narrow: true },
  layout: { src: '/images/blog/tuy-chinh-trinh-bay-so-desktop.webp', w: 800, h: 1050, narrow: true },
  pages: { src: '/images/blog/quan-ly-trang-hien-thi-trong-so.webp', w: 1120, h: 1180, narrow: true },
  upcoming: { src: '/images/blog/ngay-gio-sap-toi-desktop.webp', w: 1280, h: 800 },
  calendar: { src: '/images/blog/lich-su-kien-dong-ho-desktop.webp', w: 1280, h: 800 },
  exportTree: { src: '/images/blog/xuat-pha-do-cau-doi-cuon-thu.webp', w: 1280, h: 800 },
  contribution: { src: '/images/blog/dong-gop-quy-ho-theo-gia-dinh.webp', w: 1280, h: 800 },
  merit: { src: '/images/blog/danh-sach-cong-duc-dong-ho.webp', w: 1344, h: 942 },
  duty: { src: '/images/blog/phan-cong-bien-ho-theo-nam.webp', w: 1240, h: 1100 },
  orgUsers: { src: '/images/blog/quan-ly-nguoi-dung-dong-ho.webp', w: 1280, h: 800 },
  account: { src: '/images/blog/tai-khoan-lien-ket-thanh-vien.webp', w: 1280, h: 800 },
  permissions: { src: '/images/blog/phan-quyen-xem-sua-gia-pha.webp', w: 1280, h: 713 },
};

/** Ảnh + chú thích (dạng TipTap đọc được: img rồi p>em). */
export function img(key, alt, caption) {
  const image = IMAGES[key];
  const cls = image.narrow ? ' class="blog-narrow"' : '';
  return `<img src="${image.src}" alt="${alt}" width="${image.w}" height="${image.h}" loading="lazy"${cls}><p><em>${caption}</em></p>`;
}

export function link(slug, text) {
  return `<a href="/bai-viet/${slug}">${text}</a>`;
}

/** Liên kết tới trang văn khấn công khai /van-khan/[slug]. */
export function vk(slug, text) {
  return `<a href="/van-khan/${slug}">${text}</a>`;
}

export const DEMO_NOTE =
  '<p><em>Ảnh minh họa dùng dòng họ mẫu "Họ Nguyễn Đình" với tên và ngày tháng hư cấu.</em></p>';

export function cta(text) {
  return `<p class="blog-cta">${text} <a href="${SITE}/tao-dong-ho">Tạo dòng họ trên Cội Nguồn</a> · <a href="/huong-dan">Xem hướng dẫn</a></p>`;
}

export const REWRITES_A = [
  {
    slug: 'gia-pha-3-doi-5-doi-la-gi-cach-ghi-dung-the-he',
    category: 'BASICS',
    title: 'Gia phả 3 đời, 5 đời là gì? Cách tính đời và ghi thế hệ cho đúng',
    metaDescription:
      'Gia phả 3 đời, 5 đời gồm những ai? Bảng tên gọi cao – tằng – tổ – khảo, cháu – chắt – chút – chít, cách tính đời thứ mấy và mẹo vẽ sơ đồ gia phả 5 đời.',
    excerpt:
      'Giải thích "đời" trong gia phả, gia phả 3 đời và 5 đời gồm những ai, bảng tên gọi từng đời và cách đánh số đời thống nhất cho cả dòng họ.',
    tags: ['gia phả 5 đời', 'sơ đồ gia phả 5 đời', 'cách tính đời trong gia phả', 'thế hệ', 'cao tằng tổ khảo', 'gia phả 3 đời'],
    content: [
      '<p>Khi bắt đầu lập gia phả, câu hỏi đầu tiên hầu như ai cũng gặp là: <strong>"đời" tính từ đâu, gia phả 3 đời hay 5 đời gồm những ai?</strong> Ghi sai số đời ở một nhánh thì cả cây phía dưới lệch theo, nên cần thống nhất ngay từ đầu. Bài này giải thích ngắn gọn, kèm bảng tên gọi để bạn tra nhanh.</p>',
      '<h2>"Đời" (thế hệ) trong gia phả là gì?</h2>',
      '<p>Một <strong>đời</strong> là một lớp người cùng vai vế trong dòng họ: anh chị em ruột và anh chị em họ cùng vai thuộc cùng một đời. Cha mẹ ở đời trên, con cái ở đời dưới. Vợ/chồng được ghi cùng đời với người trong họ mà họ kết hôn.</p>',
      '<p>Gia phả thường lấy <strong>thủy tổ</strong> (người đầu tiên được ghi nhận, thường là người lập nghiệp ở làng) làm mốc, rồi đếm xuống. Có hai cách đếm phổ biến:</p>',
      '<ul><li><strong>Thủy tổ là đời 1</strong> — cách thường thấy trong gia phả giấy: "đời thứ nhất", "đời thứ hai"…</li><li><strong>Thủy tổ là đời 0</strong> — một số phần mềm và gia phả số dùng để "đời 1" là con của thủy tổ.</li></ul>',
      '<p>Không có cách nào "đúng" tuyệt đối. Điều quan trọng là <strong>cả dòng họ dùng chung một cách</strong> và ghi rõ ở phần đầu sổ (ví dụ: "Gia phả này tính cụ Nguyễn Đình Phúc là đời thứ nhất").</p>',
      '<h2>Gia phả 3 đời gồm những ai?</h2>',
      '<p>Gia phả (hay sơ đồ) 3 đời là phạm vi nhỏ nhất, thường dùng cho một gia đình: <strong>ông bà – cha mẹ – con cháu</strong> tính từ một người. Đây là điểm khởi đầu tốt khi bạn chưa có tư liệu cũ: hỏi ông bà, cha mẹ là đủ để ghi lại 3 đời một cách chính xác.</p>',
      '<h2>Gia phả 5 đời gồm những ai?</h2>',
      '<p>Tính từ bản thân ngược lên, 5 đời gồm: <strong>bản thân – cha mẹ – ông bà – cụ – kỵ</strong>. Trong sách xưa gọi theo chữ Hán là <em>Kỷ (bản thân) – Khảo – Tổ – Tằng tổ – Cao tổ</em>. Phạm vi 5 đời có ý nghĩa đặc biệt vì gắn với việc thờ cúng: nhiều nơi có tục "ngũ đại mai thần chủ" — thờ riêng đến đời thứ năm, sau đó bài vị được đưa vào thờ chung ở nhà thờ họ.</p>',
      '<table><thead><tr><th>Đời (so với bản thân)</th><th>Cách gọi thường ngày</th><th>Tên chữ Hán trong gia phả</th></tr></thead><tbody>',
      '<tr><td>+4</td><td>Kỵ (cụ kỵ)</td><td>Cao tổ</td></tr>',
      '<tr><td>+3</td><td>Cụ</td><td>Tằng tổ</td></tr>',
      '<tr><td>+2</td><td>Ông bà</td><td>Tổ (tổ khảo, tổ tỷ)</td></tr>',
      '<tr><td>+1</td><td>Cha mẹ</td><td>Khảo – Tỷ (khi đã mất)</td></tr>',
      '<tr><td>0</td><td>Bản thân</td><td>Kỷ</td></tr>',
      '<tr><td>−1</td><td>Con</td><td>Tử</td></tr>',
      '<tr><td>−2</td><td>Cháu</td><td>Tôn</td></tr>',
      '<tr><td>−3</td><td>Chắt</td><td>Tằng tôn</td></tr>',
      '<tr><td>−4</td><td>Chút (miền Nam hay gọi chít)</td><td>Huyền tôn</td></tr>',
      '</tbody></table>',
      '<p>Bốn đời trên, bốn đời dưới cộng với bản thân thành <strong>chín đời</strong> — đó là nghĩa gốc của chữ "cửu tộc" hay gặp trong văn hóa cũ.</p>',
      '<h2>Cách ghi thế hệ cho đúng: 5 nguyên tắc</h2>',
      '<ol><li><strong>Chốt mốc đời 1</strong> và ghi ra văn bản cho cả họ biết.</li><li><strong>Ghi theo quan hệ cha – con, không theo tuổi.</strong> Một người sinh sau vẫn có thể ở đời trên (chú nhỏ tuổi hơn cháu là chuyện thường).</li><li><strong>Vợ/chồng ghi cùng đời</strong> với người trong họ; con cùng đời với anh chị em ruột.</li><li><strong>Con nuôi</strong> ghi đúng đời của cha mẹ nuôi cộng một, kèm ghi chú "con nuôi" nếu gia đình muốn.</li><li><strong>Không tự "nén" đời</strong> khi thiếu tư liệu. Nếu không rõ có thiếu một đời ở giữa hay không, hãy ghi chú "chưa xác minh" thay vì đoán.</li></ol>',
      '<h2>Cách vẽ sơ đồ gia phả 5 đời</h2>',
      '<p>Sơ đồ 5 đời vẽ từ trên xuống: hàng trên cùng là đời cao nhất (cụ kỵ), mỗi hàng dưới là một đời. Vợ chồng đặt cạnh nhau, nối bằng một vạch ngang; từ vạch đó kẻ đường dọc xuống các con, anh trước em sau. Với 5 đời, một dòng họ trung bình đã có vài chục người — vẽ tay khá chật, nên nhiều gia đình chuyển sang công cụ số để cây tự sắp xếp.</p>',
      img('tree', 'Sơ đồ gia phả 5 đời dạng cây, mỗi hàng là một đời', 'Cây gia phả 5 đời của dòng họ mẫu: hàng trên cùng là thủy tổ, mỗi hàng dưới là một đời; vợ chồng nối bằng vạch ngang.'),
      '<p>Trên Cội Nguồn, bạn chỉ cần nhập quan hệ cha – mẹ – con và vợ – chồng; số đời và vị trí trên cây được tính tự động. Khi họ đông người, có thể chọn <strong>"Hiển thị đến đời"</strong> để xem riêng 3 đời, 5 đời… cho dễ đọc hoặc để in.</p>',
      img('filter', 'Bộ lọc hiển thị cây gia phả theo nhánh và theo đời', 'Chọn nhánh và số đời muốn hiển thị — tiện khi chỉ cần in sơ đồ 5 đời.'),
      DEMO_NOTE,
      '<h2>Câu hỏi thường gặp</h2>',
      '<h3>Tôi là đời thứ mấy trong họ?</h3>',
      '<p>Lấy số đời của cha bạn cộng thêm một. Nếu chưa biết đời của cha, hãy lần ngược đến một người đã có trong gia phả (thường là ông hoặc cụ), rồi đếm xuống.</p>',
      '<h3>Con gái có được tính đời không?</h3>',
      '<p>Có. Con gái cùng đời với anh em trai của mình. Cách ghi con gái và con của con gái trong gia phả xem thêm ở bài ' + link('phu-nu-trong-gia-pha-dong-ho-cach-ghi-nhan-dung-truyen-thong', 'ghi nhận phụ nữ trong gia phả') + '.</p>',
      '<h3>"Đời" và "chi" khác nhau thế nào?</h3>',
      '<p>Đời là lớp ngang (vai vế), chi là nhánh dọc (dòng con cháu của một người). Xem giải thích chi tiết trong bài ' + link('the-he-chi-nhanh-trong-gia-pha-dong-ho-giai-thich-de-hieu', 'đời, chi, nhánh, phái trong dòng họ') + '.</p>',
      cta('Muốn có sơ đồ 5 đời mà không phải vẽ tay?'),
    ].join(''),
  },

  {
    slug: 'the-he-chi-nhanh-trong-gia-pha-dong-ho-giai-thich-de-hieu',
    category: 'BASICS',
    title: 'Đời, chi, nhánh, phái trong dòng họ là gì? Giải thích dễ hiểu',
    metaDescription:
      'Phân biệt họ, tộc, chi, phái, nhánh, ngành và đời trong gia phả. Trưởng họ, trưởng chi là ai, cách đặt tên và đánh số chi khi lập gia phả dòng họ.',
    excerpt:
      'Họ, tộc, chi, phái, nhánh, đời khác nhau thế nào? Giải thích bằng ví dụ cụ thể, kèm cách đặt tên chi và vai trò trưởng họ, trưởng chi.',
    tags: ['chi phái trong dòng họ', 'chi trong dòng họ là gì', 'dòng tộc là gì', 'trưởng họ', 'chi nhánh gia phả', 'thế hệ'],
    content: [
      '<p>Đọc gia phả cũ hoặc nghe các cụ bàn chuyện họ, bạn sẽ gặp liên tục các chữ <strong>họ, tộc, chi, phái, nhánh, ngành, đời</strong>. Chúng không phải từ đồng nghĩa — mỗi chữ chỉ một tầng khác nhau. Hiểu đúng giúp bạn ghi gia phả không bị rối và biết mình thuộc đâu trong họ.</p>',
      '<h2>Hình dung bằng một cái cây</h2>',
      '<ul><li><strong>Họ / tộc (dòng họ, dòng tộc)</strong>: cả cái cây — toàn bộ con cháu của một thủy tổ, thường cùng sống hoặc có gốc ở một làng. "Họ Nguyễn Đình ở thôn Đông" là một dòng họ; không phải mọi người họ Nguyễn đều cùng dòng họ.</li><li><strong>Chi</strong>: các cành lớn mọc từ gốc. Thường mỗi người con trai của thủy tổ (hoặc của một đời đầu) lập thành một chi.</li><li><strong>Phái / nhánh / ngành</strong>: cành nhỏ hơn trong một chi, khi chi đã đông người. Mỗi địa phương dùng chữ khác nhau; có nơi gọi phái lớn hơn chi.</li><li><strong>Đời</strong>: lớp ngang cắt qua mọi chi — những người cùng vai vế.</li></ul>',
      '<p>Vì cách gọi thay đổi theo vùng, khi lập gia phả hãy ghi rõ ở phần đầu sổ: dòng họ mình dùng những tầng nào và theo thứ tự nào (ví dụ: <em>Họ → Chi → Nhánh → Gia đình</em>).</p>',
      '<h2>Ví dụ cụ thể</h2>',
      '<p>Dòng họ mẫu "Họ Nguyễn Đình": cụ thủy tổ Nguyễn Đình Phúc có hai con trai. Người con trưởng, cụ Lộc, lập <strong>chi 1</strong>; người con thứ, cụ Thọ, lập <strong>chi 2</strong>. Con gái của thủy tổ, bà An, vẫn thuộc đời 2 nhưng thường được ghi cùng phần gia đình chung của thủy tổ. Đến đời 3, chi 1 có hai anh em Khang và Minh — nếu con cháu hai cụ đông lên, chi 1 có thể tách thành hai nhánh.</p>',
      img('tree', 'Cây gia phả thể hiện chi 1 và chi 2 tách từ thủy tổ', 'Hai cành lớn bên trái và bên phải là hai chi của dòng họ mẫu; mỗi hàng ngang là một đời.'),
      '<h2>Trưởng họ, trưởng chi, đích tôn</h2>',
      '<ul><li><strong>Trưởng họ (tộc trưởng)</strong>: theo truyền thống là con trưởng của dòng trưởng nối tiếp từ thủy tổ — người chủ trì việc thờ cúng chung và giữ nhà thờ họ. Ngày nay nhiều họ bầu thêm <strong>hội đồng gia tộc</strong> hoặc ban liên lạc để lo việc chung.</li><li><strong>Trưởng chi</strong>: người đứng đầu một chi, tính theo dòng trưởng của chi đó.</li><li><strong>Đích tôn</strong>: con trai trưởng của con trai trưởng — người nối dòng trưởng.</li></ul>',
      '<h2>Đặt tên và đánh số chi thế nào?</h2>',
      '<p>Ba cách thường gặp:</p>',
      '<ol><li><strong>Theo số</strong>: chi 1, chi 2, chi 3 — rõ ràng, dễ dùng trên máy tính.</li><li><strong>Theo can</strong>: chi Giáp, chi Ất, chi Bính… — hay gặp trong gia phả cũ.</li><li><strong>Theo vai</strong>: Đại tôn (dòng trưởng), Trung tôn, Tiểu tôn — hoặc chi trưởng, chi thứ.</li></ol>',
      '<p>Dù chọn cách nào, mỗi người trong gia phả nên có đủ hai thông tin: <strong>thuộc chi/nhánh nào</strong> và <strong>đời thứ mấy</strong>. Chỉ cần hai thông tin này là có thể xếp đúng vị trí trên cây, kể cả khi trùng tên.</p>',
      img('filter', 'Lọc cây gia phả theo nhánh Đại Tôn, Trung Tôn, Tiểu Tôn', 'Lọc cây theo nhánh (Đại Tôn, Trung Tôn, Tiểu Tôn) và theo đời — mỗi chi xem riêng phần của mình.'),
      DEMO_NOTE,
      '<h2>Nhầm lẫn hay gặp</h2>',
      '<ul><li><strong>Coi "cùng họ" là "cùng dòng họ".</strong> Hai gia đình cùng mang họ Trần nhưng khác thủy tổ là hai dòng họ khác nhau.</li><li><strong>Gộp chi theo nơi ở.</strong> Chi xác định theo huyết thống, không theo việc gia đình chuyển vào Nam hay ra nước ngoài.</li><li><strong>Đánh số đời riêng cho từng chi.</strong> Đời phải đếm chung từ thủy tổ để các chi so được vai vế với nhau.</li></ul>',
      '<h2>Câu hỏi thường gặp</h2>',
      '<h3>Chi trong dòng họ là gì?</h3>',
      '<p>Chi là một nhánh lớn của dòng họ, gồm toàn bộ con cháu của một người (thường là con trai của thủy tổ hoặc của một đời đầu). Mỗi chi có trưởng chi riêng và thường có ngày giỗ chi riêng ngoài giỗ tổ chung.</p>',
      '<h3>Dòng tộc là gì, có khác dòng họ không?</h3>',
      '<p>Trong cách dùng hiện nay, dòng tộc và dòng họ gần như đồng nghĩa: đều chỉ con cháu của cùng một thủy tổ. Xem thêm bài ' + link('gia-pha-dong-toc-la-gi-vai-tro-cua-gia-pha-dong-toc-ngay-nay', 'gia phả dòng tộc là gì') + '.</p>',
      '<h3>Một chi có thể tách thành dòng họ mới không?</h3>',
      '<p>Có. Khi một chi di cư lập nghiệp ở nơi xa qua nhiều đời, chi đó thường lập nhà thờ và gia phả riêng, coi người đến đầu tiên là thủy tổ của địa phương mới — nhưng vẫn nên ghi rõ gốc tích để con cháu tìm về.</p>',
      cta('Ghi chi, nhánh, đời cho từng người một lần — cây gia phả tự xếp đúng vị trí.'),
    ].join(''),
  },

  {
    slug: 'mau-so-do-pha-he-word-va-excel-cho-dong-ho',
    category: 'HOWTO',
    title: 'Mẫu sơ đồ phả hệ Excel miễn phí (tải về) và cách làm gia phả bằng Excel, Word',
    metaDescription:
      'Tải mẫu gia phả Excel miễn phí: bảng thành viên có mã cha, mẹ, vợ/chồng, đời, chi, ngày giỗ âm lịch. Hướng dẫn vẽ sơ đồ phả hệ bằng Word và hạn chế cần biết.',
    excerpt:
      'File Excel mẫu tải về ngay, cách đặt cột để không nhầm khi trùng tên, cách vẽ sơ đồ phả hệ bằng Word SmartArt, và khi nào nên chuyển sang gia phả điện tử.',
    tags: ['mẫu gia phả bằng excel', 'phần mềm gia phả excel', 'sơ đồ phả hệ', 'mẫu sơ đồ gia phả', 'gia phả word', 'mẫu gia phả miễn phí'],
    content: [
      '<p>Excel và Word là công cụ đầu tiên nhiều gia đình nghĩ tới khi muốn ghi gia phả: có sẵn trên máy, quen tay, gửi qua Zalo được. Bài này cho bạn <strong>một file Excel mẫu tải về miễn phí</strong>, giải thích cách đặt cột cho đúng và chỉ ra những chỗ Excel/Word sẽ làm khó bạn khi dòng họ đông lên.</p>',
      '<p class="blog-cta"><strong>Tải mẫu:</strong> <a href="/files/mau-so-do-pha-he-excel-coinguon.xlsx" download>mau-so-do-pha-he-excel-coinguon.xlsx</a> (Excel, 9 KB, gồm sheet nhập liệu và sheet hướng dẫn).</p>',
      '<h2>Cấu trúc file Excel mẫu</h2>',
      '<p>Mỗi dòng là <strong>một người</strong>. Điểm mấu chốt: quan hệ được ghi bằng <strong>mã</strong>, không bằng tên — vì trong một họ trùng tên là chuyện rất thường (ba ông "Nguyễn Văn Hùng" ở ba chi khác nhau).</p>',
      '<table><thead><tr><th>Cột</th><th>Ghi gì</th><th>Ví dụ</th></tr></thead><tbody>',
      '<tr><td>Mã</td><td>Mã riêng, không trùng</td><td>C1</td></tr>',
      '<tr><td>Họ và tên</td><td>Tên đầy đủ (tên húy nếu có)</td><td>Nguyễn Đình Lộc</td></tr>',
      '<tr><td>Giới tính</td><td>Chọn Nam / Nữ</td><td>Nam</td></tr>',
      '<tr><td>Đời thứ</td><td>Đếm thống nhất từ thủy tổ</td><td>2</td></tr>',
      '<tr><td>Chi / Nhánh</td><td>Chi của người đó</td><td>Chi 1</td></tr>',
      '<tr><td>Mã cha, Mã mẹ</td><td>Mã của cha, mẹ</td><td>T0, V0</td></tr>',
      '<tr><td>Mã vợ/chồng</td><td>Mã của người phối ngẫu</td><td>V1</td></tr>',
      '<tr><td>Năm sinh, năm mất</td><td>Để trống nếu chưa rõ</td><td>1868 – 1932</td></tr>',
      '<tr><td>Ngày mất (âm lịch)</td><td>Ngày/tháng âm — để tính giỗ</td><td>20/7</td></tr>',
      '<tr><td>Nơi an táng, Ghi chú</td><td>Mộ phần, nguồn thông tin</td><td>Nghĩa trang họ</td></tr>',
      '</tbody></table>',
      '<p>File mẫu đã có sẵn vài dòng ví dụ (dữ liệu minh họa), danh sách chọn Nam/Nữ và cố định hàng tiêu đề. Bạn xóa dòng ví dụ rồi nhập dòng họ của mình.</p>',
      '<h2>Mẹo nhập liệu để không phải làm lại</h2>',
      '<ul><li><strong>Đặt mã theo đời và chi</strong>, ví dụ <code>2.1.03</code> = đời 2, chi 1, người thứ 3 — nhìn mã là biết vị trí.</li><li><strong>Ngày giỗ luôn ghi âm lịch</strong>. Ngày dương lịch của ngày giỗ thay đổi mỗi năm.</li><li><strong>Không gộp ô (merge)</strong>. Ô gộp làm hỏng việc lọc, sắp xếp và chuyển sang phần mềm khác.</li><li><strong>Ghi nguồn</strong> ở cột Ghi chú: "theo lời ông Bảo kể 2026", "bia mộ", "sổ chữ Hán chi 1".</li><li><strong>Lưu nhiều bản</strong>: một bản trên Google Drive/OneDrive, một bản USB. Đặt tên có ngày: <code>gia-pha-2026-10-10.xlsx</code>.</li></ul>',
      '<h2>Vẽ sơ đồ phả hệ bằng Word</h2>',
      '<p>Word có sẵn công cụ <strong>SmartArt → Hierarchy (Phân cấp)</strong>:</p>',
      '<ol><li>Vào <em>Insert → SmartArt → Hierarchy</em>, chọn kiểu "Organization Chart" hoặc "Hierarchy".</li><li>Mỗi ô là một người; dùng <em>Add Shape Below</em> để thêm con, <em>Add Shape After</em> để thêm anh/chị/em.</li><li>Đặt khổ giấy A3 hoặc A2 nằm ngang (<em>Layout → Size, Orientation</em>) nếu cây rộng.</li><li>Xuất PDF để in hoặc gửi cho họ hàng.</li></ol>',
      '<p>SmartArt phù hợp cho sơ đồ <strong>3–4 đời, dưới khoảng 40 người</strong>. Với cây lớn hơn, chữ sẽ nhỏ dần, khó thể hiện vợ chồng cạnh nhau và mỗi lần thêm người lại phải căn chỉnh tay.</p>',
      '<h2>Hạn chế của Excel/Word khi họ đông người</h2>',
      '<ul><li><strong>Không tự vẽ cây</strong>: Excel chỉ là bảng; muốn có cây phải vẽ lại bằng tay ở công cụ khác.</li><li><strong>Nhiều phiên bản lệch nhau</strong>: mỗi chi giữ một file, sửa xong gửi qua lại — sau vài tháng không ai biết bản nào mới nhất.</li><li><strong>Không nhắc ngày giỗ</strong>: phải tự đổi âm lịch sang dương lịch mỗi năm.</li><li><strong>Khó cho người lớn tuổi xem trên điện thoại</strong>: file Excel trên màn hình nhỏ rất khó đọc.</li></ul>',
      '<h2>Khi nào nên chuyển sang gia phả điện tử?</h2>',
      '<p>Nếu dòng họ đã quá 50 người, có từ 2 người trở lên cùng cập nhật, hoặc bạn muốn in cây khổ lớn treo nhà thờ — đó là lúc nên chuyển. Với Cội Nguồn, bạn nhập từng người với quan hệ cha – mẹ – con như trong file mẫu; cây gia phả và sổ gia phả tự sinh ra và cập nhật ngay khi có người sửa.</p>',
      img('tree', 'Cây gia phả tự vẽ từ dữ liệu thành viên', 'Cùng dữ liệu như bảng Excel mẫu, cây gia phả được vẽ tự động — không cần căn chỉnh tay.'),
      img('person', 'Trang hồ sơ thành viên trong sổ gia phả điện tử', 'Mỗi dòng trong bảng trở thành một trang hồ sơ trong sổ gia phả: đời, nhánh, ngày sinh, ngày mất, vợ/chồng, con.'),
      DEMO_NOTE,
      '<h2>Câu hỏi thường gặp</h2>',
      '<h3>Có phần mềm gia phả Excel miễn phí không?</h3>',
      '<p>File mẫu ở đầu bài là miễn phí và dùng được với Excel, Google Sheets hay WPS. Excel không phải phần mềm gia phả chuyên dụng nên không tự vẽ cây; xem thêm bài ' + link('phan-mem-gia-pha-nen-chon-phan-mem-gia-pha-nao-cho-dong-ho', 'nên chọn phần mềm gia phả nào') + '.</p>',
      '<h3>Mở file trên điện thoại được không?</h3>',
      '<p>Được, bằng ứng dụng Excel hoặc Google Sheets — nhưng nhập liệu trên máy tính sẽ nhanh hơn nhiều.</p>',
      '<h3>Tôi đã có file Excel riêng, có dùng lại được không?</h3>',
      '<p>Được. Chỉ cần đảm bảo mỗi người một dòng và quan hệ ghi bằng mã. Nếu muốn chuyển sang Cội Nguồn, hãy <a href="/lien-he">liên hệ</a> để được hỗ trợ.</p>',
      cta('Đã có bảng Excel? Chuyển thành cây gia phả và sổ gia phả in được.'),
    ].join(''),
  },

  {
    slug: 'cach-tra-cuu-pha-he-va-nguon-goc-ho-toc-tren-mang',
    category: 'HOWTO',
    title: 'Cách tra cứu phả hệ và nguồn gốc dòng họ: nguồn tư liệu và các bước',
    metaDescription:
      'Muốn tìm nguồn gốc dòng họ? Các nguồn tư liệu nên tìm: gia phả chữ Hán Nôm, bia mộ, sắc phong, nhà thờ họ, hội đồng họ, lưu trữ số hóa — kèm các bước tra cứu cụ thể.',
    excerpt:
      'Hướng dẫn từng bước tìm nguồn gốc dòng họ: bắt đầu từ người còn sống, tìm gia phả cũ, bia mộ, sắc phong, nhà thờ họ và các kho lưu trữ, cách ghi lại để không thất lạc.',
    tags: ['tra cứu phả hệ', 'nguồn gốc dòng họ', 'tìm gia phả', 'phả hệ', 'gia phả Hán Nôm', 'tìm họ hàng'],
    content: [
      '<p>"Họ mình gốc ở đâu, cụ tổ là ai?" — nhiều người bắt đầu tìm hiểu khi về quê dự giỗ, hoặc khi cha ông đã già và muốn ghi lại trước khi muộn. Internet giúp được một phần, nhưng phần lớn thông tin về một dòng họ Việt Nam <strong>vẫn nằm ở làng, ở nhà thờ họ và trong trí nhớ người già</strong>. Đây là trình tự tra cứu mà nhiều người làm gia phả áp dụng.</p>',
      '<h2>Bước 1: Bắt đầu từ những gì chắc chắn</h2>',
      '<p>Ghi lại ngay những gì bạn biết chắc: tên, năm sinh, quê quán của cha mẹ, ông bà. Sau đó hỏi những người lớn tuổi nhất còn minh mẫn trong họ. Hỏi cụ thể, ví dụ:</p>',
      '<ul><li>Ông/bà của cụ tên gì, mộ ở đâu, giỗ ngày nào (âm lịch)?</li><li>Họ mình có nhà thờ họ không, ai đang giữ?</li><li>Nhà có còn sổ sách chữ Hán, câu đối, bằng sắc cũ không?</li><li>Họ mình có tên đệm riêng theo đời không?</li></ul>',
      '<p>Cách đặt câu hỏi và ghi chép chi tiết có trong bài ' + link('cach-thu-thap-thong-tin-de-viet-gia-pha-chinh-xac', 'thu thập và xác minh thông tin khi viết gia phả') + '.</p>',
      '<h2>Bước 2: Tìm gia phả cũ của dòng họ</h2>',
      '<p>Nhiều dòng họ đã có gia phả viết bằng chữ Hán hoặc chữ Nôm từ thế kỷ 18–19, thường do trưởng họ hoặc trưởng chi cất giữ. Nếu họ bạn từng có gia phả mà nay thất lạc, có thể tìm ở:</p>',
      '<ul><li><strong>Các chi khác trong họ</strong>: gia phả thường được chép làm nhiều bản cho từng chi.</li><li><strong>Viện Nghiên cứu Hán Nôm</strong> (Hà Nội) — nơi lưu giữ một kho lớn gia phả các dòng họ được sưu tầm qua nhiều thập kỷ; có thể liên hệ để hỏi về thư mục gia phả theo họ và địa phương.</li><li><strong>Thư viện, bảo tàng tỉnh</strong> và các cơ quan văn hóa địa phương.</li><li><strong>Hội đồng họ / ban liên lạc họ</strong> cấp tỉnh hoặc toàn quốc: nhiều họ lớn có tổ chức này và đã sưu tầm gia phả các chi.</li></ul>',
      '<p>Gia phả chữ Hán cần người đọc được để dịch. Khi nhờ dịch, hãy chụp ảnh toàn bộ từng trang trước, giữ bản gốc ở nơi khô ráo.</p>',
      '<h2>Bước 3: Đọc những gì còn trên mặt đất</h2>',
      '<ul><li><strong>Bia mộ</strong>: thường ghi tên húy, năm sinh, ngày mất, đôi khi cả quê gốc và tên con cháu lập bia.</li><li><strong>Nhà thờ họ</strong>: bài vị, hoành phi, câu đối, bia công đức ghi tên người đóng góp qua các đời.</li><li><strong>Sắc phong, văn tế, địa bạ</strong> ở đình làng: cho biết dòng họ có người đỗ đạt, làm quan hay khai khẩn đất từ thời nào.</li></ul>',
      '<p>Chụp ảnh rõ từng bia, từng bài vị, ghi vị trí — những tư liệu này dễ mất khi cải táng hoặc tu sửa.</p>',
      '<h2>Bước 4: Tra cứu trực tuyến — làm được gì?</h2>',
      '<ul><li><strong>Tìm người cùng họ, cùng quê</strong> trên các nhóm Facebook dòng họ, trang của hội đồng họ; nhiều người đã đăng gia phả hoặc đang tìm kết nối.</li><li><strong>Kho lưu trữ số hóa quốc tế</strong>: một số tổ chức phả hệ quốc tế đã chụp và số hóa gia phả Việt Nam từ các thư viện; có thể tìm theo họ và địa danh.</li><li><strong>Trang gia phả của chính dòng họ</strong>: nếu họ bạn đã lập gia phả online, bạn chỉ cần xin đường liên kết để xem.</li></ul>',
      '<p>Lưu ý: thông tin trên mạng nên coi là <strong>manh mối</strong>, cần đối chiếu với bia mộ, gia phả gốc hoặc lời kể của người trong họ trước khi ghi vào gia phả chính thức.</p>',
      '<h2>Bước 5: Ghi lại ở một nơi cả họ cùng xem</h2>',
      '<p>Cái mất nhiều nhất không phải tư liệu cũ, mà là công sức tra cứu nằm rải rác trong sổ tay, điện thoại của từng người. Hãy gom về một nơi: file chung, hoặc một gia phả điện tử mà người trong họ có thể tìm tên và xem ngay.</p>',
      img('person', 'Trang hồ sơ một thành viên trong gia phả điện tử', 'Mỗi người có một trang hồ sơ: đời, nhánh, ngày sinh, ngày mất, quan hệ — con cháu tra cứu được bất cứ lúc nào.'),
      img('bio', 'Tiểu sử và thông tin mộ phần trong gia phả điện tử', 'Tiểu sử, nghĩa trang, địa chỉ mộ và ghi chú cải táng được lưu cùng hồ sơ — không còn nằm rải rác.'),
      DEMO_NOTE,
      '<h2>Câu hỏi thường gặp</h2>',
      '<h3>Chỉ biết tên ông nội, có tìm được nguồn gốc không?</h3>',
      '<p>Có thể, nếu biết thêm quê quán. Về làng hỏi người cùng họ, tìm nhà thờ họ và nghĩa trang họ là cách hiệu quả nhất; cùng tên đệm theo đời cũng là manh mối mạnh (xem ' + link('quy-tac-dat-ten-the-he-trong-cac-dong-ho-viet-nam', 'đặt tên theo thế hệ') + ').</p>',
      '<h3>Hai họ cùng tên có chung nguồn gốc không?</h3>',
      '<p>Không nhất thiết. Cùng họ Nguyễn hay Trần chưa chắc cùng thủy tổ; cần có gia phả hoặc bằng chứng cụ thể nối hai bên.</p>',
      '<h3>Có nên trả tiền cho dịch vụ "tra nguồn gốc dòng họ" trên mạng?</h3>',
      '<p>Hãy thận trọng. Không có cơ sở dữ liệu nào chứa đầy đủ gia phả các họ Việt Nam; dịch vụ đáng tin thường là dịch thuật Hán Nôm hoặc hỗ trợ khảo sát thực địa có báo cáo rõ ràng.</p>',
      cta('Gom mọi tư liệu tìm được vào một gia phả chung cho cả họ.'),
    ].join(''),
  },

  {
    slug: 'cach-ve-so-do-cay-gia-dinh-chuan-va-khoa-hoc',
    category: 'FAMILY_TREE',
    title: 'Cách vẽ sơ đồ cây gia đình, sơ đồ gia phả dòng họ đúng chuẩn (kèm ký hiệu)',
    metaDescription:
      'Hướng dẫn vẽ sơ đồ cây gia đình và sơ đồ gia phả dòng họ: bố cục theo đời, ký hiệu nam nữ, vợ chồng, người đã mất, thứ tự anh em, vẽ tay hay dùng công cụ.',
    excerpt:
      'Từng bước vẽ sơ đồ gia phả: chọn phạm vi, bố cục theo đời, ký hiệu thường dùng, thứ tự anh chị em, cách xử lý cây lớn và in khổ lớn.',
    tags: ['cách vẽ sơ đồ gia phả', 'vẽ sơ đồ gia đình', 'cách vẽ cây gia đình', 'sơ đồ phả hệ', 'ký hiệu cây gia đình', 'sơ đồ gia phả dòng họ'],
    content: [
      '<p>Sơ đồ cây gia đình (phả đồ) là cách nhanh nhất để người xem hiểu "ai là con ai, ai cùng vai với ai". Một sơ đồ tốt đọc được trong vài giây; một sơ đồ rối thì có thông tin đúng cũng khó dùng. Dưới đây là cách vẽ theo lối phổ biến của gia phả Việt Nam, kèm các ký hiệu thường dùng.</p>',
      '<h2>Bước 1: Chọn phạm vi và người gốc</h2>',
      '<ul><li><strong>Cây gia đình</strong> (3–4 đời): lấy ông bà hoặc cụ làm gốc — hợp để treo trong nhà, làm quà cho cha mẹ.</li><li><strong>Sơ đồ gia phả dòng họ</strong>: lấy thủy tổ làm gốc, vẽ toàn bộ hoặc từng chi.</li></ul>',
      '<p>Họ đông người thì nên vẽ <strong>một sơ đồ tổng</strong> (chỉ đến 3–5 đời đầu, mỗi chi một ô) và <strong>sơ đồ riêng từng chi</strong>.</p>',
      '<h2>Bước 2: Bố cục theo hàng đời</h2>',
      '<ol><li>Người gốc ở trên cùng, chính giữa.</li><li><strong>Mỗi hàng ngang là một đời</strong>; người cùng đời luôn nằm cùng hàng, kể cả khác chi. Đây là quy tắc quan trọng nhất — nhìn hàng là biết vai vế.</li><li>Vợ chồng đặt cạnh nhau, nối bằng một vạch ngang ngắn.</li><li>Từ giữa vạch vợ chồng kẻ một đường dọc xuống, rồi tỏa ngang tới các con.</li><li>Anh chị em xếp theo thứ tự sinh, <strong>thống nhất một chiều</strong> cho cả sơ đồ (thường từ trái sang phải: trưởng bên trái).</li></ol>',
      img('tree', 'Sơ đồ gia phả bố cục theo hàng đời, vợ chồng nối vạch ngang', 'Bố cục chuẩn: mỗi hàng một đời, vợ chồng nối vạch ngang, đường dọc xuống các con xếp theo thứ tự.'),
      '<h2>Bước 3: Ký hiệu thường dùng</h2>',
      '<table><thead><tr><th>Ký hiệu</th><th>Ý nghĩa</th></tr></thead><tbody>',
      '<tr><td>Ô vuông / ô chữ nhật</td><td>Nam (theo quy ước phả hệ quốc tế)</td></tr>',
      '<tr><td>Ô tròn / ô bo góc</td><td>Nữ</td></tr>',
      '<tr><td>Vạch ngang nối hai ô</td><td>Vợ chồng</td></tr>',
      '<tr><td>Vạch ngang có hai gạch chéo</td><td>Đã ly hôn</td></tr>',
      '<tr><td>Đường dọc từ vạch vợ chồng</td><td>Con của cặp vợ chồng đó</td></tr>',
      '<tr><td>Đường nét đứt</td><td>Con nuôi hoặc quan hệ chưa xác minh</td></tr>',
      '<tr><td>Dấu † hoặc ghi năm mất</td><td>Người đã mất</td></tr>',
      '<tr><td>Màu nền khác nhau</td><td>Phân biệt chi/nhánh</td></tr>',
      '</tbody></table>',
      '<p>Gia phả Việt Nam ít khi dùng đủ các ký hiệu phả hệ phương Tây; phổ biến hơn là ghi thẳng năm sinh – năm mất dưới tên. Dù chọn cách nào, hãy <strong>in chú giải ký hiệu</strong> ở góc sơ đồ.</p>',
      '<h2>Bước 4: Ghi gì trong mỗi ô?</h2>',
      '<p>Tối thiểu: <strong>họ tên</strong> và <strong>năm sinh – năm mất</strong> (hoặc ngày giỗ âm lịch). Muốn đầy đủ hơn thì để ở sổ gia phả, đừng nhồi vào sơ đồ — ô càng nhiều chữ, cây càng khó đọc.</p>',
      '<h2>Bước 5: Vẽ tay hay dùng công cụ?</h2>',
      '<ul><li><strong>Vẽ tay / thuê vẽ</strong>: đẹp, trang trọng, hợp treo nhà thờ; nhưng mỗi lần thêm người là phải vẽ lại.</li><li><strong>Word, PowerPoint, Excel</strong>: ổn cho dưới khoảng 40 người (xem ' + link('mau-so-do-pha-he-word-va-excel-cho-dong-ho', 'mẫu sơ đồ phả hệ Excel/Word') + ').</li><li><strong>Phần mềm gia phả</strong>: nhập quan hệ, cây tự xếp hàng đời và tự cập nhật; chỉnh khoảng cách, màu đường nối, ẩn/hiện vợ chồng rồi in khổ lớn.</li></ul>',
      img('settings', 'Cài đặt khoảng cách node, khoảng cách đời và màu đường nối trên cây gia phả', 'Tùy chỉnh khoảng cách giữa các ô, giữa các đời, màu đường nối và bật/tắt hiển thị vợ chồng.'),
      DEMO_NOTE,
      '<h2>Lỗi thường gặp khi vẽ sơ đồ gia phả</h2>',
      '<ul><li><strong>Người cùng đời nằm khác hàng</strong> — người xem hiểu sai vai vế.</li><li><strong>Đường nối chéo qua nhau</strong> vì xếp các chi lộn xộn; hãy để con cháu mỗi chi nằm gọn dưới chi đó.</li><li><strong>Chữ quá nhỏ khi in</strong>: với cây trên 100 người, cần khổ A1/A0 hoặc chia theo chi.</li><li><strong>Thiếu ngày cập nhật</strong>: luôn ghi "cập nhật tháng … năm …" ở góc sơ đồ.</li></ul>',
      '<h2>Câu hỏi thường gặp</h2>',
      '<h3>Con trưởng đặt bên trái hay bên phải?</h3>',
      '<p>Mỗi họ có thể theo lệ riêng; quan trọng là thống nhất cho toàn bộ sơ đồ và ghi rõ trong chú giải. Sơ đồ hiện đại thường đặt trưởng bên trái.</p>',
      '<h3>Có nên vẽ cả con gái và cháu ngoại?</h3>',
      '<p>Nên vẽ con gái; cháu ngoại tùy quy ước của họ. Xem ' + link('phu-nu-trong-gia-pha-dong-ho-cach-ghi-nhan-dung-truyen-thong', 'cách ghi phụ nữ trong gia phả') + '.</p>',
      cta('Nhập quan hệ một lần, sơ đồ tự vẽ đúng hàng đời và in được khổ lớn.'),
    ].join(''),
  },
];
