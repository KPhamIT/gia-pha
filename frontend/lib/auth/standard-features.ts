export const STANDARD_FEATURE_KEYS = [
  "tree",
  "book",
  "events",
  "export",
  "search",
  "editTree",
  "editBook",
  "editEvents",
  "linkAccount",
  "settings",
] as const;

export type StandardFeatureKey = (typeof STANDARD_FEATURE_KEYS)[number];
export type StandardFeatures = Record<StandardFeatureKey, boolean>;

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

export type StandardFeaturesConfig = {
  defaults: StandardFeatures;
  overrides: Partial<StandardFeatures>;
  effective: StandardFeatures;
};

export const FEATURE_LABELS: Record<StandardFeatureKey, string> = {
  tree: "Xem cây gia phả",
  book: "Xem sổ gia phả",
  events: "Xem sự kiện",
  export: "Xuất ảnh",
  search: "Tìm người",
  editTree: "Sửa cây gia phả",
  editBook: "Sửa sổ gia phả",
  editEvents: "Quản lý sự kiện",
  linkAccount: "Liên kết tài khoản",
  settings: "Lưu cài đặt hiển thị",
};

export const FEATURE_GROUPS: { title: string; keys: StandardFeatureKey[] }[] = [
  { title: "Xem & dùng", keys: ["tree", "book", "events", "export", "search"] },
  {
    title: "Chỉnh sửa",
    keys: ["editTree", "editBook", "editEvents", "linkAccount", "settings"],
  },
];

export function guestCanUseFeature(key: StandardFeatureKey): boolean {
  return DEFAULT_STANDARD_FEATURES[key];
}
