import ExcelJS from 'exceljs';
import {
  PERSON_EXCEL_COLUMNS,
  PERSON_SHEET_NAME,
} from './person-excel.columns.js';
import { planImport, readPersonRows } from './person-excel.planner.js';
import {
  buildPersonWorkbook,
  type ExportPerson,
  type ExportRelationship,
} from './person-excel.workbook.js';

function person(
  id: number,
  fullName: string,
  extra: Partial<ExportPerson> = {},
): ExportPerson {
  return {
    id,
    fullName,
    gender: null,
    generation: null,
    branch: 1,
    birthDate: null,
    deceased: false,
    deathDate: null,
    deathLunarDay: null,
    deathLunarMonth: null,
    birthPlace: null,
    currentLocation: null,
    education: null,
    occupation: null,
    religion: null,
    ethnicity: null,
    achievements: null,
    biography: null,
    graveInfo: null,
    ...extra,
  };
}

const persons: ExportPerson[] = [
  person(1, 'Thủy Tổ', { gender: 'male', generation: 0, deceased: true }),
  person(2, 'Bà Tổ', { gender: 'Nữ', generation: 0 }),
  person(3, 'Nguyễn Văn An', {
    gender: 'Nam',
    generation: 1,
    birthDate: new Date(Date.UTC(1920, 3, 12, 6, 42, 4)),
    deathDate: new Date(Date.UTC(1990, 0, 2)),
    deceased: true,
    deathLunarDay: 15,
    deathLunarMonth: 7,
    biography: { content: 'Tiểu sử' },
    graveInfo: { cemetery: 'Nghĩa trang làng', address: null },
  }),
];
// Trộn hai kiểu lưu: CHILD (con→cha) và MOTHER (mẹ→con).
const relationships: ExportRelationship[] = [
  { id: 10, fromId: 3, toId: 1, type: 'CHILD' },
  { id: 11, fromId: 2, toId: 3, type: 'MOTHER' },
  { id: 12, fromId: 1, toId: 2, type: 'SPOUSE' },
];
const snapshot = { persons, relationships };

async function workbookFromRows(
  rows: Record<string, unknown>[],
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(PERSON_SHEET_NAME);
  sheet.columns = PERSON_EXCEL_COLUMNS.map((c) => ({
    key: c.key,
    header: c.header,
  }));
  rows.forEach((row) => sheet.addRow(row));
  return Buffer.from(await workbook.xlsx.writeBuffer());
}

async function plan(rows: Record<string, unknown>[]) {
  const { rows: raw, errors } = await readPersonRows(
    await workbookFromRows(rows),
  );
  expect(errors).toEqual([]);
  return planImport(raw, snapshot);
}

describe('person excel import planner', () => {
  it('round-trips an export without changes', async () => {
    const buffer = await buildPersonWorkbook(persons, relationships);
    const { rows, errors } = await readPersonRows(buffer);
    expect(errors).toEqual([]);
    const result = planImport(rows, snapshot);
    expect(result.errors).toEqual([]);
    expect(result.summary).toMatchObject({
      totalRows: 3,
      create: 0,
      update: 0,
      unchanged: 3,
      parentLinks: 0,
      spouseLinks: 0,
    });
  });

  it('creates new people linked by codes and infers generation/branch', async () => {
    const result = await plan([
      {
        code: 'M1',
        fullName: 'Nguyễn Văn Bình',
        gender: 'Nam',
        fatherCode: '3',
        spouseCodes: 'M2',
      },
      { code: 'M2', fullName: 'Lê Thị Cúc', gender: 'Nữ' },
      {
        code: 'M3',
        fullName: 'Nguyễn Văn Dũng',
        fatherCode: 'm1',
        motherCode: 'M2',
        birthDate: '1975',
      },
    ]);
    expect(result.errors).toEqual([]);
    expect(result.summary).toMatchObject({
      create: 3,
      parentLinks: 3,
      spouseLinks: 1,
    });
    expect(result.rows[0].fields.generation).toBe(2);
    expect(result.rows[2].fields.generation).toBe(3);
    // Vợ mới (M2) cùng đời với chồng (M1).
    expect(result.rows[1].fields.generation).toBe(2);
    expect(result.rows[2].fields.birthDate?.toISOString()).toBe(
      '1975-01-01T00:00:00.000Z',
    );
  });

  it('updates only changed fields and replaces a parent', async () => {
    const result = await plan([
      {
        id: 3,
        code: '3',
        fullName: 'Nguyễn Văn An',
        occupation: 'Thầy đồ',
        fatherCode: 'M1',
      },
      { code: 'M1', fullName: 'Cha mới', gender: 'Nam' },
    ]);
    expect(result.errors).toEqual([]);
    expect(result.rows[0].fields).toEqual({ occupation: 'Thầy đồ' });
    expect(result.summary).toMatchObject({
      create: 1,
      update: 1,
      parentReplaced: 1,
    });
    expect(result.parentChanges[0].removeRelationshipIds).toEqual([10]);
    expect(result.warnings).toHaveLength(1);
  });

  it('reports validation errors with row numbers', async () => {
    const result = await plan([
      {
        code: 'A',
        fullName: 'Người A',
        gender: 'abc',
        birthDate: '31/02/1990',
      },
      { code: 'A', fullName: 'Trùng mã' },
      { code: 'B', fatherCode: 'ZZZ' },
      { id: 999, code: 'C', fullName: 'Sai ID' },
      { code: '2', fullName: 'Mã trùng ID' },
      { code: 'D', fullName: 'Mẹ là nam', motherCode: '1' },
    ]);
    const messages = result.errors.map((e) => `${e.row}: ${e.message}`);
    expect(messages).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/^2: giới tính/),
        expect.stringMatching(/^2: ngày "31\/02\/1990"/),
        expect.stringMatching(/^3: Mã "A" bị trùng/),
        expect.stringMatching(/^4: Người mới phải có/),
        expect.stringMatching(/^4: Mã cha "ZZZ"/),
        expect.stringMatching(/^5: ID 999/),
        expect.stringMatching(/^6: Mã "2" trùng ID/),
        expect.stringMatching(/^7: Mã mẹ "1" là người giới tính Nam/),
      ]),
    );
  });

  it('rejects ancestor cycles', async () => {
    const result = await plan([
      { id: 1, code: '1', fullName: 'Thủy Tổ', fatherCode: '3' },
    ]);
    expect(result.errors.map((e) => e.message)).toEqual(
      expect.arrayContaining([expect.stringMatching(/vòng lặp/)]),
    );
  });
});
