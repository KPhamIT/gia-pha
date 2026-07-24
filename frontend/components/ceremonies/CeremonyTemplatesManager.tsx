"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Icon from "@/components/icons/Icon";
import { api } from "@/lib/api";
import type {
  CeremonyTemplate,
  CeremonyTemplateVariable,
} from "@/lib/api/modules/ceremonies";
import type {
  Person,
  Relationship,
} from "@/components/types/family-tree-types";
import {
  filterCeremonyTemplates,
  resolveDefaultSourceFilter,
  type CeremonyTemplateFilterId,
  type CeremonyTemplateSourceFilterId,
} from "@/lib/ceremonies/template-filters";
import { notify } from "@/lib/notify";
import { UI } from "@/lib/constants/ui-strings";
import { useAuthStore } from "@/store/authStore";
import { EMPTY_FORM, type EditTarget } from "./ceremony-template-shared";
import TemplatesSearchFilters from "./TemplatesSearchFilters";
import CeremonyTemplateCard from "./CeremonyTemplateCard";
import TemplateEditorSheet from "./TemplateEditorSheet";
import CeremonyPrintView from "./CeremonyPrintView";

type CeremonyTemplatesManagerProps = {
  onCreateRef?: (openCreate: () => void) => void;
};

export default function CeremonyTemplatesManager({
  onCreateRef,
}: CeremonyTemplatesManagerProps) {
  const searchParams = useSearchParams();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isDemo = useAuthStore((state) => state.isDemo);
  const canCreate = isLoggedIn && !isDemo;
  const [templates, setTemplates] = useState<CeremonyTemplate[]>([]);
  const [variables, setVariables] = useState<CeremonyTemplateVariable[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sourceFilterId, setSourceFilterId] =
    useState<CeremonyTemplateSourceFilterId>("system");
  const [sourceFilterReady, setSourceFilterReady] = useState(false);
  const [categoryFilterId, setCategoryFilterId] =
    useState<CeremonyTemplateFilterId>("all");
  const [target, setTarget] = useState<EditTarget | null>(null);
  const [printTemplate, setPrintTemplate] = useState<CeremonyTemplate | null>(
    null,
  );

  const reload = useCallback(
    () =>
      Promise.all([
        api.ceremonies.listTemplates(),
        api.ceremonies.listVariables(),
        api.person.list(),
        api.relationship.list(),
      ])
        .then(([items, vars, personList, rels]) => {
          setTemplates(items);
          setVariables(vars);
          setPersons(personList);
          setRelationships(rels);
        })
        .catch((err) => notify.error(err, UI.CEREMONY_TEMPLATE_ERR_LOAD))
        .finally(() => setLoading(false)),
    [],
  );

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    if (loading) return;
    const raw = searchParams.get("print");
    if (!raw) return;
    const id = Number(raw);
    if (!Number.isInteger(id) || id <= 0) return;
    const found = templates.find((item) => item.id === id);
    if (found) setPrintTemplate(found);
  }, [loading, searchParams, templates]);

  useEffect(() => {
    if (loading || sourceFilterReady) return;
    setSourceFilterId(resolveDefaultSourceFilter(templates));
    setSourceFilterReady(true);
  }, [loading, templates, sourceFilterReady]);

  const openCreate = useCallback(
    () => setTarget({ template: null, initial: EMPTY_FORM }),
    [],
  );

  useEffect(() => {
    onCreateRef?.(openCreate);
  }, [onCreateRef, openCreate]);

  const sorted = useMemo(
    () =>
      [...templates].sort((a, b) => Number(b.isDefault) - Number(a.isDefault)),
    [templates],
  );

  const filtered = useMemo(
    () =>
      filterCeremonyTemplates(sorted, query, sourceFilterId, categoryFilterId),
    [sorted, query, sourceFilterId, categoryFilterId],
  );

  const hasPersonalTemplates = useMemo(
    () => sorted.some((template) => !template.isSystemTemplate),
    [sorted],
  );

  const emptyMessage = useMemo(() => {
    if (sorted.length === 0) return UI.CEREMONY_TEMPLATE_EMPTY;
    if (sourceFilterId === "personal" && !hasPersonalTemplates) {
      return UI.CEREMONY_TEMPLATE_PERSONAL_EMPTY;
    }
    return UI.CEREMONY_TEMPLATE_FILTER_NONE;
  }, [sorted.length, sourceFilterId, hasPersonalTemplates]);

  const showCreateInEmpty =
    canCreate &&
    (sorted.length === 0 ||
      (sourceFilterId === "personal" && !hasPersonalTemplates));

  const deceasedPersons = useMemo(
    () =>
      persons.filter(
        (p) => p.deathLunarDay != null && p.deathLunarMonth != null,
      ),
    [persons],
  );

  const openEdit = (template: CeremonyTemplate) =>
    setTarget({
      template,
      initial: {
        name: template.name,
        content: template.content,
        isDefault: template.isDefault,
      },
    });

  const openDuplicate = (template: CeremonyTemplate) =>
    setTarget({
      template: null,
      initial: {
        name: template.name + UI.CEREMONY_TEMPLATE_COPY_SUFFIX,
        content: template.content,
        isDefault: false,
      },
    });

  const handleSetDefault = async (id: number) => {
    try {
      await api.ceremonies.setDefaultTemplate(id);
      notify.success(UI.CEREMONY_TEMPLATE_DEFAULT_SET);
      await reload();
    } catch (err) {
      notify.error(err, UI.CEREMONY_TEMPLATE_ERR_SAVE);
    }
  };

  const handleDelete = async (template: CeremonyTemplate) => {
    if (!template.canDelete) return;
    if (!window.confirm(UI.CEREMONY_TEMPLATE_DELETE_CONFIRM)) return;
    try {
      await api.ceremonies.deleteTemplate(template.id);
      notify.success(UI.CEREMONY_TEMPLATE_DELETED);
      await reload();
    } catch (err) {
      notify.error(err, UI.CEREMONY_TEMPLATE_ERR_DELETE);
    }
  };

  if (loading) {
    return (
      <p className="text-sm text-[#504443]">{UI.CEREMONY_TEMPLATES_LOADING}</p>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <header className="mb-2 hidden md:flex md:flex-row md:items-center md:justify-between md:gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#4a2c2a]">
            {UI.CEREMONY_TEMPLATES_TITLE}
          </h1>
          <p className="mt-2 italic text-[#504443]">
            {UI.CEREMONY_TEMPLATES_PAGE_DESC}
          </p>
        </div>
        {canCreate ? (
          <button
            type="button"
            onClick={openCreate}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-[#4a2c2a] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#321716] active:scale-95"
          >
            <Icon
              path="plus"
              size={18}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              pointer={false}
            />
            {UI.CEREMONY_TEMPLATE_CREATE_DESKTOP}
          </button>
        ) : null}
      </header>

      {!canCreate ? (
        <p className="rounded-xl border border-[#d4c3c1] bg-[#f6f3ee] px-4 py-3 text-sm text-[#504443]">
          {UI.CEREMONY_TEMPLATE_READONLY_HINT}
        </p>
      ) : null}

      <div className="mb-6 min-w-0 md:mb-8 md:rounded-xl md:border md:border-[#e5e1da] md:bg-[#f6f3ee] md:p-4">
        <TemplatesSearchFilters
          query={query}
          sourceFilterId={sourceFilterId}
          categoryFilterId={categoryFilterId}
          onQueryChange={setQuery}
          onSourceFilterChange={setSourceFilterId}
          onCategoryFilterChange={setCategoryFilterId}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-[#d4c3c1] bg-white p-8 text-center shadow-sm">
          <p className="text-sm leading-relaxed text-[#504443]">{emptyMessage}</p>
          {showCreateInEmpty ? (
            <button
              type="button"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#944a00] px-5 py-2.5 text-sm font-semibold text-white"
              onClick={openCreate}
            >
              <Icon
                path="plus"
                size={18}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                pointer={false}
              />
              {UI.CEREMONY_TEMPLATE_CREATE}
            </button>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {filtered.map((template) => (
            <CeremonyTemplateCard
              key={template.id}
              template={template}
              canDuplicate={canCreate}
              onPrint={() => setPrintTemplate(template)}
              onSetDefault={() => void handleSetDefault(template.id)}
              onDuplicate={() => openDuplicate(template)}
              onEdit={() => openEdit(template)}
              onDelete={() => void handleDelete(template)}
            />
          ))}
        </div>
      )}

      {target ? (
        <TemplateEditorSheet
          target={target}
          variables={variables}
          onClose={() => setTarget(null)}
          onSaved={async () => {
            setTarget(null);
            await reload();
          }}
        />
      ) : null}

      {printTemplate ? (
        <CeremonyPrintView
          templateId={printTemplate.id}
          persons={deceasedPersons}
          relationships={relationships}
          onClose={() => setPrintTemplate(null)}
        />
      ) : null}
    </div>
  );
}
