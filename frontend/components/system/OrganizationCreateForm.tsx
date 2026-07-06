"use client";

import { useState } from "react";
import Icon from "@/components/icons/Icon";
import { AC } from "@/components/auth/account-theme";
import IconRoundButton from "@/components/ui/IconRoundButton";
import { inputClassName } from "@/components/ui/CollapsibleSection";
import { BT } from "@/lib/constants/ui-theme";
import { UI } from "@/lib/constants/ui-strings";

type OrganizationCreateFormProps = {
  onCreate: (name: string) => Promise<void>;
  variant?: "book" | "landing";
};

export default function OrganizationCreateForm({
  onCreate,
  variant = "book",
}: OrganizationCreateFormProps) {
  const isLanding = variant === "landing";
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

  const fieldClass = isLanding ? AC.input : inputClassName;
  const cardClass = isLanding ? AC.card : BT.card;

  return (
    <div className={`flex gap-2 ${cardClass} p-3 md:p-4`}>
      <input
        className={`min-w-0 flex-1 ${fieldClass}`}
        placeholder={UI.SYSTEM_ORG_NAME}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") void handleCreate();
        }}
      />
      {isLanding ? (
        <button
          type="button"
          disabled={saving}
          onClick={() => void handleCreate()}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#321716] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          <Icon
            path="plus"
            size={18}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            pointer={false}
          />
          {UI.SYSTEM_ORG_CREATE}
        </button>
      ) : (
        <IconRoundButton
          icon="plus"
          variant="gold"
          loading={saving}
          label={UI.SYSTEM_ORG_CREATE}
          onClick={() => void handleCreate()}
        />
      )}
    </div>
  );
}
