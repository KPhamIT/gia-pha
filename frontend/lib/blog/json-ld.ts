import type { BlogPost } from "@/lib/blog/types";
import { getSiteUrl } from "@/lib/site-url";
import { UI } from "@/lib/constants/ui-strings";

export function blogArticleJsonLd(post: BlogPost) {
  const url = `${getSiteUrl()}/bai-viet/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    keywords: post.tags.join(", "),
    inLanguage: "vi",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: {
      "@type": "Organization",
      name: UI.PAGE_TITLE,
    },
    publisher: {
      "@type": "Organization",
      name: UI.PAGE_TITLE,
      url: getSiteUrl(),
    },
  };
}
