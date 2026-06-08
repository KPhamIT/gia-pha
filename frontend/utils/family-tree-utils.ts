import { Person } from '@/components/types/family-tree-types';

export function getRootPerson(persons: Person[]): Person | null {
  if (!Array.isArray(persons) || persons.length === 0) {
    return null;
  }

  return persons.find((person) => person.generation === 0) ?? persons[0];
}
