"use client";

import Link from "next/link";
import { useAuthBootstrap } from "@/hooks/useAuthBootstrap";
import { useAuthStore } from "@/store/authStore";
import { UI } from "@/lib/constants/ui-strings";
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
        className="inline-flex items-center rounded-lg border border-[#d4c3c1] bg-white px-4 py-2 text-sm font-semibold text-[#321716] transition hover:bg-[#f6f3ee]"
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
