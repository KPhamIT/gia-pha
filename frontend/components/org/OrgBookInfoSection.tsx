"use client";

import { useEffect, useMemo, useState } from "react";
import { AC } from "@/components/auth/account-theme";
import IconRoundButton from "@/components/ui/IconRoundButton";
import { FormField, inputClassName } from "@/components/ui/CollapsibleSection";
import { BT } from "@/lib/constants/ui-theme";
import { UI } from "@/lib/constants/ui-strings";
import { useOrganizations } from "@/hooks/useOrganizations";
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

export default function OrgBookInfoSection({ variant = "book" }: Props) {
  const isLanding = variant === "landing";
  const { items, loading, error, update } = useOrganizations();
  const org = items[0] ?? null;

  const [establishedYear, setEstablishedYear] = useState("");
  const [clanAddress, setClanAddress] = useState("");
  const [clanLat, setClanLat] = useState("");
  const [clanLng, setClanLng] = useState("");
  const [clanMapEmbedUrl, setClanMapEmbedUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!org) return;
    setEstablishedYear(org.establishedYear ?? "");
    setClanAddress(org.clanAddress ?? "");
    setClanLat(formatCoordInput(org.clanLat));
    setClanLng(formatCoordInput(org.clanLng));
    setClanMapEmbedUrl(org.clanMapEmbedUrl ?? "");
  }, [org]);

  const isDirty = useMemo(() => {
    if (!org) return false;
    return (
      normalizeYearInput(establishedYear) !==
        normalizeYearInput(org.establishedYear ?? "") ||
      clanAddress.trim() !== (org.clanAddress ?? "").trim() ||
      clanMapEmbedUrl.trim() !== (org.clanMapEmbedUrl ?? "").trim() ||
      clanLat.trim() !== formatCoordInput(org.clanLat) ||
      clanLng.trim() !== formatCoordInput(org.clanLng)
    );
  }, [org, establishedYear, clanAddress, clanLat, clanLng, clanMapEmbedUrl]);

  const handleSave = async () => {
    if (!org || !isDirty) return;
    const coords = parseCoordPair(clanLat, clanLng);
    if (!coords) {
      notify.error(null, UI.ORG_BOOK_CLAN_COORDS_INVALID);
      return;
    }
    setSaving(true);
    try {
      await update(org.id, {
        name: org.name,
        establishedYear: normalizeYearInput(establishedYear),
        clanAddress: clanAddress.trim(),
        clanMapEmbedUrl: clanMapEmbedUrl.trim(),
        clanLat: coords.lat,
        clanLng: coords.lng,
      });
      invalidateUserSettingsCache();
      invalidateOrgBookContext();
    } catch {
      /* toast in useOrganizations */
    } finally {
      setSaving(false);
    }
  };

  const loadingClass = isLanding ? AC.muted : BT.mutedOnDark;
  const errorClass = isLanding
    ? "rounded-lg bg-[#ffdad6] px-3 py-2 text-sm text-[#93000a]"
    : BT.errorBg;
  const panelClass = isLanding ? AC.cardPaper : BT.panel;
  const fieldInputClass = isLanding ? AC.input : inputClassName;
  const hintClass = isLanding ? AC.muted : BT.mutedOnLight;

  if (loading) {
    return <p className={`text-sm ${loadingClass}`}>{UI.LOADING}</p>;
  }
  if (error) {
    return <p className={errorClass}>{error}</p>;
  }
  if (!org) {
    return (
      <p className={`text-sm ${loadingClass}`}>{UI.SYSTEM_USER_ORG_REQUIRED}</p>
    );
  }

  return (
    <div className={`space-y-4 ${panelClass} p-5 md:p-6`}>
      <div>
        <h2
          className={
            isLanding
              ? AC.sectionTitle
              : "text-base font-semibold text-amber-950"
          }
        >
          {UI.ORG_BOOK_INFO_TITLE}
        </h2>
        <p className={`mt-1 text-sm ${hintClass}`}>{UI.ORG_BOOK_INFO_HINT}</p>
      </div>

      <FormField label={UI.ORG_BOOK_ESTABLISHED_YEAR_LABEL}>
        <input
          className={fieldInputClass}
          inputMode="numeric"
          maxLength={4}
          value={establishedYear}
          placeholder={UI.ORG_BOOK_ESTABLISHED_YEAR_PLACEHOLDER}
          onChange={(e) => setEstablishedYear(normalizeYearInput(e.target.value))}
        />
      </FormField>

      <FormField label={UI.ORG_BOOK_CLAN_ADDRESS_LABEL}>
        <input
          className={fieldInputClass}
          value={clanAddress}
          placeholder={UI.ORG_BOOK_CLAN_ADDRESS_PLACEHOLDER}
          onChange={(e) => setClanAddress(e.target.value)}
        />
      </FormField>

      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label={UI.ORG_BOOK_CLAN_LAT_LABEL}>
          <input
            className={fieldInputClass}
            inputMode="decimal"
            value={clanLat}
            placeholder="21.0285"
            onChange={(e) => setClanLat(e.target.value)}
          />
        </FormField>
        <FormField label={UI.ORG_BOOK_CLAN_LNG_LABEL}>
          <input
            className={fieldInputClass}
            inputMode="decimal"
            value={clanLng}
            placeholder="105.8542"
            onChange={(e) => setClanLng(e.target.value)}
          />
        </FormField>
      </div>
      <p className={`-mt-2 text-xs ${hintClass}`}>
        {UI.ORG_BOOK_CLAN_COORDS_HINT}
      </p>

      <FormField label={UI.ORG_BOOK_MAP_EMBED_LABEL}>
        <textarea
          className={`${fieldInputClass} min-h-[5.5rem]`}
          value={clanMapEmbedUrl}
          placeholder={UI.ORG_BOOK_MAP_EMBED_PLACEHOLDER}
          onChange={(e) => setClanMapEmbedUrl(e.target.value)}
        />
        <p className={`mt-1.5 text-xs ${hintClass}`}>
          {UI.ORG_BOOK_MAP_EMBED_HINT}
        </p>
      </FormField>

      <div className="flex justify-end">
        {isLanding ? (
          <button
            type="button"
            disabled={!isDirty || saving}
            onClick={() => void handleSave()}
            className="rounded-xl bg-[#944a00] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {UI.SAVE}
          </button>
        ) : (
          <IconRoundButton
            icon="save"
            variant="gold"
            label={UI.SAVE}
            loading={saving}
            disabled={!isDirty}
            onClick={() => void handleSave()}
          />
        )}
      </div>
    </div>
  );
}
