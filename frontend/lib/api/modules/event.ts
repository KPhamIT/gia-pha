import axiosClient from "@/lib/axiosClient";
import { API_ROUTES } from "@/lib/constants/api-routes";
import type {
  CreateDonationInput,
  CreateEventInput,
  FamilyEvent,
  FamilyEventDetail,
  SaveContributionsInput,
  SaveDonationsInput,
  UpdateDonationInput,
  UpdateEventInput,
} from "@/components/types/event-types";

export const event = {
  list: () =>
    axiosClient.get<FamilyEvent[]>(API_ROUTES.EVENT_LIST).then((r) => r.data),
  listDemo: () =>
    axiosClient.get<FamilyEvent[]>(API_ROUTES.EVENT_DEMO).then((r) => r.data),
  get: (id: number) =>
    axiosClient
      .get<FamilyEventDetail>(API_ROUTES.EVENT(id))
      .then((r) => r.data),
  create: (data: CreateEventInput) =>
    axiosClient
      .post<FamilyEvent>(API_ROUTES.EVENT_LIST, data)
      .then((r) => r.data),
  update: (id: number, data: UpdateEventInput) =>
    axiosClient
      .patch<FamilyEvent>(API_ROUTES.EVENT(id), data)
      .then((r) => r.data),
  remove: (id: number) =>
    axiosClient.delete(API_ROUTES.EVENT(id)).then((r) => r.data),
  saveContributions: (id: number, data: SaveContributionsInput) =>
    axiosClient
      .put<FamilyEventDetail>(API_ROUTES.EVENT_CONTRIBUTION(id), data)
      .then((r) => r.data),
  saveDonations: (id: number, data: SaveDonationsInput) =>
    axiosClient
      .put<FamilyEventDetail>(API_ROUTES.EVENT_DONATION_LIST(id), data)
      .then((r) => r.data),
  addDonation: (id: number, data: CreateDonationInput) =>
    axiosClient
      .post<FamilyEventDetail>(API_ROUTES.EVENT_DONATION_LIST(id), data)
      .then((r) => r.data),
  updateDonation: (id: number, donationId: number, data: UpdateDonationInput) =>
    axiosClient
      .patch<FamilyEventDetail>(API_ROUTES.EVENT_DONATION(id, donationId), data)
      .then((r) => r.data),
  removeDonation: (id: number, donationId: number) =>
    axiosClient
      .delete<FamilyEventDetail>(API_ROUTES.EVENT_DONATION(id, donationId))
      .then((r) => r.data),
};
