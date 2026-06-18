'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
import { inputClassName } from '@/components/ui/CollapsibleSection';

const EMPTY_FORM = { name: '', content: '', isDefault: false };

export default function CeremonyTemplatesManager() {
  const [templates, setTemplates] = useState<CeremonyTemplate[]>([]);
  const [variables, setVariables] = useState<CeremonyTemplateVariable[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLElement | null>(null);

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

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const openEdit = (template: CeremonyTemplate) => {
    setEditingId(template.id);
    setForm({
      name: template.name,
      content: template.content,
      isDefault: template.isDefault,
    });
    setShowForm(true);
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.content.trim()) {
      notify.error(null, UI.CEREMONY_TEMPLATE_REQUIRED);
      return;
    }

    setSaving(true);
    try {
      if (editingId != null) {
        await api.ceremonies.updateTemplate(editingId, form);
        notify.success(UI.CEREMONY_TEMPLATE_UPDATED);
      } else {
        await api.ceremonies.createTemplate(form);
        notify.success(UI.CEREMONY_TEMPLATE_CREATED);
      }
      closeForm();
      await reload();
    } catch (err) {
      notify.error(err, UI.CEREMONY_TEMPLATE_ERR_SAVE);
    } finally {
      setSaving(false);
    }
  };

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

      <VariableHelp variables={variables} />

      {showForm ? (
        <section ref={formRef} className={`${BT.card} space-y-3 p-3 md:p-4`}>
          <h2 className="text-sm font-semibold text-neutral-900">
            {editingId != null ? UI.CEREMONY_TEMPLATE_EDIT : UI.CEREMONY_TEMPLATE_CREATE}
          </h2>
          <label className="block text-sm">
            <span className={BT.mutedOnLight}>{UI.CEREMONY_TEMPLATE_NAME}</span>
            <input
              className={`${inputClassName} mt-1`}
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            />
          </label>
          <label className="block text-sm">
            <span className={BT.mutedOnLight}>{UI.CEREMONY_TEMPLATE_CONTENT}</span>
            <p className={`mt-1 text-xs ${BT.mutedOnLight}`}>{UI.CEREMONY_TEMPLATE_CONTENT_HINT}</p>
            <AutoGrowTextarea
              className={`${inputClassName} mt-2 font-mono text-xs leading-relaxed`}
              value={form.content}
              onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-neutral-800">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
            />
            {UI.CEREMONY_TEMPLATE_SET_DEFAULT}
          </label>
          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" className={`${BT.btnBase} ${BT.btnSm} ${BT.btnOnDark}`} onClick={closeForm}>
              {UI.CANCEL}
            </button>
            <IconRoundButton icon="save" variant="gold" loading={saving} label={UI.SAVE} onClick={() => void handleSave()} />
          </div>
        </section>
      ) : null}

      {templates.length === 0 ? (
        <p className={`text-sm ${BT.mutedOnDark}`}>{UI.CEREMONY_TEMPLATE_EMPTY}</p>
      ) : (
        <ul className="space-y-3">
          {templates.map((template) => (
            <li key={template.id} className={`${BT.card} p-3 md:p-4`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-neutral-900">{template.name}</p>
                  {template.isDefault ? (
                    <span className={`mt-1 inline-block text-xs font-medium ${BT.gold}`}>
                      {UI.CEREMONY_TEMPLATE_DEFAULT_BADGE}
                    </span>
                  ) : null}
                  <p className={`mt-2 line-clamp-4 font-mono text-xs leading-relaxed ${BT.mutedOnLight}`}>
                    {template.content}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  {!template.isDefault ? (
                    <button
                      type="button"
                      className={`${BT.btnBase} ${BT.btnSm} ${BT.btnOutline}`}
                      onClick={() => void handleSetDefault(template.id)}
                    >
                      {UI.CEREMONY_TEMPLATE_USE_DEFAULT}
                    </button>
                  ) : null}
                  <IconRoundButton icon="edit" variant="outline" label={UI.BTN_EDIT} onClick={() => openEdit(template)} />
                  <IconRoundButton
                    icon="trash"
                    variant="danger"
                    label={UI.DELETE_PERSON}
                    onClick={() => void handleDelete(template)}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function VariableHelp({ variables }: { variables: CeremonyTemplateVariable[] }) {
  const [open, setOpen] = useState(false);

  if (variables.length === 0) return null;

  const countLabel = UI.CEREMONY_TEMPLATE_VARIABLES_COUNT.replace('{count}', String(variables.length));

  return (
    <section className={`overflow-hidden ${BT.card}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center gap-3 px-3 py-3 text-left active:bg-amber-50/80 md:px-4"
        aria-expanded={open}
      >
        <span className="min-w-0 flex-1 text-sm font-semibold text-neutral-900">{UI.CEREMONY_TEMPLATE_VARIABLES}</span>
        <span className={`shrink-0 text-xs ${BT.mutedOnLight}`}>{countLabel}</span>
        <Icon
          path={open ? 'chevronUp' : 'chevronDown'}
          size={18}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          pointer={false}
          className="shrink-0 text-neutral-500"
        />
      </button>

      {open ? (
        <div className="max-h-[min(50vh,18rem)] overflow-y-auto border-t border-amber-200/60 px-3 py-3 md:px-4">
          <ul className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
            {variables.map((item) => (
              <li key={item.key} className="min-w-0 leading-snug">
                <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs text-amber-950">{`{{${item.key}}}`}</code>
                <span className={`ml-1.5 ${BT.mutedOnLight}`}>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
