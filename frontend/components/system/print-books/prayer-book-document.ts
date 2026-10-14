import type { PrintBookPage } from "@/lib/api/modules/ceremonies";

const BOOK_STYLES = `
  html, body { margin: 0; padding: 0; }
  body {
    font-family: "Noto Serif", "Times New Roman", Georgia, serif;
    font-size: 13pt;
    line-height: 1.75;
    color: #1a1a1a;
  }
  .cn-prayer, .cn-toc { break-before: page; page-break-before: always; }
  .cn-toc { break-before: auto; page-break-before: auto; }
  .ceremony-content { white-space: pre-wrap; word-wrap: break-word; }
  .cn-toc-title {
    margin: 0; text-align: center; font-size: 1.5rem; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase; color: #6b1d14;
  }
  .cn-toc-ornament { text-align: center; color: #b8893b; margin: 0.4rem 0 1.6rem; }
  .cn-toc ol { margin: 0; padding: 0; list-style: none; counter-reset: toc; }
  .cn-toc li {
    counter-increment: toc; display: flex; gap: 0.8rem; align-items: baseline;
    padding: 0.32rem 0; border-bottom: 1px dotted #c9b48a; break-inside: avoid;
  }
  .cn-toc li::before {
    content: counter(toc) "."; min-width: 2.2rem; text-align: right;
    color: #944a00; font-weight: 700;
  }
`;

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/**
 * Ghép các bài khấn (mỗi bài là một tài liệu HTML riêng) thành một sách:
 * trang mục lục rồi mỗi bài sang trang mới. Giữ <style> riêng của từng bài
 * (tiêu đề ❖, khoảng cách) nhưng bỏ phần trùng lặp.
 */
export function buildPrayerBookDocument(pages: PrintBookPage[], tocTitle: string): string {
  const parser = new DOMParser();
  const styles = new Set<string>();
  const sections = pages.map((page) => {
    const doc = parser.parseFromString(page.html, "text/html");
    doc.head.querySelectorAll("style").forEach((s) => styles.add(s.textContent ?? ""));
    doc.body.querySelectorAll("script").forEach((s) => s.remove());
    return `<section class="cn-prayer">${doc.body.innerHTML}</section>`;
  });

  const toc = `<section class="cn-toc"><h1 class="cn-toc-title">${escapeHtml(tocTitle)}</h1><div class="cn-toc-ornament" aria-hidden="true">❖</div><ol>${pages
    .map((p) => `<li>${escapeHtml(p.title)}</li>`)
    .join("")}</ol></section>`;

  return `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;700&display=block&subset=vietnamese" />
${[...styles].map((css) => `<style>${css}</style>`).join("\n")}
<style>${BOOK_STYLES}</style>
</head><body>${toc}${sections.join("")}</body></html>`;
}
