"use client";

import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";

export default function AuthPageLoading() {
  return (
    <div
      className={`flex min-h-dvh items-center justify-center text-sm ${BT.shell} ${BT.shellText} ${BT.mutedOnDark}`}
    >
      {UI.LOADING}
    </div>
  );
}
