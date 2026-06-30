"use client";

import { useRef } from "react";
import type { FamilyTreeData } from "@/components/types/family-tree-types";
import type { FamilyTreeLayoutConfig } from "@/components/family-tree/graph/layout";
import type { NodePositionOverrides } from "@/lib/family-tree/node-position-overrides";
import ExportAssetLibraryModal from "./ExportAssetLibraryModal";
import ExportLayerContextMenu from "./ExportLayerContextMenu";
import ExportLayerToolbar from "./ExportLayerToolbar";
import TreeExportControls from "./TreeExportControls";
import TreeExportSvg from "./TreeExportSvg";
import { useTreeExport } from "./useTreeExport";
import { useExportTreeTransform } from "./useExportTreeTransform";
import ExportPaywallSheet from "@/components/billing/ExportPaywallSheet";
import { BILLING_ENABLED } from "@/lib/constants/billing";

type TreeExportViewProps = {
  treeData: FamilyTreeData;
  layoutConfig?: FamilyTreeLayoutConfig;
  nodePositionOverrides?: NodePositionOverrides;
  onClose: () => void;
  canDownloadExport: boolean;
  organizationId?: number | null;
};

export default function TreeExportView({
  treeData,
  layoutConfig = {},
  nodePositionOverrides,
  onClose,
  canDownloadExport,
  organizationId,
}: TreeExportViewProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const showDownload = BILLING_ENABLED || canDownloadExport;
  const exportState = useTreeExport({
    treeData,
    layoutConfig,
    nodePositionOverrides,
    canDownloadExport: showDownload,
    organizationId,
  });
  const {
    svgRef,
    fitBase,
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
    fitTreeToPage,
    zoomTreeBy,
    paywall,
    dismissPaywall,
  } = exportState;

  const treeZoom = settings.treeUserScale ?? 1;

  const {
    beginPan,
    movePan,
    endPan,
    zoomIn,
    zoomOut,
    resetTreeTransform,
  } = useExportTreeTransform(svgRef, viewportRef, {
    interactive: true,
    settings,
    onPatch: patch,
    onZoomBy: zoomTreeBy,
    onResetTransform: fitTreeToPage,
  });

  return (
    <div className="overlay-viewport z-40 bg-slate-300">
      <div
        className={`absolute inset-0 flex items-center justify-center p-2 md:p-4 md:pr-[22rem] md:pb-4 ${
          collapsed ? "pb-36" : "pb-[calc(55vh+1.5rem)]"
        }`}
      >
        <div
          ref={viewportRef}
          className="relative h-full w-full max-w-[min(100%,1400px)]"
        >
          <ExportLayerToolbar
            onAddText={addTextLayer}
            onOpenLibrary={() => setLibraryOpen(true)}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onResetTree={resetTreeTransform}
            treeScale={treeZoom}
          />
          <TreeExportSvg
            svgRef={svgRef}
            fitBase={fitBase}
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
            beginTreePan={beginPan}
            moveTreePan={movePan}
            endTreePan={endPan}
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
        canDownloadExport={showDownload}
      />

      {paywall && organizationId ? (
        <ExportPaywallSheet
          nodeCount={paywall.nodeCount}
          organizationId={organizationId}
          eligibility={paywall.eligibility}
          onClose={dismissPaywall}
        />
      ) : null}

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
