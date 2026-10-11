/** Ý nghĩa các con số + hướng dẫn, FAQ tab Đặt tên con. */
export const DAT_TEN_GUIDE_STRINGS = {
  DT_NUM_MEANING: {
    1: "Độc lập, chủ động, có tố chất lãnh đạo.",
    2: "Nhạy cảm, tinh tế, giỏi kết nối và hòa giải.",
    3: "Sáng tạo, vui vẻ, giao tiếp tốt.",
    4: "Thực tế, chăm chỉ, kỷ luật và đáng tin cậy.",
    5: "Yêu tự do, linh hoạt, thích khám phá.",
    6: "Yêu thương, trách nhiệm, quan tâm gia đình.",
    7: "Trí tuệ, thích tìm hiểu, sâu sắc.",
    8: "Mạnh mẽ, có đầu óc kinh doanh, quản lý giỏi.",
    9: "Nhân ái, lý tưởng, giàu lòng trắc ẩn.",
    10: "Thích nghi nhanh, tự tin, nhiều năng lượng.",
    11: "Trực giác mạnh, giàu cảm hứng, truyền cảm hứng cho người khác.",
    22: "Tầm nhìn lớn, có khả năng biến ý tưởng thành hiện thực.",
  } as Record<number, string>,
  DT_GUIDE: [
    {
      title: "Tên hợp mệnh",
      body: "Mệnh của bé là ngũ hành nạp âm theo năm âm lịch. Tên có hành sinh mệnh (ví dụ mệnh Mộc đặt tên hành Thủy như Hải, Giang) là tốt nhất; cùng hành là bình hòa; tên khắc mệnh nên tránh.",
    },
    {
      title: "Tên đệm và tên chính",
      body: "Nhiều gia đình chọn tên đệm sinh tên chính (ví dụ đệm hành Mộc, tên hành Hỏa) để tên hài hòa. Hành của tên dựa theo nghĩa Hán Việt.",
    },
    {
      title: "Số chủ đạo",
      body: "Cộng mọi chữ số của ngày sinh dương lịch, rút gọn đến khi còn từ 2 đến 11 (giữ 22, viết 22/4). Đây là con số thể hiện bản chất của bé.",
    },
    {
      title: "Số sứ mệnh, linh hồn",
      body: "Mỗi chữ cái (bỏ dấu) mang một số từ 1 đến 9. Cộng cả họ tên được số sứ mệnh; cộng nguyên âm được số linh hồn. Hai số này hợp số chủ đạo thì tên được xem là bổ trợ cho bé.",
    },
  ],
  DT_FAQ: [
    {
      question: "Tên của tôi không có trong từ điển ngũ hành?",
      answer:
        "Công cụ chỉ có sẵn những tên được phân loại khá thống nhất. Nếu biết hành của tên (theo nghĩa Hán Việt), bạn chọn ở ô bên dưới tên; nếu không, công cụ chỉ chấm theo thần số học.",
    },
    {
      question: "Chưa biết ngày sinh chính xác thì sao?",
      answer:
        "Chọn ngày dự sinh. Mệnh ngũ hành chỉ phụ thuộc năm âm lịch, còn số chủ đạo có thể đổi theo ngày — nên xem lại khi bé chào đời.",
    },
    {
      question: "Có nên đổi tên đẹp vì điểm thấp?",
      answer:
        "Không cần. Đây là tham khảo theo quan niệm dân gian; ý nghĩa của tên và tình cảm gia đình gửi gắm mới là điều quan trọng nhất.",
    },
  ],
} as const;
