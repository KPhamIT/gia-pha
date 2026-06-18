import { SetMetadata } from '@nestjs/common';
import type { StandardFeatureKey } from './standard-features.types.js';

export const REQUIRE_FEATURE_KEY = 'requireFeature';

export const RequireFeature = (feature: StandardFeatureKey) =>
  SetMetadata(REQUIRE_FEATURE_KEY, feature);
