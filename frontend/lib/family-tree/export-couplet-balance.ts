import { coupletSyllables, type ResolvedLayout } from "./export-tree-geometry";
import type { Rect } from "./export-tree-model";

let measureCanvas: HTMLCanvasElement | null = null;

/**
 * Phần nét chữ lấn sang trái / phải tâm cột (chữ căn giữa), đo trên canvas theo
 * font đang dùng — chữ thư pháp có nét vung nên hai bên không bằng nhau.
 */
function columnExtents(
  text: string,
  fontSize: number,
  fontFamily: string,
): { left: number; right: number } | null {
  if (typeof document === "undefined") return null;
  measureCanvas ??= document.createElement("canvas");
  const ctx = measureCanvas.getContext("2d");
  if (!ctx) return null;
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.textAlign = "center";
  let left = 0;
  let right = 0;
  for (const word of coupletSyllables(text)) {
    const m = ctx.measureText(word);
    left = Math.max(left, m.actualBoundingBoxLeft);
    right = Math.max(right, m.actualBoundingBoxRight);
  }
  return { left, right };
}

/**
 * Cân hai câu đối theo mép chữ (mắt người so mép, không so tâm cột):
 * chữ thư pháp mỗi bên rộng khác nhau nên cùng tâm vẫn trông lệch.
 * Chỉ chạy khi hai cột đang đặt đối xứng qua khung — vị trí kéo tay giữ nguyên.
 */
export function balanceCouplets(
  layout: ResolvedLayout,
  frame: Rect,
  fontFamily: string,
): ResolvedLayout {
  const { coupletLeft: left, coupletRight: right } = layout;
  if (!left.visible || !right.visible) return layout;
  const frameRight = frame.x + frame.width;
  const symmetric = Math.abs(left.x - frame.x - (frameRight - right.x)) < 1;
  if (!symmetric) return layout;

  const l = columnExtents(left.text, left.fontSize, fontFamily);
  const r = columnExtents(right.text, right.fontSize, fontFamily);
  if (!l || !r) return layout;
  const leftGap = left.x - l.left - frame.x;
  const rightGap = frameRight - (right.x + r.right);
  const shift = (rightGap - leftGap) / 2;
  return {
    ...layout,
    coupletLeft: { ...left, x: left.x + shift },
    coupletRight: { ...right, x: right.x + shift },
  };
}
