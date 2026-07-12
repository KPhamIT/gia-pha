"use client";

import type { ReactNode } from "react";
import Icon from "@/components/icons/Icon";
import AccountHeaderButton from "@/components/auth/AccountHeaderButton";
import LandingHeader from "@/components/public/landing/LandingHeader";
import LandingScrollArea from "@/components/public/LandingScrollArea";
import LandingSiteFooter from "@/components/public/landing/LandingSiteFooter";
import MobileMenuButton from "@/components/navigation/MobileMenuButton";
import { SITE } from "@/config/site";
import { useBackNavigation } from "@/hooks/useBackNavigation";
import { UI } from "@/lib/constants/ui-strings";

type ResponsiveAppPageLayoutProps = {
  title: string;
  backHref?: string;
  fab?: ReactNode;
  /** Footer landing trên desktop (mặc định bật). */
  showDesktopFooter?: boolean;
  /** Tuỳ chỉnh wrapper nội dung (mặc định padding trang app). */
  contentClassName?: string;
  /** false khi trang con đã có H1 riêng (vd. chi tiết bài viết). */
  mobileTitleAsHeading?: boolean;
  children: ReactNode;
};

/**
 * Layout trang app: mobile (header + bottom nav) và desktop (landing header).
 * Dùng lại cho các trang nội bộ trên mobile sau này.
 */
const MOBILE_HEADER_PAD =
  "pt-[calc(5rem+env(safe-area-inset-top))] md:pt-8";

export default function ResponsiveAppPageLayout({
  title,
  backHref = "/book",
  fab,
  showDesktopFooter = true,
  contentClassName = `w-full px-4 pb-32 ${MOBILE_HEADER_PAD} md:px-10 md:pb-10`,
  mobileTitleAsHeading = true,
  children,
}: ResponsiveAppPageLayoutProps) {
  const goBack = useBackNavigation(backHref);
  const titleClassName =
    "truncate font-serif text-xl font-semibold text-[#321716]";

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#fcf9f4] text-[#1c1c19]">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-[#d4c3c1]/60 bg-[#fcf9f4]/85 pt-[env(safe-area-inset-top)] shadow-sm backdrop-blur-md md:hidden">
        <div className="flex h-16 items-center justify-between px-4">
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
            {mobileTitleAsHeading ? (
              <h1 className={titleClassName}>{title}</h1>
            ) : (
              <p className={titleClassName}>{title}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <AccountHeaderButton />
            <MobileMenuButton />
          </div>
        </div>
      </header>

      <div className="hidden shrink-0 md:block">
        <LandingHeader brandName={SITE.brandName} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <LandingScrollArea>
          <main className="flex min-h-full w-full flex-col">
            <div className={`min-h-0 flex-1 ${contentClassName}`}>
              {children}
            </div>
            {showDesktopFooter ? (
              <div className="mt-auto hidden shrink-0 md:block">
                <LandingSiteFooter />
              </div>
            ) : null}
          </main>
        </LandingScrollArea>
      </div>

      {fab}
    </div>
  );
}
