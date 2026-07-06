/** Trang Chính sách bảo mật — layout bento theo design landing. */
export const PRIVACY_PAGE_UI = {
  HERO_INTRO:
    "Tại Cội Nguồn, chúng tôi trân trọng và bảo vệ sự thiêng liêng của dữ liệu dòng họ như cách bạn gìn giữ gia phả của mình qua nhiều thế hệ.",

  COLLECT_TITLE: "Thu thập thông tin",
  COLLECT_INTRO:
    "Chúng tôi chỉ thu thập thông tin cần thiết để vận hành gia phả điện tử, bao gồm:",
  COLLECT_ITEMS: [
    "Thông tin định danh: họ tên, ngày sinh, ngày mất, tiểu sử.",
    "Dữ liệu quan hệ: liên kết giữa các thành viên trong dòng tộc.",
    "Tài khoản & kỹ thuật: email (nếu có), token đăng nhập, mã truy cập dòng họ, nhật ký vận hành.",
  ] as const,

  USE_TITLE: "Sử dụng dữ liệu",
  USE_INTRO: "Dữ liệu được sử dụng minh bạch với các mục đích:",
  USE_ITEMS: [
    "Hiển thị đúng gia phả của dòng họ bạn được phép xem.",
    "Xác thực tài khoản, phân quyền chỉnh sửa và gửi thông báo ngày giỗ (khi bạn bật).",
    "Cải thiện ổn định, bảo mật và hỗ trợ kỹ thuật.",
  ] as const,

  RIGHTS_TITLE: "Quyền riêng tư",
  RIGHTS_INTRO:
    "Bạn và ban quản trị dòng họ kiểm soát phạm vi hiển thị thông tin:",
  RIGHTS_ITEMS: [
    "Dữ liệu gia phả chỉ hiển thị cho người có liên kết truy cập hoặc tài khoản thuộc tổ chức — không công khai cho dòng họ khác.",
    "Yêu cầu ban quản trị cập nhật hoặc điều chỉnh thông tin liên quan đến bạn.",
    "Tắt thông báo push trong cài đặt trình duyệt hoặc trang Cài đặt thông báo.",
  ] as const,

  SECURITY_TITLE: "Cam kết bảo mật",
  SECURITY_INTRO: "Cội Nguồn áp dụng các biện pháp bảo vệ phù hợp:",
  SECURITY_ITEMS: [
    "Mã hóa truy cập API và phân quyền theo tổ chức.",
    "Dữ liệu lưu trên máy chủ có biện pháp bảo vệ phù hợp.",
    "Không bán dữ liệu cá nhân; dịch vụ bên thứ ba (đăng nhập, push) tuân theo chính sách của họ.",
  ] as const,

  CTA_TITLE: "Bạn có thắc mắc về bảo mật?",
  CTA_BODY:
    "Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn bảo vệ di sản số của gia đình.",
  CTA_SUPPORT: "Gửi yêu cầu hỗ trợ",
  CTA_HELP: "Trung tâm trợ giúp",
} as const;

export type PrivacyCardAccent = "secondary" | "primary" | "sunset" | "tertiary";

export type PrivacyCardConfig = {
  accent: PrivacyCardAccent;
  icon: "collect" | "database" | "security" | "verified";
  title: string;
  intro: string;
  items: readonly string[];
};

export const PRIVACY_PAGE_CARDS: readonly PrivacyCardConfig[] = [
  {
    accent: "secondary",
    icon: "collect",
    title: PRIVACY_PAGE_UI.COLLECT_TITLE,
    intro: PRIVACY_PAGE_UI.COLLECT_INTRO,
    items: PRIVACY_PAGE_UI.COLLECT_ITEMS,
  },
  {
    accent: "primary",
    icon: "database",
    title: PRIVACY_PAGE_UI.USE_TITLE,
    intro: PRIVACY_PAGE_UI.USE_INTRO,
    items: PRIVACY_PAGE_UI.USE_ITEMS,
  },
  {
    accent: "sunset",
    icon: "security",
    title: PRIVACY_PAGE_UI.RIGHTS_TITLE,
    intro: PRIVACY_PAGE_UI.RIGHTS_INTRO,
    items: PRIVACY_PAGE_UI.RIGHTS_ITEMS,
  },
  {
    accent: "tertiary",
    icon: "verified",
    title: PRIVACY_PAGE_UI.SECURITY_TITLE,
    intro: PRIVACY_PAGE_UI.SECURITY_INTRO,
    items: PRIVACY_PAGE_UI.SECURITY_ITEMS,
  },
];

const ACCENT_STYLES: Record<
  PrivacyCardAccent,
  { border: string; iconBg: string; iconColor: string }
> = {
  secondary: {
    border: "border-l-[#944a00]",
    iconBg: "bg-[#ffdcc5]",
    iconColor: "text-[#944a00]",
  },
  primary: {
    border: "border-l-[#321716]",
    iconBg: "bg-[#ffdad7]",
    iconColor: "text-[#321716]",
  },
  sunset: {
    border: "border-l-[#E67E22]",
    iconBg: "bg-[#FEF3C7]",
    iconColor: "text-[#E67E22]",
  },
  tertiary: {
    border: "border-l-[#381400]",
    iconBg: "bg-[#ffdbca]",
    iconColor: "text-[#381400]",
  },
};

export function privacyCardAccentStyle(accent: PrivacyCardAccent) {
  return ACCENT_STYLES[accent];
}
