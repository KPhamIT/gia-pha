import axiosClient from '@/lib/axiosClient';
import type { AuthResponse } from '@/components/types/family-tree-types';

type MeResponse = {
  user?: AuthResponse['user'];
  person?: AuthResponse['person'];
};

export const auth = {
  me: () => axiosClient.get<MeResponse>('/auth/me').then((r) => r.data),
  loginFacebook: (accessToken: string) =>
    axiosClient.post<AuthResponse>('/auth/facebook', { accessToken }).then((r) => r.data),
};
