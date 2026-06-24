"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { IconName } from "@/components/icons/icon-paths";
import LandingCardHeader from "@/components/public/LandingCardHeader";
import { api } from "@/lib/api";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import { LAYOUT } from "@/lib/constants/ui-layout";

type FeatureItem = { icon: IconName; title: string; desc: string };

type LandingFeaturesSectionProps = {
  features: readonly FeatureItem[];
};

/** Trang demo công khai cho từng chức năng (dữ liệu org demo do SYSTEM cấu hình). */
function demoHrefForFeature(title: string): string {
  switch (title) {
    case UI.LANDING_FEATURE_BOOK_TITLE:
      return "/book?demo=1";
    case UI.LANDING_FEATURE_TREE_TITLE:
    case UI.LANDING_FEATURE_EXPORT_TITLE:
      return "/family-tree?demo=1";
    case UI.LANDING_FEATURE_EVENTS_TITLE:
      return "/events?demo=1";
    case UI.LANDING_FEATURE_NOTIF_TITLE:
      return "/notifications?demo=1";
    case UI.LANDING_FEATURE_CEREMONY_CUSTOM_TITLE:
      return "/ceremonies/templates?demo=1";
    case UI.LANDING_FEATURE_CEREMONY_TITLE:
    case UI.LANDING_FEATURE_CEREMONY_PRINT_TITLE:
      return "/ceremonies/demo";
    default:
      return "/book?demo=1";
  }
}

export default function LandingFeaturesSection({
  features,
}: LandingFeaturesSectionProps) {
  const [hasDemo, setHasDemo] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void api.organizations
      .getDemo()
      .then((demo) => {
        if (!cancelled) setHasDemo(demo != null);
      })
      .catch(() => {
        /* không có org demo thì ẩn nút */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mt-6 space-y-4">
      <h2 className="text-lg font-semibold text-amber-50">
        {UI.LANDING_FEATURES_TITLE}
      </h2>
      {hasDemo ? (
        <p className="text-sm text-amber-100/80">{UI.LANDING_DEMO_HINT}</p>
      ) : null}
      <div className={LAYOUT.cardGrid}>
        {features.map((feature) => (
          <div key={feature.title} className={`${BT.card} flex flex-col p-4`}>
            <LandingCardHeader icon={feature.icon} title={feature.title} />
            <p className={`mt-3 text-sm leading-relaxed ${BT.mutedOnLight}`}>
              {feature.desc}
            </p>
            {hasDemo ? (
              <div className="mt-4">
                <Link
                  href={demoHrefForFeature(feature.title)}
                  className={`${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary}`}
                >
                  {UI.LANDING_DEMO_BUTTON}
                </Link>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
