import Link from "next/link";
import type { Metadata } from "next";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import PublicSiteFooter from "@/components/public/PublicSiteFooter";
import { LAYOUT } from "@/lib/constants/ui-layout";

export const metadata: Metadata = {
  title: `${UI.PAGE_TITLE} — Gia phả điện tử`,
  description: UI.LANDING_HERO_SUBTITLE,
};

const FEATURES = [
  {
    title: UI.LANDING_FEATURE_BOOK_TITLE,
    desc: UI.LANDING_FEATURE_BOOK_DESC,
  },
  {
    title: UI.LANDING_FEATURE_TREE_TITLE,
    desc: UI.LANDING_FEATURE_TREE_DESC,
  },
  {
    title: UI.LANDING_FEATURE_EVENTS_TITLE,
    desc: UI.LANDING_FEATURE_EVENTS_DESC,
  },
  {
    title: UI.LANDING_FEATURE_CEREMONY_TITLE,
    desc: UI.LANDING_FEATURE_CEREMONY_DESC,
  },
] as const;

export default function LandingPage() {
  return (
    <div className={`flex min-h-dvh flex-col ${BT.shell} ${BT.shellText}`}>
      <header
        className={`shrink-0 ${LAYOUT.sheetHeader} ${LAYOUT.sheetHeaderBook}`}
      >
        <div className="mx-auto w-full max-w-5xl">
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
            <Link
              href="/login"
              className={`${BT.btnBase} ${BT.btnSm} ${BT.btnGhost} text-amber-100`}
            >
              {UI.LANDING_CTA_LOGIN}
            </Link>
          </div>
        </div>
      </header>

      <main className={`${LAYOUT.sheetBody} mx-auto w-full max-w-5xl flex-1 ${LAYOUT.pagePad}`}>
        <section className={`${BT.card} space-y-3 p-4 md:p-6`}>
          <h2 className="text-lg font-semibold text-neutral-900">
            {UI.LANDING_HOW_TITLE}
          </h2>
          <ol className={`list-decimal space-y-2 pl-5 text-sm leading-relaxed ${BT.mutedOnLight}`}>
            {UI.LANDING_HOW_STEPS.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
          <Link
            href="/join"
            className={`inline-flex text-sm font-medium text-amber-800 underline-offset-2 hover:underline`}
          >
            {UI.ORG_JOIN_TITLE} →
          </Link>
        </section>

        <section className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold text-amber-50">
            {UI.LANDING_FEATURES_TITLE}
          </h2>
          <div className={LAYOUT.cardGrid}>
            {FEATURES.map((feature) => (
              <div key={feature.title} className={`${BT.card} p-4`}>
                <h3 className="font-semibold text-neutral-900">{feature.title}</h3>
                <p className={`mt-2 text-sm leading-relaxed ${BT.mutedOnLight}`}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className={`mt-6 ${BT.card} p-4 md:p-6`}>
          <h2 className="text-lg font-semibold text-neutral-900">
            {UI.LANDING_AUDIENCE_TITLE}
          </h2>
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
      </main>
    </div>
  );
}
