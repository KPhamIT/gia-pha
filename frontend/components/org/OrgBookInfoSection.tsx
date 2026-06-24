"use client";

import { useEffect, useMemo, useState } from "react";
import IconRoundButton from "@/components/ui/IconRoundButton";
import { FormField, inputClassName } from "@/components/ui/CollapsibleSection";
import { BT } from "@/lib/constants/ui-theme";
import { UI } from "@/lib/constants/ui-strings";
import { useOrganizations } from "@/hooks/useOrganizations";
import { invalidateUserSettingsCache } from "@/lib/settings/user-settings-cache";
import { invalidateOrgBookContext } from "@/lib/org/org-book-context";

function normalizeYearInput(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 4);
}

/** Admin chỉnh năm lập gia phả & địa chỉ dòng họ (lưu trên Organization). */
export default function OrgBookInfoSection() {
  const { items, loading, error, update } = useOrganizations();
  const org = items[0] ?? null;

  const [establishedYear, setEstablishedYear] = useState("");
  const [clanAddress, setClanAddress] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!org) return;
    setEstablishedYear(org.establishedYear ?? "");
    setClanAddress(org.clanAddress ?? "");
  }, [org]);

  const isDirty = useMemo(() => {
    if (!org) return false;
    return (
      normalizeYearInput(establishedYear) !==
        normalizeYearInput(org.establishedYear ?? "") ||
      clanAddress.trim() !== (org.clanAddress ?? "").trim()
    );
  }, [org, establishedYear, clanAddress]);

  const handleSave = async () => {
    if (!org || !isDirty) return;
    setSaving(true);
    try {
      await update(org.id, {
        name: org.name,
        establishedYear: normalizeYearInput(establishedYear),
        clanAddress: clanAddress.trim(),
      });
      invalidateUserSettingsCache();
      invalidateOrgBookContext();
    } catch {
      /* toast in useOrganizations */
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className={`text-sm ${BT.mutedOnDark}`}>{UI.LOADING}</p>;
  }
  if (error) {
    return <p className={BT.errorBg}>{error}</p>;
  }
  if (!org) {
    return (
      <p className={`text-sm ${BT.mutedOnDark}`}>{UI.SYSTEM_USER_ORG_REQUIRED}</p>
    );
  }

  return (
    <div className={`space-y-4 ${BT.panel} p-4`}>
      <div>
        <h2 className="text-base font-semibold text-amber-950">
          {UI.ORG_BOOK_INFO_TITLE}
        </h2>
        <p className={`mt-1 text-sm ${BT.mutedOnLight}`}>{UI.ORG_BOOK_INFO_HINT}</p>
      </div>

      <FormField label={UI.ORG_BOOK_ESTABLISHED_YEAR_LABEL}>
        <input
          className={inputClassName}
          inputMode="numeric"
          maxLength={4}
          value={establishedYear}
          placeholder={UI.ORG_BOOK_ESTABLISHED_YEAR_PLACEHOLDER}
          onChange={(e) => setEstablishedYear(normalizeYearInput(e.target.value))}
        />
      </FormField>

      <FormField label={UI.ORG_BOOK_CLAN_ADDRESS_LABEL}>
        <input
          className={inputClassName}
          value={clanAddress}
          placeholder={UI.ORG_BOOK_CLAN_ADDRESS_PLACEHOLDER}
          onChange={(e) => setClanAddress(e.target.value)}
        />
      </FormField>

      <div className="flex justify-end">
        <IconRoundButton
          icon="save"
          variant="gold"
          label={UI.SAVE}
          loading={saving}
          disabled={!isDirty}
          onClick={() => void handleSave()}
        />
      </div>
    </div>
  );
}
