import type { FaqItem, BreadcrumbItem } from "@/lib/seo/types";
import { generateOrganizationSchema } from "./organization";
import { generateWebsiteSchema } from "./website";
import { generateWebPageSchema } from "./webpage";
import { generateArticleSchema } from "./article";
import { generateFAQSchema } from "./faq";
import { generateSoftwareSchema } from "./software";
import { generateBreadcrumbSchema } from "./breadcrumb";
import { generateCollectionSchema } from "./collection";
import { generateContactPageSchema } from "./contact";
import { generateHowToSchema } from "./howto";

export type SchemaType =
  | "organization"
  | "website"
  | "webpage"
  | "article"
  | "faq"
  | "software"
  | "breadcrumb"
  | "collection"
  | "contact"
  | "howto";

export type SchemaPayload =
  | { type: "organization" }
  | {
      type: "webpage";
      path: string;
      title: string;
      description: string;
    }
  | {
      type: "article";
      path: string;
      headline: string;
      description: string;
      datePublished: string;
      dateModified?: string;
      author?: string;
      image?: string;
      keywords?: string[];
    }
  | { type: "faq"; items: FaqItem[] }
  | { type: "software" }
  | { type: "breadcrumb"; items: BreadcrumbItem[] }
  | {
      type: "collection";
      path: string;
      name: string;
      description: string;
    }
  | {
      type: "contact";
      path: string;
      name: string;
      description: string;
      email?: string;
      telephone?: string;
    }
  | {
      type: "howto";
      name: string;
      description: string;
      steps: { name: string; text: string }[];
    }
  | { type: "website" };

export function generateSchema(
  payload: SchemaPayload,
): Record<string, unknown> | null {
  switch (payload.type) {
    case "organization":
      return generateOrganizationSchema();
    case "website":
      return generateWebsiteSchema();
    case "webpage":
      return generateWebPageSchema(payload);
    case "article":
      return generateArticleSchema(payload);
    case "faq":
      return generateFAQSchema(payload.items);
    case "software":
      return generateSoftwareSchema();
    case "breadcrumb":
      return generateBreadcrumbSchema(payload.items);
    case "collection":
      return generateCollectionSchema(payload);
    case "contact":
      return generateContactPageSchema(payload);
    case "howto":
      return generateHowToSchema(payload);
    default:
      return null;
  }
}

export function generateSchemaGraph(
  payloads: SchemaPayload[],
): Record<string, unknown>[] {
  return payloads
    .map((payload) => generateSchema(payload))
    .filter((schema): schema is Record<string, unknown> => schema != null);
}

export {
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateWebPageSchema,
  generateArticleSchema,
  generateFAQSchema,
  generateSoftwareSchema,
  generateBreadcrumbSchema,
  generateCollectionSchema,
  generateContactPageSchema,
  generateHowToSchema,
};

export { breadcrumbsFromPath } from "./breadcrumb";
