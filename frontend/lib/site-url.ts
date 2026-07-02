import { buildAbsoluteUrl, getSiteUrl, SITE } from "@/config/site";

export { getSiteUrl, buildAbsoluteUrl, SITE };

/** Ví dụ định dạng liên kết tham gia dòng họ trên landing. */
export function getJoinLinkInputPlaceholder(
  sampleToken = "ma-lien-ket-tu-ban-quan-tri",
): string {
  return buildJoinLinkUrl(sampleToken);
}

export function buildJoinLinkUrl(token: string): string {
  return `${getSiteUrl()}/join/${encodeURIComponent(token)}`;
}
