"use client";

import { useMemo, useState } from "react";
import type {
  Person,
  Relationship,
} from "@/components/types/family-tree-types";
import Icon from "@/components/icons/Icon";
import { LAYOUT } from "@/lib/constants/ui-layout";
import { UI } from "@/lib/constants/ui-strings";
import {
  filterPersonsByName,
  personSearchSubtitle,
} from "@/utils/person-search";
import PersonSearchResultRow from "./PersonSearchResultRow";

type PersonSearchPanelProps = {
  persons: Person[];
  relationships: Relationship[];
  selectedPersonId?: number | null;
  onSelect: (person: Person) => void;
  onClear?: () => void;
  onCancel?: () => void;
  placeholder?: string;
  clearLabel?: string;
  autoFocus?: boolean;
  listClassName?: string;
};

export default function PersonSearchPanel({
  persons,
  relationships,
  selectedPersonId = null,
  onSelect,
  onClear,
  onCancel,
  placeholder = UI.SEARCH_PLACEHOLDER,
  clearLabel = UI.EVENT_DONATION_CLEAR_MEMBER,
  autoFocus = false,
  listClassName = "",
}: PersonSearchPanelProps) {
  const [query, setQuery] = useState("");

  const selectedPerson = useMemo(
    () =>
      selectedPersonId != null
        ? (persons.find((p) => p.id === selectedPersonId) ?? null)
        : null,
    [persons, selectedPersonId],
  );

  const results = useMemo(
    () => filterPersonsByName(persons, query),
    [persons, query],
  );

  const showSearch = !selectedPerson || onClear == null;
  const selectedSubtitle = selectedPerson
    ? personSearchSubtitle(selectedPerson, relationships)
    : null;

  const searchInput = (
    <div className="relative min-w-0 flex-1">
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
        autoFocus={autoFocus}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-amber-300/70 bg-white py-3 pl-10 pr-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none"
      />
    </div>
  );

  return (
    <div className={`flex min-h-0 flex-col ${onCancel ? "flex-1" : ""}`}>
      {selectedPerson && onClear ? (
        <div className="mb-3 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-600 text-sm font-semibold text-white">
            {selectedPerson.fullName.charAt(0)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">
              {selectedPerson.fullName}
            </p>
            {selectedSubtitle ? (
              <p className="truncate text-xs text-slate-500">
                {selectedSubtitle}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 rounded-full px-2 py-1 text-xs font-medium text-slate-600 active:bg-white md:hover:bg-white"
          >
            {clearLabel}
          </button>
        </div>
      ) : null}

      {showSearch ? (
        onCancel ? (
          <div
            className={`flex shrink-0 items-center gap-3 border-b border-slate-200 ${LAYOUT.pagePad} pb-3 min-w-0`}
          >
            {searchInput}
            <button
              type="button"
              onClick={onCancel}
              className="shrink-0 rounded-full px-3 py-2 text-sm font-medium text-slate-600 active:bg-slate-100 md:hover:bg-slate-100"
            >
              {UI.CANCEL}
            </button>
          </div>
        ) : (
          <div className="mb-2">{searchInput}</div>
        )
      ) : null}

      {showSearch ? (
        <div
          className={`${onCancel ? `${LAYOUT.scrollList} min-h-0 flex-1 px-2 py-2` : listClassName}`}
        >
          {query.trim() && results.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-slate-500">
              {UI.NO_SEARCH_RESULTS}
            </p>
          ) : null}
          {results.map((person) => (
            <PersonSearchResultRow
              key={person.id}
              person={person}
              subtitle={personSearchSubtitle(person, relationships)}
              selected={person.id === selectedPersonId}
              onClick={() => {
                onSelect(person);
                setQuery("");
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
