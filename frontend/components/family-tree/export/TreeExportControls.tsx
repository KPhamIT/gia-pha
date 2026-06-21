"use client";

import Icon from "@/components/icons/Icon";
import { UI } from "@/lib/constants/ui-strings";
import type {
  ExportCoupletCfg,
  ExportImageCfg,
  TreeExportSettings,
  TreeExportPreset,
} from "@/lib/family-tree/tree-export-settings";
import type { CoupletKey, ImageKey } from "./tree-export-control-bits";
import TreeExportGeneralFields from "./TreeExportGeneralFields";
import TreeExportStyleFields from "./TreeExportStyleFields";

type TreeExportControlsProps = {
  settings: TreeExportSettings;
  presets: TreeExportPreset[];
  activePresetId: string | null;
  collapsed: boolean;
  exporting: boolean;
  assetsReady: boolean;
  onToggleCollapse: () => void;
  onPatch: (patch: Partial<TreeExportSettings>) => void;
  onPatchImage: (key: ImageKey, patch: Partial<ExportImageCfg>) => void;
  onPatchCouplet: (key: CoupletKey, patch: Partial<ExportCoupletCfg>) => void;
  onApplyPreset: (presetId: string | null) => void;
  onReset: () => void;
  onClose: () => void;
  onExport: () => void;
};

export default function TreeExportControls({
  settings,
  presets,
  activePresetId,
  collapsed,
  exporting,
  assetsReady,
  onToggleCollapse,
  onPatch,
  onPatchImage,
  onPatchCouplet,
  onApplyPreset,
  onReset,
  onClose,
  onExport,
}: TreeExportControlsProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:inset-y-0 md:right-4 md:left-auto md:items-center md:px-0 md:py-4">
      <div className="pointer-events-auto flex max-h-[55vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-amber-200/70 bg-white/92 shadow-2xl backdrop-blur-md md:max-h-[92vh] md:w-80">
        <div className="flex shrink-0 items-center justify-between border-b border-amber-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-amber-900">{UI.EXPORT_TITLE}</h2>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onToggleCollapse}
              className="grid h-7 w-7 place-items-center rounded-full text-slate-500 hover:bg-slate-100 active:bg-slate-100"
              aria-label={collapsed ? UI.EXPORT_TITLE : UI.EXPORT_CLOSE}
            >
              <Icon path={collapsed ? "chevronUp" : "chevronDown"} size={16} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="grid h-7 w-7 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
              aria-label={UI.EXPORT_CLOSE}
            >
              <Icon path="close" size={16} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
            </button>
          </div>
        </div>

        {collapsed ? null : (
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3">
            <p className="mb-2 text-[11px] leading-snug text-slate-400">{UI.EXPORT_HINT}</p>

            <TreeExportGeneralFields
              settings={settings}
              presets={presets}
              activePresetId={activePresetId}
              onPatch={onPatch}
              onPatchImage={onPatchImage}
              onApplyPreset={onApplyPreset}
            />
            <TreeExportStyleFields settings={settings} onPatch={onPatch} onPatchCouplet={onPatchCouplet} />

            <button
              type="button"
              onClick={onReset}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              {UI.EXPORT_RESET}
            </button>
          </div>
        )}

        <div className="shrink-0 border-t border-amber-100 p-3">
          <button
            type="button"
            onClick={onExport}
            disabled={exporting || !assetsReady}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition active:bg-amber-800 disabled:opacity-50"
          >
            <Icon path="download" size={18} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
            {exporting ? UI.EXPORT_PREPARING : !assetsReady ? UI.EXPORT_LOADING_ASSETS : UI.EXPORT_DOWNLOAD}
          </button>
        </div>
      </div>
    </div>
  );
}
