import JsonLd from "./JsonLd";
import { generatePageJsonLd, type FaqItem, type BreadcrumbItem } from "@/lib/seo/json-ld";
import type { SeoPageType } from "@/lib/seo/types";

type SeoSchemasProps = {
  path: string;
  title: string;
  description: string;
  pageType?: SeoPageType;
  faq?: FaqItem[];
  breadcrumbs?: BreadcrumbItem[];
  publishedAt?: string;
  updatedAt?: string;
  author?: string;
  keywords?: string[];
  headline?: string;
};

export default function SeoSchemas(props: SeoSchemasProps) {
  const graph = generatePageJsonLd(props);
  if (graph.length === 0) return null;
  return <JsonLd data={graph} id={`schema-${props.path.replace(/\//g, "-") || "home"}`} />;
}

export { JsonLd };
