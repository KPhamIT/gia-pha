import type { DonationKind } from '@/components/types/event-types';

const vnd = new Intl.NumberFormat('vi-VN');

/** Format a number of VND with thousands separators, e.g. 200000 -> "200.000 đ". */
export function formatVnd(amount: number): string {
  return `${vnd.format(amount)} đ`;
}

/** Format an ISO date as a vi-VN date, or null if missing/invalid. */
export function formatEventDate(iso?: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString('vi-VN');
}

/** Parse digits from a money input field into VND (integer). */
export function parseVndInput(raw: string): number {
  const parsed = Number.parseInt(raw.replace(/\D/g, ''), 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

/** Display value for a donation row (money or in-kind description). */
export function formatDonationValue(donation: {
  kind: DonationKind;
  amount: number;
  itemDescription?: string | null;
}): string {
  if (donation.kind === 'IN_KIND') {
    return donation.itemDescription?.trim() || '—';
  }
  return formatVnd(donation.amount);
}
