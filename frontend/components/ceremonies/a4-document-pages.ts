import { CONTENT_HEIGHT_PX } from "./a4-paper-layout";

/** Một trang: đoạn [start, end) theo chiều dọc của tài liệu (px). */
export type DocumentPage = { start: number; end: number };

const STYLE_ID = "ceremony-a4-sheet";

/**
 * Trên màn hình, bỏ lề/khung của tài liệu bài cúng để body rộng đúng vùng chữ
 * của tờ A4 (lề do tờ giấy bên ngoài lo). Không đụng tới kiểu khi in.
 */
export function applyA4SheetScreenStyle(iframe: HTMLIFrameElement | null): void {
  const doc = iframe?.contentDocument;
  if (!doc?.head || doc.getElementById(STYLE_ID)) return;
  const style = doc.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @media screen {
      html, body { background: transparent !important; overflow: hidden !important; }
      body { margin: 0 !important; padding: 0 !important; max-width: none !important; }
    }
  `;
  doc.head.appendChild(style);
}

type LineBox = { top: number; bottom: number };

/** Các dòng chữ (theo hộp dòng) của tài liệu, từ trên xuống. */
function collectLines(doc: Document): LineBox[] {
  const rects: LineBox[] = [];
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  const range = doc.createRange();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    range.selectNodeContents(node);
    for (const rect of range.getClientRects()) {
      if (rect.height > 0) rects.push({ top: rect.top, bottom: rect.bottom });
    }
  }
  rects.sort((a, b) => a.top - b.top);
  const lines: LineBox[] = [];
  for (const rect of rects) {
    const last = lines[lines.length - 1];
    if (last && rect.top < last.bottom - 1) {
      last.bottom = Math.max(last.bottom, rect.bottom);
    } else {
      lines.push({ ...rect });
    }
  }
  return lines;
}

/**
 * Chia tài liệu thành các trang A4 như khi in: chỉ ngắt giữa các dòng,
 * trang cuối ít nhất 2 dòng (`widows: 2`).
 */
export function paginateDocument(doc: Document): {
  height: number;
  pages: DocumentPage[];
} {
  const height = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);
  const lines = collectLines(doc);
  const pages: DocumentPage[] = [];
  /** Chỉ số dòng đầu của mỗi trang. */
  const firstLines: number[] = [];
  let start = 0;
  let index = 0;
  while (index < lines.length) {
    const limit = start + CONTENT_HEIGHT_PX;
    const first = index;
    while (index < lines.length && lines[index].bottom <= limit + 0.01) index += 1;
    if (index === first) index += 1; // dòng cao hơn cả trang
    const end = index < lines.length ? Math.min(lines[index].top, limit) : height;
    pages.push({ start, end: Math.max(end, lines[index - 1].bottom) });
    firstLines.push(first);
    start = pages[pages.length - 1].end;
  }
  if (pages.length === 0) return { height, pages: [{ start: 0, end: height }] };

  const last = pages.length - 1;
  if (last > 0 && lines.length - firstLines[last] === 1) {
    const prevCount = firstLines[last] - firstLines[last - 1];
    if (prevCount > 2) {
      const moved = lines[firstLines[last] - 1];
      pages[last - 1].end = moved.top;
      pages[last].start = moved.top;
    }
  }
  return { height, pages };
}
