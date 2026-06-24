"use client";

import IconRoundButton from "@/components/ui/IconRoundButton";
import { UI } from "@/lib/constants/ui-strings";

type Props = {
  /** Chỉ hiện nút cài đặt khi người dùng có quyền chỉnh cài đặt cây. */
  canEditSettings: boolean;
  onOpenSettings: () => void;
  /** Quay lại trang trước đó. */
  onBack: () => void;
};

/** Fixed controls: back on top-left, settings on top-right. */
export default function TreeTopBar({
  canEditSettings,
  onOpenSettings,
  onBack,
}: Props) {
  return (
    <>
      <div className="fixed left-4 top-4 z-20 pt-[env(safe-area-inset-top)] md:left-6 md:top-6">
        <IconRoundButton
          icon="arrowLeft"
          variant="outline"
          aria-label={UI.BACK}
          onClick={onBack}
        />
      </div>
      {canEditSettings ? (
        <div className="fixed right-4 top-4 z-20 pt-[env(safe-area-inset-top)] md:right-6 md:top-6">
          <IconRoundButton
            icon="settings"
            variant="outline"
            aria-label={UI.SETTINGS_TITLE}
            onClick={onOpenSettings}
          />
        </div>
      ) : null}
    </>
  );
}
