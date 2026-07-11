"use client";

import { useMemo, useState } from "react";
import Icon from "@/components/icons/Icon";
import { FormField, inputClassName } from "@/components/ui/CollapsibleSection";
import { UI } from "@/lib/constants/ui-strings";
import type { Person } from "@/components/types/family-tree-types";
import { filterPersonsByName } from "@/utils/person-search";
import { getBranchLabel } from "@/lib/constants/branches";

type Props = {
  label: string;
  persons: Person[];
  excludeIds: number[];
  selected: Person | null;
  disabled?: boolean;
  /** Shown when empty — e.g. "Thêm mẹ". */
  addLabel?: string;
  onSelect: (person: Person) => void;
  onClear: () => void;
  onAddClick?: () => void;
};

function personMeta(person: Person): string | null {
  const parts = [
    person.generation != null ? UI.GENERATION_SHORT(person.generation) : null,
    person.branch != null ? getBranchLabel(person.branch) : null,
    person.gender?.trim() || null,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : null;
}

/** Search-and-pick one related person (father / mother / spouse). */
export default function PersonRelationPicker({
  label,
  persons,
  excludeIds,
  selected,
  disabled,
  addLabel,
  onSelect,
  onClear,
  onAddClick,
}: Props) {
  const [query, setQuery] = useState("");
  const candidates = useMemo(
    () => persons.filter((p) => !excludeIds.includes(p.id)),
    [persons, excludeIds],
  );
  const results = useMemo(
    () => filterPersonsByName(candidates, query),
    [candidates, query],
  );

  return (
    <FormField label={label}>
      {selected ? (
        <div className="flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-600 text-sm font-semibold text-white">
            {selected.fullName.charAt(0)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">
              {selected.fullName}
            </p>
            {personMeta(selected) ? (
              <p className="truncate text-xs text-slate-500">
                {personMeta(selected)}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            disabled={disabled}
            onClick={onClear}
            className="shrink-0 rounded-full px-2 py-1 text-xs font-medium text-slate-500 active:bg-white disabled:opacity-50"
          >
            {UI.RELATION_CLEAR}
          </button>
        </div>
      ) : (
        <>
          <div className="relative">
            <Icon
              path="search"
              size={18}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              pointer={false}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={query}
              disabled={disabled}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={UI.RELATION_SEARCH_PLACEHOLDER}
              className={`${inputClassName} pl-10`}
            />
          </div>
          {results.length > 0 ? (
            <ul className="scroll-list mt-2 max-h-40 divide-y divide-slate-100 rounded-xl border border-slate-200">
              {results.map((person) => (
                <li key={person.id}>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      onSelect(person);
                      setQuery("");
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left active:bg-amber-50 disabled:opacity-50"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-600 text-sm font-semibold text-white">
                      {person.fullName.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {person.fullName}
                      </p>
                      {personMeta(person) ? (
                        <p className="truncate text-xs text-slate-500">
                          {personMeta(person)}
                        </p>
                      ) : null}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : query.trim() ? (
            <p className="mt-2 px-1 text-xs text-slate-400">
              {UI.NO_SEARCH_RESULTS}
            </p>
          ) : null}
          {addLabel && onAddClick ? (
            <button
              type="button"
              disabled={disabled}
              onClick={onAddClick}
              className="mt-2 w-full rounded-lg border border-dashed border-amber-400 bg-amber-50/80 px-3 py-2.5 text-sm font-medium text-amber-900 active:bg-amber-100 disabled:opacity-50"
            >
              + {addLabel}
            </button>
          ) : null}
        </>
      )}
    </FormField>
  );
}
