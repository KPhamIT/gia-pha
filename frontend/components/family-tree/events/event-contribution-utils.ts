import { getBranchLabel } from "@/lib/constants/branches";
import { UI } from "@/lib/constants/ui-strings";
import { parseVndInput } from "./event-format";
import type { Person } from "@/components/types/family-tree-types";
import type {
  EventContribution,
  FamilyEvent,
  FamilyEventDetail,
} from "@/components/types/event-types";

export function personMeta(person: Person): string {
  return [
    person.generation != null ? UI.GENERATION_SHORT(person.generation) : null,
    person.branch != null ? getBranchLabel(person.branch) : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function amountsFromContributions(
  contributions: EventContribution[],
  amountPerPerson: number,
): Map<number, number> {
  const map = new Map<number, number>();
  for (const contribution of contributions) {
    const amount =
      contribution.amountPaid > 0
        ? contribution.amountPaid
        : contribution.paid && amountPerPerson > 0
          ? amountPerPerson
          : 0;
    if (amount > 0) map.set(contribution.personId, amount);
  }
  return map;
}

export function isFullyPaid(amount: number, amountPerPerson: number): boolean {
  if (amountPerPerson <= 0) return amount > 0;
  return amount >= amountPerPerson;
}

export function mapsEqual(
  a: Map<number, number>,
  b: Map<number, number>,
): boolean {
  if (a.size !== b.size) return false;
  for (const [key, value] of a) {
    if (b.get(key) !== value) return false;
  }
  return true;
}

/** Merge parsed money inputs into the draft before compare/save. */
export function resolveDraftAmounts(
  draft: Map<number, number>,
  inputs: Map<number, string>,
): Map<number, number> {
  const resolved = new Map(draft);
  for (const [personId, raw] of inputs) {
    const amount = parseVndInput(raw);
    if (amount <= 0) resolved.delete(personId);
    else resolved.set(personId, amount);
  }
  return resolved;
}

/** Immutable map update: set a positive amount, or remove the key. */
export function withAmount(
  map: Map<number, number>,
  personId: number,
  amount: number,
): Map<number, number> {
  const next = new Map(map);
  if (amount <= 0) next.delete(personId);
  else next.set(personId, amount);
  return next;
}

/** Immutable map delete returning a fresh map. */
export function withoutKey<V>(
  map: Map<number, V>,
  personId: number,
): Map<number, V> {
  const next = new Map(map);
  next.delete(personId);
  return next;
}

/** Contributions whose resolved amount differs from what is already saved. */
export function changedContributions(
  livingIds: number[],
  nextDraft: Map<number, number>,
  savedAmounts: Map<number, number>,
): { personId: number; amountPaid: number }[] {
  return livingIds
    .filter((id) => (nextDraft.get(id) ?? 0) !== (savedAmounts.get(id) ?? 0))
    .map((personId) => ({
      personId,
      amountPaid: nextDraft.get(personId) ?? 0,
    }));
}

export const summaryPatch = (
  detail: FamilyEventDetail,
): Partial<FamilyEvent> => ({
  paidCount: detail.paidCount,
  totalCollected: detail.totalCollected,
  donationTotal: detail.donationTotal,
  grandTotal: detail.grandTotal,
});
