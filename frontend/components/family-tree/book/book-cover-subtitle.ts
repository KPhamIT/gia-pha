import type { OrgBookContext } from "@/lib/settings/default-user-settings";

export const COVER_SUBTITLE_PREFIX = "Dòng họ";

/** Hiển thị đầy đủ: "Dòng họ" + tên. */
export function formatCoverSubtitle(clanName: string): string {
  const name = clanName.trim();
  return name ? `${COVER_SUBTITLE_PREFIX} ${name}` : COVER_SUBTITLE_PREFIX;
}

/** Tách tên dòng họ khỏi giá trị đã lưu (hỗ trợ bản cũ lưu cả cụm). */
export function parseCoverSubtitleClanName(
  stored: string,
  orgName?: string | null,
): string {
  const trimmed = stored.trim();
  const withSpace = `${COVER_SUBTITLE_PREFIX} `;
  if (!trimmed) return (orgName ?? "").trim();
  if (trimmed.startsWith(withSpace)) {
    return trimmed.slice(withSpace.length).trim();
  }
  if (trimmed === COVER_SUBTITLE_PREFIX) return (orgName ?? "").trim();
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
