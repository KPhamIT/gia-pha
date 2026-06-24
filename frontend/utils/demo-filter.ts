import type {
  FamilyTreeData,
  Person,
  Relationship,
} from "@/components/types/family-tree-types";

const DEMO_MAX_GENERATION = 4;

export function filterDemoPersons(persons: Person[]): Person[] {
  return persons.filter((person) => {
    if (person.generation == null) return true;
    return person.generation <= DEMO_MAX_GENERATION;
  });
}

export function filterDemoRelationships(
  relationships: Relationship[],
  persons: Person[],
): Relationship[] {
  const allowed = new Set(persons.map((person) => person.id));
  return relationships.filter(
    (rel) => allowed.has(rel.fromId) && allowed.has(rel.toId),
  );
}

export function filterDemoTreeData(treeData: FamilyTreeData): FamilyTreeData {
  const persons = filterDemoPersons(treeData.persons);
  const relationships = filterDemoRelationships(treeData.relationships, persons);
  const root =
    persons.find((person) => person.id === treeData.root.id) ?? persons[0] ?? treeData.root;
  return { ...treeData, root, persons, relationships };
}

export { DEMO_MAX_GENERATION };
