"use client";

import {
  CALLIGRAPHY_FONTS,
  EXPORT_NORMAL_FONT_ID,
} from "@/components/family-tree/book/calligraphy-fonts";
import { UI } from "@/lib/constants/ui-strings";
import type {
  ExportDecorationLayer,
  ExportLayerTier,
} from "@/lib/family-tree/export-decoration-layers";
import {
  ColorRow,
  Toggle,
  fieldLabel,
  selectClass,
  sectionTitle,
} from "./tree-export-control-bits";
import ExportTextCurveControl from "./ExportTextCurveControl";
import ExportTextRotationControl from "./ExportTextRotationControl";

type Props = {
  layer: ExportDecorationLayer | null;
  onPatch: (patch: Partial<ExportDecorationLayer>) => void;
  onDelete: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
};

const TIER_OPTIONS: { value: ExportLayerTier; label: string }[] = [
  { value: "behind-tree", label: UI.EXPORT_LAYER_TIER_BEHIND_TREE },
  { value: "above-tree", label: UI.EXPORT_LAYER_TIER_ABOVE_TREE },
  { value: "above-text", label: UI.EXPORT_LAYER_TIER_ABOVE_TEXT },
];

export default function ExportLayerPanel({
  layer,
  onPatch,
  onDelete,
  onBringForward,
  onSendBackward,
}: Props) {
  if (!layer) return null;

  return (
    <div className="mb-3 rounded-xl border border-amber-100 bg-amber-50/40 p-3">
      <div className={sectionTitle}>
        {layer.type === "text" ? UI.EXPORT_TEXT_PANEL_TITLE : layer.name}
      </div>

      <label className="mb-2 block">
        <span className={fieldLabel}>{UI.EXPORT_LAYER_TIER}</span>
        <select
          className={selectClass}
          value={layer.tier}
          onChange={(e) =>
            onPatch({ tier: e.target.value as ExportLayerTier })
          }
        >
          {TIER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {layer.type === "image" ? (
        <>
          <label className="mb-2 block">
            <span className={fieldLabel}>{UI.EXPORT_LAYER_WIDTH}</span>
            <input
              type="number"
              min={40}
              className={selectClass}
              value={Math.round(layer.width)}
              onChange={(e) =>
                onPatch({
                  width: Number(e.target.value),
                  height: Number(e.target.value) / layer.aspectRatio,
                })
              }
            />
          </label>
          <label className="mb-2 block">
            <span className={fieldLabel}>{UI.EXPORT_LAYER_HEIGHT}</span>
            <input
              type="number"
              min={40}
              className={selectClass}
              value={Math.round(layer.height)}
              onChange={(e) =>
                onPatch({
                  height: Number(e.target.value),
                  width: Number(e.target.value) * layer.aspectRatio,
                })
              }
            />
          </label>
        </>
      ) : (
        <>
          <label className="mb-2 block">
            <span className={fieldLabel}>{UI.EXPORT_TEXT_CONTENT}</span>
            <textarea
              className={`${selectClass} min-h-[4.5rem] resize-y`}
              value={layer.text}
              onChange={(e) => onPatch({ text: e.target.value })}
            />
          </label>
          <ColorRow
            label={UI.EXPORT_TEXT_COLOR}
            value={layer.color}
            onChange={(color) => onPatch({ color })}
          />
          <label className="mb-2 block">
            <span className={fieldLabel}>{UI.EXPORT_TEXT_SIZE}</span>
            <input
              type="number"
              min={80}
              max={3000}
              className={selectClass}
              value={layer.fontSize}
              onChange={(e) => onPatch({ fontSize: Number(e.target.value) })}
            />
          </label>
          <label className="mb-2 block">
            <span className={fieldLabel}>{UI.EXPORT_TEXT_FONT}</span>
            <select
              className={selectClass}
              value={layer.fontId}
              onChange={(e) => onPatch({ fontId: e.target.value })}
            >
              <option value={EXPORT_NORMAL_FONT_ID}>
                {UI.EXPORT_TEXT_FONT_NORMAL}
              </option>
              {CALLIGRAPHY_FONTS.map((font) => (
                <option key={font.id} value={font.id}>
                  {font.label}
                </option>
              ))}
            </select>
          </label>
          <Toggle
            label={UI.EXPORT_TEXT_VERTICAL}
            checked={layer.vertical}
            onChange={(vertical) => onPatch({ vertical })}
          />
          {!layer.vertical ? (
            <>
              <ExportTextCurveControl
                value={layer.textCurve ?? 0}
                onChange={(textCurve) => onPatch({ textCurve })}
              />
              <ExportTextRotationControl
                value={layer.textRotation ?? 0}
                onChange={(textRotation) => onPatch({ textRotation })}
              />
            </>
          ) : null}
        </>
      )}

      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onBringForward}
          className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-700"
        >
          {UI.EXPORT_LAYER_BRING_FORWARD}
        </button>
        <button
          type="button"
          onClick={onSendBackward}
          className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-700"
        >
          {UI.EXPORT_LAYER_SEND_BACKWARD}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs text-red-600"
        >
          {UI.EXPORT_LAYER_DELETE}
        </button>
      </div>
    </div>
  );
}
