import Link from "next/link";
import BookPageShell from "@/components/ui/BookPageShell";
import PublicSiteFooter from "@/components/public/PublicSiteFooter";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";

export default function JoinLandingPage() {
  return (
    <BookPageShell
      title={UI.ORG_JOIN_TITLE}
      subtitle={UI.ORG_JOIN_SUBTITLE}
      backHref="/"
      hideNavFab
    >
      <p className={`text-sm leading-relaxed ${BT.mutedOnDark}`}>
        {UI.ORG_JOIN_HINT}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/login" className={`${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary}`}>
          {UI.LOGIN_BUTTON}
        </Link>
        <Link href="/huong-dan" className={`${BT.btnBase} ${BT.btnSm} ${BT.btnOutline} border-amber-200/40 text-amber-50`}>
          {UI.LANDING_CTA_GUIDE}
        </Link>
        <Link href="/lien-he" className={`${BT.btnBase} ${BT.btnSm} ${BT.btnGhost} text-amber-100`}>
          {UI.PUBLIC_FOOTER_CONTACT}
        </Link>
      </div>
      <PublicSiteFooter />
    </BookPageShell>
  );
}
