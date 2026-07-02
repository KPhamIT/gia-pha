import { SITE, buildAbsoluteUrl, getDefaultOgImageUrl } from "@/config/site";
import type { SeoImage } from "./types";

type OpenGraphInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: string | SeoImage;
  publishedAt?: string;
  updatedAt?: string;
};

function resolveImage(image?: string | SeoImage) {
  if (!image) {
    return {
      url: getDefaultOgImageUrl(),
      width: 512,
      height: 512,
      alt: SITE.siteName,
    };
  }
  if (typeof image === "string") {
    const url = image.startsWith("http") ? image : buildAbsoluteUrl(image);
    return { url, alt: SITE.siteName };
  }
  const url = image.url.startsWith("http")
    ? image.url
    : buildAbsoluteUrl(image.url);
  return {
    url,
    width: image.width,
    height: image.height,
    alt: image.alt ?? SITE.siteName,
  };
}

export function generateOpenGraph(input: OpenGraphInput) {
  const image = resolveImage(input.image);
  return {
    siteName: SITE.brandName,
    title: input.title,
    description: input.description,
    url: buildAbsoluteUrl(input.path),
    locale: SITE.locale,
    type: input.type ?? "website",
    images: [image],
    ...(input.type === "article" && input.publishedAt
      ? {
          publishedTime: input.publishedAt,
          modifiedTime: input.updatedAt ?? input.publishedAt,
        }
      : {}),
  };
}
