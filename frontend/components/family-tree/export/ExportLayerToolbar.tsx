"use client";

import Icon from "@/components/icons/Icon";
import { UI } from "@/lib/constants/ui-strings";

type Props = {
  onAddText: () => void;
  onOpenLibrary: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetTree: () => void;
  treeScale: number;
};

const btnClass =
  "grid h-9 w-9 place-items-center rounded-lg text-amber-900 hover:bg-amber-50 active:bg-amber-100";

export default function ExportLayerToolbar({
  onAddText,
  onOpenLibrary,
  onZoomIn,
  onZoomOut,
  onResetTree,
  treeScale,
}: Props) {
  const scaleLabel = `${Math.round(treeScale * 100)}%`;

  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 z-[60] flex items-center pr-1.5">
      <div className="pointer-events-auto flex flex-col items-center gap-1 rounded-xl border border-amber-200/80 bg-white/95 px-1.5 py-2 shadow-lg backdrop-blur-sm touch-manipulation">
        <button
          type="button"
          onClick={onZoomOut}
          className={`${btnClass} text-lg font-semibold`}
          aria-label={UI.EXPORT_TREE_ZOOM_OUT}
          title={`${UI.EXPORT_TREE_ZOOM_OUT} (${scaleLabel})`}
        >
          −
        </button>
        <button
          type="button"
          onClick={onResetTree}
          className={btnClass}
          aria-label={UI.EXPORT_TREE_RESET}
          title={`${UI.EXPORT_TREE_RESET} (${scaleLabel})`}
        >
          <Icon
            path="center"
            size={18}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            pointer={false}
            className="pointer-events-none"
          />
        </button>
        <button
          type="button"
          onClick={onZoomIn}
          className={btnClass}
          aria-label={UI.EXPORT_TREE_ZOOM_IN}
          title={`${UI.EXPORT_TREE_ZOOM_IN} (${scaleLabel})`}
        >
          <Icon
            path="plus"
            size={18}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            pointer={false}
            className="pointer-events-none"
          />
        </button>
        <div className="my-0.5 h-px w-6 bg-amber-200" />
        <button
          type="button"
          onClick={onAddText}
          className={btnClass}
          aria-label={UI.EXPORT_ADD_TEXT}
          title={UI.EXPORT_ADD_TEXT}
        >
          <span className="text-lg font-bold">A</span>
        </button>
        <button
          type="button"
          onClick={onOpenLibrary}
          className={btnClass}
          aria-label={UI.EXPORT_ADD_IMAGE}
          title={UI.EXPORT_ADD_IMAGE}
        >
          <Icon
            path="image"
            size={20}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            pointer={false}
          />
        </button>
      </div>
    </div>
  );
}
