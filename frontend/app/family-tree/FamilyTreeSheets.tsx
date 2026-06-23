"use client";

import dynamic from "next/dynamic";
import { type Dispatch, type SetStateAction } from "react";
import AuthRequiredSheet from "@/components/auth/AuthRequiredSheet";
import WelcomeBranchSheet from "@/components/family-tree/graph/WelcomeBranchSheet";
import PersonDetailSheet from "@/components/family-tree/person/PersonDetailSheet";
import EditPersonSheet from "@/components/family-tree/person/EditPersonSheet";
import AddChildSheet from "@/components/family-tree/person/AddChildSheet";
import AddPersonSheet from "@/components/family-tree/person/AddPersonSheet";
import DeletePersonSheet from "@/components/family-tree/person/DeletePersonSheet";
import SearchSheet from "@/components/family-tree/person/SearchSheet";
import FamilyTreeSettings from "@/components/family-tree/settings/FamilyTreeSettings";
import type {
  FamilyTreeData,
  LayoutConfig,
  ThemeMode,
} from "@/components/types/family-tree-types";
import type { NodePositionOverrides } from "@/lib/family-tree/node-position-overrides";
import type { BranchValue } from "@/lib/constants/branches";
import type { usePersonSheets } from "./usePersonSheets";

const TreeExportView = dynamic(
  () => import("@/components/family-tree/export/TreeExportView"),
  { ssr: false },
);

type Props = {
  sheets: ReturnType<typeof usePersonSheets>;
  canEdit: boolean;
  treeData: FamilyTreeData;
  // Settings
  showSettings: boolean;
  layoutConfig: LayoutConfig;
  setLayoutConfig: Dispatch<SetStateAction<LayoutConfig>>;
  theme: ThemeMode;
  setTheme: Dispatch<SetStateAction<ThemeMode>>;
  onCloseSettings: () => void;
  onSaveSettings: () => void;
  savingSettings: boolean;
  saveSuccess: boolean;
  settingsSaveError: string | null;
  // Export
  showExport: boolean;
  exportTreeData: FamilyTreeData | null;
  exportPositionOverrides?: NodePositionOverrides;
  onCloseExport: () => void;
  canDownloadExport: boolean;
  // Branch welcome
  showWelcome: boolean;
  onSelectBranch: (branch: BranchValue) => void;
};

export default function FamilyTreeSheets({
  sheets,
  canEdit,
  treeData,
  ...p
}: Props) {
  return (
    <>
      {p.showSettings ? (
        <FamilyTreeSettings
          layoutConfig={p.layoutConfig}
          setLayoutConfig={p.setLayoutConfig}
          theme={p.theme}
          setTheme={p.setTheme}
          onClose={p.onCloseSettings}
          onSave={p.onSaveSettings}
          saving={p.savingSettings}
          saveSuccess={p.saveSuccess}
          saveError={p.settingsSaveError}
        />
      ) : null}

      {p.showExport && p.exportTreeData ? (
        <TreeExportView
          treeData={p.exportTreeData}
          layoutConfig={p.layoutConfig}
          nodePositionOverrides={p.exportPositionOverrides}
          onClose={p.onCloseExport}
          canDownloadExport={p.canDownloadExport}
        />
      ) : null}

      {p.showWelcome ? (
        <WelcomeBranchSheet onSelect={p.onSelectBranch} />
      ) : null}

      {sheets.showSearch ? (
        <SearchSheet
          persons={treeData.persons}
          relationships={treeData.relationships}
          onClose={sheets.closeSearch}
          onSelect={sheets.handleSearchSelect}
        />
      ) : null}

      {sheets.viewMode === "detail" && sheets.selectedPersonId != null ? (
        <PersonDetailSheet
          detail={sheets.detail}
          loading={sheets.detailLoading}
          error={sheets.detailError}
          onClose={sheets.closeAllSheets}
          onEdit={sheets.openEdit}
          onAddChild={sheets.openAddChild}
          onDelete={sheets.openDeleteConfirm}
          canEdit={canEdit}
          onSelectPerson={sheets.handleSelectPerson}
        />
      ) : null}

      {sheets.viewMode === "edit" && sheets.selectedPersonId != null ? (
        <EditPersonSheet
          detail={sheets.detail}
          loading={sheets.detailLoading}
          saving={sheets.actionLoading}
          onClose={sheets.backToDetail}
          onSave={sheets.handleSavePerson}
        />
      ) : null}

      {sheets.viewMode === "addChild" && sheets.selectedNode ? (
        <AddChildSheet
          parent={sheets.selectedNode}
          onClose={sheets.backToDetail}
          onCreateChild={sheets.handleCreateChild}
          loading={sheets.modalLoading}
        />
      ) : null}

      {sheets.viewMode === "addPerson" ? (
        <AddPersonSheet
          onClose={sheets.closeAddPerson}
          onSubmit={sheets.handleAddStandalonePerson}
          loading={sheets.actionLoading}
        />
      ) : null}

      {sheets.viewMode === "deleteConfirm" && sheets.selectedNode ? (
        <DeletePersonSheet
          person={sheets.selectedNode}
          loading={sheets.modalLoading}
          onClose={sheets.backToDetail}
          onConfirm={sheets.handleDeleteConfirm}
        />
      ) : null}

      <AuthRequiredSheet />
    </>
  );
}
