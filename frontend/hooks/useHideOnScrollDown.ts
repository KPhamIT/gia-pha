"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const DELTA_MIN = 8;
const TOP_ALWAYS_SHOW = 40;
/** Bỏ qua vùng sát đáy — overscroll/bounce PWA làm y dao động → nav giật. */
const BOTTOM_EDGE = 64;
const MD_QUERY = "(min-width: 768px)";

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

function readMaxScroll(target: EventTarget | null): number | null {
  if (
    target === document ||
    target === document.documentElement ||
    target === document.body
  ) {
    return Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
  }
  if (target instanceof Element) {
    return Math.max(0, target.scrollHeight - target.clientHeight);
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

type Options = {
  /** Desktop (md+) không ẩn — tránh giật layout khi spacer/header đổi. */
  mobileOnly?: boolean;
};

/**
 * Facebook-style: hide chrome when scrolling down, show when scrolling up.
 * Capture + filter so only the main page scroller drives the nav.
 */
export function useHideOnScrollDown(options?: Options) {
  const mobileOnly = options?.mobileOnly ?? false;
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setHidden(false);
  }, [pathname]);

  useEffect(() => {
    let lastY = window.scrollY || 0;
    let desktop = false;

    const mq =
      mobileOnly && typeof window.matchMedia === "function"
        ? window.matchMedia(MD_QUERY)
        : null;

    const syncDesktop = () => {
      desktop = mq?.matches ?? false;
      if (desktop) setHidden(false);
    };
    syncDesktop();
    mq?.addEventListener("change", syncDesktop);

    const onScroll = (event: Event) => {
      if (desktop) return;
      if (!isPageScroller(event.target)) return;

      const y = readScrollTop(event.target);
      const maxY = readMaxScroll(event.target);
      if (y == null || maxY == null) return;

      const delta = y - lastY;
      if (Math.abs(delta) < DELTA_MIN) return;

      // Cuối trang / rubber-band: không đổi trạng thái ẩn-hiện.
      if (maxY > 0 && y >= maxY - BOTTOM_EDGE) {
        lastY = y;
        return;
      }

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
      mq?.removeEventListener("change", syncDesktop);
      document.removeEventListener("scroll", onScroll, true);
    };
  }, [mobileOnly]);

  return hidden;
}
