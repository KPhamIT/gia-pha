"use client";

import type { ReactNode } from "react";
import IconRoundButton from "@/components/ui/IconRoundButton";
import { UI } from "@/lib/constants/ui-strings";

type Props = {
  /** Chỉ hiện nút cài đặt khi người dùng có quyền chỉnh cài đặt cây. */
  canEditSettings: boolean;
  onOpenSettings: () => void;
  /** Quay lại trang trước đó. */
  onBack: () => void;
  /** Filter hoặc control khác giữa back và settings. */
  children?: ReactNode;
};

/** Fixed controls: back + filter trái, settings phải — cùng một hàng căn trên. */
export default function TreeTopBar({
  canEditSettings,
  onOpenSettings,
  onBack,
  children,
}: Props) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-20 flex items-start gap-2 px-4 pt-[env(safe-area-inset-top)] md:top-6 md:px-6">
      <div className="pointer-events-auto flex shrink-0 items-start gap-2">
        <IconRoundButton
          icon="arrowLeft"
          variant="outline"
          aria-label={UI.BACK}
          onClick={onBack}
        />
        {children}
      </div>
      <div className="min-w-0 flex-1" aria-hidden />
      {canEditSettings ? (
        <IconRoundButton
          className="pointer-events-auto shrink-0"
          icon="settings"
          variant="outline"
          aria-label={UI.SETTINGS_TITLE}
          onClick={onOpenSettings}
        />
      ) : null}
    </div>
  );
}
