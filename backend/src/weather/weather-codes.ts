/** Map Open-Meteo WMO weathercode → nhãn tiếng Việt ngắn. */

const WMO_LABELS: Record<number, string> = {
  0: "Trời quang",
  1: "Chủ yếu quang mây",
  2: "Ít mây",
  3: "Nhiều mây",
  45: "Sương mù",
  48: "Sương muối",
  51: "Mưa phùn nhẹ",
  53: "Mưa phùn",
  55: "Mưa phùn dày",
  56: "Mưa phùn đông",
  57: "Mưa phùn đông dày",
  61: "Mưa nhẹ",
  63: "Mưa",
  65: "Mưa to",
  66: "Mưa đông nhẹ",
  67: "Mưa đông",
  71: "Tuyết nhẹ",
  73: "Tuyết",
  75: "Tuyết dày",
  77: "Hạt tuyết",
  80: "Mưa rào nhẹ",
  81: "Mưa rào",
  82: "Mưa rào mạnh",
  85: "Mưa tuyết rào nhẹ",
  86: "Mưa tuyết rào",
  95: "Dông",
  96: "Dông kèm mưa đá nhẹ",
  99: "Dông kèm mưa đá",
};

export function weatherCodeLabel(code: number): string {
  return WMO_LABELS[code] ?? "Thời tiết";
}

/** Nhóm icon đơn giản cho FE. */
export type WeatherIconKind =
  | "clear"
  | "partly"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "storm";

export function weatherCodeIcon(code: number): WeatherIconKind {
  if (code === 0 || code === 1) return "clear";
  if (code === 2) return "partly";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 57) return "drizzle";
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if (code >= 95) return "storm";
  return "cloudy";
}
