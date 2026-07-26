"use client";

import Image from "next/image";
import { UI } from "@/lib/constants/ui-strings";

export default function ClanDutyHero() {
  const [line1, line2] = UI.CLAN_DUTY_HERO_TITLE.split("\n");

  return (
    <section className="group relative h-48 overflow-hidden rounded-2xl bg-[#451A03] shadow-[0_4px_20px_-2px_rgba(69,26,3,0.04)]">
      <Image
        src="/images/about/story-main.webp"
        alt=""
        fill
        className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 768px"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#451A03] via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 p-6">
        <p className="mb-1 text-xs font-medium tracking-wide text-white/80">
          {UI.CLAN_DUTY_HERO_EYEBROW}
        </p>
        <h3 className="font-serif text-2xl font-semibold leading-8 text-white">
          {line1}
          {line2 ? (
            <>
              <br />
              {line2}
            </>
          ) : null}
        </h3>
      </div>
    </section>
  );
}
