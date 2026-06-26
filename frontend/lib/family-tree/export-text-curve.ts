import type { Rect } from "@/lib/family-tree/export-tree-svg";

export const TEXT_CURVE_MIN = -100;
export const TEXT_CURVE_MAX = 100;
export const TEXT_CURVE_STEP = 5;

export const TEXT_ROTATION_MIN = -180;
export const TEXT_ROTATION_MAX = 180;
export const TEXT_ROTATION_STEP = 5;

export function clampTextCurve(value: number): number {
  const stepped = Math.round(value / TEXT_CURVE_STEP) * TEXT_CURVE_STEP;
  return Math.max(TEXT_CURVE_MIN, Math.min(TEXT_CURVE_MAX, stepped));
}

export function clampTextRotation(value: number): number {
  const stepped = Math.round(value / TEXT_ROTATION_STEP) * TEXT_ROTATION_STEP;
  return Math.max(TEXT_ROTATION_MIN, Math.min(TEXT_ROTATION_MAX, stepped));
}

export function estimateHorizontalTextWidth(
  text: string,
  fontSize: number,
): number {
  return Math.max(text.length, 1) * fontSize * 0.55;
}

/** Bán trục dọc của elip; curve ±100 → cung bầu dục rõ. */
export function ellipseRy(curve: number, textWidth: number): number {
  if (curve === 0) return 0;
  return (Math.abs(curve) / 100) * textWidth * 0.45;
}

/** Đường dẫn elip: chữ bám theo cung bầu dục (không phải parabol). */
export function buildEllipticalTextPath(
  x: number,
  y: number,
  textWidth: number,
  curve: number,
): string {
  const x2 = x + textWidth;
  if (curve === 0) {
    return `M ${x} ${y} L ${x2} ${y}`;
  }
  const rx = textWidth / 2;
  const ry = ellipseRy(curve, textWidth);
  const sweep = curve > 0 ? 0 : 1;
  return `M ${x} ${y} A ${rx} ${ry} 0 0 ${sweep} ${x2} ${y}`;
}

export function textPivot(
  x: number,
  y: number,
  textWidth: number,
  fontSize: number,
): { x: number; y: number } {
  return { x: x + textWidth / 2, y: y - fontSize / 2 };
}

function rotatePoint(
  px: number,
  py: number,
  cx: number,
  cy: number,
  angleDeg: number,
): { x: number; y: number } {
  if (angleDeg === 0) return { x: px, y: py };
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = px - cx;
  const dy = py - cy;
  return {
    x: cx + dx * cos - dy * sin,
    y: cy + dx * sin + dy * cos,
  };
}

function boundsFromPoints(points: { x: number; y: number }[]): Rect {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

function rotateRectBounds(
  rect: Rect,
  pivotX: number,
  pivotY: number,
  angleDeg: number,
): Rect {
  if (angleDeg === 0) return rect;
  const corners = [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.width, y: rect.y },
    { x: rect.x + rect.width, y: rect.y + rect.height },
    { x: rect.x, y: rect.y + rect.height },
  ].map((p) => rotatePoint(p.x, p.y, pivotX, pivotY, angleDeg));
  return boundsFromPoints(corners);
}

export function horizontalTextBoundsWithCurve(
  x: number,
  y: number,
  textWidth: number,
  fontSize: number,
  curve: number,
  rotation = 0,
): Rect {
  const pad = fontSize * 0.15;
  const pivot = textPivot(x, y, textWidth, fontSize);
  let rect: Rect;

  if (curve === 0) {
    rect = { x, y: y - fontSize, width: textWidth, height: fontSize * 1.2 };
  } else {
    const ry = ellipseRy(curve, textWidth);
    if (curve > 0) {
      rect = {
        x,
        y: y - fontSize - ry - pad,
        width: textWidth,
        height: fontSize + ry + pad * 2,
      };
    } else {
      rect = {
        x,
        y: y - fontSize,
        width: textWidth,
        height: fontSize + ry + pad * 2,
      };
    }
  }

  return rotateRectBounds(rect, pivot.x, pivot.y, rotation);
}

export function textRotationTransform(
  rotation: number,
  pivotX: number,
  pivotY: number,
): string | undefined {
  if (rotation === 0) return undefined;
  return `rotate(${rotation}, ${pivotX}, ${pivotY})`;
}

export function curvedTextPathId(layerId: string): string {
  return `text-curve-${layerId.replace(/[^a-zA-Z0-9-_]/g, "")}`;
}
