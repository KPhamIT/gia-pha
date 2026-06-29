import type { ExportGeometry } from "./export-tree-geometry";
import { EXPORT_OUTER_MARGIN, EXPORT_PADDING } from "./export-tree-geometry";
import type { ExportModel, Rect } from "./export-tree-model";

export const TREE_SCALE_STEP = 1.12;
export const PREVIEW_ZOOM_STEP = 1.2;

/** Ngưỡng tối thiểu — tránh 0/âm; không giới hạn max thực tế cho chỉnh sửa. */
const ZOOM_FLOOR = 0.01;
const ZOOM_CEILING = 1_000_000;

export type TreeTransform = {
  treeOffsetX: number;
  treeOffsetY: number;
  treeScale: number;
};

function sanitizeZoom(zoom: number): number {
  if (!Number.isFinite(zoom)) return 1;
  if (zoom < ZOOM_FLOOR) return ZOOM_FLOOR;
  if (zoom > ZOOM_CEILING) return ZOOM_CEILING;
  return zoom;
}

export function clampTreeScale(scale: number): number {
  return sanitizeZoom(scale);
}

export function clampUserTreeZoom(zoom: number): number {
  return sanitizeZoom(zoom);
}

export function clampPreviewZoom(zoom: number): number {
  return sanitizeZoom(zoom);
}

export function exportFitKey(model: ExportModel, headerHeight: number): string {
  const b = model.bounds;
  return [
    Math.round(b.x),
    Math.round(b.y),
    Math.round(b.width),
    Math.round(b.height),
    Math.round(headerHeight),
    Math.round(model.rootCenterX),
  ].join("|");
}

export function effectiveTreeScale(fitScale: number, userZoom: number): number {
  const u = Number.isFinite(userZoom) ? userZoom : 1;
  const f = Number.isFinite(fitScale) ? fitScale : 1;
  return sanitizeZoom(f * u);
}

/** Vùng dưới header, trong khung A0, dành cho cây gia phả. */
export function getExportTreeArea(
  geometry: ExportGeometry,
  headerHeight: number,
): Rect {
  const inner0 = EXPORT_OUTER_MARGIN + EXPORT_PADDING;
  const contentWidth = geometry.canvasWidth - inner0 * 2;
  const treeAreaTop = inner0 + headerHeight;
  const pad = EXPORT_PADDING;
  return {
    x: inner0 + pad,
    y: treeAreaTop + pad,
    width: contentWidth - 2 * pad,
    height: geometry.canvasHeight - treeAreaTop - inner0 - 2 * pad,
  };
}

/** Scale pivot — root card centre, or tree bounds centre as fallback. */
export function getTreeScalePivot(model: ExportModel): { x: number; y: number } {
  const root = model.nodes.find((node) => node.isRoot);
  if (root) {
    return {
      x: root.x + model.nodeWidth / 2,
      y: root.y + model.nodeHeight / 2,
    };
  }
  return {
    x: model.rootCenterX,
    y: model.bounds.y + model.bounds.height / 2,
  };
}

export function buildExportTreeTransform(
  geometry: ExportGeometry,
  pivot: { x: number; y: number },
  treeOffsetX: number,
  treeOffsetY: number,
  treeScale: number,
): string {
  const tx = geometry.treeTranslateX + treeOffsetX;
  const ty = geometry.treeTranslateY + treeOffsetY;
  const { x: px, y: py } = pivot;
  const scale = clampTreeScale(treeScale);
  return `translate(${tx} ${ty}) translate(${px} ${py}) scale(${scale}) translate(${-px} ${-py})`;
}

function treeCanvasBounds(
  model: ExportModel,
  geometry: ExportGeometry,
  scale: number,
  offsetX: number,
  offsetY: number,
): Rect {
  const pivot = getTreeScalePivot(model);
  const { x: px, y: py } = pivot;
  const b = model.bounds;
  const corners = [
    [b.x, b.y],
    [b.x + b.width, b.y],
    [b.x, b.y + b.height],
    [b.x + b.width, b.y + b.height],
  ].map(([x, y]) => ({
    x: geometry.treeTranslateX + offsetX + px + (x - px) * scale,
    y: geometry.treeTranslateY + offsetY + py + (y - py) * scale,
  }));
  const xs = corners.map((c) => c.x);
  const ys = corners.map((c) => c.y);
  const xmin = Math.min(...xs);
  const ymin = Math.min(...ys);
  return {
    x: xmin,
    y: ymin,
    width: Math.max(...xs) - xmin,
    height: Math.max(...ys) - ymin,
  };
}

/** Scale + offset để cây nằm gọn trong vùng A0 dưới header. */
export function computeAutoTreeFit(
  model: ExportModel,
  geometry: ExportGeometry,
  headerHeight: number,
): TreeTransform {
  const target = getExportTreeArea(geometry, headerHeight);
  if (target.width <= 0 || target.height <= 0) {
    return { treeOffsetX: 0, treeOffsetY: 0, treeScale: 1 };
  }

  const base = treeCanvasBounds(model, geometry, 1, 0, 0);
  if (base.width <= 0 || base.height <= 0) {
    return { treeOffsetX: 0, treeOffsetY: 0, treeScale: 1 };
  }

  const scale = Math.min(target.width / base.width, target.height / base.height);
  const fitted = treeCanvasBounds(model, geometry, scale, 0, 0);
  return {
    treeScale: scale,
    treeOffsetX:
      target.x + target.width / 2 - (fitted.x + fitted.width / 2),
    treeOffsetY:
      target.y + target.height / 2 - (fitted.y + fitted.height / 2),
  };
}
