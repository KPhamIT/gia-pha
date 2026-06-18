'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
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

/** Either edit an existing template or create one from a prefilled draft. */
type EditTarget = { template: CeremonyTemplate | null; initial: FormState };

/** Matches {{key}} or {key} variable tokens. */
const TOKEN_RE = /\{\{\s*([\w.]+)\s*\}\}|\{\s*([\w.]+)\s*\}/g;

/** Tiêu đề nhóm biến (theo prefix của key) bằng tiếng Việt. */
const NS_LABELS: Record<string, string> = {
  person: UI.CEREMONY_TEMPLATE_NS_PERSON,
  organization: UI.CEREMONY_TEMPLATE_NS_ORGANIZATION,
  ceremony: UI.CEREMONY_TEMPLATE_NS_CEREMONY,
  today: UI.CEREMONY_TEMPLATE_NS_TODAY,
  worshipper: UI.CEREMONY_TEMPLATE_NS_WORSHIPPER,
};
const nsLabel = (ns: string) => NS_LABELS[ns] ?? (ns === '•' ? UI.CEREMONY_TEMPLATE_NS_OTHER : ns);

export default function CeremonyTemplatesManager() {
  const [templates, setTemplates] = useState<CeremonyTemplate[]>([]);
  const [variables, setVariables] = useState<CeremonyTemplateVariable[]>([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<EditTarget | null>(null);

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

  const openCreate = () => setTarget({ template: null, initial: EMPTY_FORM });
  const openEdit = (template: CeremonyTemplate) =>
    setTarget({
      template,
      initial: { name: template.name, content: template.content, isDefault: template.isDefault },
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
            onClick={openCreate}
            className="w-full shrink-0 sm:w-auto"
          />
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className={`${BT.card} p-6 text-center`}>
          <p className={`text-sm ${BT.mutedOnLight}`}>{UI.CEREMONY_TEMPLATE_EMPTY}</p>
          <button type="button" className={`mt-4 ${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary} mx-auto`} onClick={openCreate}>
            <Icon path="plus" size={18} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
            {UI.CEREMONY_TEMPLATE_CREATE}
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {sorted.map((template) => (
            <li key={template.id} className={`${BT.card} flex flex-col p-3 md:p-4`}>
              <button type="button" onClick={() => openEdit(template)} className="min-w-0 flex-1 text-left">
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
                <IconRoundButton icon="userPlus" variant="outline" onClick={() => openDuplicate(template)} aria-label={UI.CEREMONY_TEMPLATE_DUPLICATE} />
                <IconRoundButton icon="edit" variant="outline" onClick={() => openEdit(template)} aria-label={UI.BTN_EDIT} />
                <IconRoundButton icon="trash" variant="danger" onClick={() => void handleDelete(template)} aria-label={UI.DELETE_PERSON} />
              </div>
            </li>
          ))}
        </ul>
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
    </div>
  );
}

function TemplateEditorSheet({
  target,
  variables,
  onClose,
  onSaved,
}: {
  target: EditTarget;
  variables: CeremonyTemplateVariable[];
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const { template, initial } = target;
  const [form, setForm] = useState<FormState>(initial);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const knownKeys = useMemo(() => new Set(variables.map((v) => v.key)), [variables]);
  const unknownCount = useMemo(() => {
    let n = 0;
    for (const m of form.content.matchAll(TOKEN_RE)) {
      const key = m[1] ?? m[2];
      if (key && !knownKeys.has(key)) n += 1;
    }
    return n;
  }, [form.content, knownKeys]);

  const dirty =
    form.name !== initial.name || form.content !== initial.content || form.isDefault !== initial.isDefault;

  const insertVariable = useCallback((key: string) => {
    const token = `{{${key}}}`;
    const el = contentRef.current;
    setTab('edit');
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

  const handleSave = useCallback(async () => {
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
  }, [form, template, onSaved]);

  const requestClose = useCallback(() => {
    if (dirty && !window.confirm(UI.CEREMONY_TEMPLATE_UNSAVED_CONFIRM)) return;
    onClose();
  }, [dirty, onClose]);

  // Ctrl/Cmd+S saves without leaving the editor.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        void handleSave();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleSave]);

  return (
    <FullScreenSheet
      tone="book"
      title={template ? UI.CEREMONY_TEMPLATE_EDIT : UI.CEREMONY_TEMPLATE_CREATE}
      onClose={requestClose}
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

            <div className="text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={BT.mutedOnDark}>{UI.CEREMONY_TEMPLATE_CONTENT}</span>
                <div className="flex gap-1 rounded-full bg-white/10 p-0.5">
                  {(['edit', 'preview'] as const).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTab(key)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        tab === key ? 'bg-amber-100 text-amber-950' : 'text-amber-100/80 active:bg-white/10'
                      }`}
                    >
                      {key === 'edit' ? UI.CEREMONY_TEMPLATE_TAB_EDIT : UI.CEREMONY_TEMPLATE_TAB_PREVIEW}
                    </button>
                  ))}
                </div>
              </div>
              <p className={`mt-1 text-xs ${BT.mutedOnDark}`}>{UI.CEREMONY_TEMPLATE_CONTENT_HINT}</p>

              {tab === 'edit' ? (
                <AutoGrowTextarea
                  ref={contentRef}
                  className={`${inputClassName} mt-2 min-h-[40vh] font-mono text-xs leading-relaxed`}
                  value={form.content}
                  onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                />
              ) : (
                <TemplatePreview content={form.content} variables={variables} knownKeys={knownKeys} />
              )}

              {unknownCount > 0 ? (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-red-300">
                  <Icon path="alertTriangle" size={14} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
                  {UI.CEREMONY_TEMPLATE_UNKNOWN_COUNT.replace('{count}', String(unknownCount))}
                </p>
              ) : null}
            </div>

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

/** Renders content with recognized variables highlighted and unknown ones flagged. */
function TemplatePreview({
  content,
  variables,
  knownKeys,
}: {
  content: string;
  variables: CeremonyTemplateVariable[];
  knownKeys: Set<string>;
}) {
  const labelByKey = useMemo(
    () => new Map(variables.map((v) => [v.key, v.label])),
    [variables],
  );

  const nodes = useMemo<ReactNode[]>(() => {
    if (!content.trim()) return [];
    const out: ReactNode[] = [];
    let last = 0;
    let i = 0;
    for (const m of content.matchAll(TOKEN_RE)) {
      const idx = m.index ?? 0;
      if (idx > last) out.push(content.slice(last, idx));
      const key = m[1] ?? m[2] ?? '';
      const known = knownKeys.has(key);
      out.push(
        <span
          key={`tok-${i}`}
          title={known ? labelByKey.get(key) : UI.CEREMONY_TEMPLATE_UNKNOWN_VAR}
          className={`rounded px-1 py-0.5 font-medium ${
            known ? 'bg-amber-100 text-amber-900' : 'bg-red-100 text-red-700 line-through decoration-red-400'
          }`}
        >
          {known ? labelByKey.get(key) : m[0]}
        </span>,
      );
      last = idx + m[0].length;
      i += 1;
    }
    if (last < content.length) out.push(content.slice(last));
    return out;
  }, [content, knownKeys, labelByKey]);

  return (
    <div className={`${BT.panel} mt-2 min-h-[40vh] whitespace-pre-wrap p-3 font-mono text-xs leading-relaxed`}>
      {nodes.length === 0 ? (
        <span className={BT.mutedOnLight}>{UI.CEREMONY_TEMPLATE_PREVIEW_EMPTY}</span>
      ) : (
        nodes
      )}
    </div>
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
