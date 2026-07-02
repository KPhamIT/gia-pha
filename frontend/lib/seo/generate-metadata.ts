import type { Metadata } from "next";
import {
  SITE,
  buildPageTitle,
  getSiteUrl,
  getDefaultOgImageUrl,
} from "@/config/site";
import { generateCanonical } from "./canonical";
import { generateKeywords } from "./keywords";
import { generateOpenGraph } from "./open-graph";
import { generateRobots } from "./robots";
import { generateTwitter } from "./twitter";
import type { SeoInput } from "./types";

export function createMetadata(input: SeoInput): Metadata {
  const canonical = generateCanonical(input.path);
  const title = input.titleAbsolute
    ? { absolute: input.title }
    : input.title;
  const ogTitle = input.titleAbsolute ? input.title : buildPageTitle(input.title);
  const keywords = generateKeywords(input.keywords);
  const ogImage =
    typeof input.image === "string"
      ? input.image
      : input.image?.url ?? getDefaultOgImageUrl();

  return {
    title,
    description: input.description,
    keywords,
    metadataBase: new URL(getSiteUrl()),
    alternates: {
      canonical,
      languages: {
        [SITE.language]: canonical,
      },
    },
    robots: generateRobots(input.noIndex),
    openGraph: generateOpenGraph({
      title: ogTitle,
      description: input.description,
      path: input.path,
      type: input.type,
      image: input.image,
      publishedAt: input.publishedAt,
      updatedAt: input.updatedAt,
    }),
    twitter: generateTwitter({
      title: ogTitle,
      description: input.description,
      image: ogImage.startsWith("http") ? ogImage : undefined,
    }),
  };
}

/** Root layout defaults — extended by per-page metadata. */
export function createRootMetadata(): Metadata {
  return {
    ...createMetadata({
      title: SITE.title,
      titleAbsolute: true,
      description: SITE.description,
      path: "/",
      keywords: [...SITE.keywords],
    }),
    title: {
      default: SITE.title,
      template: `%s | ${SITE.brandName}`,
    },
    applicationName: SITE.siteName,
    appleWebApp: {
      capable: true,
      title: SITE.brandName,
      statusBarStyle: "black-translucent",
    },
    formatDetection: {
      telephone: false,
    },
    icons: {
      icon: [
        { url: SITE.faviconPath, sizes: "any" },
        { url: SITE.faviconSvgPath, type: "image/svg+xml" },
      ],
      apple: [{ url: SITE.appleIconPath, sizes: "180x180", type: "image/png" }],
      shortcut: SITE.faviconPath,
    },
  };
}

export { createMetadata as generateMetadata };
