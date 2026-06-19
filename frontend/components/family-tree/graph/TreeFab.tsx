'use client';

import { useMemo, useState } from 'react';
import IconRoundButton from '@/components/ui/IconRoundButton';
import { BT } from '@/lib/constants/ui-theme';
import { UI } from '@/lib/constants/ui-strings';
import type { StandardFeatureKey } from '@/lib/auth/standard-features';

import type { IconName } from '@/components/icons/icon-paths';

type FabAction =
  | 'add'
  | 'search'
  | 'center'
  | 'book'
  | 'events'
  | 'export'
  | 'ceremonyTemplates'
  | 'users'
  | 'notifications'
  | 'account';
type FeatureFabAction = Exclude<FabAction, 'ceremonyTemplates' | 'users' | 'notifications' | 'account'>;

type FabItem = { id: FabAction; label: string; icon: IconName };

const FEATURE_FAB_ITEMS: { id: FeatureFabAction; label: string; icon: IconName }[] = [
  { id: 'add', label: UI.ADD_PERSON, icon: 'plus' },
  { id: 'search', label: UI.SEARCH_PERSON, icon: 'search' },
  { id: 'book', label: UI.VIEW_GENEALOGY_BOOK, icon: 'book' },
  { id: 'events', label: UI.EVENTS_FAB, icon: 'calendar' },
  { id: 'export', label: UI.BTN_EXPORT, icon: 'image' },
  { id: 'center', label: UI.BTN_CENTER, icon: 'center' },
];

const ACTION_FEATURES: Record<FeatureFabAction, StandardFeatureKey> = {
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
  isAdmin?: boolean;
  onAddPerson: () => void;
  onSearch: () => void;
  onCenterTree: () => void;
  onOpenBook: () => void;
  onOpenEvents: () => void;
  onOpenExport: () => void;
  onOpenCeremonyTemplates?: () => void;
  onOpenUsers?: () => void;
  onOpenNotifications: () => void;
  onOpenAccount: () => void;
};

export default function TreeFab({
  canUseFeature,
  canManageCeremonyTemplates = false,
  isAdmin = false,
  onAddPerson,
  onSearch,
  onCenterTree,
  onOpenBook,
  onOpenEvents,
  onOpenExport,
  onOpenCeremonyTemplates,
  onOpenUsers,
  onOpenNotifications,
  onOpenAccount,
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
    users: () => onOpenUsers?.(),
    notifications: onOpenNotifications,
    account: onOpenAccount,
  };

  const actions = useMemo(() => {
    const base: FabItem[] = FEATURE_FAB_ITEMS.filter((action) =>
      canUseFeature(ACTION_FEATURES[action.id]),
    );

    if (canManageCeremonyTemplates && onOpenCeremonyTemplates) {
      base.push({
        id: 'ceremonyTemplates',
        label: UI.CEREMONY_TEMPLATES_OPEN,
        icon: 'print',
      });
    }

    if (isAdmin && onOpenUsers) {
      base.push({ id: 'users', label: UI.BTN_USERS, icon: 'userPlus' });
    }

    base.push(
      { id: 'notifications', label: UI.NOTIF_OPEN_CENTER, icon: 'calendar' },
      { id: 'account', label: UI.ACCOUNT_OPEN, icon: 'userPlus' },
    );

    return base;
  }, [canManageCeremonyTemplates, canUseFeature, isAdmin, onOpenCeremonyTemplates, onOpenUsers]);

  if (actions.length === 0) return null;

  const handleAction = (action: (typeof actions)[number]) => {
    setOpen(false);
    handlers[action.id]();
  };

  return (
    <div className="fixed bottom-6 left-4 z-[45] flex flex-col-reverse items-start gap-2 pb-[env(safe-area-inset-bottom)] md:bottom-8 md:left-6">
      {open ? (
        <div className="flex min-w-[9.25rem] flex-col gap-1">
          {actions.map((action) => (
            <IconRoundButton
              key={action.id}
              icon={action.icon}
              label={action.label}
              variant="outline"
              size="dense"
              iconSize={18}
              labeledAlign="start"
              className={`w-full shadow-lg ${BT.card}`}
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
