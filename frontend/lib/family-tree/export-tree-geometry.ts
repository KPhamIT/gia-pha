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
const MIN_CONTENT_WIDTH = 1400;

/** Vertical spacing between stacked couplet syllables, as a multiple of font size. */
export const COUPLET_LINE_FACTOR = 1.1;
/** Default couplet column height: 18rem (≈ 288 SVG user units at 16px/rem). */
export const COUPLET_DEFAULT_COLUMN_HEIGHT = 18 * 16;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/** Split a couplet into vertical cells — one syllable (space-separated word) per row. */
export function coupletSyllables(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

/** Font size that makes `text`'s column span the default 18rem height. */
function defaultCoupletFontSize(text: string): number {
  const cells = Math.max(coupletSyllables(text).length, 1);
  return COUPLET_DEFAULT_COLUMN_HEIGHT / (cells * COUPLET_LINE_FACTOR);
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
 * Canvas geometry after export root-x adjustment. The root sits on the horizontal
 * midline of the tree extent, so left/right reach are equal and the sheet does
 * not drift sideways on wide trees.
 */
export function computeExportGeometry(
  bounds: Rect,
  headerHeight: number,
  rootCenterX: number,
): ExportGeometry {
  const inner0 = EXPORT_OUTER_MARGIN + EXPORT_PADDING;
  const leftReach = rootCenterX - bounds.x;
  const rightReach = bounds.x + bounds.width - rootCenterX;
  const halfSpan = Math.max(
    leftReach,
    rightReach,
    bounds.width / 2,
    MIN_CONTENT_WIDTH / 2,
  );
  const contentWidth = halfSpan * 2;
  const contentHeight = headerHeight + bounds.height;
  const canvasWidth = contentWidth + inner0 * 2;
  const canvasHeight = contentHeight + inner0 * 2;
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

  // Both couplets share one font size + colour. Auto size fits the longer
  // couplet's column to ≈ 18rem so neither overflows.
  const coupletColor = settings.coupletColor;
  const coupletFont =
    settings.coupletFontSize ??
    Math.min(
      defaultCoupletFontSize(settings.coupletLeft.text),
      defaultCoupletFontSize(settings.coupletRight.text),
    );
  const coupletTopY = header.y + coupletFont * 0.5;

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
      x: settings.coupletLeft.x ?? header.x + coupletFont * 0.9,
      y: settings.coupletLeft.y ?? coupletTopY,
      fontSize: coupletFont,
      color: coupletColor,
      text: settings.coupletLeft.text,
      visible: settings.coupletLeft.visible,
    },
    coupletRight: {
      x: header.x + header.width - coupletFont * 0.9,
      y: settings.coupletRight.y ?? header.y + coupletFont * 0.5,
      fontSize: coupletFont,
      color: coupletColor,
      text: settings.coupletRight.text,
      visible: settings.coupletRight.visible,
    },
  };
}
