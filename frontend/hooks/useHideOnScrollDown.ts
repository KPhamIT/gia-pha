"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const DELTA_MIN = 12;
const TOP_ALWAYS_SHOW = 48;
/** Bỏ qua vùng sát mép — rubber-band PWA làm y dao động → chrome giật. */
const EDGE_IGNORE = 72;
const DIR_STREAK = 2;
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
    let pendingDir = 0;
    let streak = 0;
    let raf = 0;
    let queuedTarget: EventTarget | null = null;

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

    const applyScroll = (target: EventTarget | null) => {
      if (desktop) return;
      if (!isPageScroller(target)) return;

      const y = readScrollTop(target);
      const maxY = readMaxScroll(target);
      if (y == null || maxY == null) return;

      const delta = y - lastY;
      if (Math.abs(delta) < DELTA_MIN) return;

      // Mép trên/dưới + rubber-band: không đổi ẩn-hiện.
      if (y <= TOP_ALWAYS_SHOW) {
        pendingDir = 0;
        streak = 0;
        lastY = y;
        setHidden(false);
        return;
      }
      if (y < EDGE_IGNORE || (maxY > 0 && y >= maxY - EDGE_IGNORE)) {
        pendingDir = 0;
        streak = 0;
        lastY = y;
        return;
      }

      const dir = delta > 0 ? 1 : -1;
      if (dir === pendingDir) streak += 1;
      else {
        pendingDir = dir;
        streak = 1;
      }
      lastY = y;
      if (streak < DIR_STREAK) return;

      streak = 0;
      setHidden(dir > 0);
    };

    const onScroll = (event: Event) => {
      queuedTarget = event.target;
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        applyScroll(queuedTarget);
        queuedTarget = null;
      });
    };

    document.addEventListener("scroll", onScroll, {
      capture: true,
      passive: true,
    });
    return () => {
      mq?.removeEventListener("change", syncDesktop);
      document.removeEventListener("scroll", onScroll, true);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [mobileOnly]);

  return hidden;
}
