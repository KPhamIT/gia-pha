import axiosClient from "@/lib/axiosClient";
import { API_ROUTES } from "@/lib/constants/api-routes";

export type SubmitContactInput = {
  name?: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

export const contact = {
  submit: (input: SubmitContactInput) =>
    axiosClient
      .post<{ ok: true }>(API_ROUTES.CONTACT, input)
      .then((r) => r.data),
};
