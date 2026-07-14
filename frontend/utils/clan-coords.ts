/** Chuỗi form ↔ số tọa độ (null = để trống / xóa). */

export function formatCoordInput(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "";
  return String(value);
}

export function parseCoordInput(raw: string): number | null {
  const t = raw.trim().replace(",", ".");
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function coordsEqual(
  a: number | null | undefined,
  b: number | null | undefined,
): boolean {
  if (a == null && b == null) return true;
  if (a == null || b == null) return false;
  return Math.abs(a - b) < 1e-9;
}

/** Cả hai trống → null; một trong hai lỗi → null (caller báo lỗi). */
export function parseCoordPair(
  latRaw: string,
  lngRaw: string,
): { lat: number | null; lng: number | null } | null {
  const latEmpty = !latRaw.trim();
  const lngEmpty = !lngRaw.trim();
  if (latEmpty && lngEmpty) return { lat: null, lng: null };
  const lat = parseCoordInput(latRaw);
  const lng = parseCoordInput(lngRaw);
  if (
    lat == null ||
    lng == null ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    return null;
  }
  return { lat, lng };
}
