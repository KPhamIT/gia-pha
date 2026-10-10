/** Đọc mẫu bài cúng hệ thống công khai từ API (server component, ISR). */

export type PublicCeremonySummary = {
  id: number;
  slug: string;
  name: string;
  /** Tiêu đề in (gọn, trang trọng) — có thể trống. */
  printTitle?: string | null;
  intro: string | null;
  meaning: string | null;
  preparation: string | null;
  sourceBookTitle: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoExcerpt: string | null;
  seoKeywords: string[];
  updatedAt: string;
};

export type PublicCeremony = PublicCeremonySummary & { content: string };

function apiBase(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:5000"
  );
}

async function fetchJson<T>(path: string, revalidate = 3600): Promise<T | null> {
  try {
    const res = await fetch(`${apiBase()}${path}`, { next: { revalidate } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function fetchPublicCeremonies(revalidate?: number) {
  return fetchJson<PublicCeremonySummary[]>("/public/ceremonies", revalidate);
}

export function fetchPublicCeremony(slug: string) {
  return fetchJson<PublicCeremony>(
    `/public/ceremonies/${encodeURIComponent(slug)}`,
  );
}
