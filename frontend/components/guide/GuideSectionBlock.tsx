import { AC } from "@/components/auth/account-theme";
import type { GuideSection } from "@/lib/constants/ui-strings/guide";
import { BT } from "@/lib/constants/ui-theme";
import GuideImagePlaceholder from "./GuideImagePlaceholder";
import GuideRichText from "./GuideRichText";

type GuideSectionBlockProps = {
  section: GuideSection;
  variant?: "book" | "landing";
};

export default function GuideSectionBlock({
  section,
  variant = "book",
}: GuideSectionBlockProps) {
  const isLanding = variant === "landing";
  const cardClass = isLanding ? AC.card : BT.card;
  const introClass = isLanding ? "text-[#504443]" : BT.mutedOnLight;
  const borderClass = isLanding ? "border-[#d4c3c1]" : "border-amber-200/60";
  const titleClass = isLanding
    ? "font-serif text-lg font-semibold text-[#321716]"
    : "text-lg font-semibold text-neutral-900";
  const stepTitleClass = isLanding
    ? "text-base font-semibold text-[#321716]"
    : "text-base font-semibold text-amber-900";
  const stepBadgeClass = isLanding
    ? "bg-[#f6f3ee] text-[#944a00]"
    : "bg-amber-100";
  const bodyClass = isLanding ? "text-[#504443]" : BT.mutedOnLight;

  return (
    <section
      id={section.id}
      className={`scroll-mt-24 ${cardClass} space-y-5 p-4 md:p-6`}
    >
      <header className={`space-y-2 border-b ${borderClass} pb-4`}>
        <h2 className={titleClass}>{section.title}</h2>
        {section.intro ? (
          <p className={`text-sm leading-relaxed ${introClass}`}>
            {section.intro}
          </p>
        ) : null}
      </header>

      <ol className="space-y-8">
        {section.steps.map((step, index) => (
          <li key={step.title} className="space-y-3">
            <h3 className={stepTitleClass}>
              <span
                className={`mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm ${stepBadgeClass}`}
              >
                {index + 1}
              </span>
              {step.title}
            </h3>
            <div className={`space-y-2 text-sm leading-relaxed ${bodyClass}`}>
              {step.paragraphs.map((paragraph, pIndex) => (
                <GuideRichText
                  key={pIndex}
                  text={paragraph}
                  variant={variant}
                />
              ))}
            </div>
            {step.imageCaption ? (
              <GuideImagePlaceholder
                caption={step.imageCaption}
                variant={variant}
              />
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
