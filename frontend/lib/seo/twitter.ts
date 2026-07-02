import { SITE, getDefaultOgImageUrl } from "@/config/site";

type TwitterInput = {
  title: string;
  description: string;
  image?: string;
};

export function generateTwitter(input: TwitterInput) {
  return {
    card: SITE.twitter.card,
    title: input.title,
    description: input.description,
    images: [input.image ?? getDefaultOgImageUrl()],
    ...(SITE.twitter.site ? { site: SITE.twitter.site } : {}),
  };
}
