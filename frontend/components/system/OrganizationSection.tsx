"use client";

import { useState } from "react";
import IconRoundButton from "@/components/ui/IconRoundButton";
import { inputClassName } from "@/components/ui/CollapsibleSection";
import { BT } from "@/lib/constants/ui-theme";
import { UI } from "@/lib/constants/ui-strings";
import { useOrganizations } from "@/hooks/useOrganizations";

export default function OrganizationSection() {
  const { items, loading, error, create, update, remove } = useOrganizations();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await create(name.trim());
      setName("");
    } catch {
      /* toast shown in useOrganizations */
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <p className={`text-sm ${BT.mutedOnDark}`}>{UI.LOADING}</p>;
  if (error) return <p className={BT.errorBg}>{error}</p>;

  return (
    <div className="space-y-4">
      <div className={`flex gap-2 ${BT.card} p-3`}>
        <input
          className={`min-w-0 flex-1 ${inputClassName}`}
          placeholder={UI.SYSTEM_ORG_NAME}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <IconRoundButton
          icon="plus"
          variant="gold"
          loading={saving}
          label={UI.BTN_CREATE}
          onClick={() => void handleCreate()}
        />
      </div>

      <ul className={`divide-y divide-amber-100 ${BT.panel}`}>
        {items.map((org) => (
          <OrgRow key={org.id} org={org} onSave={update} onDelete={remove} />
        ))}
      </ul>
    </div>
  );
}

function OrgRow({
  org,
  onSave,
  onDelete,
}: {
  org: { id: number; name: string };
  onSave: (id: number, name: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const [name, setName] = useState(org.name);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (name.trim() === org.name) return;
    setSaving(true);
    try {
      await onSave(org.id, name.trim());
    } catch {
      /* toast shown in useOrganizations */
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(UI.SYSTEM_ORG_DELETE_CONFIRM)) return;
    try {
      await onDelete(org.id);
    } catch {
      /* toast shown in useOrganizations */
    }
  };

  return (
    <li className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center">
      <input
        className={`min-w-0 flex-1 ${inputClassName}`}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="flex shrink-0 gap-1">
        <IconRoundButton
          icon="save"
          variant="gold"
          iconSize={16}
          loading={saving}
          label={UI.SAVE}
          onClick={() => void handleSave()}
        />
        <IconRoundButton
          icon="trash"
          variant="danger"
          iconSize={16}
          label={UI.DELETE_PERSON}
          onClick={() => void handleDelete()}
        />
      </div>
    </li>
  );
}
