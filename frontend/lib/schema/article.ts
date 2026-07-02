import { buildAbsoluteUrl, SITE, getSiteLogoUrl } from "@/config/site";

type ArticleInput = {
  path: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  image?: string;
  keywords?: string[];
};

export function generateArticleSchema(input: ArticleInput) {
  const url = buildAbsoluteUrl(input.path);
  const orgId = `${buildAbsoluteUrl("/")}#organization`;
  const imageUrl = input.image
    ? input.image.startsWith("http")
      ? input.image
      : buildAbsoluteUrl(input.image)
    : getSiteLogoUrl();

  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: input.headline,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    ...(input.keywords?.length ? { keywords: input.keywords.join(", ") } : {}),
    inLanguage: SITE.language,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${url}#webpage` },
    author: {
      "@type": "Organization",
      name: input.author ?? SITE.brandName,
      url: buildAbsoluteUrl("/"),
    },
    publisher: {
      "@type": "Organization",
      "@id": orgId,
      name: SITE.brandName,
      url: buildAbsoluteUrl("/"),
      logo: {
        "@type": "ImageObject",
        url: getSiteLogoUrl(),
        width: 512,
        height: 512,
      },
    },
    image: {
      "@type": "ImageObject",
      url: imageUrl,
    },
  };
}
