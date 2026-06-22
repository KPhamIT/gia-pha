"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { useAuthStore } from "@/store/authStore";
import TreeFilters from "@/components/family-tree/graph/TreeFilters";
import AppNavFab from "@/components/navigation/AppNavFab";
import FamilyTreeStatus from "@/components/family-tree/graph/FamilyTreeStatus";
import { useFamilyTree } from "@/hooks/useFamilyTree";
import { useRequireOrgAccess } from "@/hooks/useRequireOrgAccess";
import { useUserBranch } from "@/hooks/useUserBranch";
import { useLayoutConfig } from "@/hooks/useLayoutConfig";
import { filterTreeData } from "@/utils/filter-tree-data";
import type { BranchValue } from "@/lib/constants/branches";
import { useTheme } from "@/hooks/useTheme";
import type { NodePositionOverrides } from "@/lib/family-tree/node-position-overrides";
import type { FamilyTreeGraphApi } from "@/hooks/useFamilyTreeGraph";
import NotificationOptInBanner from "@/components/notifications/NotificationOptInBanner";
import { getPageShellClass } from "@/utils/theme";
import { UI } from "@/lib/constants/ui-strings";
import { useTreeSettingsSync } from "./useTreeSettingsSync";
import { usePersonSheets } from "./usePersonSheets";
import FamilyTreeSheets from "./FamilyTreeSheets";
import TreeTopBar from "./TreeTopBar";

const FamilyTreeGraph = dynamic(
  () => import("@/components/family-tree/graph/FamilyTreeGraph"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-sm text-slate-500">
        {UI.LOADING}
      </div>
    ),
  },
);

export default function FamilyTreePage() {
  const { requireFeature, canUseFeature, isSystem } = useFeatureAccess();
  const refreshAuth = useAuthStore((state) => state.refresh);
  const { ready: orgReady } = useRequireOrgAccess();
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
  } = useFamilyTree({ enabled: orgReady });
  const { theme, setTheme } = useTheme();
  const { layoutConfig, setLayoutConfig } = useLayoutConfig();
  const {
    branch: userBranch,
    setBranch: setUserBranch,
    hydrated: branchHydrated,
  } = useUserBranch();

  const { handleSaveSettings, savingSettings, settingsSaveError, saveSuccess } =
    useTreeSettingsSync({
      theme,
      layoutConfig,
      setTheme,
      setLayoutConfig,
      requireFeature,
    });
  const sheets = usePersonSheets({
    treeData,
    requireFeature,
    addPerson,
    removePerson,
    updatePerson,
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [exportPositionOverrides, setExportPositionOverrides] = useState<
    NodePositionOverrides | undefined
  >();
  const graphApiRef = useRef<FamilyTreeGraphApi | null>(null);
  const [centerTreeKey, setCenterTreeKey] = useState(0);
  const [filterBranch, setFilterBranch] = useState<number | "all" | null>(null);
  const [maxGeneration, setMaxGeneration] = useState<number | "all">(4);

  useEffect(() => {
    void refreshAuth();
  }, [refreshAuth]);

  const handleOpenExport = useCallback(() => {
    const moved = graphApiRef.current?.collectMovedNodePositions() ?? {};
    setExportPositionOverrides(
      Object.keys(moved).length > 0 ? moved : undefined,
    );
    setShowExport(true);
  }, []);
  const handleCloseExport = useCallback(() => {
    setShowExport(false);
    setExportPositionOverrides(undefined);
  }, []);
  const handleSelectBranch = useCallback(
    (branch: BranchValue) => setUserBranch(branch),
    [setUserBranch],
  );

  // The on-page branch filter follows the user's saved branch until they override it.
  const effectiveBranch = filterBranch ?? userBranch ?? "all";

  // Re-fit the viewport whenever the visible subset of the tree changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCenterTreeKey((key) => key + 1);
  }, [effectiveBranch, maxGeneration]);

  const filteredTreeData = useMemo(
    () =>
      treeData
        ? filterTreeData(treeData, { branch: effectiveBranch, maxGeneration })
        : null,
    [treeData, effectiveBranch, maxGeneration],
  );

  if (!orgReady || (loading && !treeData)) {
    return <FamilyTreeStatus theme={theme} type="loading" />;
  }
  if (error && !treeData) {
    return (
      <FamilyTreeStatus
        theme={theme}
        type="error"
        message={error}
        onRetry={reload}
      />
    );
  }
  if (!loading && !treeData) {
    return <FamilyTreeStatus theme={theme} type="empty" />;
  }

  return (
    <div
      className={`min-h-screen overflow-x-hidden ${getPageShellClass(theme)}`}
    >
      <TreeTopBar
        isSystem={isSystem}
        onOpenSettings={() => setShowSettings(true)}
      />

      <TreeFilters
        branch={effectiveBranch}
        maxGeneration={maxGeneration}
        onBranchChange={setFilterBranch}
        onMaxGenerationChange={setMaxGeneration}
      />

      <NotificationOptInBanner />

      {treeData ? (
        <div className="h-dvh overflow-hidden">
          <FamilyTreeGraph
            treeData={filteredTreeData ?? treeData}
            layoutConfig={layoutConfig}
            graphApiRef={graphApiRef}
            selectedNodeId={sheets.selectedPersonId}
            focusNodeId={sheets.focusNodeId}
            centerTreeKey={centerTreeKey}
            onNodeClick={sheets.handleNodeClick}
            onPersonAdded={addPerson}
            onRelationshipAdded={addRelationship}
            onRelationshipRemoved={removeRelationship}
            assertCanMutate={() => requireFeature("editTree")}
            theme={theme}
          />
        </div>
      ) : (
        <FamilyTreeStatus theme={theme} type="loading" />
      )}

      {treeData ? (
        <AppNavFab
          treeActions={{
            onAddPerson: sheets.openAddPerson,
            onSearch: sheets.openSearch,
            onCenterTree: () => setCenterTreeKey((k) => k + 1),
            onOpenExport: handleOpenExport,
          }}
        />
      ) : null}

      {treeData ? (
        <FamilyTreeSheets
          sheets={sheets}
          canEdit={canUseFeature("editTree")}
          treeData={treeData}
          showSettings={showSettings}
          layoutConfig={layoutConfig}
          setLayoutConfig={setLayoutConfig}
          theme={theme}
          setTheme={setTheme}
          onCloseSettings={() => setShowSettings(false)}
          onSaveSettings={handleSaveSettings}
          savingSettings={savingSettings}
          saveSuccess={saveSuccess}
          settingsSaveError={settingsSaveError}
          showExport={showExport}
          exportTreeData={filteredTreeData ?? treeData}
          exportPositionOverrides={exportPositionOverrides}
          onCloseExport={handleCloseExport}
          showWelcome={branchHydrated && userBranch == null}
          onSelectBranch={handleSelectBranch}
        />
      ) : null}
    </div>
  );
}
