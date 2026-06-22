"use client";

import { useState } from "react";
import IconRoundButton from "@/components/ui/IconRoundButton";
import { inputClassName } from "@/components/ui/CollapsibleSection";
import { BT } from "@/lib/constants/ui-theme";
import { UI } from "@/lib/constants/ui-strings";

type OrganizationCreateFormProps = {
  onCreate: (name: string) => Promise<void>;
};

export default function OrganizationCreateForm({
  onCreate,
}: OrganizationCreateFormProps) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      await onCreate(trimmed);
      setName("");
    } catch {
      /* toast shown in useOrganizations */
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`flex gap-2 ${BT.card} p-3`}>
      <input
        className={`min-w-0 flex-1 ${inputClassName}`}
        placeholder={UI.SYSTEM_ORG_NAME}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") void handleCreate();
        }}
      />
      <IconRoundButton
        icon="plus"
        variant="gold"
        loading={saving}
        label={UI.SYSTEM_ORG_CREATE}
        onClick={() => void handleCreate()}
      />
    </div>
  );
}
