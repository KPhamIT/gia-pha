"use client";

import { LAYOUT } from "@/lib/constants/ui-layout";

/** Vùng cuộn chính của trang public / app shell. */
export default function LandingScrollArea({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${LAYOUT.sheetBody} h-0 min-h-0 w-full flex-1 pb-24 md:pb-0`}
    >
      {children}
    </div>
  );
}
