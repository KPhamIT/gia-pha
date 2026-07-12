"use client";

import { useCallback, useRef, useState } from "react";

const DISTANCE_MIN = 80;
const AXIS_LOCK = 10;

type SwipeLeftDismiss = {
  offsetX: number;
  dismissing: boolean;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  onTouchCancel: () => void;
};

function shouldIgnoreTarget(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    Boolean(target.closest("[data-swipe-ignore]"))
  );
}

/** Vuốt sang trái đủ xa → gọi onDismiss (menu Facebook). */
export function useSwipeLeftDismiss(onDismiss: () => void): SwipeLeftDismiss {
  const startX = useRef(0);
  const startY = useRef(0);
  const offsetRef = useRef(0);
  const axis = useRef<"pending" | "h" | "v">("pending");
  const active = useRef(false);
  const [offsetX, setOffsetX] = useState(0);
  const [dismissing, setDismissing] = useState(false);

  const reset = useCallback(() => {
    active.current = false;
    axis.current = "pending";
    offsetRef.current = 0;
    setOffsetX(0);
    setDismissing(false);
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (shouldIgnoreTarget(e.target)) {
      active.current = false;
      return;
    }
    const touch = e.touches[0];
    if (!touch) return;
    startX.current = touch.clientX;
    startY.current = touch.clientY;
    offsetRef.current = 0;
    axis.current = "pending";
    active.current = true;
    setDismissing(false);
    setOffsetX(0);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!active.current) return;
    const touch = e.touches[0];
    if (!touch) return;
    const dx = touch.clientX - startX.current;
    const dy = touch.clientY - startY.current;

    if (axis.current === "pending") {
      if (Math.abs(dx) < AXIS_LOCK && Math.abs(dy) < AXIS_LOCK) return;
      axis.current = Math.abs(dx) >= Math.abs(dy) ? "h" : "v";
    }
    if (axis.current !== "h") {
      offsetRef.current = 0;
      setOffsetX(0);
      return;
    }

    const next = dx < 0 ? dx : 0;
    offsetRef.current = next;
    setOffsetX(next);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!active.current) return;
    const shouldClose =
      axis.current === "h" && offsetRef.current <= -DISTANCE_MIN;
    if (shouldClose) {
      setDismissing(true);
      setOffsetX(-window.innerWidth);
      window.setTimeout(() => {
        onDismiss();
        reset();
      }, 180);
      return;
    }
    reset();
  }, [onDismiss, reset]);

  return {
    offsetX,
    dismissing,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel: reset,
  };
}
