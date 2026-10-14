"use client";

import { useMemo, useState } from "react";
import { AC } from "@/components/auth/account-theme";
import type { PrintBookTemplate } from "@/lib/api/modules/ceremonies";
import { UI } from "@/lib/constants/ui-strings";
import { creatorName } from "./prayer-templates";

type Source = "system" | number; // number = id người tạo

type Props = {
  templates: PrintBookTemplate[] | null;
  selected: number[];
  onAdd: (ids: number[]) => void;
  onRemove: (id: number) => void;
};

/** Kho bài: bài hệ thống hoặc bài của từng người dùng, tìm theo tên, bấm để thêm vào sách. */
export default function PrayerLibrary({ templates, selected, onAdd, onRemove }: Props) {
  const [source, setSource] = useState<Source>("system");
  const [query, setQuery] = useState("");

  /** Người dùng có bài riêng (không phải bài hệ thống). */
  const creators = useMemo(() => {
    const map = new Map<number, { id: number; label: string; count: number }>();
    for (const t of templates ?? []) {
      if (t.isSystemTemplate || !t.createdBy) continue;
      const prev = map.get(t.createdBy.id);
      map.set(t.createdBy.id, {
        id: t.createdBy.id,
        label: UI.PRINT_BOOKS_USER_LABEL(creatorName(t), t.organization?.name ?? ""),
        count: (prev?.count ?? 0) + 1,
      });
    }
    return [...map.values()].sort((a, b) => a.label.localeCompare(b.label, "vi"));
  }, [templates]);

  const library = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (templates ?? []).filter((t) => {
      const inSource = source === "system" ? t.isSystemTemplate : !t.isSystemTemplate && t.createdBy?.id === source;
      return inSource && (!q || `${t.title} ${t.name}`.toLowerCase().includes(q));
    });
  }, [templates, source, query]);

  return (
    <section className={`${AC.card} flex max-h-[640px] flex-col p-5`}>
      <h3 className={AC.sectionTitle}>{UI.PRINT_BOOKS_LIBRARY}</h3>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <select
          value={source === "system" ? "system" : String(source)}
          onChange={(e) => setSource(e.target.value === "system" ? "system" : Number(e.target.value))}
          className={AC.input}
          aria-label={UI.PRINT_BOOKS_PICK_USER}
        >
          <option value="system">{UI.PRINT_BOOKS_SOURCE_SYSTEM}</option>
          {creators.length ? (
            <optgroup label={UI.PRINT_BOOKS_SOURCE_USER}>
              {creators.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label} ({c.count})
                </option>
              ))}
            </optgroup>
          ) : null}
        </select>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={UI.PRINT_BOOKS_SEARCH} className={AC.input} />
      </div>
      <div className="mt-2">
        <button type="button" onClick={() => onAdd(library.map((t) => t.id))} className="rounded-full border border-[#d4c3c1] px-3 py-1 text-xs hover:bg-[#f6f3ee]">
          {UI.PRINT_BOOKS_ADD_ALL}
        </button>
      </div>
      <ul className="mt-3 min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
        {templates == null ? <li className={`py-6 text-center text-sm ${AC.label}`}>{UI.LOADING}</li> : null}
        {library.map((t) => {
          const added = selected.includes(t.id);
          return (
            <li key={t.id} className="flex items-center gap-2 rounded-lg border border-[#e7ddd2] bg-white px-3 py-2 text-sm">
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-[#321716]">{t.title}</span>
                {!t.publishable ? (
                  <span className="mt-0.5 inline-block rounded bg-[#fef3c7] px-1.5 text-xs text-[#944a00]">{UI.PRINT_BOOKS_DRAFT_BADGE}</span>
                ) : null}
              </span>
              <button
                type="button"
                onClick={() => (added ? onRemove(t.id) : onAdd([t.id]))}
                className={`shrink-0 rounded-lg px-3 py-1 text-xs font-semibold ${
                  added ? "bg-[#e8f5e9] text-[#2e7d32]" : "bg-[#321716] text-white hover:bg-[#4a2c2a]"
                }`}
              >
                {added ? `✓ ${UI.PRINT_BOOKS_ADDED}` : `+ ${UI.PRINT_BOOKS_ADD}`}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
