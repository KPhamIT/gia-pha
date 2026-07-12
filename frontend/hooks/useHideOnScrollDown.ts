"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const DELTA_MIN = 8;
const TOP_ALWAYS_SHOW = 40;

function readScrollTop(target: EventTarget | null): number | null {
  if (
    target === document ||
    target === document.documentElement ||
    target === document.body
  ) {
    return window.scrollY || document.documentElement.scrollTop || 0;
  }
  if (target instanceof Element) {
    return target.scrollTop;
  }
  return null;
}

/** Chỉ scroller trang (window / `.sheet-scroll`), bỏ qua carousel & scroll lồng nhau. */
function isPageScroller(target: EventTarget | null): boolean {
  if (
    target === document ||
    target === document.documentElement ||
    target === document.body
  ) {
    return true;
  }
  return target instanceof Element && target.classList.contains("sheet-scroll");
}

/**
 * Facebook-style: hide chrome when scrolling down, show when scrolling up.
 * Capture + filter so only the main page scroller drives the nav.
 */
export function useHideOnScrollDown() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setHidden(false);
  }, [pathname]);

  useEffect(() => {
    let lastY = window.scrollY || 0;

    const onScroll = (event: Event) => {
      if (!isPageScroller(event.target)) return;

      const y = readScrollTop(event.target);
      if (y == null) return;

      const delta = y - lastY;
      if (Math.abs(delta) < DELTA_MIN) return;

      if (y <= TOP_ALWAYS_SHOW) {
        setHidden(false);
      } else if (delta > 0) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastY = y;
    };

    document.addEventListener("scroll", onScroll, {
      capture: true,
      passive: true,
    });
    return () => {
      document.removeEventListener("scroll", onScroll, true);
    };
  }, []);

  return hidden;
}
