"use client";

import { useMemo, useState } from "react";
import IconRoundButton from "@/components/ui/IconRoundButton";
import { BT } from "@/lib/constants/ui-theme";
import { UI } from "@/lib/constants/ui-strings";
import type { StandardFeatureKey } from "@/lib/auth/standard-features";
import { useAuthStore } from "@/store/authStore";
import {
  buildFabMenuItems,
  type FabAction,
  type FabPageContext,
} from "@/lib/navigation/fab-actions";

type TreeFabProps = {
  context: FabPageContext;
  pathname: string;
  canUseFeature: (key: StandardFeatureKey) => boolean;
  canManageCeremonyTemplates?: boolean;
  isAdmin?: boolean;
  isSystem?: boolean;
  onAddPerson: () => void;
  onSearch: () => void;
  onCenterTree: () => void;
  onOpenBook: () => void;
  onOpenTree: () => void;
  onOpenEvents: () => void;
  onOpenExport: () => void;
  onOpenCeremonyTemplates?: () => void;
  onOpenUsers?: () => void;
  onOpenNotifications: () => void;
  onOpenAccount: () => void;
};

export default function TreeFab({
  context,
  pathname,
  canUseFeature,
  canManageCeremonyTemplates = false,
  isAdmin = false,
  isSystem = false,
  onAddPerson,
  onSearch,
  onCenterTree,
  onOpenBook,
  onOpenTree,
  onOpenEvents,
  onOpenExport,
  onOpenCeremonyTemplates,
  onOpenUsers,
  onOpenNotifications,
  onOpenAccount,
}: TreeFabProps) {
  const [open, setOpen] = useState(false);
  const features = useAuthStore((state) => state.features);

  const handlers: Record<FabAction, () => void> = {
    add: onAddPerson,
    search: onSearch,
    center: onCenterTree,
    book: onOpenBook,
    tree: onOpenTree,
    events: onOpenEvents,
    export: onOpenExport,
    ceremonyTemplates: () => onOpenCeremonyTemplates?.(),
    users: () => onOpenUsers?.(),
    notifications: onOpenNotifications,
    account: onOpenAccount,
  };

  const actions = useMemo(
    () =>
      buildFabMenuItems({
        context,
        pathname,
        canUseFeature,
        canManageCeremonyTemplates,
        isAdmin,
        isSystem,
      }),
    [
      canManageCeremonyTemplates,
      canUseFeature,
      context,
      features,
      isAdmin,
      isSystem,
      pathname,
    ],
  );

  if (actions.length === 0) return null;

  const handleAction = (action: (typeof actions)[number]) => {
    setOpen(false);
    handlers[action.id]();
  };

  return (
    <>
      {open ? (
        <div
          className="fixed inset-0 z-[90]"
          aria-hidden
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div className="fixed bottom-6 left-4 z-[100] flex flex-col items-start gap-2 pb-[env(safe-area-inset-bottom)] md:bottom-8 md:left-6">
        {open ? (
          <div className="flex min-w-[9.25rem] flex-col gap-1 rounded-2xl border border-amber-200/70 bg-white/95 p-1.5 shadow-2xl backdrop-blur-sm">
            {actions.map((action) => (
              <IconRoundButton
                key={action.id}
                icon={action.icon}
                label={action.label}
                variant="outline"
                size="dense"
                iconSize={18}
                labeledAlign="start"
                className={`w-full shadow-sm ${BT.card}`}
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
          className={open ? "[&_svg]:rotate-45" : ""}
        />
      </div>
    </>
  );
}
