"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AccountHeaderButton from "@/components/auth/AccountHeaderButton";
import Icon from "@/components/icons/Icon";
import MobileMenuButton from "@/components/navigation/MobileMenuButton";
import { BRAND_TEXT_CLASS } from "@/config/site";
import { useHideOnScrollDown } from "@/hooks/useHideOnScrollDown";
import { UI } from "@/lib/constants/ui-strings";

type LandingHeaderProps = {
  brandName: string;
};

const HEADER_OFFSET =
  "h-[calc(5rem+env(safe-area-inset-top))]";

const NAV_LINK = "transition-colors hover:text-[#944a00]";
const NAV_LINK_ACTIVE =
  "border-b-2 border-[#321716] pb-1 text-[#321716]";

const DESKTOP_NAV = [
  { href: "/", label: UI.LANDING_NAV_HOME, match: (p: string) => p === "/" },
  {
    href: "/family-tree",
    label: UI.LANDING_NAV_CLAN,
    match: (p: string) => p.startsWith("/family-tree"),
  },
  {
    href: "/events",
    label: UI.LANDING_NAV_EVENTS,
    match: (p: string) => p.startsWith("/events"),
  },
  {
    href: "/ceremonies/templates",
    label: UI.LANDING_NAV_CEREMONY,
    match: (p: string) => p.startsWith("/ceremonies/templates"),
  },
  {
    href: "/bai-viet",
    label: UI.LANDING_NAV_LIBRARY,
    match: (p: string) => p.startsWith("/bai-viet"),
  },
  {
    href: "/dich-vu",
    label: UI.LANDING_NAV_SERVICES,
    match: (p: string) => p.startsWith("/dich-vu"),
  },
] as const;

export default function LandingHeader({ brandName }: LandingHeaderProps) {
  const pathname = usePathname();
  // Chỉ ẩn trên mobile; desktop giữ cố định để khỏi giật khi scroll.
  const hidden = useHideOnScrollDown({ mobileOnly: true });

  return (
    <>
      <header
        aria-hidden={hidden}
        className={`fixed inset-x-0 top-0 z-40 border-b border-[#d4c3c1] bg-[#fcf9f4]/95 pt-[env(safe-area-inset-top)] backdrop-blur transition-transform duration-300 ease-out ${
          hidden
            ? "pointer-events-none -translate-y-full"
            : "translate-y-0"
        }`}
      >
        <div className="flex h-20 w-full items-center justify-between px-4 md:px-10">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className={`font-serif text-2xl font-bold ${BRAND_TEXT_CLASS}`}
            >
              {brandName}
            </Link>
            <nav className="hidden items-center gap-6 text-sm font-semibold text-[#504443] md:flex">
              {DESKTOP_NAV.map((item) => {
                const active = item.match(pathname);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={active ? NAV_LINK_ACTIVE : NAV_LINK}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Link
              href="/book"
              aria-label={UI.LANDING_NAV_SEARCH_ARIA}
              title={UI.LANDING_NAV_SEARCH_ARIA}
              tabIndex={hidden ? -1 : undefined}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d4c3c1] text-[#504443] transition hover:bg-[#f6f3ee] hover:text-[#321716]"
            >
              <Icon
                path="search"
                size={18}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                pointer={false}
              />
            </Link>
            <AccountHeaderButton />
            <MobileMenuButton />
          </div>
        </div>
      </header>
      {/* Chiều cao cố định — không thu khi ẩn header (tránh resize scroller → giật PWA). */}
      <div aria-hidden className={`shrink-0 ${HEADER_OFFSET}`} />
    </>
  );
}
