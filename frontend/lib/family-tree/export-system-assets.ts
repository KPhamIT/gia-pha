import {
  DRAGON_ASPECT,
  SCROLL_ASPECT,
} from "@/lib/family-tree/export-tree-geometry";

export type SystemAssetCategory = "all" | "background" | "scroll" | "couplet";

export type SystemAssetProvider = "static" | "cloudinary" | "local";

export type SystemAsset = {
  id: string;
  dbId: number;
  name: string;
  url: string;
  category: Exclude<SystemAssetCategory, "all">;
  provider: SystemAssetProvider;
  access: "free" | "paid";
  key?: string;
  aspectRatio?: number;
  width?: number;
  height?: number;
};

/** Built-in SVG frame backgrounds for tree export (`/public/images/khung`). */
const KHUNG_BACKGROUNDS: SystemAsset[] = [
  { file: "khung1.svg", name: "Khung nền 1", aspectRatio: 10104 / 6746 },
  { file: "khung2.svg", name: "Khung nền 2", aspectRatio: 33763 / 22055 },
  { file: "khung3.svg", name: "Khung nền 3", aspectRatio: 10236 / 6804 },
  { file: "khung4.svg", name: "Khung nền 4", aspectRatio: 11043 / 7521 },
  { file: "khung5.svg", name: "Khung nền 5", aspectRatio: 11043 / 7521 },
  { file: "khung6.svg", name: "Khung nền 6", aspectRatio: 54000 / 34000 },
  { file: "khung7.svg", name: "Khung nền 7", aspectRatio: 42377 / 28484 },
].map(({ file, name, aspectRatio }) => ({
  id: `builtin-khung-${file.replace(".svg", "")}`,
  dbId: 0,
  name,
  url: `/images/khung/${file}`,
  category: "background" as const,
  provider: "static" as const,
  access: "free" as const,
  aspectRatio,
}));

/** Built-in decorative images shipped under /public/images. */
export const BUILTIN_SYSTEM_ASSETS: SystemAsset[] = [
  ...KHUNG_BACKGROUNDS,
  {
    id: "builtin-scroll",
    dbId: 0,
    name: "Cuốn thư",
    url: "/images/cuonthu.png",
    category: "scroll",
    provider: "static",
    access: "free",
    aspectRatio: SCROLL_ASPECT,
  },
  {
    id: "builtin-dragon-left",
    dbId: 0,
    name: "Rồng trái",
    url: "/images/longleft.png",
    category: "background",
    provider: "static",
    access: "free",
    aspectRatio: DRAGON_ASPECT,
  },
  {
    id: "builtin-dragon-right",
    dbId: 0,
    name: "Rồng phải",
    url: "/images/longright.png",
    category: "background",
    provider: "static",
    access: "free",
    aspectRatio: DRAGON_ASPECT,
  },
];

export function filterSystemAssets(
  assets: SystemAsset[],
  category: SystemAssetCategory,
  query: string,
): SystemAsset[] {
  const q = query.trim().toLowerCase();
  return assets.filter((asset) => {
    if (category !== "all" && asset.category !== category) return false;
    if (!q) return true;
    return asset.name.toLowerCase().includes(q);
  });
}

export function mergeSystemAssets(
  uploaded: SystemAsset[],
): SystemAsset[] {
  const seen = new Set<string>();
  const merged: SystemAsset[] = [];
  for (const asset of [...BUILTIN_SYSTEM_ASSETS, ...uploaded]) {
    const dedupeKey = asset.key ?? asset.url;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    merged.push(asset);
  }
  return merged;
}

export function canDeleteUploadedSystemAsset(asset: SystemAsset): boolean {
  return asset.provider !== "static" && asset.dbId > 0;
}
