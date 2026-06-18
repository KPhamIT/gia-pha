'use client';

import { useMemo, useState } from 'react';
import IconRoundButton from '@/components/ui/IconRoundButton';
import { BT } from '@/lib/constants/ui-theme';
import { UI } from '@/lib/constants/ui-strings';
import type { StandardFeatureKey } from '@/lib/auth/standard-features';

type FabAction = 'add' | 'search' | 'center' | 'book' | 'events' | 'export' | 'ceremonyTemplates';

const ACTION_FEATURES: Record<Exclude<FabAction, 'ceremonyTemplates'>, StandardFeatureKey> = {
  add: 'editTree',
  search: 'search',
  center: 'tree',
  book: 'book',
  events: 'events',
  export: 'export',
};

type TreeFabProps = {
  canUseFeature: (key: StandardFeatureKey) => boolean;
  canManageCeremonyTemplates?: boolean;
  onAddPerson: () => void;
  onSearch: () => void;
  onCenterTree: () => void;
  onOpenBook: () => void;
  onOpenEvents: () => void;
  onOpenExport: () => void;
  onOpenCeremonyTemplates?: () => void;
};

export default function TreeFab({
  canUseFeature,
  canManageCeremonyTemplates = false,
  onAddPerson,
  onSearch,
  onCenterTree,
  onOpenBook,
  onOpenEvents,
  onOpenExport,
  onOpenCeremonyTemplates,
}: TreeFabProps) {
  const [open, setOpen] = useState(false);

  const handlers: Record<FabAction, () => void> = {
    add: onAddPerson,
    search: onSearch,
    center: onCenterTree,
    book: onOpenBook,
    events: onOpenEvents,
    export: onOpenExport,
    ceremonyTemplates: () => onOpenCeremonyTemplates?.(),
  };

  const actions = useMemo(() => {
    const base = (
      [
        { id: 'add' as FabAction, label: UI.ADD_PERSON, icon: 'plus' as const },
        { id: 'search' as FabAction, label: UI.SEARCH_PERSON, icon: 'search' as const },
        { id: 'book' as FabAction, label: UI.VIEW_GENEALOGY_BOOK, icon: 'book' as const },
        { id: 'events' as FabAction, label: UI.EVENTS_FAB, icon: 'calendar' as const },
        { id: 'export' as FabAction, label: UI.BTN_EXPORT, icon: 'image' as const },
        { id: 'center' as FabAction, label: UI.BTN_CENTER, icon: 'center' as const },
      ] as const
    ).filter((action) => canUseFeature(ACTION_FEATURES[action.id]));

    if (canManageCeremonyTemplates && onOpenCeremonyTemplates) {
      base.push({
        id: 'ceremonyTemplates' as FabAction,
        label: UI.CEREMONY_TEMPLATES_OPEN,
        icon: 'print' as const,
      });
    }

    return base;
  }, [canManageCeremonyTemplates, canUseFeature, onOpenCeremonyTemplates]);

  if (actions.length === 0) return null;

  const handleAction = (action: (typeof actions)[number]) => {
    setOpen(false);
    handlers[action.id]();
  };

  return (
    <div className="fixed bottom-6 left-4 z-[45] flex flex-col-reverse items-start gap-2 pb-[env(safe-area-inset-bottom)] md:bottom-8 md:left-6">
      {open ? (
        <div className="flex flex-col gap-2">
          {actions.map((action) => (
            <IconRoundButton
              key={action.id}
              icon={action.icon}
              label={action.label}
              variant="outline"
              compact={false}
              className={`shadow-lg ${BT.card}`}
              onClick={() => handleAction(action)}
            />
          ))}
        </div>
      ) : null}

      <IconRoundButton
        icon="plus"
        variant="fab"
        iconSize={24}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? UI.CANCEL : UI.BTN_CREATE}
        aria-expanded={open}
        className={open ? '[&_svg]:rotate-45' : ''}
      />
    </div>
  );
}
