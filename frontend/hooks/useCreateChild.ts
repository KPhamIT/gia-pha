import { useState } from 'react';
import { api } from '@/lib/api';
import type { Person, Relationship } from '@/components/types/family-tree-types';

export function useCreateChild() {
  const [loading, setLoading] = useState(false);

  const createChild = async (
    parentId: number,
    data: Person,
    parentData: Person,
  ): Promise<{ person: Person; relationship: Relationship }> => {
    setLoading(true);
    try {
      const body = {
        generation: parentData.generation ? parentData.generation + 1 : null,
        branch: parentData.branch,
        organizationId: parentData.organizationId,
        ...data,
      }

      const person = await api.person.create(body);
      const relationship = await api.relationship.create({ fromId: person.id, toId: parentId, type: 'CHILD' });
      return { person, relationship };
    } finally {
      setLoading(false);
    }
  };

  return { createChild, loading };
}
