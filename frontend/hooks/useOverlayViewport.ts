'use client';

import { useEffect } from 'react';

/** Keeps CSS variables in sync with the visual viewport (iOS keyboard / pinch zoom). */
export function syncOverlayViewport(): void {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  const vv = window.visualViewport;
  if (vv) {
    root.style.setProperty('--overlay-vw', `${vv.width}px`);
    root.style.setProperty('--overlay-vh', `${vv.height}px`);
    root.style.setProperty('--overlay-offset-left', `${vv.offsetLeft}px`);
    root.style.setProperty('--overlay-offset-top', `${vv.offsetTop}px`);
    return;
  }
  root.style.setProperty('--overlay-vw', `${window.innerWidth}px`);
  root.style.setProperty('--overlay-vh', `${window.innerHeight}px`);
  root.style.setProperty('--overlay-offset-left', '0px');
  root.style.setProperty('--overlay-offset-top', '0px');
}

export function useOverlayViewport(): void {
  useEffect(() => {
    syncOverlayViewport();
    const vv = window.visualViewport;
    vv?.addEventListener('resize', syncOverlayViewport);
    vv?.addEventListener('scroll', syncOverlayViewport);
    window.addEventListener('resize', syncOverlayViewport);
    window.addEventListener('orientationchange', syncOverlayViewport);
    return () => {
      vv?.removeEventListener('resize', syncOverlayViewport);
      vv?.removeEventListener('scroll', syncOverlayViewport);
      window.removeEventListener('resize', syncOverlayViewport);
      window.removeEventListener('orientationchange', syncOverlayViewport);
    };
  }, []);
}
