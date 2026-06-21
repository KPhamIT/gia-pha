'use client';

import { useMemo, useState } from 'react';
import Icon from '@/components/icons/Icon';
import { UI } from '@/lib/constants/ui-strings';
import { BT } from '@/lib/constants/ui-theme';
import { inputClassName } from '@/components/ui/CollapsibleSection';
import type { CeremonyTemplateVariable } from '@/lib/api/modules/ceremonies';
import { nsLabel } from './ceremony-template-shared';

type Props = {
  variables: CeremonyTemplateVariable[];
  onInsert: (key: string) => void;
};

export default function VariablePicker({ variables, onInsert }: Props) {
  const [query, setQuery] = useState('');

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = q
      ? variables.filter((v) => v.key.toLowerCase().includes(q) || v.label.toLowerCase().includes(q))
      : variables;
    const map = new Map<string, CeremonyTemplateVariable[]>();
    for (const v of matched) {
      const ns = v.key.includes('.') ? v.key.split('.')[0] : '•';
      const list = map.get(ns) ?? [];
      list.push(v);
      map.set(ns, list);
    }
    return [...map.entries()];
  }, [variables, query]);

  if (variables.length === 0) return null;

  const countLabel = UI.CEREMONY_TEMPLATE_VARIABLES_COUNT.replace('{count}', String(variables.length));

  return (
    <aside className={`${BT.card} flex max-h-[60vh] min-h-0 flex-col p-3 md:sticky md:top-4 md:max-h-[calc(100dvh-12rem)] md:w-72 md:shrink-0`}>
      <div className="flex items-center gap-2">
        <span className="min-w-0 flex-1 text-sm font-semibold text-neutral-900">{UI.CEREMONY_TEMPLATE_VARIABLES}</span>
        <span className={`shrink-0 text-xs ${BT.mutedOnLight}`}>{countLabel}</span>
      </div>
      <p className={`mt-0.5 text-xs ${BT.mutedOnLight}`}>{UI.CEREMONY_TEMPLATE_VARIABLES_INSERT_HINT}</p>

      <div className="relative mt-2">
        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400">
          <Icon path="search" size={16} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={UI.CEREMONY_TEMPLATE_VARIABLES_SEARCH}
          className={`${inputClassName} py-2 pl-8`}
        />
      </div>

      <div className="mt-2 min-h-0 flex-1 space-y-3 overflow-y-auto">
        {groups.length === 0 ? (
          <p className={`px-1 py-2 text-xs ${BT.mutedOnLight}`}>{UI.CEREMONY_TEMPLATE_VARIABLES_NONE}</p>
        ) : (
          groups.map(([ns, items]) => (
            <div key={ns}>
              <p className="px-1 pb-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700">{nsLabel(ns)}</p>
              <div className="space-y-1">
                {items.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => onInsert(item.key)}
                    className="flex w-full min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors active:bg-amber-50 md:hover:bg-amber-50"
                  >
                    <span className="min-w-0 flex-1 text-sm leading-snug text-neutral-800">{item.label}</span>
                    <Icon path="plus" size={16} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} className="shrink-0 text-amber-600" />
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
