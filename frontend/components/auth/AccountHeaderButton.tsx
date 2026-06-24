"use client";

import Link from "next/link";
import { useAuthBootstrap } from "@/hooks/useAuthBootstrap";
import { useAuthStore } from "@/store/authStore";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import { userDisplayInitials } from "@/utils/user-display";

/** Góc phải header: đăng nhập (khách) hoặc avatar 2 chữ cái → /account. */
export default function AccountHeaderButton() {
  const { loaded, isLoggedIn } = useAuthBootstrap();
  const user = useAuthStore((s) => s.user);
  const person = useAuthStore((s) => s.person);

  if (!loaded) return null;

  if (!isLoggedIn || !user) {
    return (
      <Link
        href="/login"
        className={`${BT.btnBase} ${BT.btnSm} ${BT.btnGhost} text-amber-100`}
      >
        {UI.LANDING_CTA_LOGIN}
      </Link>
    );
  }

  const initials = userDisplayInitials(user, person);

  return (
    <Link
      href="/account"
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-100 text-sm font-semibold text-amber-900 ring-2 ring-amber-200/40 transition hover:bg-amber-50"
      aria-label={UI.ACCOUNT_TITLE}
      title={UI.ACCOUNT_TITLE}
    >
      {initials}
    </Link>
  );
}
