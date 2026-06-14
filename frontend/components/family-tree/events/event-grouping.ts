import type { Person, Relationship } from '@/components/types/family-tree-types';
import {
  buildRelationMaps,
  getEffectiveRelationships,
  getTreeEdges,
  normalizeParentChildEdges,
} from '@/components/family-tree/graph/layout/edges';

/** A nuclear family for the contribution list: a father (header) + his members. */
export type FamilyGroup = {
  key: string;
  /** The father heading this family. `null` for top ancestors with no parent. */
  head: Person | null;
  members: Person[];
};

/** Gender is stored inconsistently ('male'/'Nam'); treat both as male. */
function isMale(person: Person): boolean {
  const g = (person.gender ?? '').trim().toLowerCase();
  return g === 'male' || g === 'nam' || g === 'm';
}

/** A person counts as living when no death date is recorded. */
export function isLiving(person: Person): boolean {
  return !person.deathDate;
}

function byGenerationThenName(a: Person, b: Person): number {
  const ga = a.generation ?? Number.MAX_SAFE_INTEGER;
  const gb = b.generation ?? Number.MAX_SAFE_INTEGER;
  return ga - gb || a.fullName.localeCompare(b.fullName, 'vi');
}

/**
 * Group living persons into nuclear families keyed by their father, so the
 * contribution list reads "father → his (living) children". Every living person
 * appears exactly once, under their own father; ancestors with no parent fall
 * into a single "root" group.
 */
export function groupLivingByFamily(
  persons: Person[],
  relationships: Relationship[],
): FamilyGroup[] {
  const personById = new Map(persons.map((p) => [p.id, p]));
  const edges = normalizeParentChildEdges(getTreeEdges(getEffectiveRelationships(relationships)));
  const { parentMap } = buildRelationMaps(edges);

  const fatherOf = (childId: number): Person | null => {
    const parents = (parentMap.get(childId) ?? [])
      .map((id) => personById.get(id))
      .filter((p): p is Person => Boolean(p));
    if (parents.length === 0) return null;
    return parents.find(isMale) ?? parents[0];
  };

  const groups = new Map<string, FamilyGroup>();
  for (const person of persons) {
    if (!isLiving(person)) continue;
    const father = fatherOf(person.id);
    const key = father ? `f-${father.id}` : 'root';
    const group = groups.get(key) ?? { key, head: father, members: [] };
    group.members.push(person);
    groups.set(key, group);
  }

  const list = [...groups.values()];
  list.forEach((group) => group.members.sort(byGenerationThenName));
  list.sort((a, b) => {
    const ga = a.head?.generation ?? a.members[0]?.generation ?? Number.MAX_SAFE_INTEGER;
    const gb = b.head?.generation ?? b.members[0]?.generation ?? Number.MAX_SAFE_INTEGER;
    return ga - gb || (a.head?.fullName ?? '').localeCompare(b.head?.fullName ?? '', 'vi');
  });
  return list;
}

export function countLiving(persons: Person[]): number {
  return persons.reduce((n, p) => (isLiving(p) ? n + 1 : n), 0);
}
