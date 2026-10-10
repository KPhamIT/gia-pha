/** Cột của sheet "Thành viên" trong file Excel nhập/xuất gia phả. */
export type PersonExcelColumnKey =
  | 'id'
  | 'code'
  | 'fullName'
  | 'gender'
  | 'generation'
  | 'branch'
  | 'fatherCode'
  | 'motherCode'
  | 'spouseCodes'
  | 'birthDate'
  | 'deceased'
  | 'deathDate'
  | 'deathLunarDay'
  | 'deathLunarMonth'
  | 'birthPlace'
  | 'currentLocation'
  | 'education'
  | 'occupation'
  | 'religion'
  | 'ethnicity'
  | 'achievements'
  | 'biography'
  | 'cemetery'
  | 'graveAddress';

export type PersonExcelColumn = {
  key: PersonExcelColumnKey;
  header: string;
  width: number;
  /** Ghi chú hiện khi rê chuột vào ô tiêu đề. */
  note: string;
};

export const PERSON_SHEET_NAME = 'Thành viên';
export const GUIDE_SHEET_NAME = 'Hướng dẫn';

export const PERSON_EXCEL_COLUMNS: PersonExcelColumn[] = [
  {
    key: 'id',
    header: 'ID hệ thống',
    width: 12,
    note: 'Do hệ thống điền. Không sửa. Để trống khi thêm người mới.',
  },
  {
    key: 'code',
    header: 'Mã *',
    width: 10,
    note: 'Bắt buộc, không trùng nhau. Người mới: tự đặt (vd. M1, M2). Dùng mã này để điền cột Mã cha / Mã mẹ / Mã vợ chồng.',
  },
  {
    key: 'fullName',
    header: 'Họ và tên *',
    width: 26,
    note: 'Bắt buộc với người mới.',
  },
  { key: 'gender', header: 'Giới tính', width: 10, note: 'Nam hoặc Nữ.' },
  {
    key: 'generation',
    header: 'Đời',
    width: 7,
    note: 'Số đời (Thủy tổ = 0). Để trống: tự tính = đời của cha + 1.',
  },
  {
    key: 'branch',
    header: 'Chi',
    width: 7,
    note: '1 = Đại Tôn, 2 = Trung Tôn, 3 = Tiểu Tôn. Để trống: theo cha.',
  },
  { key: 'fatherCode', header: 'Mã cha', width: 10, note: 'Mã của người cha.' },
  { key: 'motherCode', header: 'Mã mẹ', width: 10, note: 'Mã của người mẹ.' },
  {
    key: 'spouseCodes',
    header: 'Mã vợ/chồng',
    width: 14,
    note: 'Mã vợ/chồng. Nhiều người thì cách nhau dấu phẩy (vd. M5, M6).',
  },
  {
    key: 'birthDate',
    header: 'Ngày sinh',
    width: 13,
    note: 'dd/mm/yyyy (vd. 05/03/1950). Chỉ biết năm thì ghi năm (lưu thành 01/01).',
  },
  { key: 'deceased', header: 'Đã mất', width: 9, note: 'Có hoặc Không.' },
  {
    key: 'deathDate',
    header: 'Ngày mất (dương lịch)',
    width: 14,
    note: 'dd/mm/yyyy.',
  },
  {
    key: 'deathLunarDay',
    header: 'Giỗ - ngày âm',
    width: 10,
    note: 'Ngày giỗ theo âm lịch (1–30).',
  },
  {
    key: 'deathLunarMonth',
    header: 'Giỗ - tháng âm',
    width: 10,
    note: 'Tháng giỗ theo âm lịch (1–12).',
  },
  { key: 'birthPlace', header: 'Nơi sinh', width: 18, note: '' },
  { key: 'currentLocation', header: 'Nơi ở hiện tại', width: 18, note: '' },
  { key: 'education', header: 'Học vấn', width: 14, note: '' },
  { key: 'occupation', header: 'Nghề nghiệp', width: 14, note: '' },
  { key: 'religion', header: 'Tôn giáo', width: 12, note: '' },
  { key: 'ethnicity', header: 'Dân tộc', width: 10, note: '' },
  { key: 'achievements', header: 'Thành tích', width: 24, note: '' },
  { key: 'biography', header: 'Tiểu sử', width: 30, note: '' },
  { key: 'cemetery', header: 'Nghĩa trang / nơi an táng', width: 22, note: '' },
  { key: 'graveAddress', header: 'Địa chỉ mộ', width: 22, note: '' },
];

/** Bỏ dấu, ký tự đặc biệt để so khớp tiêu đề cột linh hoạt. */
export function normalizeHeader(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

export const HEADER_TO_KEY = new Map<string, PersonExcelColumnKey>(
  PERSON_EXCEL_COLUMNS.map((column) => [
    normalizeHeader(column.header),
    column.key,
  ]),
);
