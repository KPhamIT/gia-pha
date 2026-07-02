import { buildAbsoluteUrl, getSiteLogoUrl, SITE } from "@/config/site";

export function generateOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${buildAbsoluteUrl("/")}#organization`,
    name: SITE.brandName,
    url: buildAbsoluteUrl("/"),
    logo: {
      "@type": "ImageObject",
      url: getSiteLogoUrl(),
      width: 512,
      height: 512,
    },
  };
}
