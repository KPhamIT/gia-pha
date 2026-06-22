import axiosClient from "@/lib/axiosClient";
import type { AuthUser, UserRole } from "@/components/types/family-tree-types";
import { API_ROUTES } from "@/lib/constants/api-routes";

export type CreateUserInput = {
  username: string;
  password: string;
  email?: string;
  role: UserRole;
  organizationId?: number | null;
};

export type UpdateUserInput = {
  role?: UserRole;
  organizationId?: number | null;
  email?: string | null;
  password?: string;
};

export const users = {
  list: () => axiosClient.get<AuthUser[]>(API_ROUTES.USERS).then((r) => r.data),
  create: (data: CreateUserInput) =>
    axiosClient.post<AuthUser>(API_ROUTES.USERS, data).then((r) => r.data),
  update: (id: number, data: UpdateUserInput) =>
    axiosClient.patch<AuthUser>(API_ROUTES.USER(id), data).then((r) => r.data),
  remove: (id: number) =>
    axiosClient.delete(API_ROUTES.USER(id)).then((r) => r.data),
};
