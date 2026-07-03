"use client";

import type { ReactNode } from "react";
import ResponsiveAppPageLayout from "@/components/layout/ResponsiveAppPageLayout";
import type { MobileBottomNavId } from "@/lib/navigation/mobile-bottom-nav";

type MobilePageShellProps = {
  title: string;
  backHref?: string;
  activeNav?: MobileBottomNavId | null;
  fab?: ReactNode;
  children: ReactNode;
};

/**
 * @deprecated Dùng `ResponsiveAppPageLayout` — giữ alias để tương thích.
 */
export default function MobilePageShell(props: MobilePageShellProps) {
  return <ResponsiveAppPageLayout {...props} />;
}
