import Link from "next/link";
import { BRAND_TEXT_ON_DARK_CLASS, SITE, SOCIAL_LINKS } from "@/config/site";
import { UI } from "@/lib/constants/ui-strings";
import ContactIcon from "@/components/public/contact/ContactIcon";

type FooterLink = { href: string; label: string };

function FooterLinks({
  title,
  links,
}: {
  title: string;
  links: readonly FooterLink[];
}) {
  return (
    <div>
      <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#ffb783]">
        {title}
      </h4>
      <div className="space-y-3 text-sm text-[#f3f0eb]/85">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block transition hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function LandingSiteFooter() {
  return (
    <footer className="mt-10 hidden w-full bg-[#321716] px-6 py-10 text-[#f3f0eb] md:block md:px-10">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-4">
        <div className="space-y-4">
          <p className={`font-serif text-2xl font-semibold ${BRAND_TEXT_ON_DARK_CLASS}`}>
            {SITE.brandName}
          </p>
          <p className="text-sm leading-relaxed text-[#eabcb8]">
            {UI.LANDING_FOOTER_ABOUT}
          </p>
        </div>
        <FooterLinks
          title={UI.LANDING_FOOTER_DISCOVER_TITLE}
          links={[
            { href: "/gioi-thieu", label: UI.PUBLIC_FOOTER_ABOUT },
            { href: "/dich-vu", label: UI.LANDING_NAV_SERVICES },
            { href: "/book", label: UI.PUBLIC_FOOTER_BOOK },
            { href: "/family-tree", label: UI.LANDING_NAV_CLAN },
            { href: "/bai-viet", label: UI.LANDING_FOOTER_NEWS },
            { href: "/van-khan", label: UI.PUBLIC_FOOTER_VAN_KHAN },
          ]}
        />
        <FooterLinks
          title={UI.LANDING_FOOTER_SUPPORT_TITLE}
          links={[
            { href: "/huong-dan", label: UI.PUBLIC_FOOTER_GUIDE },
            { href: "/cai-dat", label: UI.INSTALL_PAGE_TITLE },
            { href: "/dieu-khoan-su-dung", label: UI.PUBLIC_FOOTER_TERMS },
            { href: "/chinh-sach-bao-mat", label: UI.PUBLIC_FOOTER_PRIVACY },
            { href: "/lien-he", label: UI.PUBLIC_FOOTER_CONTACT },
          ]}
        />
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#ffb783]">
            {UI.LANDING_FOOTER_CONTACT_TITLE}
          </h4>
          <div className="space-y-3 text-sm text-[#f3f0eb]/85">
            <p>{UI.LANDING_FOOTER_CONTACT_EMAIL}</p>
            <p>{UI.LANDING_FOOTER_CONTACT_PHONE}</p>
            <p>{UI.LANDING_FOOTER_CONTACT_ADDRESS}</p>
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 transition hover:text-white"
            >
              <ContactIcon name="facebook" size={18} />
              {UI.PUBLIC_FOOTER_FACEBOOK}
            </a>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-8 w-full max-w-6xl border-t border-white/10 pt-5 text-center text-xs text-[#eabcb8]">
        <span suppressHydrationWarning>
          {UI.PUBLIC_FOOTER_COPYRIGHT(new Date().getFullYear())}
        </span>
      </div>
    </footer>
  );
}
