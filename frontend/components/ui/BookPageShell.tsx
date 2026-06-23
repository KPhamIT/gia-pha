"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Icon from "@/components/icons/Icon";
import AppNavFab from "@/components/navigation/AppNavFab";
import { LAYOUT } from "@/lib/constants/ui-layout";
import { BT } from "@/lib/constants/ui-theme";
import { UI } from "@/lib/constants/ui-strings";

type BookPageShellProps = {
  title: string;
  subtitle?: string;
  backHref?: string;
  children: ReactNode;
  tabs?: ReactNode;
  /** Ẩn menu FAB góc trái dưới (mặc định hiện). */
  hideNavFab?: boolean;
};

/** Full-page admin shell — cùng palette sổ gia phả. */
export default function BookPageShell({
  title,
  subtitle,
  backHref = "/book",
  children,
  tabs,
  hideNavFab = false,
}: BookPageShellProps) {
  return (
    <div
      className={`flex h-dvh min-h-0 flex-col overflow-hidden ${BT.shell} ${BT.shellText}`}
    >
      <header
        className={`shrink-0 ${LAYOUT.sheetHeader} ${LAYOUT.sheetHeaderBook}`}
      >
        <Link href={backHref} className={BT.iconGhost} aria-label={UI.BACK}>
          <Icon
            path="arrowLeft"
            size={22}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            pointer={false}
          />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold md:text-xl">{title}</h1>
          {subtitle ? (
            <p className={`truncate text-xs ${BT.mutedOnDark}`}>{subtitle}</p>
          ) : null}
        </div>
      </header>

      <main
        className={`${LAYOUT.sheetBody} mx-auto min-h-0 w-full max-w-5xl flex-1`}
      >
        {tabs ? (
          <div className={`flex gap-2 ${BT.pagePad} pb-0`}>{tabs}</div>
        ) : null}
        <div className={BT.pagePad}>{children}</div>
      </main>

      {hideNavFab ? null : <AppNavFab />}
    </div>
  );
}
