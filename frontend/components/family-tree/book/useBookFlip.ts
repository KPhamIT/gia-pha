'use client';

import { useCallback, useRef, useState } from 'react';

export const FLIP_MS = 950;

type FlipState = { dir: 'next' | 'prev'; from: number; to: number };

/**
 * Drives page navigation with the 3D page-flip animation and swipe gestures.
 * `onBeforeFlip` runs right before a flip starts (used to cache unsaved edits).
 */
export function useBookFlip(totalLeaves: number, onBeforeFlip: () => void) {
  const [pageIndex, setPageIndex] = useState(0);
  const [flip, setFlip] = useState<FlipState | null>(null);
  const touchStartX = useRef<number | null>(null);

  const goToPage = useCallback(
    (direction: 'next' | 'prev') => {
      if (flip) return;
      const nextIndex = direction === 'next' ? pageIndex + 1 : pageIndex - 1;
      if (nextIndex < 0 || nextIndex >= totalLeaves) return;

      onBeforeFlip();
      setFlip({ dir: direction, from: pageIndex, to: nextIndex });
      window.setTimeout(() => {
        setPageIndex(nextIndex);
        setFlip(null);
      }, FLIP_MS);
    },
    [flip, pageIndex, totalLeaves, onBeforeFlip],
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const startX = touchStartX.current;
    const endX = e.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (startX == null || endX == null) return;
    const delta = endX - startX;
    if (Math.abs(delta) < 48) return;
    goToPage(delta < 0 ? 'next' : 'prev');
  };

  const baseIndex = flip ? (flip.dir === 'next' ? flip.to : flip.from) : pageIndex;
  const frontIndex = flip ? (flip.dir === 'next' ? flip.from : flip.to) : pageIndex;

  return { pageIndex, flip, goToPage, handleTouchStart, handleTouchEnd, baseIndex, frontIndex };
}
