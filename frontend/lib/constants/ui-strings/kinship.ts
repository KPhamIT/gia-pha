/** Công cụ tính cách xưng hô họ hàng (/xung-ho). */
export const KINSHIP_STRINGS = {
  KIN_NAV: "Xưng hô họ hàng",
  KIN_TITLE: "Cách xưng hô trong họ hàng — công cụ tính nhanh",
  KIN_META_DESC:
    "Bấm lần lượt Bố, Mẹ, Anh, Chị, Em… để biết gọi người thân là bác, chú, cô, dì, cậu, mợ hay thím — và người đó xưng gì với bạn. Có cách gọi miền Bắc, Trung, Nam.",
  KIN_LEAD:
    "Không nhớ gọi vợ của em trai bố là gì? Bấm lần lượt từng mối quan hệ, công cụ cho biết bạn gọi người đó là gì và người đó xưng gì với bạn — theo cách gọi miền Bắc, Trung hoặc Nam.",
  KIN_YOU: "Bạn",
  KIN_YOU_ARE: "Bạn là",
  KIN_MALE: "Nam",
  KIN_FEMALE: "Nữ",
  KIN_REGION: "Cách gọi",
  KIN_REGIONS: { bac: "Miền Bắc", trung: "Miền Trung", nam: "Miền Nam" },
  KIN_PICK: (who: string) => `${who} — chọn người tiếp theo:`,
  KIN_PICK_FIRST: "Người thân của bạn là ai? Bấm để bắt đầu:",
  KIN_STEPS: {
    f: "Bố",
    m: "Mẹ",
    h: "Chồng",
    w: "Vợ",
    ob: "Anh trai",
    yb: "Em trai",
    os: "Chị gái",
    ys: "Em gái",
    s: "Con trai",
    d: "Con gái",
  },
  KIN_OF: "của",
  KIN_BACK: "Quay lại",
  KIN_RESET: "Làm lại",
  KIN_MAX_STEPS: "Tối đa 4 bước — quan hệ xa hơn thường gọi theo vai của người gần nhất.",
  KIN_RESULT_IS: "Người đó là",
  KIN_RESULT_OF_YOU: "của bạn",
  KIN_RESULT_CALL: "Bạn gọi",
  KIN_RESULT_SELF: "và xưng",
  KIN_RESULT_THEY_CALL: (rel: string) => `Bạn là ${rel} của người đó.`,
  KIN_NOT_FOUND:
    "Quan hệ này chưa có trong bảng. Với họ hàng xa, người Việt thường gọi theo vai của người nối gần nhất (vd. gọi theo cách gọi bố mẹ của họ) — hoặc thêm chữ “ông/bà” cho bậc trên hai đời.",
  KIN_EXAMPLES: "Thử nhanh",
  KIN_EXAMPLE_LIST: [
    { label: "Vợ của em trai bố", steps: ["f", "yb", "w"] },
    { label: "Em gái của mẹ", steps: ["m", "ys"] },
    { label: "Con trai của anh trai bố", steps: ["f", "ob", "s"] },
    { label: "Chồng của em gái bố", steps: ["f", "ys", "h"] },
    { label: "Mẹ của chồng", steps: ["h", "m"] },
    { label: "Em trai của bà nội", steps: ["f", "m", "yb"] },
  ],
  KIN_CTA_TITLE: "Tự tính xưng hô cho cả dòng họ",
  KIN_CTA_BODY:
    "Tạo cây gia phả trên Cội Nguồn: thêm thành viên một lần, cả họ cùng xem quan hệ, ngày giỗ và in sổ gia phả.",
  KIN_CTA_BUTTON: "Tạo cây gia phả",
  KIN_GUIDE_TITLE: "Nguyên tắc xưng hô trong họ hàng người Việt",
  KIN_GUIDE: [
    {
      title: "Gọi theo vai, không theo tuổi",
      body: "Con của anh/chị bố mẹ là anh/chị họ của bạn, dù ít tuổi hơn; con của em bố mẹ là em họ, dù nhiều tuổi hơn.",
    },
    {
      title: "Bên nội và bên ngoại khác nhau",
      body: "Anh của bố là bác, em trai của bố là chú; anh/em trai của mẹ là cậu (miền Bắc gọi anh của mẹ là bác), chị/em gái của mẹ là dì.",
    },
    {
      title: "Miền Bắc, Trung, Nam gọi khác nhau",
      body: "Chị gái của bố: Bắc gọi bác, Nam gọi cô, Trung gọi o. Chồng của cô, dì: Bắc gọi chú, Trung và Nam gọi dượng.",
    },
    {
      title: "Người lấy vào họ gọi theo vợ/chồng",
      body: "Vợ của chú là thím, vợ của cậu là mợ, vợ của bác là bác gái. Con dâu, con rể gọi bố mẹ chồng/vợ như con ruột.",
    },
  ],
  KIN_FAQ_TITLE: "Câu hỏi thường gặp",
  KIN_FAQ: [
    {
      question: "Vợ của em trai bố gọi là gì?",
      answer: "Gọi là thím (cả ba miền). Thím xưng “thím” và gọi bạn là cháu.",
    },
    {
      question: "Chồng của em gái bố gọi là gì?",
      answer: "Miền Bắc gọi là chú, miền Trung và miền Nam gọi là dượng.",
    },
    {
      question: "Con của bác ít tuổi hơn mình thì gọi là gì?",
      answer:
        "Vẫn gọi là anh/chị họ vì người Việt xưng hô theo vai: bác là anh/chị của bố mẹ mình, nên con bác ở vai trên.",
    },
    {
      question: "Anh trai của mẹ gọi là bác hay cậu?",
      answer: "Miền Bắc thường gọi anh trai của mẹ là bác, em trai của mẹ là cậu; miền Trung và Nam gọi chung là cậu.",
    },
  ],
} as const;
