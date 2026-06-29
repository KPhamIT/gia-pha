import type { ExportGeometry } from "./export-tree-geometry";
import { EXPORT_OUTER_MARGIN, EXPORT_PADDING } from "./export-tree-geometry";
import type { ExportModel, Rect } from "./export-tree-model";

export const TREE_SCALE_MIN = 0.05;
export const TREE_SCALE_MAX = 10;
export const TREE_USER_ZOOM_MIN = 0.08;
export const TREE_USER_ZOOM_MAX = 6;
export const TREE_SCALE_STEP = 1.12;

export type TreeTransform = {
  treeOffsetX: number;
  treeOffsetY: number;
  treeScale: number;
};

export function clampTreeScale(scale: number): number {
  return Math.min(Math.max(scale, TREE_SCALE_MIN), TREE_SCALE_MAX);
}

export function clampUserTreeZoom(zoom: number): number {
  return Math.min(Math.max(zoom, TREE_USER_ZOOM_MIN), TREE_USER_ZOOM_MAX);
}

export function exportFitKey(model: ExportModel, headerHeight: number): string {
  const b = model.bounds;
  return [
    b.x,
    b.y,
    b.width,
    b.height,
    headerHeight,
    model.rootCenterX,
  ].join("|");
}

export function effectiveTreeScale(fitScale: number, userZoom: number): number {
  return clampTreeScale(fitScale * userZoom);
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
