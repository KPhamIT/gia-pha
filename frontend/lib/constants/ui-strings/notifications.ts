/** Notifications, ceremonies (bài cúng), and admin ceremony templates. */
export const NOTIFICATION_STRINGS = {
  // Notifications
  NOTIFICATIONS_TITLE: "Thông báo",
  NOTIFICATIONS_SUBTITLE: "Lịch sử thông báo ngày giỗ và sự kiện",
  NOTIFICATIONS_EMPTY: "Chưa có thông báo nào",
  NOTIF_IN_APP_HINT:
    "Danh sách dưới là lịch sử trong app (sau khi cron chạy). Popup hệ thống (góc màn hình) là push trình duyệt — cần bật quyền ở Cài đặt thông báo; thử thu nhỏ tab hoặc chuyển sang tab khác khi test.",
  NOTIF_PUSH_SENT: "Đã gửi push",
  NOTIF_PUSH_FAILED: "Push thất bại",
  NOTIFICATIONS_SETTINGS_TITLE: "Cài đặt thông báo",
  NOTIFICATIONS_SETTINGS_SUBTITLE:
    "Quản lý quyền và loại thông báo bạn muốn nhận",
  NOTIF_DEATH_ANNIVERSARY: "Nhận thông báo ngày giỗ",
  NOTIF_EVENTS: "Nhận thông báo sự kiện dòng họ",
  NOTIF_POSTS: "Nhận thông báo bài viết mới",
  NOTIF_BROWSER_STATUS: "Thông báo trình duyệt",
  NOTIF_PUSH_MASTER: "Bật thông báo push trên thiết bị này",
  NOTIF_DEVICES_REGISTERED: (n: number) =>
    n <= 1 ? "1 thiết bị đang nhận push" : `${n} thiết bị đang nhận push`,
  NOTIF_PERMISSION_GRANTED: "Đã cấp quyền trình duyệt",
  NOTIF_PERMISSION_DENIED: "Chưa cấp quyền trình duyệt",
  NOTIF_PERMISSION_BLOCKED:
    "Trình duyệt đang chặn thông báo — mở biểu tượng ổ khóa trên thanh địa chỉ → Cho phép thông báo, rồi bật lại.",
  NOTIF_UNSUPPORTED: "Trình duyệt không hỗ trợ thông báo push",
  NOTIF_NOT_CONFIGURED:
    "Chưa cấu hình OneSignal trên server (NEXT_PUBLIC_ONESIGNAL_APP_ID)",
  NOTIF_ENABLE: "Bật thông báo",
  NOTIF_LATER: "Để sau",
  NOTIF_BANNER_TEXT: "Bạn có muốn nhận thông báo ngày giỗ tổ tiên không?",
  NOTIF_OPEN_SETTINGS: "Cài đặt thông báo",
  NOTIF_OPEN_CENTER: "Thông báo",
  NOTIF_OPEN_UPCOMING: "Ngày giỗ sắp tới",
  NOTIF_SAVED: "Đã lưu cài đặt thông báo",
  NOTIF_ERR_SAVE: "Không thể lưu cài đặt thông báo",
  NOTIF_ERR_LOAD: "Không thể tải cài đặt thông báo",
  NOTIF_LOGIN_REQUIRED: "Vui lòng đăng nhập để quản lý thông báo",
  NOTIF_TYPES_TITLE: "Loại thông báo",

  // Death anniversary / ceremonies
  DEATH_LUNAR_DAY: "Ngày mất (âm lịch)",
  DEATH_LUNAR_MONTH: "Tháng mất (âm lịch)",
  CEREMONIES_UPCOMING_TITLE: "Ngày giỗ sắp tới",
  CEREMONIES_UPCOMING_SUBTITLE: "Danh sách ngày giỗ trong vòng 3 ngày tới",
  CEREMONIES_EMPTY: "Không có ngày giỗ sắp tới",
  CEREMONIES_DAYS_UNTIL: (days: number) =>
    days === 0 ? "Hôm nay" : `Còn ${days} ngày`,
  CEREMONIES_VIEW: "Xem bài cúng",
  CEREMONY_TITLE: "Bài cúng",
  CEREMONY_PRINT: "In trực tiếp",
  CEREMONY_SHARE: "Chia sẻ",
  CEREMONY_SHARE_MESSAGE: (fullName: string) =>
    `Bài cúng ngày giỗ cụ ${fullName}. Mở link để xem và in — không cần đăng nhập.`,
  CEREMONY_SHARE_SUCCESS: "Đã mở chia sẻ",
  CEREMONY_SHARE_COPIED: "Đã copy link bài cúng",
  CEREMONY_SHARE_FAILED: "Không thể chia sẻ link",
  CEREMONY_SHARE_HINT:
    "Gửi link cho người có máy in — họ mở trên điện thoại hoặc máy tính rồi bấm In trực tiếp, không cần đăng nhập.",
  CEREMONY_PUBLIC_SUBTITLE: "Xem và in bài cúng — không cần đăng nhập",
  CEREMONY_LOADING: "Đang tải bài cúng...",
  CEREMONY_ERR: "Không thể tải bài cúng",

  // Admin notification stats
  NOTIF_STATS_TITLE: "Thống kê thông báo",
  NOTIF_STATS_TOTAL: "Tổng thành viên",
  NOTIF_STATS_SUBSCRIBED: "Đã đăng ký nhận thông báo",
  NOTIF_STATS_RATE: "Tỷ lệ",

  // Ceremony templates (admin)
  CEREMONY_TEMPLATES_TITLE: "Mẫu bài cúng",
  CEREMONY_TEMPLATES_SUBTITLE: "Tạo và quản lý mẫu HTML bài cúng ngày giỗ",
  CEREMONY_TEMPLATE_CREATE: "Tạo mẫu",
  CEREMONY_TEMPLATE_EDIT: "Sửa mẫu",
  CEREMONY_TEMPLATE_NAME: "Tên mẫu",
  CEREMONY_TEMPLATE_CONTENT: "Nội dung bài cúng",
  CEREMONY_TEMPLATE_CONTENT_HINT:
    "Nhập nội dung bài cúng — giữ Enter để xuống dòng. Chạm vào biến ở danh sách bên cạnh để chèn thông tin tự động (tên, ngày giỗ…); hệ thống sẽ tự điền khi in.",
  CEREMONY_TEMPLATE_HINT:
    "Soạn mẫu bài cúng dùng chung. Chạm vào biến để chèn thông tin tự động như tên, ngày giỗ, dòng họ… hệ thống tự điền khi in.",
  CEREMONY_TEMPLATE_VARIABLES: "Biến có thể dùng",
  CEREMONY_TEMPLATE_VARIABLES_COUNT: "{count} biến",
  CEREMONY_TEMPLATE_VARIABLES_INSERT_HINT: "Chạm vào biến để chèn vào nội dung",
  CEREMONY_TEMPLATE_VARIABLES_SEARCH: "Tìm biến…",
  CEREMONY_TEMPLATE_VARIABLES_NONE: "Không tìm thấy biến phù hợp",
  CEREMONY_TEMPLATE_TAB_EDIT: "Soạn",
  CEREMONY_TEMPLATE_TAB_PREVIEW: "Xem trước",
  CEREMONY_TEMPLATE_PREVIEW_EMPTY: "Chưa có nội dung để xem trước",
  CEREMONY_TEMPLATE_UNKNOWN_VAR: "Biến không hợp lệ",
  CEREMONY_TEMPLATE_UNKNOWN_COUNT: "{count} biến không hợp lệ",
  CEREMONY_TEMPLATE_DUPLICATE: "Nhân bản",
  CEREMONY_TEMPLATE_COPY_SUFFIX: " (sao chép)",
  CEREMONY_TEMPLATE_UNSAVED_CONFIRM: "Bỏ các thay đổi chưa lưu?",
  CEREMONY_TEMPLATE_READONLY_HINT:
    "Chọn người đã mất để xem và in bài cúng. Chỉ quản trị viên mới sửa được mẫu.",
  CEREMONY_TEMPLATE_DEMO_HINT:
    "Xem thử soạn mẫu bài cúng — có thể tạo, chỉnh và xem trước; không lưu lên hệ thống.",
  CEREMONY_TEMPLATE_DEMO_SAVED:
    "Chế độ xem thử — mẫu không được lưu. Đăng nhập để dùng thật.",
  CEREMONY_PRINT_OPEN: "Xem & In",
  CEREMONY_PRINT_TITLE: "Xem & In bài cúng",
  CEREMONY_PRINT_PICK_PERSON: "Chọn người đã mất để xem và in bài cúng",
  CEREMONY_PRINT_SEARCH: "Tìm người đã mất…",
  CEREMONY_PRINT_CHANGE_PERSON: "Đổi người",
  CEREMONY_PRINT_NO_PERSONS: "Chưa có người đã mất nào có ngày giỗ âm lịch",
  CEREMONY_PREVIEW_SAVE_FIRST:
    "Hãy lưu mẫu trước để xem trước với dữ liệu thật",
  CEREMONY_PREVIEW_USES_SAVED:
    "Xem trước dùng bản đã lưu của mẫu (lưu lại để cập nhật).",
  CEREMONY_TEMPLATE_NS_PERSON: "Người được cúng",
  CEREMONY_TEMPLATE_NS_ORGANIZATION: "Dòng họ",
  CEREMONY_TEMPLATE_NS_CEREMONY: "Lễ giỗ",
  CEREMONY_TEMPLATE_NS_TODAY: "Ngày cúng",
  CEREMONY_TEMPLATE_NS_WORSHIPPER: "Người đứng cúng",
  CEREMONY_TEMPLATE_NS_OTHER: "Khác",
  CEREMONY_TEMPLATE_SET_DEFAULT: "Đặt làm mẫu mặc định",
  CEREMONY_TEMPLATE_USE_DEFAULT: "Dùng mặc định",
  CEREMONY_TEMPLATE_DEFAULT_BADGE: "Mặc định",
  CEREMONY_TEMPLATE_EMPTY:
    "Chưa có mẫu bài cúng. Tạo mẫu đầu tiên hoặc hệ thống dùng mẫu built-in.",
  CEREMONY_TEMPLATE_REQUIRED: "Vui lòng nhập tên và nội dung mẫu",
  CEREMONY_TEMPLATE_CREATED: "Đã tạo mẫu bài cúng",
  CEREMONY_TEMPLATE_UPDATED: "Đã cập nhật mẫu bài cúng",
  CEREMONY_TEMPLATE_DELETED: "Đã xóa mẫu bài cúng",
  CEREMONY_TEMPLATE_DEFAULT_SET: "Đã đặt mẫu mặc định",
  CEREMONY_TEMPLATE_DELETE_CONFIRM: "Xóa mẫu bài cúng này?",
  CEREMONY_TEMPLATE_ERR_LOAD: "Không thể tải mẫu bài cúng",
  CEREMONY_TEMPLATE_ERR_SAVE: "Không thể lưu mẫu bài cúng",
  CEREMONY_TEMPLATE_ERR_DELETE: "Không thể xóa mẫu bài cúng",
  CEREMONY_TEMPLATES_OPEN: "Mẫu bài cúng",
} as const;
