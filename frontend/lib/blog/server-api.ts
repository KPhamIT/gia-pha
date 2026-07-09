import type {
  BlogCategory,
  BlogPost,
  BlogPostListResponse,
  BlogSlugEntry,
} from "./types";
import { BLOG_DESKTOP_PAGE_SIZE } from "./constants";

function apiBase(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:5000"
  );
}

async function fetchJson<T>(
  path: string,
  options?: { revalidate?: number | false },
): Promise<T | null> {
  try {
    const revalidate = options?.revalidate ?? 3600;
    const res = await fetch(`${apiBase()}${path}`, {
      ...(revalidate === false
        ? { cache: "no-store" as const }
        : { next: { revalidate } }),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function fetchBlogPostsPage(options?: {
  category?: BlogCategory;
  page?: number;
  limit?: number;
}) {
  const params = new URLSearchParams();
  if (options?.category) params.set("category", options.category);
  params.set("page", String(options?.page ?? 1));
  params.set("limit", String(options?.limit ?? BLOG_DESKTOP_PAGE_SIZE));
  const query = params.toString();
  return fetchJson<BlogPostListResponse>(`/blog?${query}`);
}

export function fetchBlogPost(slug: string) {
  return fetchJson<BlogPost>(`/blog/${encodeURIComponent(slug)}`);
}

export function fetchBlogSlugs(options?: { revalidate?: number | false }) {
  return fetchJson<BlogSlugEntry[]>("/blog/slugs", {
    revalidate: options?.revalidate,
  });
}
