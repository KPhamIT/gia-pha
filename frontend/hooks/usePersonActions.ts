'use client';

import { useCallback } from 'react';
import type { CreateChildFormInput, Person, Relationship } from '@/components/types/family-tree-types';
import { createChildPerson, deletePersonById } from '@/lib/family-tree/mutations';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { UI } from '@/lib/constants/ui-strings';

type UsePersonActionsOptions = {
  selectedNode: Person | null;
  setSelectedNode: (node: Person | null) => void;
  addPerson: (person: Person, relationship?: Relationship) => void;
  removePerson: (personId: number) => void;
};

export function usePersonActions({
  selectedNode,
  setSelectedNode,
  addPerson,
  removePerson,
}: UsePersonActionsOptions) {
  const { loading, run } = useAsyncAction();

  const deleteNode = useCallback(async () => {
    if (!selectedNode) return;

    await run(async () => {
      await deletePersonById(selectedNode.id);
      removePerson(selectedNode.id);
      setSelectedNode(null);
    }, UI.ERR_DELETE);
  }, [selectedNode, removePerson, run, setSelectedNode]);

  const createChild = useCallback(
    async (input: CreateChildFormInput) => {
      if (!selectedNode) return;

      await run(async () => {
        const { person, relationship } = await createChildPerson(selectedNode, {
          fullName: input.fullName,
          gender: input.gender,
          birthDate: input.birthDate,
          avatar: input.avatar,
          generation: input.generation,
          branch: input.branch ? Number(input.branch) : undefined,
        });
        addPerson(person, relationship);
      }, UI.ERR_CREATE_CHILD);
    },
    [addPerson, run, selectedNode],
  );

  return { deleteNode, createChild, loading };
}
