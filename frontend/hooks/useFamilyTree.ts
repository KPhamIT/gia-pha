'use client';

import { useCallback, useEffect, useState } from 'react';
import { FamilyTreeData, Person } from '@/components/types/family-tree-types';
import { getRootPerson } from '@/utils/family-tree-utils';
import { api } from '@/lib/api';

const ALLOW_PUBLIC_ACCESS = process.env.NEXT_PUBLIC_ALLOW_PUBLIC_ACCESS === 'true';

export function useFamilyTree(allowPublicAccess = ALLOW_PUBLIC_ACCESS) {
  const [treeData, setTreeData] = useState<FamilyTreeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFamilyTree = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let personId: number | null = null;

      const token = localStorage.getItem('family-tree-token');
      if (token) {
        try {
          const meResponse = await api.auth.me();
          if (meResponse?.person?.id) {
            personId = meResponse.person.id;
          }
        } catch (err) {
          console.error('Error fetching user info:', err);
        }
      }

      if (!personId && allowPublicAccess) {
        try {
          const persons = await api.person.list();
          const rootPerson = getRootPerson(persons as Person[]);
          personId = rootPerson?.id ?? null;
        } catch (err) {
          console.error('Error fetching persons:', err);
        }
      }

      if (!personId) {
        setError('Không thể lấy dữ liệu người dùng');
        setTreeData(null);
        return;
      }

      const treeResponse = await api.person.getTree(personId);
      setTreeData(treeResponse);
    } catch (err) {
      console.error('Error fetching family tree:', err);
      setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu');
      setTreeData(null);
    } finally {
      setLoading(false);
    }
  }, [allowPublicAccess]);

  useEffect(() => {
    void loadFamilyTree();
  }, [loadFamilyTree]);

  return {
    treeData,
    loading,
    error,
    reload: loadFamilyTree,
  };
}
