"use client";

import Icon from "@/components/icons/Icon";
import {
  CEREMONY_TEMPLATE_FILTERS,
  type CeremonyTemplateFilterId,
} from "@/lib/ceremonies/template-filters";
import { UI } from "@/lib/constants/ui-strings";

type TemplatesSearchFiltersProps = {
  query: string;
  filterId: CeremonyTemplateFilterId;
  onQueryChange: (value: string) => void;
  onFilterChange: (value: CeremonyTemplateFilterId) => void;
};

export default function TemplatesSearchFilters({
  query,
  filterId,
  onQueryChange,
  onFilterChange,
}: TemplatesSearchFiltersProps) {
  return (
    <section className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:gap-4">
      <div className="relative w-full min-w-0 lg:min-w-[16rem] lg:flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <Icon
            path="search"
            size={20}
            fill="none"
            stroke="#827472"
            strokeWidth={2}
            pointer={false}
          />
        </div>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={UI.CEREMONY_TEMPLATE_SEARCH_PLACEHOLDER}
          className="h-12 w-full rounded-xl border border-[#d4c3c1] bg-white pl-10 pr-4 text-base text-[#1c1c19] outline-none transition-all focus:border-[#321716] focus:ring-2 focus:ring-[#321716]/10"
        />
      </div>

      <div className="flex flex-wrap gap-2 py-1 lg:min-w-0 lg:flex-1 lg:justify-end">
        {CEREMONY_TEMPLATE_FILTERS.map((filter) => {
          const active = filter.id === filterId;
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => onFilterChange(filter.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all active:scale-95 ${
                active
                  ? "bg-[#321716] text-white"
                  : "border border-[#d4c3c1]/30 bg-[#f0ede9] text-[#504443] hover:bg-[#ebe8e3]"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
