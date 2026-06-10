import axiosClient from '@/lib/axiosClient';
import type { AuthResponse } from '@/components/types/family-tree-types';
import { API_ROUTES } from '@/lib/constants/api-routes';

type MeResponse = {
  user?: AuthResponse['user'];
  person?: AuthResponse['person'];
};

export const auth = {
  me: () => axiosClient.get<MeResponse>(API_ROUTES.AUTH_ME).then((r) => r.data),
};
