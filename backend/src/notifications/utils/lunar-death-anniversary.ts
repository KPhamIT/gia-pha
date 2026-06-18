import { Lunar } from 'lunar-javascript';

/** Days until the next lunar death anniversary (0 = today, 1–3 = upcoming). */
export function daysUntilDeathAnniversary(
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
    anniversaryKey = solarYmdToNumber(anniversarySolar);
  }

  const diff = anniversaryKey - todayKey;
  if (diff < 0 || diff > 3) return null;
  return diff;
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

function solarYmdToNumber(ymd: string): number {
  const [y, m, d] = ymd.split('-').map(Number);
  return y * 10000 + m * 100 + d;
}
