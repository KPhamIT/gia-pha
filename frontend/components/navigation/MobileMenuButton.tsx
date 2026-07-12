"use client";

import { useMobileMenuStore } from "@/store/mobileMenuStore";
import { UI } from "@/lib/constants/ui-strings";

/** Nút 3 sọc mở menu mobile (kiểu Facebook). */
export default function MobileMenuButton({
  className = "",
}: {
  className?: string;
}) {
  const show = useMobileMenuStore((s) => s.show);

  return (
    <button
      type="button"
      onClick={show}
      aria-label={UI.MOBILE_MENU_OPEN}
      title={UI.MOBILE_MENU_OPEN}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d4c3c1] text-[#321716] transition hover:bg-[#f6f3ee] md:hidden ${className}`}
    >
      <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden fill="currentColor">
        <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
      </svg>
    </button>
  );
}
