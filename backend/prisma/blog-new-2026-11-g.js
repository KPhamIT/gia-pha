/**
 * Bài mới (11/2026) — cụm "cách tính đời": GSC 17/10–14/11 cho thấy truy vấn
 * "cách tính đời trong gia phả", "5 đời gọi là gì", "sơ đồ gia phả 5 đời",
 * "tên gọi các đời trong gia phả" đang có lượt hiển thị. Bài trụ cột là
 * the-he-chi-nhanh-… (cách tính đời); hai bài dưới đây nhắm ý định tìm kiếm khác
 * (mẫu để in, tên gọi 9 đời) để không tranh từ khóa với bài trụ cột.
 */
import { DEMO_NOTE, cta, img, link } from './blog-rewrite-2026-10-a.js';

const PDF = '/files/so-do-gia-pha-5-doi-coinguon.pdf';
const PNG = '/files/so-do-gia-pha-5-doi-coinguon.png';

export const NEW_POSTS_G = [
  {
    slug: 'so-do-gia-pha-5-doi-mau-trong-tai-ve',
    category: 'HOWTO',
    title: 'Sơ đồ gia phả 5 đời: mẫu trống tải về (PDF) và cách điền',
    metaDescription:
      'Tải miễn phí mẫu sơ đồ gia phả 5 đời để trống (PDF, A4 ngang): bản thân, cha mẹ, 4 ông bà, 8 cụ, 16 kỵ. Hướng dẫn điền, hỏi ai để có thông tin và cách mở rộng thành gia phả dòng họ.',
    excerpt:
      'Mẫu sơ đồ 5 đời in được trên A4, có ô họ tên, năm sinh – mất, ngày giỗ âm lịch cho 31 người. Kèm cách điền và câu hỏi nên hỏi ông bà.',
    tags: ['sơ đồ gia phả 5 đời', 'mẫu sơ đồ gia phả', 'mẫu gia phả trống', 'sơ đồ gia phả 5 đời trống', 'gia phả 5 đời'],
    content: [
      '<p>Bạn muốn ghi lại tổ tiên của mình đến đời cụ, đời kỵ nhưng không biết bắt đầu từ đâu? Cách đơn giản nhất là <strong>in một tờ sơ đồ 5 đời để trống</strong> rồi điền dần khi hỏi ông bà, cha mẹ. Dưới đây là mẫu miễn phí, in vừa một trang A4 ngang.</p>',
      `<p class="blog-cta"><strong>Tải mẫu:</strong> <a href="${PDF}" download>so-do-gia-pha-5-doi-coinguon.pdf</a> (PDF, A4 ngang) · <a href="${PNG}" download>bản ảnh PNG</a></p>`,
      img('blank5', 'Mẫu sơ đồ gia phả 5 đời để trống: bản thân, cha mẹ, ông bà, cụ, kỵ', 'Mẫu sơ đồ gia phả 5 đời: đọc từ trái sang phải — bản thân → cha mẹ → ông bà → cụ → kỵ.'),
      '<h2>Mẫu sơ đồ 5 đời gồm những gì?</h2>',
      '<p>Mẫu này là dạng <strong>sơ đồ tổ tiên trực hệ</strong>: mỗi người có đúng hai ô cha – mẹ ở cột bên phải, nên số ô nhân đôi qua từng đời.</p>',
      '<table><thead><tr><th>Cột</th><th>Đời (so với bạn)</th><th>Số người</th><th>Tên chữ Hán</th></tr></thead><tbody>',
      '<tr><td>Bản thân</td><td>0</td><td>1</td><td>Kỷ</td></tr>',
      '<tr><td>Cha mẹ</td><td>+1</td><td>2</td><td>Khảo – Tỷ</td></tr>',
      '<tr><td>Ông bà (nội, ngoại)</td><td>+2</td><td>4</td><td>Tổ</td></tr>',
      '<tr><td>Cụ</td><td>+3</td><td>8</td><td>Tằng tổ</td></tr>',
      '<tr><td>Kỵ</td><td>+4</td><td>16</td><td>Cao tổ</td></tr>',
      '</tbody></table>',
      '<p>Tổng cộng <strong>31 người</strong>. Mỗi ô có chỗ ghi họ tên, năm sinh – mất và <strong>ngày giỗ âm lịch</strong> — thông tin quan trọng nhất để con cháu sau này còn biết mà cúng giỗ. Ô ở ba đời gần có thêm dòng ghi nơi đặt mộ phần.</p>',
      '<h2>Cách điền sơ đồ 5 đời</h2>',
      '<ol>',
      '<li><strong>Điền từ trái sang phải.</strong> Bắt đầu từ bản thân, rồi cha mẹ, ông bà — phần bạn chắc chắn nhất.</li>',
      '<li><strong>Nửa trên là bên nội, nửa dưới là bên ngoại.</strong> Ô phía trên của mỗi cặp là ông (cha), ô phía dưới là bà (mẹ).</li>',
      '<li><strong>Ghi bằng bút chì trước.</strong> Thông tin đời cụ, đời kỵ thường phải hỏi nhiều người mới chắc.</li>',
      '<li><strong>Không biết thì để trống</strong>, ghi chú "chưa rõ" bên cạnh. Một ô trống còn hơn một cái tên đoán sai.</li>',
      '<li><strong>Ghi nguồn</strong> ở mặt sau: ai kể, kể ngày nào, xem bia mộ ở đâu.</li>',
      '</ol>',
      '<h2>Hỏi ai, hỏi gì để điền đủ?</h2>',
      '<ul><li><strong>Ông bà còn sống</strong>: tên cha mẹ, ông bà của các cụ; quê gốc; ngày giỗ.</li><li><strong>Bia mộ, bát hương, bài vị</strong>: thường ghi tên húy, năm mất, đôi khi cả đời thứ mấy.</li><li><strong>Gia phả cũ của chi, của họ</strong>: hỏi trưởng chi hoặc người giữ nhà thờ họ.</li></ul>',
      '<p>Bộ câu hỏi đầy đủ để phỏng vấn người lớn tuổi có trong bài ' + link('cach-thu-thap-thong-tin-de-viet-gia-pha-chinh-xac', 'cách thu thập thông tin khi viết gia phả') + '.</p>',
      '<h2>Sơ đồ tổ tiên khác gia phả dòng họ thế nào?</h2>',
      '<p>Sơ đồ 5 đời ở trên đi <strong>ngược lên</strong> từ một người, gồm cả bên nội và bên ngoại. Gia phả dòng họ thì đi <strong>xuôi xuống</strong> từ thủy tổ, ghi tất cả con cháu theo từng chi, từng đời. Khi đã điền xong tờ 5 đời, bạn có trong tay đủ thông tin để bắt đầu gia phả dòng họ bên nội — số đời tính theo hướng dẫn ở bài ' + link('the-he-chi-nhanh-trong-gia-pha-dong-ho-giai-thich-de-hieu', 'cách tính đời trong gia phả') + '.</p>',
      img('tree', 'Cây gia phả dòng họ nhiều đời vẽ từ thủy tổ xuống', 'Gia phả dòng họ vẽ xuôi từ thủy tổ xuống — mỗi hàng là một đời, gồm đủ các chi.'),
      DEMO_NOTE,
      '<h2>Khi nào nên chuyển sang gia phả điện tử?</h2>',
      '<p>Tờ giấy 5 đời rất hợp để bắt đầu. Nhưng khi muốn ghi thêm anh chị em, cô dì chú bác, các chi khác, bạn sẽ cần vài chục đến vài trăm ô — lúc đó vẽ tay rất chật. Trên Cội Nguồn, bạn chỉ nhập từng người và quan hệ cha mẹ – con, cây gia phả tự vẽ, tự tính đời, và nhắc ngày giỗ âm lịch cho cả họ. Muốn làm bằng Excel trước thì có ' + link('mau-so-do-pha-he-word-va-excel-cho-dong-ho', 'mẫu gia phả Excel miễn phí') + '.</p>',
      '<h2>Câu hỏi thường gặp</h2>',
      '<h3>5 đời gọi là gì?</h3>',
      '<p>Tính từ bản thân ngược lên: bản thân – cha mẹ – ông bà – cụ – kỵ (Kỷ – Khảo – Tổ – Tằng tổ – Cao tổ). Xem thêm bài ' + link('gia-pha-3-doi-5-doi-la-gi-cach-ghi-dung-the-he', 'gia phả 3 đời, 5 đời là gì') + '.</p>',
      '<h3>In mẫu khổ nào?</h3>',
      '<p>Mẫu thiết kế cho A4 ngang. Nếu chữ viết tay to, in A3 ngang (phóng 141%) sẽ thoải mái hơn ở cột đời kỵ.</p>',
      '<h3>Có cần ghi cả vợ/chồng của mình không?</h3>',
      '<p>Sơ đồ tổ tiên chỉ ghi người trực hệ. Vợ/chồng và con cháu nên ghi ở gia phả gia đình hoặc dòng họ.</p>',
      cta('Điền xong 5 đời? Nhập lên Cội Nguồn để cả nhà cùng xem và bổ sung.'),
    ].join(''),
  },

  {
    slug: 'ten-goi-cac-doi-trong-gia-pha-cuu-toc-9-doi',
    category: 'CULTURE',
    title: 'Tên gọi các đời trong gia phả: 9 đời từ cao tổ đến huyền tôn (cửu tộc)',
    metaDescription:
      'Tên gọi các đời trong gia phả Việt Nam: cao tổ, tằng tổ, tổ, khảo, kỷ, tử, tôn, tằng tôn, huyền tôn. Cửu tộc là gì, ngũ đại mai thần chủ, khác biệt chút – chít giữa các miền.',
    excerpt:
      'Bảng 9 đời trong gia phả theo tên thường gọi và tên chữ Hán, nghĩa của cửu tộc, tục thờ 5 đời và cách gọi các đời xa hơn.',
    tags: ['tên gọi các đời trong gia phả', 'cửu tộc là gì', '9 đời', 'cao tổ tằng tổ', 'huyền tôn', 'chút chít'],
    content: [
      '<p>Trong gia phả, văn khấn và bài vị, tổ tiên không được gọi là "ông", "cụ" như ngày thường mà bằng các chữ Hán như <strong>cao tổ, tằng tổ, hiển khảo</strong>. Bài này tổng hợp <strong>tên gọi các đời trong gia phả</strong> — 4 đời trên, 4 đời dưới và bản thân, gọi chung là cửu tộc — để bạn đọc hiểu gia phả cũ và ghi đúng.</p>',
      '<h2>Bảng tên gọi 9 đời</h2>',
      '<table><thead><tr><th>So với bản thân</th><th>Gọi thường ngày</th><th>Chữ Hán</th><th>Ghi chú</th></tr></thead><tbody>',
      '<tr><td>+4</td><td>Kỵ (cụ kỵ)</td><td>Cao tổ</td><td>Đời xa nhất trong tục thờ 5 đời</td></tr>',
      '<tr><td>+3</td><td>Cụ</td><td>Tằng tổ</td><td>"Tằng" nghĩa là thêm một lớp</td></tr>',
      '<tr><td>+2</td><td>Ông bà</td><td>Tổ (tổ khảo – tổ tỷ)</td><td>Văn khấn: "hiển tổ khảo", "hiển tổ tỷ"</td></tr>',
      '<tr><td>+1</td><td>Cha mẹ</td><td>Khảo – Tỷ</td><td>Dùng khi đã mất; khi còn sống gọi phụ – mẫu</td></tr>',
      '<tr><td>0</td><td>Bản thân</td><td>Kỷ</td><td>Mốc để tính lên, tính xuống</td></tr>',
      '<tr><td>−1</td><td>Con</td><td>Tử</td><td>Con gái: nữ</td></tr>',
      '<tr><td>−2</td><td>Cháu</td><td>Tôn</td><td>Cháu đích tôn: con trưởng của con trưởng</td></tr>',
      '<tr><td>−3</td><td>Chắt</td><td>Tằng tôn</td><td></td></tr>',
      '<tr><td>−4</td><td>Chút (Nam bộ hay gọi chít)</td><td>Huyền tôn</td><td>"Huyền" là xa, mờ</td></tr>',
      '</tbody></table>',
      '<p>Cách nhớ: phía trên dùng chữ <strong>tổ</strong> (cao – tằng – tổ), phía dưới dùng chữ <strong>tôn</strong> (tôn – tằng tôn – huyền tôn). "Tằng" luôn chỉ lớp thứ ba tính từ mình.</p>',
      '<h2>Cửu tộc là gì?</h2>',
      '<p>Theo nghĩa gốc, <strong>cửu tộc</strong> là chín đời liền nhau trong bảng trên: bốn đời trên, bản thân và bốn đời dưới. Đây là phạm vi họ hàng gần mà sách xưa coi là có trách nhiệm tang chế, thờ cúng với nhau. Một số sách giải thích cửu tộc theo nghĩa khác (gồm cả họ mẹ, họ vợ), nhưng trong gia phả Việt Nam, nghĩa chín đời là phổ biến nhất.</p>',
      '<h2>Ngũ đại mai thần chủ — vì sao thờ 5 đời?</h2>',
      '<p>Nhiều gia đình theo tục <strong>"ngũ đại mai thần chủ"</strong>: thờ riêng tổ tiên đến đời cao tổ (5 đời tính cả bản thân người chủ tế). Khi thêm một đời mới, bài vị của đời xa nhất được đem chôn (mai) hoặc rước lên nhà thờ họ để thờ chung. Vì vậy ở nhà riêng thường chỉ thấy bài vị đến đời cụ, đời kỵ; các đời xa hơn do nhà thờ họ và gia phả dòng họ lưu giữ. Phạm vi 5 đời này giải thích chi tiết ở bài ' + link('gia-pha-3-doi-5-doi-la-gi-cach-ghi-dung-the-he', 'gia phả 3 đời, 5 đời là gì') + '.</p>',
      '<h2>Các đời xa hơn gọi thế nào?</h2>',
      '<ul><li><strong>Đời trên cao tổ</strong>: thường gọi chung là <strong>tiên tổ</strong>, hoặc ghi theo số đời: "tổ đời thứ 3", "tổ đời thứ 4".</li><li><strong>Người đầu tiên của dòng họ</strong>: <strong>thủy tổ</strong> (hoặc thượng tổ, tị tổ). Người lập ra một chi: <strong>chi tổ</strong>.</li><li><strong>Đời dưới huyền tôn</strong>: gọi chung là <strong>viễn tôn</strong> (cháu xa) hoặc ghi "cháu đời thứ …".</li></ul>',
      '<p>Trong gia phả dòng họ, cách rõ ràng nhất vẫn là <strong>ghi số đời tính từ thủy tổ</strong> cho từng người — xem hướng dẫn ở bài ' + link('the-he-chi-nhanh-trong-gia-pha-dong-ho-giai-thich-de-hieu', 'cách tính đời trong gia phả') + '.</p>',
      img('tree', 'Cây gia phả nhiều đời, mỗi hàng là một đời', 'Mỗi hàng trên cây gia phả là một đời; tên gọi cao tổ, tằng tổ… thay đổi tùy bạn đứng ở hàng nào.'),
      DEMO_NOTE,
      '<h2>Tên gọi trong văn khấn và bài vị</h2>',
      '<p>Khi cúng, tổ tiên được gọi kèm chữ <strong>"hiển"</strong> (vẻ vang): hiển khảo (cha đã mất), hiển tỷ (mẹ đã mất), hiển tổ khảo, hiển tằng tổ khảo, hiển cao tổ khảo… Người đứng cúng xưng theo vai của mình: con là "hiếu tử", cháu là "hiếu tôn". Cách xưng hô với người đang sống theo vai vế xem bài ' + link('cach-xung-ho-trong-ho-hang-theo-vai-ve', 'xưng hô trong họ hàng') + '; các thuật ngữ khác như tên húy, thụy hiệu có trong ' + link('thuat-ngu-gia-pha-pha-do-pha-he-ten-huy-khao-ty', 'từ điển thuật ngữ gia phả') + '.</p>',
      '<h2>Câu hỏi thường gặp</h2>',
      '<h3>Chút và chít khác nhau không?</h3>',
      '<p>Không. Cả hai chỉ con của chắt (đời −4). Miền Bắc hay nói "chút", miền Nam hay nói "chít"; có nơi dùng "chít" cho đời −5.</p>',
      '<h3>Cụ và kỵ, đời nào cao hơn?</h3>',
      '<p>Kỵ cao hơn: kỵ là cha mẹ của cụ. Một số vùng gọi ngược hoặc gọi chung là "cụ kỵ", nên khi ghi gia phả nên kèm số đời để khỏi nhầm.</p>',
      '<h3>Tên gọi này tính từ ai?</h3>',
      '<p>Luôn tính từ người đang xét (bản thân). Cùng một cụ, với người này là tằng tổ nhưng với con của người đó lại là cao tổ. Số đời tính từ thủy tổ thì không đổi — vì vậy gia phả ghi số đời.</p>',
      cta('Ghi số đời cho cả họ một lần, không lo nhầm tên gọi.'),
    ].join(''),
  },
];
