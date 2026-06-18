import axiosClient from '@/lib/axiosClient';
import type { AuthResponse } from '@/components/types/family-tree-types';
import { API_ROUTES } from '@/lib/constants/api-routes';
import { getZaloLoginUrl } from '@/lib/auth/session';

type MeResponse = {
  user?: AuthResponse['user'];
  person?: AuthResponse['person'];
};

export const auth = {
  me: () => axiosClient.get<MeResponse>(API_ROUTES.AUTH_ME).then((r) => r.data),
  loginWithFacebook: (accessToken: string) =>
    axiosClient
      .post<AuthResponse>(API_ROUTES.AUTH_FACEBOOK, { accessToken })
      .then((r) => r.data),
  getZaloLoginUrl,
};
