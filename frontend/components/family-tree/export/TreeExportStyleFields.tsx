"use client";

import { UI } from "@/lib/constants/ui-strings";
import { NODE_CARD_STYLES } from "@/lib/family-tree/svg-border";
import { CALLIGRAPHY_FONTS } from "@/components/family-tree/book/calligraphy-fonts";
import {
  defaultCoupletFontSize,
  exportCoupletColumnHeight,
  EXPORT_BORDER_HEIGHT,
} from "@/lib/family-tree/export-tree-geometry";
import type {
  ExportCoupletCfg,
  TreeExportSettings,
} from "@/lib/family-tree/tree-export-settings";
import {
  ColorRow,
  Toggle,
  fieldLabel,
  selectClass,
  sectionTitle,
  type CoupletKey,
} from "./tree-export-control-bits";

type Props = {
  settings: TreeExportSettings;
  onPatch: (patch: Partial<TreeExportSettings>) => void;
  onPatchCouplet: (key: CoupletKey, patch: Partial<ExportCoupletCfg>) => void;
};

export default function TreeExportStyleFields({
  settings,
  onPatch,
  onPatchCouplet,
}: Props) {
  const coupletColumnHeight = exportCoupletColumnHeight();
  const autoCoupletSize = Math.round(
    Math.min(
      defaultCoupletFontSize(settings.coupletLeft.text, coupletColumnHeight),
      defaultCoupletFontSize(settings.coupletRight.text, coupletColumnHeight),
    ),
  );
  const coupletSizeMin = Math.round(EXPORT_BORDER_HEIGHT * 0.015);
  const coupletSizeMax = Math.round(EXPORT_BORDER_HEIGHT * 0.06);

  return (
    <>
      <div className={sectionTitle}>{UI.EXPORT_SECTION_COUPLETS}</div>
      <label className="mb-2 block">
        <span className={fieldLabel}>{UI.EXPORT_COUPLET_FONT}</span>
        <select
          className={selectClass}
          value={settings.coupletFontId}
          onChange={(e) => onPatch({ coupletFontId: e.target.value })}
        >
          {CALLIGRAPHY_FONTS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
      </label>
      <label className="mb-2 block">
        <span className={fieldLabel}>
          {UI.EXPORT_COUPLET_FONT_SIZE}: {settings.coupletFontSize ?? "—"}
        </span>
        <input
          type="range"
          min={coupletSizeMin}
          max={coupletSizeMax}
          step={10}
          value={settings.coupletFontSize ?? autoCoupletSize}
          onChange={(e) => onPatch({ coupletFontSize: Number(e.target.value) })}
          className="w-full accent-amber-600"
        />
      </label>
      <ColorRow
        label={UI.EXPORT_COUPLET_COLOR}
        value={settings.coupletColor}
        onChange={(v) => onPatch({ coupletColor: v })}
      />
      {(["coupletLeft", "coupletRight"] as const).map((key) => {
        const couplet = settings[key];
        const label =
          key === "coupletLeft"
            ? UI.EXPORT_COUPLET_LEFT
            : UI.EXPORT_COUPLET_RIGHT;
        return (
          <div
            key={key}
            className="mb-3 mt-2 rounded-lg border border-slate-200 p-2"
          >
            <Toggle
              label={label}
              checked={couplet.visible}
              onChange={(v) => onPatchCouplet(key, { visible: v })}
            />
            <textarea
              rows={2}
              value={couplet.text}
              placeholder={UI.EXPORT_COUPLET_PLACEHOLDER}
              onChange={(e) => onPatchCouplet(key, { text: e.target.value })}
              className="mt-1 w-full resize-none rounded-lg border border-slate-300 px-2 py-1.5 text-sm text-slate-800 outline-none focus:border-amber-500"
            />
          </div>
        );
      })}

      <div className={sectionTitle}>{UI.EXPORT_SECTION_NODE}</div>
      <label className="mb-2 block">
        <span className={fieldLabel}>{UI.EXPORT_NODE_BORDER_STYLE}</span>
        <select
          className={selectClass}
          value={settings.nodeBorderStyleId}
          onChange={(e) => onPatch({ nodeBorderStyleId: e.target.value })}
        >
          {NODE_CARD_STYLES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
      <ColorRow
        label={UI.EXPORT_NODE_BG}
        value={settings.nodeBgColor}
        onChange={(v) => onPatch({ nodeBgColor: v })}
      />
      <ColorRow
        label={UI.EXPORT_NODE_TEXT_COLOR}
        value={settings.nodeTextColor}
        onChange={(v) => onPatch({ nodeTextColor: v })}
      />
      <ColorRow
        label={UI.EXPORT_NODE_BORDER_COLOR}
        value={settings.nodeBorderColor}
        onChange={(v) => onPatch({ nodeBorderColor: v })}
      />
      <label className="mb-2 block">
        <span className={fieldLabel}>
          {UI.EXPORT_NODE_FONT_SIZE}: {settings.nodeFontSize}
        </span>
        <input
          type="range"
          min={9}
          max={28}
          step={1}
          value={settings.nodeFontSize}
          onChange={(e) => onPatch({ nodeFontSize: Number(e.target.value) })}
          className="w-full accent-amber-600"
        />
      </label>
    </>
  );
}
