/** Tab Xem màu sơn nhà, màu gạch (/cong-cu/xem-mau-son-nha). */
export const MAU_SON_STRINGS = {
  MS_TITLE: "Xem màu sơn nhà, màu gạch hợp mệnh",
  MS_META_DESC:
    "Chọn màu sơn nhà, màu gạch lát nền, gạch ốp bếp và nhà vệ sinh hợp mệnh gia chủ theo ngũ hành: màu tương sinh, màu bản mệnh, màu nên tránh; có bảng màu mẫu và gợi ý màu mặt tiền theo hướng nhà.",
  MS_LEAD:
    "Nhập năm sinh, giới tính và hướng nhà — công cụ xếp 5 nhóm màu từ hợp nhất đến nên tránh, kèm bảng màu mẫu và gợi ý cho phòng khách, phòng ngủ, bếp, nhà vệ sinh, mặt tiền.",
  MS_BASIS: "Tính mệnh theo",
  MS_BASIS_OPTIONS: {
    "nap-am": "Mệnh năm sinh (nạp âm) — phổ biến",
    "cung-phi": "Cung phi Bát trạch",
  },
  MS_BASIS_HINT:
    "Đa số thầy và hãng sơn ở Việt Nam chọn màu theo mệnh năm sinh. Cung phi dùng khi bạn đã xem hướng nhà theo Bát trạch.",
  MS_FACING: "Hướng nhà (mặt tiền)",
  MS_FACING_HINT: "Để gợi ý màu sơn ngoài trời; bỏ trống nếu chỉ sơn trong nhà.",

  MS_MENH: (name: string, element: string) =>
    `Mệnh ${name} — hành ${element}`,
  MS_RANK: {
    "tuong-sinh": {
      title: "Màu tương sinh — hợp nhất",
      body: "Hành của màu sinh ra mệnh, được nâng đỡ. Hợp làm màu chủ đạo (khoảng 60% diện tích).",
    },
    "hoa-hop": {
      title: "Màu bản mệnh — hợp",
      body: "Cùng hành với mệnh, hài hòa. Dùng làm màu chính hoặc phối cùng màu tương sinh.",
    },
    "che-khac": {
      title: "Màu chế khắc — dùng được",
      body: "Mệnh khắc hành của màu, chế ngự được. Hợp làm màu phụ hoặc điểm nhấn.",
    },
    "sinh-xuat": {
      title: "Màu sinh xuất — dùng ít",
      body: "Mệnh sinh ra hành của màu, dễ hao tổn. Chỉ nên điểm xuyết.",
    },
    ky: {
      title: "Màu tương khắc — nên tránh",
      body: "Hành của màu khắc mệnh. Không nên làm màu chủ đạo cho tường, sàn.",
    },
  },
  MS_ELEMENT_COLORS: (element: string) => `Nhóm màu hành ${element}`,

  MS_AREAS_TITLE: "Gợi ý cho từng khu vực",
  MS_AREA: {
    "phong-khach": {
      title: "Phòng khách",
      tip: "Sơn tường tông nhạt của màu nên dùng; gạch lát nền sáng, trung tính để nhà rộng và sáng. Phòng thiếu sáng không lát gạch tối màu.",
    },
    "phong-ngu": {
      title: "Phòng ngủ",
      tip: "Theo mệnh người ngủ trong phòng. Chọn tông dịu, ít tương phản; tránh đỏ rực, đen phủ cả mảng tường.",
    },
    bep: {
      title: "Bếp (hành Hỏa)",
      tip: "Bếp thuộc Hỏa nên tránh gạch ốp, sơn tường màu Thủy (đen, xanh nước biển) làm chủ đạo. Gạch ốp chọn men bóng, dễ lau dầu mỡ.",
    },
    "ve-sinh": {
      title: "Nhà vệ sinh (hành Thủy)",
      tip: "Trắng, xanh nhạt tạo cảm giác sạch; tránh vàng đất, nâu đậm (Thổ khắc Thủy). Sàn dùng gạch nhám chống trơn.",
    },
    "mat-tien": {
      title: "Mặt tiền, sơn ngoài trời",
      tip: "Màu hợp mệnh gia chủ, không khắc hành của hướng nhà. Ngoài trời nên dùng tông sáng vì bền màu và đỡ hấp nhiệt.",
    },
  },
  MS_USE: "Nên dùng",
  MS_AVOID: "Nên tránh",
  MS_NONE: "—",
  MS_FACADE_ELEMENT: (dir: string, element: string) =>
    `Nhà hướng ${dir} thuộc hành ${element}.`,
  MS_FACADE_NO_FACING: "Chọn hướng nhà ở trên để xét thêm hành của hướng.",
  MS_HOT: "Hướng này nhận nắng gắt — ưu tiên tông rất sáng (trắng, kem, be, ghi nhạt) cho tường ngoài: sơn sáng phản xạ nhiều nắng hơn, nhà mát hơn.",
  MS_DISCLAIMER:
    "Năm sinh theo âm lịch (sinh trước Tết chọn năm trước). Bảng màu theo ngũ hành cổ truyền và cách dùng phổ biến ở Việt Nam, chỉ mang tính tham khảo; màu thực tế nên xem mẫu sơn, mẫu gạch dưới ánh sáng của chính ngôi nhà.",
} as const;
