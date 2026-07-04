"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SCROLL_IDLE_MS = 3000;

/** Ẩn khi đang cuộn, hiện lại sau khi dừng. */
export function useScrollIdleReveal(idleMs = SCROLL_IDLE_MS) {
  const scrollRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(true);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScroll = useCallback(() => {
    setVisible(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => setVisible(true), idleMs);
  }, [idleMs]);

  useEffect(
    () => () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    },
    [],
  );

  return { scrollRef, visible, handleScroll };
}
