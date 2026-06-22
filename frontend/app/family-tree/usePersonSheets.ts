"use client";

import { useCallback, useState } from "react";
import type {
  FamilyTreeData,
  Person,
  UpdatePersonDetailInput,
} from "@/components/types/family-tree-types";
import type { StandardFeatureKey } from "@/lib/auth/standard-features";
import { usePersonActions } from "@/hooks/usePersonActions";
import { usePersonDetail } from "@/hooks/usePersonDetail";
import { usePersonDetailStore } from "@/store/personDetailStore";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import {
  createStandalonePerson,
  updatePersonDetail,
} from "@/lib/family-tree/mutations";
import { UI } from "@/lib/constants/ui-strings";

export type ViewMode =
  | "detail"
  | "edit"
  | "addChild"
  | "addPerson"
  | "deleteConfirm";

type Args = {
  treeData: FamilyTreeData | null;
  requireFeature: (key: StandardFeatureKey) => boolean;
  addPerson: (person: Person) => void;
  removePerson: (personId: number) => void;
  updatePerson: (person: Person) => void;
};

/** Owns person selection, the detail/edit/add/delete sheet state machine, and search. */
export function usePersonSheets({
  treeData,
  requireFeature,
  addPerson,
  removePerson,
  updatePerson,
}: Args) {
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  const [selectedNode, setSelectedNode] = useState<Person | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode | null>(null);
  const [focusNodeId, setFocusNodeId] = useState<number | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  const {
    detail,
    loading: detailLoading,
    error: detailError,
    reload: reloadDetail,
  } = usePersonDetail(selectedPersonId);
  const storeUpdateDetail = usePersonDetailStore((s) => s.updateDetail);
  const { loading: actionLoading, run: runAction } = useAsyncAction();
  const {
    createChild,
    deleteNode,
    loading: modalLoading,
  } = usePersonActions({
    selectedNode,
    setSelectedNode: (node) => {
      setSelectedNode(node);
      if (!node) {
        setSelectedPersonId(null);
        setViewMode(null);
      }
    },
    addPerson,
    removePerson,
  });

  const openPersonDetail = useCallback((person: Person) => {
    setSelectedNode(person);
    setSelectedPersonId(person.id);
    setFocusNodeId(person.id);
    setViewMode("detail");
  }, []);

  const handleNodeClick = useCallback(
    (_id: number, person: Person) => openPersonDetail(person),
    [openPersonDetail],
  );
  const handleSelectPerson = useCallback(
    (personId: number) => {
      const person = treeData?.persons.find((p) => p.id === personId);
      if (person) openPersonDetail(person);
    },
    [openPersonDetail, treeData?.persons],
  );
  const handleSearchSelect = useCallback(
    (person: Person) => {
      setShowSearch(false);
      openPersonDetail(person);
    },
    [openPersonDetail],
  );

  const closeAllSheets = useCallback(() => {
    setSelectedPersonId(null);
    setSelectedNode(null);
    setViewMode(null);
  }, []);

  const handleCreateChild = useCallback(
    async (input: Parameters<typeof createChild>[0]) => {
      if (!requireFeature("editTree")) return;
      await createChild(input);
      setViewMode("detail");
      reloadDetail();
    },
    [createChild, reloadDetail, requireFeature],
  );

  const handleSavePerson = useCallback(
    async (data: UpdatePersonDetailInput) => {
      if (!selectedPersonId || !requireFeature("editTree")) return;
      await runAction(
        async () => {
          const updated = await updatePersonDetail(selectedPersonId, data);
          updatePerson(updated.person);
          setSelectedNode(updated.person);
          storeUpdateDetail(selectedPersonId, updated);
          setViewMode("detail");
        },
        UI.ERR_UPDATE_PERSON,
        { success: UI.TOAST_PERSON_UPDATED },
      );
    },
    [
      requireFeature,
      runAction,
      selectedPersonId,
      storeUpdateDetail,
      updatePerson,
    ],
  );

  const handleAddStandalonePerson = useCallback(
    async (data: { fullName: string; gender: string; birthDate: string }) => {
      if (!treeData || !requireFeature("editTree")) return;
      await runAction(
        async () => {
          const person = await createStandalonePerson(
            treeData.root.organizationId,
            data,
          );
          addPerson(person);
          setShowSearch(false);
          setViewMode(null);
          openPersonDetail(person);
        },
        UI.ERR_CREATE_PERSON,
        { success: UI.TOAST_PERSON_CREATED },
      );
    },
    [addPerson, openPersonDetail, requireFeature, runAction, treeData],
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!requireFeature("editTree")) return;
    await deleteNode();
    setViewMode(null);
  }, [deleteNode, requireFeature]);

  return {
    selectedPersonId,
    selectedNode,
    viewMode,
    focusNodeId,
    showSearch,
    detail,
    detailLoading,
    detailError,
    actionLoading,
    modalLoading,
    openPersonDetail,
    handleNodeClick,
    handleSelectPerson,
    handleSearchSelect,
    closeAllSheets,
    openSearch: useCallback(() => setShowSearch(true), []),
    closeSearch: useCallback(() => setShowSearch(false), []),
    openEdit: useCallback(() => setViewMode("edit"), []),
    openAddChild: useCallback(() => setViewMode("addChild"), []),
    openDeleteConfirm: useCallback(() => setViewMode("deleteConfirm"), []),
    openAddPerson: useCallback(() => setViewMode("addPerson"), []),
    closeAddPerson: useCallback(() => setViewMode(null), []),
    backToDetail: useCallback(() => setViewMode("detail"), []),
    handleCreateChild,
    handleSavePerson,
    handleAddStandalonePerson,
    handleDeleteConfirm,
  };
}
