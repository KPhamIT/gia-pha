/** Nhắc ngày giỗ qua email cho khách chưa có tài khoản (/nhac-ngay-gio). */
export const GIO_REMINDER_STRINGS = {
  GR_TITLE: "Nhắc ngày giỗ qua email — miễn phí",
  GR_LEAD:
    "Nhập ngày mất âm lịch của ông bà, cha mẹ. Mỗi năm Cội Nguồn gửi email nhắc trước 3 ngày và đúng ngày giỗ, kèm ngày dương lịch tương ứng.",
  GR_META_DESC:
    "Nhận email nhắc ngày giỗ âm lịch hằng năm miễn phí: nhắc trước 3 ngày và đúng ngày, tự đổi sang ngày dương lịch, kèm bài văn khấn.",
  GR_NAME: "Nhắc giỗ ai?",
  GR_NAME_PLACEHOLDER: "Ví dụ: Ông nội, Bà ngoại Nguyễn Thị Hoa",
  GR_LUNAR_DATE: "Ngày mất (âm lịch)",
  GR_DAY: "Ngày",
  GR_MONTH: "Tháng",
  GR_DAY_OPTION: (d: number) => (d <= 10 ? `Mùng ${d}` : `Ngày ${d}`),
  GR_MONTH_OPTION: (m: number) => (m === 1 ? "Tháng Giêng" : m === 12 ? "Tháng Chạp" : `Tháng ${m}`),
  GR_EMAIL: "Email nhận nhắc",
  GR_EMAIL_PLACEHOLDER: "Ví dụ: ten@gmail.com",
  GR_SUBMIT: "Bật nhắc ngày giỗ",
  GR_SUBMITTING: "Đang lưu…",
  GR_FAILED: "Chưa bật được nhắc giỗ. Vui lòng thử lại.",
  GR_PRIVACY: "Chỉ dùng email để gửi nhắc giỗ. Mỗi email đều có link tắt nhắc.",
  GR_DONE_TITLE: (name: string) => `Đã bật nhắc ngày giỗ ${name}`,
  GR_DONE_BODY: (date: string, days: number) =>
    days === 0 ? `Hôm nay (${date}) là ngày giỗ.` : `Lần giỗ tới: ${date} — còn ${days} ngày. Kiểm tra hộp thư (cả mục Spam) để xem email xác nhận.`,
  GR_ADD_ANOTHER: "Thêm ngày giỗ khác",
  GR_UPSELL_TITLE: "Lưu ngày giỗ của cả gia đình ở một nơi",
  GR_UPSELL_BODY:
    "Lập cây gia phả miễn phí: ghi ông bà, bố mẹ, con cháu; tự nhắc mọi ngày giỗ; điền sẵn tên vào bài văn khấn; gửi link cho họ hàng cùng xem.",
  GR_UPSELL_BUTTON: "Lập gia phả miễn phí",
  GR_MANAGE_TITLE: "Tắt nhắc ngày giỗ",
  GR_MANAGE_LEAD: "Bạn sẽ không nhận email nhắc cho ngày giỗ này nữa.",
  GR_MANAGE_INFO: (name: string, day: number, month: number) => `Nhắc giỗ ${name} — ngày ${day} tháng ${month} âm lịch.`,
  GR_MANAGE_BUTTON: "Tắt nhắc",
  GR_MANAGE_DONE: "Đã tắt nhắc ngày giỗ này.",
  GR_MANAGE_ALREADY_OFF: "Nhắc ngày giỗ này đã được tắt trước đó.",
  GR_MANAGE_NOT_FOUND: "Không tìm thấy đăng ký nhắc giỗ. Kiểm tra lại đường link.",
} as const;
