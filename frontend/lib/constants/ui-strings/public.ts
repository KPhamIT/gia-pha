/** Public marketing, legal, and contact pages. */
export type PublicLegalDocument = {
  title: string;
  subtitle: string;
  lastUpdated: string;
};

export const PUBLIC_STRINGS = {
  // Footer
  PUBLIC_FOOTER_NAV_LABEL: "Liên kết trang công khai",
  PUBLIC_FOOTER_TAGLINE: "Gìn giữ cội nguồn — kết nối con cháu",
  PUBLIC_FOOTER_HOME: "Trang chủ",
  PUBLIC_FOOTER_GUIDE: "Hướng dẫn",
  PUBLIC_FOOTER_BLOG: "Kiến thức gia phả",
  PUBLIC_FOOTER_ABOUT: "Giới thiệu",
  PUBLIC_FOOTER_CONTACT: "Liên hệ",
  PUBLIC_FOOTER_PRIVACY: "Chính sách bảo mật",
  PUBLIC_FOOTER_TERMS: "Điều khoản sử dụng",
  PUBLIC_FOOTER_BOOK: "Vào sổ gia phả",
  PUBLIC_FOOTER_COPYRIGHT: (year: number) =>
    `© ${year} Cội Nguồn — Gia phả điện tử. Mọi quyền được bảo lưu.`,

  // Landing
  LANDING_HERO_TITLE: "Gia phả điện tử cho gia đình và dòng họ",
  LANDING_HERO_TITLE_LINE1: "Gia phả điện tử",
  LANDING_HERO_TITLE_LINE2: "cho dòng họ",
  LANDING_HERO_SUBTITLE:
    "Tra cứu sổ gia phả, cây phả hệ, sự kiện và ngày giỗ — mọi lúc trên điện thoại, không cần cài app.",
  LANDING_NAV_HOME: "Trang chủ",
  LANDING_NAV_CLAN: "Gia tộc",
  LANDING_NAV_EVENTS: "Sự kiện",
  LANDING_NAV_CEREMONY: "Mẫu bài cúng",
  LANDING_NAV_LIBRARY: "Thư viện",
  LANDING_NAV_SERVICES: "Dịch vụ",
  LANDING_NAV_SEARCH_ARIA: "Tìm kiếm",
  LANDING_CTA_GUIDE: "Xem hướng dẫn",
  LANDING_CTA_INSTALL: "Hướng dẫn cài đặt ứng dụng",
  LANDING_CTA_BOOK: "Vào sổ gia phả",
  LANDING_CTA_LOGIN: "Đăng nhập",
  LANDING_TODAY_LUNAR_LABEL: "Âm lịch",
  LANDING_TODAY_PROVERB:
    "Cây có cội mới trổ cành xanh lá, Nước có nguồn mới bể cả sông sâu.",
  LANDING_TODAY_AUSPICIOUS_BADGE: "GIỜ HOÀNG ĐẠO",
  LANDING_TODAY_EVENTS_TITLE: "Sự kiện hôm nay",
  LANDING_TODAY_DEATH_LABEL: "Ngày giỗ",
  LANDING_TODAY_BIRTHDAY_LABEL: "Sinh nhật",
  LANDING_TODAY_DEATH_COUNTDOWN: (days: number) =>
    days === 0 ? "Hôm nay" : `Còn ${days} ngày`,
  LANDING_TODAY_BIRTHDAY_TODAY: "Hôm nay",
  LANDING_TODAY_UPDATED_AT: (time: string) => `Cập nhật lúc ${time}`,
  LANDING_TODAY_INFO_TITLE: "Thông tin dòng họ",
  LANDING_TODAY_INFO_LABEL: "Thành viên mới trong tháng",
  LANDING_TODAY_INFO_CTA: "Xem danh sách",
  LANDING_TODAY_DEMO_NOTE: "Ví dụ minh họa — đăng nhập để xem dòng họ của bạn",
  LANDING_TODAY_DEMO_DEATH_NAME: "Cụ Tổ đời thứ 4",
  LANDING_TODAY_DEMO_BIRTHDAY_NAME: "Minh Anh (Cháu)",
  LANDING_HOW_TITLE: "Bắt đầu trong 2 bước",
  LANDING_HOW_STEPS: [
    "Nhận liên kết từ ban quản trị / thư ký dòng họ qua Zalo, Facebook hoặc tin nhắn.",
    "Mở liên kết một lần — thiết bị sẽ nhớ dòng họ; lần sau chỉ cần vào website.",
  ],
  LANDING_START_TITLE: "Hai cách bắt đầu",
  LANDING_START_SUBTITLE: "Chọn phương thức phù hợp với hiện trạng dòng họ của bạn.",
  LANDING_START_HAS_LINK_TITLE: "Đã có liên kết dòng họ",
  LANDING_START_HAS_LINK_STEPS: [
    "Nhận liên kết từ ban quản trị / thư ký qua Zalo, Facebook hoặc tin nhắn.",
    "Mở liên kết một lần — thiết bị sẽ nhớ dòng họ; lần sau chỉ cần vào website.",
  ],
  LANDING_START_HAS_LINK_CTA: "Tham gia dòng họ",
  LANDING_START_HAS_LINK_INPUT_LABEL: "Dán liên kết dòng họ",
  LANDING_START_HAS_LINK_INVALID:
    "Liên kết không hợp lệ. Dán đường link đầy đủ dạng …/join/… do ban quản trị gửi.",
  LANDING_START_NEW_ORG_TITLE: "Trưởng họ / chưa có liên kết",
  LANDING_START_NEW_ORG_STEPS: [
    "Đăng ký tên dòng họ — bạn trở thành quản trị viên và chia sẻ liên kết cho con cháu.",
  ],
  LANDING_START_NEW_ORG_CTA: "Đăng ký dòng họ mới",
  LANDING_FEATURES_TITLE: "Chức năng chính ✨",
  LANDING_FEATURE_BOOK_TITLE: "Sổ gia phả",
  LANDING_FEATURE_BOOK_DESC:
    "Đọc như sách điện tử, lật trang, tìm tên, in từng trang hoặc cả cuốn sổ.",
  LANDING_FEATURE_TREE_TITLE: "Cây gia phả",
  LANDING_FEATURE_TREE_DESC:
    "Sơ đồ quan hệ trực quan theo nhánh và đời — phù hợp nghiên cứu phả hệ.",
  LANDING_FEATURE_EVENTS_TITLE: "Sự kiện & công đức",
  LANDING_FEATURE_EVENTS_DESC:
    "Theo dõi họp họ, đóng góp, sổ công đức minh bạch cho cả dòng họ.",
  LANDING_FEATURE_CEREMONY_TITLE: "Bài cúng và mẫu bài cúng",
  LANDING_FEATURE_CEREMONY_DESC:
    "Dòng họ trả phí được kho ~20 mẫu bài cúng soạn sẵn để dùng ngay; tài khoản miễn phí tự tạo và chỉnh sửa mẫu riêng.",
  LANDING_FEATURE_NOTIF_TITLE: "Thông báo ngày giỗ",
  LANDING_FEATURE_NOTIF_DESC:
    "Nhắc ngày giỗ âm lịch trên điện thoại — bật một lần, không bỏ lỡ giỗ tổ và người thân.",
  LANDING_FEATURE_CEREMONY_PRINT_TITLE: "In bài cúng",
  LANDING_FEATURE_CEREMONY_PRINT_DESC:
    "Chọn người trong dòng họ, mở bài cúng ngày giỗ và in hoặc chia sẻ cho gia đình.",
  LANDING_FEATURE_CEREMONY_CUSTOM_TITLE: "Cá nhân hóa bài cúng",
  LANDING_FEATURE_CEREMONY_CUSTOM_DESC:
    "Tự soạn và chỉnh mẫu bài cúng theo dòng họ, từng người hoặc tập thể — nhúng tên, địa danh, ngày giỗ bằng biến thay thế.",
  LANDING_FEATURE_EXPORT_TITLE: "In gia phả nhiều kiểu",
  LANDING_FEATURE_EXPORT_DESC:
    "Xuất cây phả hệ với khung, cổng, câu đối và màu sắc — nhiều phong cách để in hoặc tải về.",
  LANDING_DEMO_BUTTON: "Xem thử",
  LANDING_DEMO_HINT:
    "👀 Đăng nhập sẵn tài khoản demo (chỉ xem) để trải nghiệm dữ liệu mẫu.",
  LANDING_DEMO_UNAVAILABLE: "Bản demo chưa sẵn sàng. Vui lòng thử lại sau.",
  LANDING_WHY_TITLE: "Vì sao cần gia phả điện tử? 💡",
  LANDING_WHY_ITEMS: [
    "😮‍💨 Bận công việc, bận bao nhiêu chuyện cần xử lý — dễ quên ngày cúng gia đình.",
    "🔔 Nhắc ngày giỗ âm lịch qua thông báo điện thoại — đến ngày không còn quên.",
    "📅 Liệt kê ngày giỗ sắp tới để chủ động chuẩn bị.",
    "📝 Soạn sẵn mẫu bài cúng — mở ra in 🖨️.",
    "✨ Mọi thứ đã sẵn sàng — tuyệt vời phải không?",
  ],
  LANDING_AUDIENCE_TITLE: "Dành cho ai? 💛",
  LANDING_AUDIENCE_ITEMS: [
    "📱 Con cháu xa quê — tra cứu nguồn gốc, họ hàng mọi lúc trên điện thoại.",
    "🔔 Người bận rộn — nhận thông báo trước ngày giỗ, có sẵn mẫu bài cúng đúng tên người mất; đến ngày in là xong 🎉",
    "👥 Ban quản trị dòng họ — lưu trữ và cập nhật thông tin tập trung, chia sẻ cho cả họ.",
    "📋 Thư ký dòng họ mong muốn — quản lý sự kiện, đóng góp, thu chi, in ấn giỗ tổ cho dòng họ.",
  ],
  LANDING_SERVICES_CTA: "Liên hệ tư vấn",
  LANDING_LEGAL_HINT:
    "Bằng việc sử dụng dịch vụ, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật.",
  LANDING_STATS_ITEMS: [
    { value: "10,000+", label: "Dòng họ tham gia" },
    { value: "500k+", label: "Thành viên ghi danh" },
    { value: "100%", label: "Bảo mật dữ liệu" },
    { value: "Vĩnh viễn", label: "Lưu trữ truyền đời" },
  ],
  LANDING_BENTO_TREE_TITLE: "Phả đồ tương tác thông minh",
  LANDING_BENTO_TREE_DESC:
    "Dễ theo dõi nhiều thế hệ, xem nhanh nhánh họ và quan hệ trong cùng một màn hình.",
  LANDING_BENTO_REMINDER_TITLE: "Thông báo kỵ nhật",
  LANDING_BENTO_REMINDER_DESC:
    "Nhắc ngày giỗ tự động theo âm lịch, không bỏ lỡ ngày quan trọng của dòng tộc.",
  LANDING_BENTO_MORE: "Tìm hiểu thêm",
  LANDING_BENTO_SECURITY_TITLE: "Bảo mật tuyệt đối",
  LANDING_BENTO_SECURITY_DESC:
    "Dữ liệu gia phả là tài sản vô giá. Hệ thống phân quyền rõ ràng cho từng tổ chức.",
  LANDING_BENTO_SECURITY_BADGE: "Đạt chuẩn",
  LANDING_BENTO_ARCHIVE_TITLE: "Lưu trữ số hóa tài liệu cổ",
  LANDING_BENTO_ARCHIVE_DESC:
    "Số hóa tư liệu gia phả, lưu giữ lâu dài và dễ dàng tra cứu cho con cháu đời sau.",
  LANDING_DEMO_NOTICE_BADGE: "Dữ liệu mẫu",
  LANDING_DEMO_NOTICE_TITLE:
    "Bạn đang xem gia phả minh họa — hãy tạo dòng họ thật của mình",
  LANDING_DEMO_NOTICE_BODY:
    "Mọi thông tin trên trang hiện tại chỉ là dữ liệu mẫu để bạn trải nghiệm. Đăng ký dòng họ mới để nhập người thân, ngày giỗ và sự kiện theo đúng gia đình bạn — riêng tư, đầy đủ, sẵn sàng truyền lại cho con cháu.",
  LANDING_DEMO_NOTICE_CTA: "Tạo dòng họ của tôi ngay",
  LANDING_FINAL_CTA_TITLE: "Chỉ vài phút để dòng họ có chỗ đứng trên Cội Nguồn",
  LANDING_FINAL_CTA_BODY:
    "\"Cây có gốc mới nở cành xanh ngọn, nước có nguồn mới bể rộng sông sâu.\" Đừng để lịch sử gia đình chỉ còn trong trí nhớ — tạo dòng họ hôm nay để lưu giữ, kết nối và gìn giữ cội nguồn cho nhiều đời sau.",
  LANDING_FINAL_CTA_CREATE: "Đăng ký dòng họ mới",
  LANDING_FOOTER_ABOUT:
    "Nền tảng công nghệ giúp lưu giữ gia phả, kết nối con cháu và bảo tồn giá trị cội nguồn cho nhiều thế hệ.",
  LANDING_FOOTER_DISCOVER_TITLE: "Khám phá",
  LANDING_FOOTER_SUPPORT_TITLE: "Hỗ trợ",
  LANDING_FOOTER_CONTACT_TITLE: "Liên hệ",
  LANDING_FOOTER_NEWS: "Tin tức",
  LANDING_FOOTER_CONTACT_EMAIL: "phamvankhanhvmm@gmail.com",
  LANDING_FOOTER_CONTACT_PHONE: "0975 925 223",
  LANDING_FOOTER_CONTACT_ADDRESS: "Nghệ An, Việt Nam",

  // About page (design-based)
  ABOUT_PAGE_META_TITLE: "Về Cội Nguồn - Gìn giữ giá trị trăm năm",
  ABOUT_PAGE_META_DESC:
    "Hành trình số hóa gia phả và kết nối các thế hệ người Việt.",
  ABOUT_PAGE_KEYWORDS: ["giới thiệu", "gia phả điện tử", "dòng họ"],
  ABOUT_PAGE_HERO_TITLE: "Về Cội Nguồn - Gìn giữ giá trị trăm năm",
  ABOUT_PAGE_HERO_QUOTE:
    "\"Cội Nguồn sinh ra từ khát vọng kết nối quá khứ với tương lai, biến những trang gia phả phủ bụi thời gian thành di sản số trường tồn cho muôn đời con cháu.\"",
  ABOUT_PAGE_HERO_CTA: "Khám phá hành trình",
  ABOUT_PAGE_STORY_BADGE: "Hành trình của chúng tôi",
  ABOUT_PAGE_STORY_TITLE: "Số hóa niềm tự hào dân tộc",
  ABOUT_PAGE_STORY_PARAGRAPHS: [
    "Câu chuyện của Cội Nguồn bắt đầu từ những trăn trở về việc các dòng tộc Việt Nam đang dần mất đi sự kết nối khi thế hệ trẻ rời xa quê hương.",
    "Chúng tôi xây dựng một \"Đền thờ số\" - nơi mỗi người Việt có thể tìm thấy gốc gác, lưu giữ ký ức và kết nối với anh em họ hàng dù ở bất cứ đâu trên thế giới.",
  ],
  ABOUT_PAGE_VALUES_TITLE: "Giá trị cốt lõi",
  ABOUT_PAGE_VALUES: [
    {
      title: "Bảo tồn",
      desc: "Cam kết lưu giữ chính xác và bảo mật tuyệt đối các tư liệu lịch sử dòng họ, từ hình ảnh, video đến những câu chuyện truyền miệng từ đời này sang đời khác.",
    },
    {
      title: "Kết nối",
      desc: "Xóa nhòa khoảng cách địa lý và thế hệ, tạo ra không gian tương tác ấm cúng để các thành viên trong gia tộc tìm thấy nhau và thắt chặt tình thân.",
    },
    {
      title: "Hiện đại",
      desc: "Ứng dụng công nghệ để tái hiện cây gia phả trực quan, dễ tiếp cận cho cả người lớn tuổi và thế hệ trẻ.",
    },
  ],
  ABOUT_PAGE_VISION_TITLE: "Tầm nhìn chiến lược",
  ABOUT_PAGE_VISION_DESC:
    "Cội Nguồn hướng tới mục tiêu trở thành trung tâm lưu trữ phả hệ số lớn nhất Việt Nam và xây dựng hệ sinh thái văn hóa cho dòng họ.",
  ABOUT_PAGE_VISION_BULLETS: [
    "1 triệu gia tộc được số hóa vào năm 2030",
    "Ứng dụng AI phục dựng ảnh chân dung tổ tiên",
    "Xây dựng bản đồ di cư của người Việt toàn cầu",
  ],
  ABOUT_PAGE_CTA_TITLE: "Bạn đã sẵn sàng viết tiếp câu chuyện của dòng họ mình?",
  ABOUT_PAGE_CTA_DESC:
    "Mọi hành trình vạn dặm đều bắt đầu từ một bước chân. Hãy để Cội Nguồn cùng bạn chăm sóc rễ cây gia tộc hôm nay.",

  // Contact
  CONTACT_PAGE_TITLE: "Liên hệ",
  CONTACT_PAGE_SUBTITLE: "Hỗ trợ tra cứu gia phả và tài khoản",
  CONTACT_PAGE_HERO_TITLE: "Liên hệ với chúng tôi",
  CONTACT_PAGE_HERO_DESC:
    "Chúng tôi luôn sẵn lòng lắng nghe và hỗ trợ bạn trên hành trình tìm lại cội nguồn, gìn giữ những giá trị văn hóa và tình cảm thiêng liêng của gia đình qua các thế hệ.",
  CONTACT_PAGE_INTRO:
    "Nếu bạn chưa có liên kết dòng họ hoặc cần quyền chỉnh sửa, vui lòng liên hệ ban quản trị / người phụ trách gia phả của dòng họ bạn.",
  CONTACT_PAGE_EMPTY:
    "Chưa cấu hình thông tin liên hệ công khai. Ban quản trị website vui lòng thiết lập biến môi trường NEXT_PUBLIC_CONTACT_*.",
  CONTACT_PAGE_BACK: "Quay lại trang chủ",
  CONTACT_CARD_ADDRESS_TITLE: "Trụ sở chính",
  CONTACT_CARD_PHONE_TITLE: "Điện thoại",
  CONTACT_CARD_PHONE_NOTE: "Tổng đài hỗ trợ 24/7",
  CONTACT_CARD_EMAIL_TITLE: "Email",
  CONTACT_CARD_HOURS_TITLE: "Giờ làm việc",
  CONTACT_CARD_HOURS_WEEKDAY_LABEL: "Thứ 2 - Thứ 6:",
  CONTACT_CARD_HOURS_WEEKDAY: "08:00 - 18:00",
  CONTACT_CARD_HOURS_SAT_LABEL: "Thứ 7:",
  CONTACT_CARD_HOURS_SAT: "08:30 - 12:00",
  CONTACT_CARD_HOURS_SUN_LABEL: "Chủ nhật:",
  CONTACT_CARD_HOURS_SUN: "Nghỉ",
  CONTACT_FORM_TITLE: "Gửi tin nhắn cho chúng tôi",
  CONTACT_FORM_NAME: "Họ và tên",
  CONTACT_FORM_NAME_PLACEHOLDER: "Nguyễn Văn A",
  CONTACT_FORM_EMAIL: "Email",
  CONTACT_FORM_EMAIL_PLACEHOLDER: "example@gmail.com",
  CONTACT_FORM_PHONE: "Số điện thoại",
  CONTACT_FORM_PHONE_PLACEHOLDER: "0123 456 789",
  CONTACT_FORM_SUBJECT: "Chủ đề",
  CONTACT_FORM_SUBJECT_OPTIONS: [
    "Hỗ trợ kỹ thuật",
    "Dịch vụ gia tộc",
    "Sự kiện & Triển lãm",
    "Hợp tác & Quảng cáo",
    "Khác",
  ] as const,
  CONTACT_FORM_MESSAGE: "Lời nhắn",
  CONTACT_FORM_MESSAGE_PLACEHOLDER: "Viết tin nhắn của bạn tại đây...",
  CONTACT_FORM_SUBMIT: "Gửi lời nhắn",
  CONTACT_FORM_EMAIL_REQUIRED: "Vui lòng nhập email để chúng tôi phản hồi.",
  CONTACT_FORM_MESSAGE_REQUIRED: "Vui lòng nhập lời nhắn (ít nhất 10 ký tự).",
  CONTACT_FORM_SENDING: "Đang gửi…",
  CONTACT_FORM_SUCCESS: "Đã gửi tin nhắn. Chúng tôi sẽ phản hồi sớm nhất có thể.",
  CONTACT_FORM_ERROR: "Không gửi được tin nhắn. Vui lòng thử lại sau.",
  CONTACT_MAP_OFFICE: "Văn phòng Cội Nguồn",
  CONTACT_FAQ_TITLE: "Câu hỏi thường gặp",
  CONTACT_FAQ_ITEMS: [
    {
      question: "Tôi có thể tự cập nhật cây phả hệ của mình không?",
      answer:
        "Có, hệ thống của chúng tôi được thiết kế để các thành viên trong gia tộc có thể cùng nhau đóng góp và cập nhật thông tin một cách dễ dàng và bảo mật nhất.",
    },
    {
      question: "Dịch vụ số hóa gia phả mất bao lâu để hoàn thành?",
      answer:
        "Thời gian hoàn thành phụ thuộc vào khối lượng tài liệu và độ phức tạp của thông tin. Thông thường, một bộ gia phả tiêu chuẩn sẽ mất từ 2-4 tuần để số hóa hoàn thiện.",
    },
    {
      question: "Thông tin gia đình tôi có được bảo mật không?",
      answer:
        "Bảo mật là ưu tiên hàng đầu của chúng tôi. Dữ liệu của bạn được mã hóa và bạn có toàn quyền kiểm soát ai có thể xem hoặc chỉnh sửa thông tin gia tộc của mình.",
    },
  ] as const,

  PUBLIC_LAST_UPDATED: (date: string) => `Cập nhật lần cuối: ${date}`,
} as const;

export const PRIVACY_DOCUMENT: PublicLegalDocument = {
  title: "Chính sách bảo mật",
  subtitle: "Cam kết bảo vệ thông tin người dùng và dữ liệu gia phả",
  lastUpdated: "18/06/2025",
};

export const TERMS_DOCUMENT: PublicLegalDocument = {
  title: "Điều khoản sử dụng",
  subtitle: "Quy định khi truy cập và sử dụng nền tảng gia phả",
  lastUpdated: "18/06/2025",
};
