/** Trang bán sách in (/sach) — đặt mua qua Messenger fanpage. */
export const SHOP_STRINGS = {
  SHOP_TITLE: "Dịch vụ in sổ gia phả, phả đồ & sách văn khấn",
  SHOP_META_DESC:
    "In sổ gia phả dòng họ với bìa cổ điển, in phả đồ khổ lớn treo nhà thờ họ, sách văn khấn cổ truyền và nhập liệu gia phả hộ. Nhắn fanpage Cội Nguồn để được tư vấn và báo giá.",
  SHOP_LEAD:
    "Biến gia phả số của dòng họ thành cuốn sổ cầm trên tay, tấm phả đồ treo nhà thờ họ và cuốn văn khấn đặt cạnh bàn thờ — hoặc để Cội Nguồn nhập liệu giúp. Nhắn fanpage để được tư vấn, báo giá và xem bản in thử.",
  SHOP_BREADCRUMB: "Dịch vụ",
  SHOP_JUMP_BOOK: "Sổ gia phả in",
  SHOP_JUMP_PRAYER: "Sách văn khấn",
  SHOP_JUMP_SERVICES: "Dịch vụ thêm",

  SHOP_BUY: "Đặt mua qua Messenger",
  SHOP_BUY_HINT: "Mở cuộc trò chuyện với fanpage Cội Nguồn",
  SHOP_PRICE_LABEL: "Giá",
  SHOP_PRICE_QUOTE_BOOK: "Báo giá theo số trang — nhắn fanpage",
  SHOP_PRICE_QUOTE_PRAYER: "Báo giá theo số lượng — nhắn fanpage",

  SHOP_BOOK_BADGE: "Sản phẩm 1",
  SHOP_BOOK_TITLE: "Sổ gia phả in",
  SHOP_BOOK_DESC:
    "In trực tiếp từ dữ liệu cây gia phả của dòng họ trên Cội Nguồn: bìa trước và bìa sau, trang lời tựa, mỗi thành viên một trang hồ sơ trên nền giấy hoa văn rồng giống hệt sổ gia phả trong ứng dụng.",
  SHOP_BOOK_FEATURES: [
    "Bìa chọn theo các mẫu thiết kế bên dưới, in tên dòng họ, năm lập phả và địa chỉ nhà thờ họ",
    "Trang lời tựa và hồ sơ từng thành viên: đời, chi, ngày sinh, ngày giỗ, tiểu sử, mộ phần",
    "Khổ A4, file in chuẩn có lề tràn (bleed) để cắt xén đẹp",
    "Xem và duyệt bản in thử trước khi in chính thức",
  ],
  SHOP_BOOK_IMG_COVER_ALT: "Bìa sổ gia phả in từ Cội Nguồn",
  SHOP_BOOK_IMG_PAGE_ALT: "Trang hồ sơ thành viên trong sổ gia phả",
  SHOP_COVERS_TITLE: "Chọn mẫu bìa",
  SHOP_COVERS_HINT:
    "Bìa xem trước bằng chính mẫu thiết kế trong ứng dụng — tên dòng họ, năm lập phả sẽ thay bằng thông tin của bạn.",
  SHOP_COVER_SAMPLE_TITLE: "Gia Phả",
  SHOP_COVER_SAMPLE_CLAN: "Nguyễn Đình",
  SHOP_COVER_SAMPLE_YEAR: "1890",
  SHOP_COVER_SAMPLE_ADDRESS: "Nghệ An",
  SHOP_COVER_OPEN: (name: string) => `Xem lớn mẫu bìa ${name}`,
  SHOP_COVER_VIEW_HINT: "Bấm để xem",
  SHOP_COVER_DIALOG: "Xem mẫu bìa",
  SHOP_COVER_FRONT: "Bìa trước",
  SHOP_COVER_BACK: "Bìa sau",
  SHOP_COVER_TILT_HINT: "Rê chuột để xoay sách · ← → đổi mẫu",
  SHOP_COVER_TILT_HINT_TOUCH: "Vuốt trái / phải để đổi mẫu",
  SHOP_COVER_ORDER: "Đặt in mẫu bìa này",
  SHOP_COVER_PREV: "Mẫu trước",
  SHOP_COVER_NEXT: "Mẫu tiếp",
  SHOP_COVER_CLOSE: "Đóng",
  SHOP_COVER_COUNTER: (i: number, n: number) => `${i} / ${n}`,

  SHOP_PAGES_TITLE: "Bên trong cuốn sổ",
  SHOP_PAGES_HINT:
    "Trang thật được in từ dữ liệu dòng họ của bạn, trên nền giấy hoa văn rồng. Bấm vào trang để xem rõ.",
  SHOP_PAGES_DIALOG: "Xem trang trong sổ gia phả",
  SHOP_PAGES_ORDER: "Đặt in sổ gia phả",
  SHOP_PAGES_HINT_DESKTOP: "Rê chuột để nghiêng trang · ← → xem trang khác",
  SHOP_PAGES_HINT_TOUCH: "Vuốt trái / phải để xem trang khác",
  SHOP_PAGES_OPEN: (name: string) => `Xem lớn trang ${name}`,
  SHOP_PAGES: [
    {
      key: "loi-mo-dau",
      src: "/images/shop/trang-loi-mo-dau.webp",
      label: "Lời mở đầu",
      description:
        "Trang mở đầu với tiêu đề thư pháp và lời tựa về cội nguồn dòng họ — có thể viết lại theo ý của dòng họ.",
    },
    {
      key: "ho-so-thanh-vien",
      src: "/images/shop/trang-ho-so-thanh-vien.webp",
      label: "Hồ sơ thành viên",
      description:
        "Mỗi người một trang: đời, chi, ngày sinh, ngày mất, nơi sinh, học vấn, nghề nghiệp và quan hệ cha mẹ, vợ chồng, con cái.",
    },
    {
      key: "tieu-su-mo-phan",
      src: "/images/shop/trang-tieu-su-mo-phan.webp",
      label: "Tiểu sử & mộ phần",
      description:
        "Tiểu sử, thành tích, nơi an táng và ghi chú mộ phần — để con cháu đời sau biết và tìm về.",
    },
  ],

  SHOP_PRAYER_BADGE: "Sản phẩm 2",
  SHOP_PRAYER_TITLE: "Sách văn khấn cổ truyền",
  SHOP_PRAYER_DESC:
    "Tuyển tập bài văn khấn dùng quanh năm trong gia đình và dòng họ, giữ nguyên lời khấn truyền thống, trình bày trang trọng để đọc ngay trước bàn thờ.",
  SHOP_PRAYER_FEATURES: [
    "Tiêu đề in đậm, nền giấy hoa văn rồng, chữ to dễ đọc",
    "Văn khấn ngày giỗ, mùng Một – ngày Rằm, Tết, Thanh minh, tân gia, động thổ…",
    "Có thể in kèm tên dòng họ trong lời khấn",
    "Hợp làm quà biếu ông bà, cha mẹ, nhà thờ họ",
  ],
  SHOP_PRAYER_IMG_ALT: "Trang in mẫu sách văn khấn với tiêu đề và nền hoa văn",
  SHOP_PRAYER_COVERS_TITLE: "Chọn mẫu bìa sách văn khấn",
  SHOP_PRAYER_COVERS_HINT:
    "Cùng bộ mẫu bìa với sổ gia phả — chỉ đổi chữ thành Văn Khấn và tên dòng họ của bạn. Bấm vào bìa để xem rõ.",
  SHOP_PRAYER_COVER_TITLE: "Văn Khấn",
  SHOP_PRAYER_COVER_LINEAGE: "Văn khấn cổ truyền – Kính lễ gia tiên",
  SHOP_PRAYER_COVER_BACK_BODY: "Thành tâm kính lễ – nhớ ơn tổ tiên – giữ nếp nhà muôn đời.",
  SHOP_PRAYER_COVER_DIALOG: "Xem mẫu bìa sách văn khấn",
  SHOP_PRAYER_COVER_IMG_ALT: "Bìa sách văn khấn cổ truyền",
  SHOP_PRAYER_LIST_TITLE: (n: number) => `${n} bài văn khấn trong sách`,

  SHOP_SERVICES_TITLE: "Dịch vụ thêm",
  SHOP_SERVICES_HINT:
    "Không có thời gian? Cội Nguồn làm giúp từ khâu nhập dữ liệu đến in phả đồ treo nhà thờ họ.",
  SHOP_SERVICES: [
    {
      key: "in-pha-do",
      title: "In phả đồ khổ lớn",
      description:
        "Phả đồ cả dòng họ trên một tấm lớn để treo nhà thờ họ, có cuốn thư, câu đối, rồng chầu — xuất từ chính cây gia phả của bạn trên Cội Nguồn.",
      features: [
        "Khổ A1, A0 hoặc theo kích thước tường nhà thờ họ",
        "Tên dòng họ trên cuốn thư, câu đối hai bên tự chọn",
        "Xem bản thiết kế trước khi in",
      ],
      price: "Báo giá theo khổ và chất liệu in — nhắn fanpage",
      image: { src: "/images/shop/pha-do-in-kho-lon.webp", width: 2000, height: 1409 },
      imageAlt: "Phả đồ nhiều đời của dòng họ in khổ lớn",
    },
    {
      key: "nhap-lieu-ho",
      title: "Nhập liệu gia phả hộ",
      description:
        "Gửi sổ gia phả chép tay, ảnh chụp hoặc file Word/Excel — Cội Nguồn nhập toàn bộ lên cây gia phả, dòng họ chỉ việc soát lại.",
      features: [
        "Nhận sổ chép tay, ảnh chụp, file Word hoặc Excel",
        "Dựng đủ quan hệ cha mẹ, vợ chồng, đời, chi và ngày giỗ",
        "Gửi bảng Excel để dòng họ duyệt trước khi đưa lên cây",
      ],
      price: "Báo giá theo số người — nhắn fanpage",
      image: null,
      imageAlt: "",
    },
  ],
  SHOP_SERVICE_ORDER: "Hỏi dịch vụ này",
  SHOP_SERVICE_OPEN: (name: string) => `Xem lớn mẫu ${name}`,
  SHOP_SERVICE_VIEW_HINT: "Rê chuột để nghiêng xem chi tiết · Esc để đóng",
  SHOP_SERVICE_VIEW_HINT_TOUCH: "Chạm ra ngoài ảnh để đóng",
  SHOP_SERVICE_IMPORT_FROM: "Sổ chép tay · ảnh · Excel",
  SHOP_SERVICE_IMPORT_TO: "Cây gia phả",

  SHOP_STEPS_TITLE: "Đặt sách thế nào?",
  SHOP_STEPS: [
    { title: "Nhắn fanpage", body: "Bấm nút đặt mua, chọn sản phẩm và số lượng." },
    {
      title: "Chọn mẫu & gửi thông tin",
      body: "Chọn mẫu bìa, gửi tên dòng họ; sổ gia phả lấy dữ liệu từ cây trên Cội Nguồn.",
    },
    { title: "Duyệt bản in thử", body: "Xem bản thiết kế, chỉnh sửa đến khi ưng ý." },
    { title: "Nhận sách", body: "In và gửi sách đến địa chỉ của bạn." },
  ],
  SHOP_CTA_TITLE: "Cần tư vấn thêm?",
  SHOP_CTA_BODY:
    "Nhắn fanpage Cội Nguồn để hỏi về số trang, chất liệu bìa, thời gian in và giá.",
} as const;
