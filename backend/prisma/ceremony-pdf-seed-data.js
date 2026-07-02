import fs from 'node:fs/promises';
import path from 'node:path';
import { PDFParse } from 'pdf-parse';
import { slugify } from './blog-posts-data.js';

const SOURCE_BOOK_TITLE = 'Các Bài Văn Khấn Cúng Cổ Truyền Trong Năm';
const MEANING_LABEL = 'Ý nghĩa:';
const PREPARATION_LABEL = 'Sắm lễ:';
const PRAYER_LABEL_PATTERN = /^Văn\s+(khấn|cúng)/i;
const PAGE_MARKER_PATTERN = /^--\s+\d+\s+of\s+\d+\s+--$/;

function normalizeLine(line) {
  return line.replace(/\s+/g, ' ').trim();
}

function compactLines(lines) {
  const compacted = [];
  for (const rawLine of lines) {
    const line = normalizeLine(rawLine);
    if (!line) {
      if (compacted.length > 0 && compacted[compacted.length - 1] !== '') {
        compacted.push('');
      }
      continue;
    }
    if (PAGE_MARKER_PATTERN.test(line)) continue;
    compacted.push(line);
  }
  while (compacted[0] === '') compacted.shift();
  while (compacted[compacted.length - 1] === '') compacted.pop();
  return compacted;
}

function findTitleLine(lines, meaningIndex) {
  for (let i = meaningIndex - 1; i >= Math.max(0, meaningIndex - 15); i -= 1) {
    const line = lines[i]?.trim();
    if (!line) continue;
    if (line === SOURCE_BOOK_TITLE) continue;
    if (PAGE_MARKER_PATTERN.test(line)) continue;
    if (
      /^(Văn khấn|Văn cúng|Tết|Tiết|Lễ|Bài văn khấn|Cúng)/i.test(line) &&
      line.length <= 80 &&
      !/rằng[:]?$/i.test(line)
    ) {
      return line;
    }
  }

  let start = 0;
  for (let i = meaningIndex - 1; i >= 0; i -= 1) {
    if (lines[i] === '') {
      start = i + 1;
      break;
    }
  }

  const block = lines
    .slice(start, meaningIndex)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line !== SOURCE_BOOK_TITLE && !PAGE_MARKER_PATTERN.test(line));

  if (!block.length) return null;

  const candidate = block.find(
    (line) =>
      line.length <= 120 &&
      !line.endsWith('.') &&
      !line.endsWith(',') &&
      !/^(Theo|Vào|Ngày|Tục|Mâm|Lễ|Nam mô|Tín chủ|Ngụ tại|Hôm nay)/i.test(line),
  );

  return candidate ?? block[0];
}

function splitSections(lines) {
  const markers = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i] !== MEANING_LABEL) continue;
    const title = findTitleLine(lines, i);
    if (!title) continue;
    markers.push({ meaningIndex: i, title });
  }

  if (!markers.length) return [];

  const sections = [];
  for (let i = 0; i < markers.length; i += 1) {
    const current = markers[i];
    const next = markers[i + 1];
    sections.push({
      title: current.title,
      lines: lines.slice(current.meaningIndex, next ? next.meaningIndex : lines.length),
    });
  }
  return sections;
}

function textFromRange(lines, from, to) {
  if (from < 0 || to <= from) return null;
  const joined = lines
    .slice(from, to)
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return joined || null;
}

function pickExcerpt(text) {
  if (!text) return '';
  if (text.length <= 260) return text;
  return `${text.slice(0, 257).trim()}...`;
}

function buildSeoDescription(template) {
  const basis =
    template.meaning || template.preparation || template.content || template.name;
  const cleaned = basis.replace(/\s+/g, ' ').trim();
  const prefix = `${template.name} - Bài văn khấn cúng truyền thống, ý nghĩa và cách sắm lễ. `;
  const merged = `${prefix}${cleaned}`;
  if (merged.length <= 320) return merged;
  return `${merged.slice(0, 317).trim()}...`;
}

function sanitizeKeywords(parts) {
  return [...new Set(parts.map((item) => item.trim()).filter(Boolean))].slice(0, 10);
}

function normalizeTitle(rawTitle) {
  const trimmed = rawTitle.replace(/[.]+$/, '').trim();
  const sentenceCut = trimmed.match(
    /^(Tết [^,]+?|Lễ [^,]+?|Tiết [^,]+?|Văn khấn [^,]+?)(?:\s+là\s+|\s+thường\s+được\s+)/i,
  );
  if (sentenceCut?.[1]) {
    return sentenceCut[1].trim();
  }
  return trimmed;
}

function parseSectionToTemplate(section) {
  const lines = section.lines;
  const meaningIndex = lines.findIndex((line) => line === MEANING_LABEL);
  if (meaningIndex < 0) return null;

  const preparationIndex = lines.findIndex(
    (line, idx) => idx > meaningIndex && line === PREPARATION_LABEL,
  );
  const prayerIndex = lines.findIndex(
    (line, idx) => idx > meaningIndex && PRAYER_LABEL_PATTERN.test(line),
  );

  const intro = textFromRange(lines, 0, meaningIndex);
  const meaning = textFromRange(
    lines,
    meaningIndex + 1,
    preparationIndex > 0 ? preparationIndex : prayerIndex > 0 ? prayerIndex : lines.length,
  );
  const preparation = textFromRange(
    lines,
    preparationIndex > 0 ? preparationIndex + 1 : -1,
    prayerIndex > 0 ? prayerIndex : lines.length,
  );
  const content = textFromRange(lines, prayerIndex >= 0 ? prayerIndex : meaningIndex + 1, lines.length);

  if (!section.title || !content) return null;
  const normalizedTitle = normalizeTitle(section.title);

  const seoSlug = `bai-cung-${slugify(normalizedTitle)}`;
  const seoKeywords = sanitizeKeywords([
    normalizedTitle,
    'bài cúng',
    'văn khấn',
    'nghi lễ truyền thống',
    'thờ cúng tổ tiên',
    'phong tục Việt Nam',
  ]);

  return {
    name: normalizedTitle,
    intro,
    meaning,
    preparation,
    content,
    sourceBookTitle: SOURCE_BOOK_TITLE,
    seoSlug,
    seoTitle: `${normalizedTitle} | Bài văn khấn cúng cổ truyền`,
    seoDescription: buildSeoDescription({
      name: normalizedTitle,
      meaning,
      preparation,
      content,
    }),
    seoExcerpt: pickExcerpt(meaning || preparation || content),
    seoKeywords,
  };
}

export async function loadCeremonyTemplatesFromPdf() {
  const pdfPath = path.resolve(process.cwd(), '../docs/sach-cung.pdf');
  const fileBuffer = await fs.readFile(pdfPath);
  const parser = new PDFParse({ data: fileBuffer });
  const parsed = await parser.getText();
  const lines = compactLines(parsed.text.split(/\r?\n/));
  const rawSections = splitSections(lines);
  const templates = rawSections.map(parseSectionToTemplate).filter(Boolean);
  await parser.destroy();
  return templates;
}
