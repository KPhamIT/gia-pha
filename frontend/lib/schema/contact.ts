import { buildAbsoluteUrl, SITE } from "@/config/site";

type ContactInput = {
  path: string;
  name: string;
  description: string;
  email?: string;
  telephone?: string;
};

export function generateContactPageSchema(input: ContactInput) {
  const url = buildAbsoluteUrl(input.path);
  return {
    "@type": "ContactPage",
    "@id": `${url}#contact`,
    url,
    name: input.name,
    description: input.description,
    inLanguage: SITE.language,
    isPartOf: { "@id": `${buildAbsoluteUrl("/")}#website` },
    ...(input.email || input.telephone
      ? {
          mainEntity: {
            "@type": "Organization",
            "@id": `${buildAbsoluteUrl("/")}#organization`,
            ...(input.email ? { email: input.email } : {}),
            ...(input.telephone ? { telephone: input.telephone } : {}),
          },
        }
      : {}),
  };
}
