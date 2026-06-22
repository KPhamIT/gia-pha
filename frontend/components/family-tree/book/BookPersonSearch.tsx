"use client";

import { useEffect, useMemo, useState } from "react";
import BookShell from "@/components/ui/BookShell";
import { dismissOverlayFocus } from "@/hooks/useOverlayViewport";
import Icon from "@/components/icons/Icon";
import { getBranchLabel } from "@/lib/constants/branches";
import { LAYOUT } from "@/lib/constants/ui-layout";
import { UI } from "@/lib/constants/ui-strings";
import type { Person } from "@/components/types/family-tree-types";
import { filterPersonsByName } from "@/utils/person-search";

type Props = {
  persons: Person[];
  onClose: () => void;
  onSelect: (person: Person) => void;
};

function personSubtitle(person: Person): string | null {
  const parts = [
    person.generation != null
      ? `${UI.BOOK_GENERATION} ${person.generation}`
      : null,
    person.branch != null ? getBranchLabel(person.branch) : null,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : null;
}

/** Search visible book pages by name and jump to the selected person. */
export default function BookPersonSearch({
  persons,
  onClose,
  onSelect,
}: Props) {
  const [query, setQuery] = useState("");

  const results = useMemo(
    () => filterPersonsByName(persons, query),
    [persons, query],
  );

  const close = () => {
    dismissOverlayFocus();
    onClose();
  };

  useEffect(() => () => dismissOverlayFocus(), []);

  const handleSelect = (person: Person) => {
    onSelect(person);
    close();
  };

  return (
    <BookShell zClass="z-[60]">
      <header className={`${LAYOUT.sheetHeader} ${LAYOUT.sheetHeaderBook}`}>
        <button
          type="button"
          onClick={close}
          className="grid h-10 w-10 place-items-center rounded-full active:bg-white/10 md:hover:bg-white/10"
          aria-label={UI.CANCEL}
        >
          <Icon
            path="arrowLeft"
            size={22}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            pointer={false}
          />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold md:text-xl">
            {UI.BOOK_SEARCH_TITLE}
          </h1>
        </div>
      </header>

      <div className={`${LAYOUT.sheetBody} px-3 md:px-6`}>
        <div className="mx-auto max-w-2xl pb-[max(1rem,env(safe-area-inset-bottom))] md:pb-6">
          <div className="relative mb-3">
            <Icon
              path="search"
              size={18}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              pointer={false}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-100/50"
            />
            <input
              type="search"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={UI.SEARCH_PLACEHOLDER}
              className="w-full rounded-2xl border border-amber-100/20 bg-white/10 py-3 pl-10 pr-3 text-base text-amber-50 placeholder:text-amber-100/50 focus:border-amber-200/50 focus:bg-white/15 focus:outline-none"
            />
          </div>

          {query.trim() && results.length === 0 ? (
            <p className="rounded-xl bg-white/5 px-4 py-10 text-center text-sm text-amber-100/70">
              {UI.NO_SEARCH_RESULTS}
            </p>
          ) : null}

          <div className="space-y-1">
            {results.map((person) => {
              const subtitle = personSubtitle(person);
              return (
                <button
                  key={person.id}
                  type="button"
                  onClick={() => handleSelect(person)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left active:bg-white/10 md:hover:bg-white/10"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-100/15 text-sm font-semibold text-amber-100">
                    {person.fullName.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-amber-50">
                      {person.fullName}
                    </p>
                    {subtitle ? (
                      <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-amber-100/60">
                        {subtitle}
                      </p>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </BookShell>
  );
}
