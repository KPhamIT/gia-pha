"use client";

import { UI } from "@/lib/constants/ui-strings";
import { TREE_BORDER_STYLES } from "@/lib/family-tree/svg-border";
import type {
  TreeExportSettings,
  TreeExportPreset,
} from "@/lib/family-tree/tree-export-settings";
import {
  ColorRow,
  fieldLabel,
  selectClass,
  sectionTitle,
} from "./tree-export-control-bits";

type Props = {
  settings: TreeExportSettings;
  presets: TreeExportPreset[];
  activePresetId: string | null;
  onPatch: (patch: Partial<TreeExportSettings>) => void;
  onApplyPreset: (presetId: string | null) => void;
};

export default function TreeExportGeneralFields({
  settings,
  presets,
  activePresetId,
  onPatch,
  onApplyPreset,
}: Props) {
  return (
    <>
      <div className={sectionTitle}>{UI.EXPORT_SECTION_GENERAL}</div>
      <label className="mb-2 block">
        <span className={fieldLabel}>{UI.EXPORT_PRESET}</span>
        <select
          className={selectClass}
          value={activePresetId ?? "__custom__"}
          onChange={(e) =>
            onApplyPreset(
              e.target.value === "__custom__" ? null : e.target.value,
            )
          }
        >
          <option value="__custom__">{UI.EXPORT_PRESET_CUSTOM}</option>
          {presets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.label}
            </option>
          ))}
        </select>
      </label>
      <ColorRow
        label={UI.EXPORT_BG_COLOR}
        value={settings.backgroundColor}
        onChange={(v) => onPatch({ backgroundColor: v })}
      />
      <ColorRow
        label={UI.EXPORT_BORDER_COLOR}
        value={settings.borderColor}
        onChange={(v) => onPatch({ borderColor: v })}
      />
      <label className="mb-2 block">
        <span className={fieldLabel}>{UI.EXPORT_BORDER_STYLE}</span>
        <select
          className={selectClass}
          value={settings.borderStyleId}
          onChange={(e) => onPatch({ borderStyleId: e.target.value })}
        >
          {TREE_BORDER_STYLES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
      <label className="mb-2 block">
        <span className={fieldLabel}>
          {UI.EXPORT_HEADER_HEIGHT}: {Math.round(settings.headerHeight)}
        </span>
        <input
          type="range"
          min={200}
          max={800}
          step={10}
          value={settings.headerHeight}
          onChange={(e) => onPatch({ headerHeight: Number(e.target.value) })}
          className="w-full accent-amber-600"
        />
      </label>
    </>
  );
}
