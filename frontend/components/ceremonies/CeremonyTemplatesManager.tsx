'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Icon from '@/components/icons/Icon';
import { api } from '@/lib/api';
import type {
  CeremonyTemplate,
  CeremonyTemplateVariable,
} from '@/lib/api/modules/ceremonies';
import { notify } from '@/lib/notify';
import { UI } from '@/lib/constants/ui-strings';
import { BT } from '@/lib/constants/ui-theme';
import IconRoundButton from '@/components/ui/IconRoundButton';
import AutoGrowTextarea from '@/components/ui/AutoGrowTextarea';
import FullScreenSheet from '@/components/ui/FullScreenSheet';
import { inputClassName } from '@/components/ui/CollapsibleSection';

const EMPTY_FORM = { name: '', content: '', isDefault: false };
type FormState = typeof EMPTY_FORM;

export default function CeremonyTemplatesManager() {
  const [templates, setTemplates] = useState<CeremonyTemplate[]>([]);
  const [variables, setVariables] = useState<CeremonyTemplateVariable[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CeremonyTemplate | 'new' | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [items, vars] = await Promise.all([
        api.ceremonies.listTemplates(),
        api.ceremonies.listVariables(),
      ]);
      setTemplates(items);
      setVariables(vars);
    } catch (err) {
      notify.error(err, UI.CEREMONY_TEMPLATE_ERR_LOAD);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const sorted = useMemo(
    () => [...templates].sort((a, b) => Number(b.isDefault) - Number(a.isDefault)),
    [templates],
  );

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
    return <p className={`text-sm ${BT.mutedOnDark}`}>{UI.LOADING}</p>;
  }

  return (
    <div className="space-y-4 pb-4">
      <div className="sticky top-0 z-10 -mx-4 border-b border-amber-100/10 bg-gradient-to-b from-amber-950 via-amber-950/98 to-amber-950/90 px-4 py-3 backdrop-blur-sm md:-mx-6 md:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className={`text-xs leading-snug sm:max-w-[min(100%,28rem)] sm:text-sm ${BT.mutedOnDark}`}>
            {UI.CEREMONY_TEMPLATE_HINT}
          </p>
          <IconRoundButton
            icon="plus"
            variant="gold"
            label={UI.CEREMONY_TEMPLATE_CREATE}
            onClick={() => setEditing('new')}
            className="w-full shrink-0 sm:w-auto"
          />
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className={`${BT.card} p-6 text-center`}>
          <p className={`text-sm ${BT.mutedOnLight}`}>{UI.CEREMONY_TEMPLATE_EMPTY}</p>
          <button
            type="button"
            className={`mt-4 ${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary} mx-auto`}
            onClick={() => setEditing('new')}
          >
            <Icon path="plus" size={18} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
            {UI.CEREMONY_TEMPLATE_CREATE}
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {sorted.map((template) => (
            <li key={template.id} className={`${BT.card} flex flex-col p-3 md:p-4`}>
              <button
                type="button"
                onClick={() => setEditing(template)}
                className="min-w-0 flex-1 text-left"
              >
                <div className="flex items-center gap-2">
                  <p className="min-w-0 flex-1 truncate font-semibold text-neutral-900">{template.name}</p>
                  {template.isDefault ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                      <Icon path="check" size={12} fill="none" stroke="currentColor" strokeWidth={2.5} pointer={false} />
                      {UI.CEREMONY_TEMPLATE_DEFAULT_BADGE}
                    </span>
                  ) : null}
                </div>
                <p className={`mt-2 line-clamp-3 whitespace-pre-wrap font-mono text-xs leading-relaxed ${BT.mutedOnLight}`}>
                  {template.content}
                </p>
              </button>

              <div className="mt-3 flex items-center justify-end gap-2 border-t border-amber-200/60 pt-3">
                {!template.isDefault ? (
                  <button
                    type="button"
                    className={`mr-auto ${BT.btnBase} ${BT.btnSm} ${BT.btnOutline}`}
                    onClick={() => void handleSetDefault(template.id)}
                  >
                    {UI.CEREMONY_TEMPLATE_USE_DEFAULT}
                  </button>
                ) : null}
                <IconRoundButton icon="edit" variant="outline" onClick={() => setEditing(template)} aria-label={UI.BTN_EDIT} />
                <IconRoundButton
                  icon="trash"
                  variant="danger"
                  onClick={() => void handleDelete(template)}
                  aria-label={UI.DELETE_PERSON}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing ? (
        <TemplateEditorSheet
          template={editing === 'new' ? null : editing}
          variables={variables}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await reload();
          }}
        />
      ) : null}
    </div>
  );
}

function TemplateEditorSheet({
  template,
  variables,
  onClose,
  onSaved,
}: {
  template: CeremonyTemplate | null;
  variables: CeremonyTemplateVariable[];
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [form, setForm] = useState<FormState>(
    template
      ? { name: template.name, content: template.content, isDefault: template.isDefault }
      : EMPTY_FORM,
  );
  const [saving, setSaving] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const insertVariable = useCallback((key: string) => {
    const token = `{{${key}}}`;
    const el = contentRef.current;
    setForm((prev) => {
      if (!el) return { ...prev, content: prev.content + token };
      const start = el.selectionStart ?? prev.content.length;
      const end = el.selectionEnd ?? prev.content.length;
      const next = prev.content.slice(0, start) + token + prev.content.slice(end);
      requestAnimationFrame(() => {
        el.focus();
        const caret = start + token.length;
        el.setSelectionRange(caret, caret);
      });
      return { ...prev, content: next };
    });
  }, []);

  const handleSave = async () => {
    if (!form.name.trim() || !form.content.trim()) {
      notify.error(null, UI.CEREMONY_TEMPLATE_REQUIRED);
      return;
    }
    setSaving(true);
    try {
      if (template) {
        await api.ceremonies.updateTemplate(template.id, form);
        notify.success(UI.CEREMONY_TEMPLATE_UPDATED);
      } else {
        await api.ceremonies.createTemplate(form);
        notify.success(UI.CEREMONY_TEMPLATE_CREATED);
      }
      await onSaved();
    } catch (err) {
      notify.error(err, UI.CEREMONY_TEMPLATE_ERR_SAVE);
    } finally {
      setSaving(false);
    }
  };

  return (
    <FullScreenSheet
      tone="book"
      title={template ? UI.CEREMONY_TEMPLATE_EDIT : UI.CEREMONY_TEMPLATE_CREATE}
      onClose={onClose}
      headerRight={
        <IconRoundButton icon="save" variant="gold" loading={saving} label={UI.SAVE} onClick={() => void handleSave()} />
      }
    >
      <div className="mx-auto w-full max-w-4xl p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="min-w-0 flex-1 space-y-4">
            <label className="block text-sm">
              <span className={BT.mutedOnDark}>{UI.CEREMONY_TEMPLATE_NAME}</span>
              <input
                className={`${inputClassName} mt-1`}
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                autoFocus
              />
            </label>

            <label className="block text-sm">
              <span className={BT.mutedOnDark}>{UI.CEREMONY_TEMPLATE_CONTENT}</span>
              <p className={`mt-1 text-xs ${BT.mutedOnDark}`}>{UI.CEREMONY_TEMPLATE_CONTENT_HINT}</p>
              <AutoGrowTextarea
                ref={contentRef}
                className={`${inputClassName} mt-2 min-h-[40vh] font-mono text-xs leading-relaxed`}
                value={form.content}
                onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              />
            </label>

            <label className="flex items-center gap-2 text-sm text-amber-50">
              <input
                type="checkbox"
                className="h-4 w-4 accent-amber-600"
                checked={form.isDefault}
                onChange={(e) => setForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
              />
              {UI.CEREMONY_TEMPLATE_SET_DEFAULT}
            </label>
          </div>

          <VariablePicker variables={variables} onInsert={insertVariable} />
        </div>
      </div>
    </FullScreenSheet>
  );
}

function VariablePicker({
  variables,
  onInsert,
}: {
  variables: CeremonyTemplateVariable[];
  onInsert: (key: string) => void;
}) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return variables;
    return variables.filter(
      (v) => v.key.toLowerCase().includes(q) || v.label.toLowerCase().includes(q),
    );
  }, [variables, query]);

  if (variables.length === 0) return null;

  const countLabel = UI.CEREMONY_TEMPLATE_VARIABLES_COUNT.replace('{count}', String(variables.length));

  return (
    <aside className={`${BT.card} flex max-h-[60vh] min-h-0 flex-col p-3 md:sticky md:top-4 md:max-h-[calc(100dvh-12rem)] md:w-72 md:shrink-0`}>
      <div className="flex items-center gap-2">
        <span className="min-w-0 flex-1 text-sm font-semibold text-neutral-900">
          {UI.CEREMONY_TEMPLATE_VARIABLES}
        </span>
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

      <div className="mt-2 min-h-0 flex-1 space-y-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className={`px-1 py-2 text-xs ${BT.mutedOnLight}`}>{UI.CEREMONY_TEMPLATE_VARIABLES_NONE}</p>
        ) : (
          filtered.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => onInsert(item.key)}
              className="flex w-full min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors active:bg-amber-50 md:hover:bg-amber-50"
            >
              <code className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs text-amber-950">
                {`{{${item.key}}}`}
              </code>
              <span className={`min-w-0 flex-1 truncate text-xs ${BT.mutedOnLight}`}>{item.label}</span>
              <Icon path="plus" size={14} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} className="shrink-0 text-amber-600" />
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
