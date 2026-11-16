/** Dịch vụ trả phí: file sổ gia phả trống cá nhân hoá (/sach-gia-pha-trong). */
export const BLANK_BOOK_STRINGS = {
  BLANK_BOOK_TITLE: "Sổ gia phả trống in tên dòng họ",
  BLANK_BOOK_META_DESC:
    "Đặt file sổ gia phả trống khổ A4 in sẵn tên dòng họ trên bìa và lời mở đầu, chọn số trang tuỳ ý — chuyển khoản QR, tải file in ngay khi xác nhận.",
  BLANK_BOOK_SUBTITLE:
    "Bìa in tên dòng họ + Lời mở đầu + các trang hồ sơ trống có dòng kẻ để viết tay. Nhận file A4 để tự in hoặc mang ra tiệm in.",

  BLANK_BOOK_CTA_TITLE: "Muốn tự in? Mua file sổ gia phả trống in tên dòng họ",
  BLANK_BOOK_CTA_DESC: "Chọn mẫu bìa và số trang, chuyển khoản QR, tải file A4 ngay khi được xác nhận.",
  BLANK_BOOK_CTA_BUTTON: "Đặt file sổ trống",

  BLANK_BOOK_STEP_CLAN: "1. Thông tin dòng họ",
  BLANK_BOOK_STEP_COVER: "2. Chọn mẫu bìa",
  BLANK_BOOK_STEP_PAGES: "3. Số trang",
  BLANK_BOOK_STEP_CONTACT: "4. Nhận file qua",
  BLANK_BOOK_PAGES_LABEL: "Số trang hồ sơ trống",
  BLANK_BOOK_PAGES_RANGE: (min: number, max: number) => `Từ ${min} đến ${max} trang.`,
  BLANK_BOOK_PRICE_FORMULA: (base: string, perPage: string) => `${base} + ${perPage}/trang`,
  BLANK_BOOK_TOTAL: "Thành tiền",
  BLANK_BOOK_EMAIL: "Email nhận link tải",
  BLANK_BOOK_PHONE: "Số điện thoại / Zalo",
  BLANK_BOOK_CONTACT_HINT: "Nhập ít nhất một trong hai. Email sẽ nhận link tải file khi thanh toán được xác nhận.",
  BLANK_BOOK_CONTACT_REQUIRED: "Nhập email hoặc số điện thoại để nhận file.",
  BLANK_BOOK_PAGES_INVALID: (min: number, max: number) => `Số trang phải từ ${min} đến ${max}.`,
  BLANK_BOOK_SUBMIT: "Đặt mua & lấy mã QR",
  BLANK_BOOK_SUBMITTING: "Đang tạo đơn…",
  BLANK_BOOK_ORDER_FAILED: "Không tạo được đơn. Vui lòng thử lại.",
  BLANK_BOOK_CONFIG_FAILED: "Không tải được bảng giá. Vui lòng tải lại trang.",

  BLANK_BOOK_ORDER_TITLE: "Đơn sổ gia phả trống",
  BLANK_BOOK_ORDER_SUBTITLE: "Lưu lại trang này (hoặc email) để tải file bất cứ lúc nào.",
  BLANK_BOOK_ORDER_NOT_FOUND: "Không tìm thấy đơn hàng. Kiểm tra lại đường link.",
  BLANK_BOOK_ORDER_CODE: "Mã đơn",
  BLANK_BOOK_ORDER_CLAN: "Dòng họ",
  BLANK_BOOK_ORDER_PAGES: "Số trang",
  BLANK_BOOK_ORDER_AMOUNT: "Số tiền",
  BLANK_BOOK_PAY_TITLE: "Chuyển khoản để nhận file",
  BLANK_BOOK_PAY_HINT: (code: string) =>
    `Quét mã QR bằng app ngân hàng, nhập đúng số tiền và ghi nội dung chuyển khoản là ${code}.`,
  BLANK_BOOK_TRANSFER_CONTENT: "Nội dung chuyển khoản",
  BLANK_BOOK_WAITING:
    "Đang chờ xác nhận thanh toán… Trang tự cập nhật, bạn có thể để nguyên hoặc quay lại sau qua link trong email.",
  BLANK_BOOK_PAID_TITLE: "Đã xác nhận thanh toán — tải file sổ gia phả",
  BLANK_BOOK_DOWNLOAD_COVER: "Tải bìa (PDF)",
  BLANK_BOOK_DOWNLOAD_INNER: (pages: number) => `Tải ruột sách — ${pages + 1} trang (PDF)`,
  BLANK_BOOK_DOWNLOAD_HINT:
    "Bấm nút, trong hộp thoại in chọn máy in “Lưu dưới dạng PDF” (Save as PDF), bật “Đồ hoạ nền”, lề “Không” rồi Lưu. Trên điện thoại: chọn In → Lưu PDF / Chia sẻ.",
  BLANK_BOOK_CANCELLED: "Đơn này đã huỷ. Liên hệ chúng tôi nếu cần hỗ trợ.",

  BLANK_BOOK_CONFIRM_TITLE: "Xác nhận đã nhận tiền",
  BLANK_BOOK_CONFIRM_SUBTITLE: "Kiểm tra tài khoản ngân hàng trước khi xác nhận. Khách sẽ tải được file ngay sau đó.",
  BLANK_BOOK_CONFIRM_BUTTON: "Đã nhận tiền — mở khoá file cho khách",
  BLANK_BOOK_CONFIRMING: "Đang xác nhận…",
  BLANK_BOOK_CONFIRM_DONE: "Đã xác nhận. Khách tải được file và nhận email (nếu có).",
  BLANK_BOOK_CONFIRM_INVALID: "Link xác nhận không hợp lệ hoặc đã được dùng.",
  BLANK_BOOK_CONFIRM_FAILED: "Xác nhận thất bại. Vui lòng thử lại.",
  BLANK_BOOK_CONTACT: "Liên hệ khách",
} as const;
