/** Geocode địa chỉ VN qua Open-Meteo (không cần API key). */

export type GeocodeResult = {
  lat: number;
  lng: number;
  label: string;
};

type GeocodeApiItem = {
  latitude?: number;
  longitude?: number;
  name?: string;
  admin1?: string;
  country?: string;
};

type GeocodeApiResponse = {
  results?: GeocodeApiItem[];
};

export async function geocodeClanAddress(
  address: string,
): Promise<GeocodeResult | null> {
  const query = address.trim();
  if (!query) return null;

  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", query);
  url.searchParams.set("count", "5");
  url.searchParams.set("language", "vi");
  url.searchParams.set("format", "json");

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as GeocodeApiResponse;
    const results = data.results ?? [];
    // Ưu tiên kết quả ở Việt Nam nếu có.
    const pick =
      results.find((r) => (r.country ?? "").toLowerCase() === "vietnam") ??
      results.find((r) => (r.country ?? "").toLowerCase() === "viet nam") ??
      results[0];
    if (
      !pick ||
      typeof pick.latitude !== "number" ||
      typeof pick.longitude !== "number"
    ) {
      return null;
    }
    const parts = [pick.name, pick.admin1, pick.country].filter(Boolean);
    return {
      lat: pick.latitude,
      lng: pick.longitude,
      label: parts.join(", "),
    };
  } catch {
    return null;
  }
}
