import type { Rect } from "@/lib/family-tree/export-tree-svg";

export const TEXT_CURVE_MIN = -100;
export const TEXT_CURVE_MAX = 100;
export const TEXT_CURVE_STEP = 1;

export const TEXT_ROTATION_MIN = -180;
export const TEXT_ROTATION_MAX = 180;
export const TEXT_ROTATION_STEP = 1;

/** Fallback khi chưa đo được trên canvas (SSR / thiếu context). */
const FALLBACK_CHAR_WIDTH = 0.9;
/** Đệm đường path để glyph cuối không bị dồn/méo. */
const PATH_PAD_RATIO = 0.08;

let measureCanvas: HTMLCanvasElement | null = null;

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
  fontFamily?: string,
  bold = false,
): number {
  const fallback =
    Math.max(text.length, 1) * fontSize * FALLBACK_CHAR_WIDTH * (bold ? 1.06 : 1);
  if (typeof document === "undefined" || !fontFamily) return fallback;

  measureCanvas ??= document.createElement("canvas");
  const ctx = measureCanvas.getContext("2d");
  if (!ctx) return fallback;

  const weight = bold ? "700" : "400";
  ctx.font = `${weight} ${fontSize}px ${fontFamily}`;
  const measured = ctx.measureText(text).width;
  // Font decor/thư pháp đôi khi đo hẹp hơn khi render SVG — lấy max + nhẹ.
  return Math.max(measured * 1.02, fallback * 0.85, fontSize * 0.5);
}

/**
 * Độ vồng (sagitta) của cung — đỉnh so với baseline.
 * curve ±100 ≈ ~35% chiều chữ; giới hạn < nửa chord để không thành nửa vòng.
 */
export function curveSagitta(curve: number, textWidth: number): number {
  if (curve === 0) return 0;
  const half = textWidth / 2;
  const raw = (Math.abs(curve) / 100) * textWidth * 0.35;
  return Math.min(raw, half * 0.92);
}

/** Alias bounds — dùng độ vồng cung tròn. */
export function ellipseRy(curve: number, textWidth: number): number {
  return curveSagitta(curve, textWidth);
}

/**
 * Cung tròn nông qua chord + sagitta (không dùng nửa elip).
 * Nửa elip với rx=nửa chord khiến tiếp tuyến đầu/cuối ~thẳng đứng → chữ méo.
 * Cung tròn R = (chord²/4 + s²)/(2s) giữ tiếp tuyến gần ngang khi cong nhẹ.
 * curve > 0: vồng lên; curve < 0: võng xuống.
 */
export function buildEllipticalTextPath(
  x: number,
  y: number,
  textWidth: number,
  curve: number,
): string {
  const endPad = textWidth * PATH_PAD_RATIO;
  const pathWidth = textWidth + endPad;
  const x1 = x + pathWidth;
  if (curve === 0) {
    return `M ${x} ${y} L ${x1} ${y}`;
  }
  const half = pathWidth / 2;
  const sagitta = curveSagitta(curve, pathWidth);
  const radius = (half * half + sagitta * sagitta) / (2 * sagitta);
  // SVG +y xuống: sweep=0 (CCW) từ trái→phải đi qua phía trên màn hình.
  const sweep = curve > 0 ? 0 : 1;
  return `M ${x} ${y} A ${radius} ${radius} 0 0 ${sweep} ${x1} ${y}`;
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
  const endPad = textWidth * PATH_PAD_RATIO;
  const pivot = textPivot(x, y, textWidth, fontSize);
  let rect: Rect;

  if (curve === 0) {
    rect = { x, y: y - fontSize, width: textWidth, height: fontSize * 1.2 };
  } else {
    const sag = curveSagitta(curve, textWidth + endPad);
    if (curve > 0) {
      rect = {
        x,
        y: y - fontSize - sag - pad,
        width: textWidth + endPad,
        height: fontSize + sag + pad * 2,
      };
    } else {
      rect = {
        x,
        y: y - fontSize,
        width: textWidth + endPad,
        height: fontSize + sag + pad * 2,
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
