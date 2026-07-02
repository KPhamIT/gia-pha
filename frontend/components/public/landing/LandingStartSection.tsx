import Link from "next/link";
import LandingCardHeader from "@/components/public/LandingCardHeader";
import LandingHasLinkCard from "@/components/public/LandingHasLinkCard";
import { UI } from "@/lib/constants/ui-strings";

type LandingStartSectionProps = {
  registerTitle: string;
  registerSteps: readonly string[];
  registerHref: string;
  registerCta: string;
};

export default function LandingStartSection({
  registerTitle,
  registerSteps,
  registerHref,
  registerCta,
}: LandingStartSectionProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6">
      <div className="text-center">
        <h2 className="font-serif text-3xl font-semibold text-[#321716] md:text-4xl">{UI.LANDING_START_TITLE}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-[#504443]">{UI.LANDING_START_SUBTITLE}</p>
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <LandingHasLinkCard icon="share" title={UI.LANDING_START_HAS_LINK_TITLE} steps={UI.LANDING_START_HAS_LINK_STEPS} />
        <div className="flex flex-col rounded-xl border border-[#d4c3c1] bg-[#321716] p-6 text-white shadow-sm md:p-8">
          <LandingCardHeader icon="userPlus" title={registerTitle} titleClassName="text-lg font-semibold text-white" />
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-[#eabcb8]">
            {registerSteps.map((step) => <li key={step}>{step}</li>)}
          </ol>
          <div className="mt-auto pt-8">
            <Link href={registerHref} className="flex w-full items-center justify-center rounded-lg bg-[#fc8f34] px-6 py-3 text-sm font-semibold text-[#663100] transition hover:bg-[#e67e22]">
              {registerCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
