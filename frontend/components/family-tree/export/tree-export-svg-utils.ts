import { type PointerEvent as ReactPointerEvent } from "react";
import {
  COUPLET_LINE_FACTOR,
  coupletSyllables,
  type ResolvedCouplet,
  type Rect,
} from "@/lib/family-tree/export-tree-svg";
import type { ExportTextLayer } from "@/lib/family-tree/export-decoration-layers";
import {
  estimateHorizontalTextWidth,
  horizontalTextBoundsWithCurve,
} from "@/lib/family-tree/export-text-curve";

export type DraggableId = string;

export type DragState = {
  id: DraggableId;
  mode: "move" | "resize";
  startX: number;
  startY: number;
  boxX: number;
  boxY: number;
  aspectRatio: number;
};

export type BeginLayerDrag = (
  e: ReactPointerEvent,
  id: DraggableId,
  mode: "move" | "resize",
  box: { x: number; y: number },
  aspectRatio?: number,
) => void;

export const SERIF = "'Times New Roman', 'Songti SC', serif";

const birthDateFormatter = new Intl.DateTimeFormat("vi-VN");

export function formatBirthDate(birthDate: string | null): string {
  if (!birthDate) return "";
  const d = new Date(birthDate);
  return Number.isNaN(d.getTime()) ? "" : birthDateFormatter.format(d);
}

export const coupletLineGap = (fontSize: number) =>
  fontSize * COUPLET_LINE_FACTOR;

/** Bounding rect of a couplet's vertical syllable column (x is the column centre). */
export function coupletBounds(c: ResolvedCouplet): Rect {
  const count = Math.max(coupletSyllables(c.text).length, 1);
  const lineGap = coupletLineGap(c.fontSize);
  const height = count * lineGap;
  return {
    x: c.x - c.fontSize * 1.4,
    y: c.y - c.fontSize,
    width: c.fontSize * 2.8,
    height: height + c.fontSize * 0.4,
  };
}

export function textLayerBounds(layer: ExportTextLayer): Rect {
  if (layer.vertical) {
    const count = Math.max(coupletSyllables(layer.text).length, 1);
    const lineGap = coupletLineGap(layer.fontSize);
    const height = count * lineGap;
    return {
      x: layer.x - layer.fontSize * 1.4,
      y: layer.y - layer.fontSize,
      width: layer.fontSize * 2.8,
      height: height + layer.fontSize * 0.4,
    };
  }
  const width = estimateHorizontalTextWidth(layer.text, layer.fontSize);
  return horizontalTextBoundsWithCurve(
    layer.x,
    layer.y,
    width,
    layer.fontSize,
    layer.textCurve ?? 0,
    layer.textRotation ?? 0,
  );
}

export function isCoupletId(id: string): id is "coupletLeft" | "coupletRight" {
  return id === "coupletLeft" || id === "coupletRight";
}

export function isLegacyImageId(
  id: string,
): id is "scroll" | "dragonLeft" | "dragonRight" {
  return id === "scroll" || id === "dragonLeft" || id === "dragonRight";
}
