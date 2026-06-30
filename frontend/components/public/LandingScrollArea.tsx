"use client";

import { useEffect, useRef } from "react";
import { LAYOUT } from "@/lib/constants/ui-layout";
import { writeLandingScrollY } from "@/lib/landing-scroll";

/** Vùng cuộn trang chủ — theo dõi scroll để lưu vị trí (khôi phục: LandingScrollManager). */
export default function LandingScrollArea({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      if (el.scrollTop > 0) writeLandingScrollY(el.scrollTop);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      data-landing-scroll
      className={`${LAYOUT.sheetBody} min-h-0 w-full flex-1`}
    >
      {children}
    </div>
  );
}
