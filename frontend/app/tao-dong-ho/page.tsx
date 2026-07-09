import type { Metadata } from "next";
import RegisterOrganizationPageView from "@/components/org/RegisterOrganizationPageView";
import SeoSchemas from "@/components/seo/SeoSchemas";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: UI.ORG_REGISTER_TITLE,
  description: UI.ORG_REGISTER_HINT,
  path: "/tao-dong-ho",
  keywords: [
    "đăng ký dòng họ",
    "tạo gia phả online",
    "phần mềm gia phả",
    "website gia phả",
    "Cội Nguồn",
  ],
  pageType: "website",
});

export default function RegisterOrganizationPage() {
  return (
    <>
      <SeoSchemas
        path="/tao-dong-ho"
        title={UI.ORG_REGISTER_TITLE}
        description={UI.ORG_REGISTER_HINT}
        pageType="website"
      />
      <RegisterOrganizationPageView />
    </>
  );
}
