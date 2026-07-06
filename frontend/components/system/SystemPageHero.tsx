"use client";

import { UI } from "@/lib/constants/ui-strings";

export default function SystemPageHero() {
  return (
    <section className="py-4 md:py-8">
      <span className="text-sm font-semibold uppercase tracking-widest text-[#944a00]">
        {UI.SYSTEM_PAGE_EYEBROW}
      </span>
      <h1 className="mt-2 font-serif text-2xl font-semibold text-[#321716] md:text-[32px] md:leading-10">
        {UI.SYSTEM_CONSOLE_TITLE}
      </h1>
      <p className="mt-2 max-w-2xl text-base text-[#504443]">
        {UI.SYSTEM_CONSOLE_SUBTITLE}
      </p>
    </section>
  );
}
