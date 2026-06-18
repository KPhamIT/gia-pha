import axiosClient from '@/lib/axiosClient';
import { API_ROUTES } from '@/lib/constants/api-routes';
import type { StandardFeatures, StandardFeaturesConfig } from '@/lib/auth/standard-features';

export const standardFeatures = {
  getDefaults: () =>
    axiosClient.get<StandardFeatures>(API_ROUTES.STANDARD_FEATURES_DEFAULTS).then((r) => r.data),
  updateDefaults: (features: Partial<StandardFeatures>) =>
    axiosClient
      .patch<StandardFeatures>(API_ROUTES.STANDARD_FEATURES_DEFAULTS, { features })
      .then((r) => r.data),
  getOrg: (organizationId: number) =>
    axiosClient
      .get<StandardFeaturesConfig>(API_ROUTES.ORGANIZATION_STANDARD_FEATURES(organizationId))
      .then((r) => r.data),
  updateOrg: (organizationId: number, features: Partial<StandardFeatures>) =>
    axiosClient
      .patch<StandardFeaturesConfig>(API_ROUTES.ORGANIZATION_STANDARD_FEATURES(organizationId), {
        features,
      })
      .then((r) => r.data),
};
