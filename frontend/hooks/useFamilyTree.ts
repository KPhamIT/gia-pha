'use client';

import { useCallback, useEffect, useState } from 'react';
import { FamilyTreeData, Person } from '@/components/types/family-tree-types';
import { getRootPerson } from '@/utils/family-tree-utils';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const ALLOW_PUBLIC_ACCESS = process.env.NEXT_PUBLIC_ALLOW_PUBLIC_ACCESS === 'true';

type FetchOptions = RequestInit;

type MeResponse = {
  person?: {
    id: number;
  };
};

export function useFamilyTree(
  apiBase = API_BASE,
  allowPublicAccess = ALLOW_PUBLIC_ACCESS,
) {
  const [treeData, setTreeData] = useState<FamilyTreeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWithAuth = useCallback(
    async (path: string, options: FetchOptions = {}) => {
      const token = localStorage.getItem('family-tree-token');
      const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      } as Record<string, string>;

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${apiBase}${path}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Lỗi API');
      }

      return response.json();
    },
    [apiBase],
  );

  const loadFamilyTree = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let personId: number | null = null;

      const token = localStorage.getItem('family-tree-token');
      if (token) {
        try {
          const meResponse = (await fetchWithAuth('/auth/me')) as MeResponse;
          if (meResponse?.person?.id) {
            personId = meResponse.person.id;
          }
        } catch (err) {
          console.error('Error fetching user info:', err);
        }
      }

      if (!personId && allowPublicAccess) {
        try {
          const personsResponse = (await fetchWithAuth('/person')) as Person[];
          const rootPerson = getRootPerson(personsResponse);
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

      const treeResponse = (await fetchWithAuth(`/person/${personId}/tree`)) as FamilyTreeData;
      setTreeData(treeResponse);
    } catch (err) {
      console.error('Error fetching family tree:', err);
      setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu');
      setTreeData(null);
    } finally {
      setLoading(false);
    }
  }, [allowPublicAccess, fetchWithAuth]);

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
