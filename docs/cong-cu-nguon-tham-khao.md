# Nguồn tham khảo cho các công cụ phong tục

Tài liệu này ghi lại **mỗi quy tắc trong công cụ lấy từ đâu**, nguồn đáng tin tới mức nào, và những chỗ các sách nói khác nhau. Mục đích là để kiểm tra, sửa và trả lời người dùng khi họ hỏi "tính theo sách nào?".

Tài liệu bao gồm hai công cụ:

- [Xem màu sơn nhà, màu gạch](#1-xem-màu-sơn-nhà-màu-gạch) — `/cong-cu/xem-mau-son-nha`
- [Xem ngày cưới hỏi](#2-xem-ngày-cưới-hỏi) — `/cong-cu/xem-ngay-cuoi`

## Cách xếp độ tin cậy

| Mức | Ý nghĩa |
|---|---|
| **A – Kinh điển / học thuật** | Sách cổ có bản gốc tra được (Hoàng Đế Nội Kinh, Hiệp kỷ biện phương thư…), bách khoa, tạp chí khoa học, cơ quan nhà nước. |
| **B – Thông thư được dẫn rộng rãi** | Bảng tra trong thông thư, lịch vạn sự (Tam Liêu đại thông thư, Ngọc hạp thông thư); khớp nhau giữa ít nhất hai nguồn độc lập. |
| **C – Thực hành phổ biến** | Trang của hãng sơn, báo chí, trang phong thủy Việt Nam. Dùng để biết "người Việt đang làm thế nào", không dùng làm căn cứ duy nhất. |

Phong thủy và chọn ngày là **tín ngưỡng, tập tục**, không phải khoa học. "Nguồn uy tín" ở đây nghĩa là nguồn ghi chép đúng truyền thống, không có nghĩa là đã được chứng minh hiệu quả. Công cụ luôn ghi rõ là chỉ để tham khảo.

---

## 1. Xem màu sơn nhà, màu gạch

Mã nguồn: [`frontend/lib/mau-son/palette.ts`](../frontend/lib/mau-son/palette.ts) và [`frontend/lib/mau-son/analyze.ts`](../frontend/lib/mau-son/analyze.ts).

### 1.1. Ngũ hành ↔ ngũ sắc (mức A)

Gốc là sách **Hoàng Đế Nội Kinh – Tố Vấn, thiên "Kim quỹ chân ngôn luận"** (黃帝內經·素問·金匱真言論). Thiên này ghép năm phương, năm màu và năm tạng với nhau:

| Phương | Hành | Màu gốc (chữ Hán) | Tạng |
|---|---|---|---|
| Đông | Mộc | 青 thanh (xanh) | Can (gan) |
| Nam | Hỏa | 赤 xích (đỏ) | Tâm (tim) |
| Trung ương | Thổ | 黃 hoàng (vàng) | Tỳ |
| Tây | Kim | 白 bạch (trắng) | Phế (phổi) |
| Bắc | Thủy | 黑 hắc (đen) | Thận |

Nguồn để tra:

- Bản gốc *Hoàng Đế Nội Kinh* trên Chinese Text Project: <https://ctext.org/huangdi-neijing/zh>
- Wikipedia, *Color in Chinese culture* (bảng ngũ hành – màu – phương): <https://en.wikipedia.org/wiki/Color_in_Chinese_culture>
- Internet Encyclopedia of Philosophy, *Wuxing*: <https://iep.utm.edu/wuxing/>
- Wikipedia tiếng Việt, *Ngũ hành* (vòng tương sinh, tương khắc): <https://vi.wikipedia.org/wiki/Ngũ_hành>

**Chỗ cần lưu ý:** chữ 青 cổ chỉ màu xanh nói chung, gồm cả xanh lá lẫn xanh lam. Cách dùng hiện nay ở Việt Nam (mức C) tách ra như sau:

- Xanh lá thuộc **Mộc**.
- Xanh dương, xanh nước biển thuộc **Thủy** (cùng với màu đen gốc).
- Hồng, cam, tím thuộc **Hỏa**.
- Xám, ghi, bạc thuộc **Kim**.
- Be, nâu đất thuộc **Thổ**.

Công cụ theo cách tách phổ biến này vì người dùng đã quen. Màu mẫu (mã hex) là màu tiêu biểu do mình chọn để minh họa, không lấy từ sách.

### 1.2. Tương sinh, tương khắc (mức A)

- **Tương sinh:** Mộc → Hỏa → Thổ → Kim → Thủy → Mộc.
- **Tương khắc:** Mộc → Thổ → Thủy → Hỏa → Kim → Mộc.

Nguồn: Wikipedia *Ngũ hành* và IEP *Wuxing* (link ở trên). Mã dùng chung hàm `elementRelation` trong [`frontend/lib/xem-tuoi/can-chi.ts`](../frontend/lib/xem-tuoi/can-chi.ts).

### 1.3. Xếp 5 nhóm màu theo mệnh (mức C, lập luận từ mức A)

Đây là cách các thầy phong thủy và hãng sơn ở Việt Nam đang dùng. Mình đối chiếu nhiều trang và thấy họ thống nhất ở phần chính:

| Thứ hạng | Quan hệ | Lời khuyên trong công cụ |
|---|---|---|
| 1. Tương sinh | Hành của màu **sinh** mệnh | Màu chủ đạo (~60%) |
| 2. Bản mệnh | **Cùng** hành | Màu chính / phối |
| 3. Chế khắc | Mệnh **khắc** hành của màu | Màu phụ, điểm nhấn |
| 4. Sinh xuất | Mệnh **sinh** hành của màu | Dùng ít |
| 5. Tương khắc | Hành của màu **khắc** mệnh | Tránh làm màu chủ đạo |

Nguồn thực hành:

- Sơn Jotun Việt Nam, *Chọn màu sơn nhà theo mệnh của gia chủ*: <https://sonjotun.vn/chon-mau-son-nha-theo-menh-cua-gia-chu/245/1269.html>
- Paintbrush, *Cách tính cung mệnh để sơn nhà*: <https://paintbrush.vn/vn/blog/cach-tinh-cung-menh>
- Báo Pháp Luật, *Phối màu theo Ngũ Hành*: <https://baophapluat.vn/phoi-mau-theo-ngu-hanh-post833.html>
- Viettopreview, quy tắc 60-30-10: <https://viettopreview.vn/chon-mau-son-nha-theo-phong-thuy-2.html>

**Chỗ các nguồn nói khác nhau:** có trang xếp "chế khắc" trên "sinh xuất", có trang xếp ngược lại. Công cụ để cả hai ở mức trung bình (màu vàng): không khuyên làm màu chính, cũng không cấm.

### 1.4. Mệnh tính theo nạp âm hay cung phi (mức B)

- **Nạp âm** (lục thập hoa giáp nạp âm): 60 năm can chi chia thành 30 cặp, mỗi cặp một mệnh, ví dụ Giáp Tý – Ất Sửu là Hải Trung Kim. Bảng này có trong các sách mệnh lý như *Tam mệnh thông hội* (三命通會, đời Minh). Mình **chưa đọc trực tiếp** bản Hán văn; bảng trong mã là bảng chuẩn đã dùng cho công cụ Xem tuổi làm nhà. Tham khảo thêm: Wikipedia *Sexagenary cycle* <https://en.wikipedia.org/wiki/Sexagenary_cycle>.
- **Cung phi Bát trạch:** tính từ năm sinh và giới tính, đã có sẵn trong [`frontend/lib/phong-thuy/bat-trach.ts`](../frontend/lib/phong-thuy/bat-trach.ts) (dùng cho Xem hướng nhà).

Các trang Việt Nam phần lớn chọn màu theo **nạp âm**, nên công cụ để nạp âm làm mặc định và cho đổi sang cung phi.

### 1.5. Màu theo khu vực (mức C)

- **Bếp = Hỏa, nhà vệ sinh = Thủy.** Đây là cách xếp phổ biến (nơi có lửa, nơi có nước). Từ đó:
  - Bếp tránh màu Thủy (vì Thủy khắc Hỏa).
  - Nhà vệ sinh tránh màu Thổ đậm (vì Thổ khắc Thủy).
  - Nguồn: VnExpress, *Phong thủy cho nhà vệ sinh* <https://vnexpress.net/phong-thuy-cho-nha-ve-sinh-2932824.html>, *Lựa chọn màu sắc cho từng căn phòng* <https://vnexpress.net/lua-chon-mau-sac-cho-tung-can-phong-2831072.html>.
- **Mặt tiền theo hướng nhà:** mỗi hướng mang một hành theo Hậu thiên bát quái:
  - Bắc – Khảm – Thủy.
  - Nam – Ly – Hỏa.
  - Đông, Đông Nam – Chấn, Tốn – Mộc.
  - Tây, Tây Bắc – Đoài, Càn – Kim.
  - Đông Bắc, Tây Nam – Cấn, Khôn – Thổ.

  Hướng gắn với hành là mức A (khớp với bảng Nội Kinh ở 1.1). Quy tắc "màu mặt tiền không khắc hành của hướng" là mức C.
- **Gạch:** lời khuyên kỹ thuật lấy từ báo chí:
  - Nhà thiếu sáng không dùng gạch tối màu.
  - Sàn nhà vệ sinh dùng gạch nhám chống trơn.
  - Gạch ốp bếp chọn loại dễ lau chùi.
  - Nguồn: VnExpress, *Khéo chọn gạch ốp lát* <https://vnexpress.net/kheo-chon-gach-op-lat-2934609.html>, *Chọn gạch ốp lát cho phòng tắm* <https://vnexpress.net/chon-gach-op-lat-cho-phong-tam-3495152.html>.

### 1.6. Phần có cơ sở khoa học: sơn ngoài trời màu sáng (mức A)

Lời khuyên "hướng nắng gắt (Tây, Tây Nam, Nam, Tây Bắc) nên sơn tường ngoài tông sáng" **không phải phong thủy** mà dựa trên nghiên cứu về "cool wall" (tường mát):

- Lawrence Berkeley National Laboratory (thuộc Bộ Năng lượng Hoa Kỳ): tường phản xạ nắng có thể tiết kiệm năng lượng tương đương mái phản xạ. Xem <https://newscenter.lbl.gov/2019/07/09/cool-walls-can-reduce-energy-costs-pollution/>.
- US EPA, *Using Cool Roofs to Reduce Heat Islands*: tường mát là tường sơn hoặc ốp màu trắng, màu sáng. Xem <https://19january2025snapshot.epa.gov/heatislands/using-cool-roofs-reduce-heat-islands/index.html>.

Danh sách hướng nắng gắt là ước lượng cho khí hậu Việt Nam (nắng chiều hướng Tây), không lấy từ tài liệu nào.

### 1.7. Những gì công cụ **không** làm

- Không xét ngoại lệ chế hóa của từng nạp âm, ví dụ "Thiên Thượng Hỏa không sợ Thủy", "Đại Hải Thủy không sợ Thổ". Các ngoại lệ này chỉ có ở một số trường phái và các nguồn nói khác nhau.
- Không gộp mệnh của hai vợ chồng. FAQ hướng dẫn chọn màu trung gian không khắc ai.
- Không chấm điểm màu theo năm (lưu niên, phi tinh).

---

## 2. Xem ngày cưới hỏi

Mã nguồn: [`frontend/lib/xem-ngay-cuoi/`](../frontend/lib/xem-ngay-cuoi/).

| Quy tắc | Mức | Nguồn | Ghi chú |
|---|---|---|---|
| Âm lịch Việt Nam (UTC+7) | A | Thuật toán của Hồ Ngọc Đức, dùng chung với Xem ngày giờ | Có thể lệch một ngày so với lịch Trung Quốc ở vài tháng. |
| Kim Lâu: tuổi mụ cô dâu chia 9 dư 1, 3, 6, 8 | B | Tập tục phổ biến ("Lấy vợ xem tuổi đàn bà") | Cùng quy tắc với công cụ Xem tuổi làm nhà. |
| Tháng Đại lợi, Tiểu lợi, Phòng ông cô, Phòng phụ mẫu, Phòng phu chủ, Phòng nữ thân | B | "Nữ mệnh hành giá nguyệt" trong *Tam Liêu đại thông thư*: <https://www.sohu.com/a/357210387_120349880>, <https://zhuanlan.zhihu.com/p/449057668> | Đã đối chiếu đủ 6 cặp tuổi, khớp 100%. Một số sách xếp tiểu lợi khác (vd. tuổi Tý, Ngọ là tháng 3, 9); công cụ theo bảng phổ biến hơn. |
| Chu đường giá thú (Phu, Cô, Đường, Ông, Đệ, Táo, Phụ, Trù) | A | *Khâm định Hiệp kỷ biện phương thư*, quyển 55: <https://www.sohu.com/a/617071281_100299419>, <https://www.zhihu.com/question/500549277/answer/3303237092> | Tháng đủ đếm thuận từ Phu, tháng thiếu đếm nghịch từ Phụ. Chính sách cổ có lời bàn rằng "không cần quá câu nệ", nên Ông, Cô chỉ bị trừ điểm khi còn bố mẹ chồng. |
| Sát chủ (âm), Thụ tử | B | Phong thủy Tân Gia Huy: <http://phongthuytangiahuy.com/vn/tt/ngay-sat-chu-va-thu-tu_1941.aspx>; VIETAA: <https://vietaa.com/hoc-phong-thuy/khoa-hoc-xem-ngay-gio-dep/chon-ngay-tot-ngay-xau-nhu-the-nao> | Sát chủ tháng 7 và tháng 8 có bản ghi ngược nhau. Công cụ theo bản được hai nguồn thống nhất: tháng 7 ngày Sửu, tháng 8 ngày Hợi. |
| Không phòng (kỵ giá thú) | C | Phong Thủy Việt: <https://phongthuyviet.com.vn/2016/02/11/ngay-khong-phong-ky-gia-thu/> | Chỉ tìm được một nguồn Việt Nam và chưa đối chiếu được với sách Hán, nên chỉ **trừ điểm**, không loại ngày. |
| Hoàng đạo, 12 trực, Tam Nương, Nguyệt Kỵ, Dương Công | B | Dùng chung với công cụ Xem ngày giờ | |
| Lục xung, lục hợp, tam hợp địa chi | A | Lý thuyết can chi cơ bản | |
| Nhị thập bát tú (28 sao) | — | <https://zhuanlan.zhihu.com/p/487861850> | **Không dùng**, vì các sách ghi sao nào hợp cưới gả rất khác nhau. |
| Bất tướng nhật (阴阳不将) | — | <https://k.sina.cn/article_6440924345_17fe8b4b9001003grx.html> | **Chưa làm**, vì bảng phức tạp và dễ sai. Có thể bổ sung sau. |

---

## Khi muốn sửa hoặc thêm quy tắc

1. Tìm ít nhất **hai nguồn độc lập**. Ưu tiên bản gốc chữ Hán hoặc sách đã xuất bản.
2. Ghi quy tắc vào bảng ở trên, kèm mức tin cậy và link.
3. Quy tắc mức C, hoặc chỉ có một nguồn: chỉ cho **cộng hoặc trừ điểm**, không dùng để loại ngày hay cấm màu.
