/** Công cụ in sách cho khách (/system/in-sach): sổ gia phả trống + sách văn khấn. */
export const PRINT_BOOKS_STRINGS = {
  PRINT_BOOKS_OPEN: "In sách cho khách",
  PRINT_BOOKS_TITLE: "In sách cho khách",
  PRINT_BOOKS_SUBTITLE:
    "Nhập tên dòng họ, chọn mẫu bìa rồi in bìa và ruột sách — sổ gia phả trống để viết tay và sách văn khấn.",

  PRINT_BOOKS_CLAN_SECTION: "Thông tin dòng họ",
  PRINT_BOOKS_CLAN_NAME: "Tên dòng họ",
  PRINT_BOOKS_CLAN_NAME_HINT: "Chỉ ghi họ, vd. Nguyễn Đình — bìa tự in thành “Dòng Họ Nguyễn Đình”.",
  PRINT_BOOKS_CLAN_NAME_PLACEHOLDER: "Nguyễn Đình",
  PRINT_BOOKS_CLAN_YEAR: "Năm lập phả (tuỳ chọn)",
  PRINT_BOOKS_CLAN_ADDRESS: "Quê quán / địa chỉ (tuỳ chọn)",
  PRINT_BOOKS_CLAN_REQUIRED: "Nhập tên dòng họ trước khi in.",

  PRINT_BOOKS_TAB_GIA_PHA: "Sổ gia phả",
  PRINT_BOOKS_TAB_VAN_KHAN: "Sách văn khấn",

  PRINT_BOOKS_COVER: "Mẫu bìa",
  PRINT_BOOKS_PREVIEW: "Xem trước",
  PRINT_BOOKS_ITEM_COVER: "Bìa (trước / sau)",
  PRINT_BOOKS_ITEM_PROFILE: "Trang hồ sơ trống",
  PRINT_BOOKS_PRINT_COVER: "In bìa (trước + sau)",
  PRINT_BOOKS_PRINT_INNER: "In ruột sách",
  PRINT_BOOKS_PRINT_HINT:
    "Trong hộp thoại in: chọn “Lưu dưới dạng PDF”, bật “Đồ hoạ nền”, lề “Không”. Bìa có lề tràn 3 mm và dấu cắt cho nhà in.",
  PRINT_BOOKS_PREPARING: "Đang chuẩn bị bản in…",

  PRINT_BOOKS_PAGE_COUNT: "Số trang hồ sơ trống",
  PRINT_BOOKS_PAGE_COUNT_HINT: (pages: number) => `Ruột sách: 1 trang Lời mở đầu + ${pages} trang hồ sơ = ${pages + 1} trang A4.`,
  PRINT_BOOKS_BORDER: "Khung viền trang",
  PRINT_BOOKS_FORM: "Kiểu trang hồ sơ",
  PRINT_BOOKS_PREFACE_BODY: (clan: string) =>
    `“Cây có cội, nước có nguồn.” Cuốn gia phả này ghi lại nguồn gốc, thế thứ và công đức của tổ tiên dòng họ ${clan}, để con cháu đời sau biết mình từ đâu, nhớ ơn những người đi trước và giữ gìn nếp nhà.\n\nMỗi trang là một người trong họ. Xin con cháu ghi chép cẩn thận, đầy đủ và trung thực: họ tên, đời, chi, ngày sinh, ngày mất (âm lịch), nơi an táng — để cuốn sổ được lưu truyền mãi về sau.`,

  PRINT_BOOKS_PRAYERS: "Bài văn khấn trong sách",
  PRINT_BOOKS_PRAYERS_COUNT: (n: number) => `${n} bài · thứ tự từ trên xuống`,
  PRINT_BOOKS_PRAYERS_EMPTY: "Chưa có bài nào — thêm bài từ kho bên cạnh.",
  PRINT_BOOKS_LIBRARY: "Kho bài văn khấn",
  PRINT_BOOKS_SOURCE_SYSTEM: "Bài của hệ thống",
  PRINT_BOOKS_SOURCE_USER: "Bài của người dùng",
  PRINT_BOOKS_PICK_USER: "Chọn người dùng",
  PRINT_BOOKS_SEARCH: "Tìm theo tên bài",
  PRINT_BOOKS_ADD: "Thêm",
  PRINT_BOOKS_ADDED: "Đã thêm",
  PRINT_BOOKS_ADD_ALL: "Thêm tất cả",
  PRINT_BOOKS_RESET_SYSTEM: "Lấy lại toàn bộ bài hệ thống",
  PRINT_BOOKS_CLEAR: "Bỏ hết",
  PRINT_BOOKS_MOVE_UP: "Lên",
  PRINT_BOOKS_MOVE_DOWN: "Xuống",
  PRINT_BOOKS_REMOVE: "Bỏ khỏi sách",
  PRINT_BOOKS_DRAFT_BADGE: "Chưa đủ nội dung",
  PRINT_BOOKS_TOC_TITLE: "Mục Lục",
  PRINT_BOOKS_LOAD_ERR: "Không tải được danh sách bài văn khấn.",
  PRINT_BOOKS_RENDER_ERR: "Không dựng được nội dung sách văn khấn.",
  PRINT_BOOKS_NO_PRAYERS: "Chọn ít nhất một bài văn khấn.",
  PRINT_BOOKS_USER_LABEL: (name: string, org: string) => (org ? `${name} · ${org}` : name),
} as const;
