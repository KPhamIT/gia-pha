/** Hướng dẫn và câu hỏi thường gặp của công cụ Xem tuổi làm nhà. */
export const XEM_TUOI_GUIDE_STRINGS = {
  XT_GROUP_HAN_CHINH: "Ba hạn chính",
  XT_GROUP_HAN_CHINH_DESC:
    "Ba phép gần như nơi nào cũng xét khi làm nhà, tính từ tuổi mụ và con giáp. Trọng số cao nhất.",
  XT_GROUP_TUOI_HOP: "Tuổi hợp với năm",
  XT_GROUP_TUOI_HOP_DESC:
    "So can, chi và mệnh ngũ hành của tuổi với năm làm nhà: xung, trùng hay tương hợp, tương sinh.",
  XT_GROUP_SAO_HAN: "Sao hạn trong năm",
  XT_GROUP_SAO_HAN_DESC: "Sao chiếu mệnh và vận hạn của gia chủ trong năm, tra theo tuổi mụ và giới tính.",
  XT_GROUP_SCORE: (score: number, max: number) => `Nhóm: ${score.toLocaleString("vi-VN")}/${max} điểm`,
  XT_GROUP_REMOVE: "Bỏ cả nhóm",
  XT_GROUP_RESTORE: "Tính lại cả nhóm",
  XT_GROUP_REMOVED: "Đã bỏ cả nhóm — không tính vào điểm",
  XT_GROUP_NUMERAL: ["I", "II", "III", "IV", "V", "VI"],
  XT_GUIDE_TITLE: "Cách xem tuổi làm nhà",
  XT_GUIDE: [
    {
      title: "Tuổi mụ",
      body: "Tuổi mụ = năm làm nhà − năm sinh + 1, đều tính theo năm âm lịch. Mọi phép xem đều dùng tuổi mụ.",
    },
    {
      title: "Kim Lâu",
      body: "Lấy tuổi mụ chia 9, dư 1 (Kim Lâu Thân), 3 (Thê), 6 (Tử), 8 (Lục Súc) là phạm.",
    },
    {
      title: "Hoang Ốc",
      body: "Sáu cung Nhất Cát, Nhì Nghi, Tam Địa Sát, Tứ Tấn Tài, Ngũ Thọ Tử, Lục Hoang Ốc. Rơi vào cung 3, 5, 6 là xấu.",
    },
    {
      title: "Tam Tai",
      body: "Thân Tý Thìn gặp năm Dần Mão Thìn; Dần Ngọ Tuất gặp Thân Dậu Tuất; Hợi Mão Mùi gặp Tỵ Ngọ Mùi; Tỵ Dậu Sửu gặp Hợi Tý Sửu.",
    },
  ],
  XT_FAQ_TITLE: "Câu hỏi thường gặp",
  XT_FAQ: [
    {
      question: "Phạm Kim Lâu có làm nhà được không?",
      answer:
        "Theo phong tục nên tránh tự đứng tên. Cách thường dùng là mượn tuổi người hợp đứng ra làm lễ động thổ, hoặc chọn năm khác không phạm.",
    },
    {
      question: "Xem tuổi làm nhà theo tuổi chồng hay tuổi vợ?",
      answer:
        "Phong tục thường xem tuổi người đàn ông trụ cột trong nhà (chồng hoặc con trai trưởng). Nếu người đứng tên là nữ thì cách tính vẫn như vậy.",
    },
    {
      question: "Mượn tuổi làm nhà là gì?",
      answer:
        "Là nhờ một người hợp tuổi trong năm đó đứng ra làm lễ động thổ và các thủ tục khởi công thay gia chủ; gia chủ tránh mặt lúc khởi công rồi nhận lại nhà sau.",
    },
    {
      question: "Tuổi mụ tính thế nào?",
      answer: "Lấy năm âm lịch định làm nhà trừ năm sinh âm lịch rồi cộng thêm 1.",
    },
  ],
} as const;
