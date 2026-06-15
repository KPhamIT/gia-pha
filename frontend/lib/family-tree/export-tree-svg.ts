import type { FamilyTreeData } from '@/components/types/family-tree-types';
import {
  buildFamilyTreeGraph,
  NODE_HEIGHT,
  NODE_WIDTH,
  type FamilyTreeLayoutConfig,
} from '@/components/family-tree/graph/layout';
import type { TreeExportSettings } from './tree-export-settings';

/** Natural aspect ratios (width / height) of the decorative PNGs. */
export const SCROLL_ASPECT = 1000 / 381;
export const DRAGON_ASPECT = 1;

/** Paths to the decorative images under /public. */
export const EXPORT_IMAGE_SOURCES = {
  scroll: '/images/cuonthu.png',
  dragonLeft: '/images/longleft.png',
  dragonRight: '/images/longright.png',
} as const;

export type ExportImageKey = keyof typeof EXPORT_IMAGE_SOURCES;

export type ExportNode = {
  id: number;
  x: number;
  y: number;
  fullName: string;
  birthDate: string | null;
  isRoot: boolean;
};

export type Rect = { x: number; y: number; width: number; height: number };

export type ExportModel = {
  nodes: ExportNode[];
  /** One orthogonal connector path (`d` attribute) per parent. */
  connectors: string[];
  nodeWidth: number;
  nodeHeight: number;
  bounds: Rect;
  /** Horizontal centre (in tree coords) of the root node — the sheet is centred on this. */
  rootCenterX: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/** Build the geometric model (positioned nodes + connector paths) for the tree. */
export function buildExportModel(treeData: FamilyTreeData, layoutConfig: FamilyTreeLayoutConfig = {}): ExportModel {
  const { nodes, edges } = buildFamilyTreeGraph(treeData, layoutConfig);
  const nodeWidth = layoutConfig.nodeWidth ?? NODE_WIDTH;
  const nodeHeight = layoutConfig.nodeHeight ?? NODE_HEIGHT;

  const exportNodes: ExportNode[] = nodes.map((node) => {
    const data = node.data as {
      fullName?: string;
      birthDate?: string | null;
      isRoot?: boolean;
      personId?: number;
    };
    return {
      id: data.personId ?? Number(node.id),
      x: node.position.x,
      y: node.position.y,
      fullName: data.fullName ?? '',
      birthDate: data.birthDate ?? null,
      isRoot: Boolean(data.isRoot),
    };
  });

  const posById = new Map(exportNodes.map((n) => [n.id, n]));

  // Group children by their parent (the upper node of each vertical edge).
  const childrenByParent = new Map<number, number[]>();
  for (const edge of edges) {
    const a = posById.get(Number(edge.source));
    const b = posById.get(Number(edge.target));
    if (!a || !b || a.y === b.y) continue; // skip spouse / same-generation links
    const [parent, child] = a.y < b.y ? [a, b] : [b, a];
    const list = childrenByParent.get(parent.id) ?? [];
    list.push(child.id);
    childrenByParent.set(parent.id, list);
  }

  const connectors: string[] = [];
  for (const [parentId, childIds] of childrenByParent) {
    const parent = posById.get(parentId);
    if (!parent) continue;
    const children = childIds
      .map((id) => posById.get(id))
      .filter((c): c is ExportNode => Boolean(c));
    if (children.length === 0) continue;

    const stemX = parent.x + nodeWidth / 2;
    const parentBottomY = parent.y + nodeHeight;
    const childCenters = children.map((c) => ({ x: c.x + nodeWidth / 2, top: c.y }));
    const minTop = Math.min(...childCenters.map((c) => c.top));
    const busY = (parentBottomY + minTop) / 2;
    const busLeft = Math.min(stemX, ...childCenters.map((c) => c.x));
    const busRight = Math.max(stemX, ...childCenters.map((c) => c.x));

    let d = `M ${stemX} ${parentBottomY} L ${stemX} ${busY} `;
    d += `M ${busLeft} ${busY} L ${busRight} ${busY} `;
    for (const c of childCenters) {
      d += `M ${c.x} ${busY} L ${c.x} ${c.top} `;
    }
    connectors.push(d.trim());
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const n of exportNodes) {
    minX = Math.min(minX, n.x);
    minY = Math.min(minY, n.y);
    maxX = Math.max(maxX, n.x + nodeWidth);
    maxY = Math.max(maxY, n.y + nodeHeight);
  }
  if (!Number.isFinite(minX)) {
    minX = 0;
    minY = 0;
    maxX = nodeWidth;
    maxY = nodeHeight;
  }

  const rootNode = exportNodes.find((n) => n.isRoot);
  const rootCenterX = rootNode ? rootNode.x + nodeWidth / 2 : minX + (maxX - minX) / 2;

  return {
    nodes: exportNodes,
    connectors,
    nodeWidth,
    nodeHeight,
    bounds: { x: minX, y: minY, width: maxX - minX, height: maxY - minY },
    rootCenterX,
  };
}

export const EXPORT_OUTER_MARGIN = 60;
export const EXPORT_PADDING = 70;
const MIN_CONTENT_WIDTH = 1400;

/** Vertical spacing between stacked couplet syllables, as a multiple of font size. */
export const COUPLET_LINE_FACTOR = 1.1;
/** Default couplet column height: 18rem (≈ 288 SVG user units at 16px/rem). */
export const COUPLET_DEFAULT_COLUMN_HEIGHT = 18 * 16;

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
 * Derive the full canvas geometry. The root node is pinned to the horizontal
 * centre (aligned with the scroll); the content width is widened symmetrically
 * around it so the whole tree still fits inside the border on both sides.
 */
export function computeExportGeometry(bounds: Rect, headerHeight: number, rootCenterX: number): ExportGeometry {
  const inner0 = EXPORT_OUTER_MARGIN + EXPORT_PADDING;
  // Largest horizontal reach from the root centre to either edge of the tree.
  const leftReach = rootCenterX - bounds.x;
  const rightReach = bounds.x + bounds.width - rootCenterX;
  const halfSpan = Math.max(leftReach, rightReach, MIN_CONTENT_WIDTH / 2);
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
    headerRect: { x: inner0, y: inner0, width: contentWidth, height: headerHeight },
    // Shift the tree so the root centre lands on the canvas centre.
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
export function resolveExportLayout(settings: TreeExportSettings, header: Rect): ResolvedLayout {
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

  const leftFont = settings.coupletLeft.fontSize ?? defaultCoupletFontSize(settings.coupletLeft.text);
  const rightFont = settings.coupletRight.fontSize ?? defaultCoupletFontSize(settings.coupletRight.text);
  // Couplets default to the top-left / top-right corners, running downward.
  const coupletTopY = header.y + leftFont * 0.5;

  return {
    scroll: { x: scrollX, y: scrollY, width: scrollW, height: scrollH, visible: settings.scroll.visible },
    dragonLeft: { x: dlX, y: dlY, width: dlW, height: dlH, visible: settings.dragonLeft.visible },
    dragonRight: { x: drX, y: drY, width: drW, height: drH, visible: settings.dragonRight.visible },
    coupletLeft: {
      x: settings.coupletLeft.x ?? header.x + leftFont * 0.9,
      y: settings.coupletLeft.y ?? coupletTopY,
      fontSize: leftFont,
      color: settings.coupletLeft.color,
      text: settings.coupletLeft.text,
      visible: settings.coupletLeft.visible,
    },
    coupletRight: {
      x: settings.coupletRight.x ?? header.x + header.width - rightFont * 0.9,
      y: settings.coupletRight.y ?? header.y + rightFont * 0.5,
      fontSize: rightFont,
      color: settings.coupletRight.color,
      text: settings.coupletRight.text,
      visible: settings.coupletRight.visible,
    },
  };
}

/** Fetch an image and return it as a base64 data URI (for self-contained SVG). */
export async function fetchImageAsDataUri(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/** Build an inline @font-face rule embedding the woff2 as a data URI. */
export async function buildEmbeddedFontFace(family: string, fileUrl: string): Promise<string | undefined> {
  try {
    const uri = await fetchImageAsDataUri(fileUrl);
    return `@font-face{font-family:"${family}";src:url("${uri}") format("woff2");font-weight:normal;font-style:normal;}`;
  } catch {
    return undefined;
  }
}

/** Serialize a live <svg> element to a self-contained file and trigger a download. */
export function downloadSvgElement(
  svg: SVGSVGElement,
  width: number,
  height: number,
  filename: string,
  fontFaceCss?: string,
): void {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.removeAttribute('style');
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  clone.setAttribute('width', String(width));
  clone.setAttribute('height', String(height));
  clone.querySelectorAll('[data-export-ignore]').forEach((el) => el.remove());

  if (fontFaceCss) {
    const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    styleEl.textContent = fontFaceCss;
    clone.insertBefore(styleEl, clone.firstChild);
  }

  const xml = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${xml}`], {
    type: 'image/svg+xml;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
