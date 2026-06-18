import axiosClient from '@/lib/axiosClient';
import type { Organization } from '@/components/types/family-tree-types';
import { API_ROUTES } from '@/lib/constants/api-routes';

export const organizations = {
  list: () => axiosClient.get<Organization[]>(API_ROUTES.ORGANIZATIONS).then((r) => r.data),
  create: (name: string) =>
    axiosClient.post<Organization>(API_ROUTES.ORGANIZATIONS, { name }).then((r) => r.data),
  update: (id: number, name: string) =>
    axiosClient.patch<Organization>(API_ROUTES.ORGANIZATION(id), { name }).then((r) => r.data),
  remove: (id: number) => axiosClient.delete(API_ROUTES.ORGANIZATION(id)).then((r) => r.data),
};
