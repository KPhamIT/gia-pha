import type { Metadata } from "next";
import PricingPageContent from "@/components/billing/PricingPageContent";
import PricingPageView from "@/components/billing/PricingPageView";
import SeoSchemas from "@/components/seo/SeoSchemas";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: UI.PRICING_PAGE_TITLE,
  description: UI.PRICING_PAGE_SUBTITLE,
  path: "/bang-gia",
  keywords: ["bảng giá", "gia phả", "dòng họ"],
  pageType: "software",
});

type PageProps = {
  searchParams: Promise<{ orgId?: string }>;
};

export default async function PricingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const orgId = params.orgId ? Number.parseInt(params.orgId, 10) : null;
  const payQuery =
    orgId != null && !Number.isNaN(orgId) ? `?orgId=${orgId}` : "";

  return (
    <>
      <SeoSchemas
        path="/bang-gia"
        title={UI.PRICING_PAGE_TITLE}
        description={UI.PRICING_PAGE_SUBTITLE}
        pageType="software"
      />
      <PricingPageView>
        <PricingPageContent payQuery={payQuery} />
      </PricingPageView>
    </>
  );
}
