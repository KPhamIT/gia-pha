import type { Metadata } from "next";
import JoinPageView from "@/components/public/join/JoinPageView";
import SeoSchemas from "@/components/seo/SeoSchemas";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: UI.ORG_JOIN_TITLE,
  description: UI.ORG_JOIN_HINT,
  path: "/join",
  keywords: ["tham gia dòng họ", "liên kết gia phả", "Cội Nguồn"],
  pageType: "website",
});

export default function JoinLandingPage() {
  return (
    <>
      <SeoSchemas
        path="/join"
        title={UI.ORG_JOIN_TITLE}
        description={UI.ORG_JOIN_HINT}
        pageType="website"
      />
      <JoinPageView />
    </>
  );
}
