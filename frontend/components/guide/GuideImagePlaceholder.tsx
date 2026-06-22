import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";

type GuideImagePlaceholderProps = {
  caption?: string;
};

export default function GuideImagePlaceholder({
  caption,
}: GuideImagePlaceholderProps) {
  return (
    <figure className="my-4 space-y-2">
      <div
        className={`flex aspect-video w-full items-center justify-center rounded-xl border-2 border-dashed border-amber-300/80 bg-amber-50/40 px-4 text-center ${BT.mutedOnLight}`}
        aria-hidden
      >
        <span className="text-sm">{UI.GUIDE_IMAGE_PLACEHOLDER}</span>
      </div>
      {caption ? (
        <figcaption className={`text-center text-xs ${BT.mutedOnLight}`}>
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
