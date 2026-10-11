/** Bát trạch dùng chung (hướng, sao) + tab Xem hướng nhà (/cong-cu/xem-huong-nha). */
export const PHONG_THUY_STRINGS = {
  PT_DIR: {
    N: "Bắc",
    NE: "Đông Bắc",
    E: "Đông",
    SE: "Đông Nam",
    S: "Nam",
    SW: "Tây Nam",
    W: "Tây",
    NW: "Tây Bắc",
  },
  PT_DIR_SHORT: {
    N: "B",
    NE: "ĐB",
    E: "Đ",
    SE: "ĐN",
    S: "N",
    SW: "TN",
    W: "T",
    NW: "TB",
  },
  PT_STAR: {
    "sinh-khi": {
      name: "Sinh Khí",
      tag: "Tốt nhất",
      meaning: "Tài lộc, danh tiếng, công việc thăng tiến, nhà cửa vượng khí.",
      use: "Hợp đặt cửa chính, phòng khách, bàn làm việc.",
    },
    "thien-y": {
      name: "Thiên Y",
      tag: "Rất tốt",
      meaning: "Sức khỏe, sống lâu, gặp quý nhân giúp đỡ, bệnh tật mau khỏi.",
      use: "Hợp phòng ngủ người lớn tuổi, hướng bếp, phòng ăn.",
    },
    "dien-nien": {
      name: "Diên Niên",
      tag: "Tốt",
      meaning:
        "Hôn nhân bền chặt, vợ chồng hòa thuận, gia đạo êm ấm, các mối quan hệ tốt.",
      use: "Hợp phòng ngủ vợ chồng, phòng sinh hoạt chung.",
    },
    "phuc-vi": {
      name: "Phục Vị",
      tag: "Khá",
      meaning:
        "Bình yên, vững vàng, tinh thần minh mẫn, thuận cho học hành, thi cử.",
      use: "Hợp bàn thờ, bàn học, phòng ngủ con cái.",
    },
    "hoa-hai": {
      name: "Họa Hại",
      tag: "Xấu",
      meaning: "Dễ thị phi, thất bại nhỏ, chuyện không may, hao tài lặt vặt.",
      use: "Nên dùng làm nhà kho, nhà vệ sinh.",
    },
    "luc-sat": {
      name: "Lục Sát",
      tag: "Xấu",
      meaning: "Bất hòa, tranh cãi, kiện tụng, chuyện tình cảm trắc trở.",
      use: "Nên dùng làm nhà vệ sinh, nhà kho, đặt bếp.",
    },
    "ngu-quy": {
      name: "Ngũ Quỷ",
      tag: "Rất xấu",
      meaning:
        "Dễ mất trộm, cháy nổ, tai nạn, người trong nhà hay đau ốm, cãi vã.",
      use: "Nên đặt bếp, nhà vệ sinh để trấn.",
    },
    "tuyet-menh": {
      name: "Tuyệt Mệnh",
      tag: "Xấu nhất",
      meaning: "Bệnh tật nặng, phá sản, mất mát lớn — hướng xấu nhất.",
      use: "Nên đặt nhà vệ sinh, bếp để trấn; tuyệt đối tránh cửa chính, phòng ngủ.",
    },
  },
  PT_GROUP: {
    dong: "Đông tứ mệnh",
    tay: "Tây tứ mệnh",
  },
  PT_GROUP_DIRS: {
    dong: "hợp 4 hướng Bắc, Nam, Đông, Đông Nam",
    tay: "hợp 4 hướng Tây, Tây Bắc, Tây Nam, Đông Bắc",
  },
  PT_CUNG: (trigram: string, element: string) =>
    `Cung ${trigram} · hành ${element}`,
  PT_CUNG_SHORT: "Cung",
  PT_GOOD: "Tốt",
  PT_BAD: "Xấu",
  PT_GOOD_DIRS: "4 hướng tốt",
  PT_BAD_DIRS: "4 hướng xấu",
  PT_COMPASS_LABEL: "La bàn 8 hướng theo cung mệnh",

  XH_TITLE: "Xem hướng nhà hợp tuổi",
  XH_META_DESC:
    "Xem hướng nhà hợp tuổi theo Bát trạch: tính cung mệnh, Đông tứ mệnh hay Tây tứ mệnh, 4 hướng tốt Sinh Khí, Thiên Y, Diên Niên, Phục Vị và 4 hướng xấu cần tránh.",
  XH_LEAD:
    "Nhập năm sinh và giới tính gia chủ để biết cung mệnh, 8 hướng tốt xấu và hướng nhà, hướng cửa nên chọn.",
  XH_FACING: "Hướng nhà đang xem (không bắt buộc)",
  XH_FACING_NONE: "— Chưa chọn —",
  XH_FACING_HINT: "Hướng nhà là hướng nhìn thẳng ra từ cửa chính.",
  XH_RESULT_TITLE: "Cung mệnh của gia chủ",
  XH_RESULT_BODY: (group: string, dirs: string) => `Thuộc ${group}, ${dirs}.`,
  XH_FACING_VERDICT: (dir: string, star: string, good: boolean) =>
    good
      ? `Nhà hướng ${dir} rơi vào cung ${star} — hợp tuổi gia chủ.`
      : `Nhà hướng ${dir} rơi vào cung ${star} — không hợp tuổi gia chủ.`,
  XH_FACING_FIX:
    "Nếu không đổi được hướng nhà: có thể xoay cửa chính, cổng hoặc bậc tam cấp về hướng tốt, đặt phòng ngủ và bếp quay về hướng tốt để bù lại.",
  XH_BEST: (dir: string) => `Hướng tốt nhất: ${dir} (Sinh Khí).`,
  XH_FAMILY_NOTE:
    "Bát trạch thường xét theo tuổi người trụ cột trong nhà. Nếu vợ chồng khác nhóm (một Đông tứ mệnh, một Tây tứ mệnh), ưu tiên hướng nhà theo gia chủ, rồi chọn phòng ngủ, bàn làm việc theo hướng tốt của từng người.",
  XH_DISCLAIMER:
    "Kết quả theo phương pháp Bát trạch phổ biến trong dân gian, mang tính tham khảo. Khi xây dựng nên kết hợp thực tế đất, đường đi, ánh sáng, gió.",
} as const;
