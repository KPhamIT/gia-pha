"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FamilyTreeData } from "@/components/types/family-tree-types";
import { DEFAULT_EDGE_COLOR, type FamilyTreeLayoutConfig } from "@/components/family-tree/graph/layout";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { api } from "@/lib/api";
import type { ExportEligibility } from "@/lib/api/modules/billing";
import { BILLING_ENABLED } from "@/lib/constants/billing";
import { UI } from "@/lib/constants/ui-strings";
import {
  backgroundImageLayout,
  buildEmbeddedFontFace,
  buildExportModel,
  computeExportGeometry,
  defaultExportTextBox,
  defaultExportTextFontSize,
  downloadSvgElement,
  EXPORT_A0_HEIGHT_MM,
  EXPORT_A0_WIDTH_MM,
  resolveExportLayout,
} from "@/lib/family-tree/export-tree-svg";
import {
  ensureCalligraphyFontLoaded,
  getCalligraphyFontDef,
  loadCalligraphyFont,
} from "@/components/family-tree/book/calligraphy-font-loader";
import { getCalligraphyFont } from "@/components/family-tree/book/calligraphy-fonts";
import { balanceCouplets } from "@/lib/family-tree/export-couplet-balance";
import {
  EXPORT_NORMAL_FONT_ID,
  getExportTextFontEmbed,
  isCalligraphyFontId,
} from "@/components/family-tree/book/calligraphy-fonts";
import type { NodePositionOverrides } from "@/lib/family-tree/node-position-overrides";
import { computeAutoTreeFit, exportFitKey, clampUserTreeZoom, resolveTreeTransform } from "@/lib/family-tree/export-tree-transform";
import {
  bringLayerForward,
  createLayerId,
  nextLayerOrder,
  sendLayerBackward,
  type ExportDecorationLayer,
  type ExportLayerTier,
} from "@/lib/family-tree/export-decoration-layers";
import type { SystemAsset } from "@/lib/family-tree/export-system-assets";
import {
  defaultTreeExportSettings,
  hasSavedTreeExportSettings,
  loadTreeExportSettings,
  normalizeTreeExportSettings,
  saveTreeExportSettings,
  type ExportCoupletCfg,
  type ExportImageCfg,
  type ExportBox,
  type TreeExportSettings,
} from "@/lib/family-tree/tree-export-settings";
import type { CoupletKey, ImageKey } from "./tree-export-control-bits";
import { isCoupletId } from "./tree-export-svg-utils";
import { useExportAssets } from "./useExportAssets";
import { useExportClanTitle } from "./useExportClanTitle";
import { getTreeBorderStyle } from "@/lib/family-tree/svg-border";
import { exportLayoutConfig } from "@/lib/family-tree/export-layout-config";
import {
  applyTreeExportTheme,
  getTreeExportTheme,
} from "@/lib/family-tree/tree-export-themes";

type Args = {
  treeData: FamilyTreeData;
  layoutConfig?: FamilyTreeLayoutConfig;
  nodePositionOverrides?: NodePositionOverrides;
  canDownloadExport: boolean;
  organizationId?: number | null;
};

export function useTreeExport({
  treeData,
  layoutConfig = {},
  nodePositionOverrides,
  canDownloadExport,
  organizationId,
}: Args) {
  const { requireAdmin } = useFeatureAccess();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const lastFitKeyRef = useRef<string | null>(null);
  const [settings, setSettings] = useState<TreeExportSettings>(() => {
    const loaded = loadTreeExportSettings();
    // Người dùng mới: áp trọn kiểu mặc định (viền, câu đối, lề) thay vì chỉ màu mặc định.
    const theme = hasSavedTreeExportSettings() ? null : getTreeExportTheme(loaded.themeId);
    return theme ? applyTreeExportTheme(theme, loaded) : loaded;
  });
  const layerUrls = useMemo(
    () =>
      settings.layers
        .filter((layer) => layer.type === "image")
        .map((layer) => layer.assetUrl),
    [settings.layers],
  );
  const { presets, assetsReady, layerImageHrefs, systemAssets, refreshSystemAssets } =
    useExportAssets(layerUrls);
  const layerImageHrefsById = useMemo(() => {
    const map: Record<string, string> = {};
    for (const layer of settings.layers) {
      if (layer.type === "image") {
        map[layer.id] = layerImageHrefs[layer.assetUrl] ?? layer.assetUrl;
      }
    }
    return map;
  }, [settings.layers, layerImageHrefs]);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);
  const [paywall, setPaywall] = useState<{
    nodeCount: number;
    eligibility: Extract<ExportEligibility, { allowed: false }>;
  } | null>(null);

  useEffect(() => {
    const { treeUserScale: _z, treeOffsetX: _x, treeOffsetY: _y, ...persisted } =
      settings;
    saveTreeExportSettings({
      ...persisted,
      treeUserScale: 1,
      treeOffsetX: 0,
      treeOffsetY: 0,
    });
  }, [settings]);

  useEffect(() => {
    const normalizedCurrent = normalizeTreeExportSettings(settings);
    const matched = presets.find(
      (preset) =>
        JSON.stringify(normalizeTreeExportSettings(preset.settings)) ===
        JSON.stringify(normalizedCurrent),
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActivePresetId(matched?.id ?? null);
  }, [presets, settings]);

  useEffect(() => {
    ensureCalligraphyFontLoaded(settings.coupletFontId);
    if (settings.title.fontId) ensureCalligraphyFontLoaded(settings.title.fontId);
  }, [settings.coupletFontId, settings.title.fontId]);

  useEffect(() => {
    for (const layer of settings.layers) {
      if (layer.type === "text") {
        ensureCalligraphyFontLoaded(layer.fontId);
      }
    }
  }, [settings.layers]);

  const model = useMemo(
    () =>
      buildExportModel(
        treeData,
        exportLayoutConfig(layoutConfig, settings),
        nodePositionOverrides,
        settings.themeId
          ? {
              nodeBgColor: settings.featuredBgColor,
              nodeTextColor: settings.featuredTextColor,
            }
          : undefined,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      treeData,
      layoutConfig,
      nodePositionOverrides,
      settings.nodeBgColor,
      settings.nodeTextColor,
      settings.featuredBgColor,
      settings.featuredTextColor,
      settings.themeId,
    ],
  );
  const edgeColor =
    settings.edgeColor ?? layoutConfig.edgeColor ?? DEFAULT_EDGE_COLOR;
  const geometry = useMemo(
    () =>
      computeExportGeometry(
        model.bounds,
        settings.headerHeight,
        model.rootCenterX,
      ),
    [model.bounds, settings.headerHeight, model.rootCenterX],
  );
  // Đo chữ câu đối cần font thư pháp đã tải — tính lại khi font sẵn sàng.
  const [coupletFontReady, setCoupletFontReady] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    void loadCalligraphyFont(settings.coupletFontId).then(() => {
      if (alive) setCoupletFontReady(settings.coupletFontId);
    });
    return () => {
      alive = false;
    };
  }, [settings.coupletFontId]);
  const layout = useMemo(
    () =>
      balanceCouplets(
        resolveExportLayout(settings, geometry.headerRect, geometry.borderRect),
        geometry.borderRect,
        getCalligraphyFont(settings.coupletFontId).cssValue,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [settings, geometry.headerRect, geometry.borderRect, coupletFontReady],
  );

  const selectedLayer = useMemo(
    () => settings.layers.find((layer) => layer.id === selectedId) ?? null,
    [settings.layers, selectedId],
  );

  const patch = useCallback(
    (p: Partial<TreeExportSettings>) =>
      setSettings((prev) => ({ ...prev, ...p })),
    [],
  );

  const borderBand = Math.max(
    getTreeBorderStyle(settings.borderStyleId).band ?? 0,
    settings.treeBottomInset ?? 0,
  );
  const fitKey = useMemo(
    () =>
      exportFitKey(model, settings.headerHeight, settings.treeSideInset, borderBand),
    [model.bounds, model.rootCenterX, settings.headerHeight, settings.treeSideInset, borderBand],
  );

  const autoFit = useMemo(
    () =>
      computeAutoTreeFit(
        model,
        geometry,
        settings.headerHeight,
        settings.treeSideInset,
        borderBand,
      ),
    [model, geometry, settings.headerHeight, settings.treeSideInset, borderBand],
  );
  const clanTitle = useExportClanTitle(settings, treeData, layout, geometry);

  const applyTheme = useCallback((themeId: string) => {
    const theme = getTreeExportTheme(themeId);
    if (!theme) return;
    setSelectedId(null);
    setSettings((prev) => applyTreeExportTheme(theme, prev));
  }, []);

  const treeTransform = useMemo(
    () =>
      resolveTreeTransform(
        autoFit,
        settings.treeOffsetX ?? 0,
        settings.treeOffsetY ?? 0,
        settings.treeUserScale ?? 1,
      ),
    [
      autoFit,
      settings.treeOffsetX,
      settings.treeOffsetY,
      settings.treeUserScale,
    ],
  );

  useEffect(() => {
    if (lastFitKeyRef.current === fitKey) return;
    lastFitKeyRef.current = fitKey;
    patch({ treeUserScale: 1, treeOffsetX: 0, treeOffsetY: 0 });
  }, [fitKey, patch]);

  const fitTreeToPage = useCallback(() => {
    patch({ treeUserScale: 1, treeOffsetX: 0, treeOffsetY: 0 });
    lastFitKeyRef.current = fitKey;
  }, [fitKey, patch]);

  const zoomTreeBy = useCallback((factor: number) => {
    setSettings((prev) => ({
      ...prev,
      treeUserScale: clampUserTreeZoom(
        (prev.treeUserScale ?? 1) * factor,
      ),
    }));
  }, []);

  const patchLayers = useCallback(
    (updater: (layers: ExportDecorationLayer[]) => ExportDecorationLayer[]) =>
      setSettings((prev) => ({ ...prev, layers: updater(prev.layers) })),
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
        [key]: { ...prev[key], ...p },
      })),
    [],
  );

  const patchLayerById = useCallback(
    (id: string, patchValue: Partial<ExportDecorationLayer>) =>
      patchLayers((layers) =>
        layers.map((layer) =>
          layer.id === id
            ? ({ ...layer, ...patchValue } as ExportDecorationLayer)
            : layer,
        ),
      ),
    [patchLayers],
  );

  const patchLayer = useCallback(
    (patchValue: Partial<ExportDecorationLayer>) => {
      if (!selectedId) return;
      const layer = settings.layers.find((item) => item.id === selectedId);
      if (
        layer?.type === "image" &&
        patchValue.tier === "behind-tree"
      ) {
        const layout = backgroundImageLayout(geometry.borderRect);
        patchLayerById(selectedId, { ...patchValue, ...layout });
        return;
      }
      patchLayerById(selectedId, patchValue);
    },
    [geometry.borderRect, patchLayerById, selectedId, settings.layers],
  );

  const handleItemChange = useCallback(
    (id: string, p: Partial<ExportBox>) => {
      if (isCoupletId(id)) {
        patchCouplet(id, p);
        return;
      }
      const layer = settings.layers.find((item) => item.id === id);
      if (layer?.locked) return;
      patchLayerById(id, p as Partial<ExportDecorationLayer>);
    },
    [patchCouplet, patchLayerById, settings.layers],
  );

  const addImageFromAsset = useCallback(
    (asset: SystemAsset) => {
      const aspect =
        asset.aspectRatio ??
        (asset.width && asset.height ? asset.width / asset.height : 1);
      const isBackground = asset.category === "background";
      const tier: ExportLayerTier = isBackground ? "behind-tree" : "above-tree";
      const frame = isBackground
        ? backgroundImageLayout(geometry.borderRect)
        : null;
      const width = frame?.width ?? Math.min(geometry.headerRect.width * 0.35, 520);
      const height = frame?.height ?? width / aspect;
      const x =
        frame?.x ??
        geometry.headerRect.x + geometry.headerRect.width / 2 - width / 2;
      const y = frame?.y ?? geometry.headerRect.y + geometry.headerRect.height * 0.2;
      const layer: ExportDecorationLayer = {
        id: createLayerId(),
        type: "image",
        tier,
        order: nextLayerOrder(settings.layers, tier),
        x,
        y,
        width,
        height,
        assetUrl: asset.url,
        assetKey: asset.key,
        assetDbId: asset.dbId > 0 ? asset.dbId : undefined,
        assetProvider: asset.provider,
        name: asset.name,
        aspectRatio: aspect,
        locked: isBackground,
      };
      patchLayers((layers) => [...layers, layer]);
      setSelectedId(layer.id);
      setLibraryOpen(false);
    },
    [geometry.borderRect, geometry.headerRect, patchLayers, settings.layers],
  );

  const addTextLayer = useCallback(() => {
    const tier: ExportLayerTier = "above-text";
    const { headerRect } = geometry;
    const fontSize = defaultExportTextFontSize(headerRect.height);
    const box = defaultExportTextBox(headerRect);
    const layer: ExportDecorationLayer = {
      id: createLayerId(),
      type: "text",
      tier,
      order: nextLayerOrder(settings.layers, tier),
      x: headerRect.x + headerRect.width / 2,
      y: headerRect.y + headerRect.height * 0.45,
      width: box.width,
      height: box.height,
      text: "Nhập chữ",
      fontId: EXPORT_NORMAL_FONT_ID,
      color: settings.coupletColor,
      fontSize,
      bold: false,
      vertical: false,
      textCurve: 0,
      textRotation: 0,
      locked: false,
    };
    patchLayers((layers) => [...layers, layer]);
    setSelectedId(layer.id);
  }, [
    geometry.headerRect,
    patchLayers,
    settings.coupletColor,
    settings.layers,
  ]);

  const deleteSelectedLayer = useCallback(() => {
    if (!selectedId || isCoupletId(selectedId)) return;
    patchLayers((layers) => layers.filter((layer) => layer.id !== selectedId));
    setSelectedId(null);
    setContextMenu(null);
  }, [patchLayers, selectedId]);

  const bringSelectedForward = useCallback(() => {
    if (!selectedId || isCoupletId(selectedId)) return;
    patchLayers((layers) => bringLayerForward(layers, selectedId));
    setContextMenu(null);
  }, [patchLayers, selectedId]);

  const sendSelectedBackward = useCallback(() => {
    if (!selectedId || isCoupletId(selectedId)) return;
    patchLayers((layers) => sendLayerBackward(layers, selectedId));
    setContextMenu(null);
  }, [patchLayers, selectedId]);

  const openLayerContextMenu = useCallback(
    (id: string, clientX: number, clientY: number) => {
      if (isCoupletId(id)) return;
      setSelectedId(id);
      setContextMenu({ id, x: clientX, y: clientY });
    },
    [],
  );

  const handleReset = useCallback(() => {
    if (window.confirm(UI.EXPORT_RESET_CONFIRM)) {
      const fallback = getTreeExportTheme(defaultTreeExportSettings().themeId);
      setSettings((prev) =>
        fallback ? applyTreeExportTheme(fallback, prev) : defaultTreeExportSettings(),
      );
      setSelectedId(null);
      setContextMenu(null);
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
    const billingActive = BILLING_ENABLED;
    if (!billingActive && !canDownloadExport) {
      requireAdmin();
      return;
    }

    const nodeCount = model.nodes.length;
    if (billingActive && organizationId) {
      try {
        const eligibility = await api.billing.getExportEligibility(
          organizationId,
          nodeCount,
        );
        if (!eligibility.allowed) {
          setPaywall({ nodeCount, eligibility });
          return;
        }
      } catch {
        setPaywall({
          nodeCount,
          eligibility: {
            allowed: false,
            reason: "NO_SUBSCRIPTION",
            nodeCount,
          },
        });
        return;
      }
    } else if (billingActive && !organizationId) {
      requireAdmin();
      return;
    }

    const svg = svgRef.current;
    if (!svg) return;
    setExporting(true);
    setSelectedId(null);
    setContextMenu(null);

    const embedFonts = new Map<string, string>();

    for (const fontId of [settings.coupletFontId, settings.title.fontId]) {
      if (!isCalligraphyFontId(fontId)) continue;
      const def = getCalligraphyFontDef(fontId);
      embedFonts.set(def.family, def.file);
    }

    for (const layer of settings.layers) {
      if (layer.type !== "text") continue;
      const exportEmbed = getExportTextFontEmbed(layer.fontId);
      if (exportEmbed) {
        embedFonts.set(exportEmbed.family, exportEmbed.file);
        continue;
      }
      if (isCalligraphyFontId(layer.fontId)) {
        const legacyDef = getCalligraphyFontDef(layer.fontId);
        embedFonts.set(legacyDef.family, legacyDef.file);
      }
    }

    const fontFaces = await Promise.all(
      [...embedFonts.entries()].map(async ([family, file]) =>
        buildEmbeddedFontFace(family, file),
      ),
    );

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        try {
          // Giữ nguyên transform trên DOM (zoom/pan người dùng) — WYSIWYG.
          downloadSvgElement(
            svg,
            geometry.canvasWidth,
            geometry.canvasHeight,
            "gia-pha.svg",
            fontFaces.join("\n"),
            {
              width: `${EXPORT_A0_WIDTH_MM}mm`,
              height: `${EXPORT_A0_HEIGHT_MM}mm`,
            },
          );
        } finally {
          setExporting(false);
        }
      });
    });
  }, [
    canDownloadExport,
    organizationId,
    geometry,
    model,
    settings.headerHeight,
    requireAdmin,
    settings.coupletFontId,
    settings.title.fontId,
    settings.layers,
  ]);

  return {
    svgRef,
    treeTransform,
    edgeColor,
    clanTitle,
    applyTheme,
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
    layerImageHrefs: layerImageHrefsById,
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
    dismissPaywall: () => setPaywall(null),
  };
}
