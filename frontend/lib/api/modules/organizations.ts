import axiosClient from "@/lib/axiosClient";
import type {
  AuthResponse,
  Organization,
} from "@/components/types/family-tree-types";
import { API_ROUTES } from "@/lib/constants/api-routes";

export type OrganizationAccessLink = {
  id: number;
  name: string;
  createdAt: string;
  establishedYear?: string | null;
  clanAddress?: string | null;
  accessToken: string;
  publicAccessUrl: string;
};

export type OrganizationWithAccess = Organization & {
  accessToken?: string;
  publicAccessUrl?: string;
};

export type UpdateOrganizationInput = {
  name: string;
  establishedYear?: string;
  clanAddress?: string;
};

export type DemoOrganization = {
  id: number;
  name: string;
  establishedYear?: string | null;
  clanAddress?: string | null;
  accessToken: string;
  publicAccessUrl: string;
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
  register: (name: string) =>
    axiosClient
      .post<
        OrganizationWithAccess & {
          user: { id: number; role: string; organizationId: number };
        }
      >(API_ROUTES.ORGANIZATION_REGISTER, { name })
      .then((r) => r.data),
  registerWithAdmin: (input: {
    name: string;
    username: string;
    password: string;
    email?: string;
  }) =>
    axiosClient
      .post<AuthResponse>(API_ROUTES.ORGANIZATION_REGISTER_WITH_ADMIN, input)
      .then((r) => r.data),
  update: (id: number, body: UpdateOrganizationInput) =>
    axiosClient
      .patch<OrganizationWithAccess>(API_ROUTES.ORGANIZATION(id), body)
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
  getBookContext: () =>
    axiosClient
      .get<{
        name: string;
        createdAt: string;
        establishedYear?: string | null;
        clanAddress?: string | null;
      }>(API_ROUTES.ORGANIZATION_BOOK_CONTEXT)
      .then((r) => r.data),
  getDemo: () =>
    axiosClient
      .get<DemoOrganization | null>(API_ROUTES.ORGANIZATION_DEMO)
      .then((r) => r.data),
  setDemo: (organizationId: number | null) =>
    axiosClient
      .put<DemoOrganization | null>(API_ROUTES.ORGANIZATION_DEMO, {
        organizationId,
      })
      .then((r) => r.data),
};
