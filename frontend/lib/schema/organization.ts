import {
  buildAbsoluteUrl,
  getSiteLogoUrl,
  SITE,
  SOCIAL_LINKS,
} from "@/config/site";

export function generateOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${buildAbsoluteUrl("/")}#organization`,
    name: SITE.brandName,
    url: buildAbsoluteUrl("/"),
    description: SITE.description,
    sameAs: Object.values(SOCIAL_LINKS),
    logo: {
      "@type": "ImageObject",
      url: getSiteLogoUrl(),
      width: 512,
      height: 512,
    },
  };
}
