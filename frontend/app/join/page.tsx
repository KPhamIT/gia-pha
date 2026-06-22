"use client";

import Link from "next/link";
import BookPageShell from "@/components/ui/BookPageShell";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";

export default function JoinLandingPage() {
  return (
    <BookPageShell title={UI.ORG_JOIN_TITLE} subtitle={UI.ORG_JOIN_SUBTITLE} hideNavFab>
      <p className={`text-sm leading-relaxed ${BT.mutedOnDark}`}>
        {UI.ORG_JOIN_HINT}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/login" className={`${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary}`}>
          {UI.LOGIN_BUTTON}
        </Link>
      </div>
    </BookPageShell>
  );
}
