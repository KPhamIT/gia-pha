"use client";

import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";

type AuthPageLoadingProps = {
  message?: string;
};

export default function AuthPageLoading({
  message = UI.LOADING,
}: AuthPageLoadingProps) {
  return (
    <div
      className={`flex min-h-dvh items-center justify-center text-sm ${BT.shell} ${BT.shellText} ${BT.mutedOnDark}`}
    >
      {message}
    </div>
  );
}
