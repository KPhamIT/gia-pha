import axiosClient from "@/lib/axiosClient";
import type { Organization } from "@/components/types/family-tree-types";
import { API_ROUTES } from "@/lib/constants/api-routes";

export type OrganizationAccessLink = {
  id: number;
  name: string;
  accessToken: string;
  publicAccessUrl: string;
};

export type OrganizationWithAccess = Organization & {
  accessToken?: string;
  publicAccessUrl?: string;
};

export const organizations = {
  list: () =>
    axiosClient
      .get<OrganizationWithAccess[]>(API_ROUTES.ORGANIZATIONS)
      .then((r) => r.data),
  create: (name: string) =>
    axiosClient
      .post<OrganizationWithAccess>(API_ROUTES.ORGANIZATIONS, { name })
      .then((r) => r.data),
  update: (id: number, name: string) =>
    axiosClient
      .patch<OrganizationWithAccess>(API_ROUTES.ORGANIZATION(id), { name })
      .then((r) => r.data),
  remove: (id: number) =>
    axiosClient.delete(API_ROUTES.ORGANIZATION(id)).then((r) => r.data),
  resolvePublic: (token: string) =>
    axiosClient
      .get<OrganizationAccessLink>(API_ROUTES.ORGANIZATION_PUBLIC(token))
      .then((r) => r.data),
  getAccessLink: (organizationId?: number) =>
    axiosClient
      .get<OrganizationAccessLink>(API_ROUTES.ORGANIZATION_ACCESS_LINK, {
        params: organizationId != null ? { organizationId } : undefined,
      })
      .then((r) => r.data),
};
