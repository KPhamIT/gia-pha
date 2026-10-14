/** Tab Xem ngày cưới hỏi (/cong-cu/xem-ngay-cuoi). */
type MonthKindKey =
  | "dai-loi"
  | "tieu-loi"
  | "ong-co"
  | "phu-mau"
  | "phu-chu"
  | "nu-than";
type ChuDuongKey =
  | "phu"
  | "co"
  | "duong"
  | "ong"
  | "de"
  | "tao"
  | "phu-dau"
  | "tru";

const MONTH_KIND: Record<MonthKindKey, { name: string; meaning: string }> = {
  "dai-loi": {
    name: "Đại lợi",
    meaning: "tháng tốt nhất để cưới, lợi cho cả hai họ và đường con cái.",
  },
  "tieu-loi": {
    name: "Tiểu lợi",
    meaning:
      "dùng được khi không chọn được tháng đại lợi (chỉ kỵ người mai mối).",
  },
  "ong-co": {
    name: "Phòng ông cô",
    meaning: "kỵ bố mẹ chồng.",
  },
  "phu-mau": {
    name: "Phòng phụ mẫu",
    meaning: "kỵ bố mẹ cô dâu.",
  },
  "phu-chu": {
    name: "Phòng phu chủ",
    meaning: "kỵ chú rể — không nên cưới.",
  },
  "nu-than": {
    name: "Phòng nữ thân",
    meaning: "kỵ chính cô dâu — không nên cưới.",
  },
};

const CHU_DUONG: Record<ChuDuongKey, string> = {
  phu: "Phu (chồng)",
  co: "Cô (mẹ chồng)",
  duong: "Đường (nhà chính)",
  ong: "Ông (bố chồng)",
  de: "Đệ (cổng nhà)",
  tao: "Táo (bếp)",
  "phu-dau": "Phụ (cô dâu)",
  tru: "Trù (gian bếp)",
};

export const XEM_NGAY_CUOI_STRINGS = {
  XC_TITLE: "Xem ngày cưới hỏi",
  XC_META_DESC:
    "Xem ngày cưới hỏi theo tuổi cô dâu chú rể: Kim Lâu, tháng đại lợi, Chu đường giá thú, ngày hoàng đạo, tránh Sát chủ, Thụ tử, Tam Nương, Nguyệt Kỵ, Không phòng, ngày xung tuổi; kèm giờ đón dâu.",
  XC_LEAD:
    "Nhập năm sinh cô dâu, chú rể — lịch tô màu ngày cưới tốt xấu theo 10 tiêu chí, lấy tuổi cô dâu làm gốc; bấm vào một ngày để xem lý do và giờ đón dâu.",
  XC_BRIDE_YEAR: "Năm sinh cô dâu (âm lịch)",
  XC_GROOM_YEAR: "Năm sinh chú rể (âm lịch)",
  XC_IN_LAWS: "Còn bố mẹ chồng",
  XC_IN_LAWS_HINT:
    "Bỏ chọn nếu bố mẹ chồng đã mất — khi đó tháng phòng ông cô và ngày Ông, Cô của Chu đường dùng được.",

  XC_MONTH_KIND: MONTH_KIND,
  XC_KIM_LAU_BANNER: (year: number, age: number) =>
    `Năm ${year} cô dâu ${age} tuổi mụ, phạm Kim Lâu — theo lệ không cưới trong năm này. Các ngày trên lịch đều bị xếp xấu; xem bảng năm bên trên để chọn năm khác.`,

  XC_CHECK_KIM_LAU: "Kim Lâu cô dâu",
  XC_KIM_LAU: {
    khong: "",
    than: "Kim Lâu Thân — hại bản thân cô dâu.",
    the: "Kim Lâu Thê — hại người chồng, hôn nhân.",
    tu: "Kim Lâu Tử — hại đường con cái.",
    "luc-suc": "Kim Lâu Lục Súc — hại gia súc, kinh tế gia đình.",
  },
  XC_KIM_LAU_OK: (age: number) =>
    `Cô dâu ${age} tuổi mụ (${age} chia 9 dư ${age % 9}) — không phạm Kim Lâu.`,
  XC_KIM_LAU_BAD: (age: number, kind: string) =>
    `Cô dâu ${age} tuổi mụ (${age} chia 9 dư ${age % 9}) — ${kind} Không nên cưới năm này.`,

  XC_CHECK_THANG: "Tháng theo tuổi cô dâu",
  XC_MONTH_SUMMARY: (month: number, kind: MonthKindKey, inLaws: boolean) =>
    `Tháng ${month} âm là tháng ${MONTH_KIND[kind].name}: ${MONTH_KIND[kind].meaning}${
      kind === "ong-co" && !inLaws ? " Bố mẹ chồng đã mất nên dùng được." : ""
    }`,

  XC_CHECK_CHU_DUONG: "Chu đường giá thú",
  XC_CHU_DUONG: (cung: ChuDuongKey, big: boolean, inLaws: boolean) => {
    const where = `Tháng ${big ? "đủ (đếm thuận từ Phu)" : "thiếu (đếm nghịch từ Phụ)"}, ngày rơi vào cung ${CHU_DUONG[cung]}`;
    if (cung === "phu" || cung === "phu-dau")
      return `${where} — kỵ ${cung === "phu" ? "chú rể" : "cô dâu"}, không nên cưới.`;
    if (cung === "ong" || cung === "co")
      return inLaws
        ? `${where} — kỵ ${cung === "ong" ? "bố chồng" : "mẹ chồng"}; nếu buộc phải dùng thì người này nên tránh mặt lúc đón dâu.`
        : `${where} — bố mẹ chồng đã mất nên dùng được.`;
    return `${where} — ngày tốt cho cưới gả.`;
  },

  XC_CHECK_BACH_KY: "Sát chủ, Thụ tử",
  XC_SAT_CHU: "Phạm Sát chủ — ngày trăm việc đều kỵ.",
  XC_THU_TU: "Phạm Thụ tử — ngày rất xấu, kỵ mọi việc lớn.",
  XC_BACH_KY_NONE: "Không phạm Sát chủ, Thụ tử.",

  XC_CHECK_KHONG_PHONG: "Không phòng",
  XC_KHONG_PHONG_BAD: (chi: string) =>
    `Ngày ${chi} phạm Không phòng của mùa này — kỵ cưới gả (“phòng không”), nên tránh nếu chọn được ngày khác. Lễ ăn hỏi không kiêng.`,
  XC_KHONG_PHONG_NONE: "Không phạm Không phòng.",

  XC_CHECK_XUNG: "Xung tuổi cô dâu, chú rể",
  XC_BRIDE: (chi: string) => `cô dâu tuổi ${chi}`,
  XC_GROOM: (chi: string) => `chú rể tuổi ${chi}`,
  XC_XUNG: (day: string, who: string[]) =>
    `Ngày ${day} lục xung với ${who.join(" và ")} — không nên cưới.`,
  XC_XUNG_NONE: "Không xung tuổi cô dâu, chú rể.",

  XC_CHECK_HOP: "Hợp tuổi",
  XC_LUC_HOP: "lục hợp",
  XC_TAM_HOP: "tam hợp",
  XC_HOP: (day: string, who: string[]) =>
    `Ngày ${day} hợp với ${who.join(", ")} — thêm phần tốt.`,
  XC_HOP_NONE: "Không lục hợp, tam hợp với tuổi hai bạn — bình thường.",

  XC_GOOD_DAYS: (count: number) =>
    `${count} ngày tốt để cưới trong tháng`,
  XC_GOOD_DAYS_NONE:
    "Tháng này không có ngày tốt hẳn để cưới — xem ngày khá, hoặc sang tháng đại lợi của cô dâu.",
  XC_HOURS_NOTE:
    "Giờ hoàng đạo đã bỏ những giờ xung tuổi cô dâu, chú rể — dùng để làm lễ gia tiên, đón dâu, đưa dâu về nhà chồng.",
  XC_DISCLAIMER:
    "Lịch âm tính theo múi giờ Việt Nam (UTC+7); năm sinh nhập theo âm lịch (sinh trước Tết thì chọn năm trước). Các bảng tra theo sách lịch cổ và phong tục phổ biến, mỗi vùng có thể khác — mang tính tham khảo, nên kết hợp ý kiến gia đình.",

} as const;
