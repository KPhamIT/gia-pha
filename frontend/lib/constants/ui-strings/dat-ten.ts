/** Tab Đặt tên con (/cong-cu/dat-ten-con). */
export const DAT_TEN_STRINGS = {
  DT_TITLE: "Đặt tên con theo phong thủy và thần số học",
  DT_META_DESC:
    "Đặt tên con hợp tuổi: xem tên hợp mệnh ngũ hành theo năm sinh, tên đệm tương sinh, số sứ mệnh và số linh hồn hợp số chủ đạo theo thần số học — kèm gợi ý tên đẹp cho bé trai, bé gái.",
  DT_LEAD:
    "Nhập họ tên dự định và ngày sinh của bé — xem tên hợp mệnh và hợp số chủ đạo đến đâu, kèm gợi ý tên hợp mệnh để chọn.",
  DT_SURNAME: "Họ",
  DT_MIDDLE: "Tên đệm",
  DT_GIVEN: "Tên",
  DT_SURNAME_PH: "Nguyễn",
  DT_MIDDLE_PH: "Minh",
  DT_GIVEN_PH: "Khôi",
  DT_GENDER: "Bé là",
  DT_GENDER_OPTIONS: { m: "Bé trai", f: "Bé gái" },
  DT_BIRTH: "Ngày sinh (dương lịch)",
  DT_BIRTH_HINT:
    "Chưa sinh thì chọn ngày dự sinh. Mệnh tính theo năm âm lịch của ngày này.",
  DT_ELEMENT_FOUND: (word: string, element: string) =>
    `“${word}” thuộc hành ${element}`,
  DT_ELEMENT_PICK: (word: string) =>
    `Chưa có “${word}” trong từ điển — chọn hành nếu bạn biết:`,
  DT_ELEMENT_NONE: "Không rõ",
  DT_CHILD_INFO: (lunar: string, canChi: string, menh: string) =>
    `Năm âm lịch ${lunar} · tuổi ${canChi} · mệnh ${menh}`,
  DT_SCORE: "Điểm tên",
  DT_VERDICT: {
    "rat-dep": "Tên rất đẹp",
    dep: "Tên đẹp",
    "can-nhac": "Nên cân nhắc thêm",
  },
  DT_VERDICT_BODY: {
    "rat-dep": "Tên hợp mệnh và hợp các con số của bé — có thể yên tâm chọn.",
    dep: "Tên hợp ở mức khá. Xem từng tiêu chí bên dưới để biết điểm nào chưa trọn.",
    "can-nhac":
      "Tên chưa thật hợp theo phong thủy và thần số học — tham khảo gợi ý tên bên dưới.",
  },
  DT_VERDICT_EMPTY: "Nhập tên để xem điểm",
  DT_APPLIED: (on: number, total: number) => `Đã chấm ${on}/${total} tiêu chí`,
  DT_GROUP: { "phong-thuy": "Phong thủy (ngũ hành)", "than-so": "Thần số học" },
  DT_GROUP_DESC: {
    "phong-thuy":
      "Hành của tên so với mệnh nạp âm của bé và giữa tên đệm với tên chính.",
    "than-so": "Các con số tính từ họ tên so với số chủ đạo tính từ ngày sinh.",
  },
  DT_SKIPPED: "Chưa chấm — chưa biết hành của tên.",
  DT_STATUS: { good: "Tốt", neutral: "Bình thường", bad: "Xấu" },
  DT_POINTS: (score: number, max: number) =>
    `${score.toLocaleString("vi-VN", { maximumFractionDigits: 2 })}/${max.toLocaleString("vi-VN")} điểm`,

  DT_CRIT_MENH_TEN: "Tên hợp mệnh",
  DT_MENH_TEN: {
    "nam-sinh-menh": "Hành của tên sinh mệnh bé — tốt nhất, tên nâng đỡ mệnh.",
    "binh-hoa": "Tên cùng hành với mệnh — bình hòa, vững vàng.",
    "menh-sinh-nam": "Mệnh sinh tên — mệnh bị hao bớt, chấp nhận được.",
    "menh-khac-nam": "Mệnh khắc tên — không xấu nhưng không được trợ lực.",
    "nam-khac-menh": "Hành của tên khắc mệnh bé — dân gian cho là nên tránh.",
  } as Record<string, string>,
  DT_MENH_TEN_LINE: (given: string, element: string, menh: string) =>
    `Tên “${given}” hành ${element} · Mệnh bé: ${menh}.`,
  DT_CRIT_DEM_TEN: "Tên đệm và tên chính",
  DT_DEM_TEN: {
    "nam-sinh-menh": "Tên đệm sinh tên chính — tương sinh, rất tốt.",
    "binh-hoa": "Tên đệm và tên chính cùng hành — hài hòa.",
    "menh-sinh-nam": "Tên chính sinh tên đệm — bình thường.",
    "menh-khac-nam": "Tên chính khắc tên đệm — bình thường.",
    "nam-khac-menh": "Tên đệm khắc tên chính — nên cân nhắc.",
  } as Record<string, string>,
  DT_DEM_TEN_LINE: (middle: string, me: string, given: string, ge: string) =>
    `“${middle}” hành ${me} · “${given}” hành ${ge}.`,
  DT_CRIT_SU_MENH: "Số sứ mệnh hợp số chủ đạo",
  DT_CRIT_LINH_HON: "Số linh hồn hợp số chủ đạo",
  DT_HARMONY: (label: string, h: "trung" | "hop" | "binh") =>
    h === "trung"
      ? `${label} trùng số chủ đạo — tên rất hợp bản chất của bé.`
      : h === "hop"
        ? `${label} cùng nhóm hòa hợp với số chủ đạo — tên bổ trợ tốt.`
        : `${label} khác nhóm với số chủ đạo — bình thường, không xung khắc.`,
  DT_NUM_LINE: (label: string, value: string, life: string) =>
    `${label}: ${value} · Số chủ đạo: ${life}. Nhóm hòa hợp: (1, 5, 7), (2, 4, 8), (3, 6, 9).`,
  DT_NUM_LABEL: {
    lifePath: "Số chủ đạo",
    destiny: "Số sứ mệnh",
    soul: "Số linh hồn",
    personality: "Số nhân cách",
  },
  DT_NUM_SOURCE: {
    lifePath: "Từ ngày sinh",
    destiny: "Từ cả họ tên",
    soul: "Từ nguyên âm",
    personality: "Từ phụ âm",
  },
  DT_NUMBERS_TITLE: "Các con số của bé",

  DT_SUGGEST_TITLE: (element: string) => `Gợi ý tên hợp mệnh ${element}`,
  DT_SUGGEST_HINT:
    "Tên có hành sinh mệnh bé xếp trước, rồi tên cùng hành. ★ là tên có số sứ mệnh hợp số chủ đạo (tính cùng họ và tên đệm bạn nhập). Bấm để thử.",
  DT_SUGGEST_SINH: "Sinh mệnh",
  DT_SUGGEST_SAME: "Cùng hành",
  DT_DISCLAIMER:
    "Phân loại ngũ hành của tên theo nghĩa Hán Việt có nhiều cách khác nhau; thần số học là hệ thống tham khảo, không có cơ sở khoa học. Hãy chọn tên có ý nghĩa đẹp và cả nhà cùng thích.",
} as const;
