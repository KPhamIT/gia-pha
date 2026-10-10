"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

const MAX_TILT_Y = 22;
const MAX_TILT_X = 14;

/** Nghiêng sách 3D + điểm sáng theo con trỏ chuột (qua CSS variables). */
export function useBookTilt() {
  const bookRef = useRef<HTMLDivElement>(null);
  const [tracking, setTracking] = useState(false);

  const handlePointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    const book = bookRef.current;
    if (!book || e.pointerType !== "mouse") return;
    const rect = book.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    book.style.setProperty("--ry", `${(x - 0.5) * 2 * MAX_TILT_Y}deg`);
    book.style.setProperty("--rx", `${(0.5 - y) * 2 * MAX_TILT_X}deg`);
    book.style.setProperty("--gx", `${x * 100}%`);
    book.style.setProperty("--gy", `${y * 100}%`);
    book.style.setProperty("--glare", "0.85");
    if (!tracking) setTracking(true);
  };

  const resetTilt = () => {
    const book = bookRef.current;
    setTracking(false);
    if (!book) return;
    book.style.setProperty("--ry", "0deg");
    book.style.setProperty("--rx", "0deg");
    book.style.setProperty("--glare", "0.55");
  };

  return { bookRef, tracking, setTracking, handlePointerMove, resetTilt };
}
