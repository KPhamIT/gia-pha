'use client';

import BookPageShell from '@/components/ui/BookPageShell';
import CeremonyTemplatesManager from '@/components/ceremonies/CeremonyTemplatesManager';
import { useOrgAdminAccess } from '@/hooks/useOrgAdminAccess';
import { UI } from '@/lib/constants/ui-strings';
import { BT } from '@/lib/constants/ui-theme';

export default function CeremonyTemplatesPage() {
  const { ready } = useOrgAdminAccess();

  if (!ready) {
    return (
      <div className={`flex min-h-dvh items-center justify-center text-sm ${BT.mutedOnDark}`}>
        {UI.LOADING}
      </div>
    );
  }

  return (
    <BookPageShell title={UI.CEREMONY_TEMPLATES_TITLE} subtitle={UI.CEREMONY_TEMPLATES_SUBTITLE}>
      <CeremonyTemplatesManager />
    </BookPageShell>
  );
}
