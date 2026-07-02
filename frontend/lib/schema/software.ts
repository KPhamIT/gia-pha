import { buildAbsoluteUrl, SITE } from "@/config/site";
import { generateOrganizationSchema } from "./organization";

export function generateSoftwareSchema() {
  return {
    "@type": "SoftwareApplication",
    "@id": `${buildAbsoluteUrl("/")}#software`,
    name: SITE.software.name,
    applicationCategory: SITE.software.category,
    operatingSystem: SITE.software.operatingSystem,
    url: buildAbsoluteUrl("/"),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "VND",
      description: SITE.software.offers,
    },
    publisher: { "@id": generateOrganizationSchema()["@id"] },
  };
}
