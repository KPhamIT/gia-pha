import { buildAbsoluteUrl, SITE } from "@/config/site";

type WebPageInput = {
  path: string;
  title: string;
  description: string;
};

export function generateWebPageSchema(input: WebPageInput) {
  const url = buildAbsoluteUrl(input.path);
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: input.title,
    description: input.description,
    inLanguage: SITE.language,
    isPartOf: { "@id": `${buildAbsoluteUrl("/")}#website` },
    about: { "@id": `${buildAbsoluteUrl("/")}#organization` },
  };
}
