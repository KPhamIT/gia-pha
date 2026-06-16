import { STORAGE_KEYS } from '@/lib/constants/storage-keys';
import { DEFAULT_NODE_CARD_ID, DEFAULT_TREE_BORDER_ID, isNodeCardId, isTreeBorderId } from './svg-border';

/**
 * A draggable box. Any of x/y/width/height may be `null`, meaning "auto" —
 * the renderer fills it with a computed default based on the canvas geometry.
 * Once the user drags/resizes an item, concrete numbers are stored.
 */
export type ExportBox = {
  x: number | null;
  y: number | null;
  width: number | null;
  height: number | null;
};

export type ExportImageCfg = ExportBox & { visible: boolean };

export type ExportCoupletCfg = ExportBox & {
  visible: boolean;
  text: string;
};

/**
 * Presentation settings for exporting the family tree as a print-ready SVG.
 * Persisted per device in localStorage (no backend field exists).
 */
export type TreeExportSettings = {
  backgroundColor: string;
  borderStyleId: string;
  borderColor: string;
  /** Height (in SVG units) of the decorative band above the tree. */
  headerHeight: number;
  scroll: ExportImageCfg;
  dragonLeft: ExportImageCfg;
  dragonRight: ExportImageCfg;
  coupletLeft: ExportCoupletCfg;
  coupletRight: ExportCoupletCfg;
  /** Calligraphy font (thư pháp) used for both couplets, same set as the book cover. */
  coupletFontId: string;
  /** Shared text colour for both couplets. */
  coupletColor: string;
  /** Shared font size (SVG units) for both couplets; null = auto (≈ 18rem column). */
  coupletFontSize: number | null;
  /** Person card appearance. */
  nodeBgColor: string;
  nodeTextColor: string;
  nodeBorderColor: string;
  /** Border/frame style id for each person card. */
  nodeBorderStyleId: string;
  /** Name font size (SVG units) inside each person card. */
  nodeFontSize: number;
};

export type TreeExportPreset = {
  id: string;
  label: string;
  settings: TreeExportSettings;
};

export const TREE_EXPORT_PRESETS_KEY = 'treeExportPresets';

const GOLD = '#7c2d12';
const COUPLET_COLOR = '#7f1d1d';

const autoImage = (): ExportImageCfg => ({ x: null, y: null, width: null, height: null, visible: true });

export function defaultTreeExportSettings(): TreeExportSettings {
  return {
    backgroundColor: '#f7f0dd',
    borderStyleId: 'classic',
    borderColor: GOLD,
    headerHeight: 420,
    scroll: autoImage(),
    dragonLeft: autoImage(),
    dragonRight: autoImage(),
    coupletLeft: {
      x: 155.16116273557986,
      y: 469.2951402540331,
      width: null,
      height: null,
      visible: true,
      text: 'Tổ Tiên Công Đức Thiên Niên Thịnh',
    },
    coupletRight: {
      x: null,
      y: 459.6610154981737,
      width: null,
      height: null,
      visible: true,
      text: 'Tử Hiếu Tôn Hiền Vạn Đại Vinh',
    },
    coupletFontId: 'thanhcong',
    coupletColor: COUPLET_COLOR,
    coupletFontSize: 62,
    nodeBgColor: '#f20202',
    nodeTextColor: '#ffdd00',
    nodeBorderColor: '#ffea00',
    nodeBorderStyleId: 'ornate',
    nodeFontSize: 20,
  };
}

function cloneSettings(settings: TreeExportSettings): TreeExportSettings {
  return JSON.parse(JSON.stringify(settings)) as TreeExportSettings;
}

function elegantBlueExportSettings(): TreeExportSettings {
  return {
    ...defaultTreeExportSettings(),
    backgroundColor: '#eef3fb',
    borderStyleId: 'double',
    borderColor: '#1e3a8a',
    coupletColor: '#1e3a8a',
    coupletFontSize: 56,
    nodeBgColor: '#0f4c81',
    nodeTextColor: '#fef3c7',
    nodeBorderColor: '#facc15',
    nodeBorderStyleId: 'classic',
    nodeFontSize: 19,
  };
}

function monochromeExportSettings(): TreeExportSettings {
  return {
    ...defaultTreeExportSettings(),
    backgroundColor: '#f8f8f8',
    borderStyleId: 'modern',
    borderColor: '#111827',
    coupletColor: '#111827',
    coupletFontSize: 54,
    nodeBgColor: '#111827',
    nodeTextColor: '#f9fafb',
    nodeBorderColor: '#374151',
    nodeBorderStyleId: 'plain',
    nodeFontSize: 18,
  };
}

function preset(overrides: Partial<TreeExportSettings>): TreeExportSettings {
  return normalizeTreeExportSettings({ ...defaultTreeExportSettings(), ...overrides });
}

export function getTreeExportPresets(): TreeExportPreset[] {
  return [
    {
      id: 'traditional-red',
      label: 'Truyền thống đỏ vàng',
      settings: cloneSettings(defaultTreeExportSettings()),
    },
    {
      id: 'elegant-blue',
      label: 'Thanh lịch xanh lam',
      settings: cloneSettings(elegantBlueExportSettings()),
    },
    {
      id: 'monochrome',
      label: 'Đơn sắc hiện đại',
      settings: cloneSettings(monochromeExportSettings()),
    },
    {
      id: 'imperial-gold',
      label: 'Hoàng kim cung đình',
      settings: cloneSettings(
        preset({
          backgroundColor: '#f6ead2',
          borderStyleId: 'double',
          borderColor: '#a16207',
          coupletColor: '#854d0e',
          coupletFontSize: 58,
          nodeBgColor: '#b45309',
          nodeTextColor: '#fef3c7',
          nodeBorderColor: '#facc15',
          nodeBorderStyleId: 'ornate',
          nodeFontSize: 19,
        }),
      ),
    },
    {
      id: 'jade-emerald',
      label: 'Ngọc bích phú quý',
      settings: cloneSettings(
        preset({
          backgroundColor: '#eef7f1',
          borderStyleId: 'cloud',
          borderColor: '#166534',
          coupletColor: '#166534',
          coupletFontSize: 56,
          nodeBgColor: '#065f46',
          nodeTextColor: '#ecfccb',
          nodeBorderColor: '#4ade80',
          nodeBorderStyleId: 'cloud',
          nodeFontSize: 18,
        }),
      ),
    },
    {
      id: 'royal-purple',
      label: 'Tím hoàng gia',
      settings: cloneSettings(
        preset({
          backgroundColor: '#f4eefc',
          borderStyleId: 'ornate',
          borderColor: '#581c87',
          coupletColor: '#6b21a8',
          coupletFontSize: 58,
          nodeBgColor: '#4c1d95',
          nodeTextColor: '#fef9c3',
          nodeBorderColor: '#c084fc',
          nodeBorderStyleId: 'double',
          nodeFontSize: 19,
        }),
      ),
    },
    {
      id: 'ink-classic',
      label: 'Mực tàu cổ thư',
      settings: cloneSettings(
        preset({
          backgroundColor: '#f3f0ea',
          borderStyleId: 'classic',
          borderColor: '#1f2937',
          coupletColor: '#111827',
          coupletFontSize: 54,
          nodeBgColor: '#1f2937',
          nodeTextColor: '#f9fafb',
          nodeBorderColor: '#6b7280',
          nodeBorderStyleId: 'modern',
          nodeFontSize: 18,
        }),
      ),
    },
    {
      id: 'sunset-bronze',
      label: 'Hoàng hôn đồng đỏ',
      settings: cloneSettings(
        preset({
          backgroundColor: '#fdf2e8',
          borderStyleId: 'double',
          borderColor: '#9a3412',
          coupletColor: '#9a3412',
          coupletFontSize: 57,
          nodeBgColor: '#b45309',
          nodeTextColor: '#fff7ed',
          nodeBorderColor: '#fb923c',
          nodeBorderStyleId: 'classic',
          nodeFontSize: 19,
        }),
      ),
    },
    {
      id: 'navy-gold',
      label: 'Lam ngọc kim tuyến',
      settings: cloneSettings(
        preset({
          backgroundColor: '#eef2ff',
          borderStyleId: 'classic',
          borderColor: '#1e40af',
          coupletColor: '#1d4ed8',
          coupletFontSize: 56,
          nodeBgColor: '#1e3a8a',
          nodeTextColor: '#fef3c7',
          nodeBorderColor: '#facc15',
          nodeBorderStyleId: 'ornate',
          nodeFontSize: 19,
        }),
      ),
    },
    {
      id: 'rose-ceremony',
      label: 'Hồng ngọc lễ nghi',
      settings: cloneSettings(
        preset({
          backgroundColor: '#fff1f2',
          borderStyleId: 'cloud',
          borderColor: '#9f1239',
          coupletColor: '#9f1239',
          coupletFontSize: 56,
          nodeBgColor: '#9f1239',
          nodeTextColor: '#fff7ed',
          nodeBorderColor: '#fb7185',
          nodeBorderStyleId: 'double',
          nodeFontSize: 18,
        }),
      ),
    },
    {
      id: 'ivory-minimal',
      label: 'Ngà tối giản cao cấp',
      settings: cloneSettings(
        preset({
          backgroundColor: '#fafaf9',
          borderStyleId: 'modern',
          borderColor: '#44403c',
          coupletColor: '#44403c',
          coupletFontSize: 54,
          nodeBgColor: '#57534e',
          nodeTextColor: '#fafaf9',
          nodeBorderColor: '#a8a29e',
          nodeBorderStyleId: 'modern',
          nodeFontSize: 18,
        }),
      ),
    },
  ];
}

export function normalizeTreeExportPresets(
  value: unknown,
  fallback: TreeExportPreset[] = getTreeExportPresets(),
): TreeExportPreset[] {
  if (!Array.isArray(value)) return fallback;

  const normalized = value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const id = typeof (item as { id?: unknown }).id === 'string' ? (item as { id: string }).id : null;
      const label =
        typeof (item as { label?: unknown }).label === 'string'
          ? (item as { label: string }).label
          : null;
      const settings = (item as { settings?: unknown }).settings as Partial<TreeExportSettings> | undefined;
      if (!id || !label || !settings) return null;
      return { id, label, settings: normalizeTreeExportSettings(settings) } satisfies TreeExportPreset;
    })
    .filter((preset): preset is TreeExportPreset => Boolean(preset));

  return normalized.length > 0 ? normalized : fallback;
}

export function serializeTreeExportPresets(presets: TreeExportPreset[]): Array<{
  id: string;
  label: string;
  settings: TreeExportSettings;
}> {
  return presets.map((preset) => ({
    id: preset.id,
    label: preset.label,
    settings: normalizeTreeExportSettings(preset.settings),
  }));
}

function normalizeImage(partial: Partial<ExportImageCfg> | undefined, base: ExportImageCfg): ExportImageCfg {
  return { ...base, ...(partial ?? {}) };
}

function normalizeCouplet(partial: Partial<ExportCoupletCfg> | undefined, base: ExportCoupletCfg): ExportCoupletCfg {
  return { ...base, ...(partial ?? {}) };
}

function normalizeCoupletRight(partial: Partial<ExportCoupletCfg> | undefined, base: ExportCoupletCfg): ExportCoupletCfg {
  return { ...normalizeCouplet(partial, base), x: null };
}

/** Merge an untrusted partial onto defaults and drop a stale border id. */
export function normalizeTreeExportSettings(
  partial: Partial<TreeExportSettings> | null | undefined,
): TreeExportSettings {
  const base = defaultTreeExportSettings();
  const merged: TreeExportSettings = {
    ...base,
    ...(partial ?? {}),
    scroll: normalizeImage(partial?.scroll, base.scroll),
    dragonLeft: normalizeImage(partial?.dragonLeft, base.dragonLeft),
    dragonRight: normalizeImage(partial?.dragonRight, base.dragonRight),
    coupletLeft: normalizeCouplet(partial?.coupletLeft, base.coupletLeft),
    coupletRight: normalizeCoupletRight(partial?.coupletRight, base.coupletRight),
  };
  if (!isTreeBorderId(merged.borderStyleId)) merged.borderStyleId = base.borderStyleId;
  if (!isNodeCardId(merged.nodeBorderStyleId)) merged.nodeBorderStyleId = base.nodeBorderStyleId;
  return merged;
}

export function loadTreeExportSettings(): TreeExportSettings {
  if (typeof window === 'undefined') return defaultTreeExportSettings();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.TREE_EXPORT_SETTINGS);
    return normalizeTreeExportSettings(raw ? (JSON.parse(raw) as Partial<TreeExportSettings>) : null);
  } catch {
    return defaultTreeExportSettings();
  }
}

export function saveTreeExportSettings(settings: TreeExportSettings): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEYS.TREE_EXPORT_SETTINGS, JSON.stringify(settings));
  } catch {
    /* ignore quota / serialization errors */
  }
}
