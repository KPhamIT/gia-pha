/**
 * Central SEO & branding configuration — single source of truth.
 * Do not hardcode brand, site name, or canonical URL elsewhere.
 */

/** Đổi tên thương hiệu tại đây — toàn app dùng `BRAND_NAME` / `SITE.brandName`. */
export const BRAND_NAME = "Cội Nguồn";

/** Chữ thương hiệu trên nền sáng. */
export const BRAND_TEXT_CLASS = "text-[#fc8f34]";

/** Chữ thương hiệu trên nền tối. */
export const BRAND_TEXT_ON_DARK_CLASS = "text-[#fc8f34]";

const DEFAULT_SITE_URL = "https://www.coinguon.io.vn";

function normalizeSiteUrl(raw: string): string {
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw.replace(/\/$/, "");
  }
  return `https://${raw.replace(/\/$/, "")}`;
}

/** Resolves canonical site URL (env override for preview/staging). */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return normalizeSiteUrl(explicit);

  if (process.env.VERCEL_ENV === "preview") {
    const vercel = process.env.NEXT_PUBLIC_VERCEL_URL?.trim();
    if (vercel) return normalizeSiteUrl(vercel);
  }

  return DEFAULT_SITE_URL;
}

export const SITE = {
  brandName: BRAND_NAME,
  siteName: `${BRAND_NAME} - Gia phả điện tử`,
  url: DEFAULT_SITE_URL,
  language: "vi",
  locale: "vi_VN",
  title: `${BRAND_NAME} - Gia phả điện tử cho gia đình và dòng họ`,
  description: `${BRAND_NAME} là nền tảng gia phả điện tử giúp tạo cây gia phả, quản lý thành viên dòng họ, lưu trữ gia phả, tra cứu ngày giỗ, sự kiện và kết nối các thế hệ trên mọi thiết bị.`,
  keywords: [
    "gia phả",
    "gia phả điện tử",
    "gia phả online",
    "cây gia phả",
    "phả hệ",
    "dòng họ",
    "gia đình",
    "nhà thờ họ",
    "ngày giỗ",
    "gia tiên",
    BRAND_NAME,
  ] as const,
  /** Highest-resolution brand logo for schema.org (512×512 PNG route). */
  logoPath: "/icons/pwa-512",
  defaultOgImagePath: "/icons/pwa-512",
  faviconPath: "/favicon.ico",
  faviconSvgPath: "/favicon.svg",
  appleIconPath: "/apple-icon",
  twitter: {
    card: "summary_large_image" as const,
    site: "@coinguon",
  },
  software: {
    name: BRAND_NAME,
    category: "Genealogy Software",
    operatingSystem: "Web",
    offers: "Free",
  },
} as const;

export function getSiteLogoUrl(): string {
  return `${getSiteUrl()}${SITE.logoPath}`;
}

export function getDefaultOgImageUrl(): string {
  return `${getSiteUrl()}${SITE.defaultOgImagePath}`;
}

export function buildAbsoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildPageTitle(pageTitle: string): string {
  if (pageTitle === SITE.title) return SITE.title;
  return `${pageTitle} | ${SITE.brandName}`;
}
