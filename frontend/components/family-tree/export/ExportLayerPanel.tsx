"use client";

import { EXPORT_TEXT_FONTS } from "@/components/family-tree/book/calligraphy-fonts";
import Icon from "@/components/icons/Icon";
import { UI } from "@/lib/constants/ui-strings";
import type {
  ExportDecorationLayer,
  ExportLayerTier,
} from "@/lib/family-tree/export-decoration-layers";
import { sortExportLayers } from "@/lib/family-tree/export-decoration-layers";
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
  layers: ExportDecorationLayer[];
  layer: ExportDecorationLayer | null;
  onSelectLayer: (id: string) => void;
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

function layerChipLabel(layer: ExportDecorationLayer): string {
  if (layer.type === "text") {
    const t = layer.text.trim();
    return t ? t.slice(0, 16) : UI.EXPORT_TEXT_PANEL_TITLE;
  }
  return layer.name;
}

export default function ExportLayerPanel({
  layers,
  layer,
  onSelectLayer,
  onPatch,
  onDelete,
  onBringForward,
  onSendBackward,
}: Props) {
  const sorted = sortExportLayers(layers);

  return (
    <div className="mb-3">
      {sorted.length > 0 ? (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {sorted.map((item) => {
            const selected = layer?.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectLayer(item.id)}
                className={`inline-flex max-w-[9rem] items-center gap-1 truncate rounded-full border px-2.5 py-1 text-[11px] ${
                  selected
                    ? "border-amber-500 bg-amber-100 text-amber-900"
                    : "border-slate-200 bg-white text-slate-600 hover:border-amber-300"
                }`}
                title={layerChipLabel(item)}
              >
                {item.locked ? (
                  <Icon
                    path="lock"
                    size={11}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    pointer={false}
                    className="shrink-0"
                  />
                ) : null}
                <span className="truncate">{layerChipLabel(item)}</span>
              </button>
            );
          })}
        </div>
      ) : null}

      {layer ? (
        <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3">
          <div className={sectionTitle}>
            {layer.type === "text" ? UI.EXPORT_TEXT_PANEL_TITLE : layer.name}
          </div>

          <Toggle
            label={UI.EXPORT_LAYER_LOCK}
            checked={Boolean(layer.locked)}
            onChange={(locked) => onPatch({ locked })}
          />
          {layer.locked ? (
            <p className="mb-2 text-[11px] text-slate-500">
              {UI.EXPORT_LAYER_LOCKED_HINT}
            </p>
          ) : null}

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
                  disabled={layer.locked}
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
                  disabled={layer.locked}
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
                  {EXPORT_TEXT_FONTS.map((font) => (
                    <option key={font.id || "normal"} value={font.id}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </label>
              <Toggle
                label={UI.EXPORT_TEXT_BOLD}
                checked={layer.bold ?? false}
                onChange={(bold) => onPatch({ bold })}
              />
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
      ) : null}
    </div>
  );
}
