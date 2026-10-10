const CEREMONY_DOCUMENT_STYLES = `
  html, body {
    overflow: hidden;
    height: auto;
  }
  body {
    font-family: "Noto Serif", "Times New Roman", Georgia, serif;
    max-width: 720px;
    margin: 2rem auto;
    padding: 1.5rem;
    line-height: 1.8;
    color: #1a1a1a;
  }
  .ceremony-content {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  @media print {
    body { margin: 0; padding: 1rem; }
  }
`;

/** Tiêu đề trang trọng ở đầu bài cúng (dùng cả khi xem và khi in). */
const CEREMONY_TITLE_STYLES = `
  .ceremony-heading {
    margin: 0 0 1.75rem;
    text-align: center;
    white-space: normal;
  }
  .ceremony-title {
    margin: 0;
    font-size: 1.4rem;
    font-weight: 700;
    line-height: 1.45;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #6b1d14;
  }
  .ceremony-ornament {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-top: 0.6rem;
    color: #b8893b;
    font-size: 0.85rem;
    line-height: 1;
  }
  .ceremony-ornament::before,
  .ceremony-ornament::after {
    content: "";
    width: 5.5rem;
    height: 1px;
    background: linear-gradient(90deg, transparent, #b8893b);
  }
  .ceremony-ornament::after {
    background: linear-gradient(90deg, #b8893b, transparent);
  }
`;

type NormalizeOptions = {
  /** Tiêu đề in đậm, viết hoa, căn giữa phía trên bài cúng. */
  title?: string | null;
};

/** `printTitle` nếu có, không thì tên mẫu bỏ phần chú thích trong ngoặc. */
export function resolveCeremonyPrintTitle(template: {
  name?: string | null;
  printTitle?: string | null;
}): string | null {
  const printTitle = template.printTitle?.trim();
  if (printTitle) return printTitle;
  const name = template.name?.replace(/\s*\([^)]*\)?\s*$/, '').trim();
  return name || null;
}

export function normalizeCeremonyHtml(
  content: string,
  options: NormalizeOptions = {},
): string {
  const trimmed = content.trim();
  const title = options.title?.trim() || null;
  if (!trimmed) return wrapPlainText('', title);

  if (isFullHtmlDocument(trimmed)) {
    return insertTitleIntoDocument(ensurePreWrapInDocument(trimmed), title);
  }

  if (looksLikeHtmlFragment(trimmed)) {
    return wrapHtmlFragment(trimmed, title);
  }

  return wrapPlainText(trimmed, title);
}

function titleBlock(title: string | null): string {
  if (!title) return '';
  return `<header class="ceremony-heading"><h1 class="ceremony-title">${escapeHtml(title)}</h1><div class="ceremony-ornament" aria-hidden="true">❖</div></header>`;
}

function insertTitleIntoDocument(html: string, title: string | null): string {
  if (!title) return html;
  const style = `<style>${CEREMONY_TITLE_STYLES}</style>`;
  const withStyle = /<\/head>/i.test(html)
    ? html.replace(/<\/head>/i, `${style}</head>`)
    : html;
  return /<body[^>]*>/i.test(withStyle)
    ? withStyle.replace(/<body[^>]*>/i, (tag) => `${tag}${titleBlock(title)}`)
    : withStyle;
}

function isFullHtmlDocument(content: string): boolean {
  return /^\s*<!DOCTYPE/i.test(content) || /^\s*<html[\s>]/i.test(content);
}

function looksLikeHtmlFragment(content: string): boolean {
  return /^<[a-z][\s\S]*>/i.test(content);
}

function wrapPlainText(text: string, title: string | null): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Bài cúng</title>
  <style>${CEREMONY_DOCUMENT_STYLES}${CEREMONY_TITLE_STYLES}</style>
</head>
<body>
  ${titleBlock(title)}
  <div class="ceremony-content">${escapeHtml(text)}</div>
</body>
</html>`;
}

function wrapHtmlFragment(fragment: string, title: string | null): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Bài cúng</title>
  <style>${CEREMONY_DOCUMENT_STYLES}${CEREMONY_TITLE_STYLES}</style>
</head>
<body>
  ${titleBlock(title)}
  <div class="ceremony-content">${fragment}</div>
</body>
</html>`;
}

/** Plain-text templates saved before pre-wrap: add class to existing .content if present. */
function ensurePreWrapInDocument(html: string): string {
  if (/white-space:\s*pre-wrap/i.test(html)) return html;
  if (/class="content"/i.test(html)) {
    return html.replace(
      /(\.content\s*\{[^}]*)(})/i,
      (_, head: string, tail: string) =>
        head.includes('white-space')
          ? `${head}${tail}`
          : `${head}\n    white-space: pre-wrap;\n    word-wrap: break-word;${tail}`,
    );
  }
  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
