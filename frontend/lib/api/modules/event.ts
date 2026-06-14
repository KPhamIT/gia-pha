import axiosClient from '@/lib/axiosClient';
import { API_ROUTES } from '@/lib/constants/api-routes';
import type {
  CreateEventInput,
  FamilyEvent,
  FamilyEventDetail,
  UpdateEventInput,
} from '@/components/types/event-types';

export const event = {
  list: () => axiosClient.get<FamilyEvent[]>(API_ROUTES.EVENT_LIST).then((r) => r.data),
  get: (id: number) => axiosClient.get<FamilyEventDetail>(API_ROUTES.EVENT(id)).then((r) => r.data),
  create: (data: CreateEventInput) =>
    axiosClient.post<FamilyEvent>(API_ROUTES.EVENT_LIST, data).then((r) => r.data),
  update: (id: number, data: UpdateEventInput) =>
    axiosClient.patch<FamilyEvent>(API_ROUTES.EVENT(id), data).then((r) => r.data),
  remove: (id: number) => axiosClient.delete(API_ROUTES.EVENT(id)).then((r) => r.data),
  setContribution: (id: number, personId: number, paid: boolean) =>
    axiosClient
      .put<FamilyEventDetail>(API_ROUTES.EVENT_CONTRIBUTION(id), { personId, paid })
      .then((r) => r.data),
};
