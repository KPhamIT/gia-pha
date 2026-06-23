/** Chỉ cho phép redirect nội bộ sau đăng nhập. */
export function getSafeNextPath(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/book";
  }
  return raw;
}
