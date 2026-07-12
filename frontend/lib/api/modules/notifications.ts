import axiosClient from "@/lib/axiosClient";
import { API_ROUTES } from "@/lib/constants/api-routes";

export type NotificationSettings = {
  notificationDeathAnniversaryEnabled: boolean;
  notificationEventEnabled: boolean;
  notificationPostEnabled: boolean;
  onesignalSubscriptionId: string | null;
  pushSubscriptionCount: number;
  pushSubscriptionIds: string[];
};

export type NotificationLogItem = {
  id: number;
  title: string;
  message: string;
  status: string;
  sentAt: string | null;
  createdAt: string;
  organizationId: number;
  person: { id: number; fullName: string } | null;
};

export type UpcomingCeremonyItem = {
  personId: number;
  fullName: string;
  deathLunarDay: number;
  deathLunarMonth: number;
  lunarDateLabel: string;
  daysUntil: number;
  message: string;
  branch?: number | null;
  generation?: number | null;
};

export type NotificationStats = {
  totalMembers: number;
  subscribed: number;
  rate: number;
};

export type UpdateNotificationSettingsInput = Partial<
  Omit<NotificationSettings, "pushSubscriptionCount" | "pushSubscriptionIds">
> & {
  removeOnesignalSubscriptionId?: string;
};

export const notifications = {
  getSettings: () =>
    axiosClient
      .get<NotificationSettings>(API_ROUTES.NOTIFICATIONS_SETTINGS)
      .then((r) => r.data),

  updateSettings: (input: UpdateNotificationSettingsInput) =>
    axiosClient
      .patch<NotificationSettings>(API_ROUTES.NOTIFICATIONS_SETTINGS, input)
      .then((r) => r.data),

  list: () =>
    axiosClient
      .get<NotificationLogItem[]>(API_ROUTES.NOTIFICATIONS)
      .then((r) => r.data),

  upcoming: (params?: { maxDays?: number; limit?: number }) =>
    axiosClient
      .get<UpcomingCeremonyItem[]>(API_ROUTES.NOTIFICATIONS_UPCOMING, {
        params,
      })
      .then((r) => r.data),

  stats: () =>
    axiosClient
      .get<NotificationStats>(API_ROUTES.NOTIFICATIONS_STATS)
      .then((r) => r.data),
};
