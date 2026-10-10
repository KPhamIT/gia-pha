/** Trang văn khấn công khai (/van-khan) — nội dung bài khấn lấy nguyên từ mẫu bài cúng hệ thống. */
export const VAN_KHAN_STRINGS = {
  VAN_KHAN_LIST_TITLE: "Văn khấn cổ truyền",
  VAN_KHAN_LIST_SUBTITLE:
    "Tổng hợp các bài văn khấn, bài cúng truyền thống trong năm: ngày giỗ, mồng một – ngày rằm, lễ Tết, tân gia, động thổ… kèm ý nghĩa và cách sắm lễ.",
  VAN_KHAN_LIST_EMPTY: "Chưa có bài văn khấn nào.",
  VAN_KHAN_READ: "Xem bài khấn",
  VAN_KHAN_BACK_TO_LIST: "Tất cả bài văn khấn",
  VAN_KHAN_SECTION_MEANING: "Ý nghĩa",
  VAN_KHAN_SECTION_PREPARATION: "Cách sắm lễ",
  VAN_KHAN_SECTION_TEXT: "Bài văn khấn",
  VAN_KHAN_SOURCE: "Nguồn tham khảo:",
  VAN_KHAN_BLANK_HINT:
    "Các ô trong ngoặc vuông là phần điền theo gia đình bạn (họ tên, địa chỉ, ngày tháng âm lịch).",
  VAN_KHAN_CTA_TITLE: "Tự động điền bài khấn theo gia phả",
  VAN_KHAN_CTA_BODY:
    "Trên Cội Nguồn, bài cúng ngày giỗ được điền sẵn họ tên người mất, ngày giỗ âm lịch, nơi an táng và tên tín chủ từ gia phả — chỉ việc mở ra đọc hoặc in.",
  VAN_KHAN_CTA_BUTTON: "Tạo gia phả dòng họ",
  VAN_KHAN_RELATED: "Bài văn khấn khác",
  VAN_KHAN_UPDATED_AT: "Cập nhật",
} as const;

/** Nhãn hiển thị cho biến {{...}} trong mẫu bài cúng (trang công khai không có dữ liệu người cụ thể). */
export const VAN_KHAN_PLACEHOLDER_LABELS: Record<string, string> = {
  "organization.name": "tên dòng họ",
  "worshipper.full_name": "họ tên tín chủ",
  "worshipper.name": "họ tên tín chủ",
  "worshipper.address": "địa chỉ",
  "person.full_name": "họ tên người mất",
  "person.name": "họ tên người mất",
  "person.birth_date": "năm sinh",
  "person.birth_year": "năm sinh",
  "person.death_date": "năm mất",
  "person.death_year": "năm mất",
  "person.birth_place": "nơi sinh",
  "person.current_location": "nơi ở",
  "person.grave_cemetery": "nơi an táng",
  "person.grave_address": "địa chỉ mộ",
  "person.grave_notes": "ghi chú mộ",
  "ceremony.lunar_date": "ngày giỗ âm lịch",
  "ceremony.lunar_day": "ngày giỗ",
  "ceremony.lunar_month": "tháng giỗ",
  "ceremony.lunar_year": "năm âm lịch",
  "today.lunar_day": "ngày",
  "today.lunar_month": "tháng",
  "today.lunar_year": "năm",
  "today.lunar_date": "ngày tháng âm lịch",
};
