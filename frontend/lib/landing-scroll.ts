import { STORAGE_KEYS } from "@/lib/constants/storage-keys";

export const LANDING_SCROLL_SELECTOR = "[data-landing-scroll]";

export function readLandingScrollY(): number | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(STORAGE_KEYS.LANDING_SCROLL_Y);
  if (raw == null) return null;
  const y = Number(raw);
  return Number.isFinite(y) && y > 0 ? y : null;
}

export function writeLandingScrollY(y: number): void {
  if (typeof window === "undefined" || y <= 0) return;
  sessionStorage.setItem(STORAGE_KEYS.LANDING_SCROLL_Y, String(Math.round(y)));
}

export function saveLandingScrollFromDocument(): void {
  const el = document.querySelector<HTMLElement>(LANDING_SCROLL_SELECTOR);
  if (el && el.scrollTop > 0) writeLandingScrollY(el.scrollTop);
}

/** Khôi phục scroll — thử lại vài frame vì layout có thể chưa đủ cao ngay sau Back. */
export function restoreLandingScroll(el: HTMLElement, y: number): void {
  if (y <= 0) return;

  let attempts = 0;
  const apply = () => {
    el.scrollTop = y;
    attempts += 1;
    const ok = Math.abs(el.scrollTop - y) <= 2;
    const canGrow = el.scrollHeight > el.clientHeight + y * 0.5;
    if (ok || attempts >= 16) return;
    if (!canGrow && attempts < 8) {
      requestAnimationFrame(apply);
      return;
    }
    requestAnimationFrame(apply);
  };

  apply();
  window.setTimeout(() => {
    el.scrollTop = y;
  }, 50);
  window.setTimeout(() => {
    el.scrollTop = y;
  }, 200);
}
