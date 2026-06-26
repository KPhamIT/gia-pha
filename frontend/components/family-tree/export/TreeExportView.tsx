"use client";

import type { FamilyTreeData } from "@/components/types/family-tree-types";
import type { FamilyTreeLayoutConfig } from "@/components/family-tree/graph/layout";
import type { NodePositionOverrides } from "@/lib/family-tree/node-position-overrides";
import ExportAssetLibraryModal from "./ExportAssetLibraryModal";
import ExportLayerContextMenu from "./ExportLayerContextMenu";
import ExportLayerToolbar from "./ExportLayerToolbar";
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
  const exportState = useTreeExport({
    treeData,
    layoutConfig,
    nodePositionOverrides,
    canDownloadExport,
  });
  const {
    svgRef,
    model,
    geometry,
    layout,
    settings,
    presets,
    activePresetId,
    selectedId,
    selectedLayer,
    collapsed,
    exporting,
    assetsReady,
    layerImageHrefs,
    systemAssets,
    refreshSystemAssets,
    libraryOpen,
    contextMenu,
    setSelectedId,
    setCollapsed,
    setLibraryOpen,
    setContextMenu,
    patch,
    patchImage,
    patchCouplet,
    patchLayer,
    handleItemChange,
    addImageFromAsset,
    addTextLayer,
    deleteSelectedLayer,
    bringSelectedForward,
    sendSelectedBackward,
    openLayerContextMenu,
    handleReset,
    handleApplyPreset,
    handleExport,
  } = exportState;

  return (
    <div className="overlay-viewport z-40 bg-slate-300">
      <div
        className={`absolute inset-0 flex items-center justify-center p-2 md:p-4 md:pr-[22rem] md:pb-4 ${
          collapsed ? "pb-36" : "pb-[calc(55vh+1.5rem)]"
        }`}
      >
        <div className="relative h-full w-full max-w-[min(100%,1400px)]">
          <ExportLayerToolbar
            onAddText={addTextLayer}
            onOpenLibrary={() => setLibraryOpen(true)}
          />
          <TreeExportSvg
            svgRef={svgRef}
            model={model}
            geometry={geometry}
            layout={layout}
            settings={settings}
            layerImageHrefs={layerImageHrefs}
            interactive
            selectedId={selectedId}
            onSelect={setSelectedId}
            onChange={handleItemChange}
            onLayerContextMenu={openLayerContextMenu}
          />
        </div>
      </div>

      <TreeExportControls
        settings={settings}
        presets={presets}
        activePresetId={activePresetId}
        collapsed={collapsed}
        exporting={exporting}
        assetsReady={assetsReady}
        selectedLayer={selectedLayer}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        onPatch={patch}
        onPatchImage={patchImage}
        onPatchCouplet={patchCouplet}
        onPatchLayer={patchLayer}
        onDeleteLayer={deleteSelectedLayer}
        onBringLayerForward={bringSelectedForward}
        onSendLayerBackward={sendSelectedBackward}
        onApplyPreset={handleApplyPreset}
        onReset={handleReset}
        onClose={onClose}
        onExport={handleExport}
        canDownloadExport={canDownloadExport}
      />

      <ExportAssetLibraryModal
        open={libraryOpen}
        assets={systemAssets}
        onClose={() => setLibraryOpen(false)}
        onSelect={addImageFromAsset}
        onAssetsChanged={refreshSystemAssets}
      />

      {contextMenu ? (
        <ExportLayerContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onBringForward={bringSelectedForward}
          onSendBackward={sendSelectedBackward}
          onDelete={deleteSelectedLayer}
          onClose={() => setContextMenu(null)}
        />
      ) : null}
    </div>
  );
}
