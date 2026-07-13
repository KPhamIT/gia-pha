"use client";

import { usePathname } from "next/navigation";
import MobileBottomNav from "@/components/navigation/MobileBottomNav";
import MobileMenuSheet from "@/components/navigation/MobileMenuSheet";
import {
  resolveMobileBottomNavId,
  shouldShowMobileBottomNav,
} from "@/lib/navigation/mobile-bottom-nav";

/** Bottom navigation + menu sheet cố định trên mobile. */
export default function GlobalMobileChrome() {
  const pathname = usePathname();
  const activeId = resolveMobileBottomNavId(pathname);
  const showBottomNav = shouldShowMobileBottomNav(pathname);

  return (
    <>
      {showBottomNav ? <MobileBottomNav activeId={activeId} /> : null}
      <MobileMenuSheet />
    </>
  );
}
