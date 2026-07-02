import { SITE } from "@/config/site";

export function generateKeywords(extra?: string[]): string[] {
  if (!extra?.length) return [...SITE.keywords];
  return [...new Set([...extra, ...SITE.keywords])];
}
