/** Page chrome, status, generic errors, forms, node + settings, person detail. */
export const CORE_STRINGS = {
  // Page metadata / brand (in-app chrome)
  PAGE_TITLE: "Cội Nguồn",
  PAGE_DESCRIPTION: "Cội Nguồn - Gia phả điện tử",

  // Status messages
  LOADING: "Đang tải cây gia đình...",
  NO_DATA: "Không có dữ liệu cây gia đình",
  ERROR_TITLE: "Lỗi",
  RETRY: "Thử lại",

  // Error messages
  ERR_FETCH_USER: "Không thể lấy dữ liệu người dùng",
  ERR_AUTH_REQUIRED: "Vui lòng đăng nhập để chỉnh sửa và lưu dữ liệu gia phả.",
  ERR_FETCH_DATA: "Không thể tải dữ liệu",
  ERR_DELETE: "Lỗi khi xóa",
  ERR_CREATE_CHILD: "Lỗi khi tạo con",
  ERR_SAVE_RELATIONSHIP: "Lỗi khi lưu quan hệ",
  ERR_CREATE_PERSON: "Lỗi khi tạo người mới",
  ERR_DELETE_RELATIONSHIP: "Lỗi khi xóa quan hệ:",

  // Action modal
  OPTIONS_FOR: "Tùy chọn cho",
  ADD_CHILD_FOR: "Thêm con cho",
  DELETE_IRREVERSIBLE: "Hành động này không thể hoàn tác.",

  // Form labels & placeholders
  CHILD_NAME: "Tên con",
  GENDER: "Giới tính",
  BIRTH_DATE: "Ngày sinh",
  NAME_PLACEHOLDER: "Nhập tên",
  GENDER_PLACEHOLDER: "-- Chọn giới tính --",
  GENDER_MALE: "Nam",
  GENDER_FEMALE: "Nữ",
  CHILD_NAME_REQUIRED: "Vui lòng nhập tên con",

  // Node display
  GENDER_UNKNOWN: "Giới tính chưa cập nhật",
  BIRTH_DATE_UNKNOWN: "Chưa có",
  DEFAULT_NEW_PERSON: "Người mới",

  // Edge
  DELETE_LINK: "Xóa liên kết",

  // Settings panel
  SETTINGS_TITLE: "Cài đặt",
  SETTINGS_XY_HINT: "Khoảng cách X / Y",
  TREE_SETTINGS_PANEL_HINT: "Khoảng cách cây · bấm thẻ thành viên để chỉnh kiểu",
  CLOSE_SETTINGS: "Đóng cài đặt",
  DISPLAY_MODE: "Chế độ hiển thị",
  THEME_DARK: "Tối",
  THEME_LIGHT: "Sáng",
  SWITCH_TO_LIGHT: "Chuyển sang chế độ sáng",
  SWITCH_TO_DARK: "Chuyển sang chế độ tối",
  H_GAP_LABEL: "Khoảng cách tối thiểu giữa node (px)",
  EDGE_COLOR_LABEL: "Màu đường nối giữa các thẻ",
  V_GAP_LABEL: "Khoảng cách dọc giữa thế hệ (px)",

  // Node appearance
  NODE_WIDTH_LABEL: "Chiều rộng thẻ (px)",
  NODE_HEIGHT_LABEL: "Chiều cao thẻ (px)",
  NODE_BG_COLOR: "Màu nền thẻ",
  NODE_TEXT_COLOR: "Màu chữ thẻ",
  NODE_FONT_SIZE_LABEL: "Cỡ chữ thẻ (px)",
  NODE_FONT_WEIGHT_LABEL: "Độ đậm chữ",
  NODE_FONT_WEIGHT_NORMAL: "Thường",
  NODE_FONT_WEIGHT_SEMIBOLD: "Vừa đậm",
  NODE_FONT_WEIGHT_BOLD: "Đậm",
  NODE_TEXT_DIRECTION_LABEL: "Hướng chữ",
  NODE_TEXT_DIRECTION_HORIZONTAL: "Ngang",
  NODE_TEXT_DIRECTION_VERTICAL: "Dọc",
  NODE_TEXT_CASE_LABEL: "Chữ hoa/thường",
  NODE_TEXT_CASE_AS_TYPED: "Như gốc",
  NODE_TEXT_CASE_UPPER: "CHỮ HOA",
  NODE_TEXT_CASE_LOWER: "chữ thường",
  LEVEL_STYLE_TARGET: "Cấu hình cho",
  LEVEL_STYLE_DEFAULT: "Mặc định (tất cả đời)",
  LEVEL_STYLE_HINT: "Cùng đời thứ dùng chung một kiểu thẻ",
  LEVEL_STYLE_RESET: "Dùng mặc định cho đời này",
  TREE_SETTINGS_NODE_HINT:
    "Bấm vào thẻ thành viên trên cây để chỉnh màu sắc, cỡ chữ và kích thước.",
  NODE_STYLE_SHEET_HINT: "Thay đổi được xem trước ngay trên cây.",
  NODE_STYLE_APPLY_SAME_LEVEL: "Áp dụng cho tất cả node cùng đời",
  NODE_STYLE_APPLY_WHOLE_TREE: "Áp dụng cho toàn cây",
  NODE_STYLE_APPLY_SAME_LEVEL_DISABLED: "Thành viên chưa có đời thứ — chỉ áp dụng cho node này.",
  NODE_STYLE_OPEN_DETAIL: "Xem chi tiết",
  NODE_STYLE_APPLY: "Áp dụng",
  NODE_STYLE_SHEET_NO_GENERATION: "Chưa ghi đời thứ",

  // Save settings
  SAVE_SETTINGS: "Lưu cài đặt",
  SAVING_SETTINGS: "Đang lưu...",
  SAVE_SETTINGS_SUCCESS: "Đã lưu",
  ERR_SAVE_SETTINGS: "Lỗi khi lưu cài đặt",

  // Connect relationship modal
  SELECT_RELATIONSHIP: "Chọn loại quan hệ",
  SAVING: "Đang lưu...",
  SAVE: "Lưu",
  CANCEL: "Hủy",
  CLOSE: "Đóng",
  BACK: "Quay lại",

  // Mobile bottom navigation
  MOBILE_NAV_HOME: "Trang chủ",
  MOBILE_NAV_FAMILY: "Gia tộc",
  MOBILE_NAV_EVENTS: "Sự kiện",
  MOBILE_NAV_PROFILE: "Tài khoản",

  // Person generation (đời thứ N)
  GENERATION_ORDINAL: (n: number) => `Đời thứ ${n}`,
  PERSON_LAST_EDITED_BY: (name: string, when: string) =>
    `Cập nhật lần cuối: ${name} · ${when}`,
  PERSON_EDIT_HISTORY: "Lịch sử chỉnh sửa",

  /** Nhãn nút ngắn (icon + text, ≤ ~10 ký tự) */
  BTN_CREATE: "Thêm",
  BTN_CENTER: "Căn giữa",
  BTN_EXPORT: "Xuất ảnh",
  BTN_FACEBOOK: "Facebook",
  BTN_ZALO: "Zalo",
  BTN_SYSTEM: "Hệ thống",
  BTN_USERS: "Users",
  BTN_DISMISS: "Tiếp tục",
  BTN_LOGIN: "Đăng nhập",
  BTN_EDIT: "Sửa",

  // Person detail
  ERR_FETCH_DETAIL: "Không thể tải thông tin người",
  ERR_UPDATE_PERSON: "Lỗi khi cập nhật thông tin",
  PERSON_INFO: "Thông tin",
  RELATIONSHIPS: "Quan hệ",
  BIOGRAPHY: "Tiểu sử",
  GRAVE_INFO: "Mộ phần",
  FATHER: "Cha",
  MOTHER: "Mẹ",
  SPOUSE: "Vợ/Chồng",
  CHILDREN: "Con",
  NO_INFO: "Chưa có thông tin",
  NO_BIOGRAPHY: "Chưa có tiểu sử",
  NO_GRAVE_INFO: "Chưa có thông tin mộ phần",
  EDIT_PERSON: "Chỉnh sửa",
  DEATH_DATE: "Ngày mất",
  DECEASED_STATUS: "Tình trạng",
  DECEASED_CHECKBOX: "Đã mất (kể cả khi chưa rõ ngày mất)",
  STATUS_ALIVE: "Còn sống",
  STATUS_DECEASED: "Đã mất",
  BIRTH_PLACE: "Nơi sinh",
  CURRENT_LOCATION: "Nơi ở hiện tại",
  EDUCATION: "Học vấn",
  OCCUPATION: "Nghề nghiệp",
  RELIGION: "Tôn giáo",
  ETHNICITY: "Dân tộc",
  ACHIEVEMENTS: "Thành tích",
  CEMETERY: "Nghĩa trang",
  GRAVE_ADDRESS: "Địa chỉ mộ",
  GRAVE_NOTES: "Ghi chú mộ phần",

  // Edit form sections
  SECTION_BASIC: "Thông tin cơ bản",
  SECTION_FAMILY: "Thông tin gia đình",
  SECTION_LOCATION: "Thông tin địa điểm",
  SECTION_BIOGRAPHY: "Tiểu sử",
  SECTION_ACHIEVEMENTS: "Thành tích",
  SECTION_GRAVE: "Thông tin mộ phần",
} as const;
