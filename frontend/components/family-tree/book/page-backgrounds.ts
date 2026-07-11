import type { CSSProperties } from "react";

/**
 * Registry of paper page backgrounds under `/public/images/book/`.
 * To add a new background:
 *   1. Put the file in `frontend/public/images/book/` (e.g. `bg-6.webp`).
 *   2. Append an entry to `PAGE_BACKGROUNDS` below.
 */

export type PageBackground = {
  id: string;
  /** Label in BookStyleControls. */
  label: string;
  /** Public URL, or empty for plain cream paper. */
  url: string;
};

export const PAGE_BACKGROUNDS: PageBackground[] = [
  { id: "none", label: "Giấy kem", url: "" },
  { id: "bg-1", label: "Nền 1", url: "/images/book/bg-1.webp" },
  { id: "bg-2", label: "Nền 2", url: "/images/book/bg-2.webp" },
  { id: "bg-3", label: "Nền 3", url: "/images/book/bg-3.webp" },
  { id: "bg-4", label: "Nền 4", url: "/images/book/bg-4.webp" },
  { id: "bg-5", label: "Nền 5", url: "/images/book/bg-5.webp" },
];

export const DEFAULT_PAGE_BACKGROUND_ID = "bg-1";

/** Cream wash over patterned backgrounds (0–100). Higher = easier to read text. */
export const DEFAULT_PAGE_BACKGROUND_WASH = 55;
export const PAGE_BACKGROUND_WASH_MIN = 0;
export const PAGE_BACKGROUND_WASH_MAX = 90;

export function getPageBackground(id: string): PageBackground {
  return PAGE_BACKGROUNDS.find((bg) => bg.id === id) ?? PAGE_BACKGROUNDS[0];
}

export function isPageBackgroundId(id: string): boolean {
  return PAGE_BACKGROUNDS.some((bg) => bg.id === id);
}

export function clampPageBackgroundWash(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return DEFAULT_PAGE_BACKGROUND_WASH;
  return Math.min(
    PAGE_BACKGROUND_WASH_MAX,
    Math.max(PAGE_BACKGROUND_WASH_MIN, Math.round(n)),
  );
}

/** Inline styles for `.paper` when a texture background is selected. */
export function pageBackgroundStyle(
  id: string,
  washPercent: number = DEFAULT_PAGE_BACKGROUND_WASH,
): CSSProperties | undefined {
  const { url } = getPageBackground(id);
  if (!url) return undefined;
  const wash = clampPageBackgroundWash(washPercent) / 100;
  return {
    backgroundImage: `url(${url})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundColor: "#fffef9",
    ["--paper-bg-wash" as string]: String(wash),
  };
}
