import ExcelJS from 'exceljs';
import {
  GUIDE_SHEET_NAME,
  PERSON_EXCEL_COLUMNS,
  PERSON_SHEET_NAME,
  type PersonExcelColumnKey,
} from './person-excel.columns.js';
import { buildFamilyIndex, findParent } from './person-excel.relations.js';
import {
  formatDate,
  genderKind,
  GENDER_FEMALE,
  GENDER_MALE,
} from './person-excel.values.js';

export type ExportPerson = {
  id: number;
  fullName: string;
  gender: string | null;
  generation: number | null;
  branch: number | null;
  birthDate: Date | null;
  deceased: boolean;
  deathDate: Date | null;
  deathLunarDay: number | null;
  deathLunarMonth: number | null;
  birthPlace: string | null;
  currentLocation: string | null;
  education: string | null;
  occupation: string | null;
  religion: string | null;
  ethnicity: string | null;
  achievements: string | null;
  biography: { content: string } | null;
  graveInfo: { cemetery: string | null; address: string | null } | null;
};

export type ExportRelationship = {
  id: number;
  fromId: number;
  toId: number;
  type: string;
};

/** Số dòng trống có sẵn validation để người dùng điền thêm. */
const EXTRA_ROWS = 300;
const HEADER_FILL = 'FFB45309';
const ID_FILL = 'FFF1F5F9';
const REQUIRED_FILL = 'FF92400E';

function genderLabel(gender: string | null): string | null {
  const kind = genderKind(gender);
  if (kind === 'male') return GENDER_MALE;
  if (kind === 'female') return GENDER_FEMALE;
  return gender?.trim() || null;
}

function personRow(
  person: ExportPerson,
  index: ReturnType<typeof buildFamilyIndex>,
): Record<PersonExcelColumnKey, string | number | null> {
  const father = findParent(index, person.id, 'father');
  const mother = findParent(index, person.id, 'mother');
  const spouses = [...(index.spousesOf.get(person.id) ?? [])].sort(
    (a, b) => a - b,
  );
  return {
    id: person.id,
    code: String(person.id),
    fullName: person.fullName,
    gender: genderLabel(person.gender),
    generation: person.generation,
    branch: person.branch,
    fatherCode: father ? String(father.parentId) : null,
    motherCode: mother ? String(mother.parentId) : null,
    spouseCodes: spouses.length ? spouses.join(', ') : null,
    birthDate: formatDate(person.birthDate),
    deceased: person.deceased || person.deathDate ? 'Có' : 'Không',
    deathDate: formatDate(person.deathDate),
    deathLunarDay: person.deathLunarDay,
    deathLunarMonth: person.deathLunarMonth,
    birthPlace: person.birthPlace,
    currentLocation: person.currentLocation,
    education: person.education,
    occupation: person.occupation,
    religion: person.religion,
    ethnicity: person.ethnicity,
    achievements: person.achievements,
    biography: person.biography?.content ?? null,
    cemetery: person.graveInfo?.cemetery ?? null,
    graveAddress: person.graveInfo?.address ?? null,
  };
}

/** Cây xuất theo đời rồi theo tên để dễ đọc. */
function sortPersons(persons: ExportPerson[]): ExportPerson[] {
  return [...persons].sort(
    (a, b) =>
      (a.generation ?? 999) - (b.generation ?? 999) ||
      a.fullName.localeCompare(b.fullName, 'vi'),
  );
}

function columnLetter(key: PersonExcelColumnKey): string {
  const index = PERSON_EXCEL_COLUMNS.findIndex((c) => c.key === key);
  let n = index + 1;
  let letters = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    letters = String.fromCharCode(65 + rem) + letters;
    n = Math.floor((n - 1) / 26);
  }
  return letters;
}

function addValidations(sheet: ExcelJS.Worksheet, lastRow: number) {
  const list = (key: PersonExcelColumnKey, values: string[]) => {
    const col = columnLetter(key);
    for (let r = 2; r <= lastRow; r++) {
      sheet.getCell(`${col}${r}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [`"${values.join(',')}"`],
        showErrorMessage: true,
        errorTitle: 'Giá trị không hợp lệ',
        error: `Chọn một trong: ${values.join(', ')}`,
      };
    }
  };
  const whole = (key: PersonExcelColumnKey, min: number, max: number) => {
    const col = columnLetter(key);
    for (let r = 2; r <= lastRow; r++) {
      sheet.getCell(`${col}${r}`).dataValidation = {
        type: 'whole',
        operator: 'between',
        allowBlank: true,
        formulae: [min, max],
        showErrorMessage: true,
        errorTitle: 'Giá trị không hợp lệ',
        error: `Nhập số nguyên từ ${min} đến ${max}`,
      };
    }
  };
  list('gender', [GENDER_MALE, GENDER_FEMALE]);
  list('deceased', ['Có', 'Không']);
  whole('generation', 0, 50);
  whole('branch', 1, 3);
  whole('deathLunarDay', 1, 30);
  whole('deathLunarMonth', 1, 12);
}

function buildPersonSheet(
  workbook: ExcelJS.Workbook,
  persons: ExportPerson[],
  relationships: ExportRelationship[],
) {
  const sheet = workbook.addWorksheet(PERSON_SHEET_NAME, {
    views: [{ state: 'frozen', xSplit: 3, ySplit: 1 }],
  });
  sheet.columns = PERSON_EXCEL_COLUMNS.map((c) => ({
    key: c.key,
    header: c.header,
    width: c.width,
    // Cột ngày và mã để dạng chữ: Excel không tự đổi "05/03/1950" sang kiểu ngày khác.
    style:
      c.key.endsWith('Date') ||
      c.key.endsWith('Code') ||
      c.key === 'code' ||
      c.key === 'spouseCodes'
        ? { numFmt: '@' }
        : {},
  }));

  const header = sheet.getRow(1);
  header.height = 30;
  PERSON_EXCEL_COLUMNS.forEach((column, i) => {
    const cell = header.getCell(i + 1);
    const required = column.header.endsWith('*');
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: required ? REQUIRED_FILL : HEADER_FILL },
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
    if (column.note) cell.note = column.note;
  });

  const index = buildFamilyIndex(persons, relationships);
  for (const person of sortPersons(persons)) {
    sheet.addRow(personRow(person, index));
  }

  const lastRow = persons.length + 1 + EXTRA_ROWS;
  for (let r = 2; r <= lastRow; r++) {
    sheet.getCell(`A${r}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: ID_FILL },
    };
    sheet.getCell(`A${r}`).font = { color: { argb: 'FF64748B' } };
  }
  addValidations(sheet, lastRow);
  sheet.autoFilter = { from: 'A1', to: `${columnLetter('graveAddress')}1` };
}

const GUIDE_LINES: string[] = [
  'CÁCH DÙNG FILE EXCEL GIA PHẢ — CỘI NGUỒN',
  '',
  '1. Mỗi dòng ở sheet "Thành viên" là một người. Không đổi tên sheet và tiêu đề cột.',
  '2. Cột "ID hệ thống" do hệ thống điền — không sửa. Dòng có ID = cập nhật người đã có; dòng không có ID = thêm người mới.',
  '3. Cột "Mã" bắt buộc và không trùng. Người đã có: mã là ID của họ. Người mới: tự đặt mã ngắn như M1, M2, M3…',
  '4. Nối quan hệ bằng mã: điền "Mã cha", "Mã mẹ", "Mã vợ/chồng" (nhiều vợ/chồng thì cách nhau dấu phẩy).',
  '   Có thể dùng ID của người đã có trên cây dù người đó không có dòng nào trong file.',
  '5. Ô để trống = giữ nguyên thông tin cũ. Muốn xóa thông tin, hãy sửa trực tiếp trong ứng dụng.',
  '6. Đổi "Mã cha" / "Mã mẹ" của người đã có sẽ thay cha/mẹ cũ bằng người mới chỉ định.',
  '7. Không cần điền "Đời" và "Chi" cho người mới: hệ thống tự tính theo cha (hoặc mẹ).',
  '8. Ngày ghi dạng dd/mm/yyyy (vd. 05/03/1950). Chỉ biết năm thì ghi năm (vd. 1950).',
  '9. Có ngày mất hoặc ngày giỗ thì tự hiểu là "Đã mất".',
  '10. Tải file lên tại Cây gia phả → nút + → "Nhập / xuất Excel". Hệ thống kiểm tra và cho xem trước,',
  '    chỉ ghi dữ liệu khi bạn bấm xác nhận và file không còn lỗi.',
  '',
  'Lưu ý: dòng họ mới tạo đã có sẵn người "Thủy Tổ". Hãy tải file "dữ liệu hiện tại" để sửa tên Thủy Tổ',
  'thay vì thêm một Thủy Tổ thứ hai.',
  '',
  'VÍ DỤ (không nhập ở sheet này — chỉ để tham khảo):',
];

const GUIDE_EXAMPLE: (string | number | null)[][] = [
  [
    'ID hệ thống',
    'Mã *',
    'Họ và tên *',
    'Giới tính',
    'Đời',
    'Mã cha',
    'Mã mẹ',
    'Mã vợ/chồng',
    'Ngày sinh',
    'Đã mất',
  ],
  [1, '1', 'Nguyễn Văn Tổ', 'Nam', 0, null, null, 'M1', '1890', 'Có'],
  [null, 'M1', 'Trần Thị Hiền', 'Nữ', 0, null, null, '1', null, 'Có'],
  [
    null,
    'M2',
    'Nguyễn Văn An',
    'Nam',
    null,
    '1',
    'M1',
    'M3',
    '12/04/1920',
    'Có',
  ],
  [null, 'M3', 'Lê Thị Bình', 'Nữ', null, null, null, 'M2', null, null],
  [null, 'M4', 'Nguyễn Văn Cường', 'Nam', null, 'M2', 'M3', null, '1955', null],
];

function buildGuideSheet(workbook: ExcelJS.Workbook) {
  const sheet = workbook.addWorksheet(GUIDE_SHEET_NAME);
  sheet.getColumn(1).width = 14;
  for (let c = 2; c <= 10; c++) sheet.getColumn(c).width = 16;
  sheet.getColumn(3).width = 22;

  GUIDE_LINES.forEach((line, i) => {
    const cell = sheet.getCell(i + 1, 1);
    cell.value = line;
    if (i === 0)
      cell.font = { bold: true, size: 14, color: { argb: 'FF92400E' } };
  });

  const start = GUIDE_LINES.length + 1;
  GUIDE_EXAMPLE.forEach((values, r) => {
    const row = sheet.getRow(start + r);
    values.forEach((value, c) => {
      const cell = row.getCell(c + 1);
      cell.value = value;
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD6D3D1' } },
        bottom: { style: 'thin', color: { argb: 'FFD6D3D1' } },
        left: { style: 'thin', color: { argb: 'FFD6D3D1' } },
        right: { style: 'thin', color: { argb: 'FFD6D3D1' } },
      };
      if (r === 0) {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: HEADER_FILL },
        };
      }
    });
  });
}

export async function buildPersonWorkbook(
  persons: ExportPerson[],
  relationships: ExportRelationship[],
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Cội Nguồn';
  workbook.created = new Date();
  buildPersonSheet(workbook, persons, relationships);
  buildGuideSheet(workbook);
  const data = await workbook.xlsx.writeBuffer();
  return Buffer.from(data);
}
