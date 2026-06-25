import { BLOG_CATEGORY_LABELS } from "@/lib/constants/ui-strings/blog";
import type { BlogCategory } from "@/lib/blog/types";

export function blogCategoryLabel(category: BlogCategory): string {
  return BLOG_CATEGORY_LABELS[category] ?? category;
}

export function formatBlogDate(iso: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
