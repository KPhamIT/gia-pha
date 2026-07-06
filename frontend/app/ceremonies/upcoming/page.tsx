import { Suspense } from "react";
import type { Metadata } from "next";
import UpcomingCeremoniesPageView from "@/components/ceremonies/UpcomingCeremoniesPageView";
import AuthPageLoading from "@/components/ui/AuthPageLoading";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: UI.CEREMONIES_UPCOMING_TITLE,
  description: UI.CEREMONIES_UPCOMING_SUBTITLE,
  path: "/ceremonies/upcoming",
});

export default function UpcomingCeremoniesPage() {
  return (
    <Suspense
      fallback={
        <AuthPageLoading message={UI.CEREMONIES_UPCOMING_LOADING} />
      }
    >
      <UpcomingCeremoniesPageView />
    </Suspense>
  );
}
