"use client";

import { useMemo, useState } from "react";
import Icon from "@/components/icons/Icon";
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
    <div className="rounded-xl border-l-4 border-[#944a00] bg-[#f6f3ee] p-3">
      <p className="mb-2 flex items-center gap-1 text-xs font-medium text-[#944a00]">
        <Icon
          path="book"
          size={16}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          pointer={false}
        />
        {UI.CLAN_DUTY_CEREMONY_LINKS}
        {canEdit ? ":" : null}
      </p>

      {links.length === 0 ? (
        <p className="text-sm text-[#827472]">{UI.CLAN_DUTY_CEREMONY_EMPTY}</p>
      ) : (
        <ul className="space-y-1 pl-1">
          {links.map((link) => (
            <li
              key={link.templateId}
              className="flex items-center justify-between gap-2 text-sm text-[#321716]"
            >
              <a
                href={templateHref(link.templateId)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-w-0 items-center gap-2 hover:underline"
              >
                <span className="h-1 w-1 shrink-0 rounded-full bg-[#827472]" />
                <span className="truncate">{link.name}</span>
              </a>
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
          <p className="mb-1 text-[11px] text-[#827472]">
            {UI.CLAN_DUTY_CEREMONY_LINKS_HINT}
          </p>
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
