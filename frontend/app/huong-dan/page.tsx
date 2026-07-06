import type { Metadata } from "next";
import GuidePageContent from "@/components/guide/GuidePageContent";
import GuidePageView from "@/components/guide/GuidePageView";
import SeoSchemas from "@/components/seo/SeoSchemas";
import JsonLd from "@/components/seo/JsonLd";
import { GUIDE_SECTIONS } from "@/lib/constants/ui-strings/guide";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";
import { generateHowToSchema } from "@/lib/schema";

export const metadata: Metadata = createMetadata({
  title: UI.GUIDE_PAGE_TITLE,
  description: UI.GUIDE_PAGE_SUBTITLE,
  path: "/huong-dan",
  keywords: ["hướng dẫn", "gia phả", "sổ gia phả", "cây gia phả"],
  pageType: "guide",
});

const howToSchema = generateHowToSchema({
  name: UI.GUIDE_PAGE_TITLE,
  description: UI.GUIDE_PAGE_SUBTITLE,
  steps: GUIDE_SECTIONS.flatMap((section) =>
    section.steps.map((step) => ({
      name: step.title,
      text: step.paragraphs.join(" "),
    })),
  ),
});

export default function UserGuidePage() {
  return (
    <>
      <SeoSchemas
        path="/huong-dan"
        title={UI.GUIDE_PAGE_TITLE}
        description={UI.GUIDE_PAGE_SUBTITLE}
        pageType="guide"
      />
      {howToSchema ? <JsonLd data={howToSchema} id="schema-howto-guide" /> : null}
      <GuidePageView>
        <GuidePageContent />
      </GuidePageView>
    </>
  );
}
