import { UI } from "@/lib/constants/ui-strings";
import type { ClanWeather } from "@/lib/api/modules/weather";

export function formatTempC(value: number): string {
  return `${Math.round(value)}°`;
}

export function formatHourLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "--";
  return `${String(d.getHours()).padStart(2, "0")}h`;
}

export function isSameCalendarDay(
  isoDate: string,
  against: Date = new Date(),
): boolean {
  const d = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) return false;
  return (
    d.getFullYear() === against.getFullYear() &&
    d.getMonth() === against.getMonth() &&
    d.getDate() === against.getDate()
  );
}

export function formatWeekdayShort(isoDate: string): string {
  if (isSameCalendarDay(isoDate)) return UI.EVENTS_WEATHER_TODAY;
  const d = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) return "--";
  return d.toLocaleDateString("vi-VN", { weekday: "short" });
}

export function formatDayLong(isoDate: string): string {
  if (isSameCalendarDay(isoDate)) return UI.EVENTS_WEATHER_TODAY;
  const d = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "numeric",
  });
}

/** Lọc giờ theo ngày `YYYY-MM-DD` (theo local parse của chuỗi Open-Meteo). */
export function filterHoursForDate(
  hours: ClanWeather["hourly"],
  isoDate: string,
): ClanWeather["hourly"] {
  return hours.filter((h) => {
    const t = h.time.slice(0, 10);
    return t === isoDate;
  });
}

export function localDateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
