import { Lunar } from "lunar-javascript";
import { UI } from "@/lib/constants/ui-strings";
import { formatLunarMonthName } from "@/utils/landing-lunar";
import type { FamilyEvent } from "@/components/types/event-types";

const WEEKDAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"] as const;

const HEAVENLY_STEMS: Record<string, string> = {
  甲: "Giáp",
  乙: "Ất",
  丙: "Bính",
  丁: "Đinh",
  戊: "Mậu",
  己: "Kỷ",
  庚: "Canh",
  辛: "Tân",
  壬: "Nhâm",
  癸: "Quý",
};

const EARTHLY_BRANCHES: Record<string, string> = {
  子: "Tý",
  丑: "Sửu",
  寅: "Dần",
  卯: "Mão",
  辰: "Thìn",
  巳: "Tỵ",
  午: "Ngọ",
  未: "Mùi",
  申: "Thân",
  酉: "Dậu",
  戌: "Tuất",
  亥: "Hợi",
};

export type CalendarDayCell = {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
  lunarDayLabel: string;
  events: FamilyEvent[];
};

function toVietnameseGanZhi(ganZhi: string): string {
  if (ganZhi.length < 2) return ganZhi;
  const stem = HEAVENLY_STEMS[ganZhi[0]] ?? ganZhi[0];
  const branch = EARTHLY_BRANCHES[ganZhi[1]] ?? ganZhi[1];
  return `${stem} ${branch}`;
}

export function dateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function sameDay(a: Date, b: Date): boolean {
  return sameCalendarDay(a, b);
}

export function parseEventDate(iso?: string | null): Date | null {
  if (!iso) return null;
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (dateOnly) {
    const year = Number(dateOnly[1]);
    const month = Number(dateOnly[2]) - 1;
    const day = Number(dateOnly[3]);
    return new Date(year, month, day);
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return startOfDay(date);
}

export function sameCalendarDay(a: Date, b: Date): boolean {
  return dateKey(a) === dateKey(b);
}

export function formatSelectedDayLabel(date: Date): string {
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getEventsOnDate(
  events: FamilyEvent[],
  date: Date,
): FamilyEvent[] {
  const key = dateKey(date);
  return events.filter((event) => {
    const parsed = parseEventDate(event.eventDate);
    return parsed != null && dateKey(parsed) === key;
  });
}

export function getLunarDayLabel(date: Date): string {
  const lunar = Lunar.fromDate(date);
  const day = lunar.getDay();
  const month = Math.abs(lunar.getMonth());
  return day === 1 ? `1/${month}` : String(day);
}

export function formatLunarYearBadge(date: Date): string {
  return toVietnameseGanZhi(Lunar.fromDate(date).getYearInGanZhi());
}

/** Tháng âm lịch của một ngày cụ thể. */
export function formatLunarMonthLabelForDate(date: Date): string {
  const lunarMonth = Lunar.fromDate(date).getMonth();
  return UI.EVENTS_CALENDAR_LUNAR_MONTH(formatLunarMonthName(lunarMonth));
}

export function formatEventDateWithLunar(iso?: string | null): string | null {
  const date = parseEventDate(iso);
  if (!date) return null;
  const solar = date.toLocaleDateString("vi-VN");
  const lunar = Lunar.fromDate(date);
  const lunarPart = `${lunar.getDay()}/${Math.abs(lunar.getMonth())} Âm lịch`;
  return `${solar} (${lunarPart})`;
}

export function formatMonthYearLabel(year: number, month: number): string {
  const label = new Date(year, month, 1).toLocaleDateString("vi-VN", {
    month: "long",
    year: "numeric",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatShortMonthDay(date: Date): { month: string; day: string } {
  const month = date
    .toLocaleDateString("vi-VN", { month: "short" })
    .replace(".", "");
  const day = String(date.getDate()).padStart(2, "0");
  return { month, day };
}

export function groupEventsByDate(events: FamilyEvent[]): Map<string, FamilyEvent[]> {
  const map = new Map<string, FamilyEvent[]>();
  for (const event of events) {
    const date = parseEventDate(event.eventDate);
    if (!date) continue;
    const key = dateKey(date);
    const list = map.get(key) ?? [];
    list.push(event);
    map.set(key, list);
  }
  return map;
}

export function buildMonthCalendar(
  year: number,
  month: number,
  eventsByDate: Map<string, FamilyEvent[]>,
  today = new Date(),
): CalendarDayCell[] {
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const gridStart = new Date(year, month, 1 - startOffset);
  const cells: CalendarDayCell[] = [];

  for (let i = 0; i < 42; i += 1) {
    const date = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + i,
    );
    const key = dateKey(date);
    cells.push({
      date,
      inMonth: date.getMonth() === month,
      isToday: sameDay(date, today),
      lunarDayLabel: getLunarDayLabel(date),
      events: eventsByDate.get(key) ?? [],
    });
  }

  return cells;
}

export function getUpcomingEvents(
  events: FamilyEvent[],
  limit: number,
  from = new Date(),
): FamilyEvent[] {
  const start = startOfDay(from).getTime();
  return [...events]
    .filter((event) => {
      const date = parseEventDate(event.eventDate);
      return date && date.getTime() >= start;
    })
    .sort((a, b) => {
      const da = parseEventDate(a.eventDate)!.getTime();
      const db = parseEventDate(b.eventDate)!.getTime();
      return da - db;
    })
    .slice(0, limit);
}

export function getEventsInMonth(
  events: FamilyEvent[],
  year: number,
  month: number,
): FamilyEvent[] {
  return events.filter((event) => {
    const date = parseEventDate(event.eventDate);
    return date && date.getFullYear() === year && date.getMonth() === month;
  });
}

export { WEEKDAY_LABELS };
