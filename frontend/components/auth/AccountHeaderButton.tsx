"use client";

import Link from "next/link";
import { useAuthBootstrap } from "@/hooks/useAuthBootstrap";
import { useAuthStore } from "@/store/authStore";
import { UI } from "@/lib/constants/ui-strings";
import { userDisplayInitials } from "@/utils/user-display";

/**
 * Góc phải header: avatar 2 chữ cái → /account khi đã đăng nhập tài khoản thật.
 * Khách (kể cả đang xem trang mẫu bằng tài khoản demo) thấy nút "Tạo gia phả" + Đăng nhập.
 */
export default function AccountHeaderButton() {
  const { loaded, isLoggedIn } = useAuthBootstrap();
  const isDemo = useAuthStore((s) => s.isDemo);
  const user = useAuthStore((s) => s.user);
  const person = useAuthStore((s) => s.person);

  if (!loaded) return null;

  if (!isLoggedIn || !user || isDemo) {
    return (
      <span className="flex items-center gap-2">
        <Link
          href="/tao-dong-ho"
          className="inline-flex items-center rounded-lg bg-[#944a00] px-3 py-2 text-sm font-semibold whitespace-nowrap text-white transition hover:bg-[#7a3d00]"
        >
          {UI.HEADER_CTA_CREATE}
        </Link>
        <Link
          href="/login"
          className="hidden items-center rounded-lg border border-[#d4c3c1] bg-white px-4 py-2 text-sm font-semibold text-[#321716] transition hover:bg-[#f6f3ee] whitespace-nowrap xl:inline-flex"
        >
          {UI.LANDING_CTA_LOGIN}
        </Link>
      </span>
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
