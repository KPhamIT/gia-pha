import type { PublicProseDocument } from "@/lib/constants/ui-strings/public";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";

export default function PublicProseContent({
  document,
}: {
  document: PublicProseDocument;
}) {
  return (
    <article className="space-y-6">
      <p className={`text-xs ${BT.mutedOnLight}`}>
        {UI.PUBLIC_LAST_UPDATED(document.lastUpdated)}
      </p>
      {document.sections.map((section) => (
        <section key={section.title} className="space-y-2">
          <h2 className="text-base font-semibold text-neutral-900">
            {section.title}
          </h2>
          <div className={`space-y-2 text-sm leading-relaxed ${BT.mutedOnLight}`}>
            {section.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}
    </article>
  );
}
