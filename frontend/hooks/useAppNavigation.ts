"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { useAuthStore } from "@/store/authStore";

const BOOK_TOUCH_RECOVERY_KEY = "gia-pha:book-touch-recover";

export function markBookTouchRecovery(): void {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(BOOK_TOUCH_RECOVERY_KEY, "1");
  }
}

export function consumeBookTouchRecovery(): boolean {
  if (typeof window === "undefined") return false;
  if (window.sessionStorage.getItem(BOOK_TOUCH_RECOVERY_KEY) !== "1")
    return false;
  window.sessionStorage.removeItem(BOOK_TOUCH_RECOVERY_KEY);
  return true;
}

/** Điều hướng chung giữa book, cây, tài khoản, thông báo… */
export function useAppNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { requireAdmin } = useFeatureAccess();

  const openBook = useCallback(() => router.push("/book"), [router]);
  const openTree = useCallback(() => router.push("/family-tree"), [router]);
  const openEvents = useCallback(() => router.push("/events"), [router]);
  const openNotifications = useCallback(
    () => router.push("/notifications"),
    [router],
  );
  const openUsers = useCallback(() => {
    if (useAuthStore.getState().isSystem) {
      router.push("/system/admins");
      return;
    }
    router.push("/org-users");
  }, [router]);
  const openCeremonyTemplates = useCallback(() => {
    if (!requireAdmin()) return;
    router.push("/ceremonies/templates");
  }, [requireAdmin, router]);

  const openAccount = useCallback(() => {
    if (pathname === "/book") markBookTouchRecovery();
    router.push("/account");
  }, [pathname, router]);

  return useMemo(
    () => ({
      openBook,
      openTree,
      openEvents,
      openAccount,
      openNotifications,
      openUsers,
      openCeremonyTemplates,
    }),
    [
      openAccount,
      openBook,
      openCeremonyTemplates,
      openEvents,
      openNotifications,
      openTree,
      openUsers,
    ],
  );
}
