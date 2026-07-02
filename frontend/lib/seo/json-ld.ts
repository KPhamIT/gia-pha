import type { FaqItem, BreadcrumbItem, SeoInput } from "./types";
import {
  generateSchemaGraph,
  breadcrumbsFromPath,
  type SchemaPayload,
} from "@/lib/schema";

type JsonLdInput = Pick<
  SeoInput,
  | "path"
  | "title"
  | "description"
  | "pageType"
  | "faq"
  | "breadcrumbs"
  | "publishedAt"
  | "updatedAt"
  | "author"
  | "keywords"
  | "image"
> & {
  headline?: string;
};

function articlePayload(input: JsonLdInput): SchemaPayload | null {
  if (!input.publishedAt) return null;
  return {
    type: "article",
    path: input.path,
    headline: input.headline ?? input.title,
    description: input.description,
    datePublished: input.publishedAt,
    dateModified: input.updatedAt,
    author: input.author,
    image: typeof input.image === "string" ? input.image : input.image?.url,
    keywords: input.keywords,
  };
}

function pageTypeSchemas(input: JsonLdInput): SchemaPayload[] {
  const breadcrumbs =
    input.breadcrumbs ?? breadcrumbsFromPath(input.path, input.title);
  const base: SchemaPayload[] = [
    {
      type: "webpage",
      path: input.path,
      title: input.title,
      description: input.description,
    },
    { type: "breadcrumb", items: breadcrumbs },
  ];

  switch (input.pageType) {
    case "home":
      return [
        { type: "organization" },
        { type: "website" },
        ...base,
        { type: "software" },
      ];
    case "article": {
      const article = articlePayload(input);
      return article ? [...base, article] : base;
    }
    case "collection":
      return [
        ...base,
        {
          type: "collection",
          path: input.path,
          name: input.title,
          description: input.description,
        },
      ];
    case "contact":
      return [
        ...base,
        {
          type: "contact",
          path: input.path,
          name: input.title,
          description: input.description,
        },
      ];
    case "software":
      return [...base, { type: "software" }];
    case "guide":
    case "website":
    case "webpage":
    default:
      return base;
  }
}

export function generatePageJsonLd(input: JsonLdInput): Record<string, unknown>[] {
  const payloads = pageTypeSchemas(input);
  if (input.faq?.length) {
    payloads.push({ type: "faq", items: input.faq });
  }
  return generateSchemaGraph(payloads);
}

export function generateGlobalJsonLd(): Record<string, unknown>[] {
  return generateSchemaGraph([
    { type: "organization" },
    { type: "website" },
    { type: "software" },
  ]);
}

export type { FaqItem, BreadcrumbItem };
