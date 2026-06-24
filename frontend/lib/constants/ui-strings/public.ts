/** Public marketing, legal, and contact pages. */
export type PublicProseSection = {
  title: string;
  paragraphs: readonly string[];
};

export type PublicProseDocument = {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: readonly PublicProseSection[];
};

export const PUBLIC_STRINGS = {
  // Footer
  PUBLIC_FOOTER_NAV_LABEL: "Liên kết trang công khai",
  PUBLIC_FOOTER_TAGLINE: "Gìn giữ cội nguồn — kết nối con cháu",
  PUBLIC_FOOTER_HOME: "Trang chủ",
  PUBLIC_FOOTER_GUIDE: "Hướng dẫn",
  PUBLIC_FOOTER_ABOUT: "Giới thiệu",
  PUBLIC_FOOTER_CONTACT: "Liên hệ",
  PUBLIC_FOOTER_PRIVACY: "Chính sách bảo mật",
  PUBLIC_FOOTER_TERMS: "Điều khoản sử dụng",
  PUBLIC_FOOTER_BOOK: "Vào sổ gia phả",
  PUBLIC_FOOTER_COPYRIGHT: (year: number) =>
    `© ${year} Gia phả điện tử. Mọi quyền được bảo lưu.`,

  // Landing
  LANDING_HERO_TITLE: "Gia phả điện tử cho dòng họ",
  LANDING_HERO_SUBTITLE:
    "Tra cứu sổ gia phả, cây phả hệ, sự kiện và ngày giỗ — mọi lúc trên điện thoại, không cần cài app.",
  LANDING_CTA_GUIDE: "Xem hướng dẫn",
  LANDING_CTA_BOOK: "Vào sổ gia phả",
  LANDING_CTA_LOGIN: "Đăng nhập",
  LANDING_HOW_TITLE: "Bắt đầu trong 2 bước",
  LANDING_HOW_STEPS: [
    "Nhận liên kết từ ban quản trị / thư ký dòng họ qua Zalo, Facebook hoặc tin nhắn.",
    "Mở liên kết một lần — thiết bị sẽ nhớ dòng họ; lần sau chỉ cần vào website.",
  ],
  LANDING_START_TITLE: "Hai cách bắt đầu",
  LANDING_START_HAS_LINK_TITLE: "Đã có liên kết dòng họ",
  LANDING_START_HAS_LINK_STEPS: [
    "Nhận liên kết từ ban quản trị / thư ký qua Zalo, Facebook hoặc tin nhắn.",
    "Mở liên kết một lần — thiết bị sẽ nhớ dòng họ; lần sau chỉ cần vào website.",
  ],
  LANDING_START_HAS_LINK_CTA: "Tham gia dòng họ",
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
    "Xuất cây phả hệ với khung, cổng, câu đối và màu sắc — nhiều preset phong cách để in hoặc tải về.",
  LANDING_DEMO_BUTTON: "Xem thử",
  LANDING_DEMO_HINT:
    "👀 Đăng nhập sẵn tài khoản demo (chỉ xem) để trải nghiệm dữ liệu mẫu.",
  LANDING_DEMO_UNAVAILABLE: "Bản demo chưa sẵn sàng. Vui lòng thử lại sau.",
  LANDING_AUDIENCE_TITLE: "Dành cho ai? 💛",
  LANDING_AUDIENCE_INTRO:
    "😮‍💨 Bận công việc, bận bao nhiêu chuyện cần xử lý — dễ quên ngày cúng gia đình. Gia phả điện tử 🔔 nhắc giỗ âm lịch qua thông báo điện thoại, 📅 liệt kê ngày giỗ sắp tới, và 📝 soạn sẵn mẫu bài cúng; đến ngày chỉ cần mở ra in 🖨️, không còn loay hoay tìm chỗ này chỗ khác chép lại. ✨ Wow — đúng ngày là xong, tuyệt vời phải không?",
  LANDING_AUDIENCE_ITEMS: [
    "📱 Con cháu xa quê — tra cứu nguồn gốc, họ hàng mọi lúc trên điện thoại.",
    "🔔 Người bận rộn — nhận thông báo trước ngày giỗ, có sẵn mẫu bài cúng đúng tên người thân; đến ngày in là xong 🎉",
    "👥 Ban quản trị dòng họ — lưu trữ và cập nhật thông tin tập trung, chia sẻ cho cả họ.",
    "📋 Thư ký họ đòi — quản lý sự kiện, đóng góp, in ấn giỗ tổ cho dòng họ.",
  ],
  LANDING_LEGAL_HINT:
    "Bằng việc sử dụng dịch vụ, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật.",

  // Contact
  CONTACT_PAGE_TITLE: "Liên hệ",
  CONTACT_PAGE_SUBTITLE: "Hỗ trợ tra cứu gia phả và tài khoản",
  CONTACT_PAGE_INTRO:
    "Nếu bạn chưa có liên kết dòng họ hoặc cần quyền chỉnh sửa, vui lòng liên hệ ban quản trị / người phụ trách gia phả của dòng họ bạn.",
  CONTACT_PAGE_EMPTY:
    "Chưa cấu hình thông tin liên hệ công khai. Ban quản trị website vui lòng thiết lập biến môi trường NEXT_PUBLIC_CONTACT_*.",
  CONTACT_PAGE_BACK: "Quay lại trang chủ",

  PUBLIC_LAST_UPDATED: (date: string) => `Cập nhật lần cuối: ${date}`,
} as const;

export const ABOUT_DOCUMENT: PublicProseDocument = {
  title: "Giới thiệu",
  subtitle: "Nền tảng gia phả điện tử cho dòng họ Việt Nam",
  lastUpdated: "18/06/2025",
  sections: [
    {
      title: "Sứ mệnh",
      paragraphs: [
        "Chúng tôi xây dựng công cụ giúp các dòng họ Việt Nam lưu giữ, tra cứu và truyền lại thông tin tổ tiên cho con cháu — qua sổ gia phả, cây phả hệ và các hoạt động dòng họ.",
        "Mục tiêu là ai cũng có thể xem được trên điện thoại, kể cả người lớn tuổi, mà không cần cài ứng dụng phức tạp.",
      ],
    },
    {
      title: "Ai vận hành dữ liệu?",
      paragraphs: [
        "Mỗi dòng họ có không gian riêng (tổ chức). Ban quản trị dòng họ chịu trách nhiệm nội dung: thành viên, tiểu sử, sự kiện, liên kết chia sẻ.",
        "Nền tảng cung cấp phần mềm và bảo mật truy cập theo liên kết — không hiển thị lẫn dữ liệu giữa các dòng họ.",
      ],
    },
    {
      title: "Quyền xem và quyền sửa",
      paragraphs: [
        "Thành viên mở liên kết dòng họ có thể xem sổ và cây theo mặc định.",
        "Chỉnh sửa, quản lý user và cấu hình nâng cao dành cho tài khoản quản trị được cấp quyền.",
      ],
    },
  ],
};

export const PRIVACY_DOCUMENT: PublicProseDocument = {
  title: "Chính sách bảo mật",
  subtitle: "Cam kết bảo vệ thông tin người dùng và dữ liệu gia phả",
  lastUpdated: "18/06/2025",
  sections: [
    {
      title: "1. Phạm vi áp dụng",
      paragraphs: [
        "Chính sách này mô tả cách chúng tôi xử lý thông tin khi bạn truy cập website gia phả, mở liên kết dòng họ, đăng nhập hoặc sử dụng các chức năng liên quan.",
      ],
    },
    {
      title: "2. Thông tin thu thập",
      paragraphs: [
        "Thông tin bạn cung cấp: tên đăng nhập, email (nếu có), liên kết với thành viên gia phả, cài đặt cá nhân.",
        "Dữ liệu gia phả do ban quản trị dòng họ nhập: họ tên, ngày sinh/mất, tiểu sử, quan hệ gia đình, thông tin mộ phần, sự kiện…",
        "Dữ liệu kỹ thuật: mã truy cập dòng họ lưu trên trình duyệt (localStorage), token đăng nhập, nhật ký truy cập server phục vụ vận hành và bảo mật.",
      ],
    },
    {
      title: "3. Mục đích sử dụng",
      paragraphs: [
        "Hiển thị đúng gia phả của dòng họ bạn được phép xem.",
        "Xác thực tài khoản, phân quyền chỉnh sửa, gửi thông báo ngày giỗ (khi bạn bật).",
        "Cải thiện ổn định, bảo mật và hỗ trợ kỹ thuật.",
      ],
    },
    {
      title: "4. Chia sẻ thông tin",
      paragraphs: [
        "Dữ liệu gia phả trong một tổ chức chỉ hiển thị cho người có liên kết truy cập hoặc tài khoản thuộc tổ chức đó — không công khai cho tổ chức khác.",
        "Chúng tôi không bán dữ liệu cá nhân. Có thể dùng dịch vụ bên thứ ba (ví dụ: đăng nhập Facebook/Zalo, push notification) theo chính sách của họ.",
      ],
    },
    {
      title: "5. Lưu trữ & bảo mật",
      paragraphs: [
        "Dữ liệu lưu trên hệ thống máy chủ có biện pháp bảo vệ phù hợp (mã hóa truy cập API, phân quyền theo tổ chức).",
        "Bạn có thể xóa cookie/localStorage bằng cách xóa dữ liệu trình duyệt — sẽ cần mở lại liên kết dòng họ.",
      ],
    },
    {
      title: "6. Quyền của bạn",
      paragraphs: [
        "Yêu cầu ban quản trị dòng họ cập nhật hoặc điều chỉnh thông tin gia phả liên quan đến bạn.",
        "Tắt thông báo push trong cài đặt trình duyệt hoặc trong trang Cài đặt thông báo.",
        "Liên hệ qua trang Liên hệ hoặc admin dòng họ để được hỗ trợ thêm.",
      ],
    },
    {
      title: "7. Liên hệ",
      paragraphs: [
        "Mọi thắc mắc về bảo mật, vui lòng dùng thông tin tại trang Liên hệ hoặc liên hệ trực tiếp ban quản trị dòng họ của bạn.",
      ],
    },
  ],
};

export const TERMS_DOCUMENT: PublicProseDocument = {
  title: "Điều khoản sử dụng",
  subtitle: "Quy định khi truy cập và sử dụng nền tảng gia phả",
  lastUpdated: "18/06/2025",
  sections: [
    {
      title: "1. Chấp nhận điều khoản",
      paragraphs: [
        "Khi truy cập website, mở liên kết dòng họ hoặc đăng nhập, bạn đồng ý tuân thủ các điều khoản này. Nếu không đồng ý, vui lòng không sử dụng dịch vụ.",
      ],
    },
    {
      title: "2. Mục đích sử dụng",
      paragraphs: [
        "Dịch vụ phục vụ tra cứu, lưu trữ và quản lý thông tin gia phả trong phạm vi dòng họ được cấp quyền.",
        "Không sử dụng cho mục đích vi phạm pháp luật, xâm phạm quyền riêng tư người khác hoặc phát tán thông tin sai lệch cố ý.",
      ],
    },
    {
      title: "3. Liên kết truy cập dòng họ",
      paragraphs: [
        "Liên kết join do ban quản trị phát hành — chỉ chia sẻ trong phạm vi họ hàng được phép biết.",
        "Không cố truy cập dòng họ khác khi không có liên kết hoặc tài khoản hợp lệ.",
      ],
    },
    {
      title: "4. Tài khoản & nội dung",
      paragraphs: [
        "Người có quyền chỉnh sửa chịu trách nhiệm tính chính xác thông tin đăng tải.",
        "Không đăng nội dung xúc phạm, vi phạm bản quyền hoặc thông tin cá nhân của người khác khi chưa được phép.",
      ],
    },
    {
      title: "5. Sở hữu trí tuệ",
      paragraphs: [
        "Giao diện và phần mềm nền tảng thuộc quyền sở hữu của đơn vị vận hành. Nội dung gia phả do dòng họ cung cấp thuộc trách nhiệm của ban quản trị tương ứng.",
      ],
    },
    {
      title: "6. Miễn trừ trách nhiệm",
      paragraphs: [
        "Dịch vụ cung cấp “nguyên trạng”. Ban quản trị dòng họ chịu trách nhiệm về nội dung hiển thị. Chúng tôi nỗ lực duy trì hoạt động ổn định nhưng không đảm bảo không gián đoạn.",
      ],
    },
    {
      title: "7. Thay đổi & chấm dứt",
      paragraphs: [
        "Có thể cập nhật điều khoản; ngày cập nhật ghi trên trang này. Ban quản trị dòng họ có thể thu hồi liên kết hoặc tài khoản khi vi phạm nội quy nội bộ.",
      ],
    },
  ],
};
