"use client";

import { useEffect, useState } from "react";
import { inputClassName } from "@/components/ui/CollapsibleSection";
import IconRoundButton from "@/components/ui/IconRoundButton";
import { api } from "@/lib/api";
import { notify } from "@/lib/notify";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import type { OrganizationWithAccess } from "@/lib/api/modules/organizations";

type Props = {
  organizations: OrganizationWithAccess[];
};

/** SYSTEM chọn org làm dữ liệu demo công khai ở trang chủ. */
export default function DemoOrganizationSelect({ organizations }: Props) {
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
    <div className={`${BT.panel} space-y-2 p-3`}>
      <p className="text-sm font-semibold text-neutral-900">
        {UI.SYSTEM_DEMO_ORG_TITLE}
      </p>
      <p className={`text-xs ${BT.mutedOnLight}`}>{UI.SYSTEM_DEMO_ORG_HINT}</p>
      <div className="flex items-center gap-2">
        <select
          className={`min-w-0 flex-1 ${inputClassName}`}
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
        <IconRoundButton
          icon="save"
          variant="gold"
          iconSize={16}
          loading={saving}
          disabled={!isDirty}
          label={UI.SAVE}
          onClick={() => void handleSave()}
        />
      </div>
    </div>
  );
}
