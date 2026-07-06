import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";

type GuideImagePlaceholderProps = {
  caption?: string;
  variant?: "book" | "landing";
};

export default function GuideImagePlaceholder({
  caption,
  variant = "book",
}: GuideImagePlaceholderProps) {
  const isLanding = variant === "landing";
  const boxClass = isLanding
    ? "flex aspect-video w-full items-center justify-center rounded-xl border-2 border-dashed border-[#d4c3c1] bg-[#f6f3ee] px-4 text-center text-[#827472]"
    : `flex aspect-video w-full items-center justify-center rounded-xl border-2 border-dashed border-amber-300/80 bg-amber-50/40 px-4 text-center ${BT.mutedOnLight}`;
  const captionClass = isLanding
    ? "text-center text-xs text-[#827472]"
    : `text-center text-xs ${BT.mutedOnLight}`;

  return (
    <figure className="my-4 space-y-2">
      <div className={boxClass} aria-hidden>
        <span className="text-sm">{UI.GUIDE_IMAGE_PLACEHOLDER}</span>
      </div>
      {caption ? <figcaption className={captionClass}>{caption}</figcaption> : null}
    </figure>
  );
}
