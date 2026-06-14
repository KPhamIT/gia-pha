'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import FamilyTreeGraph from '@/components/family-tree/graph/FamilyTreeGraph';
import TreeFilters from '@/components/family-tree/graph/TreeFilters';
import BranchPromptSheet from '@/components/family-tree/graph/BranchPromptSheet';
import PersonDetailSheet from '@/components/family-tree/person/PersonDetailSheet';
import EditPersonSheet from '@/components/family-tree/person/EditPersonSheet';
import AddChildSheet from '@/components/family-tree/person/AddChildSheet';
import AddPersonSheet from '@/components/family-tree/person/AddPersonSheet';
import SearchSheet from '@/components/family-tree/person/SearchSheet';
import TreeFab from '@/components/family-tree/graph/TreeFab';
import GenealogyBookViewer from '@/components/family-tree/book/GenealogyBookViewer';
import FamilyTreeSettings from '@/components/family-tree/settings/FamilyTreeSettings';
import FamilyTreeStatus from '@/components/family-tree/graph/FamilyTreeStatus';
import Icon from '@/components/icons/Icon';
import { useFamilyTree } from '@/hooks/useFamilyTree';
import { useUserBranch } from '@/hooks/useUserBranch';
import { useLayoutConfig } from '@/hooks/useLayoutConfig';
import { filterTreeData } from '@/utils/filter-tree-data';
import type { BranchValue } from '@/lib/constants/branches';
import { usePersonActions } from '@/hooks/usePersonActions';
import { usePersonDetail } from '@/hooks/usePersonDetail';
import { usePersonDetailStore } from '@/store/personDetailStore';
import { useTheme } from '@/hooks/useTheme';
import { useSettings } from '@/hooks/useSettings';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import type { UserSettings } from '@/lib/api/modules/settings';
import type { Person, ThemeMode, UpdatePersonDetailInput } from '@/components/types/family-tree-types';
import { createStandalonePerson, updatePersonDetail } from '@/lib/family-tree/mutations';
import { getPageShellClass } from '@/utils/theme';
import { UI } from '@/lib/constants/ui-strings';

type ViewMode = 'detail' | 'edit' | 'addChild' | 'addPerson' | 'deleteConfirm';

export default function FamilyTreePage() {
  const {
    treeData,
    loading,
    error,
    reload,
    addPerson,
    removePerson,
    addRelationship,
    removeRelationship,
    updatePerson,
  } = useFamilyTree();
  const { theme, setTheme } = useTheme();
  const { layoutConfig, setLayoutConfig } = useLayoutConfig();

  const { saveSettings, saving: savingSettings, saveError: settingsSaveError, saveSuccess } = useSettings({
    onLoaded: (saved: UserSettings) => {
      if (typeof saved.theme === 'string') setTheme(saved.theme as ThemeMode);
      setLayoutConfig((prev) => ({
        ...prev,
        ...(typeof saved.horizontalGap === 'number' && { horizontalGap: saved.horizontalGap }),
        ...(typeof saved.verticalStep === 'number' && { verticalStep: saved.verticalStep }),
        ...(typeof saved.nodeWidth === 'number' && { nodeWidth: saved.nodeWidth }),
        ...(typeof saved.nodeHeight === 'number' && { nodeHeight: saved.nodeHeight }),
        ...(typeof saved.nodeBgColor === 'string' && { nodeBgColor: saved.nodeBgColor }),
        ...(typeof saved.nodeTextColor === 'string' && { nodeTextColor: saved.nodeTextColor }),
      }));
    },
  });

  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  const [selectedNode, setSelectedNode] = useState<Person | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showBook, setShowBook] = useState(true);
  const [focusNodeId, setFocusNodeId] = useState<number | null>(null);
  const [centerTreeKey, setCenterTreeKey] = useState(0);
  const [filterBranch, setFilterBranch] = useState<number | 'all' | null>(null);
  const [maxGeneration, setMaxGeneration] = useState<number | 'all'>(4);

  const { branch: userBranch, setBranch: setUserBranch, hydrated: branchHydrated } = useUserBranch();

  const { detail, loading: detailLoading, error: detailError, reload: reloadDetail } = usePersonDetail(selectedPersonId);
  const { updateDetail: storeUpdateDetail } = usePersonDetailStore();
  const { loading: actionLoading, run: runAction } = useAsyncAction();
  const { createChild, deleteNode, loading: modalLoading } = usePersonActions({
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
    setViewMode('detail');
  }, []);

  const handleNodeClick = useCallback((_personId: number, person: Person) => openPersonDetail(person), [openPersonDetail]);
  const handleOpenSettings = useCallback(() => setShowSettings(true), []);
  const handleOpenSearch = useCallback(() => setShowSearch(true), []);
  const handleOpenBook = useCallback(() => setShowBook(true), []);
  const handleCenterTree = useCallback(() => setCenterTreeKey((k) => k + 1), []);
  const handleCloseSettings = useCallback(() => setShowSettings(false), []);
  const handleCloseSearch = useCallback(() => setShowSearch(false), []);
  const handleCloseBook = useCallback(() => setShowBook(false), []);
  const handleOpenAddPerson = useCallback(() => setViewMode('addPerson'), []);
  const handleCloseAddPerson = useCallback(() => setViewMode(null), []);
  const handleOpenEdit = useCallback(() => setViewMode('edit'), []);
  const handleOpenAddChild = useCallback(() => setViewMode('addChild'), []);
  const handleOpenDeleteConfirm = useCallback(() => setViewMode('deleteConfirm'), []);
  const handleBackToDetail = useCallback(() => setViewMode('detail'), []);
  const handleSaveSettings = useCallback(
    () => saveSettings({ theme, ...layoutConfig }),
    [layoutConfig, saveSettings, theme],
  );
  const handleSelectPerson = useCallback(
    (personId: number) => {
      const person = treeData?.persons.find((p) => p.id === personId);
      if (person) openPersonDetail(person);
    },
    [openPersonDetail, treeData?.persons],
  );
  const handleCreateChild = useCallback(
    async (input: Parameters<typeof createChild>[0]) => {
      await createChild(input);
      setViewMode('detail');
      reloadDetail();
    },
    [createChild, reloadDetail],
  );

  const closeAllSheets = useCallback(() => {
    setSelectedPersonId(null);
    setSelectedNode(null);
    setViewMode(null);
  }, []);

  const handleSavePerson = useCallback(
    async (data: UpdatePersonDetailInput) => {
      if (!selectedPersonId) return;

      await runAction(async () => {
        const updated = await updatePersonDetail(selectedPersonId, data);
        updatePerson(updated.person);
        setSelectedNode(updated.person);
        storeUpdateDetail(selectedPersonId, updated);
        setViewMode('detail');
      }, UI.ERR_UPDATE_PERSON);
    },
    [runAction, selectedPersonId, storeUpdateDetail, updatePerson],
  );

  const handleAddStandalonePerson = useCallback(
    async (data: { fullName: string; gender: string; birthDate: string }) => {
      if (!treeData) return;

      await runAction(async () => {
        const person = await createStandalonePerson(treeData.root.organizationId, data);
        addPerson(person);
        setShowSearch(false);
        setViewMode(null);
        openPersonDetail(person);
      }, UI.ERR_CREATE_PERSON);
    },
    [addPerson, openPersonDetail, runAction, treeData],
  );

  const handleDeleteConfirm = useCallback(async () => {
    await deleteNode();
    setViewMode(null);
  }, [deleteNode]);

  const handleSearchSelect = useCallback(
    (person: Person) => {
      setShowSearch(false);
      openPersonDetail(person);
    },
    [openPersonDetail],
  );

  const handleSelectBranch = useCallback((branch: BranchValue) => setUserBranch(branch), [setUserBranch]);

  // The on-page branch filter follows the user's saved branch until they override it.
  const effectiveBranch = filterBranch ?? userBranch ?? 'all';

  // Re-fit the viewport whenever the visible subset of the tree changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCenterTreeKey((key) => key + 1);
  }, [effectiveBranch, maxGeneration]);

  const filteredTreeData = useMemo(
    () => (treeData ? filterTreeData(treeData, { branch: effectiveBranch, maxGeneration }) : null),
    [treeData, effectiveBranch, maxGeneration],
  );

  if (loading) {
    return <FamilyTreeStatus theme={theme} type="loading" />;
  }

  if (error) {
    return <FamilyTreeStatus theme={theme} type="error" message={error} onRetry={reload} />;
  }

  if (!treeData) {
    return <FamilyTreeStatus theme={theme} type="empty" />;
  }

  return (
    <div className={`min-h-screen ${getPageShellClass(theme)}`}>
      <div className="fixed right-4 top-4 z-20 pt-[env(safe-area-inset-top)]">
        <button
          type="button"
          onClick={handleOpenSettings}
          className={`grid h-11 w-11 place-items-center rounded-full border shadow-sm active:opacity-80 ${
            theme === 'dark'
              ? 'border-slate-700 bg-slate-900 text-slate-100'
              : 'border-slate-200 bg-white text-slate-700'
          }`}
          aria-label="Cài đặt layout"
        >
          <Icon
            path="settings"
            pointer
            width={20}
            height={20}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          />
        </button>
      </div>

      <TreeFilters
        branch={effectiveBranch}
        maxGeneration={maxGeneration}
        onBranchChange={setFilterBranch}
        onMaxGenerationChange={setMaxGeneration}
      />

      <TreeFab
        onAddPerson={handleOpenAddPerson}
        onSearch={handleOpenSearch}
        onOpenBook={handleOpenBook}
        onCenterTree={handleCenterTree}
      />

      <div className="h-screen">
        <FamilyTreeGraph
          treeData={filteredTreeData ?? treeData}
          layoutConfig={layoutConfig}
          selectedNodeId={selectedPersonId}
          focusNodeId={focusNodeId}
          centerTreeKey={centerTreeKey}
          onNodeClick={handleNodeClick}
          onPersonAdded={addPerson}
          onRelationshipAdded={addRelationship}
          onRelationshipRemoved={removeRelationship}
          theme={theme}
        />
      </div>

      {showSettings ? (
        <FamilyTreeSettings
          layoutConfig={layoutConfig}
          setLayoutConfig={setLayoutConfig}
          theme={theme}
          setTheme={setTheme}
          onClose={handleCloseSettings}
          onSave={handleSaveSettings}
          saving={savingSettings}
          saveSuccess={saveSuccess}
          saveError={settingsSaveError}
        />
      ) : null}

      {showBook ? (
        <GenealogyBookViewer
          persons={treeData.persons}
          onClose={handleCloseBook}
          onPersonUpdated={updatePerson}
        />
      ) : null}

      {branchHydrated && userBranch == null ? <BranchPromptSheet onSelect={handleSelectBranch} /> : null}

      {showSearch ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-slate-900/30"
            onClick={handleCloseSearch}
            aria-label={UI.CANCEL}
          />
          <SearchSheet
            persons={treeData.persons}
            onClose={handleCloseSearch}
            onSelect={handleSearchSelect}
          />
        </>
      ) : null}

      {viewMode === 'detail' && selectedPersonId != null ? (
        <PersonDetailSheet
          detail={detail}
          loading={detailLoading}
          error={detailError}
          onClose={closeAllSheets}
          onEdit={handleOpenEdit}
          onAddChild={handleOpenAddChild}
          onDelete={handleOpenDeleteConfirm}
          onSelectPerson={handleSelectPerson}
        />
      ) : null}

      {viewMode === 'edit' && selectedPersonId != null ? (
        <EditPersonSheet
          detail={detail}
          loading={detailLoading}
          saving={actionLoading}
          onClose={handleBackToDetail}
          onSave={handleSavePerson}
        />
      ) : null}

      {viewMode === 'addChild' && selectedNode ? (
        <AddChildSheet
          parent={selectedNode}
          onClose={handleBackToDetail}
          onCreateChild={handleCreateChild}
          loading={modalLoading}
        />
      ) : null}

      {viewMode === 'addPerson' ? (
        <AddPersonSheet
          onClose={handleCloseAddPerson}
          onSubmit={handleAddStandalonePerson}
          loading={actionLoading}
        />
      ) : null}

      {viewMode === 'deleteConfirm' && selectedNode ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/30 p-4 pb-[env(safe-area-inset-bottom)]">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-100 text-red-600">
                <Icon path="alertTriangle" size={18} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Xóa {selectedNode.fullName}?</p>
                <p className="text-xs text-slate-500">{UI.DELETE_IRREVERSIBLE}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleBackToDetail}
                className="rounded-2xl border border-slate-300 py-3 text-sm font-medium text-slate-700 active:bg-slate-50"
                disabled={modalLoading}
              >
                {UI.CANCEL}
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="rounded-2xl bg-red-600 py-3 text-sm font-medium text-white active:bg-red-700 disabled:opacity-50"
                disabled={modalLoading}
              >
                {UI.DELETE_PERSON}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
