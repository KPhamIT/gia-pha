const STYLE_ID = "ceremony-viewer-font-scale";
const BASE_HTML_FONT_PX = 18;

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

  const px = Math.round(BASE_HTML_FONT_PX * scale);
  style.textContent = `
    html { font-size: ${px}px !important; }
    body { line-height: 1.85 !important; }
  `;
}
