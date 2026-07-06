"use client";

import { useEffect, useState } from "react";
import { AC } from "@/components/auth/account-theme";
import { inputClassName } from "@/components/ui/CollapsibleSection";
import IconRoundButton from "@/components/ui/IconRoundButton";
import { api } from "@/lib/api";
import { notify } from "@/lib/notify";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import type { OrganizationWithAccess } from "@/lib/api/modules/organizations";

type Props = {
  organizations: OrganizationWithAccess[];
  variant?: "book" | "landing";
};

export default function DemoOrganizationSelect({
  organizations,
  variant = "book",
}: Props) {
  const isLanding = variant === "landing";
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void api.organizations
      .getDemo()
      .then((demo) => {
        if (cancelled) return;
        setSelectedId(demo?.id ?? null);
        setSavedId(demo?.id ?? null);
      })
      .catch(() => {
        /* không chặn UI nếu chưa cấu hình */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const isDirty = selectedId !== savedId;
  const panelClass = isLanding ? AC.cardPaper : BT.panel;
  const fieldClass = isLanding ? AC.input : inputClassName;
  const titleClass = isLanding
    ? AC.sectionTitle
    : "text-sm font-semibold text-neutral-900";
  const hintClass = isLanding ? AC.muted : BT.mutedOnLight;

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.organizations.setDemo(selectedId);
      setSavedId(selectedId);
      notify.success(UI.SYSTEM_DEMO_ORG_SAVED);
    } catch (err) {
      notify.error(err, UI.ERR_SAVE);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`${panelClass} space-y-3 p-4 md:p-5`}>
      <p className={titleClass}>{UI.SYSTEM_DEMO_ORG_TITLE}</p>
      <p className={`text-xs ${hintClass}`}>{UI.SYSTEM_DEMO_ORG_HINT}</p>
      <div className="flex items-center gap-2">
        <select
          className={`min-w-0 flex-1 ${fieldClass}`}
          value={selectedId ?? ""}
          onChange={(e) =>
            setSelectedId(e.target.value ? Number(e.target.value) : null)
          }
          aria-label={UI.SYSTEM_DEMO_ORG_TITLE}
        >
          <option value="">{UI.SYSTEM_DEMO_ORG_NONE}</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
        {isLanding ? (
          <button
            type="button"
            disabled={!isDirty || saving}
            onClick={() => void handleSave()}
            className="shrink-0 rounded-xl border border-[#d4c3c1] bg-white px-4 py-2 text-sm font-semibold text-[#321716] disabled:opacity-50"
          >
            {UI.SAVE}
          </button>
        ) : (
          <IconRoundButton
            icon="save"
            variant="gold"
            iconSize={16}
            loading={saving}
            disabled={!isDirty}
            label={UI.SAVE}
            onClick={() => void handleSave()}
          />
        )}
      </div>
    </div>
  );
}
