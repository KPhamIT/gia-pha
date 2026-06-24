"use client";

import { useEffect, useMemo, useState } from "react";
import IconRoundButton from "@/components/ui/IconRoundButton";
import { FormField, inputClassName } from "@/components/ui/CollapsibleSection";
import { BT } from "@/lib/constants/ui-theme";
import { UI } from "@/lib/constants/ui-strings";
import { useOrganizations } from "@/hooks/useOrganizations";
import OrgPublicLinkRow from "./OrgPublicLinkRow";
import OrganizationCreateForm from "./OrganizationCreateForm";
import DemoOrganizationSelect from "./DemoOrganizationSelect";
import type {
  OrganizationWithAccess,
  UpdateOrganizationInput,
} from "@/lib/api/modules/organizations";
import { invalidateUserSettingsCache } from "@/lib/settings/user-settings-cache";
import { invalidateOrgBookContext } from "@/lib/org/org-book-context";

function normalizeYearInput(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 4);
}

export default function OrganizationSection() {
  const { items, loading, error, create, update } = useOrganizations();

  if (loading)
    return <p className={`text-sm ${BT.mutedOnDark}`}>{UI.LOADING}</p>;
  if (error) return <p className={BT.errorBg}>{error}</p>;

  return (
    <div className="space-y-4">
      <OrganizationCreateForm onCreate={create} />

      <DemoOrganizationSelect organizations={items} />

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
  onSave: (id: number, body: UpdateOrganizationInput) => Promise<void>;
}) {
  const [name, setName] = useState(org.name);
  const [establishedYear, setEstablishedYear] = useState(
    org.establishedYear ?? "",
  );
  const [clanAddress, setClanAddress] = useState(org.clanAddress ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(org.name);
    setEstablishedYear(org.establishedYear ?? "");
    setClanAddress(org.clanAddress ?? "");
  }, [org]);

  const isDirty = useMemo(
    () =>
      name.trim() !== org.name ||
      normalizeYearInput(establishedYear) !==
        normalizeYearInput(org.establishedYear ?? "") ||
      clanAddress.trim() !== (org.clanAddress ?? "").trim(),
    [org, name, establishedYear, clanAddress],
  );

  const handleSave = async () => {
    if (!isDirty) return;
    setSaving(true);
    try {
      await onSave(org.id, {
        name: name.trim(),
        establishedYear: normalizeYearInput(establishedYear),
        clanAddress: clanAddress.trim(),
      });
      invalidateUserSettingsCache();
      invalidateOrgBookContext();
    } catch {
      /* toast shown in useOrganizations */
    } finally {
      setSaving(false);
    }
  };

  return (
    <li className="flex flex-col gap-3 p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          className={`min-w-0 flex-1 ${inputClassName}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label={UI.SYSTEM_ORG_NAME}
        />
        <div className="flex shrink-0 gap-1">
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

      <div className="grid gap-2 sm:grid-cols-2">
        <FormField label={UI.ORG_BOOK_ESTABLISHED_YEAR_LABEL}>
          <input
            className={inputClassName}
            inputMode="numeric"
            maxLength={4}
            value={establishedYear}
            onChange={(e) =>
              setEstablishedYear(normalizeYearInput(e.target.value))
            }
          />
        </FormField>
        <FormField label={UI.ORG_BOOK_CLAN_ADDRESS_LABEL}>
          <input
            className={inputClassName}
            value={clanAddress}
            onChange={(e) => setClanAddress(e.target.value)}
          />
        </FormField>
      </div>

      <OrgPublicLinkRow name={org.name} publicAccessUrl={org.publicAccessUrl} />
    </li>
  );
}
