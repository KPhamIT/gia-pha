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

export function normalizeCeremonyHtml(content: string): string {
  const trimmed = content.trim();
  if (!trimmed) return wrapPlainText('');

  if (isFullHtmlDocument(trimmed)) {
    return ensurePreWrapInDocument(trimmed);
  }

  if (looksLikeHtmlFragment(trimmed)) {
    return wrapHtmlFragment(trimmed);
  }

  return wrapPlainText(trimmed);
}

function isFullHtmlDocument(content: string): boolean {
  return /^\s*<!DOCTYPE/i.test(content) || /^\s*<html[\s>]/i.test(content);
}

function looksLikeHtmlFragment(content: string): boolean {
  return /^<[a-z][\s\S]*>/i.test(content);
}

function wrapPlainText(text: string): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Bài cúng</title>
  <style>${CEREMONY_DOCUMENT_STYLES}</style>
</head>
<body>
  <div class="ceremony-content">${escapeHtml(text)}</div>
</body>
</html>`;
}

function wrapHtmlFragment(fragment: string): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Bài cúng</title>
  <style>${CEREMONY_DOCUMENT_STYLES}</style>
</head>
<body>
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
