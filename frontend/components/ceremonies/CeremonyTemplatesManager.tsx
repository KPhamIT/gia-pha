'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Icon from '@/components/icons/Icon';
import { api } from '@/lib/api';
import type { CeremonyTemplate, CeremonyTemplateVariable } from '@/lib/api/modules/ceremonies';
import type { Person, Relationship } from '@/components/types/family-tree-types';
import { notify } from '@/lib/notify';
import { UI } from '@/lib/constants/ui-strings';
import { BT } from '@/lib/constants/ui-theme';
import { useAuthStore } from '@/store/authStore';
import FullScreenSheet from '@/components/ui/FullScreenSheet';
import { EMPTY_FORM, type EditTarget } from './ceremony-template-shared';
import TemplatesToolbar from './TemplatesToolbar';
import CeremonyTemplateCard from './CeremonyTemplateCard';
import TemplateEditorSheet from './TemplateEditorSheet';
import CeremonyPrintView from './CeremonyPrintView';

export default function CeremonyTemplatesManager() {
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const [templates, setTemplates] = useState<CeremonyTemplate[]>([]);
  const [variables, setVariables] = useState<CeremonyTemplateVariable[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<EditTarget | null>(null);
  const [printTemplate, setPrintTemplate] = useState<CeremonyTemplate | null>(null);

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

  const sorted = useMemo(
    () => [...templates].sort((a, b) => Number(b.isDefault) - Number(a.isDefault)),
    [templates],
  );

  /** Người đã mất có ngày giỗ âm lịch — điều kiện để render bài cúng. */
  const deceasedPersons = useMemo(
    () => persons.filter((p) => p.deathLunarDay != null && p.deathLunarMonth != null),
    [persons],
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
      initial: { name: template.name + UI.CEREMONY_TEMPLATE_COPY_SUFFIX, content: template.content, isDefault: false },
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
      <TemplatesToolbar isAdmin={isAdmin} onCreate={openCreate} />

      {sorted.length === 0 ? (
        <div className={`${BT.card} p-6 text-center`}>
          <p className={`text-sm ${BT.mutedOnLight}`}>{UI.CEREMONY_TEMPLATE_EMPTY}</p>
          {isAdmin ? (
            <button type="button" className={`mt-4 ${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary} mx-auto`} onClick={openCreate}>
              <Icon path="plus" size={18} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
              {UI.CEREMONY_TEMPLATE_CREATE}
            </button>
          ) : null}
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {sorted.map((template) => (
            <CeremonyTemplateCard
              key={template.id}
              template={template}
              isAdmin={isAdmin}
              onPrint={() => setPrintTemplate(template)}
              onSetDefault={() => void handleSetDefault(template.id)}
              onDuplicate={() => openDuplicate(template)}
              onEdit={() => openEdit(template)}
              onDelete={() => void handleDelete(template)}
            />
          ))}
        </ul>
      )}

      {target ? (
        <TemplateEditorSheet
          target={target}
          variables={variables}
          persons={deceasedPersons}
          relationships={relationships}
          onClose={() => setTarget(null)}
          onSaved={async () => {
            setTarget(null);
            await reload();
          }}
        />
      ) : null}

      {printTemplate ? (
        <FullScreenSheet tone="book" title={UI.CEREMONY_PRINT_TITLE} onClose={() => setPrintTemplate(null)}>
          <div className="mx-auto w-full max-w-3xl space-y-4 p-4 md:p-6">
            <p className={`text-sm font-medium ${BT.mutedOnDark}`}>{printTemplate.name}</p>
            <CeremonyPrintView templateId={printTemplate.id} persons={deceasedPersons} relationships={relationships} />
          </div>
        </FullScreenSheet>
      ) : null}
    </div>
  );
}
