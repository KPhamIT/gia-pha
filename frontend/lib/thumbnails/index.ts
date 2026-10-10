import type { SeoImage } from "@/lib/seo/types";
import { BLOG_THUMBNAIL_SLUGS, VAN_KHAN_THUMBNAIL_SLUGS } from "./manifest";

/** Thumbnail tĩnh trong public/images/thumbs/<kind>/<slug>.webp (+ .jpg cho Open Graph). */
export type ThumbnailKind = "bai-viet" | "van-khan";

export const THUMBNAIL_WIDTH = 1280;
export const THUMBNAIL_HEIGHT = 720;

const SLUGS: Record<ThumbnailKind, ReadonlySet<string>> = {
  "bai-viet": new Set(BLOG_THUMBNAIL_SLUGS),
  "van-khan": new Set(VAN_KHAN_THUMBNAIL_SLUGS),
};

export function thumbnailSrc(kind: ThumbnailKind, slug: string): string | null {
  return SLUGS[kind].has(slug) ? `/images/thumbs/${kind}/${slug}.webp` : null;
}

/** Ảnh chia sẻ 1200×630 cho Facebook/Zalo — undefined để dùng ảnh mặc định. */
export function thumbnailOgImage(
  kind: ThumbnailKind,
  slug: string,
  alt: string,
): SeoImage | undefined {
  if (!SLUGS[kind].has(slug)) return undefined;
  return { url: `/images/thumbs/${kind}/${slug}.og.jpg`, width: 1200, height: 630, alt };
}
