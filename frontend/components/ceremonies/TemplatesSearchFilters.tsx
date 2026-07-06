"use client";

import Icon from "@/components/icons/Icon";
import {
  CEREMONY_TEMPLATE_FILTERS,
  CEREMONY_TEMPLATE_SOURCE_FILTERS,
  type CeremonyTemplateFilterId,
  type CeremonyTemplateSourceFilterId,
} from "@/lib/ceremonies/template-filters";
import { UI } from "@/lib/constants/ui-strings";

type TemplatesSearchFiltersProps = {
  query: string;
  sourceFilterId: CeremonyTemplateSourceFilterId;
  categoryFilterId: CeremonyTemplateFilterId;
  onQueryChange: (value: string) => void;
  onSourceFilterChange: (value: CeremonyTemplateSourceFilterId) => void;
  onCategoryFilterChange: (value: CeremonyTemplateFilterId) => void;
};

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all active:scale-95 ${
        active
          ? "bg-[#321716] text-white"
          : "border border-[#d4c3c1]/30 bg-[#f0ede9] text-[#504443] hover:bg-[#ebe8e3]"
      }`}
    >
      {label}
    </button>
  );
}

export default function TemplatesSearchFilters({
  query,
  sourceFilterId,
  categoryFilterId,
  onQueryChange,
  onSourceFilterChange,
  onCategoryFilterChange,
}: TemplatesSearchFiltersProps) {
  return (
    <section className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:gap-4">
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

      <div className="flex min-w-0 flex-col gap-3 lg:flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-full shrink-0 text-xs font-semibold uppercase tracking-wide text-[#827472] sm:w-auto">
            {UI.CEREMONY_TEMPLATE_SOURCE_FILTER_LABEL}
          </span>
          {CEREMONY_TEMPLATE_SOURCE_FILTERS.map((filter) => (
            <FilterChip
              key={filter.id}
              active={filter.id === sourceFilterId}
              label={filter.label}
              onClick={() => onSourceFilterChange(filter.id)}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 py-0.5">
          <span className="w-full shrink-0 text-xs font-semibold uppercase tracking-wide text-[#827472] sm:w-auto">
            {UI.CEREMONY_TEMPLATE_CATEGORY_FILTER_LABEL}
          </span>
          {CEREMONY_TEMPLATE_FILTERS.map((filter) => (
            <FilterChip
              key={filter.id}
              active={filter.id === categoryFilterId}
              label={filter.label}
              onClick={() => onCategoryFilterChange(filter.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
