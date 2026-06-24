"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  FamilyTreeData,
  Person,
  Relationship,
} from "@/components/types/family-tree-types";
import {
  addPersonToTree,
  addRelationshipToTree,
  removePersonFromTree,
  removeRelationshipFromTree,
  updatePersonInTree,
} from "@/utils/family-tree-utils";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/utils/errors";
import { UI } from "@/lib/constants/ui-strings";
import { clearToken, getToken } from "@/lib/auth/session";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

type UseFamilyTreeOptions = {
  enabled?: boolean;
  /** Dùng dữ liệu org demo công khai thay cho org của người dùng. */
  demo?: boolean;
};

export function useFamilyTree(options: UseFamilyTreeOptions = {}) {
  const enabled = options.enabled ?? true;
  const demo = options.demo ?? false;
  const refreshAuth = useAuthStore((state) => state.refresh);
  const [treeData, setTreeData] = useState<FamilyTreeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFamilyTree = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getToken();
      if (token && !demo) {
        try {
          await refreshAuth();
        } catch (err) {
          if (axios.isAxiosError(err) && err.response?.status === 401) {
            clearToken();
            useAuthStore.getState().clear();
          } else {
            console.error("Error refreshing auth:", err);
          }
        }
      }

      setTreeData(
        demo
          ? await api.person.getDemoTree()
          : await api.person.getDefaultTree(),
      );
    } catch (err) {
      console.error("Error fetching family tree:", err);
      setError(getErrorMessage(err, UI.ERR_FETCH_DATA));
      setTreeData(null);
    } finally {
      setLoading(false);
    }
  }, [demo, refreshAuth]);

  useEffect(() => {
    if (!enabled) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadFamilyTree();
  }, [enabled, loadFamilyTree]);

  const addPerson = useCallback(
    (person: Person, relationship?: Relationship) => {
      setTreeData((prev) =>
        prev ? addPersonToTree(prev, person, relationship) : prev,
      );
    },
    [],
  );

  const removePerson = useCallback((personId: number) => {
    setTreeData((prev) => (prev ? removePersonFromTree(prev, personId) : prev));
  }, []);

  const addRelationship = useCallback((relationship: Relationship) => {
    setTreeData((prev) =>
      prev ? addRelationshipToTree(prev, relationship) : prev,
    );
  }, []);

  const removeRelationship = useCallback((relationshipId: number) => {
    setTreeData((prev) =>
      prev ? removeRelationshipFromTree(prev, relationshipId) : prev,
    );
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
