"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FamilyTreeData } from "@/components/types/family-tree-types";
import type { FamilyTreeLayoutConfig } from "@/components/family-tree/graph/layout";
import { UI } from "@/lib/constants/ui-strings";
import {
  buildEmbeddedFontFace,
  buildExportModel,
  computeExportGeometry,
  downloadSvgElement,
  resolveExportLayout,
} from "@/lib/family-tree/export-tree-svg";
import {
  ensureCalligraphyFontLoaded,
  getCalligraphyFontDef,
} from "@/components/family-tree/book/calligraphy-font-loader";
import type { NodePositionOverrides } from "@/lib/family-tree/node-position-overrides";
import {
  defaultTreeExportSettings,
  loadTreeExportSettings,
  normalizeTreeExportSettings,
  saveTreeExportSettings,
  type ExportCoupletCfg,
  type ExportImageCfg,
  type TreeExportSettings,
} from "@/lib/family-tree/tree-export-settings";
import type { CoupletKey, ImageKey } from "./tree-export-control-bits";
import type { DraggableId } from "./tree-export-svg-utils";
import { useExportAssets } from "./useExportAssets";

type Args = {
  treeData: FamilyTreeData;
  layoutConfig?: FamilyTreeLayoutConfig;
  nodePositionOverrides?: NodePositionOverrides;
};

export function useTreeExport({
  treeData,
  layoutConfig = {},
  nodePositionOverrides,
}: Args) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { presets, dataUris, imageSources } = useExportAssets();
  const [settings, setSettings] = useState<TreeExportSettings>(
    loadTreeExportSettings,
  );
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<DraggableId | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    saveTreeExportSettings(settings);
  }, [settings]);

  useEffect(() => {
    const normalizedCurrent = normalizeTreeExportSettings(settings);
    const matched = presets.find(
      (preset) =>
        JSON.stringify(normalizeTreeExportSettings(preset.settings)) ===
        JSON.stringify(normalizedCurrent),
    );
    // Sync preset selection from settings; can't be a useMemo because the user
    // may explicitly pick "Custom" (null) even when settings match a preset.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActivePresetId(matched?.id ?? null);
  }, [presets, settings]);

  // Load the calligraphy font so the live preview renders the couplets correctly.
  useEffect(() => {
    ensureCalligraphyFontLoaded(settings.coupletFontId);
  }, [settings.coupletFontId]);

  const model = useMemo(
    () => buildExportModel(treeData, layoutConfig, nodePositionOverrides),
    [treeData, layoutConfig, nodePositionOverrides],
  );
  const geometry = useMemo(
    () =>
      computeExportGeometry(
        model.bounds,
        settings.headerHeight,
        model.rootCenterX,
      ),
    [model.bounds, settings.headerHeight, model.rootCenterX],
  );
  const layout = useMemo(
    () => resolveExportLayout(settings, geometry.headerRect),
    [settings, geometry.headerRect],
  );

  const patch = useCallback(
    (p: Partial<TreeExportSettings>) =>
      setSettings((prev) => ({ ...prev, ...p })),
    [],
  );
  const patchImage = useCallback(
    (key: ImageKey, p: Partial<ExportImageCfg>) =>
      setSettings((prev) => ({ ...prev, [key]: { ...prev[key], ...p } })),
    [],
  );
  const patchCouplet = useCallback(
    (key: CoupletKey, p: Partial<ExportCoupletCfg>) =>
      setSettings((prev) => ({
        ...prev,
        [key]:
          key === "coupletRight"
            ? { ...prev[key], ...p, x: null }
            : { ...prev[key], ...p },
      })),
    [],
  );

  const handleItemChange = useCallback(
    (id: DraggableId, p: Partial<ExportImageCfg & ExportCoupletCfg>) => {
      if (id === "coupletLeft" || id === "coupletRight") patchCouplet(id, p);
      else patchImage(id, p);
    },
    [patchCouplet, patchImage],
  );

  const handleReset = useCallback(() => {
    if (window.confirm(UI.EXPORT_RESET_CONFIRM)) {
      setSettings(defaultTreeExportSettings());
      setSelectedId(null);
    }
  }, []);

  const handleApplyPreset = useCallback(
    (presetId: string | null) => {
      if (!presetId) {
        setActivePresetId(null);
        return;
      }
      const preset = presets.find((item) => item.id === presetId);
      if (!preset) return;
      setSettings(normalizeTreeExportSettings(preset.settings));
      setSelectedId(null);
      setActivePresetId(preset.id);
    },
    [presets],
  );

  const handleExport = useCallback(async () => {
    const svg = svgRef.current;
    if (!svg) return;
    setExporting(true);
    setSelectedId(null);

    // Embed the calligraphy font so the standalone SVG renders the couplets.
    const fontDef = getCalligraphyFontDef(settings.coupletFontId);
    const fontFaceCss = await buildEmbeddedFontFace(
      fontDef.family,
      fontDef.file,
    );

    // Defer so the deselect re-render removes selection handles before serializing.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        try {
          downloadSvgElement(
            svg,
            geometry.canvasWidth,
            geometry.canvasHeight,
            "gia-pha.svg",
            fontFaceCss,
          );
        } finally {
          setExporting(false);
        }
      });
    });
  }, [geometry.canvasWidth, geometry.canvasHeight, settings.coupletFontId]);

  return {
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
  };
}
