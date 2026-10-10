import ExcelJS from 'exceljs';
import {
  HEADER_TO_KEY,
  normalizeHeader,
  PERSON_SHEET_NAME,
  type PersonExcelColumnKey,
} from './person-excel.columns.js';
import {
  buildFamilyIndex,
  findParent,
  type FamilyIndex,
} from './person-excel.relations.js';
import type {
  ExportPerson,
  ExportRelationship,
} from './person-excel.workbook.js';
import {
  cellToRaw,
  formatDate,
  genderKind,
  parseDate,
  parseGender,
  parseInteger,
  parseYesNo,
  rawToText,
  splitCodes,
  type ParseResult,
} from './person-excel.values.js';

export const MAX_IMPORT_ROWS = 3000;

/** Các cột Person có thể ghi từ Excel. */
export type PersonFields = {
  fullName?: string;
  gender?: string;
  generation?: number;
  branch?: number;
  birthDate?: Date;
  deceased?: boolean;
  deathDate?: Date | null;
  deathLunarDay?: number | null;
  deathLunarMonth?: number | null;
  birthPlace?: string;
  currentLocation?: string;
  education?: string;
  occupation?: string;
  religion?: string;
  ethnicity?: string;
  achievements?: string;
};

export type ImportIssue = { row: number; message: string };

type Ref = { kind: 'existing'; id: number } | { kind: 'new'; index: number };

export type PlannedRow = {
  row: number;
  code: string;
  existingId: number | null;
  fields: PersonFields;
  biography?: string;
  grave?: { cemetery?: string; address?: string };
  /** Xóa thông tin mộ (khi chuyển "Đã mất" → "Không"). */
  clearGrave: boolean;
  father: Ref | null;
  mother: Ref | null;
  spouses: Ref[];
};

export type ParentChange = {
  child: Ref;
  parent: Ref;
  role: 'father' | 'mother';
  /** Relationship cũ cần xóa (cha/mẹ trước đó). */
  removeRelationshipIds: number[];
};

export type ImportPlan = {
  rows: PlannedRow[];
  errors: ImportIssue[];
  warnings: ImportIssue[];
  createRows: number[];
  updateRows: number[];
  parentChanges: ParentChange[];
  spousePairs: [Ref, Ref][];
  summary: {
    totalRows: number;
    create: number;
    update: number;
    unchanged: number;
    parentLinks: number;
    parentReplaced: number;
    spouseLinks: number;
  };
};

type Snapshot = {
  persons: ExportPerson[];
  relationships: ExportRelationship[];
};

type RawRow = {
  row: number;
  values: Partial<Record<PersonExcelColumnKey, string | number | Date | null>>;
};

function codeKey(code: string): string {
  return code.trim().toUpperCase();
}

export async function readPersonRows(
  buffer: Buffer,
): Promise<{ rows: RawRow[]; errors: ImportIssue[] }> {
  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.load(buffer as unknown as ArrayBuffer);
  } catch {
    return {
      rows: [],
      errors: [
        {
          row: 0,
          message: 'Không đọc được file. Hãy dùng file .xlsx tải từ Cội Nguồn.',
        },
      ],
    };
  }
  const sheet =
    workbook.getWorksheet(PERSON_SHEET_NAME) ??
    workbook.worksheets.find(
      (ws) => normalizeHeader(ws.name) === normalizeHeader(PERSON_SHEET_NAME),
    ) ??
    workbook.worksheets[0];
  if (!sheet) {
    return {
      rows: [],
      errors: [{ row: 0, message: 'File không có sheet nào.' }],
    };
  }

  const columnKeys = new Map<number, PersonExcelColumnKey>();
  sheet.getRow(1).eachCell((cell, col) => {
    const text = rawToText(cellToRaw(cell.value));
    const key = text ? HEADER_TO_KEY.get(normalizeHeader(text)) : undefined;
    if (key) columnKeys.set(col, key);
  });
  const found = new Set(columnKeys.values());
  const missing = (['code', 'fullName'] as const).filter((k) => !found.has(k));
  if (missing.length) {
    return {
      rows: [],
      errors: [
        {
          row: 1,
          message: `Thiếu cột bắt buộc ${missing.map((k) => (k === 'code' ? '"Mã *"' : '"Họ và tên *"')).join(', ')}. Hãy dùng file mẫu và giữ nguyên dòng tiêu đề.`,
        },
      ],
    };
  }

  const rows: RawRow[] = [];
  sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return;
    const values: RawRow['values'] = {};
    let hasValue = false;
    for (const [col, key] of columnKeys) {
      const raw = cellToRaw(row.getCell(col).value);
      if (raw != null) {
        values[key] = raw;
        hasValue = true;
      }
    }
    if (hasValue) rows.push({ row: rowNumber, values });
  });

  if (rows.length > MAX_IMPORT_ROWS) {
    return {
      rows: [],
      errors: [
        {
          row: 0,
          message: `File có ${rows.length} dòng, tối đa ${MAX_IMPORT_ROWS} dòng mỗi lần.`,
        },
      ],
    };
  }
  return { rows, errors: [] };
}

const TEXT_FIELDS = [
  'birthPlace',
  'currentLocation',
  'education',
  'occupation',
  'religion',
  'ethnicity',
  'achievements',
] as const;

type ParsedRow = {
  row: number;
  code: string | null;
  id: number | null;
  fields: PersonFields;
  biography?: string;
  grave?: { cemetery?: string; address?: string };
  fatherCode: string | null;
  motherCode: string | null;
  spouseCodes: string[];
};

function parseRow(raw: RawRow, errors: ImportIssue[]): ParsedRow {
  const v = raw.values;
  const fields: PersonFields = {};
  const err = (message: string) => errors.push({ row: raw.row, message });
  const take = <T>(result: ParseResult<T>): T | null => {
    if (result.ok) return result.value;
    err(result.error);
    return null;
  };

  const idResult = take(
    parseInteger(v.id ?? null, 'ID hệ thống', 1, Number.MAX_SAFE_INTEGER),
  );
  const code = rawToText(v.code ?? null);

  const fullName = rawToText(v.fullName ?? null);
  if (fullName) fields.fullName = fullName;
  const gender = take(parseGender(v.gender ?? null));
  if (gender) fields.gender = gender;
  const generation = take(parseInteger(v.generation ?? null, 'Đời', 0, 50));
  if (generation != null) fields.generation = generation;
  const branch = take(parseInteger(v.branch ?? null, 'Chi', 1, 3));
  if (branch != null) fields.branch = branch;
  const birthDate = take(parseDate(v.birthDate ?? null));
  if (birthDate) fields.birthDate = birthDate;
  const deathDate = take(parseDate(v.deathDate ?? null));
  if (deathDate) fields.deathDate = deathDate;
  const lunarDay = take(
    parseInteger(v.deathLunarDay ?? null, 'Giỗ - ngày âm', 1, 30),
  );
  if (lunarDay != null) fields.deathLunarDay = lunarDay;
  const lunarMonth = take(
    parseInteger(v.deathLunarMonth ?? null, 'Giỗ - tháng âm', 1, 12),
  );
  if (lunarMonth != null) fields.deathLunarMonth = lunarMonth;
  const deceased = take(parseYesNo(v.deceased ?? null));

  const hasDeathInfo =
    deathDate != null || lunarDay != null || lunarMonth != null;
  if (deceased === false && hasDeathInfo) {
    err('"Đã mất" = Không nhưng lại có ngày mất / ngày giỗ');
  }
  if (deceased != null) fields.deceased = deceased;
  else if (hasDeathInfo) fields.deceased = true;

  for (const key of TEXT_FIELDS) {
    const text = rawToText(v[key] ?? null);
    if (text) fields[key] = text;
  }

  const biography = rawToText(v.biography ?? null) ?? undefined;
  const cemetery = rawToText(v.cemetery ?? null) ?? undefined;
  const address = rawToText(v.graveAddress ?? null) ?? undefined;

  return {
    row: raw.row,
    code,
    id: idResult,
    fields,
    biography,
    grave: cemetery || address ? { cemetery, address } : undefined,
    fatherCode: rawToText(v.fatherCode ?? null),
    motherCode: rawToText(v.motherCode ?? null),
    spouseCodes: splitCodes(v.spouseCodes ?? null),
  };
}

function sameValue(a: unknown, b: unknown): boolean {
  if (a instanceof Date || b instanceof Date) {
    // So theo ngày: dữ liệu cũ có thể kèm giờ, Excel chỉ có ngày.
    return (
      a instanceof Date && b instanceof Date && formatDate(a) === formatDate(b)
    );
  }
  return (a ?? null) === (b ?? null);
}

/** Bỏ các trường không đổi so với dữ liệu cũ. */
function diffFields(
  fields: PersonFields,
  existing: ExportPerson,
): PersonFields {
  const changed: PersonFields = {};
  for (const [key, value] of Object.entries(fields) as [
    keyof PersonFields,
    unknown,
  ][]) {
    const current =
      key === 'gender'
        ? existing.gender
        : (existing[key as keyof ExportPerson] as unknown);
    if (
      key === 'gender' &&
      genderKind(existing.gender) === genderKind(value as string)
    )
      continue;
    if (!sameValue(value, current))
      (changed as Record<string, unknown>)[key] = value;
  }
  return changed;
}

export function planImport(rawRows: RawRow[], snapshot: Snapshot): ImportPlan {
  const errors: ImportIssue[] = [];
  const warnings: ImportIssue[] = [];
  const personsById = new Map(snapshot.persons.map((p) => [p.id, p]));
  const index: FamilyIndex = buildFamilyIndex(
    snapshot.persons,
    snapshot.relationships,
  );

  const parsed = rawRows.map((raw) => parseRow(raw, errors));

  // 1. Mã → người (đã có hoặc dòng mới).
  const refs = new Map<string, Ref>();
  const seenIds = new Map<number, number>();
  parsed.forEach((row, i) => {
    if (!row.code) {
      errors.push({ row: row.row, message: 'Thiếu "Mã"' });
      return;
    }
    const key = codeKey(row.code);
    if (refs.has(key)) {
      errors.push({ row: row.row, message: `Mã "${row.code}" bị trùng` });
      return;
    }
    if (row.id != null) {
      if (!personsById.has(row.id)) {
        errors.push({
          row: row.row,
          message: `ID ${row.id} không có trong dòng họ này`,
        });
        return;
      }
      const dupRow = seenIds.get(row.id);
      if (dupRow != null) {
        errors.push({
          row: row.row,
          message: `ID ${row.id} lặp lại (đã có ở dòng ${dupRow})`,
        });
        return;
      }
      seenIds.set(row.id, row.row);
      refs.set(key, { kind: 'existing', id: row.id });
    } else {
      if (/^\d+$/.test(key) && personsById.has(Number(key))) {
        errors.push({
          row: row.row,
          message: `Mã "${row.code}" trùng ID của người đã có trên cây — người mới hãy đặt mã khác (vd. M1)`,
        });
        return;
      }
      if (!row.fields.fullName) {
        errors.push({ row: row.row, message: 'Người mới phải có "Họ và tên"' });
      }
      refs.set(key, { kind: 'new', index: i });
    }
  });
  // ID của người đã có cũng dùng làm mã được (dù không có dòng trong file).
  for (const id of personsById.keys()) {
    const key = String(id);
    if (!refs.has(key)) refs.set(key, { kind: 'existing', id });
  }

  const resolve = (
    code: string | null,
    row: number,
    label: string,
  ): Ref | null => {
    if (!code) return null;
    const ref = refs.get(codeKey(code));
    if (!ref) {
      errors.push({
        row,
        message: `${label} "${code}" không tìm thấy trong file hoặc trên cây`,
      });
      return null;
    }
    return ref;
  };
  const refEquals = (a: Ref | null, b: Ref | null) =>
    !!a &&
    !!b &&
    a.kind === b.kind &&
    (a.kind === 'existing'
      ? a.id === (b as typeof a).id
      : a.index === (b as typeof a).index);
  const refId = (r: Ref) =>
    r.kind === 'existing' ? `e${r.id}` : `n${r.index}`;

  // 2. Giới tính cuối cùng của mỗi người (để kiểm tra cha/mẹ).
  const finalGender = (ref: Ref): 'male' | 'female' | null => {
    if (ref.kind === 'new') return genderKind(parsed[ref.index].fields.gender);
    const row = parsed.find((p) => p.id === ref.id);
    return genderKind(row?.fields.gender ?? personsById.get(ref.id)?.gender);
  };

  const rows: PlannedRow[] = parsed.map((row) => {
    const self = row.code ? (refs.get(codeKey(row.code)) ?? null) : null;
    const father = resolve(row.fatherCode, row.row, 'Mã cha');
    const mother = resolve(row.motherCode, row.row, 'Mã mẹ');
    const spouses = row.spouseCodes
      .map((code) => resolve(code, row.row, 'Mã vợ/chồng'))
      .filter((r): r is Ref => r != null);

    if (self && [father, mother, ...spouses].some((r) => refEquals(r, self))) {
      errors.push({
        row: row.row,
        message: 'Không thể tự làm cha/mẹ/vợ chồng của chính mình',
      });
    }
    if (father && mother && refEquals(father, mother)) {
      errors.push({ row: row.row, message: 'Cha và mẹ là cùng một người' });
    }
    if (father && finalGender(father) === 'female') {
      errors.push({
        row: row.row,
        message: `Mã cha "${row.fatherCode}" là người giới tính Nữ`,
      });
    }
    if (mother && finalGender(mother) === 'male') {
      errors.push({
        row: row.row,
        message: `Mã mẹ "${row.motherCode}" là người giới tính Nam`,
      });
    }

    const existing = row.id != null ? personsById.get(row.id) : undefined;
    const clearing =
      existing != null &&
      row.fields.deceased === false &&
      (existing.deceased || existing.deathDate != null);
    const fields = { ...row.fields };
    if (clearing) {
      fields.deathDate = null;
      fields.deathLunarDay = null;
      fields.deathLunarMonth = null;
    }

    return {
      row: row.row,
      code: row.code ?? '',
      existingId: existing ? existing.id : null,
      fields: existing ? diffFields(fields, existing) : fields,
      biography:
        row.biography != null &&
        row.biography !== (existing?.biography?.content ?? null)
          ? row.biography
          : undefined,
      grave:
        row.grave &&
        (!existing ||
          (row.grave.cemetery ?? existing.graveInfo?.cemetery ?? null) !==
            (existing.graveInfo?.cemetery ?? null) ||
          (row.grave.address ?? existing.graveInfo?.address ?? null) !==
            (existing.graveInfo?.address ?? null))
          ? row.grave
          : undefined,
      clearGrave: clearing && existing?.graveInfo != null,
      father,
      mother,
      spouses,
    };
  });

  // 3. Đời / chi cho người mới: theo cha (hoặc mẹ), không có thì theo vợ/chồng.
  const generationOf = (ref: Ref): number | null => {
    if (ref.kind === 'new') return rows[ref.index].fields.generation ?? null;
    const row = rows.find((r) => r.existingId === ref.id);
    return (
      row?.fields.generation ?? personsById.get(ref.id)?.generation ?? null
    );
  };
  const branchOf = (ref: Ref): number | null => {
    if (ref.kind === 'new') return rows[ref.index].fields.branch ?? null;
    const row = rows.find((r) => r.existingId === ref.id);
    return row?.fields.branch ?? personsById.get(ref.id)?.branch ?? null;
  };
  // Vợ/chồng của người mới, khai ở dòng nào cũng được.
  const spousesOfNew = new Map<number, Ref[]>();
  rows.forEach((row, i) => {
    const self: Ref =
      row.existingId != null
        ? { kind: 'existing', id: row.existingId }
        : { kind: 'new', index: i };
    for (const spouse of row.spouses) {
      if (self.kind === 'new') {
        spousesOfNew.set(i, [...(spousesOfNew.get(i) ?? []), spouse]);
      }
      if (spouse.kind === 'new') {
        const list = spousesOfNew.get(spouse.index) ?? [];
        spousesOfNew.set(spouse.index, [...list, self]);
      }
    }
  });
  for (
    let pass = 0, changed = true;
    changed && pass < rows.length + 1;
    pass++
  ) {
    changed = false;
    for (const row of rows) {
      if (row.existingId != null) continue;
      const parent = row.father ?? row.mother;
      const spouse = spousesOfNew.get(rows.indexOf(row))?.[0];
      const source = parent ?? spouse;
      if (!source) continue;
      if (row.fields.generation == null) {
        const g = generationOf(source);
        if (g != null) {
          // Con = đời cha mẹ + 1; vợ/chồng cùng đời.
          row.fields.generation = parent ? g + 1 : g;
          changed = true;
        }
      }
      if (row.fields.branch == null) {
        const b = branchOf(source);
        if (b != null) {
          row.fields.branch = b;
          changed = true;
        }
      }
    }
  }
  for (const row of rows) {
    if (row.existingId == null) {
      row.fields.branch ??= 1;
      row.fields.deceased ??= false;
    }
  }

  // 4. Quan hệ cha/mẹ cần thêm hoặc thay.
  const parentChanges: ParentChange[] = [];
  rows.forEach((row, i) => {
    const child: Ref =
      row.existingId != null
        ? { kind: 'existing', id: row.existingId }
        : { kind: 'new', index: i };
    for (const role of ['father', 'mother'] as const) {
      const parent = row[role];
      if (!parent) continue;
      if (child.kind === 'existing' && parent.kind === 'existing') {
        const links = index.parentsOf.get(child.id) ?? [];
        if (links.some((l) => l.parentId === parent.id)) continue;
      }
      const current =
        child.kind === 'existing'
          ? findParent(index, child.id, role)
          : undefined;
      if (current) {
        const name =
          personsById.get(current.parentId)?.fullName ?? current.parentId;
        warnings.push({
          row: row.row,
          message: `Thay ${role === 'father' ? 'cha' : 'mẹ'} cũ (${name}) bằng người mới chỉ định`,
        });
      }
      parentChanges.push({
        child,
        parent,
        role,
        removeRelationshipIds: current?.relationshipIds ?? [],
      });
    }
  });

  // 5. Vợ chồng (chỉ thêm, không xóa).
  const spousePairs: [Ref, Ref][] = [];
  const seenPairs = new Set<string>();
  rows.forEach((row, i) => {
    const self: Ref =
      row.existingId != null
        ? { kind: 'existing', id: row.existingId }
        : { kind: 'new', index: i };
    for (const spouse of row.spouses) {
      if (refEquals(self, spouse)) continue;
      const key = [refId(self), refId(spouse)].sort().join('|');
      if (seenPairs.has(key)) continue;
      seenPairs.add(key);
      if (
        self.kind === 'existing' &&
        spouse.kind === 'existing' &&
        index.spousesOf.get(self.id)?.has(spouse.id)
      ) {
        continue;
      }
      spousePairs.push([self, spouse]);
    }
  });

  // 6. Không cho vòng lặp tổ tiên (A là cha B, B là cha A…).
  const parentGraph = new Map<string, string[]>();
  for (const [childId, links] of index.parentsOf) {
    parentGraph.set(
      `e${childId}`,
      links.map((l) => `e${l.parentId}`),
    );
  }
  for (const change of parentChanges) {
    const key = refId(change.child);
    const removed = new Set(
      (
        index.parentsOf.get(
          change.child.kind === 'existing' ? change.child.id : -1,
        ) ?? []
      )
        .filter((l) =>
          change.removeRelationshipIds.some((id) =>
            l.relationshipIds.includes(id),
          ),
        )
        .map((l) => `e${l.parentId}`),
    );
    const list = (parentGraph.get(key) ?? []).filter((p) => !removed.has(p));
    list.push(refId(change.parent));
    parentGraph.set(key, list);
  }
  const state = new Map<string, 1 | 2>();
  const cycleRows = new Set<number>();
  const visit = (node: string): boolean => {
    if (state.get(node) === 2) return false;
    if (state.get(node) === 1) return true;
    state.set(node, 1);
    const hit = (parentGraph.get(node) ?? []).some(visit);
    state.set(node, 2);
    return hit;
  };
  for (const change of parentChanges) {
    state.clear();
    if (visit(refId(change.child))) {
      const row =
        change.child.kind === 'new'
          ? rows[change.child.index].row
          : (rows.find(
              (r) => r.existingId === (change.child as { id: number }).id,
            )?.row ?? 0);
      cycleRows.add(row);
    }
  }
  for (const row of cycleRows) {
    errors.push({
      row,
      message:
        'Quan hệ cha/mẹ tạo thành vòng lặp (một người vừa là tổ tiên vừa là con cháu)',
    });
  }

  const createRows = rows
    .map((r, i) => (r.existingId == null ? i : -1))
    .filter((i) => i >= 0);
  const updateRows = rows
    .map((r, i) =>
      r.existingId != null &&
      (Object.keys(r.fields).length > 0 ||
        r.biography != null ||
        r.grave ||
        r.clearGrave)
        ? i
        : -1,
    )
    .filter((i) => i >= 0);

  errors.sort((a, b) => a.row - b.row);
  warnings.sort((a, b) => a.row - b.row);

  return {
    rows,
    errors,
    warnings,
    createRows,
    updateRows,
    parentChanges,
    spousePairs,
    summary: {
      totalRows: rows.length,
      create: createRows.length,
      update: updateRows.length,
      unchanged: rows.length - createRows.length - updateRows.length,
      parentLinks: parentChanges.length,
      parentReplaced: parentChanges.filter(
        (c) => c.removeRelationshipIds.length > 0,
      ).length,
      spouseLinks: spousePairs.length,
    },
  };
}
