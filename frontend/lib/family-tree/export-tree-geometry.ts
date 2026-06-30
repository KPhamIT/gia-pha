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

  const scrollW = settings.scroll.width ?? clamp(header.width * 0.26, 380, 720);
  const scrollH = settings.scroll.height ?? scrollW / SCROLL_ASPECT;
  const scrollX = settings.scroll.x ?? centerX - scrollW / 2;
  const scrollY = settings.scroll.y ?? header.y + header.height * 0.14;

  const dragonSize = header.height * 0.58;
  const dragonY = header.y + (header.height - dragonSize) / 2;

  const dlW = settings.dragonLeft.width ?? dragonSize;
  const dlH = settings.dragonLeft.height ?? dlW / DRAGON_ASPECT;
  const dlX = settings.dragonLeft.x ?? scrollX - 50 - dlW;
  const dlY = settings.dragonLeft.y ?? dragonY;

  const drW = settings.dragonRight.width ?? dragonSize;
  const drH = settings.dragonRight.height ?? drW / DRAGON_ASPECT;
  const drX = settings.dragonRight.x ?? scrollX + scrollW + 50;
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
