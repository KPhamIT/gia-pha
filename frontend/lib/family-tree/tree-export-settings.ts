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
