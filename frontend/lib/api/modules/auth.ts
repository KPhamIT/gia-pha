import axiosClient from "@/lib/axiosClient";
import type {
  AuthResponse,
  AuthUser,
  Person,
} from "@/components/types/family-tree-types";
import { API_ROUTES } from "@/lib/constants/api-routes";
import { getZaloLoginUrl } from "@/lib/auth/session";

export type EmailVerificationInfo = {
  username: string | null;
  email: string;
  organizationName: string | null;
};

type MeResponse = {
  user?: AuthUser | null;
  person?: Person | null;
  features?: import("@/lib/auth/standard-features").StandardFeatures;
  orgAccessToken?: string | null;
};

export const auth = {
  me: () => axiosClient.get<MeResponse>(API_ROUTES.AUTH_ME).then((r) => r.data),
  login: (username: string, password: string) =>
    axiosClient
      .post<AuthResponse>(API_ROUTES.AUTH_LOGIN, { username, password })
      .then((r) => r.data),
  loginWithFacebook: (accessToken: string) =>
    axiosClient
      .post<AuthResponse>(API_ROUTES.AUTH_FACEBOOK, { accessToken })
      .then((r) => r.data),
  linkPerson: (personId: number | null) =>
    axiosClient
      .patch<MeResponse>(API_ROUTES.AUTH_LINK_PERSON, { personId })
      .then((r) => r.data),
  getEmailVerification: (token: string) =>
    axiosClient
      .get<EmailVerificationInfo>(API_ROUTES.AUTH_VERIFY_EMAIL(token))
      .then((r) => r.data),
  verifyEmail: (token: string) =>
    axiosClient
      .post<AuthResponse>(API_ROUTES.AUTH_VERIFY_EMAIL(token))
      .then((r) => r.data),
  resendVerification: (login: string) =>
    axiosClient
      .post<{ ok: true }>(API_ROUTES.AUTH_RESEND_VERIFICATION, { login })
      .then((r) => r.data),
  getZaloLoginUrl,
};
