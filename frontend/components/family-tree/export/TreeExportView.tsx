'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FamilyTreeData } from '@/components/types/family-tree-types';
import type { FamilyTreeLayoutConfig } from '@/components/family-tree/graph/layout';
import { UI } from '@/lib/constants/ui-strings';
import {
  buildEmbeddedFontFace,
  buildExportModel,
  computeExportGeometry,
  downloadSvgElement,
  EXPORT_IMAGE_SOURCES,
  fetchImageAsDataUri,
  resolveExportLayout,
  type ExportImageKey,
} from '@/lib/family-tree/export-tree-svg';
import { ensureCalligraphyFontLoaded, getCalligraphyFontDef } from '@/components/family-tree/book/calligraphy-font-loader';
import {
  defaultTreeExportSettings,
  loadTreeExportSettings,
  saveTreeExportSettings,
  type ExportCoupletCfg,
  type ExportImageCfg,
  type TreeExportSettings,
} from '@/lib/family-tree/tree-export-settings';
import TreeExportControls from './TreeExportControls';
import TreeExportSvg, { type DraggableId } from './TreeExportSvg';

type ImageKey = 'scroll' | 'dragonLeft' | 'dragonRight';
type CoupletKey = 'coupletLeft' | 'coupletRight';

type TreeExportViewProps = {
  treeData: FamilyTreeData;
  layoutConfig?: FamilyTreeLayoutConfig;
  onClose: () => void;
};

export default function TreeExportView({ treeData, layoutConfig = {}, onClose }: TreeExportViewProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [settings, setSettings] = useState<TreeExportSettings>(loadTreeExportSettings);
  const [selectedId, setSelectedId] = useState<DraggableId | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [dataUris, setDataUris] = useState<Record<ExportImageKey, string> | null>(null);

  useEffect(() => {
    saveTreeExportSettings(settings);
  }, [settings]);

  // Load the calligraphy font so the live preview renders the couplets correctly.
  useEffect(() => {
    ensureCalligraphyFontLoaded(settings.coupletFontId);
  }, [settings.coupletFontId]);

  // Inline the decorative PNGs as data URIs so the exported SVG is self-contained.
  useEffect(() => {
    let cancelled = false;
    const keys = Object.keys(EXPORT_IMAGE_SOURCES) as ExportImageKey[];
    Promise.all(keys.map((key) => fetchImageAsDataUri(EXPORT_IMAGE_SOURCES[key])))
      .then((uris) => {
        if (cancelled) return;
        const map = {} as Record<ExportImageKey, string>;
        keys.forEach((key, i) => (map[key] = uris[i]));
        setDataUris(map);
      })
      .catch(() => {
        /* fall back to public URLs (preview still works, export inlines on retry) */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const model = useMemo(() => buildExportModel(treeData, layoutConfig), [treeData, layoutConfig]);
  const geometry = useMemo(
    () => computeExportGeometry(model.bounds, settings.headerHeight, model.rootCenterX),
    [model.bounds, settings.headerHeight, model.rootCenterX],
  );
  const layout = useMemo(() => resolveExportLayout(settings, geometry.headerRect), [settings, geometry.headerRect]);

  const imageSources = dataUris ?? EXPORT_IMAGE_SOURCES;

  const patch = useCallback((p: Partial<TreeExportSettings>) => setSettings((prev) => ({ ...prev, ...p })), []);
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
          key === 'coupletRight'
            ? { ...prev[key], ...p, x: null }
            : { ...prev[key], ...p },
      })),
    [],
  );

  const handleItemChange = useCallback(
    (id: DraggableId, p: Partial<ExportImageCfg & ExportCoupletCfg>) => {
      if (id === 'coupletLeft' || id === 'coupletRight') patchCouplet(id, p);
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

  const handleExport = useCallback(async () => {
    const svg = svgRef.current;
    if (!svg) return;
    setExporting(true);
    setSelectedId(null);

    // Embed the calligraphy font so the standalone SVG renders the couplets.
    const fontDef = getCalligraphyFontDef(settings.coupletFontId);
    const fontFaceCss = await buildEmbeddedFontFace(fontDef.family, fontDef.file);

    // Defer so the deselect re-render removes selection handles before serializing.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        try {
          downloadSvgElement(svg, geometry.canvasWidth, geometry.canvasHeight, 'gia-pha.svg', fontFaceCss);
        } finally {
          setExporting(false);
        }
      });
    });
  }, [geometry.canvasWidth, geometry.canvasHeight, settings.coupletFontId]);

  return (
    <div className="overlay-viewport z-40 bg-slate-300">
      <div
        className={`absolute inset-0 flex items-center justify-center p-2 md:p-4 md:pr-[22rem] md:pb-4 ${
          collapsed ? 'pb-36' : 'pb-[calc(55vh+1.5rem)]'
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
        collapsed={collapsed}
        exporting={exporting}
        assetsReady={dataUris !== null}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        onPatch={patch}
        onPatchImage={patchImage}
        onPatchCouplet={patchCouplet}
        onReset={handleReset}
        onClose={onClose}
        onExport={handleExport}
      />
    </div>
  );
}
