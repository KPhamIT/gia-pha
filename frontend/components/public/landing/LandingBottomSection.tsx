import Link from "next/link";
import { BRAND_TEXT_ON_DARK_CLASS, SITE } from "@/config/site";
import { UI } from "@/lib/constants/ui-strings";

export default function LandingBottomSection() {
  return (
    <section>
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="rounded-2xl border border-[#d4c3c1] bg-[#faf7f2] px-6 py-12 text-center md:px-12">
          <h2 className="font-serif text-3xl font-semibold text-[#321716] md:text-4xl">{UI.LANDING_FINAL_CTA_TITLE}</h2>
          <p className="mx-auto mt-4 max-w-3xl text-[#504443]">{UI.LANDING_FINAL_CTA_BODY}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/tao-dong-ho" className="rounded-lg bg-[#321716] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#4a2c2a]">{UI.LANDING_START_NEW_ORG_CTA}</Link>
            <Link href="/lien-he" className="rounded-lg border border-[#321716] px-8 py-3 text-sm font-semibold text-[#321716] transition hover:bg-[#f0ede9]">{UI.LANDING_SERVICES_CTA}</Link>
          </div>
        </div>
        <p className="mt-8 text-center text-xs leading-relaxed text-[#504443]">
          {UI.LANDING_LEGAL_HINT}{" "}
          <Link href="/dieu-khoan-su-dung" className="underline underline-offset-2">{UI.PUBLIC_FOOTER_TERMS}</Link>
          {" · "}
          <Link href="/chinh-sach-bao-mat" className="underline underline-offset-2">{UI.PUBLIC_FOOTER_PRIVACY}</Link>
        </p>
      </div>
      <footer className="mt-10 hidden w-full bg-[#321716] px-6 py-10 text-[#f3f0eb] md:block md:px-10">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4"><p className={`font-serif text-2xl font-semibold ${BRAND_TEXT_ON_DARK_CLASS}`}>{SITE.brandName}</p><p className="text-sm leading-relaxed text-[#eabcb8]">{UI.LANDING_FOOTER_ABOUT}</p></div>
          <FooterLinks title={UI.LANDING_FOOTER_DISCOVER_TITLE} links={[{ href: "/gioi-thieu", label: UI.PUBLIC_FOOTER_ABOUT }, { href: "/book", label: UI.PUBLIC_FOOTER_BOOK }, { href: "/family-tree", label: UI.LANDING_NAV_CLAN }, { href: "/bai-viet", label: UI.LANDING_FOOTER_NEWS }]} />
          <FooterLinks title={UI.LANDING_FOOTER_SUPPORT_TITLE} links={[{ href: "/huong-dan", label: UI.PUBLIC_FOOTER_GUIDE }, { href: "/cai-dat", label: UI.INSTALL_PAGE_TITLE }, { href: "/dieu-khoan-su-dung", label: UI.PUBLIC_FOOTER_TERMS }, { href: "/chinh-sach-bao-mat", label: UI.PUBLIC_FOOTER_PRIVACY }, { href: "/lien-he", label: UI.PUBLIC_FOOTER_CONTACT }]} />
          <div><h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#ffb783]">{UI.LANDING_FOOTER_CONTACT_TITLE}</h4><div className="space-y-3 text-sm text-[#f3f0eb]/85"><p>{UI.LANDING_FOOTER_CONTACT_EMAIL}</p><p>{UI.LANDING_FOOTER_CONTACT_PHONE}</p><p>{UI.LANDING_FOOTER_CONTACT_ADDRESS}</p></div></div>
        </div>
        <div className="mx-auto mt-8 w-full max-w-6xl border-t border-white/10 pt-5 text-center text-xs text-[#eabcb8]">
          <span suppressHydrationWarning>
            {UI.PUBLIC_FOOTER_COPYRIGHT(new Date().getFullYear())}
          </span>
        </div>
      </footer>
    </section>
  );
}

type FooterLink = { href: string; label: string };
function FooterLinks({ title, links }: { title: string; links: readonly FooterLink[] }) {
  return (
    <div>
      <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#ffb783]">{title}</h4>
      <div className="space-y-3 text-sm text-[#f3f0eb]/85">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="block transition hover:text-white">{link.label}</Link>
        ))}
      </div>
    </div>
  );
}
