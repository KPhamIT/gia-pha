"use client";

import { useEffect, useState } from "react";
import type { IconName } from "@/components/icons/icon-paths";
import LandingCardHeader from "@/components/public/LandingCardHeader";
import { api } from "@/lib/api";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import { LAYOUT } from "@/lib/constants/ui-layout";
import { useAuthStore } from "@/store/authStore";
import { useDemoLogin } from "@/hooks/useDemoLogin";

type FeatureItem = { icon: IconName; title: string; desc: string };

type LandingFeaturesSectionProps = {
  features: readonly FeatureItem[];
};

/** Trang chức năng thật mà nút "Xem demo" sẽ mở (sau khi đăng nhập tài khoản demo). */
function demoPathForFeature(title: string): string {
  switch (title) {
    case UI.LANDING_FEATURE_BOOK_TITLE:
      return "/book";
    case UI.LANDING_FEATURE_TREE_TITLE:
    case UI.LANDING_FEATURE_EXPORT_TITLE:
      return "/family-tree";
    case UI.LANDING_FEATURE_EVENTS_TITLE:
      return "/events";
    case UI.LANDING_FEATURE_NOTIF_TITLE:
    case UI.LANDING_FEATURE_CEREMONY_TITLE:
    case UI.LANDING_FEATURE_CEREMONY_PRINT_TITLE:
      return "/ceremonies/upcoming";
    case UI.LANDING_FEATURE_CEREMONY_CUSTOM_TITLE:
      return "/ceremonies/templates";
    default:
      return "/book";
  }
}

export default function LandingFeaturesSection({
  features,
}: LandingFeaturesSectionProps) {
  const [hasDemo, setHasDemo] = useState(false);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const { openDemo, loadingPath } = useDemoLogin();

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

  // Khách đã đăng nhập có quyền thật, không cần nút demo.
  const showDemo = hasDemo && !isLoggedIn;

  return (
    <section className="mt-6 space-y-4">
      <h2 className="text-lg font-semibold text-amber-50">
        {UI.LANDING_FEATURES_TITLE}
      </h2>
      {showDemo ? (
        <p className="text-sm text-amber-100/80">{UI.LANDING_DEMO_HINT}</p>
      ) : null}
      <div className={LAYOUT.cardGrid}>
        {features.map((feature) => {
          const path = demoPathForFeature(feature.title);
          return (
            <div key={feature.title} className={`${BT.card} flex flex-col p-4`}>
              <LandingCardHeader icon={feature.icon} title={feature.title} />
              <p className={`mt-3 text-sm leading-relaxed ${BT.mutedOnLight}`}>
                {feature.desc}
              </p>
              {showDemo ? (
                <div className="mt-4">
                  <button
                    type="button"
                    disabled={loadingPath !== null}
                    onClick={() => void openDemo(path)}
                    className={`${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary}`}
                  >
                    {UI.LANDING_DEMO_BUTTON}
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
