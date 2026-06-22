"use client";

import { useState } from "react";
import IconRoundButton from "@/components/ui/IconRoundButton";
import { inputClassName } from "@/components/ui/CollapsibleSection";
import { BT } from "@/lib/constants/ui-theme";
import { UI } from "@/lib/constants/ui-strings";
import { useOrganizations } from "@/hooks/useOrganizations";
import OrgPublicLinkRow from "./OrgPublicLinkRow";
import OrganizationCreateForm from "./OrganizationCreateForm";
import type { OrganizationWithAccess } from "@/lib/api/modules/organizations";

export default function OrganizationSection() {
  const { items, loading, error, create, update } = useOrganizations();

  if (loading)
    return <p className={`text-sm ${BT.mutedOnDark}`}>{UI.LOADING}</p>;
  if (error) return <p className={BT.errorBg}>{error}</p>;

  return (
    <div className="space-y-4">
      <OrganizationCreateForm onCreate={create} />

      <ul className={`divide-y divide-amber-100 ${BT.panel}`}>
        {items.map((org) => (
          <OrgRow key={org.id} org={org} onSave={update} />
        ))}
      </ul>
    </div>
  );
}

function OrgRow({
  org,
  onSave,
}: {
  org: OrganizationWithAccess;
  onSave: (id: number, name: string) => Promise<void>;
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
      </div>
      <OrgPublicLinkRow name={org.name} publicAccessUrl={org.publicAccessUrl} />
    </li>
  );
}
