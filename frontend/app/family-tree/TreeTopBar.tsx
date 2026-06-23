"use client";

import IconRoundButton from "@/components/ui/IconRoundButton";
import { UI } from "@/lib/constants/ui-strings";

type Props = {
  /** Chỉ hiện nút cài đặt khi người dùng có quyền chỉnh cài đặt cây. */
  canEditSettings: boolean;
  onOpenSettings: () => void;
};

/** Fixed top-right controls: tree display settings (editors only). */
export default function TreeTopBar({ canEditSettings, onOpenSettings }: Props) {
  if (!canEditSettings) return null;

  return (
    <div className="fixed right-4 top-4 z-20 flex gap-2 pt-[env(safe-area-inset-top)] md:right-6 md:top-6">
      <IconRoundButton
        icon="settings"
        variant="outline"
        aria-label={UI.SETTINGS_TITLE}
        onClick={onOpenSettings}
      />
    </div>
  );
}
