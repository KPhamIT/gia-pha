"use client";

import Link from "next/link";
import LandingHasLinkCard from "@/components/public/LandingHasLinkCard";
import JoinPublicShell from "@/components/public/join/JoinPublicShell";
import { UI } from "@/lib/constants/ui-strings";

export default function JoinPageView() {
  return (
    <JoinPublicShell>
      <section className="relative overflow-hidden py-12 md:py-16">
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center md:px-6">
          <h1 className="font-serif text-4xl font-bold leading-tight text-[#321716] md:text-5xl">
            {UI.ORG_JOIN_TITLE}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#504443]">
            {UI.ORG_JOIN_SUBTITLE}
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#827472]">
            {UI.ORG_JOIN_HINT}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-2xl px-4 pb-8 md:px-6">
        <LandingHasLinkCard
          icon="share"
          title={UI.LANDING_START_HAS_LINK_TITLE}
          steps={UI.LANDING_START_HAS_LINK_STEPS}
        />
      </section>

      <section className="mx-auto flex w-full max-w-2xl flex-wrap items-center justify-center gap-3 px-4 pb-16 md:px-6">
        <Link
          href="/login"
          className="rounded-lg border border-[#d4c3c1] bg-white px-5 py-2.5 text-sm font-semibold text-[#321716] transition hover:bg-[#f6f3ee]"
        >
          {UI.LOGIN_BUTTON}
        </Link>
        <Link
          href="/huong-dan"
          className="rounded-lg border border-[#d4c3c1] bg-white px-5 py-2.5 text-sm font-semibold text-[#504443] transition hover:bg-[#f6f3ee]"
        >
          {UI.LANDING_CTA_GUIDE}
        </Link>
        <Link
          href="/tao-dong-ho"
          className="rounded-lg bg-[#321716] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4a2c2a]"
        >
          {UI.LANDING_START_NEW_ORG_CTA}
        </Link>
      </section>
    </JoinPublicShell>
  );
}
