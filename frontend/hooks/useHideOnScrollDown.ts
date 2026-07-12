"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const DELTA_MIN = 8;
const TOP_ALWAYS_SHOW = 40;

function readScrollTop(target: EventTarget | null): number | null {
  if (target === document || target === document.documentElement) {
    return window.scrollY || document.documentElement.scrollTop || 0;
  }
  if (target instanceof Element) {
    return target.scrollTop;
  }
  return null;
}

/**
 * Facebook-style: hide chrome when scrolling down, show when scrolling up.
 * Uses capture so nested `overflow` scrollers also drive the nav.
 */
export function useHideOnScrollDown() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setHidden(false);
  }, [pathname]);

  useEffect(() => {
    let lastY = window.scrollY || 0;
    let lastTarget: EventTarget | null = null;

    const onScroll = (event: Event) => {
      const y = readScrollTop(event.target);
      if (y == null) return;

      if (event.target !== lastTarget) {
        lastTarget = event.target;
        lastY = y;
        return;
      }

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
