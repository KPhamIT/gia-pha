'use client';

import { useEffect, useEffectEvent } from 'react';

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

/** Blur focused inputs and reset scroll after closing an overlay (iOS page-zoom recovery). */
export function dismissOverlayFocus(): void {
  const el = document.activeElement;
  if (el instanceof HTMLElement) el.blur();
  syncOverlayViewport();
  window.scrollTo(0, 0);
  // iOS updates visualViewport after the keyboard dismiss animation.
  requestAnimationFrame(() => syncOverlayViewport());
  window.setTimeout(() => syncOverlayViewport(), 100);
  window.setTimeout(() => syncOverlayViewport(), 300);
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

/** Resync overlay sizing after iOS bfcache / tab restore so fixed layers receive touches again. */
export function useOverlayPageRecovery(onRestore?: () => void): void {
  const handleRestore = useEffectEvent(() => {
    onRestore?.();
  });

  useEffect(() => {
    const resyncViewport = () => {
      syncOverlayViewport();
      dismissOverlayFocus();
    };

    const onPageShow = (event: PageTransitionEvent) => {
      resyncViewport();
      if (event.persisted) handleRestore();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') resyncViewport();
    };

    window.addEventListener('pageshow', onPageShow);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      window.removeEventListener('pageshow', onPageShow);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);
}
