import type { OrgBookContext } from "@/lib/settings/default-user-settings";

export const COVER_SUBTITLE_PREFIX = "Dòng Họ";

/** Bỏ "Dòng họ" / "Họ" ở đầu tên (vd. tên tổ chức "Họ Nguyễn") để không lặp chữ "họ". */
function stripClanPrefix(clanName: string): string {
  return clanName.trim().replace(/^(dòng\s+)?họ\s+/iu, "").trim();
}

/** Hiển thị đầy đủ: "Dòng Họ" + tên. */
export function formatCoverSubtitle(clanName: string): string {
  const name = stripClanPrefix(clanName);
  return name ? `${COVER_SUBTITLE_PREFIX} ${name}` : COVER_SUBTITLE_PREFIX;
}

/** Tách tên dòng họ khỏi giá trị đã lưu (hỗ trợ bản cũ lưu cả cụm). */
export function parseCoverSubtitleClanName(
  stored: string,
  orgName?: string | null,
): string {
  const trimmed = stored.trim();
  if (!trimmed) return (orgName ?? "").trim();
  // Bản cũ có thể lưu "Dòng họ …" (chữ h thường) — so khớp không phân biệt hoa thường.
  const match = /^dòng\s+họ(?:\s+(.*))?$/iu.exec(trimmed);
  if (match) return (match[1] ?? "").trim() || (orgName ?? "").trim();
  return trimmed;
}

export function resolveCoverSubtitleClanName(
  stored: string,
  org?: OrgBookContext | null,
): string {
  const parsed = parseCoverSubtitleClanName(stored, org?.name);
  if (parsed) return parsed;
  return (org?.name ?? "").trim();
}
