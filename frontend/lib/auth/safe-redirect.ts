/** Chỉ cho phép redirect nội bộ sau đăng nhập. Mặc định về trang chủ. */
export function getSafeNextPath(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/";
  }
  return raw;
}
