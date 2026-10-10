"use client";

import { useCallback, useLayoutEffect, useState, type RefObject } from "react";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Transform đưa `el` về vị trí + kích thước của `rect` (kỹ thuật FLIP). */
function flipFrom(el: HTMLElement, rect: DOMRect): string {
  const target = el.getBoundingClientRect();
  const dx = rect.left + rect.width / 2 - (target.left + target.width / 2);
  const dy = rect.top + rect.height / 2 - (target.top + target.height / 2);
  return `translate(${dx}px, ${dy}px) scale(${rect.width / target.width})`;
}

/**
 * Mở: bìa bay từ ô nhỏ ra giữa, hơi xoay rồi dừng. Đóng: bay ngược về ô nhỏ
 * rồi mới gọi `onClosed`. Bỏ hiệu ứng khi người dùng bật giảm chuyển động.
 */
export function useFlipPresence(
  moverRef: RefObject<HTMLElement | null>,
  getOriginRect: () => DOMRect | null,
  onClosed: () => void,
) {
  const [closing, setClosing] = useState(false);

  useLayoutEffect(() => {
    const mover = moverRef.current;
    const origin = getOriginRect();
    if (!mover || !origin || prefersReducedMotion()) return;
    mover.animate(
      [
        { transform: flipFrom(mover, origin), opacity: 0.5 },
        { transform: "translate(0, 0) scale(1.04) rotateY(-16deg)", opacity: 1, offset: 0.7 },
        { transform: "none", opacity: 1 },
      ],
      { duration: 780, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" },
    );
    // Chỉ chạy một lần lúc mở.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = useCallback(() => {
    if (closing) return;
    const mover = moverRef.current;
    const origin = getOriginRect();
    if (!mover || !origin || prefersReducedMotion()) {
      onClosed();
      return;
    }
    setClosing(true);
    const anim = mover.animate(
      [{ transform: "none", opacity: 1 }, { transform: flipFrom(mover, origin), opacity: 0.4 }],
      { duration: 420, easing: "cubic-bezier(0.5, 0, 0.75, 0)", fill: "forwards" },
    );
    anim.onfinish = onClosed;
  }, [closing, getOriginRect, moverRef, onClosed]);

  return { closing, close };
}
