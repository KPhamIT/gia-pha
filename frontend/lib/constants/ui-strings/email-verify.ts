/** Xác nhận email khi đăng ký dòng họ + popup giới thiệu cho khách lần đầu. */
export const EMAIL_VERIFY_STRINGS = {
  // Sau khi đăng ký
  VERIFY_PENDING_TITLE: "Kiểm tra hộp thư của bạn",
  VERIFY_PENDING_BODY: (email: string) =>
    `Chúng tôi vừa gửi email xác nhận tới ${email}. Mở email và bấm "Xác nhận email" để kích hoạt gia phả — sau đó bạn đăng nhập được ngay.`,
  VERIFY_PENDING_SPAM_HINT:
    "Không thấy email? Xem thử mục Thư rác / Quảng cáo, hoặc gửi lại sau 1 phút.",
  VERIFY_PENDING_MAIL_FAILED:
    "Đã tạo dòng họ nhưng chưa gửi được email xác nhận. Bấm \"Gửi lại email\" để thử lại.",
  VERIFY_RESEND: "Gửi lại email xác nhận",
  VERIFY_RESENDING: "Đang gửi…",
  VERIFY_RESENT:
    "Nếu tài khoản đang chờ xác nhận, email mới đã được gửi. Link cũ không còn dùng được.",
  VERIFY_RESEND_FAILED: "Không gửi lại được email. Vui lòng thử lại sau.",
  VERIFY_GO_LOGIN: "Đến trang đăng nhập",

  // Trang /xac-nhan-email/[token]
  VERIFY_PAGE_TITLE: "Xác nhận email",
  VERIFY_PAGE_SUBTITLE: "Kích hoạt tài khoản quản trị gia phả",
  VERIFY_PAGE_INTRO: "Bấm nút bên dưới để xác nhận email và kích hoạt tài khoản:",
  VERIFY_FIELD_USERNAME: "Tên đăng nhập",
  VERIFY_FIELD_EMAIL: "Email",
  VERIFY_FIELD_CLAN: "Dòng họ",
  VERIFY_BUTTON: "Xác nhận email",
  VERIFY_CONFIRMING: "Đang xác nhận…",
  VERIFY_FAILED: "Xác nhận thất bại. Vui lòng thử lại.",
  VERIFY_DONE: "Đã xác nhận! Đang mở gia phả của bạn…",
  VERIFY_INVALID:
    "Link xác nhận không hợp lệ, đã hết hạn hoặc đã được dùng. Nếu đã xác nhận, bạn có thể đăng nhập. Nếu chưa, gửi lại email xác nhận:",
  VERIFY_RESEND_LOGIN_LABEL: "Tên đăng nhập hoặc email",

  // Trang đăng nhập
  LOGIN_EMAIL_NOT_VERIFIED_RESEND: "Gửi lại email xác nhận",

  // Popup khách lần đầu
  FIRST_VISIT_BADGE: "Trang mẫu",
  FIRST_VISIT_TITLE: "Chào bạn! Đây là gia phả mẫu",
  FIRST_VISIT_BODY:
    "Tên người, cây gia phả, sổ gia phả và sự kiện bạn thấy trên web đều thuộc một dòng họ mẫu — để bạn hình dung Cội Nguồn làm được gì.",
  FIRST_VISIT_OWN_LEAD: "Khi tạo dòng họ của riêng mình, bạn sẽ có:",
  FIRST_VISIT_FEATURES: [
    "Cây gia phả nhiều đời, thêm người chỉ vài chạm",
    "Sổ gia phả đẹp như sách, có bìa và lời mở đầu",
    "Sự kiện, ngày giỗ, đóng góp — nhắc cả họ",
    "Link riêng gửi con cháu cùng xem",
  ],
  FIRST_VISIT_FREE_NOTE: "Giống hệt trang mẫu — nhưng là thông tin gia đình bạn. Đăng ký miễn phí.",
  FIRST_VISIT_CTA: "Tạo gia phả dòng họ tôi",
  FIRST_VISIT_LATER: "Xem trang mẫu trước",
  FIRST_VISIT_CLOSE: "Đóng",
} as const;
