import type { CreatePersonDto } from '@/lib/api/modules/person';
import { api } from '@/lib/api';
import type { CreateChildInput, Person, Relationship, RelationshipType } from '@/components/types/family-tree-types';

export async function createChildPerson(
  parent: Person,
  data: CreateChildInput,
): Promise<{ person: Person; relationship: Relationship }> {
  const body: CreatePersonDto = {
    fullName: data.fullName,
    gender: data.gender || undefined,
    birthDate: data.birthDate || undefined,
    avatar: data.avatar || undefined,
    generation: data.generation ?? (parent.generation != null ? parent.generation + 1 : null),
    branch: data.branch ?? parent.branch ?? 1,
    organizationId: parent.organizationId,
  };

  const person = await api.person.create(body);
  const relationship = await api.relationship.create({
    fromId: person.id,
    toId: parent.id,
    type: 'CHILD',
  });

  return { person, relationship };
}

export async function deletePersonById(personId: number): Promise<void> {
  await api.person.delete(personId);
}

export async function createRelationship(
  fromId: number,
  toId: number,
  type: RelationshipType,
): Promise<Relationship> {
  return api.relationship.create({ fromId, toId, type });
}

export async function deleteRelationshipById(relationshipId: number): Promise<void> {
  await api.relationship.delete(relationshipId);
}

export async function createStandalonePerson(
  organizationId: number | null | undefined,
  data: { fullName: string; gender?: string; birthDate?: string },
): Promise<Person> {
  const body: CreatePersonDto = {
    fullName: data.fullName,
    gender: data.gender || undefined,
    birthDate: data.birthDate || undefined,
    organizationId: organizationId ?? undefined,
  };
  return api.person.create(body);
}

export async function updatePersonDetail(
  personId: number,
  data: Parameters<typeof api.person.updateDetail>[1],
) {
  return api.person.updateDetail(personId, data);
}
