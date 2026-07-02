import type { Metadata } from "next";

export type FaqItem = {
  question: string;
  answer: string;
};

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export type SeoImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

export type SeoPageType =
  | "home"
  | "website"
  | "article"
  | "collection"
  | "contact"
  | "guide"
  | "software"
  | "webpage";

export type SeoInput = {
  /** Page-specific title (without brand suffix unless `titleAbsolute`). */
  title: string;
  description: string;
  /** URL path starting with `/`, e.g. `/bai-viet/slug`. */
  path: string;
  keywords?: string[];
  image?: string | SeoImage;
  type?: "website" | "article";
  publishedAt?: string;
  updatedAt?: string;
  author?: string;
  faq?: FaqItem[];
  breadcrumbs?: BreadcrumbItem[];
  pageType?: SeoPageType;
  /** Use `title` as-is without appending brand. */
  titleAbsolute?: boolean;
  noIndex?: boolean;
};

export type JsonLdGraph = Record<string, unknown>;

export type MetadataResult = Metadata;
