import type { InstallStep } from "@/lib/constants/ui-strings/install-page";
import InstallRichText from "./InstallRichText";

type Props = {
  index: number;
  step: InstallStep;
};

export default function InstallStepCard({ index, step }: Props) {
  return (
    <article className="flex items-start gap-4 rounded-xl border border-[#d4c3c1] bg-white p-6 shadow-sm transition hover:-translate-y-0.5">
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#321716] text-sm font-bold text-white"
        aria-hidden
      >
        {index + 1}
      </span>
      <div className="min-w-0">
        <h3 className="font-serif text-xl font-semibold text-[#321716]">
          {step.title}
        </h3>
        <div className="mt-1">
          <InstallRichText text={step.body} />
        </div>
      </div>
    </article>
  );
}
