import Link from "next/link";
import { UI } from "@/lib/constants/ui-strings";

const FOOTER_LINKS = [
  { href: "/", label: UI.PUBLIC_FOOTER_HOME },
  { href: "/huong-dan", label: UI.PUBLIC_FOOTER_GUIDE },
  { href: "/gioi-thieu", label: UI.PUBLIC_FOOTER_ABOUT },
  { href: "/lien-he", label: UI.PUBLIC_FOOTER_CONTACT },
  { href: "/chinh-sach-bao-mat", label: UI.PUBLIC_FOOTER_PRIVACY },
  { href: "/dieu-khoan-su-dung", label: UI.PUBLIC_FOOTER_TERMS },
  { href: "/book", label: UI.PUBLIC_FOOTER_BOOK },
] as const;

export default function PublicSiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-10 border-t border-[#d4c3c1] pt-6 text-[#504443]"
      aria-label={UI.PUBLIC_FOOTER_NAV_LABEL}
    >
      <p className="text-center text-sm font-medium text-[#321716]">
        {UI.PUBLIC_FOOTER_TAGLINE}
      </p>
      <nav className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
        {FOOTER_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="underline-offset-2 hover:text-[#321716] hover:underline"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <p className="mt-4 text-center text-xs opacity-80">
        {UI.PUBLIC_FOOTER_COPYRIGHT(year)}
      </p>
    </footer>
  );
}
