import axios from "axios";

const API_MESSAGE_VI: Record<string, string> = {
  "Password must be at least 6 characters": "Mật khẩu phải có ít nhất 6 ký tự",
  "Admin must belong to an organization": "Admin phải thuộc một tổ chức",
  "This organization already has an admin": "Tổ chức này đã có admin",
  "Username already exists": "Tên đăng nhập đã tồn tại",
  "Username is required": "Vui lòng nhập tên đăng nhập",
  "Organization not found": "Không tìm thấy dòng họ",
  "Person not found": "Không tìm thấy thành viên",
  "No access to this organization": "Bạn không có quyền truy cập dòng họ này",
  "Cannot access another organization": "Bạn không có quyền truy cập dòng họ này",
  "Person has no lunar death date configured": "Thành viên này chưa có ngày mất âm lịch",
  "Ceremony template not found": "Không tìm thấy bài văn khấn",
  "User is not assigned to an organization": "Tài khoản chưa thuộc dòng họ nào",
  "User has no organization": "Tài khoản chưa thuộc dòng họ nào",
  "No organization": "Tài khoản chưa thuộc dòng họ nào",
  "Organization membership required": "Bạn cần là thành viên dòng họ để làm việc này",
  "Organization access link required": "Cần có liên kết truy cập dòng họ",
  "Event not found": "Không tìm thấy sự kiện",
  "Donation not found": "Không tìm thấy khoản đóng góp",
  "Contribution not found": "Không tìm thấy khoản đóng góp",
  "Only admin can remove contributions": "Chỉ quản trị viên mới xoá được khoản đóng góp",
  "Invalid username or password": "Sai tên đăng nhập hoặc mật khẩu",
  "User not found": "Không tìm thấy tài khoản",
  "Feature not permitted": "Bạn chưa được cấp quyền dùng chức năng này",
  "Admin or system role required": "Chỉ quản trị viên mới làm được việc này",
  "System role required": "Chỉ quản trị hệ thống mới làm được việc này",
  "Order not found": "Không tìm thấy đơn hàng",
  "Demo account cannot modify templates": "Tài khoản demo không sửa được mẫu",
  "Demo account cannot create templates": "Tài khoản demo không tạo được mẫu",
  "Demo account is read-only": "Tài khoản demo chỉ được xem, không chỉnh sửa",
  "Invalid date (YYYY-MM-DD)": "Ngày không hợp lệ",
  "Invalid organization link": "Liên kết dòng họ không hợp lệ",
  "Invalid or expired share link": "Liên kết chia sẻ không hợp lệ hoặc đã hết hạn",
  "No access to this user": "Bạn không có quyền với tài khoản này",
  "Facebook token invalid": "Đăng nhập Facebook thất bại, vui lòng thử lại",
  "Facebook profile is missing id": "Đăng nhập Facebook thất bại, vui lòng thử lại",
  "Zalo profile request failed": "Đăng nhập Zalo thất bại, vui lòng thử lại",
  "Template selection requires login": "Vui lòng đăng nhập để chọn mẫu",
  "No access to this template": "Bạn không có quyền với mẫu này",
  "Only the creator can modify this template": "Chỉ người tạo mới sửa được mẫu này",
  "Duplicate person in duty list": "Thành viên đã có trong danh sách",
  "Duty year not found": "Không tìm thấy năm biện họ",
  "Person not in organization": "Thành viên không thuộc dòng họ này",
  "Invalid year": "Năm không hợp lệ",
  "Note body is required": "Vui lòng nhập nội dung ghi chú",
  "Note not found": "Không tìm thấy ghi chú",
  "Excel file is required": "Vui lòng chọn file Excel",
  "No persons found for organization": "Dòng họ chưa có thành viên nào",
  "Cannot create person": "Không tạo được thành viên",
  "Cannot create relationship to self": "Không thể tạo quan hệ với chính mình",
  "Relationship not found": "Không tìm thấy quan hệ",
  "Cannot delete your own account": "Không thể xoá tài khoản của chính bạn",
  "Org admin can only delete standard users": "Quản trị dòng họ chỉ xoá được tài khoản thành viên",
  "Org admin can only create standard users": "Quản trị dòng họ chỉ tạo được tài khoản thành viên",
  "Org admin can only edit standard users": "Quản trị dòng họ chỉ sửa được tài khoản thành viên",
  "Org admin can only assign standard role": "Quản trị dòng họ chỉ gán được quyền thành viên",
  Unauthorized: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
  Forbidden: "Bạn không có quyền thực hiện thao tác này",
  "Too Many Requests": "Bạn thao tác quá nhanh, vui lòng thử lại sau ít phút",
  "Internal server error": "Máy chủ đang gặp sự cố, vui lòng thử lại sau",
};

/** Lỗi kiểm tra dữ liệu mặc định của class-validator (tiếng Anh) → tiếng Việt. */
const VALIDATOR_PATTERNS: [RegExp, (m: RegExpMatchArray) => string][] = [
  [/must be an email$/i, () => "Email không hợp lệ"],
  [/should not be empty$|must be a string$/i, () => "Vui lòng điền đầy đủ thông tin"],
  [/must be longer than or equal to (\d+) characters$/i, (m) => `Cần ít nhất ${m[1]} ký tự`],
  [/must be shorter than or equal to (\d+) characters$/i, (m) => `Tối đa ${m[1]} ký tự`],
  [/must not be less than (\d+)$/i, (m) => `Giá trị phải từ ${m[1]} trở lên`],
  [/must not be greater than (\d+)$/i, (m) => `Giá trị không được lớn hơn ${m[1]}`],
  [/must match .* regular expression$|must be a valid phone/i, () => "Số điện thoại hoặc dữ liệu chưa đúng định dạng"],
];

const VIETNAMESE_CHARS = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;

/** Dịch một thông báo từ server; trả về null nếu vẫn là tiếng Anh không dịch được. */
function translateApiMessage(message: string): string | null {
  const exact = API_MESSAGE_VI[message.trim()];
  if (exact) return exact;
  if (VIETNAMESE_CHARS.test(message)) return message;
  for (const [pattern, toVi] of VALIDATOR_PATTERNS) {
    const match = message.match(pattern);
    if (match) return toVi(match);
  }
  return null;
}

function extractAxiosMessage(error: unknown): string | null {
  if (!axios.isAxiosError(error)) return null;
  if (!error.response) return "Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.";
  const data = error.response.data as { message?: string | string[] } | undefined;
  if (!data?.message) return null;
  const raw = Array.isArray(data.message) ? data.message : [data.message];
  const translated = raw.map(translateApiMessage);
  // Còn câu tiếng Anh không dịch được → dùng câu báo lỗi tiếng Việt của màn hình gọi.
  if (translated.some((m) => m === null)) return null;
  return [...new Set(translated)].join(", ");
}

/** Thông báo lỗi tiếng Việt cho người dùng; không bao giờ hiện câu tiếng Anh thô. */
export function getErrorMessage(error: unknown, fallback: string): string {
  const fromApi = extractAxiosMessage(error);
  if (fromApi) return fromApi;
  if (error instanceof Error && !axios.isAxiosError(error) && VIETNAMESE_CHARS.test(error.message)) {
    return error.message;
  }
  return fallback;
}
