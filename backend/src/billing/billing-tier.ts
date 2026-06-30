import { SubscriptionTier } from '../../generated/prisma/client.js';

export type TierCatalogEntry = {
  label: string;
  maxPersons: number;
  storageQuotaGb: number;
  maxAdmins: number | null;
  priceVnd: number;
  color: 'green' | 'blue' | 'orange' | 'red';
};

export const TIER_CATALOG: Record<SubscriptionTier, TierCatalogEntry> = {
  FAMILY: {
    label: 'Gia đình',
    maxPersons: 50,
    storageQuotaGb: 1,
    maxAdmins: 1,
    priceVnd: 100_000,
    color: 'green',
  },
  SMALL: {
    label: 'Dòng họ Nhỏ',
    maxPersons: 300,
    storageQuotaGb: 10,
    maxAdmins: 5,
    priceVnd: 500_000,
    color: 'blue',
  },
  MEDIUM: {
    label: 'Dòng họ Trung bình',
    maxPersons: 1_000,
    storageQuotaGb: 30,
    maxAdmins: 10,
    priceVnd: 1_000_000,
    color: 'orange',
  },
  LARGE: {
    label: 'Dòng họ Lớn',
    maxPersons: 3_000,
    storageQuotaGb: 100,
    maxAdmins: null,
    priceVnd: 2_000_000,
    color: 'red',
  },
};

export function tierForPersonCount(count: number): SubscriptionTier | null {
  if (count <= 50) return SubscriptionTier.FAMILY;
  if (count <= 300) return SubscriptionTier.SMALL;
  if (count <= 1_000) return SubscriptionTier.MEDIUM;
  if (count <= 3_000) return SubscriptionTier.LARGE;
  return null;
}

export function tierRank(tier: SubscriptionTier): number {
  const ranks: Record<SubscriptionTier, number> = {
    [SubscriptionTier.FAMILY]: 1,
    [SubscriptionTier.SMALL]: 2,
    [SubscriptionTier.MEDIUM]: 3,
    [SubscriptionTier.LARGE]: 4,
  };
  return ranks[tier];
}

export function priceVndForTier(tier: SubscriptionTier): number {
  return TIER_CATALOG[tier].priceVnd;
}

export function tierPublicView(tier: SubscriptionTier) {
  const entry = TIER_CATALOG[tier];
  return {
    tier,
    label: entry.label,
    priceVnd: entry.priceVnd,
    maxPersons: entry.maxPersons,
    storageQuotaGb: entry.storageQuotaGb,
    maxAdmins: entry.maxAdmins,
    color: entry.color,
  };
}
