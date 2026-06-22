"use client";

import Link from "next/link";
import BookPageShell from "@/components/ui/BookPageShell";
import UserSection from "@/components/system/UserSection";
import { useSystemAccess } from "@/hooks/useSystemAccess";
import { BT } from "@/lib/constants/ui-theme";
import { UI } from "@/lib/constants/ui-strings";

export default function SystemAdminsPage() {
  const { ready } = useSystemAccess();

  if (!ready) {
    return (
      <div
        className={`flex min-h-dvh items-center justify-center text-sm ${BT.mutedOnDark}`}
      >
        {UI.LOADING}
      </div>
    );
  }

  return (
    <BookPageShell
      title={UI.SYSTEM_ADMINS_TITLE}
      subtitle={UI.SYSTEM_ADMINS_SUBTITLE}
    >
      <Link
        href="/system"
        className={`mb-4 inline-flex text-sm font-medium text-amber-800 underline-offset-2 hover:underline`}
      >
        ← {UI.SYSTEM_OPEN}
      </Link>
      <UserSection mode="system" roleFilter="ADMIN" showOrgCreate />
    </BookPageShell>
  );
}
