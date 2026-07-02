import { buildAbsoluteUrl, SITE } from "@/config/site";

type CollectionInput = {
  path: string;
  name: string;
  description: string;
};

export function generateCollectionSchema(input: CollectionInput) {
  const url = buildAbsoluteUrl(input.path);
  return {
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: input.name,
    description: input.description,
    inLanguage: SITE.language,
    isPartOf: { "@id": `${buildAbsoluteUrl("/")}#website` },
  };
}
