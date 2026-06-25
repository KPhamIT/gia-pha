import Link from "next/link";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";

const LINKS = [
  { href: "/", label: UI.PUBLIC_FOOTER_HOME },
  { href: "/huong-dan", label: UI.PUBLIC_FOOTER_GUIDE },
  { href: "/bai-viet", label: UI.PUBLIC_FOOTER_BLOG },
  { href: "/lien-he", label: UI.PUBLIC_FOOTER_CONTACT },
  { href: "/chinh-sach-bao-mat", label: UI.PUBLIC_FOOTER_PRIVACY },
  { href: "/dieu-khoan-su-dung", label: UI.PUBLIC_FOOTER_TERMS },
] as const;

type PublicFooterLinksProps = {
  /** `light` — inside white card; `dark` — on amber shell background */
  tone?: "light" | "dark";
};

/** Compact footer links for login and other minimal public screens. */
export default function PublicFooterLinks({
  tone = "light",
}: PublicFooterLinksProps) {
  const navClass =
    tone === "dark"
      ? "mt-8 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-amber-100/80"
      : `mt-8 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs ${BT.mutedOnLight}`;
  const linkClass =
    tone === "dark"
      ? "underline-offset-2 hover:text-amber-50 hover:underline"
      : "underline-offset-2 hover:text-neutral-800 hover:underline";

  return (
    <nav className={navClass} aria-label={UI.PUBLIC_FOOTER_NAV_LABEL}>
      {LINKS.map((link) => (
        <Link key={link.href} href={link.href} className={linkClass}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
