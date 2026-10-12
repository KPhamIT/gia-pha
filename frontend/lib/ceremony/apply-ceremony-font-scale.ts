const STYLE_ID = "ceremony-viewer-font-scale";
const BASE_HTML_FONT_PX = 18;
/** Giãn dòng nội dung bài cúng khi xem và in. */
export const CEREMONY_LINE_HEIGHT = 1.85;

/** Cỡ chữ gốc (px) của bài cúng ở mức phóng `scale`. */
export function ceremonyRootFontPx(scale: number): number {
  return Math.round(BASE_HTML_FONT_PX * scale);
}

/** Scale rem-based typography inside the ceremony iframe (same-origin). */
export function applyCeremonyFontScale(
  iframe: HTMLIFrameElement | null,
  scale: number,
): void {
  const doc = iframe?.contentDocument;
  if (!doc?.head) return;

  let style = doc.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = doc.createElement("style");
    style.id = STYLE_ID;
    doc.head.appendChild(style);
  }

  const px = ceremonyRootFontPx(scale);
  style.textContent = `
    html { font-size: ${px}px !important; }
    body { line-height: ${CEREMONY_LINE_HEIGHT} !important; }
  `;
}
