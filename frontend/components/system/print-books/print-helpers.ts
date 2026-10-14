export const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

/** Chờ font (kể cả font thư pháp của bìa) tải xong trước khi mở hộp thoại in. */
export async function waitForFonts(doc: Document = document): Promise<void> {
  if ("fonts" in doc) await doc.fonts.ready;
}

/** Ghi đè khổ giấy cho lần in này (bìa có lề tràn), tự gỡ khi in xong. */
export function injectPageSize(widthMm: number, heightMm: number): () => void {
  const style = document.createElement("style");
  style.setAttribute("data-print-books-page", "true");
  style.textContent = `@page{size:${widthMm}mm ${heightMm}mm;margin:0}`;
  document.head.appendChild(style);
  return () => style.remove();
}

/** Bỏ chữ "Họ" / "Dòng họ" ở đầu tên người dùng nhập. */
export function cleanClanName(value: string): string {
  return value.trim().replace(/^(dòng\s+)?họ\s+/iu, "").trim();
}
