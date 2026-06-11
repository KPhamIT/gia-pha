import type { FamilyTreeData, Person, Relationship } from '@/components/types/family-tree-types';

export function getRootPerson(persons: Person[]): Person | null {
  if (!Array.isArray(persons) || persons.length === 0) {
    return null;
  }

  return persons.find((person) => person.generation === 0) ?? persons[0];
}

function enrichRelationship(
  relationship: Relationship,
  persons: Person[],
): Relationship {
  const from = relationship.from ?? persons.find((p) => p.id === relationship.fromId);
  const to = relationship.to ?? persons.find((p) => p.id === relationship.toId);
  if (!from || !to) {
    return relationship;
  }
  return { ...relationship, from, to };
}

export function addPersonToTree(
  treeData: FamilyTreeData,
  person: Person,
  relationship?: Relationship,
): FamilyTreeData {
  const persons = treeData.persons.some((p) => p.id === person.id)
    ? treeData.persons
    : [...treeData.persons, person];

  if (!relationship) {
    return { ...treeData, persons };
  }

  if (treeData.relationships.some((r) => r.id === relationship.id)) {
    return { ...treeData, persons };
  }

  return {
    ...treeData,
    persons,
    relationships: [
      ...treeData.relationships,
      enrichRelationship(relationship, persons),
    ],
  };
}

export function removePersonFromTree(
  treeData: FamilyTreeData,
  personId: number,
): FamilyTreeData {
  return {
    ...treeData,
    persons: treeData.persons.filter((person) => person.id !== personId),
    relationships: treeData.relationships.filter(
      (relationship) => relationship.fromId !== personId && relationship.toId !== personId,
    ),
  };
}

export function addRelationshipToTree(
  treeData: FamilyTreeData,
  relationship: Relationship,
): FamilyTreeData {
  if (treeData.relationships.some((r) => r.id === relationship.id)) {
    return treeData;
  }

  return {
    ...treeData,
    relationships: [
      ...treeData.relationships,
      enrichRelationship(relationship, treeData.persons),
    ],
  };
}

export function removeRelationshipFromTree(
  treeData: FamilyTreeData,
  relationshipId: number,
): FamilyTreeData {
  return {
    ...treeData,
    relationships: treeData.relationships.filter(
      (relationship) => relationship.id !== relationshipId,
    ),
  };
}

export function updatePersonInTree(treeData: FamilyTreeData, updated: Person): FamilyTreeData {
  const persons = treeData.persons.map((person) =>
    person.id === updated.id ? { ...person, ...updated } : person,
  );

  const relationships = treeData.relationships.map((relationship) => ({
    ...relationship,
    from: relationship.from.id === updated.id ? { ...relationship.from, ...updated } : relationship.from,
    to: relationship.to.id === updated.id ? { ...relationship.to, ...updated } : relationship.to,
  }));

  const root = treeData.root.id === updated.id ? { ...treeData.root, ...updated } : treeData.root;

  return { root, persons, relationships };
}
