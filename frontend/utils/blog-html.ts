/** Chuẩn hóa HTML bài blog — TipTap dễ lưu nhầm mã nguồn dạng text (&lt;p&gt;…). */

const ESCAPED_TAG =
  /&lt;\s*\/?\s*(p|h[1-6]|ul|ol|li|a|strong|em|figure|figcaption|img|div|span|blockquote|table)\b/i;

export function looksLikeEscapedHtml(html: string): boolean {
  return ESCAPED_TAG.test(html);
}

export function unescapeBlogHtml(html: string): string {
  if (!looksLikeEscapedHtml(html)) return html;
  return html
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, "&");
}

/**
 * TipTap StarterKit không có figure/figcaption.
 * Bung thành ảnh + đoạn chú thích in nghiêng.
 */
export function flattenFiguresForEditor(html: string): string {
  return html
    .replace(
      /<figure[^>]*>\s*(<img\b[^>]*>)\s*<figcaption[^>]*>([\s\S]*?)<\/figcaption>\s*<\/figure>/gi,
      (_m, img: string, caption: string) =>
        `${img}<p><em>${caption.trim()}</em></p>`,
    )
    .replace(/<figure[^>]*>\s*(<img\b[^>]*>)\s*<\/figure>/gi, "$1");
}

/** HTML an toàn để render trang công khai / nạp vào TipTap. */
export function normalizeBlogHtml(html: string): string {
  let next = unescapeBlogHtml(html.trim());

  // TipTap bọc cả khối mã nguồn đã escape trong một <p>…</p>
  const wrapped = /^<p>([\s\S]*)<\/p>$/i.exec(next);
  if (wrapped && /<(p|h[1-6]|ul|ol|figure|img)\b/i.test(wrapped[1])) {
    next = wrapped[1].replace(/<br\s*\/?>/gi, "\n");
  }

  return next;
}

/** Chuẩn bị HTML trước khi `setContent` vào TipTap. */
export function prepareHtmlForTipTap(html: string): string {
  return flattenFiguresForEditor(normalizeBlogHtml(html));
}
