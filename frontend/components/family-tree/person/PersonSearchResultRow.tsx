"use client";

import type { Person } from "@/components/types/family-tree-types";

type PersonSearchResultRowProps = {
  person: Person;
  subtitle?: string | null;
  selected?: boolean;
  onClick: () => void;
};

export default function PersonSearchResultRow({
  person,
  subtitle,
  selected = false,
  onClick,
}: PersonSearchResultRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left active:bg-amber-100 md:hover:bg-amber-50 ${
        selected ? "bg-amber-50 ring-1 ring-amber-200" : ""
      }`}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700">
        {person.fullName.charAt(0)}
      </span>
      <div className="min-w-0">
        <p className="truncate font-medium text-slate-900">{person.fullName}</p>
        {subtitle ? (
          <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-slate-500">
            {subtitle}
          </p>
        ) : null}
      </div>
    </button>
  );
}
