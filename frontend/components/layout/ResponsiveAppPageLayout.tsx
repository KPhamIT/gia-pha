"use client";

import type { ReactNode } from "react";
import Icon from "@/components/icons/Icon";
import AccountHeaderButton from "@/components/auth/AccountHeaderButton";
import LandingHeader from "@/components/public/landing/LandingHeader";
import LandingScrollArea from "@/components/public/LandingScrollArea";
import LandingSiteFooter from "@/components/public/landing/LandingSiteFooter";
import MobileBottomNav from "@/components/navigation/MobileBottomNav";
import { SITE } from "@/config/site";
import { useBackNavigation } from "@/hooks/useBackNavigation";
import type { MobileBottomNavId } from "@/lib/navigation/mobile-bottom-nav";
import { UI } from "@/lib/constants/ui-strings";

type ResponsiveAppPageLayoutProps = {
  title: string;
  backHref?: string;
  activeNav?: MobileBottomNavId | null;
  fab?: ReactNode;
  /** Footer landing trên desktop (mặc định bật). */
  showDesktopFooter?: boolean;
  children: ReactNode;
};

/**
 * Layout trang app: mobile (header + bottom nav) và desktop (landing header).
 * Dùng lại cho các trang nội bộ trên mobile sau này.
 */
export default function ResponsiveAppPageLayout({
  title,
  backHref = "/book",
  activeNav,
  fab,
  showDesktopFooter = true,
  children,
}: ResponsiveAppPageLayoutProps) {
  const goBack = useBackNavigation(backHref);

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#fcf9f4] text-[#1c1c19]">
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-[#d4c3c1]/60 bg-[#fcf9f4]/85 px-4 shadow-sm backdrop-blur-md md:hidden">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={goBack}
            className="-ml-2 rounded-full p-2 transition-colors hover:bg-[#ebe8e3]"
            aria-label={UI.BACK}
          >
            <Icon
              path="arrowLeft"
              size={22}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              pointer={false}
              className="text-[#321716]"
            />
          </button>
          <h1 className="truncate font-serif text-xl font-semibold text-[#321716]">
            {title}
          </h1>
        </div>
        <AccountHeaderButton />
      </header>

      <div className="hidden shrink-0 md:block">
        <LandingHeader brandName={SITE.brandName} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <LandingScrollArea>
          <main className="w-full">
            <div className="w-full px-4 pb-32 pt-20 md:px-10 md:pb-10 md:pt-8">
              {children}
            </div>
            {showDesktopFooter ? (
              <div className="hidden md:block">
                <LandingSiteFooter />
              </div>
            ) : null}
          </main>
        </LandingScrollArea>
      </div>

      {fab}
      <MobileBottomNav activeId={activeNav} />
    </div>
  );
}
