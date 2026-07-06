"use client";

import { usePathname } from "next/navigation";
import MobileBottomNav from "@/components/navigation/MobileBottomNav";
import { resolveMobileBottomNavId } from "@/lib/navigation/mobile-bottom-nav";

/** Bottom navigation cố định trên mobile — thay footer. */
export default function GlobalMobileChrome() {
  const pathname = usePathname();
  const activeId = resolveMobileBottomNavId(pathname);

  return <MobileBottomNav activeId={activeId} />;
}
