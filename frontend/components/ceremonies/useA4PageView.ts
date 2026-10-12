"use client";

import { useSyncExternalStore } from "react";

/**
 * Hiển thị bài cúng thành tờ A4 khi màn hình đủ rộng (từ máy tính bảng).
 * Trên điện thoại tờ A4 bị thu quá nhỏ để đọc, nên giữ dạng đọc liền.
 */
const QUERY = "(min-width: 768px)";

function subscribe(onChange: () => void): () => void {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

export function useA4PageView(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
