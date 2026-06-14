import type { RelationshipType } from '@/components/types/family-tree-types';

export const UI = {
  // Page metadata
  PAGE_TITLE: 'Gia phả',
  PAGE_DESCRIPTION: 'Cây gia phả',

  // Status messages
  LOADING: 'Đang tải cây gia đình...',
  NO_DATA: 'Không có dữ liệu cây gia đình',
  ERROR_TITLE: 'Lỗi',
  RETRY: 'Thử lại',

  // Error messages
  ERR_FETCH_USER: 'Không thể lấy dữ liệu người dùng',
  ERR_FETCH_DATA: 'Không thể tải dữ liệu',
  ERR_DELETE: 'Lỗi khi xóa',
  ERR_CREATE_CHILD: 'Lỗi khi tạo con',
  ERR_SAVE_RELATIONSHIP: 'Lỗi khi lưu quan hệ',
  ERR_CREATE_PERSON: 'Lỗi khi tạo người mới',
  ERR_DELETE_RELATIONSHIP: 'Lỗi khi xóa quan hệ:',

  // Action modal
  OPTIONS_FOR: 'Tùy chọn cho',
  ADD_CHILD_FOR: 'Thêm con cho',
  DELETE_IRREVERSIBLE: 'Hành động này không thể hoàn tác.',

  // Form labels & placeholders
  CHILD_NAME: 'Tên con',
  GENDER: 'Giới tính',
  BIRTH_DATE: 'Ngày sinh',
  NAME_PLACEHOLDER: 'Nhập tên',
  GENDER_PLACEHOLDER: '-- Chọn giới tính --',
  GENDER_MALE: 'Nam',
  GENDER_FEMALE: 'Nữ',
  CHILD_NAME_REQUIRED: 'Vui lòng nhập tên con',

  // Node display
  GENDER_UNKNOWN: 'Giới tính chưa cập nhật',
  BIRTH_DATE_UNKNOWN: 'Chưa có',
  DEFAULT_NEW_PERSON: 'Người mới',

  // Edge
  DELETE_LINK: 'Xóa liên kết',

  // Settings panel
  SETTINGS_TITLE: 'Cài đặt',
  SETTINGS_XY_HINT: 'Khoảng cách X / Y',
  CLOSE_SETTINGS: 'Đóng cài đặt',
  DISPLAY_MODE: 'Chế độ hiển thị',
  THEME_DARK: 'Tối',
  THEME_LIGHT: 'Sáng',
  SWITCH_TO_LIGHT: 'Chuyển sang chế độ sáng',
  SWITCH_TO_DARK: 'Chuyển sang chế độ tối',
  H_GAP_LABEL: 'Khoảng cách tối thiểu giữa node (px)',
  V_GAP_LABEL: 'Khoảng cách dọc giữa thế hệ (px)',

  // Node appearance
  NODE_WIDTH_LABEL: 'Chiều rộng thẻ (px)',
  NODE_HEIGHT_LABEL: 'Chiều cao thẻ (px)',
  NODE_BG_COLOR: 'Màu nền thẻ',
  NODE_TEXT_COLOR: 'Màu chữ thẻ',

  // Save settings
  SAVE_SETTINGS: 'Lưu cài đặt',
  SAVING_SETTINGS: 'Đang lưu...',
  SAVE_SETTINGS_SUCCESS: 'Đã lưu',
  ERR_SAVE_SETTINGS: 'Lỗi khi lưu cài đặt',

  // Connect relationship modal
  SELECT_RELATIONSHIP: 'Chọn loại quan hệ',
  SAVING: 'Đang lưu...',
  SAVE: 'Lưu',
  CANCEL: 'Hủy',

  // Person detail
  ERR_FETCH_DETAIL: 'Không thể tải thông tin người',
  ERR_UPDATE_PERSON: 'Lỗi khi cập nhật thông tin',
  PERSON_INFO: 'Thông tin',
  RELATIONSHIPS: 'Quan hệ',
  BIOGRAPHY: 'Tiểu sử',
  GRAVE_INFO: 'Mộ phần',
  FATHER: 'Cha',
  MOTHER: 'Mẹ',
  SPOUSE: 'Vợ/Chồng',
  CHILDREN: 'Con',
  NO_INFO: 'Chưa có thông tin',
  NO_BIOGRAPHY: 'Chưa có tiểu sử',
  NO_GRAVE_INFO: 'Chưa có thông tin mộ phần',
  EDIT_PERSON: 'Chỉnh sửa',
  DEATH_DATE: 'Ngày mất',
  BIRTH_PLACE: 'Nơi sinh',
  CURRENT_LOCATION: 'Nơi ở hiện tại',
  EDUCATION: 'Học vấn',
  OCCUPATION: 'Nghề nghiệp',
  RELIGION: 'Tôn giáo',
  ETHNICITY: 'Dân tộc',
  ACHIEVEMENTS: 'Thành tích',
  CEMETERY: 'Nghĩa trang',
  GRAVE_ADDRESS: 'Địa chỉ mộ',
  GRAVE_NOTES: 'Ghi chú mộ phần',

  // Edit form sections
  SECTION_BASIC: 'Thông tin cơ bản',
  SECTION_FAMILY: 'Thông tin gia đình',
  SECTION_LOCATION: 'Thông tin địa điểm',
  SECTION_BIOGRAPHY: 'Tiểu sử',
  SECTION_ACHIEVEMENTS: 'Thành tích',
  SECTION_GRAVE: 'Thông tin mộ phần',

  // FAB & search
  ADD_PERSON: 'Thêm người',
  SEARCH_PERSON: 'Tìm kiếm',
  CENTER_TREE: 'Căn giữa cây',
  VIEW_GENEALOGY_BOOK: 'Sổ gia phả',
  BOOK_PAGE_OF: (current: number, total: number) => `Trang ${current} / ${total}`,
  BOOK_BRANCH: 'Nhánh',
  BOOK_GENERATION: 'Đời',
  BOOK_EMPTY_FIELD: '...',
  BOOK_SAVE_PAGE: 'Lưu trang',
  BOOK_SAVING: 'Đang lưu...',
  BOOK_PREV_PAGE: 'Trang trước',
  BOOK_NEXT_PAGE: 'Trang sau',
  BOOK_TAP_HINT: 'Chạm cạnh trái/phải để lật trang',
  BOOK_PRINT_PAGE: 'In trang này',
  BOOK_PRINT_ALL: 'In toàn bộ sổ',
  BOOK_PRINT_ALL_LOADING: 'Đang chuẩn bị in...',

  // Book cover & preface
  BOOK_COVER_DEFAULT_TITLE: 'GIA PHẢ',
  BOOK_COVER_DEFAULT_SUBTITLE: 'Dòng họ Việt Nam',
  BOOK_COVER_DEFAULT_LINEAGE: 'Phụng lập gia phả – Lưu truyền hậu thế',
  BOOK_COVER_TITLE_PLACEHOLDER: 'Nhập tên dòng họ',
  BOOK_COVER_SUBTITLE_PLACEHOLDER: 'Nhập câu đối / chú thích',
  BOOK_COVER_LINEAGE_PLACEHOLDER: 'Nhập lời đề từ',
  BOOK_COVER_HINT: 'Chạm để chỉnh sửa nội dung trang bìa',
  BOOK_PREFACE_TITLE_DEFAULT: 'Lời Mở Đầu',
  BOOK_PREFACE_TITLE_PLACEHOLDER: 'Tiêu đề lời mở đầu',
  BOOK_PREFACE_BODY_PLACEHOLDER:
    'Viết đôi lời mở đầu cho cuốn gia phả: nguồn gốc dòng họ, ý nghĩa, lời nhắn gửi con cháu...',
  BOOK_PREFACE_SIGN_PLACEHOLDER: 'Ký tên / nơi, ngày tháng',

  // Book style controls
  BOOK_STYLE_TITLE: 'Kiểu trình bày',
  BOOK_BORDER_STYLE_LABEL: 'Khung viền',
  BOOK_FORM_STYLE_LABEL: 'Kiểu trang thông tin',
  BOOK_COVER_FONT_LABEL: 'Font thư pháp',
  BOOK_OPEN_STYLE: 'Tùy chỉnh kiểu trình bày',
  BOOK_SAVED_HINT: 'Tự động lưu vào tài khoản',
  SEARCH_PLACEHOLDER: 'Nhập tên để tìm...',
  NO_SEARCH_RESULTS: 'Không tìm thấy kết quả',
  ADD_CHILD: 'Thêm con',
  DELETE_PERSON: 'Xóa',

  // Branch onboarding + tree filters
  BRANCH_PROMPT_TITLE: 'Bạn thuộc nhánh nào?',
  BRANCH_PROMPT_SUBTITLE: 'Chọn nhánh của bạn để hiển thị cây gia phả phù hợp.',
  FILTER_TITLE: 'Bộ lọc hiển thị',
  FILTER_BRANCH_LABEL: 'Nhánh',
  FILTER_ALL: 'Tất cả',
  FILTER_GENERATION_LABEL: 'Hiển thị đến đời',
  GENERATION_SHORT: (n: number) => `Đời ${n}`,
} as const;

export const RELATIONSHIP_LABELS: Record<RelationshipType, string> = {
  FATHER: 'Bố',
  MOTHER: 'Mẹ',
  CHILD: 'Con',
  SPOUSE: 'Vợ/Chồng',
};
