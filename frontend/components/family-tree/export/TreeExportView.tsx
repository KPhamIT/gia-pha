"use client";

import type { FamilyTreeData } from "@/components/types/family-tree-types";
import type { FamilyTreeLayoutConfig } from "@/components/family-tree/graph/layout";
import type { NodePositionOverrides } from "@/lib/family-tree/node-position-overrides";
import TreeExportControls from "./TreeExportControls";
import TreeExportSvg from "./TreeExportSvg";
import { useTreeExport } from "./useTreeExport";

type TreeExportViewProps = {
  treeData: FamilyTreeData;
  layoutConfig?: FamilyTreeLayoutConfig;
  nodePositionOverrides?: NodePositionOverrides;
  onClose: () => void;
  canDownloadExport: boolean;
};

export default function TreeExportView({
  treeData,
  layoutConfig = {},
  nodePositionOverrides,
  onClose,
  canDownloadExport,
}: TreeExportViewProps) {
  const {
    svgRef,
    model,
    geometry,
    layout,
    settings,
    presets,
    activePresetId,
    selectedId,
    collapsed,
    exporting,
    dataUris,
    imageSources,
    setSelectedId,
    setCollapsed,
    patch,
    patchImage,
    patchCouplet,
    handleItemChange,
    handleReset,
    handleApplyPreset,
    handleExport,
  } = useTreeExport({
    treeData,
    layoutConfig,
    nodePositionOverrides,
    canDownloadExport,
  });

  return (
    <div className="overlay-viewport z-40 bg-slate-300">
      <div
        className={`absolute inset-0 flex items-center justify-center p-2 md:p-4 md:pr-[22rem] md:pb-4 ${
          collapsed ? "pb-36" : "pb-[calc(55vh+1.5rem)]"
        }`}
      >
        <TreeExportSvg
          svgRef={svgRef}
          model={model}
          geometry={geometry}
          layout={layout}
          settings={settings}
          imageSources={imageSources}
          interactive
          selectedId={selectedId}
          onSelect={setSelectedId}
          onChange={handleItemChange}
        />
      </div>

      <TreeExportControls
        settings={settings}
        presets={presets}
        activePresetId={activePresetId}
        collapsed={collapsed}
        exporting={exporting}
        assetsReady={dataUris !== null}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        onPatch={patch}
        onPatchImage={patchImage}
        onPatchCouplet={patchCouplet}
        onApplyPreset={handleApplyPreset}
        onReset={handleReset}
        onClose={onClose}
        onExport={handleExport}
        canDownloadExport={canDownloadExport}
      />
    </div>
  );
}
