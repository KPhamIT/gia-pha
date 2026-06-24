import Link from "next/link";
import type { IconName } from "@/components/icons/icon-paths";
import LandingCardHeader from "@/components/public/LandingCardHeader";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import { LAYOUT } from "@/lib/constants/ui-layout";

const SERVICES: {
  icon: IconName;
  title: string;
  points: readonly string[];
}[] = [
  {
    icon: "print",
    title: UI.LANDING_SERVICE_PRINT_TITLE,
    points: UI.LANDING_SERVICE_PRINT_POINTS,
  },
  {
    icon: "moon",
    title: UI.LANDING_SERVICE_PERSONAL_TITLE,
    points: UI.LANDING_SERVICE_PERSONAL_POINTS,
  },
  {
    icon: "center",
    title: UI.LANDING_SERVICE_CLAN_TITLE,
    points: UI.LANDING_SERVICE_CLAN_POINTS,
  },
];

export default function LandingServicesSection() {
  return (
    <section className="mt-6 space-y-4">
      <h2 className="text-lg font-semibold text-amber-50">
        {UI.LANDING_SERVICES_TITLE}
      </h2>
      <p className={`text-sm leading-relaxed ${BT.mutedOnDark}`}>
        {UI.LANDING_SERVICES_INTRO}
      </p>
      <div className={LAYOUT.cardGrid}>
        {SERVICES.map((service) => (
          <div key={service.title} className={`${BT.card} flex flex-col p-4 md:p-5`}>
            <LandingCardHeader
              icon={service.icon}
              title={service.title}
              titleClassName="text-base font-semibold text-neutral-900"
            />
            <ul
              className={`mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed ${BT.mutedOnLight}`}
            >
              {service.points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex justify-center pt-2">
        <Link
          href="/lien-he"
          className={`${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary}`}
        >
          {UI.LANDING_SERVICES_CTA}
        </Link>
      </div>
    </section>
  );
}
