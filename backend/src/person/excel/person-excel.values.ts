import type { CellValue } from 'exceljs';

/** Lấy giá trị hiển thị của một ô (chuỗi đã trim, rỗng → null). Date giữ nguyên. */
export function cellToRaw(value: CellValue): string | number | Date | null {
  if (value == null) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'number') return value;
  if (typeof value === 'boolean') return value ? 'Có' : 'Không';
  if (typeof value === 'string') return value.trim() || null;
  if (typeof value === 'object') {
    if ('richText' in value) {
      const text = value.richText.map((part) => part.text).join('');
      return text.trim() || null;
    }
    if ('result' in value) {
      return cellToRaw(value.result);
    }
    if ('text' in value && typeof value.text === 'string') {
      return value.text.trim() || null;
    }
  }
  return null;
}

export function rawToText(raw: string | number | Date | null): string | null {
  if (raw == null) return null;
  if (raw instanceof Date) return formatDate(raw);
  return String(raw).trim() || null;
}

export type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

const ok = <T>(value: T): ParseResult<T> => ({ ok: true, value });
const fail = <T>(error: string): ParseResult<T> => ({ ok: false, error });

function utcDate(year: number, month: number, day: number): Date | null {
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}

const MIN_YEAR = 1000;
const MAX_YEAR = 2100;

/** dd/mm/yyyy, d-m-yyyy, yyyy-mm-dd, yyyy, hoặc ô kiểu ngày của Excel. */
export function parseDate(
  raw: string | number | Date | null,
): ParseResult<Date | null> {
  if (raw == null) return ok(null);
  if (raw instanceof Date) {
    // Excel lưu ngày không có múi giờ; exceljs trả về UTC.
    return ok(
      utcDate(raw.getUTCFullYear(), raw.getUTCMonth() + 1, raw.getUTCDate()),
    );
  }
  const text = String(raw).trim();
  const invalid = fail<Date | null>(
    `ngày "${text}" không hợp lệ (dùng dd/mm/yyyy)`,
  );

  if (/^\d{4}$/.test(text)) {
    const year = Number(text);
    if (year < MIN_YEAR || year > MAX_YEAR) return invalid;
    return ok(utcDate(year, 1, 1));
  }
  let match = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/.exec(text);
  if (match) {
    const date = utcDate(Number(match[3]), Number(match[2]), Number(match[1]));
    return date ? ok(date) : invalid;
  }
  match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(text);
  if (match) {
    const date = utcDate(Number(match[1]), Number(match[2]), Number(match[3]));
    return date ? ok(date) : invalid;
  }
  return invalid;
}

export function formatDate(date: Date | null | undefined): string | null {
  if (!date) return null;
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${date.getUTCFullYear()}`;
}

export function parseInteger(
  raw: string | number | Date | null,
  label: string,
  min: number,
  max: number,
): ParseResult<number | null> {
  if (raw == null) return ok(null);
  const value = typeof raw === 'number' ? raw : Number(String(raw).trim());
  if (!Number.isInteger(value) || value < min || value > max) {
    return fail(`${label} phải là số nguyên từ ${min} đến ${max}`);
  }
  return ok(value);
}

function fold(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .trim();
}

export const GENDER_MALE = 'Nam';
export const GENDER_FEMALE = 'Nữ';

export function parseGender(
  raw: string | number | Date | null,
): ParseResult<string | null> {
  const text = rawToText(raw);
  if (text == null) return ok(null);
  const g = fold(text);
  if (['nam', 'male', 'm', 'trai'].includes(g)) return ok(GENDER_MALE);
  if (['nu', 'female', 'f', 'gai'].includes(g)) return ok(GENDER_FEMALE);
  return fail(`giới tính "${text}" không hợp lệ (Nam/Nữ)`);
}

/** Giới tính lưu không đồng nhất ('male' / 'Nam'). */
export function genderKind(
  gender: string | null | undefined,
): 'male' | 'female' | null {
  if (!gender) return null;
  const g = fold(gender);
  if (g === 'male' || g === 'nam' || g === 'm') return 'male';
  if (g === 'female' || g === 'nu' || g === 'f') return 'female';
  return null;
}

export function parseYesNo(
  raw: string | number | Date | null,
): ParseResult<boolean | null> {
  const text = rawToText(raw);
  if (text == null) return ok(null);
  const v = fold(text);
  if (['co', 'x', '1', 'true', 'yes', 'da mat', 'roi'].includes(v))
    return ok(true);
  if (['khong', '0', 'false', 'no', 'con song', 'chua'].includes(v))
    return ok(false);
  return fail(`"Đã mất" = "${text}" không hợp lệ (Có/Không)`);
}

/** "M1, M2; M3" → ["M1","M2","M3"]. */
export function splitCodes(raw: string | number | Date | null): string[] {
  const text = rawToText(raw);
  if (text == null) return [];
  return text
    .split(/[,;\n]/)
    .map((part) => part.trim())
    .filter(Boolean);
}
