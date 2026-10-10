import { VAN_KHAN_PLACEHOLDER_LABELS } from "@/lib/constants/ui-strings/van-khan";
import type { PublicCeremonySummary } from "./server-api";

export type CeremonyTextPart =
  | { kind: "text"; value: string }
  | { kind: "blank"; label: string };

const VARIABLE = /\{\{\s*([\w.]+)\s*\}\}/g;

/** Tách bài khấn thành đoạn chữ + ô trống (biến {{...}}) — không đổi nội dung gốc. */
export function splitCeremonyText(content: string): CeremonyTextPart[] {
  const parts: CeremonyTextPart[] = [];
  let last = 0;
  for (const match of content.matchAll(VARIABLE)) {
    const index = match.index ?? 0;
    if (index > last) parts.push({ kind: "text", value: content.slice(last, index) });
    const key = match[1];
    parts.push({ kind: "blank", label: VAN_KHAN_PLACEHOLDER_LABELS[key] ?? key });
    last = index + match[0].length;
  }
  if (last < content.length) parts.push({ kind: "text", value: content.slice(last) });
  return parts;
}

/** Tiêu đề trang: seoTitle (bỏ hậu tố chung) hoặc tên mẫu. */
export function ceremonyTitle(item: PublicCeremonySummary): string {
  const base = item.seoTitle?.split("|")[0]?.trim() || item.name;
  if (/văn khấn|bài cúng/i.test(base)) return base;
  if (/^cúng\s+/i.test(base)) return base.replace(/^cúng\s+/i, "Bài cúng ");
  return `Văn khấn ${base}`;
}

export function ceremonyDescription(item: PublicCeremonySummary): string {
  const raw =
    item.seoDescription?.trim() ||
    item.meaning?.trim() ||
    `${ceremonyTitle(item)} theo nghi lễ cổ truyền — toàn văn bài khấn, kèm hướng dẫn điền thông tin gia đình.`;
  const flat = raw.replace(/\s+/g, " ");
  return flat.length > 300 ? `${flat.slice(0, 297)}…` : flat;
}

/** Chuẩn hóa xuống dòng trong đoạn ý nghĩa / sắm lễ (văn bản gốc ngắt dòng cứng). */
export function toParagraphs(text: string | null): string[] {
  if (!text?.trim()) return [];
  return text
    .replace(/\n(?=\s*[+\-•])/g, "\n\n")
    .split(/\n\s*\n/)
    .map((block) => block.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}
