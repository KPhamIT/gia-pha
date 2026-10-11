/** Tab Xem vị trí phòng (/cong-cu/xem-vi-tri-phong). */
export const VI_TRI_STRINGS = {
  VT_TITLE: "Xem vị trí bếp, phòng ngủ, nhà vệ sinh hợp tuổi",
  VT_META_DESC:
    "Bố trí phòng theo Bát trạch: vị trí và hướng đặt bếp, phòng ngủ, nhà vệ sinh, bàn thờ, phòng làm việc hợp tuổi gia chủ, có sơ đồ mặt bằng 9 ô trực quan.",
  VT_LEAD:
    "Chọn năm sinh, giới tính và hướng nhà — sơ đồ mặt bằng sẽ tô các góc nên đặt bếp, phòng ngủ, nhà vệ sinh, bàn thờ.",
  VT_FACING: "Hướng nhà",
  VT_FACING_HINT:
    "Hướng nhìn thẳng ra từ cửa chính — dùng để xoay sơ đồ cho đúng.",
  VT_ROOM_PICK: "Chọn phòng muốn xem",
  VT_ROOM: {
    "phong-ngu": "Phòng ngủ vợ chồng",
    "phong-ngu-con": "Phòng ngủ con cái",
    bep: "Bếp",
    "ve-sinh": "Nhà vệ sinh",
    "ban-tho": "Bàn thờ",
    "lam-viec": "Phòng làm việc, bàn học",
  },
  VT_ROOM_WHY: {
    "phong-ngu":
      "Phòng ngủ là nơi nghỉ ngơi lâu nhất trong ngày, nên đặt ở cung tốt — nhất là Diên Niên (vợ chồng hòa thuận) hoặc Thiên Y (sức khỏe).",
    "phong-ngu-con":
      "Phòng con cái hợp cung Phục Vị (học hành, tinh thần vững) hoặc Sinh Khí (phát triển, năng động).",
    bep: "Bếp theo nguyên tắc “tọa hung hướng cát”: đặt ở góc xấu để lửa bếp trấn khí xấu, còn hướng bếp quay về hướng tốt.",
    "ve-sinh":
      "Nhà vệ sinh là nơi xả uế, nên đặt ở góc xấu để “trấn” hung khí, tránh làm mất đi các góc tốt của nhà.",
    "ban-tho":
      "Bàn thờ theo nguyên tắc “tọa cát hướng cát”: đặt ở nơi trang nghiêm thuộc cung tốt và quay về hướng tốt.",
    "lam-viec":
      "Bàn làm việc, bàn học hợp Sinh Khí (công danh, tài lộc) hoặc Phục Vị (tập trung, thi cử).",
  },
  VT_ROOM_TIPS: {
    "phong-ngu": [
      "Đầu giường tựa vào tường chắc, không kê dưới xà ngang.",
      "Gương không chiếu thẳng vào giường.",
    ],
    "phong-ngu-con": [
      "Bàn học nên quay về hướng Phục Vị hoặc Sinh Khí của chính đứa trẻ.",
    ],
    bep: [
      "Không đặt bếp ở giữa nhà, không đối diện cửa chính hay nhà vệ sinh.",
      "Bếp nấu (hỏa) không kề sát bồn rửa, tủ lạnh (thủy).",
      "Hướng bếp thường tính theo hướng lưng người đứng nấu.",
    ],
    "ve-sinh": [
      "Không đặt giữa nhà, không đối diện cửa chính, bếp hoặc ngay trên, sau bàn thờ.",
      "Luôn đóng cửa, giữ khô thoáng, có cửa sổ hoặc quạt hút.",
    ],
    "ban-tho": [
      "Lưng bàn thờ tựa tường chắc, không tựa vào nhà vệ sinh hoặc bếp.",
      "Không đặt dưới xà ngang, không đối diện cửa nhà vệ sinh.",
    ],
    "lam-viec": [
      "Ngồi lưng tựa tường, nhìn được cửa ra vào, tránh ngồi quay lưng ra cửa.",
    ],
  },
  VT_PLACE: "Nên đặt ở góc",
  VT_AVOID: "Nên tránh góc",
  VT_FACE: "Nên quay về hướng",
  VT_TIPS: "Lưu ý thêm",
  VT_CENTER: "Giữa nhà",
  VT_CENTER_AVOID: "Tránh đặt ở đây",
  VT_DOOR: "Cửa chính",
  VT_LEGEND_PLACE: "Nên đặt",
  VT_LEGEND_AVOID: "Nên tránh",
  VT_LEGEND_OTHER: "Được",
  VT_PLAN_TITLE: (room: string) => `Sơ đồ mặt bằng — ${room}`,
  VT_PLAN_HINT:
    "Chia nhà thành 9 ô từ tâm nhà, cửa chính ở cạnh dưới. Góc tô xanh là góc nên đặt, tô đỏ là góc nên tránh.",
  VT_SUMMARY_TITLE: "Tóm tắt bố trí cả nhà",
  VT_SUMMARY_COL: { room: "Phòng", place: "Nên đặt", face: "Quay về" },
  VT_DISCLAIMER:
    "Bố trí theo Bát trạch tính từ tâm nhà và cung mệnh gia chủ, mang tính tham khảo. Nhà thực tế cần ưu tiên công năng, ánh sáng, thông gió; không cần sửa nhà chỉ vì một góc chưa hợp.",
} as const;
