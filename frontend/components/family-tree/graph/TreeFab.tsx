'use client';

import { useMemo, useState } from 'react';
import Icon from '@/components/icons/Icon';
import { UI } from '@/lib/constants/ui-strings';

type FabAction = 'add' | 'search' | 'center' | 'book' | 'events';

type TreeFabProps = {
  onAddPerson: () => void;
  onSearch: () => void;
  onCenterTree: () => void;
  onOpenBook: () => void;
  onOpenEvents: () => void;
};

export default function TreeFab({ onAddPerson, onSearch, onCenterTree, onOpenBook, onOpenEvents }: TreeFabProps) {
  const [open, setOpen] = useState(false);

  const actions = useMemo(() => [
    { id: 'add' as FabAction, label: UI.ADD_PERSON, icon: 'plus' as const, onClick: onAddPerson },
    { id: 'search' as FabAction, label: UI.SEARCH_PERSON, icon: 'search' as const, onClick: onSearch },
    { id: 'book' as FabAction, label: UI.VIEW_GENEALOGY_BOOK, icon: 'book' as const, onClick: onOpenBook },
    { id: 'events' as FabAction, label: UI.EVENTS_FAB, icon: 'calendar' as const, onClick: onOpenEvents },
    { id: 'center' as FabAction, label: UI.CENTER_TREE, icon: 'center' as const, onClick: onCenterTree },
  ], [onAddPerson, onSearch, onOpenBook, onOpenEvents, onCenterTree]);

  const handleAction = (action: (typeof actions)[number]) => {
    setOpen(false);
    action.onClick();
  };

  return (
    <div className="fixed bottom-6 left-4 z-20 flex flex-col-reverse items-start gap-3 pb-[env(safe-area-inset-bottom)]">
      {open ? (
        <div className="flex flex-col gap-2">
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => handleAction(action)}
              className="flex items-center gap-3 rounded-full border border-slate-200 bg-white py-2.5 pl-3 pr-4 shadow-lg active:bg-slate-50"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-600 text-white">
                <Icon path={action.icon} size={18} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
              </span>
              <span className="text-sm font-medium text-slate-800">{action.label}</span>
            </button>
          ))}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="grid h-14 w-14 place-items-center rounded-full bg-blue-600 text-white shadow-lg active:bg-blue-700"
        aria-label="Hành động"
        aria-expanded={open}
      >
        <Icon
          path="plus"
          size={24}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          pointer={false}
          className={`transition-transform ${open ? 'rotate-45' : ''}`}
        />
      </button>
    </div>
  );
}
