/** Tab Xem ngày giờ tốt (/cong-cu/xem-ngay-gio). */
export const XEM_NGAY_STRINGS = {
  XN_TITLE: "Xem ngày giờ tốt",
  XN_META_DESC:
    "Xem ngày tốt xấu theo âm lịch Việt Nam: ngày hoàng đạo, 12 trực, giờ hoàng đạo, tránh Tam Nương, Nguyệt Kỵ, ngày xung tuổi — chọn ngày động thổ, nhập trạch, cưới hỏi, khai trương.",
  XN_LEAD:
    "Chọn tháng, việc định làm và tuổi gia chủ — lịch sẽ tô màu ngày tốt, ngày xấu; bấm vào một ngày để xem giờ hoàng đạo và lý do.",
  XN_MONTH: "Tháng",
  XN_YEAR: "Năm",
  XN_ACTIVITY: "Việc định làm",
  XN_ACTIVITIES: {
    "dong-tho": "Động thổ, làm nhà",
    "nhap-trach": "Nhập trạch, về nhà mới",
    "cuoi-hoi": "Cưới hỏi",
    "khai-truong": "Khai trương",
    "xuat-hanh": "Xuất hành, đi xa",
  },
  XN_OWNER_TOGGLE: "Xét tuổi gia chủ (tránh ngày xung tuổi)",
  XN_PREV: "Tháng trước",
  XN_NEXT: "Tháng sau",
  XN_WEEKDAYS: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
  XN_WEEKDAY_FULL: [
    "Chủ nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ],
  XN_VERDICT: {
    tot: "Ngày tốt",
    kha: "Ngày khá",
    binh: "Bình thường",
    xau: "Ngày xấu",
  },
  XN_LUNAR: (day: number, month: number, leap: boolean) =>
    `${day}/${month}${leap ? " nhuận" : ""} âm lịch`,
  XN_LUNAR_SHORT: (day: number, month: number) =>
    day === 1 ? `${day}/${month}` : String(day),
  XN_CAN_CHI: (day: string, month: string, year: string) =>
    `Ngày ${day} · tháng ${month} · năm ${year}`,
  XN_TIET: (name: string) => `Tiết ${name}`,
  XN_GOOD_HOURS: "Giờ hoàng đạo",
  XN_GOOD_DAYS: (count: number, activity: string) =>
    `${count} ngày tốt cho ${activity.toLowerCase()} trong tháng`,
  XN_GOOD_DAYS_NONE:
    "Tháng này không có ngày tốt hẳn cho việc đã chọn — xem các ngày khá hoặc sang tháng khác.",
  XN_PICK_HINT: "Bấm vào một ngày trên lịch để xem chi tiết.",

  XN_CHECK_HOANG_DAO: "Hoàng đạo / Hắc đạo",
  XN_HOANG_DAO: (than: string, good: boolean) =>
    good
      ? `Ngày hoàng đạo (${than}) — ngày tốt, làm việc lớn thuận lợi.`
      : `Ngày hắc đạo (${than}) — nên tránh việc lớn.`,
  XN_CHECK_TRUC: "Trực ngày",
  XN_TRUC: (
    truc: string,
    meaning: string,
    status: "good" | "neutral" | "bad",
  ) =>
    `Trực ${truc}: ${meaning} ${status === "good" ? "Hợp việc đã chọn." : status === "bad" ? "Kỵ việc đã chọn." : "Bình thường với việc đã chọn."}`,
  XN_TRUC_MEANING: {
    Kiến: "tốt cho xuất hành, gặp gỡ; kỵ động thổ.",
    Trừ: "tốt cho dọn dẹp, chữa bệnh, trừ bỏ cái cũ; kỵ cưới hỏi.",
    Mãn: "đầy đủ, tốt cho cầu tài, khai trương, cưới hỏi.",
    Bình: "bình thường, làm việc nhỏ được.",
    Định: "ổn định, tốt cho cưới hỏi, nhập trạch, ký kết.",
    Chấp: "tốt cho xây dựng, sửa chữa, trồng trọt.",
    Phá: "ngày phá, chỉ hợp phá dỡ; kỵ việc lớn.",
    Nguy: "ngày nguy hiểm, nên tránh việc lớn.",
    Thành: "mọi việc dễ thành, tốt cho hầu hết công việc.",
    Thu: "tốt cho thu hoạch, thu nợ; kỵ khởi công, khai trương.",
    Khai: "mở đầu thuận lợi, tốt cho động thổ, khai trương.",
    Bế: "bế tắc, chỉ hợp đắp đê, lấp hố; kỵ việc lớn.",
  } as Record<string, string>,
  XN_CHECK_NGAY_KY: "Ngày kỵ",
  XN_KY: {
    tamNuong:
      "Phạm Tam Nương (mùng 3, 7, 13, 18, 22, 27) — dân gian kiêng làm việc lớn.",
    nguyetKy:
      "Phạm Nguyệt Kỵ (mùng 5, 14, 23) — “mùng năm, mười bốn, hăm ba, đi chơi cũng lỗ nữa là đi buôn”.",
    duongCong: "Phạm Dương Công kỵ nhật — một trong 13 ngày rất xấu trong năm.",
  },
  XN_KY_NONE: "Không phạm Tam Nương, Nguyệt Kỵ, Dương Công kỵ nhật.",
  XN_CHECK_XUNG: "Xung tuổi gia chủ",
  XN_XUNG: (day: string, owner: string) =>
    `Ngày ${day} xung với tuổi ${owner} — không nên làm việc lớn.`,
  XN_XUNG_NONE: (owner: string) => `Không xung với tuổi ${owner}.`,
  XN_XUNG_SKIP: "Chưa xét tuổi gia chủ.",
  XN_STATUS: { good: "Tốt", neutral: "Bình thường", bad: "Xấu" },
  XN_DISCLAIMER:
    "Lịch âm tính theo múi giờ Việt Nam (UTC+7). Cách chọn ngày theo phong tục phổ biến, mang tính tham khảo; việc hệ trọng nên kết hợp xem thêm theo tuổi từng người.",
} as const;
