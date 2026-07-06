"use client";

import { useState } from "react";
import { AC } from "@/components/auth/account-theme";
import OrgUsersTabBar from "@/components/org/OrgUsersTabBar";
import StandardFeaturesSection from "@/components/system/StandardFeaturesSection";
import { useOrganizations } from "@/hooks/useOrganizations";
import { BT } from "@/lib/constants/ui-theme";
import { UI } from "@/lib/constants/ui-strings";

type Scope = "defaults" | "org";

type Props = {
  variant?: "book" | "landing";
};

export default function SystemFeaturesSection({ variant = "book" }: Props) {
  const isLanding = variant === "landing";
  const { items, loading } = useOrganizations();
  const [orgId, setOrgId] = useState<number | null>(null);
  const [scope, setScope] = useState<Scope>("defaults");

  const loadingClass = isLanding ? AC.muted : BT.mutedOnDark;
  const fieldClass = isLanding ? AC.input : "w-full rounded-xl border border-amber-200/20 bg-black/30 px-3 py-2 text-sm text-amber-50";

  if (loading) return <p className={`text-sm ${loadingClass}`}>{UI.LOADING}</p>;

  const selectedOrgId = orgId ?? items[0]?.id ?? null;

  const scopeTabs: { id: Scope; label: string }[] = [
    { id: "defaults", label: UI.FEATURES_SCOPE_DEFAULTS },
    { id: "org", label: UI.FEATURES_SCOPE_ORG },
  ];

  return (
    <div className="space-y-4">
      {isLanding ? (
        <OrgUsersTabBar tabs={scopeTabs} active={scope} onChange={setScope} />
      ) : (
        <div className="flex flex-wrap gap-2">
          <ScopeButton
            active={scope === "defaults"}
            onClick={() => setScope("defaults")}
            label={UI.FEATURES_SCOPE_DEFAULTS}
          />
          <ScopeButton
            active={scope === "org"}
            onClick={() => setScope("org")}
            label={UI.FEATURES_SCOPE_ORG}
          />
        </div>
      )}

      {scope === "org" ? (
        <select
          className={fieldClass}
          value={selectedOrgId ?? ""}
          onChange={(e) => setOrgId(Number.parseInt(e.target.value, 10))}
        >
          {items.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      ) : null}

      {scope === "defaults" ? (
        <StandardFeaturesSection mode="defaults" variant={variant} />
      ) : selectedOrgId != null ? (
        <StandardFeaturesSection
          mode="org"
          organizationId={selectedOrgId}
          variant={variant}
        />
      ) : (
        <p className={`text-sm ${loadingClass}`}>{UI.SYSTEM_NO_ORG}</p>
      )}
    </div>
  );
}

function ScopeButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={active ? BT.pillActive : BT.pillIdle}
    >
      {label}
    </button>
  );
}
