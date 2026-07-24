import axiosClient from "@/lib/axiosClient";
import { API_ROUTES } from "@/lib/constants/api-routes";

export type ClanDutyCeremonyLink = {
  templateId: number;
  name: string;
};

export type ClanDutyEntry = {
  id: number;
  personId: number;
  fullName: string;
  generation: number | null;
  branch: number | null;
  role: string | null;
  note: string | null;
  sortOrder: number;
  ceremonyLinks: ClanDutyCeremonyLink[];
};

export type ClanDutyYear = {
  id: number;
  year: number;
  note: string | null;
  entries: ClanDutyEntry[];
};

export type ClanDutyYearSummary = {
  year: number;
  entryCount: number;
};

export type ClanDutyEntryInput = {
  personId: number;
  role?: string;
  note?: string;
  sortOrder?: number;
  ceremonyTemplateIds?: number[];
};

export const clanDuty = {
  listYears: () =>
    axiosClient
      .get<ClanDutyYearSummary[]>(API_ROUTES.CLAN_DUTY_YEARS)
      .then((r) => r.data),

  getYear: (year: number) =>
    axiosClient
      .get<ClanDutyYear>(API_ROUTES.CLAN_DUTY_YEAR(year))
      .then((r) => r.data),

  upsertYear: (
    year: number,
    body: { note?: string; entries: ClanDutyEntryInput[] },
  ) =>
    axiosClient
      .put<ClanDutyYear>(API_ROUTES.CLAN_DUTY_YEAR(year), body)
      .then((r) => r.data),

  removeYear: (year: number) =>
    axiosClient
      .delete<{ ok: true }>(API_ROUTES.CLAN_DUTY_YEAR(year))
      .then((r) => r.data),
};
