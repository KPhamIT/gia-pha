/** Trang hướng dẫn cài đặt PWA — add to home screen. */

export type InstallPlatform = "ios" | "android";

export type InstallStep = {
  title: string;
  /** Dùng **bold** cho đoạn nhấn mạnh. */
  body: string;
};

export type InstallBenefit = {
  id: string;
  title: string;
  description: string;
};

export const INSTALL_PAGE_STRINGS = {
  INSTALL_PAGE_TITLE: "Cài đặt ứng dụng",
  INSTALL_PAGE_EYEBROW: "Trợ giúp",
  INSTALL_PAGE_HERO_TITLE: "Trải nghiệm như ứng dụng chuyên nghiệp",
  INSTALL_PAGE_HERO_SUBTITLE:
    "Cài đặt Cội Nguồn lên màn hình chính để truy cập nhanh chóng và nhận thông báo quan trọng về dòng họ của bạn.",
  INSTALL_TAB_IOS: "iOS (iPhone/iPad)",
  INSTALL_TAB_ANDROID: "Android",
  INSTALL_VISUAL_CAPTION: "Hình ảnh minh họa các bước thực hiện",
  INSTALL_VISUAL_PLACEHOLDER: "Ảnh minh họa sẽ được cập nhật",
  INSTALL_BENEFITS_TITLE: "Tại sao bạn nên cài đặt Cội Nguồn?",
  INSTALL_SUPPORT_TITLE: "Cần hỗ trợ?",
  INSTALL_SUPPORT_BODY:
    "Nếu bạn gặp khó khăn trong quá trình cài đặt, đội ngũ chúng tôi luôn sẵn sàng giúp đỡ.",
  INSTALL_SUPPORT_CTA: "Liên hệ hỗ trợ",
  INSTALL_SITE_HOST: "coinguon.io.vn",
} as const;

export const INSTALL_IOS_STEPS: readonly InstallStep[] = [
  {
    title: "Mở Safari",
    body: "Truy cập vào địa chỉ **coinguon.io.vn** bằng trình duyệt Safari trên thiết bị của bạn.",
  },
  {
    title: "Nhấn biểu tượng Chia sẻ",
    body: "Tìm biểu tượng hình vuông có mũi tên hướng lên ở thanh công cụ phía dưới màn hình.",
  },
  {
    title: "Thêm vào MH chính",
    body: 'Cuộn xuống dưới và chọn dòng **"Thêm vào MH chính" (Add to Home Screen)**.',
  },
  {
    title: "Xác nhận",
    body: 'Nhấn vào nút **"Thêm" (Add)** ở góc trên bên phải để hoàn tất.',
  },
] as const;

export const INSTALL_ANDROID_STEPS: readonly InstallStep[] = [
  {
    title: "Mở Google Chrome",
    body: "Truy cập **coinguon.io.vn** bằng trình duyệt Chrome trên điện thoại Android.",
  },
  {
    title: "Mở menu cài đặt",
    body: "Nhấn vào biểu tượng 3 dấu chấm ở góc trên bên phải màn hình.",
  },
  {
    title: "Cài đặt ứng dụng",
    body: 'Chọn **"Cài đặt ứng dụng"** hoặc **"Thêm vào Màn hình chính"**.',
  },
  {
    title: "Xác nhận cài đặt",
    body: 'Một hộp thoại hiện ra, hãy nhấn **"Cài đặt"** để xác nhận.',
  },
] as const;

export const INSTALL_BENEFITS: readonly InstallBenefit[] = [
  {
    id: "fast",
    title: "Truy cập nhanh",
    description: "Mở ứng dụng ngay từ màn hình chính chỉ với một lần chạm.",
  },
  {
    id: "fullscreen",
    title: "Toàn màn hình",
    description:
      "Trải nghiệm không gian rộng rãi, không bị che khuất bởi thanh địa chỉ trình duyệt.",
  },
  {
    id: "notifications",
    title: "Thông báo tức thời",
    description:
      "Nhận tin tức về các sự kiện dòng họ, ngày giỗ chạp nhanh chóng nhất.",
  },
  {
    id: "performance",
    title: "Mượt mà hơn",
    description:
      "Tối ưu hóa hiệu năng và dữ liệu so với việc dùng trình duyệt thông thường.",
  },
] as const;

/** Ảnh minh họa — public/images/install/ */
export const INSTALL_VISUAL_SRC: Record<InstallPlatform, string | null> = {
  ios: "/images/install/ios.webp",
  android: "/images/install/android.webp",
};
