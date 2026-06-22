import Link from "next/link";
import { UI } from "@/lib/constants/ui-strings";

const LINKS = [
  { href: "/", label: UI.PUBLIC_FOOTER_HOME },
  { href: "/huong-dan", label: UI.PUBLIC_FOOTER_GUIDE },
  { href: "/lien-he", label: UI.PUBLIC_FOOTER_CONTACT },
  { href: "/chinh-sach-bao-mat", label: UI.PUBLIC_FOOTER_PRIVACY },
  { href: "/dieu-khoan-su-dung", label: UI.PUBLIC_FOOTER_TERMS },
] as const;

/** Compact footer links for login and other minimal public screens. */
export default function PublicFooterLinks() {
  return (
    <nav
      className="mt-8 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-amber-100/80"
      aria-label="Liên kết trang công khai"
    >
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="underline-offset-2 hover:text-amber-50 hover:underline"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
