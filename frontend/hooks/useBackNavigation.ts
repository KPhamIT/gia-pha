"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

/**
 * Nút back: quay lại trang trước trong lịch sử nếu có (không redirect cố định).
 * Chỉ dùng `fallbackHref` khi mở trực tiếp (không có lịch sử trong app).
 */
export function useBackNavigation(fallbackHref: string) {
  const router = useRouter();

  return useCallback(() => {
    const hasHistory =
      typeof window !== "undefined" && window.history.length > 1;
    if (hasHistory) {
      router.back();
      return;
    }
    router.push(fallbackHref);
  }, [router, fallbackHref]);
}
