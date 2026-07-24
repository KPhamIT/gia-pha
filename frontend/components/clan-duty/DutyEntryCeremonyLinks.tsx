"use client";

import { useMemo, useState } from "react";
import type { CeremonyTemplate } from "@/lib/api/modules/ceremonies";
import { inputClassName } from "@/components/ui/CollapsibleSection";
import { UI } from "@/lib/constants/ui-strings";

export type CeremonyLinkDraft = {
  templateId: number;
  name: string;
};

type Props = {
  links: CeremonyLinkDraft[];
  templates: CeremonyTemplate[];
  canEdit: boolean;
  saving: boolean;
  onChange: (links: CeremonyLinkDraft[]) => void;
};

function templateHref(templateId: number): string {
  return `/ceremonies/templates?print=${templateId}`;
}

export default function DutyEntryCeremonyLinks({
  links,
  templates,
  canEdit,
  saving,
  onChange,
}: Props) {
  const [query, setQuery] = useState("");
  const excludeIds = useMemo(() => links.map((l) => l.templateId), [links]);
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return templates
      .filter(
        (t) =>
          !excludeIds.includes(t.id) &&
          t.name.toLowerCase().includes(normalized),
      )
      .slice(0, 8);
  }, [templates, excludeIds, query]);

  const addLink = (template: CeremonyTemplate) => {
    onChange([
      ...links,
      { templateId: template.id, name: template.name },
    ]);
    setQuery("");
  };

  const removeLink = (templateId: number) => {
    onChange(links.filter((l) => l.templateId !== templateId));
  };

  return (
    <div className="mt-3 rounded-lg border border-[#d4c3c1]/70 bg-white/70 p-2.5">
      <p className="text-xs font-medium text-[#504443]">
        {UI.CLAN_DUTY_CEREMONY_LINKS}
      </p>
      {canEdit ? (
        <p className="mt-0.5 text-[11px] text-[#827472]">
          {UI.CLAN_DUTY_CEREMONY_LINKS_HINT}
        </p>
      ) : null}

      {links.length === 0 ? (
        <p className="mt-2 text-xs text-[#827472]">{UI.CLAN_DUTY_CEREMONY_EMPTY}</p>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {links.map((link) => (
            <li
              key={link.templateId}
              className="flex items-center justify-between gap-2 rounded-lg bg-[#faf7f2] px-2.5 py-1.5"
            >
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-[#321716]">
                  {link.name}
                </p>
                <a
                  href={templateHref(link.templateId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-medium text-[#944a00] underline-offset-2 hover:underline"
                >
                  {UI.CLAN_DUTY_CEREMONY_OPEN}
                </a>
              </div>
              {canEdit ? (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => removeLink(link.templateId)}
                  className="shrink-0 text-[11px] font-medium text-slate-500"
                >
                  {UI.CLAN_DUTY_CEREMONY_REMOVE}
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      {canEdit ? (
        <div className="relative mt-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={saving}
            placeholder={UI.CLAN_DUTY_CEREMONY_SEARCH}
            className={inputClassName}
          />
          {results.length > 0 ? (
            <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-xl border border-[#d4c3c1] bg-white shadow-md">
              {results.map((template) => (
                <li key={template.id}>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => addLink(template)}
                    className="flex w-full px-3 py-2 text-left text-sm text-[#321716] hover:bg-[#fff8f0]"
                  >
                    {template.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
