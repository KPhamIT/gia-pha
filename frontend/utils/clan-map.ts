import { UI } from "@/lib/constants/ui-strings";

/** Cho phép URL embed Google Maps an toàn dùng trong iframe. */
export function isAllowedGoogleMapsEmbedUrl(url: string): boolean {
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    return (
      host === "www.google.com" ||
      host === "maps.google.com" ||
      host === "www.google.com.vn" ||
      host.endsWith(".google.com") ||
      host.endsWith(".google.com.vn")
    );
  } catch {
    return false;
  }
}

/** Embed URL đã lưu, hoặc tạo từ địa chỉ nếu chưa có. */
export function resolveClanMapEmbedSrc(opts: {
  embedUrl?: string | null;
  address?: string | null;
}): string | null {
  const embed = opts.embedUrl?.trim();
  if (embed && isAllowedGoogleMapsEmbedUrl(embed)) return embed;

  const address = opts.address?.trim();
  if (!address) return null;
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=15&output=embed`;
}

export function clanMapsSearchUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function resolveClanLocationLabel(
  clanAddress?: string | null,
  fallback = UI.LANDING_FOOTER_CONTACT_ADDRESS,
): string {
  const address = clanAddress?.trim();
  return address || fallback;
}
