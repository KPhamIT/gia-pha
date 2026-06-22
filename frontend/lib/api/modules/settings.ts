import axiosClient from "@/lib/axiosClient";
import { API_ROUTES } from "@/lib/constants/api-routes";

export type UserSettings = {
  theme?: string;
  horizontalGap?: number;
  verticalStep?: number;
  nodeWidth?: number;
  nodeHeight?: number;
  nodeBgColor?: string;
  nodeTextColor?: string;
  [key: string]: unknown;
};

export const settings = {
  getMine: () =>
    axiosClient
      .get<UserSettings | null>(API_ROUTES.SETTINGS)
      .then((r) => r.data),
  upsert: (data: UserSettings) =>
    axiosClient
      .put<UserSettings>(API_ROUTES.SETTINGS, data)
      .then((r) => r.data),
};
