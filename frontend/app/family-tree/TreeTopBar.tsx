"use client";

import IconRoundButton from "@/components/ui/IconRoundButton";
import { UI } from "@/lib/constants/ui-strings";

type Props = {
  isSystem: boolean;
  onOpenSettings: () => void;
};

/** Fixed top-right controls: system shortcut (admins) + settings. */
export default function TreeTopBar({ isSystem, onOpenSettings }: Props) {
  return (
    <div className="fixed right-4 top-4 z-20 flex gap-2 pt-[env(safe-area-inset-top)] md:right-6 md:top-6">
      {isSystem ? (
        <a href="/system">
          <IconRoundButton
            icon="list"
            variant="outline"
            label={UI.BTN_SYSTEM}
            tabIndex={-1}
            aria-hidden
          />
        </a>
      ) : null}
      <IconRoundButton
        icon="settings"
        variant="outline"
        label={UI.SETTINGS_TITLE}
        onClick={onOpenSettings}
      />
    </div>
  );
}
