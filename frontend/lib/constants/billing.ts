export const EXPORT_FREE_DOWNLOAD_MAX_NODES = Number.parseInt(
  process.env.NEXT_PUBLIC_EXPORT_FREE_DOWNLOAD_MAX_NODES ?? "30",
  10,
) || 30;

export const BILLING_ENABLED =
  process.env.NEXT_PUBLIC_BILLING_ENABLED !== "false";

export type SubscriptionTier = "FAMILY" | "SMALL" | "MEDIUM" | "LARGE";

export type TierColor = "green" | "blue" | "orange" | "red";

export type TierCatalogEntry = {
  tier: SubscriptionTier;
  label: string;
  priceVnd: number;
  maxPersons: number;
  storageQuotaGb: number;
  maxAdmins: number | null;
  color: TierColor;
};

export const TIER_CATALOG: TierCatalogEntry[] = [
  {
    tier: "FAMILY",
    label: "Gia đình",
    priceVnd: 100_000,
    maxPersons: 50,
    storageQuotaGb: 1,
    maxAdmins: 1,
    color: "green",
  },
  {
    tier: "SMALL",
    label: "Dòng họ Nhỏ",
    priceVnd: 500_000,
    maxPersons: 300,
    storageQuotaGb: 10,
    maxAdmins: 5,
    color: "blue",
  },
  {
    tier: "MEDIUM",
    label: "Dòng họ Trung bình",
    priceVnd: 1_000_000,
    maxPersons: 1_000,
    storageQuotaGb: 30,
    maxAdmins: 10,
    color: "orange",
  },
  {
    tier: "LARGE",
    label: "Dòng họ Lớn",
    priceVnd: 2_000_000,
    maxPersons: 3_000,
    storageQuotaGb: 100,
    maxAdmins: null,
    color: "red",
  },
];

export const TIER_COLOR_CLASS: Record<TierColor, string> = {
  green: "border-emerald-300 bg-emerald-50/80",
  blue: "border-sky-300 bg-sky-50/80",
  orange: "border-orange-300 bg-orange-50/80",
  red: "border-rose-300 bg-rose-50/80",
};

export const TIER_DOT_CLASS: Record<TierColor, string> = {
  green: "bg-emerald-500",
  blue: "bg-sky-500",
  orange: "bg-orange-500",
  red: "bg-rose-500",
};

export function tierLabel(tier: SubscriptionTier): string {
  return TIER_CATALOG.find((item) => item.tier === tier)?.label ?? tier;
}

export function tierColorClass(tier: SubscriptionTier): string {
  const entry = TIER_CATALOG.find((item) => item.tier === tier);
  return entry ? TIER_COLOR_CLASS[entry.color] : TIER_COLOR_CLASS.orange;
}

export function tierDotClass(tier: SubscriptionTier): string {
  const entry = TIER_CATALOG.find((item) => item.tier === tier);
  return entry ? TIER_DOT_CLASS[entry.color] : TIER_DOT_CLASS.orange;
}
