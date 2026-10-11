/** Vật phong thủy theo 8 hướng (Bát quái) và theo sao Bát trạch — tab Xem vị trí phòng. */
export const VAT_PHAM_STRINGS = {
  VP_TITLE: "Vật phong thủy theo từng hướng",
  VP_HINT:
    "Mỗi phương trong nhà ứng với một hành và một mặt của cuộc sống. Đặt vật hợp hành để kích hoạt phương tốt; phương rơi vào sao xấu của gia chủ thì thêm vật hóa giải.",
  VP_ELEMENT: (element: string) => `Hành ${element}`,
  VP_PLACE: "Nên đặt",
  VP_AVOID: "Tránh",
  VP_CURE: "Hóa giải sao xấu",
  VP_BOOST:
    "Phương tốt của gia chủ — nên giữ sáng sủa, gọn gàng để đón cát khí.",
  VP_DIR: {
    N: {
      element: "Thủy",
      aspect: "Sự nghiệp",
      items: [
        "Bể cá, thác nước mini",
        "Tranh sông nước",
        "Chuông gió kim loại",
        "Vật màu đen, xanh dương",
      ],
      avoid: "Nhiều đồ đất, gốm sứ lớn (Thổ khắc Thủy).",
    },
    NE: {
      element: "Thổ",
      aspect: "Học vấn, trí tuệ",
      items: [
        "Quả cầu thạch anh",
        "Tháp văn xương",
        "Đồ gốm sứ, đá tự nhiên",
        "Đèn vàng ấm",
      ],
      avoid: "Cây lớn, đồ gỗ nhiều (Mộc khắc Thổ).",
    },
    E: {
      element: "Mộc",
      aspect: "Gia đạo, sức khỏe",
      items: [
        "Cây xanh, bình hoa tươi",
        "Đồ gỗ",
        "Tranh cây cối, tre trúc",
        "Bể cá nhỏ",
      ],
      avoid: "Đồ kim loại sắc nhọn (Kim khắc Mộc).",
    },
    SE: {
      element: "Mộc",
      aspect: "Tài lộc",
      items: [
        "Cây kim tiền, cây phát tài",
        "Bình nước, bể cá nhỏ",
        "Thuyền buồm gỗ",
        "Vật màu xanh lá",
      ],
      avoid: "Đồ kim loại lớn, để trống trải bừa bộn.",
    },
    S: {
      element: "Hỏa",
      aspect: "Danh tiếng",
      items: [
        "Đèn sáng, nến",
        "Tranh ngựa, mặt trời",
        "Cây xanh (Mộc sinh Hỏa)",
        "Vật màu đỏ, cam",
      ],
      avoid: "Bể cá, đài phun nước (Thủy khắc Hỏa).",
    },
    SW: {
      element: "Thổ",
      aspect: "Hôn nhân, tình duyên",
      items: [
        "Thạch anh hồng",
        "Đôi uyên ương, đồ vật theo cặp",
        "Gốm sứ, đá tự nhiên",
        "Đèn vàng",
      ],
      avoid: "Cây lớn, đồ vật lẻ loi một chiếc.",
    },
    W: {
      element: "Kim",
      aspect: "Con cái, sáng tạo",
      items: [
        "Đồ kim loại, đồng hồ",
        "Chuông gió kim loại",
        "Đá trắng, gốm (Thổ sinh Kim)",
        "Vật màu trắng, ánh kim",
      ],
      avoid: "Nến, đèn đỏ, bếp lửa (Hỏa khắc Kim).",
    },
    NW: {
      element: "Kim",
      aspect: "Quý nhân, người trụ cột",
      items: [
        "Hồ lô đồng, tượng đồng",
        "Quả cầu kim loại",
        "Đá thạch anh trắng",
        "Vật màu trắng, vàng kim",
      ],
      avoid: "Nhiều đồ màu đỏ, lửa (Hỏa khắc Kim).",
    },
  },
  VP_CENTER: {
    title: "Giữa nhà",
    element: "Thổ",
    aspect: "Sức khỏe chung, sự ổn định",
    items: [
      "Để thoáng, sạch, đủ sáng",
      "Thảm, đồ gốm màu vàng đất",
      "Đèn trần ấm",
    ],
    avoid: "Nhà vệ sinh, bếp, cầu thang, đồ đạc chất đống.",
  },
  VP_STAR_CURE: {
    "hoa-hai": ["Đá thạch anh", "Giữ phương này gọn gàng, đủ sáng"],
    "luc-sat": ["Thạch anh hồng", "Tránh để gương, đồ vỡ, đồ cũ hỏng"],
    "ngu-quy": ["Chuông gió kim loại 6 ống", "Hạn chế đồ màu đỏ, vật sắc nhọn"],
    "tuyet-menh": [
      "Hồ lô đồng",
      "Muối hạt / đá muối trong lọ",
      "Không đặt giường, bàn làm việc",
    ],
  } as Record<string, string[]>,
} as const;
