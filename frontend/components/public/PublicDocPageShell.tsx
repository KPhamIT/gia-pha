import type { ReactNode } from "react";
import BookPageShell from "@/components/ui/BookPageShell";
import PublicSiteFooter from "./PublicSiteFooter";

type PublicDocPageShellProps = {
  title: string;
  subtitle: string;
  backHref?: string;
  children: ReactNode;
};

/** Shell for public legal / about pages. */
export default function PublicDocPageShell({
  title,
  subtitle,
  backHref = "/",
  children,
}: PublicDocPageShellProps) {
  return (
    <BookPageShell title={title} subtitle={subtitle} backHref={backHref} hideNavFab>
      <div className="space-y-6">
        <div className="rounded-xl bg-white/95 p-4 text-neutral-900 shadow-sm md:p-6">
          {children}
        </div>
        <PublicSiteFooter />
      </div>
    </BookPageShell>
  );
}
