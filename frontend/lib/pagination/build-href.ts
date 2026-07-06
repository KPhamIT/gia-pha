/** Tạo URL phân trang, giữ query params khác (lọc, sort…). */
export function buildPaginationHref(
  basePath: string,
  page: number,
  params?: Record<string, string | undefined>,
): string {
  const search = new URLSearchParams();
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value) search.set(key, value);
    }
  }
  if (page > 1) search.set("page", String(page));
  const query = search.toString();
  return query ? `${basePath}?${query}` : basePath;
}
