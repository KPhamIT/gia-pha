"use client";

import Link from "next/link";
import { useState } from "react";
import InstallBenefitIcon from "@/components/install/InstallBenefitIcon";
import InstallStepCard from "@/components/install/InstallStepCard";
import InstallVisualRef from "@/components/install/InstallVisualRef";
import {
  INSTALL_ANDROID_STEPS,
  INSTALL_BENEFITS,
  INSTALL_IOS_STEPS,
  type InstallPlatform,
} from "@/lib/constants/ui-strings/install-page";
import { UI } from "@/lib/constants/ui-strings";

const TABS: { id: InstallPlatform; label: string }[] = [
  { id: "ios", label: UI.INSTALL_TAB_IOS },
  { id: "android", label: UI.INSTALL_TAB_ANDROID },
];

export default function InstallPageContent() {
  const [platform, setPlatform] = useState<InstallPlatform>("ios");
  const steps = platform === "ios" ? INSTALL_IOS_STEPS : INSTALL_ANDROID_STEPS;

  return (
    <div className="mx-auto max-w-[1280px] space-y-12 pb-8">
      <section className="text-center">
        <h2 className="font-serif text-[28px] font-semibold leading-tight text-[#321716] md:text-[40px]">
          {UI.INSTALL_PAGE_HERO_TITLE}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-[#504443]">
          {UI.INSTALL_PAGE_HERO_SUBTITLE}
        </p>
      </section>

      <div className="flex justify-center">
        <div
          className="inline-flex rounded-full border border-[#d4c3c1] bg-[#f6f3ee] p-1"
          role="tablist"
          aria-label={UI.INSTALL_PAGE_TITLE}
        >
          {TABS.map((tab) => {
            const isActive = tab.id === platform;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setPlatform(tab.id)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition active:scale-95 md:px-6 ${
                  isActive
                    ? "bg-[#321716] text-white shadow-md"
                    : "text-[#504443] hover:bg-white/80"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7" role="tabpanel">
          {steps.map((step, index) => (
            <InstallStepCard key={`${platform}-${step.title}`} index={index} step={step} />
          ))}
        </div>
        <aside className="lg:col-span-5 lg:sticky lg:top-24">
          <InstallVisualRef platform={platform} />
        </aside>
      </div>

      <section>
        <h2 className="mb-10 text-center font-serif text-2xl font-semibold text-[#321716] md:text-[32px]">
          {UI.INSTALL_BENEFITS_TITLE}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {INSTALL_BENEFITS.map((benefit) => (
            <article
              key={benefit.id}
              className="rounded-xl border border-[#d4c3c1] bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#ffdcc5] text-[#301400]">
                <InstallBenefitIcon
                  id={benefit.id as "fast" | "fullscreen" | "notifications" | "performance"}
                />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#321716]">
                {benefit.title}
              </h3>
              <p className="mt-2 text-base text-[#504443]">{benefit.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-[#d4c3c1] bg-[#f6f3ee] px-6 py-10 text-center">
        <h3 className="font-serif text-xl font-semibold text-[#321716] md:text-2xl">
          {UI.INSTALL_SUPPORT_TITLE}
        </h3>
        <p className="mx-auto mt-2 max-w-xl text-base text-[#504443]">
          {UI.INSTALL_SUPPORT_BODY}
        </p>
        <Link
          href="/lien-he"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-[#321716] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#4a2a28] active:scale-95"
        >
          {UI.INSTALL_SUPPORT_CTA}
        </Link>
      </section>
    </div>
  );
}
