import { Lunar } from 'lunar-javascript';

/**
 * Days until the next lunar death anniversary (0 = today).
 * Unbounded horizon (next occurrence this or next lunar year).
 */
export function daysUntilNextDeathAnniversary(
  deathLunarMonth: number,
  deathLunarDay: number,
  referenceDate = new Date(),
): number | null {
  const todayLunar = Lunar.fromDate(referenceDate);
  const lunarYear = todayLunar.getYear();

  let anniversary = Lunar.fromYmd(lunarYear, deathLunarMonth, deathLunarDay);
  let anniversarySolar = anniversary.getSolar().toYmd();

  const todaySolar = todayLunar.getSolar().toYmd();
  const todayKey = solarYmdToNumber(todaySolar);
  let anniversaryKey = solarYmdToNumber(anniversarySolar);

  if (anniversaryKey < todayKey) {
    anniversary = Lunar.fromYmd(lunarYear + 1, deathLunarMonth, deathLunarDay);
    anniversarySolar = anniversary.getSolar().toYmd();
  }

  const diff = calendarDaysBetween(todaySolar, anniversarySolar);
  if (diff < 0) return null;
  return diff;
}

/** Days until anniversary when within 0–3 days (notifications window). */
export function daysUntilDeathAnniversary(
  deathLunarMonth: number,
  deathLunarDay: number,
  referenceDate = new Date(),
): number | null {
  const diff = daysUntilNextDeathAnniversary(
    deathLunarMonth,
    deathLunarDay,
    referenceDate,
  );
  if (diff == null || diff > 3) return null;
  return diff;
}

/** True when today's solar date is after this lunar year's death anniversary. */
export function isPastDeathAnniversaryThisCycle(
  deathLunarMonth: number,
  deathLunarDay: number,
  referenceDate = new Date(),
): boolean {
  const todayLunar = Lunar.fromDate(referenceDate);
  const lunarYear = todayLunar.getYear();
  const anniversary = Lunar.fromYmd(lunarYear, deathLunarMonth, deathLunarDay);
  const anniversaryKey = solarYmdToNumber(anniversary.getSolar().toYmd());
  const todayKey = solarYmdToNumber(todayLunar.getSolar().toYmd());
  return todayKey > anniversaryKey;
}

export function formatLunarDeathDate(month: number, day: number): string {
  const dayStr = String(day).padStart(2, '0');
  const monthStr = String(month).padStart(2, '0');
  return `${dayStr} tháng ${monthStr} âm lịch`;
}

export function getCurrentLunarDate(referenceDate = new Date()) {
  const lunar = Lunar.fromDate(referenceDate);
  return {
    year: lunar.getYear(),
    month: lunar.getMonth(),
    day: lunar.getDay(),
  };
}

/** YYYY-MM-DD → sortable int (ordering only, not day math). */
function solarYmdToNumber(ymd: string): number {
  const [y, m, d] = ymd.split('-').map(Number);
  return y * 10000 + m * 100 + d;
}

function calendarDaysBetween(fromYmd: string, toYmd: string): number {
  const from = parseSolarYmdUtc(fromYmd);
  const to = parseSolarYmdUtc(toYmd);
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

function parseSolarYmdUtc(ymd: string): Date {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}
