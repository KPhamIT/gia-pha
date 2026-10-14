/** Xem ngày cưới hỏi: bảng năm, bảng tháng, hướng dẫn và câu hỏi thường gặp. */
export const XEM_NGAY_CUOI_GUIDE_STRINGS = {
  XC_YEARS_TITLE: "Năm cưới theo tuổi cô dâu",
  XC_YEARS_NOTE:
    "Năm âm lịch, tính tuổi mụ. Kim Lâu của cô dâu là điều quyết định; Kim Lâu chú rể và Tam Tai chỉ để tham khảo, nhiều nơi không xét khi cưới.",
  XC_YEARS_HEAD: {
    year: "Năm",
    bride: "Cô dâu",
    groom: "Chú rể (tham khảo)",
    tamTai: "Tam Tai cô dâu",
  },
  XC_AGE: (age: number) => `${age} tuổi`,
  XC_YEAR_OK: "Cưới được",
  XC_YEAR_BAD: "Phạm Kim Lâu",
  XC_YES: "Có",
  XC_NO: "Không",
  XC_VIEW_YEAR: "Xem năm này",

  XC_MONTHS_TITLE: (chi: string) => `Tháng cưới cho cô dâu tuổi ${chi}`,
  XC_MONTH_LIST: (a: number, b: number) => `Tháng ${a} và ${b}`,
  XC_MONTHS_NOTE:
    "Tháng âm lịch (tháng nhuận tính như tháng chính). Nên ưu tiên tháng đại lợi, rồi đến tiểu lợi.",

  XC_GUIDE: [
    {
      title: "1. Lấy tuổi cô dâu làm gốc",
      body: "“Lấy vợ xem tuổi đàn bà, làm nhà xem tuổi đàn ông.” Năm cưới tính theo tuổi mụ cô dâu: chia 9 dư 1, 3, 6, 8 là phạm Kim Lâu (Thân, Thê, Tử, Lục Súc) — không cưới năm đó.",
    },
    {
      title: "2. Chọn tháng đại lợi",
      body: "12 tháng âm chia 6 loại theo tuổi cô dâu: Đại lợi (tốt nhất), Tiểu lợi (dùng được), Phòng ông cô, Phòng phụ mẫu, Phòng phu chủ, Phòng nữ thân. Hai loại cuối kỵ chính đôi vợ chồng nên công cụ loại hẳn.",
    },
    {
      title: "3. Chu đường giá thú",
      body: "Tám cung Phu, Cô, Đường, Ông, Đệ, Táo, Phụ, Trù. Tháng đủ đếm thuận từ Phu, tháng thiếu đếm nghịch từ Phụ. Rơi vào Đường, Đệ, Táo, Trù là tốt; Phu, Phụ kỵ đôi vợ chồng; Ông, Cô chỉ kỵ khi còn bố mẹ chồng.",
    },
    {
      title: "4. Hoàng đạo và 12 trực",
      body: "Ưu tiên ngày hoàng đạo; trực Mãn, Định, Thành, Khai hợp cưới gả, tránh trực Trừ, Phá, Nguy, Bế.",
    },
    {
      title: "5. Tránh ngày bách kỵ",
      body: "Sát chủ, Thụ tử, Tam Nương (mùng 3, 7, 13, 18, 22, 27), Nguyệt Kỵ (5, 14, 23), Dương Công kỵ nhật bị loại. Không phòng là ngày kỵ riêng của giá thú, bị trừ điểm.",
    },
    {
      title: "6. Hợp tuổi cả hai — và giờ đón dâu",
      body: "Ngày xung (lục xung) với tuổi cô dâu hoặc chú rể bị loại; ngày lục hợp, tam hợp được cộng điểm. Khi đã có ngày, chọn giờ hoàng đạo không xung tuổi để làm lễ gia tiên và đón dâu.",
    },
  ],
  XC_FAQ: [
    {
      question: "Cách chấm ngày tốt, khá, xấu thế nào?",
      answer:
        "Ngày phạm Kim Lâu, tháng phòng phu chủ / nữ thân, Chu đường rơi Phu hoặc Phụ, Sát chủ, Thụ tử, Tam Nương, Nguyệt Kỵ, Dương Công hoặc xung tuổi là ngày xấu. Còn lại cộng điểm: tháng đại lợi, Chu đường tốt, hoàng đạo, trực hợp, hợp tuổi mỗi thứ +1; tháng phòng, hắc đạo, trực kỵ, Không phòng mỗi thứ −1. Từ 3 điểm là ngày tốt, 1–2 điểm là ngày khá.",
    },
    {
      question: "Cô dâu phạm Kim Lâu thì làm sao?",
      answer:
        "Cách phổ biến nhất là lùi sang năm không phạm (bảng năm cưới bên trên). Một số nơi cho cưới trước Tết, hoặc tổ chức “xin dâu” — nhà trai đón dâu hai lần — nhưng đây là tục lệ từng vùng, nên hỏi ý gia đình.",
    },
    {
      question: "Có xét tuổi chú rể không?",
      answer:
        "Có: ngày xung tuổi chú rể bị loại, ngày hợp tuổi chú rể được cộng điểm, và giờ đón dâu bỏ giờ xung tuổi chú rể. Kim Lâu chú rể chỉ hiển thị để tham khảo vì theo lệ chọn năm cưới xem tuổi cô dâu.",
    },
    {
      question: "Ngày ăn hỏi và ngày cưới có cần xem riêng?",
      answer:
        "Nên xem riêng. Công cụ dùng được cho cả hai; riêng Không phòng chỉ kỵ ngày cưới (đón dâu), lễ ăn hỏi có thể bỏ qua tiêu chí này.",
    },
    {
      question: "Tháng 7 âm có cưới được không?",
      answer:
        "Theo bảng tháng, tháng 7 vẫn có thể là tháng đại lợi (vd. cô dâu tuổi Mão, Dậu). Tuy vậy nhiều nơi kiêng cưới tháng 7 (tháng cô hồn, Ngâu) — đó là tập tục, nên tôn trọng ý gia đình.",
    },
  ],
} as const;
