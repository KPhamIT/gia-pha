"use client";

import { useState } from "react";
import { AC } from "@/components/auth/account-theme";
import type { PrintBookTemplate } from "@/lib/api/modules/ceremonies";
import { UI } from "@/lib/constants/ui-strings";
import { creatorName } from "./prayer-templates";

type Props = {
  selected: number[];
  byId: Map<number, PrintBookTemplate>;
  onMove: (from: number, to: number) => void;
  onRemove: (id: number) => void;
  onReset: () => void;
  onClear: () => void;
};

const iconBtn = "rounded px-1.5 py-0.5 hover:bg-[#f6f3ee] disabled:opacity-30";

/** Bài trong sách theo thứ tự in — kéo thả hoặc bấm ↑ ↓ để đổi thứ tự. */
export default function SelectedPrayerList({ selected, byId, onMove, onRemove, onReset, onClear }: Props) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  return (
    <section className={`${AC.card} flex max-h-[640px] flex-col p-5`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className={AC.sectionTitle}>{UI.PRINT_BOOKS_PRAYERS}</h3>
        <span className={`text-sm ${AC.label}`}>{UI.PRINT_BOOKS_PRAYERS_COUNT(selected.length)}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <button type="button" onClick={onReset} className="rounded-full border border-[#d4c3c1] px-3 py-1 hover:bg-[#f6f3ee]">
          {UI.PRINT_BOOKS_RESET_SYSTEM}
        </button>
        <button type="button" onClick={onClear} className="rounded-full border border-[#d4c3c1] px-3 py-1 hover:bg-[#f6f3ee]">
          {UI.PRINT_BOOKS_CLEAR}
        </button>
      </div>
      <ol className="mt-3 min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
        {selected.length === 0 ? <li className={`py-6 text-center text-sm ${AC.label}`}>{UI.PRINT_BOOKS_PRAYERS_EMPTY}</li> : null}
        {selected.map((id, index) => {
          const t = byId.get(id);
          if (!t) return null;
          return (
            <li
              key={id}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIndex != null) onMove(dragIndex, index);
                setDragIndex(null);
              }}
              onDragEnd={() => setDragIndex(null)}
              className={`flex cursor-grab items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                dragIndex === index ? "border-[#944a00] bg-[#fdf1e2]" : "border-[#e7ddd2] bg-white"
              }`}
            >
              <span className="w-6 shrink-0 text-right font-semibold text-[#944a00]">{index + 1}.</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-[#321716]">{t.title}</span>
                <span className={`block truncate text-xs ${AC.label}`}>
                  {t.isSystemTemplate ? UI.PRINT_BOOKS_SOURCE_SYSTEM : creatorName(t)}
                </span>
              </span>
              <button type="button" title={UI.PRINT_BOOKS_MOVE_UP} aria-label={UI.PRINT_BOOKS_MOVE_UP} onClick={() => onMove(index, index - 1)} disabled={index === 0} className={iconBtn}>
                ↑
              </button>
              <button type="button" title={UI.PRINT_BOOKS_MOVE_DOWN} aria-label={UI.PRINT_BOOKS_MOVE_DOWN} onClick={() => onMove(index, index + 1)} disabled={index === selected.length - 1} className={iconBtn}>
                ↓
              </button>
              <button type="button" title={UI.PRINT_BOOKS_REMOVE} aria-label={UI.PRINT_BOOKS_REMOVE} onClick={() => onRemove(id)} className="rounded px-1.5 py-0.5 text-[#b3261e] hover:bg-[#fdecea]">
                ✕
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
