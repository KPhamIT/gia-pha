/** Lời mời lập gia phả theo ngữ cảnh, hiện cuối mỗi trang công cụ (/cong-cu/*). */
export type ToolSignupCopy = {
  title: string;
  body: string;
  button: string;
  /** Nút phụ (tuỳ chọn) — lối vào nhẹ hơn tạo gia phả. */
  secondary?: { href: string; label: string };
};

const HOUSE: ToolSignupCopy = {
  title: "Nhà là nơi cả gia đình sum họp — ghi lại cho con cháu",
  body: "Lập cây gia phả miễn phí: lưu ngày sinh, ngày giỗ của cả nhà, tự nhắc giỗ theo âm lịch, gửi link cho họ hàng cùng xem trên điện thoại.",
  button: "Lập gia phả gia đình",
};

const GIO_SECONDARY = { href: "/nhac-ngay-gio", label: "Chỉ nhận nhắc ngày giỗ qua email" };

export const TOOL_SIGNUP_STRINGS = {
  TOOL_SIGNUP_FREE: "Miễn phí · Chỉ cần email",
  TOOL_SIGNUP: {
    "dat-ten-con": {
      title: "Đã chọn được tên đẹp cho bé?",
      body: "Ghi tên bé vào cây gia phả của gia đình cùng ngày sinh — để sau này con biết mình thuộc đời thứ mấy, nhánh nào, ông bà tổ tiên là ai.",
      button: "Ghi tên bé vào gia phả",
    },
    "xem-tuoi-sinh-con": {
      title: "Chuẩn bị đón thành viên mới?",
      body: "Lập cây gia phả để ghi ngày sinh của bé ngay khi chào đời, cùng ngày sinh, ngày giỗ của ông bà, bố mẹ — cả nhà xem chung một nơi.",
      button: "Lập gia phả gia đình",
    },
    "xem-ngay-cuoi": {
      title: "Cưới xong, gia đình có thêm một nhánh mới",
      body: "Thêm cô dâu chú rể vào cây gia phả, ghi ngày cưới, rồi gửi link cho họ hàng hai bên cùng xem và bổ sung.",
      button: "Lập gia phả cho gia đình",
    },
    "xem-ngay-gio": {
      title: "Đừng quên ngày giỗ ông bà",
      body: "Lưu ngày mất âm lịch của ông bà, tổ tiên — Cội Nguồn tự nhắc trước ngày giỗ hằng năm, kèm bài văn khấn điền sẵn tên.",
      button: "Lưu ngày giỗ cả gia đình",
      secondary: GIO_SECONDARY,
    },
    "xem-tuoi-lam-nha": HOUSE,
    "xem-huong-nha": HOUSE,
    "xem-mau-son-nha": HOUSE,
    "xem-vi-tri-phong": HOUSE,
  } as Record<string, ToolSignupCopy>,
};
