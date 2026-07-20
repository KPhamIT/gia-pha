import axiosClient from "@/lib/axiosClient";
import { API_ROUTES } from "@/lib/constants/api-routes";

export type DayNote = {
  id: number;
  noteDate: string;
  body: string;
  updatedAt: string;
};

export const dayNotes = {
  list: (params?: { from?: string; to?: string }) =>
    axiosClient
      .get<DayNote[]>(API_ROUTES.DAY_NOTES, { params })
      .then((r) => r.data),

  upsert: (date: string, body: string) =>
    axiosClient
      .put<DayNote>(API_ROUTES.DAY_NOTE(date), { body })
      .then((r) => r.data),

  remove: (date: string) =>
    axiosClient.delete<{ ok: true }>(API_ROUTES.DAY_NOTE(date)).then((r) => r.data),
};
