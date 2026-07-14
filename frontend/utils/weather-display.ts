import { UI } from "@/lib/constants/ui-strings";

export function formatTempC(value: number): string {
  return `${Math.round(value)}°`;
}

export function formatHourLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "--";
  return `${String(d.getHours()).padStart(2, "0")}h`;
}

export function formatWeekdayShort(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) return "--";
  const today = new Date();
  if (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  ) {
    return UI.EVENTS_WEATHER_TODAY;
  }
  return d.toLocaleDateString("vi-VN", { weekday: "short" });
}
