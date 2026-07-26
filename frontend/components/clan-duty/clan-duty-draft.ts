import type { ClanDutyEntry } from "@/lib/api/modules/clan-duty";

export const CLAN_DUTY_ROLE_SEP = " · ";
export const CLAN_DUTY_YEAR_MIN = 1900;
export const CLAN_DUTY_YEAR_MAX = 2200;

export type ClanDutyDraftEntry = {
  key: string;
  personId: number;
  fullName: string;
  generation: number | null;
  branch: number | null;
  roles: string[];
  note: string;
  ceremonyLinks: { templateId: number; name: string }[];
};

export function clanDutyEntryKey(personId: number) {
  return `p-${personId}`;
}

export function parseClanDutyRoles(role: string | null | undefined): string[] {
  if (!role?.trim()) return [];
  return role
    .split(CLAN_DUTY_ROLE_SEP)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function joinClanDutyRoles(roles: string[]): string {
  return roles.map((r) => r.trim()).filter(Boolean).join(CLAN_DUTY_ROLE_SEP);
}

export function sameCeremonyLinkIds(
  a: { templateId: number }[],
  b: { templateId: number }[],
): boolean {
  if (a.length !== b.length) return false;
  return a.every((item, i) => item.templateId === b[i]?.templateId);
}

export function toClanDutyDraft(entries: ClanDutyEntry[]): ClanDutyDraftEntry[] {
  return entries.map((e) => ({
    key: clanDutyEntryKey(e.personId),
    personId: e.personId,
    fullName: e.fullName,
    generation: e.generation,
    branch: e.branch,
    roles: parseClanDutyRoles(e.role),
    note: e.note ?? "",
    ceremonyLinks: (e.ceremonyLinks ?? []).map((link) => ({
      templateId: link.templateId,
      name: link.name,
    })),
  }));
}

export function isValidClanDutyYear(value: number): boolean {
  return (
    Number.isInteger(value) &&
    value >= CLAN_DUTY_YEAR_MIN &&
    value <= CLAN_DUTY_YEAR_MAX
  );
}
