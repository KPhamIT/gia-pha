import { api } from "@/lib/api";
import { getStoredOrgAccessToken } from "@/lib/org/org-access";
import {
  fetchUserSettings,
  patchUserSettingsCache,
} from "@/lib/settings/user-settings-cache";
import type { UserSettings } from "@/lib/api/modules/settings";
import { STORAGE_KEYS } from "@/lib/constants/storage-keys";
import {
  DEFAULT_USER_SETTINGS,
  type OrgBookContext,
} from "@/lib/settings/default-user-settings";
import {
  parseCoverSubtitleClanName,
  resolveCoverSubtitleClanName,
} from "./book-cover-subtitle";
import { DEFAULT_CALLIGRAPHY_FONT_ID } from "./calligraphy-fonts";
import {
  DEFAULT_BORDER_STYLE_ID,
  isBorderStyleId,
} from "./page-border-styles";
import {
  DEFAULT_FORM_STYLE_ID,
  isFormStyleId,
} from "./page-form-styles";
import { type BookPageConfig, normalizePageConfig } from "./book-page-config";

/** Key under which book settings live inside the user's settings JSON blob. */
const BOOK_SETTINGS_KEY = "book";

/**
 * Book-wide presentation settings + editable cover/preface content.
 * Persisted per device in localStorage (no backend field exists yet).
 */
export type BookSettings = {
  coverTitle: string;
  coverSubtitle: string;
  coverLineage: string;
  /** Năm lập gia phả — hiển thị dọc góc trên trái. */
  coverEstablishedYear: string;
  /** Địa chỉ dòng họ — hiển thị dọc góc dưới phải. */
  coverClanAddress: string;
  coverFontId: string;
  prefaceTitle: string;
  prefaceBody: string;
  prefaceSignature: string;
  borderStyleId: string;
  formStyleId: string;
  /** Per-person visibility / ordering overrides for the book pages. */
  pageConfig: BookPageConfig;
};

/** Cover text fields — chỉ lưu khi user bấm nút Lưu trên trang bìa (không gồm năm/địa chỉ org). */
export const COVER_CONTENT_KEYS = [
  "coverTitle",
  "coverSubtitle",
  "coverLineage",
] as const satisfies readonly (keyof BookSettings)[];

export function isCoverContentPatch(patch: Partial<BookSettings>): boolean {
  return COVER_CONTENT_KEYS.some((key) => key in patch);
}

export function isCoverContentDirty(
  current: BookSettings,
  persisted: BookSettings,
): boolean {
  return COVER_CONTENT_KEYS.some((key) => current[key] !== persisted[key]);
}

export function bookSettingsAutoSaveSnapshot(settings: BookSettings): string {
  const {
    coverTitle,
    coverSubtitle,
    coverLineage,
    coverEstablishedYear,
    coverClanAddress,
    ...auto
  } = settings;
  void coverTitle;
  void coverSubtitle;
  void coverLineage;
  void coverEstablishedYear;
  void coverClanAddress;
  return JSON.stringify(auto);
}

export function mergeBookSettingsForAutoPersist(
  current: BookSettings,
  persisted: BookSettings,
): BookSettings {
  return {
    ...current,
    coverTitle: persisted.coverTitle,
    coverSubtitle: persisted.coverSubtitle,
    coverLineage: persisted.coverLineage,
    coverEstablishedYear: persisted.coverEstablishedYear,
    coverClanAddress: persisted.coverClanAddress,
  };
}

/** Điền mặc định bìa khi trường còn trống. coverSubtitle chỉ lưu tên dòng họ (không gồm "Dòng họ"). */
export function resolveBookSettings(
  settings: BookSettings,
  org?: OrgBookContext | null,
): BookSettings {
  const next = { ...settings };
  next.coverSubtitle = resolveCoverSubtitleClanName(next.coverSubtitle, org);
  return next;
}

/** Chuẩn hóa giá trị đã lưu trước khi persist (bỏ prefix "Dòng họ" nếu có). */
export function normalizeCoverSubtitleForPersist(
  stored: string,
  org?: OrgBookContext | null,
): string {
  return parseCoverSubtitleClanName(stored, org?.name).trim();
}

function buildDefaultBookSettings(): BookSettings {
  const raw = DEFAULT_USER_SETTINGS.book as Partial<BookSettings>;
  const borderStyleId =
    raw.borderStyleId && isBorderStyleId(raw.borderStyleId)
      ? raw.borderStyleId
      : DEFAULT_BORDER_STYLE_ID;
  const formStyleId =
    raw.formStyleId && isFormStyleId(raw.formStyleId)
      ? raw.formStyleId
      : DEFAULT_FORM_STYLE_ID;

  return {
    coverTitle: raw.coverTitle ?? "",
    coverSubtitle: raw.coverSubtitle ?? "",
    coverLineage: raw.coverLineage ?? "",
    coverEstablishedYear: raw.coverEstablishedYear ?? "",
    coverClanAddress: raw.coverClanAddress ?? "",
    coverFontId: raw.coverFontId ?? DEFAULT_CALLIGRAPHY_FONT_ID,
    prefaceTitle: raw.prefaceTitle ?? "",
    prefaceBody: raw.prefaceBody ?? "",
    prefaceSignature: raw.prefaceSignature ?? "",
    borderStyleId,
    formStyleId,
    pageConfig: normalizePageConfig(raw.pageConfig),
  };
}

export function defaultBookSettings(): BookSettings {
  return buildDefaultBookSettings();
}

export function bookSettingsFromUserSettings(
  all: UserSettings | null | undefined,
): BookSettings | null {
  const book = all?.[BOOK_SETTINGS_KEY];
  if (!book || typeof book !== "object") return null;
  return normalizeBookSettings(book as Partial<BookSettings>);
}

/** Merge an untrusted partial onto defaults and drop stale style ids. */
export function normalizeBookSettings(
  partial: Partial<BookSettings> | null | undefined,
  base?: BookSettings,
): BookSettings {
  const defaults = base ?? buildDefaultBookSettings();
  const merged: BookSettings = { ...defaults, ...(partial ?? {}) };
  if (!isBorderStyleId(merged.borderStyleId))
    merged.borderStyleId = defaults.borderStyleId;
  if (!isFormStyleId(merged.formStyleId)) merged.formStyleId = defaults.formStyleId;
  merged.pageConfig = normalizePageConfig(merged.pageConfig);
  return merged;
}

// ---------- Local (per-device cache / offline fallback) ----------

/** localStorage key scoped per user — tránh lẫn settings khi đổi tài khoản trên cùng trình duyệt. */
export function bookSettingsStorageKey(
  userId: number | null | undefined,
  orgAccessToken?: string | null,
): string {
  if (userId != null) return `${STORAGE_KEYS.BOOK_SETTINGS}:${userId}`;
  const token = orgAccessToken ?? getStoredOrgAccessToken();
  if (token) return `${STORAGE_KEYS.BOOK_SETTINGS}:guest:${token}`;
  return `${STORAGE_KEYS.BOOK_SETTINGS}:guest`;
}

export function loadBookSettings(
  userId: number | null | undefined,
  orgAccessToken?: string | null,
): BookSettings {
  if (typeof window === "undefined") return defaultBookSettings();
  try {
    const raw = window.localStorage.getItem(
      bookSettingsStorageKey(userId, orgAccessToken),
    );
    return normalizeBookSettings(
      raw ? (JSON.parse(raw) as Partial<BookSettings>) : null,
    );
  } catch {
    return defaultBookSettings();
  }
}

export function saveBookSettings(
  settings: BookSettings,
  userId: number | null | undefined,
  orgAccessToken?: string | null,
): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      bookSettingsStorageKey(userId, orgAccessToken),
      JSON.stringify(settings),
    );
  } catch {
    /* ignore quota / serialization errors */
  }
}

// ---------- Backend (cross-device persistence via user settings) ----------

/** Reads book settings stored under the `book` key of the user settings blob. */
export async function fetchRemoteBookSettings(): Promise<BookSettings | null> {
  const all = await fetchUserSettings();
  return bookSettingsFromUserSettings(all);
}

/** Persists book settings to the backend without touching other settings keys. */
export async function persistRemoteBookSettings(
  settings: BookSettings,
): Promise<void> {
  await api.settings.upsert({ [BOOK_SETTINGS_KEY]: settings });
  patchUserSettingsCache({ [BOOK_SETTINGS_KEY]: settings });
}
