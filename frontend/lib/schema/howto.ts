import { SITE } from "@/config/site";

type HowToStep = {
  name: string;
  text: string;
};

type HowToInput = {
  name: string;
  description: string;
  steps: HowToStep[];
};

export function generateHowToSchema(input: HowToInput) {
  if (input.steps.length === 0) return null;
  return {
    "@type": "HowTo",
    name: input.name,
    description: input.description,
    inLanguage: SITE.language,
    step: input.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}
