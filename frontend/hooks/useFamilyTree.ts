'use client';

import { useCallback, useEffect, useState } from 'react';
import type { FamilyTreeData, Person, Relationship } from '@/components/types/family-tree-types';
import { resolveRootPersonId } from '@/lib/family-tree/resolve-root-person-id';
import {
  addPersonToTree,
  addRelationshipToTree,
  removePersonFromTree,
  removeRelationshipFromTree,
  updatePersonInTree,
} from '@/utils/family-tree-utils';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/utils/errors';
import { UI } from '@/lib/constants/ui-strings';

const ALLOW_PUBLIC_ACCESS = process.env.NEXT_PUBLIC_ALLOW_PUBLIC_ACCESS === 'true';

export function useFamilyTree(allowPublicAccess = ALLOW_PUBLIC_ACCESS) {
  const [treeData, setTreeData] = useState<FamilyTreeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFamilyTree = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const personId = await resolveRootPersonId(allowPublicAccess);
      if (!personId) {
        setError(UI.ERR_FETCH_USER);
        setTreeData(null);
        return;
      }

      setTreeData(await api.person.getTree(personId));
    } catch (err) {
      console.error('Error fetching family tree:', err);
      setError(getErrorMessage(err, UI.ERR_FETCH_DATA));
      setTreeData(null);
    } finally {
      setLoading(false);
    }
  }, [allowPublicAccess]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadFamilyTree();
  }, [loadFamilyTree]);

  const addPerson = useCallback((person: Person, relationship?: Relationship) => {
    setTreeData((prev) => (prev ? addPersonToTree(prev, person, relationship) : prev));
  }, []);

  const removePerson = useCallback((personId: number) => {
    setTreeData((prev) => (prev ? removePersonFromTree(prev, personId) : prev));
  }, []);

  const addRelationship = useCallback((relationship: Relationship) => {
    setTreeData((prev) => (prev ? addRelationshipToTree(prev, relationship) : prev));
  }, []);

  const removeRelationship = useCallback((relationshipId: number) => {
    setTreeData((prev) => (prev ? removeRelationshipFromTree(prev, relationshipId) : prev));
  }, []);

  const updatePerson = useCallback((person: Person) => {
    setTreeData((prev) => (prev ? updatePersonInTree(prev, person) : prev));
  }, []);

  return {
    treeData,
    loading,
    error,
    reload: loadFamilyTree,
    addPerson,
    removePerson,
    addRelationship,
    removeRelationship,
    updatePerson,
  };
}
