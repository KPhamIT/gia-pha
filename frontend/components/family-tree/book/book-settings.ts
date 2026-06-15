import { api } from '@/lib/api';
import { fetchUserSettings, patchUserSettingsCache } from '@/lib/settings/user-settings-cache';
import { STORAGE_KEYS } from '@/lib/constants/storage-keys';
import { UI } from '@/lib/constants/ui-strings';
import { DEFAULT_BORDER_STYLE_ID, isBorderStyleId } from './page-border-styles';
import { DEFAULT_FORM_STYLE_ID, isFormStyleId } from './page-form-styles';
import { DEFAULT_CALLIGRAPHY_FONT_ID } from './calligraphy-fonts';
import { type BookPageConfig, normalizePageConfig } from './book-page-config';

/** Key under which book settings live inside the user's settings JSON blob. */
const BOOK_SETTINGS_KEY = 'book';

/**
 * Book-wide presentation settings + editable cover/preface content.
 * Persisted per device in localStorage (no backend field exists yet).
 */
export type BookSettings = {
  coverTitle: string;
  coverSubtitle: string;
  coverLineage: string;
  coverFontId: string;
  prefaceTitle: string;
  prefaceBody: string;
  prefaceSignature: string;
  borderStyleId: string;
  formStyleId: string;
  /** Per-person visibility / ordering overrides for the book pages. */
  pageConfig: BookPageConfig;
};

export function defaultBookSettings(): BookSettings {
  return {
    coverTitle: UI.BOOK_COVER_DEFAULT_TITLE,
    coverSubtitle: UI.BOOK_COVER_DEFAULT_SUBTITLE,
    coverLineage: UI.BOOK_COVER_DEFAULT_LINEAGE,
    coverFontId: DEFAULT_CALLIGRAPHY_FONT_ID,
    prefaceTitle: UI.BOOK_PREFACE_TITLE_DEFAULT,
    prefaceBody: '',
    prefaceSignature: '',
    borderStyleId: DEFAULT_BORDER_STYLE_ID,
    formStyleId: DEFAULT_FORM_STYLE_ID,
    pageConfig: {},
  };
}

/** Merge an untrusted partial onto defaults and drop stale style ids. */
export function normalizeBookSettings(partial: Partial<BookSettings> | null | undefined): BookSettings {
  const base = defaultBookSettings();
  const merged: BookSettings = { ...base, ...(partial ?? {}) };
  if (!isBorderStyleId(merged.borderStyleId)) merged.borderStyleId = base.borderStyleId;
  if (!isFormStyleId(merged.formStyleId)) merged.formStyleId = base.formStyleId;
  merged.pageConfig = normalizePageConfig(merged.pageConfig);
  return merged;
}

// ---------- Local (per-device cache / offline fallback) ----------

export function loadBookSettings(): BookSettings {
  if (typeof window === 'undefined') return defaultBookSettings();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.BOOK_SETTINGS);
    return normalizeBookSettings(raw ? (JSON.parse(raw) as Partial<BookSettings>) : null);
  } catch {
    return defaultBookSettings();
  }
}

export function saveBookSettings(settings: BookSettings): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEYS.BOOK_SETTINGS, JSON.stringify(settings));
  } catch {
    /* ignore quota / serialization errors */
  }
}

// ---------- Backend (cross-device persistence via user settings) ----------

/** Reads book settings stored under the `book` key of the user settings blob. */
export async function fetchRemoteBookSettings(): Promise<BookSettings | null> {
  const all = await fetchUserSettings();
  const book = all?.[BOOK_SETTINGS_KEY];
  if (!book || typeof book !== 'object') return null;
  return normalizeBookSettings(book as Partial<BookSettings>);
}

/** Persists book settings to the backend without touching other settings keys. */
export async function persistRemoteBookSettings(settings: BookSettings): Promise<void> {
  await api.settings.upsert({ [BOOK_SETTINGS_KEY]: settings });
  patchUserSettingsCache({ [BOOK_SETTINGS_KEY]: settings });
}
