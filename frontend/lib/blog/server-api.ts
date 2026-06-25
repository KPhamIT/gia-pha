import type { BlogCategory, BlogPost, BlogPostSummary, BlogSlugEntry } from "./types";

function apiBase(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:5000"
  );
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${apiBase()}${path}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function fetchBlogPosts(category?: BlogCategory) {
  const query = category ? `?category=${category}` : "";
  return fetchJson<BlogPostSummary[]>(`/blog${query}`);
}

export function fetchBlogPost(slug: string) {
  return fetchJson<BlogPost>(`/blog/${encodeURIComponent(slug)}`);
}

export function fetchBlogSlugs() {
  return fetchJson<BlogSlugEntry[]>("/blog/slugs");
}
