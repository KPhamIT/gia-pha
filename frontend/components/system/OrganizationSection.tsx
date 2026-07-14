"use client";

import { useEffect, useMemo, useState } from "react";
import { AC } from "@/components/auth/account-theme";
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
import {
  formatCoordInput,
  parseCoordPair,
} from "@/utils/clan-coords";
import { notify } from "@/lib/notify";

function normalizeYearInput(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 4);
}

type Props = {
  variant?: "book" | "landing";
};

export default function OrganizationSection({ variant = "book" }: Props) {
  const isLanding = variant === "landing";
  const { items, loading, error, create, update } = useOrganizations();

  const loadingClass = isLanding ? AC.muted : BT.mutedOnDark;
  const errorClass = isLanding
    ? "rounded-lg bg-[#ffdad6] px-3 py-2 text-sm text-[#93000a]"
    : BT.errorBg;
  const listClass = isLanding
    ? `divide-y divide-[#d4c3c1] ${AC.card}`
    : `divide-y divide-amber-100 ${BT.panel}`;

  if (loading) return <p className={`text-sm ${loadingClass}`}>{UI.LOADING}</p>;
  if (error) return <p className={errorClass}>{error}</p>;

  return (
    <div className="space-y-4">
      <OrganizationCreateForm variant={variant} onCreate={create} />
      <DemoOrganizationSelect variant={variant} organizations={items} />
      <ul className={listClass}>
        {items.map((org) => (
          <OrgRow key={org.id} variant={variant} org={org} onSave={update} />
        ))}
      </ul>
    </div>
  );
}

function OrgRow({
  org,
  variant,
  onSave,
}: {
  org: OrganizationWithAccess;
  variant: "book" | "landing";
  onSave: (id: number, body: UpdateOrganizationInput) => Promise<void>;
}) {
  const isLanding = variant === "landing";
  const fieldClass = isLanding ? AC.input : inputClassName;
  const hintClass = isLanding ? AC.muted : BT.mutedOnLight;

  const [name, setName] = useState(org.name);
  const [establishedYear, setEstablishedYear] = useState(
    org.establishedYear ?? "",
  );
  const [clanAddress, setClanAddress] = useState(org.clanAddress ?? "");
  const [clanLat, setClanLat] = useState(formatCoordInput(org.clanLat));
  const [clanLng, setClanLng] = useState(formatCoordInput(org.clanLng));
  const [clanMapEmbedUrl, setClanMapEmbedUrl] = useState(
    org.clanMapEmbedUrl ?? "",
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(org.name);
    setEstablishedYear(org.establishedYear ?? "");
    setClanAddress(org.clanAddress ?? "");
    setClanLat(formatCoordInput(org.clanLat));
    setClanLng(formatCoordInput(org.clanLng));
    setClanMapEmbedUrl(org.clanMapEmbedUrl ?? "");
  }, [org]);

  const isDirty = useMemo(() => {
    return (
      name.trim() !== org.name ||
      normalizeYearInput(establishedYear) !==
        normalizeYearInput(org.establishedYear ?? "") ||
      clanAddress.trim() !== (org.clanAddress ?? "").trim() ||
      clanMapEmbedUrl.trim() !== (org.clanMapEmbedUrl ?? "").trim() ||
      clanLat.trim() !== formatCoordInput(org.clanLat) ||
      clanLng.trim() !== formatCoordInput(org.clanLng)
    );
  }, [org, name, establishedYear, clanAddress, clanLat, clanLng, clanMapEmbedUrl]);

  const handleSave = async () => {
    if (!isDirty) return;
    const coords = parseCoordPair(clanLat, clanLng);
    if (!coords) {
      notify.error(null, UI.ORG_BOOK_CLAN_COORDS_INVALID);
      return;
    }
    setSaving(true);
    try {
      await onSave(org.id, {
        name: name.trim(),
        establishedYear: normalizeYearInput(establishedYear),
        clanAddress: clanAddress.trim(),
        clanMapEmbedUrl: clanMapEmbedUrl.trim(),
        clanLat: coords.lat,
        clanLng: coords.lng,
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
    <li className="flex flex-col gap-3 p-4 md:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          className={`min-w-0 flex-1 ${fieldClass}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label={UI.SYSTEM_ORG_NAME}
        />
        <div className="flex shrink-0 gap-1">
          {isLanding ? (
            <button
              type="button"
              disabled={!isDirty || saving}
              onClick={() => void handleSave()}
              className="rounded-xl bg-[#944a00] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
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

      <div className="grid gap-2 sm:grid-cols-2">
        <FormField label={UI.ORG_BOOK_ESTABLISHED_YEAR_LABEL}>
          <input
            className={fieldClass}
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
            className={fieldClass}
            value={clanAddress}
            onChange={(e) => setClanAddress(e.target.value)}
          />
        </FormField>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <FormField label={UI.ORG_BOOK_CLAN_LAT_LABEL}>
          <input
            className={fieldClass}
            inputMode="decimal"
            value={clanLat}
            placeholder="21.0285"
            onChange={(e) => setClanLat(e.target.value)}
          />
        </FormField>
        <FormField label={UI.ORG_BOOK_CLAN_LNG_LABEL}>
          <input
            className={fieldClass}
            inputMode="decimal"
            value={clanLng}
            placeholder="105.8542"
            onChange={(e) => setClanLng(e.target.value)}
          />
        </FormField>
      </div>
      <p className={`-mt-1 text-xs ${hintClass}`}>{UI.ORG_BOOK_CLAN_COORDS_HINT}</p>

      <FormField label={UI.ORG_BOOK_MAP_EMBED_LABEL}>
        <textarea
          className={`${fieldClass} min-h-[4.5rem]`}
          value={clanMapEmbedUrl}
          placeholder={UI.ORG_BOOK_MAP_EMBED_PLACEHOLDER}
          onChange={(e) => setClanMapEmbedUrl(e.target.value)}
        />
        <p className={`mt-1 text-xs ${hintClass}`}>
          {UI.ORG_BOOK_MAP_EMBED_HINT}
        </p>
      </FormField>

      <OrgPublicLinkRow
        variant={variant}
        name={org.name}
        publicAccessUrl={org.publicAccessUrl}
      />
    </li>
  );
}
