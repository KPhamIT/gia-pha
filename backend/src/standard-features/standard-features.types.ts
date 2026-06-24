export const STANDARD_FEATURE_KEYS = [
  'tree',
  'book',
  'events',
  'export',
  'search',
  'editTree',
  'editBook',
  'editEvents',
  'linkAccount',
  'settings',
] as const;

export type StandardFeatureKey = (typeof STANDARD_FEATURE_KEYS)[number];
export type StandardFeatures = Record<StandardFeatureKey, boolean>;

export const APP_CONFIG_STANDARD_FEATURES_KEY = 'standard_features_default';

export const DEFAULT_STANDARD_FEATURES: StandardFeatures = {
  tree: true,
  book: true,
  events: true,
  export: true,
  search: true,
  editTree: false,
  editBook: false,
  editEvents: false,
  linkAccount: true,
  settings: true,
};

export function allStandardFeaturesEnabled(): StandardFeatures {
  return Object.fromEntries(
    STANDARD_FEATURE_KEYS.map((key) => [key, true]),
  ) as StandardFeatures;
}

/**
 * Feature của tài khoản demo: bật phần đọc (tree/book/events/export/search/
 * settings) để xem & in, tắt mọi phần ghi. Ghi vẫn bị `FeatureMutateGuard`
 * chặn cứng theo `isDemo` — đây chỉ là để ẩn nút sửa trên UI.
 */
export const DEMO_STANDARD_FEATURES: StandardFeatures = {
  tree: true,
  book: true,
  events: true,
  export: true,
  search: true,
  editTree: false,
  editBook: false,
  editEvents: false,
  linkAccount: false,
  settings: true,
};

export function mergeStandardFeatures(
  defaults: Partial<StandardFeatures>,
  overrides?: Partial<StandardFeatures> | null,
): StandardFeatures {
  return {
    ...DEFAULT_STANDARD_FEATURES,
    ...defaults,
    ...(overrides ?? {}),
  };
}

export function parseFeaturePatch(input: unknown): Partial<StandardFeatures> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {};
  }

  const patch: Partial<StandardFeatures> = {};
  for (const key of STANDARD_FEATURE_KEYS) {
    const value = (input as Record<string, unknown>)[key];
    if (typeof value === 'boolean') {
      patch[key] = value;
    }
  }
  return patch;
}
