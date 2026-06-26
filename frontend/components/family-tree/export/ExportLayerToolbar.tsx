"use client";

import Icon from "@/components/icons/Icon";
import { UI } from "@/lib/constants/ui-strings";

type Props = {
  onAddText: () => void;
  onOpenLibrary: () => void;
};

export default function ExportLayerToolbar({
  onAddText,
  onOpenLibrary,
}: Props) {
  return (
    <div className="pointer-events-auto absolute left-1/2 top-3 z-20 flex -translate-x-1/2 items-center gap-1 rounded-xl border border-amber-200/80 bg-white/95 px-2 py-1.5 shadow-lg backdrop-blur-sm">
      <button
        type="button"
        onClick={onAddText}
        className="grid h-9 w-9 place-items-center rounded-lg text-amber-900 hover:bg-amber-50"
        aria-label={UI.EXPORT_ADD_TEXT}
        title={UI.EXPORT_ADD_TEXT}
      >
        <span className="text-lg font-bold">A</span>
      </button>
      <button
        type="button"
        onClick={onOpenLibrary}
        className="grid h-9 w-9 place-items-center rounded-lg text-amber-900 hover:bg-amber-50"
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
  );
}
