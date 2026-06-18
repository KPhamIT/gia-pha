'use client';

import { useCallback, useEffect, useState } from 'react';
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
  };

  const openEdit = (template: CeremonyTemplate) => {
    setEditingId(template.id);
    setForm({
      name: template.name,
      content: template.content,
      isDefault: template.isDefault,
    });
    setShowForm(true);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <p className={`text-sm ${BT.mutedOnDark}`}>{UI.CEREMONY_TEMPLATE_HINT}</p>
        <IconRoundButton icon="plus" variant="gold" label={UI.CEREMONY_TEMPLATE_CREATE} onClick={openCreate} />
      </div>

      <VariableHelp variables={variables} />

      {showForm ? (
        <section className={`${BT.card} space-y-3 p-4`}>
          <h2 className="text-sm font-semibold">
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
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
            />
            {UI.CEREMONY_TEMPLATE_SET_DEFAULT}
          </label>
          <div className="flex justify-end gap-2">
            <button type="button" className={`${BT.btnBase} ${BT.btnSm} ${BT.btnGhost}`} onClick={closeForm}>
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
            <li key={template.id} className={`${BT.card} p-4`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold">{template.name}</p>
                  {template.isDefault ? (
                    <span className={`mt-1 inline-block text-xs ${BT.gold}`}>{UI.CEREMONY_TEMPLATE_DEFAULT_BADGE}</span>
                  ) : null}
                  <p className={`mt-2 line-clamp-3 font-mono text-xs ${BT.mutedOnLight}`}>{template.content}</p>
                </div>
                <div className="flex shrink-0 gap-2">
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
  if (variables.length === 0) return null;

  return (
    <section className={`${BT.card} p-4`}>
      <h2 className="text-sm font-semibold">{UI.CEREMONY_TEMPLATE_VARIABLES}</h2>
      <ul className={`mt-2 space-y-1 text-sm ${BT.mutedOnLight}`}>
        {variables.map((item) => (
          <li key={item.key}>
            <code className="text-amber-100">{`{{${item.key}}}`}</code> — {item.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
