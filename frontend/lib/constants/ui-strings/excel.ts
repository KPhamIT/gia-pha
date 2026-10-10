/** Nhập / xuất danh sách thành viên bằng file Excel. */
export const EXCEL_STRINGS = {
  EXCEL_FAB: "Nhập / xuất Excel",
  EXCEL_TITLE: "Nhập / xuất Excel",
  EXCEL_STEP_DOWNLOAD: "1. Tải file Excel",
  EXCEL_STEP_DOWNLOAD_HINT:
    "Muốn sửa hoặc bổ sung cho cây hiện tại: tải file kèm dữ liệu. Muốn nhập từ đầu: tải file mẫu trống. Sheet “Hướng dẫn” trong file có cách điền và ví dụ.",
  EXCEL_DOWNLOAD_DATA: "Tải dữ liệu hiện tại",
  EXCEL_DOWNLOAD_BLANK: "Tải file mẫu trống",
  EXCEL_DOWNLOADING: "Đang tạo file...",
  EXCEL_DOWNLOAD_ERROR: "Không tải được file Excel. Vui lòng thử lại.",
  EXCEL_STEP_UPLOAD: "2. Điền xong thì tải file lên",
  EXCEL_STEP_UPLOAD_HINT:
    "Hệ thống kiểm tra file và cho xem trước. Dữ liệu chỉ được ghi khi bạn bấm xác nhận.",
  EXCEL_CHOOSE_FILE: "Chọn file .xlsx",
  EXCEL_CHECKING: "Đang kiểm tra file...",
  EXCEL_APPLYING: "Đang cập nhật gia phả...",
  EXCEL_FILE_TOO_LARGE: "File quá lớn (tối đa 4 MB).",
  EXCEL_FILE_TYPE: "Chỉ nhận file Excel .xlsx.",
  EXCEL_PREVIEW_TITLE: "Kết quả kiểm tra",
  EXCEL_SUMMARY_ROWS: (n: number) => `${n} dòng dữ liệu`,
  EXCEL_SUMMARY_CREATE: (n: number) => `Thêm mới ${n} người`,
  EXCEL_SUMMARY_UPDATE: (n: number) => `Cập nhật ${n} người`,
  EXCEL_SUMMARY_UNCHANGED: (n: number) => `${n} người không đổi`,
  EXCEL_SUMMARY_PARENTS: (n: number, replaced: number) =>
    replaced > 0
      ? `Nối ${n} quan hệ cha/mẹ (thay ${replaced} quan hệ cũ)`
      : `Nối ${n} quan hệ cha/mẹ`,
  EXCEL_SUMMARY_SPOUSES: (n: number) => `Nối ${n} cặp vợ chồng`,
  EXCEL_ERRORS_TITLE: (n: number) => `${n} lỗi cần sửa trong file`,
  EXCEL_WARNINGS_TITLE: (n: number) => `${n} lưu ý`,
  EXCEL_ISSUE_ROW: (row: number) => (row > 0 ? `Dòng ${row}` : "File"),
  EXCEL_ISSUES_TRUNCATED: (shown: number, total: number) =>
    `Đang hiện ${shown}/${total}.`,
  EXCEL_FIX_AND_RETRY:
    "Sửa các lỗi trên trong file Excel rồi chọn lại file. Chưa có dữ liệu nào bị thay đổi.",
  EXCEL_NOTHING_TO_DO: "File không có thay đổi nào so với gia phả hiện tại.",
  EXCEL_CONFIRM: "Xác nhận cập nhật",
  EXCEL_CHOOSE_OTHER: "Chọn file khác",
  EXCEL_SUCCESS: "Đã cập nhật gia phả từ file Excel.",
  EXCEL_IMPORT_ERROR: "Không xử lý được file. Vui lòng thử lại.",
} as const;
