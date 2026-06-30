import type { TreeExportSettings } from "./tree-export-settings";
import type { Rect } from "./export-tree-model";

/** Natural aspect ratios (width / height) of the decorative PNGs. */
export const SCROLL_ASPECT = 1000 / 381;
export const DRAGON_ASPECT = 1;

/** Paths to the decorative images under /public. */
export const EXPORT_IMAGE_SOURCES = {
  scroll: "/images/cuonthu.png",
  dragonLeft: "/images/longleft.png",
  dragonRight: "/images/longright.png",
} as const;

export type ExportImageKey = keyof typeof EXPORT_IMAGE_SOURCES;

export const EXPORT_OUTER_MARGIN = 60;
export const EXPORT_PADDING = 70;

/** A0 ngang (ISO 841×1189 mm), 1000 user units ≈ 1 inch — cùng hệ với khung SVG. */
export const EXPORT_A0_WIDTH = 46811;
export const EXPORT_A0_HEIGHT = 33110;
export const EXPORT_A0_WIDTH_MM = 1189;
export const EXPORT_A0_HEIGHT_MM = 841;

/** Vùng header ≈ 12% chiều cao A0 — đủ chỗ cho cuốn thư, rồng, câu đối. */
export const EXPORT_HEADER_HEIGHT_DEFAULT = Math.round(EXPORT_A0_HEIGHT * 0.12);
export const EXPORT_HEADER_HEIGHT_MIN = Math.round(EXPORT_A0_HEIGHT * 0.06);
export const EXPORT_HEADER_HEIGHT_MAX = Math.round(EXPORT_A0_HEIGHT * 0.22);

/** Chiều cao vùng in bên trong khung viền. */
export const EXPORT_BORDER_HEIGHT = EXPORT_A0_HEIGHT - EXPORT_OUTER_MARGIN * 2;

/** Cột câu đối dọc hai bên — ~28% chiều cao khổ in (vừa đọc, không phủ hết trang). */
export const COUPLET_COLUMN_HEIGHT_RATIO = 0.28;

const LEGACY_HEADER_HEIGHT_MAX = 1500;
const LEGACY_TEXT_FONT_MAX = 180;

/** Pre-A0 persisted coords / sizes for cuốn thư + rồng. */
export const LEGACY_HEADER_LAYER_COORD_MAX = 6000;
export const LEGACY_HEADER_LAYER_SIZE_MAX = 2000;

export const LEGACY_HEADER_LAYER_IDS = {
  scroll: "legacy-scroll",
  dragonLeft: "legacy-dragon-left",
  dragonRight: "legacy-dragon-right",
} as const;

/** Header band used when only `headerHeight` is known (migration / defaults). */
export function defaultExportHeaderRect(headerHeight: number): Rect {
  const inner0 = EXPORT_OUTER_MARGIN + EXPORT_PADDING;
  const contentWidth = EXPORT_A0_WIDTH - inner0 * 2;
  return { x: inner0, y: inner0, width: contentWidth, height: headerHeight };
}

export function defaultExportBorderRect(): Rect {
  return {
    x: EXPORT_OUTER_MARGIN,
    y: EXPORT_OUTER_MARGIN,
    width: EXPORT_A0_WIDTH - EXPORT_OUTER_MARGIN * 2,
    height: EXPORT_BORDER_HEIGHT,
  };
}

/** Vertical spacing between stacked couplet syllables, as a multiple of font size. */
export const COUPLET_LINE_FACTOR = 1.1;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/** Split a couplet into vertical cells — one syllable (space-separated word) per row. */
export function coupletSyllables(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

/** Font size để cột câu đối vừa chiều cao cột cho trước. */
export function defaultCoupletFontSize(
  text: string,
  columnHeight: number,
): number {
  const cells = Math.max(coupletSyllables(text).length, 1);
  return columnHeight / (cells * COUPLET_LINE_FACTOR);
}

export function exportCoupletColumnHeight(frameHeight = EXPORT_BORDER_HEIGHT): number {
  return frameHeight * COUPLET_COLUMN_HEIGHT_RATIO;
}

function centeredCoupletStartY(
  text: string,
  fontSize: number,
  frame: Rect,
): number {
  const count = Math.max(coupletSyllables(text).length, 1);
  const lineGap = fontSize * COUPLET_LINE_FACTOR;
  const blockHeight = count * lineGap + fontSize * 0.4;
  const top = frame.y + (frame.height - blockHeight) / 2;
  return top + fontSize;
}

/** Cỡ chữ mặc định cho lớp text tự do trên export A0. */
export function defaultExportTextFontSize(headerHeight: number): number {
  return Math.round(headerHeight * 0.14);
}

export function defaultExportTextBox(header: Rect): {
  width: number;
  height: number;
} {
  return {
    width: Math.round(header.width * 0.12),
    height: Math.round(header.height * 0.4),
  };
}

export function isLegacyExportScale(headerHeight: number): boolean {
  return headerHeight < LEGACY_HEADER_HEIGHT_MAX;
}

export type ExportGeometry = {
  canvasWidth: number;
  canvasHeight: number;
  /** Rect (in canvas coords) the border frame is drawn on. */
  borderRect: Rect;
  /** Rect (in canvas coords) of the decorative header band. */
  headerRect: Rect;
  /** Translation applied to the tree group so it sits centred below the header. */
  treeTranslateX: number;
  treeTranslateY: number;
};

/**
 * Canvas geometry on fixed A0 landscape. Tree is centred horizontally on the
 * root; vertical placement follows header height and tree bounds.
 */
export function computeExportGeometry(
  bounds: Rect,
  headerHeight: number,
  rootCenterX: number,
): ExportGeometry {
  const inner0 = EXPORT_OUTER_MARGIN + EXPORT_PADDING;
  const canvasWidth = EXPORT_A0_WIDTH;
  const canvasHeight = EXPORT_A0_HEIGHT;
  const contentWidth = canvasWidth - inner0 * 2;
  const canvasCenterX = canvasWidth / 2;

  return {
    canvasWidth,
    canvasHeight,
    borderRect: {
      x: EXPORT_OUTER_MARGIN,
      y: EXPORT_OUTER_MARGIN,
      width: canvasWidth - EXPORT_OUTER_MARGIN * 2,
      height: canvasHeight - EXPORT_OUTER_MARGIN * 2,
    },
    headerRect: {
      x: inner0,
      y: inner0,
      width: contentWidth,
      height: headerHeight,
    },
    treeTranslateX: canvasCenterX - rootCenterX,
    treeTranslateY: inner0 + headerHeight - bounds.y,
  };
}

/** Ảnh nền: khớp đúng kích thước khung in. */
export function backgroundImageLayout(borderRect: Rect): Rect {
  return {
    x: borderRect.x,
    y: borderRect.y,
    width: borderRect.width,
    height: borderRect.height,
  };
}

export type ResolvedImage = Rect & { visible: boolean };
export type ResolvedCouplet = {
  x: number;
  y: number;
  fontSize: number;
  color: string;
  text: string;
  visible: boolean;
};

export type ResolvedLayout = {
  scroll: ResolvedImage;
  dragonLeft: ResolvedImage;
  dragonRight: ResolvedImage;
  coupletLeft: ResolvedCouplet;
  coupletRight: ResolvedCouplet;
};

/**
 * Fill any "auto" (null) geometry on the header items with sensible defaults
 * derived from the header band, returning concrete positions for rendering.
 */
export function resolveExportLayout(
  settings: TreeExportSettings,
  header: Rect,
  frame: Rect,
): ResolvedLayout {
  const centerX = header.x + header.width / 2;

  const scrollW = settings.scroll.width ?? header.width * 0.26;
  const scrollH = settings.scroll.height ?? scrollW / SCROLL_ASPECT;
  const scrollX = settings.scroll.x ?? centerX - scrollW / 2;
  const scrollY = settings.scroll.y ?? header.y + header.height * 0.14;

  const dragonSize = header.height * 1.05;
  const dragonY = header.y + (header.height - dragonSize) / 2;
  const dragonGap = header.height * 0.02;

  const dlW = settings.dragonLeft.width ?? dragonSize;
  const dlH = settings.dragonLeft.height ?? dlW / DRAGON_ASPECT;
  const dlX = settings.dragonLeft.x ?? scrollX - dragonGap - dlW;
  const dlY = settings.dragonLeft.y ?? dragonY;

  const drW = settings.dragonRight.width ?? dragonSize;
  const drH = settings.dragonRight.height ?? drW / DRAGON_ASPECT;
  const drX = settings.dragonRight.x ?? scrollX + scrollW + dragonGap;
  const drY = settings.dragonRight.y ?? dragonY;

  const coupletColor = settings.coupletColor;
  const coupletColumnHeight = exportCoupletColumnHeight(frame.height);
  const coupletFont =
    settings.coupletFontSize ??
    Math.min(
      defaultCoupletFontSize(settings.coupletLeft.text, coupletColumnHeight),
      defaultCoupletFontSize(settings.coupletRight.text, coupletColumnHeight),
    );
  const leftAutoY = centeredCoupletStartY(
    settings.coupletLeft.text,
    coupletFont,
    frame,
  );
  const rightAutoY = centeredCoupletStartY(
    settings.coupletRight.text,
    coupletFont,
    frame,
  );
  const leftAutoX = frame.x + frame.width * 0.08;
  const rightAutoX = frame.x + frame.width * 0.92;

  return {
    scroll: {
      x: scrollX,
      y: scrollY,
      width: scrollW,
      height: scrollH,
      visible: settings.scroll.visible,
    },
    dragonLeft: {
      x: dlX,
      y: dlY,
      width: dlW,
      height: dlH,
      visible: settings.dragonLeft.visible,
    },
    dragonRight: {
      x: drX,
      y: drY,
      width: drW,
      height: drH,
      visible: settings.dragonRight.visible,
    },
    coupletLeft: {
      x: settings.coupletLeft.x ?? leftAutoX,
      y: settings.coupletLeft.y ?? leftAutoY,
      fontSize: coupletFont,
      color: coupletColor,
      text: settings.coupletLeft.text,
      visible: settings.coupletLeft.visible,
    },
    coupletRight: {
      x: settings.coupletRight.x ?? rightAutoX,
      y: settings.coupletRight.y ?? rightAutoY,
      fontSize: coupletFont,
      color: coupletColor,
      text: settings.coupletRight.text,
      visible: settings.coupletRight.visible,
    },
  };
}

export function isLegacyHeaderImageCfg(cfg: {
  x: number | null;
  y: number | null;
  width: number | null;
  height: number | null;
}): boolean {
  return (
    (cfg.width != null && cfg.width < LEGACY_HEADER_LAYER_SIZE_MAX) ||
    (cfg.x != null && cfg.x < LEGACY_HEADER_LAYER_COORD_MAX)
  );
}

export function isLegacyHeaderImageLayer(layer: {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
}): boolean {
  if (layer.type !== "image") return false;
  const legacyIds = Object.values(LEGACY_HEADER_LAYER_IDS);
  if (!legacyIds.includes(layer.id as (typeof legacyIds)[number])) return false;
  return (
    layer.width < LEGACY_HEADER_LAYER_SIZE_MAX ||
    layer.x < LEGACY_HEADER_LAYER_COORD_MAX
  );
}

const LEGACY_HEADER_LAYOUT_KEY: Record<
  string,
  keyof Pick<ResolvedLayout, "scroll" | "dragonLeft" | "dragonRight">
> = {
  [LEGACY_HEADER_LAYER_IDS.scroll]: "scroll",
  [LEGACY_HEADER_LAYER_IDS.dragonLeft]: "dragonLeft",
  [LEGACY_HEADER_LAYER_IDS.dragonRight]: "dragonRight",
};

/** Resolved box for rendering / selection — auto layout until user drags on A0. */
export function resolveHeaderImageLayer(
  layer: {
    id: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
  },
  layout: ResolvedLayout,
): ResolvedImage | null {
  const key = LEGACY_HEADER_LAYOUT_KEY[layer.id];
  if (!key) return null;
  const resolved = layout[key];
  if (!resolved.visible) return null;
  if (isLegacyHeaderImageLayer(layer)) return resolved;
  return {
    x: layer.x,
    y: layer.y,
    width: layer.width,
    height: layer.height,
    visible: true,
  };
}
