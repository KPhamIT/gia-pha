import Link from "next/link";
import type { Metadata } from "next";
import type { IconName } from "@/components/icons/icon-paths";
import AccountHeaderButton from "@/components/auth/AccountHeaderButton";
import LandingCardHeader from "@/components/public/LandingCardHeader";
import LandingFeaturesSection from "@/components/public/LandingFeaturesSection";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import PublicSiteFooter from "@/components/public/PublicSiteFooter";
import { LAYOUT } from "@/lib/constants/ui-layout";

export const metadata: Metadata = {
  title: `${UI.PAGE_TITLE} — Gia phả điện tử`,
  description: UI.LANDING_HERO_SUBTITLE,
};

const FEATURES: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: "book",
    title: UI.LANDING_FEATURE_BOOK_TITLE,
    desc: UI.LANDING_FEATURE_BOOK_DESC,
  },
  {
    icon: "center",
    title: UI.LANDING_FEATURE_TREE_TITLE,
    desc: UI.LANDING_FEATURE_TREE_DESC,
  },
  {
    icon: "calendar",
    title: UI.LANDING_FEATURE_EVENTS_TITLE,
    desc: UI.LANDING_FEATURE_EVENTS_DESC,
  },
  {
    icon: "list",
    title: UI.LANDING_FEATURE_CEREMONY_TITLE,
    desc: UI.LANDING_FEATURE_CEREMONY_DESC,
  },
  {
    icon: "moon",
    title: UI.LANDING_FEATURE_NOTIF_TITLE,
    desc: UI.LANDING_FEATURE_NOTIF_DESC,
  },
  {
    icon: "print",
    title: UI.LANDING_FEATURE_CEREMONY_PRINT_TITLE,
    desc: UI.LANDING_FEATURE_CEREMONY_PRINT_DESC,
  },
  {
    icon: "edit",
    title: UI.LANDING_FEATURE_CEREMONY_CUSTOM_TITLE,
    desc: UI.LANDING_FEATURE_CEREMONY_CUSTOM_DESC,
  },
  {
    icon: "image",
    title: UI.LANDING_FEATURE_EXPORT_TITLE,
    desc: UI.LANDING_FEATURE_EXPORT_DESC,
  },
];

const START_PATHS: {
  icon: IconName;
  title: string;
  steps: readonly string[];
  href: string;
  cta: string;
}[] = [
  {
    icon: "share",
    title: UI.LANDING_START_HAS_LINK_TITLE,
    steps: UI.LANDING_START_HAS_LINK_STEPS,
    href: "/join",
    cta: UI.LANDING_START_HAS_LINK_CTA,
  },
  {
    icon: "userPlus",
    title: UI.LANDING_START_NEW_ORG_TITLE,
    steps: UI.LANDING_START_NEW_ORG_STEPS,
    href: "/tao-dong-ho",
    cta: UI.LANDING_START_NEW_ORG_CTA,
  },
];

export default function LandingPage() {
  return (
    <div
      className={`flex h-dvh min-h-0 flex-col overflow-hidden ${BT.shell} ${BT.shellText}`}
    >
      <header
        className={`relative shrink-0 ${LAYOUT.sheetHeader} ${LAYOUT.sheetHeaderBook}`}
      >
        <div className="absolute inset-y-0 right-4 flex items-center md:right-6">
          <AccountHeaderButton />
        </div>
        <div className="mx-auto w-full max-w-5xl pr-14 md:pr-16">
          <p className="text-sm font-medium uppercase tracking-wide text-amber-200/80">
            {UI.PAGE_TITLE}
          </p>
          <h1 className="mt-1 text-2xl font-semibold md:text-3xl">
            {UI.LANDING_HERO_TITLE}
          </h1>
          <p className={`mt-2 max-w-2xl text-sm leading-relaxed ${BT.mutedOnDark}`}>
            {UI.LANDING_HERO_SUBTITLE}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/huong-dan"
              className={`${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary}`}
            >
              {UI.LANDING_CTA_GUIDE}
            </Link>
            <Link
              href="/book"
              className={`${BT.btnBase} ${BT.btnSm} ${BT.btnOutline} border-amber-200/40 text-amber-50`}
            >
              {UI.LANDING_CTA_BOOK}
            </Link>
          </div>
        </div>
      </header>

      <div className={`${LAYOUT.sheetBody} min-h-0 w-full flex-1`}>
        <main className="mx-auto w-full max-w-5xl">
          <div className={LAYOUT.pagePad}>
          <section className="space-y-4">
          <h2 className="text-lg font-semibold text-amber-50">{UI.LANDING_START_TITLE}</h2>
          <div className={LAYOUT.cardGrid}>
            {START_PATHS.map((path) => (
              <div key={path.href} className={`${BT.card} flex h-full flex-col p-4 md:p-5`}>
                <LandingCardHeader
                  icon={path.icon}
                  title={path.title}
                  titleClassName="text-base font-semibold text-neutral-900"
                />
                <ol className={`mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed ${BT.mutedOnLight}`}>
                  {path.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
                <Link
                  href={path.href}
                  className="mt-auto inline-flex pt-4 text-sm font-semibold text-amber-800 underline-offset-2 hover:underline"
                >
                  {path.cta} →
                </Link>
              </div>
            ))}
          </div>
          </section>

          <LandingFeaturesSection features={FEATURES} />

          <section className={`mt-6 ${BT.card} p-4 md:p-6`}>
          <h2 className="text-lg font-semibold text-neutral-900">
            {UI.LANDING_AUDIENCE_TITLE}
          </h2>
          <p className={`mt-3 text-sm leading-relaxed ${BT.mutedOnLight}`}>
            {UI.LANDING_AUDIENCE_INTRO}
          </p>
          <ul className={`mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed ${BT.mutedOnLight}`}>
            {UI.LANDING_AUDIENCE_ITEMS.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          </section>

          <p className={`mt-6 text-center text-xs leading-relaxed ${BT.mutedOnDark}`}>
          {UI.LANDING_LEGAL_HINT}{" "}
          <Link href="/dieu-khoan-su-dung" className="underline underline-offset-2">
            {UI.PUBLIC_FOOTER_TERMS}
          </Link>
          {" · "}
          <Link href="/chinh-sach-bao-mat" className="underline underline-offset-2">
            {UI.PUBLIC_FOOTER_PRIVACY}
          </Link>
          </p>

          <PublicSiteFooter />
          </div>
        </main>
      </div>
    </div>
  );
}
