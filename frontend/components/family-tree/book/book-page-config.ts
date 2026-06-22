import type { Person } from "@/components/types/family-tree-types";

/** Per-person overrides for the book: visibility and display order. */
export type BookPageEntry = { hidden?: boolean; order?: number };

/** Keyed by person id (stringified, since it is persisted as JSON). */
export type BookPageConfig = Record<string, BookPageEntry>;

/** Drop malformed entries from an untrusted blob. */
export function normalizePageConfig(value: unknown): BookPageConfig {
  if (!value || typeof value !== "object") return {};
  const out: BookPageConfig = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (!raw || typeof raw !== "object") continue;
    const entry = raw as Record<string, unknown>;
    const normalized: BookPageEntry = {};
    if (entry.hidden === true) normalized.hidden = true;
    if (typeof entry.order === "number" && Number.isFinite(entry.order)) {
      normalized.order = entry.order;
    }
    if (normalized.hidden || normalized.order !== undefined)
      out[key] = normalized;
  }
  return out;
}

/**
 * Filter out hidden persons and sort the rest by their configured display
 * order, falling back to the natural sort position for persons without one.
 * `persons` is expected to already be in natural book order.
 */
export function applyPageConfig(
  persons: Person[],
  pageConfig: BookPageConfig,
): Person[] {
  return persons
    .map((person, naturalIndex) => ({ person, naturalIndex }))
    .filter(({ person }) => !pageConfig[person.id]?.hidden)
    .sort((a, b) => {
      const orderA = pageConfig[a.person.id]?.order ?? a.naturalIndex + 1;
      const orderB = pageConfig[b.person.id]?.order ?? b.naturalIndex + 1;
      return orderA - orderB || a.naturalIndex - b.naturalIndex;
    })
    .map(({ person }) => person);
}
