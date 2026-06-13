import type { Person } from '@/components/types/family-tree-types';

export type Leaf =
  | { kind: 'cover' }
  | { kind: 'preface' }
  | { kind: 'person'; person: Person; personIndex: number };

/** Cover + preface, then one leaf per person, in display order. */
export function buildLeaves(persons: Person[]): Leaf[] {
  return [
    { kind: 'cover' },
    { kind: 'preface' },
    ...persons.map((person, personIndex) => ({ kind: 'person' as const, person, personIndex })),
  ];
}

export const leafKey = (leaf: Leaf): string => (leaf.kind === 'person' ? `p-${leaf.person.id}` : leaf.kind);
