"use client";

import { useEffect, useState, type RefObject } from "react";

/** Khoảng trống hai bên tờ giấy trong vùng cuộn (px). */
const CANVAS_GUTTER_PX = 16;

/**
 * Tỉ lệ thu nhỏ để nội dung rộng `contentWidthPx` vừa khung `containerRef`
 * (không phóng to quá 1) — giữ nguyên chỗ xuống dòng trên màn hình hẹp.
 */
export function useFitZoom(
  containerRef: RefObject<HTMLElement | null>,
  contentWidthPx: number,
): number {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const update = () => {
      const available = container.clientWidth - CANVAS_GUTTER_PX * 2;
      setZoom(Math.min(1, Math.max(0.3, available / contentWidthPx)));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef, contentWidthPx]);

  return zoom;
}
