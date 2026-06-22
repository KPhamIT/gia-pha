import { Lunar } from 'lunar-javascript';
import { formatLunarDeathDate } from '../notifications/utils/lunar-death-anniversary.js';

export type CeremonyVarGroups = {
  person: Record<string, string>;
  organization: Record<string, string>;
  ceremony: Record<string, string>;
  today: Record<string, string>;
  worshipper: Record<string, string>;
};

type PersonWithOrg = {
  fullName: string;
  birthDate: Date | null;
  deathDate: Date | null;
  birthPlace: string | null;
  currentLocation: string | null;
  deathLunarDay: number | null;
  deathLunarMonth: number | null;
  organization: { name: string };
  graveInfo?: {
    cemetery: string | null;
    address: string | null;
    notes: string | null;
  } | null;
};

type WorshipperPerson = {
  fullName: string;
  currentLocation: string | null;
  birthPlace: string | null;
} | null;

export function buildCeremonyVars(
  person: PersonWithOrg,
  worshipper: WorshipperPerson,
  referenceDate = new Date(),
): CeremonyVarGroups {
  const todayLunar = Lunar.fromDate(referenceDate);
  const lunarDay = person.deathLunarDay ?? 0;
  const lunarMonth = person.deathLunarMonth ?? 0;

  const graveAddress = [person.graveInfo?.cemetery, person.graveInfo?.address]
    .filter(Boolean)
    .join(' — ');

  const worshipperAddress =
    worshipper?.currentLocation?.trim() ||
    worshipper?.birthPlace?.trim() ||
    person.currentLocation?.trim() ||
    person.birthPlace?.trim() ||
    '—';

  return {
    person: {
      full_name: person.fullName,
      name: person.fullName,
      birth_date: formatYear(person.birthDate),
      birth_year: formatYear(person.birthDate),
      death_date: formatYear(person.deathDate),
      death_year: formatYear(person.deathDate),
      birth_place: person.birthPlace?.trim() || '—',
      current_location: person.currentLocation?.trim() || '—',
      grave_cemetery: person.graveInfo?.cemetery?.trim() || '—',
      grave_address: graveAddress || '—',
      grave_notes: person.graveInfo?.notes?.trim() || '—',
    },
    organization: {
      name: person.organization.name,
    },
    ceremony: {
      lunar_date: formatLunarDeathDate(lunarMonth, lunarDay),
      lunar_day: String(lunarDay),
      lunar_month: String(lunarMonth),
      lunar_year: String(todayLunar.getYear()),
    },
    today: {
      lunar_day: String(todayLunar.getDay()),
      lunar_month: String(todayLunar.getMonth()),
      lunar_year: String(todayLunar.getYear()),
      lunar_date: formatLunarDeathDate(
        todayLunar.getMonth(),
        todayLunar.getDay(),
      ),
    },
    worshipper: {
      full_name: worshipper?.fullName?.trim() || '—',
      name: worshipper?.fullName?.trim() || '—',
      address: worshipperAddress,
    },
  };
}

export function flattenCeremonyVars(
  groups: CeremonyVarGroups,
): Record<string, string> {
  const flat: Record<string, string> = {};
  for (const [group, fields] of Object.entries(groups)) {
    for (const [key, value] of Object.entries(fields)) {
      flat[`${group}.${key}`] = value;
    }
  }
  return flat;
}

/** Matches {{person.full_name}}, {person.full_name}, {person.full_name}}, {{person.full_name} */
const TEMPLATE_VAR_PATTERN =
  /\{\{?\s*((?:person|organization|ceremony|today|worshipper)\.[a-z_]+)\s*\}?\}?/gi;

export function renderCeremonyTemplate(
  template: string,
  groups: CeremonyVarGroups,
): string {
  const flat = flattenCeremonyVars(groups);
  return template.replace(TEMPLATE_VAR_PATTERN, (match, key: string) => {
    const normalized = key.trim();
    const value = flat[normalized];
    if (value != null) return value;
    return match;
  });
}

function formatYear(date: Date | null | undefined): string {
  if (!date) return '—';
  return String(date.getFullYear());
}
