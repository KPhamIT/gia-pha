'use client';

import { useState } from 'react';
import StandardFeaturesSection from '@/components/system/StandardFeaturesSection';
import { useOrganizations } from '@/hooks/useOrganizations';
import { BT } from '@/lib/constants/ui-theme';
import { UI } from '@/lib/constants/ui-strings';

export default function SystemFeaturesSection() {
  const { items, loading } = useOrganizations();
  const [orgId, setOrgId] = useState<number | null>(null);
  const [scope, setScope] = useState<'defaults' | 'org'>('defaults');

  if (loading) return <p className={`text-sm ${BT.mutedOnDark}`}>{UI.LOADING}</p>;

  const selectedOrgId = orgId ?? items[0]?.id ?? null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <ScopeButton active={scope === 'defaults'} onClick={() => setScope('defaults')} label={UI.FEATURES_SCOPE_DEFAULTS} />
        <ScopeButton active={scope === 'org'} onClick={() => setScope('org')} label={UI.FEATURES_SCOPE_ORG} />
      </div>

      {scope === 'org' ? (
        <select
          className={`w-full rounded-xl border border-amber-200/20 bg-black/30 px-3 py-2 text-sm text-amber-50`}
          value={selectedOrgId ?? ''}
          onChange={(e) => setOrgId(Number.parseInt(e.target.value, 10))}
        >
          {items.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      ) : null}

      {scope === 'defaults' ? (
        <StandardFeaturesSection mode="defaults" />
      ) : selectedOrgId != null ? (
        <StandardFeaturesSection mode="org" organizationId={selectedOrgId} />
      ) : (
        <p className={`text-sm ${BT.mutedOnDark}`}>{UI.SYSTEM_NO_ORG}</p>
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
    <button type="button" onClick={onClick} className={active ? BT.pillActive : BT.pillIdle}>
      {label}
    </button>
  );
}
