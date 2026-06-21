import type {
  CreateDonationInput,
  DonationDraftItem,
  EventDonation,
  SaveDonationsInput,
  UpdateDonationInput,
} from '@/components/types/event-types';

export function donationsToDraft(donations: EventDonation[]): DonationDraftItem[] {
  return donations.map((donation) => ({
    draftKey: `s-${donation.id}`,
    id: donation.id,
    donorName: donation.donorName,
    personId: donation.personId,
    kind: donation.kind ?? 'MONEY',
    amount: donation.amount,
    itemDescription: donation.itemDescription,
    note: donation.note,
  }));
}

/** Build a draft row from form input, reusing an existing key when editing. */
export function draftFromInput(input: CreateDonationInput, draftKey: string): DonationDraftItem {
  return {
    draftKey,
    donorName: input.donorName,
    personId: input.personId,
    kind: input.kind ?? 'MONEY',
    amount: input.amount ?? 0,
    itemDescription: input.itemDescription ?? null,
    note: input.note ?? null,
  };
}

function toCreateInput(item: DonationDraftItem): CreateDonationInput {
  return {
    donorName: item.donorName,
    personId: item.personId,
    kind: item.kind,
    amount: item.kind === 'MONEY' ? item.amount : 0,
    itemDescription: item.kind === 'IN_KIND' ? item.itemDescription ?? undefined : undefined,
    note: item.note ?? undefined,
  };
}

function toUpdateInput(item: DonationDraftItem): UpdateDonationInput {
  return {
    donorName: item.donorName,
    personId: item.personId,
    kind: item.kind,
    amount: item.kind === 'MONEY' ? item.amount : 0,
    itemDescription: item.kind === 'IN_KIND' ? item.itemDescription ?? undefined : undefined,
    note: item.note ?? undefined,
  };
}

function isSameDonation(saved: EventDonation, draft: DonationDraftItem): boolean {
  return (
    saved.donorName === draft.donorName &&
    (saved.personId ?? null) === (draft.personId ?? null) &&
    (saved.kind ?? 'MONEY') === draft.kind &&
    saved.amount === draft.amount &&
    (saved.itemDescription ?? null) === (draft.itemDescription ?? null) &&
    (saved.note ?? null) === (draft.note ?? null)
  );
}

/** Diff saved server rows vs local draft for one batch PUT. */
export function buildSaveDonationsPayload(
  saved: EventDonation[],
  draft: DonationDraftItem[],
): SaveDonationsInput {
  const draftById = new Map(draft.filter((item) => item.id != null).map((item) => [item.id!, item]));

  const remove = saved.filter((item) => !draftById.has(item.id)).map((item) => item.id);
  const create = draft.filter((item) => item.id == null).map(toCreateInput);
  const update = draft
    .filter((item) => item.id != null)
    .filter((item) => {
      const original = saved.find((savedItem) => savedItem.id === item.id);
      return original != null && !isSameDonation(original, item);
    })
    .map((item) => ({ id: item.id!, ...toUpdateInput(item) }));

  return { create, update, remove };
}

export function isDonationsDraftDirty(saved: EventDonation[], draft: DonationDraftItem[]): boolean {
  const payload = buildSaveDonationsPayload(saved, draft);
  return payload.create.length > 0 || payload.update.length > 0 || payload.remove.length > 0;
}

export function newDonationDraftKey(): string {
  return `n-${crypto.randomUUID()}`;
}
