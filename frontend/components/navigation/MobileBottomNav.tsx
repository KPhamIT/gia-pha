"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useHideOnScrollDown } from "@/hooks/useHideOnScrollDown";
import {
  MOBILE_BOTTOM_NAV_ITEMS,
  type MobileBottomNavId,
} from "@/lib/navigation/mobile-bottom-nav";

type MobileBottomNavProps = {
  activeId?: MobileBottomNavId | null;
};

function NavIcon({ id, active }: { id: MobileBottomNavId; active: boolean }) {
  const className = active ? "text-[#663100]" : "text-[#65676b]";
  switch (id) {
    case "home":
      return (
        <svg viewBox="0 0 24 24" width={26} height={26} aria-hidden className={className}>
          <path
            fill="currentColor"
            d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
          />
        </svg>
      );
    case "book":
      return (
        <svg viewBox="0 0 24 24" width={26} height={26} aria-hidden className={className}>
          <path
            fill="currentColor"
            d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"
          />
        </svg>
      );
    case "family":
      return (
        <svg viewBox="0 0 24 24" width={26} height={26} aria-hidden className={className}>
          <path
            fill="currentColor"
            d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
          />
        </svg>
      );
    case "events":
      return (
        <svg viewBox="0 0 24 24" width={26} height={26} aria-hidden className={className}>
          <path
            fill="currentColor"
            d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z"
          />
        </svg>
      );
    case "profile":
      return (
        <svg viewBox="0 0 24 24" width={26} height={26} aria-hidden className={className}>
          <path
            fill="currentColor"
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
          />
        </svg>
      );
  }
}

export default function MobileBottomNav({ activeId }: MobileBottomNavProps) {
  const pathname = usePathname();
  const hidden = useHideOnScrollDown();

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] transition-transform duration-300 ease-out md:hidden ${
        hidden ? "translate-y-[calc(100%+0.75rem)]" : "translate-y-0"
      }`}
    >
      <nav
        aria-label="Điều hướng chính"
        aria-hidden={hidden}
        className={`pointer-events-auto mx-auto flex h-14 max-w-md items-center justify-between gap-0.5 rounded-full border border-black/5 bg-white/95 px-1.5 shadow-[0_4px_24px_rgba(28,28,25,0.14)] backdrop-blur-md ${
          hidden ? "pointer-events-none" : ""
        }`}
      >
        {MOBILE_BOTTOM_NAV_ITEMS.map((item) => {
          const active = activeId
            ? item.id === activeId
            : item.match(pathname);
          return (
            <Link
              key={item.id}
              href={item.href}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              title={item.label}
              tabIndex={hidden ? -1 : undefined}
              className={`grid h-11 flex-1 place-items-center rounded-2xl transition-colors ${
                active
                  ? "bg-[#fc8f34]/22"
                  : "active:bg-black/[0.04]"
              }`}
            >
              <NavIcon id={item.id} active={active} />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
