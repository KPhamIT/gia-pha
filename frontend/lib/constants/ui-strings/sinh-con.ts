/** Tab Xem tuổi sinh con (/cong-cu/xem-tuoi-sinh-con). */
export const SINH_CON_STRINGS = {
  SC_TITLE: "Xem tuổi sinh con hợp bố mẹ",
  SC_META_DESC:
    "Xem năm sinh con hợp tuổi bố mẹ: so ngũ hành nạp âm, thiên can, địa chi của con với bố và mẹ, chấm điểm thang 10 và gợi ý năm sinh con đẹp trong 12 năm tới.",
  SC_LEAD:
    "Nhập năm sinh của bố, mẹ và năm dự định sinh con — xem con hợp bố mẹ đến đâu, kèm bảng so sánh các năm tới để chọn năm đẹp.",
  SC_FATHER_YEAR: "Năm sinh của bố (âm lịch)",
  SC_MOTHER_YEAR: "Năm sinh của mẹ (âm lịch)",
  SC_CHILD_YEAR: "Năm dự định sinh con",
  SC_CHILD_HINT: "Năm âm lịch — bé sinh trước Tết thì tính năm trước.",
  SC_ROLE: { father: "bố", mother: "mẹ" },
  SC_ROLE_TITLE: { father: "Bố và con", mother: "Mẹ và con" },
  SC_CHILD_INFO: (canChi: string, menh: string) =>
    `Con tuổi ${canChi} · mệnh ${menh}`,
  SC_SCORE: "Điểm hợp tuổi",
  SC_VERDICT: {
    "rat-hop": "Rất hợp bố mẹ",
    hop: "Hợp bố mẹ",
    "chua-hop": "Chưa thật hợp",
  },
  SC_VERDICT_BODY: {
    "rat-hop":
      "Năm này con hợp cả tuổi bố và mẹ — theo quan niệm dân gian là năm sinh con rất đẹp.",
    hop: "Con hợp tuổi bố mẹ ở mức khá, có thể yên tâm chọn năm này.",
    "chua-hop":
      "Năm này con chưa thật hợp tuổi bố mẹ. Nếu có thể chọn, xem bảng bên dưới để tìm năm điểm cao hơn.",
  },
  SC_POINTS: (score: number, max: number) =>
    `${score.toLocaleString("vi-VN")}/${max.toLocaleString("vi-VN")} điểm`,
  SC_STATUS: { good: "Tốt", neutral: "Bình thường", bad: "Xấu" },

  SC_SECTION_NGU_HANH: "Ngũ hành nạp âm",
  SC_NGU_HANH: (relation: string, role: string) =>
    ({
      "nam-sinh-menh": `Mệnh ${role} sinh mệnh con — con được ${role} nâng đỡ, dễ nuôi, gần gũi.`,
      "menh-sinh-nam": `Mệnh con sinh mệnh ${role} — con mang phúc, đem lại may mắn cho ${role}.`,
      "binh-hoa": `Mệnh con và ${role} cùng hành — bình hòa, dễ hòa hợp.`,
      "nam-khac-menh": `Mệnh ${role} khắc mệnh con — dân gian cho rằng con dễ vất vả, ít được nhờ.`,
      "menh-khac-nam": `Mệnh con khắc mệnh ${role} — dân gian cho rằng dễ bất đồng, ${role} vất vả hơn.`,
    })[relation] ?? "",
  SC_NGU_HANH_LINE: (role: string, parent: string, child: string) =>
    `Mệnh ${role}: ${parent} · Mệnh con: ${child}.`,
  SC_SECTION_THIEN_CAN: "Thiên can",
  SC_THIEN_CAN: {
    hop: "Can của con hợp can của bố/mẹ — tính tình dễ hòa hợp.",
    binh: "Can bình thường, không hợp không xung.",
    xung: "Can xung nhau — dễ khác tính, hay bất đồng.",
  },
  SC_CAN_LINE: (role: string, parent: string, child: string) =>
    `Can ${role}: ${parent} · Can con: ${child}. Hợp: Giáp–Kỷ, Ất–Canh, Bính–Tân, Đinh–Nhâm, Mậu–Quý.`,
  SC_SECTION_DIA_CHI: "Địa chi (con giáp)",
  SC_DIA_CHI: {
    "tam-hop": "Con giáp tam hợp — rất hợp nhau, gắn bó.",
    "luc-hop": "Con giáp lục hợp — hợp nhau, dễ thương yêu.",
    binh: "Con giáp bình thường, không hợp không xung.",
    "tu-hanh-xung": "Thuộc tứ hành xung — dễ khắc khẩu, cần nhường nhịn.",
    "luc-xung": "Con giáp lục xung — xung khắc mạnh nhất theo dân gian.",
  },
  SC_CHI_LINE: (role: string, parent: string, child: string) =>
    `Tuổi ${role}: ${parent} · Tuổi con: ${child}.`,

  SC_TABLE_TITLE: "So sánh các năm sinh con",
  SC_TABLE_HINT:
    "Bấm vào một năm để xem chi tiết. Năm đánh dấu ★ là năm điểm cao nhất trong bảng.",
  SC_TABLE_COL: {
    year: "Năm",
    menh: "Mệnh con",
    father: "Với bố",
    mother: "Với mẹ",
    score: "Điểm",
  },
  SC_SCORING_NOTE: (max: number) =>
    `Mỗi bên (bố, mẹ) tối đa ${max} điểm: ngũ hành 2, thiên can 1, địa chi 1. Tổng hai bên quy về thang 10 — từ 7,5 là rất hợp, từ 5 là hợp.`,
  SC_DISCLAIMER:
    "Kết quả theo quan niệm dân gian về can chi, ngũ hành, chỉ để tham khảo. Sức khỏe của mẹ, điều kiện gia đình và tình yêu thương mới là điều quan trọng nhất cho con.",
} as const;
