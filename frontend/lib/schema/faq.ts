import type { FaqItem } from "@/lib/seo/types";

export function generateFAQSchema(faq: FaqItem[]) {
  if (faq.length === 0) return null;
  return {
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
