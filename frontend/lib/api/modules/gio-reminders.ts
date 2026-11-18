import axiosClient from "@/lib/axiosClient";
import { API_ROUTES } from "@/lib/constants/api-routes";

export type CreateGioReminderInput = {
  deceasedName: string;
  lunarMonth: number;
  lunarDay: number;
  email: string;
};

export type GioReminderManageView = {
  deceasedName: string;
  lunarMonth: number;
  lunarDay: number;
  active: boolean;
};

export const gioReminders = {
  create: (input: CreateGioReminderInput) =>
    axiosClient
      .post<{ ok: true; nextDate: string; daysUntil: number }>(API_ROUTES.GIO_REMINDERS, input)
      .then((r) => r.data),
  get: (token: string) =>
    axiosClient.get<GioReminderManageView>(API_ROUTES.GIO_REMINDER_MANAGE(token)).then((r) => r.data),
  unsubscribe: (token: string) =>
    axiosClient.post<{ ok: true }>(API_ROUTES.GIO_REMINDER_UNSUBSCRIBE(token)).then((r) => r.data),
};
