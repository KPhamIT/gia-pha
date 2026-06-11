import type { Person, PersonRelationships, Relationship } from '@/components/types/family-tree-types';

function uniquePersons(persons: Person[]): Person[] {
  const seen = new Set<number>();
  return persons.filter((person) => {
    if (seen.has(person.id)) return false;
    seen.add(person.id);
    return true;
  });
}

export function extractPersonRelationships(
  personId: number,
  relationships: Relationship[],
): PersonRelationships {
  let father: Person | null = null;
  let mother: Person | null = null;
  const spouses: Person[] = [];
  const children: Person[] = [];

  for (const rel of relationships) {
    if (rel.toId === personId && rel.type === 'FATHER') {
      father = rel.from;
    } else if (rel.toId === personId && rel.type === 'MOTHER') {
      mother = rel.from;
    } else if (rel.fromId === personId && (rel.type === 'FATHER' || rel.type === 'MOTHER')) {
      children.push(rel.to);
    } else if (rel.toId === personId && rel.type === 'CHILD') {
      children.push(rel.from);
    } else if (rel.type === 'SPOUSE') {
      if (rel.fromId === personId) {
        spouses.push(rel.to);
      } else if (rel.toId === personId) {
        spouses.push(rel.from);
      }
    }
  }

  return {
    father,
    mother,
    spouses: uniquePersons(spouses),
    children: uniquePersons(children),
  };
}

export function formatDate(date?: string | null): string {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleDateString('vi-VN');
}

export function toDateInputValue(date?: string | null): string {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString().slice(0, 10);
}
