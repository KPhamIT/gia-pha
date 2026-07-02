import Link from "next/link";
import AccountHeaderButton from "@/components/auth/AccountHeaderButton";
import Icon from "@/components/icons/Icon";
import { UI } from "@/lib/constants/ui-strings";

type LandingHeaderProps = {
  brandName: string;
};

export default function LandingHeader({ brandName }: LandingHeaderProps) {
  return (
    <header className="sticky top-0 z-40 shrink-0 border-b border-[#d4c3c1] bg-[#fcf9f4]/95 backdrop-blur">
      <div className="flex h-20 w-full items-center justify-between px-4 md:px-10">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-serif text-2xl font-bold text-[#321716]">
            {brandName}
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-[#504443] md:flex">
            <Link href="/" className="border-b-2 border-[#321716] pb-1 text-[#321716]">
              {UI.LANDING_NAV_HOME}
            </Link>
            <Link href="/family-tree" className="transition-colors hover:text-[#944a00]">{UI.LANDING_NAV_CLAN}</Link>
            <Link href="/events" className="transition-colors hover:text-[#944a00]">{UI.LANDING_NAV_EVENTS}</Link>
            <Link href="/bai-viet" className="transition-colors hover:text-[#944a00]">{UI.LANDING_NAV_LIBRARY}</Link>
            <Link href="/lien-he" className="transition-colors hover:text-[#944a00]">{UI.LANDING_NAV_SERVICES}</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/book"
            aria-label={UI.LANDING_NAV_SEARCH_ARIA}
            title={UI.LANDING_NAV_SEARCH_ARIA}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d4c3c1] text-[#504443] transition hover:bg-[#f6f3ee] hover:text-[#321716]"
          >
            <Icon path="search" size={18} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
          </Link>
          <AccountHeaderButton />
        </div>
      </div>
    </header>
  );
}
