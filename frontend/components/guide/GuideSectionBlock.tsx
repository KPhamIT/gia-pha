import type { GuideSection } from "@/lib/constants/ui-strings/guide";
import { BT } from "@/lib/constants/ui-theme";
import GuideImagePlaceholder from "./GuideImagePlaceholder";
import GuideRichText from "./GuideRichText";

type GuideSectionBlockProps = {
  section: GuideSection;
};

export default function GuideSectionBlock({ section }: GuideSectionBlockProps) {
  return (
    <section
      id={section.id}
      className={`scroll-mt-24 ${BT.card} space-y-5 p-4 md:p-6`}
    >
      <header className="space-y-2 border-b border-amber-200/60 pb-4">
        <h2 className="text-lg font-semibold text-neutral-900">{section.title}</h2>
        {section.intro ? (
          <p className={`text-sm leading-relaxed ${BT.mutedOnLight}`}>
            {section.intro}
          </p>
        ) : null}
      </header>

      <ol className="space-y-8">
        {section.steps.map((step, index) => (
          <li key={step.title} className="space-y-3">
            <h3 className="text-base font-semibold text-amber-900">
              <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-sm">
                {index + 1}
              </span>
              {step.title}
            </h3>
            <div className={`space-y-2 text-sm leading-relaxed ${BT.mutedOnLight}`}>
              {step.paragraphs.map((paragraph, pIndex) => (
                <GuideRichText key={pIndex} text={paragraph} />
              ))}
            </div>
            {step.imageCaption ? (
              <GuideImagePlaceholder caption={step.imageCaption} />
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
