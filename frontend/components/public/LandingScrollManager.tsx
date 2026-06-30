"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  LANDING_SCROLL_SELECTOR,
  readLandingScrollY,
  restoreLandingScroll,
  saveLandingScrollFromDocument,
} from "@/lib/landing-scroll";

/** Luôn mount trong root layout — lưu/khôi phục scroll trang chủ khi đổi route. */
export default function LandingScrollManager() {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    const prev = prevPathRef.current;
    prevPathRef.current = pathname;

    if (prev === "/" && pathname !== "/") {
      saveLandingScrollFromDocument();
    }

    if (pathname !== "/") return;

    const restore = () => {
      const el = document.querySelector<HTMLElement>(LANDING_SCROLL_SELECTOR);
      const y = readLandingScrollY();
      if (el && y != null) restoreLandingScroll(el, y);
    };

    restore();
    const raf = requestAnimationFrame(restore);
    const t1 = window.setTimeout(restore, 50);
    const t2 = window.setTimeout(restore, 250);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [pathname]);

  return null;
}
