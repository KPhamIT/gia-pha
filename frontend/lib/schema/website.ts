import { buildAbsoluteUrl, SITE } from "@/config/site";
import { generateOrganizationSchema } from "./organization";

export function generateWebsiteSchema() {
  const org = generateOrganizationSchema();
  return {
    "@type": "WebSite",
    "@id": `${buildAbsoluteUrl("/")}#website`,
    name: SITE.siteName,
    alternateName: SITE.brandName,
    url: buildAbsoluteUrl("/"),
    inLanguage: SITE.language,
    publisher: { "@id": org["@id"] },
  };
}
