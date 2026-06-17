'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { FamilyTreeData, Person, Relationship } from '@/components/types/family-tree-types';
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
import { clearToken, getToken } from '@/lib/auth/session';
import axios from 'axios';

const ALLOW_PUBLIC_ACCESS = process.env.NEXT_PUBLIC_ALLOW_PUBLIC_ACCESS === 'true';

export function useFamilyTree(allowPublicAccess = ALLOW_PUBLIC_ACCESS) {
  const router = useRouter();
  const [treeData, setTreeData] = useState<FamilyTreeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authRequired, setAuthRequired] = useState(false);

  const loadFamilyTree = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setAuthRequired(false);

      const token = getToken();

      if (!token && !allowPublicAccess) {
        router.replace('/login');
        return;
      }

      if (token) {
        try {
          const meResponse = await api.auth.me();
          if (meResponse?.person?.id) {
            setTreeData(await api.person.getTree(meResponse.person.id));
            return;
          }
        } catch (err) {
          if (axios.isAxiosError(err) && err.response?.status === 401) {
            clearToken();
            if (!allowPublicAccess) {
              router.replace('/login');
              return;
            }
          } else {
            console.error('Error fetching user info:', err);
          }
        }
      }

      if (!allowPublicAccess) {
        setAuthRequired(true);
        setError(UI.ERR_AUTH_REQUIRED);
        setTreeData(null);
        return;
      }

      setTreeData(await api.person.getDefaultTree());
    } catch (err) {
      console.error('Error fetching family tree:', err);
      setError(getErrorMessage(err, UI.ERR_FETCH_DATA));
      setTreeData(null);
    } finally {
      setLoading(false);
    }
  }, [allowPublicAccess, router]);

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
    authRequired,
    reload: loadFamilyTree,
    addPerson,
    removePerson,
    addRelationship,
    removeRelationship,
    updatePerson,
  };
}
