"use client";

import Link from "next/link";
import BookPageShell from "@/components/ui/BookPageShell";
import BlogAdminSection from "@/components/system/BlogAdminSection";
import { useSystemAccess } from "@/hooks/useSystemAccess";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";

export default function SystemBlogPage() {
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
    <BookPageShell title={UI.BLOG_ADMIN_TAB} subtitle={UI.SYSTEM_CONSOLE_SUBTITLE}>
      <Link
        href="/system"
        className="mb-4 inline-flex text-sm font-medium text-amber-800 underline-offset-2 hover:underline"
      >
        ← {UI.SYSTEM_OPEN}
      </Link>
      <BlogAdminSection />
    </BookPageShell>
  );
}
