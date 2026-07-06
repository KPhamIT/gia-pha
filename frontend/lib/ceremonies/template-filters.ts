import type { CeremonyTemplate } from "@/lib/api/modules/ceremonies";
import { UI } from "@/lib/constants/ui-strings";

export type CeremonyTemplateSourceFilterId = "system" | "personal";

export type CeremonyTemplateFilterId =
  | "all"
  | "gio"
  | "tet"
  | "tho-cong"
  | "muc";

export type CeremonyTemplateSourceFilter = {
  id: CeremonyTemplateSourceFilterId;
  label: string;
};

export type CeremonyTemplateFilter = {
  id: CeremonyTemplateFilterId;
  label: string;
  keywords: readonly string[];
};

export const CEREMONY_TEMPLATE_SOURCE_FILTERS: readonly CeremonyTemplateSourceFilter[] =
  [
    { id: "system", label: UI.CEREMONY_TEMPLATE_FILTER_SYSTEM },
    { id: "personal", label: UI.CEREMONY_TEMPLATE_FILTER_PERSONAL },
  ] as const;

export function resolveDefaultSourceFilter(
  templates: CeremonyTemplate[],
): CeremonyTemplateSourceFilterId {
  const hasPersonal = templates.some((template) => !template.isSystemTemplate);
  return hasPersonal ? "personal" : "system";
}

export const CEREMONY_TEMPLATE_FILTERS: readonly CeremonyTemplateFilter[] = [
  { id: "all", label: UI.CEREMONY_TEMPLATE_FILTER_ALL, keywords: [] },
  {
    id: "gio",
    label: UI.CEREMONY_TEMPLATE_FILTER_GIO,
    keywords: ["giỗ", "gio", "chạp", "chap", "ngày giỗ"],
  },
  {
    id: "tet",
    label: UI.CEREMONY_TEMPLATE_FILTER_TET,
    keywords: ["tết", "tet", "rằm", "ram", "lễ"],
  },
  {
    id: "tho-cong",
    label: UI.CEREMONY_TEMPLATE_FILTER_THO_CONG,
    keywords: ["thổ công", "tho cong", "thổ địa", "tho dia"],
  },
  {
    id: "muc",
    label: UI.CEREMONY_TEMPLATE_FILTER_MUC,
    keywords: ["mụ", "muc", "đầy tháng", "day thang"],
  },
] as const;

function normalizeSearchText(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

function matchesSourceFilter(
  template: CeremonyTemplate,
  sourceFilterId: CeremonyTemplateSourceFilterId,
): boolean {
  return sourceFilterId === "system"
    ? template.isSystemTemplate
    : !template.isSystemTemplate;
}

function matchesCategoryFilter(
  name: string,
  filter: CeremonyTemplateFilter,
): boolean {
  if (filter.id === "all") return true;
  const normalized = normalizeSearchText(name);
  return filter.keywords.some((keyword) =>
    normalized.includes(normalizeSearchText(keyword)),
  );
}

export function filterCeremonyTemplates(
  templates: CeremonyTemplate[],
  query: string,
  sourceFilterId: CeremonyTemplateSourceFilterId,
  categoryFilterId: CeremonyTemplateFilterId,
): CeremonyTemplate[] {
  const categoryFilter =
    CEREMONY_TEMPLATE_FILTERS.find((item) => item.id === categoryFilterId) ??
    CEREMONY_TEMPLATE_FILTERS[0];
  const normalizedQuery = normalizeSearchText(query.trim());

  return templates.filter((template) => {
    if (!matchesSourceFilter(template, sourceFilterId)) return false;
    if (!matchesCategoryFilter(template.name, categoryFilter)) return false;
    if (!normalizedQuery) return true;
    const haystack = normalizeSearchText(
      `${template.name} ${template.content} ${template.intro ?? ""}`,
    );
    return haystack.includes(normalizedQuery);
  });
}
