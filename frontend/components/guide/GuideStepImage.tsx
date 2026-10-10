import Image from "next/image";
import type { GuideImage } from "@/lib/constants/guide-images";
import { BT } from "@/lib/constants/ui-theme";

type GuideStepImageProps = {
  image: GuideImage;
  caption?: string;
  variant?: "book" | "landing";
};

/** Ảnh chụp màn hình minh họa một bước hướng dẫn. */
export default function GuideStepImage({
  image,
  caption,
  variant = "book",
}: GuideStepImageProps) {
  const isLanding = variant === "landing";
  const frameClass = isLanding ? "border-[#d4c3c1]" : "border-amber-200/80";
  const captionClass = isLanding
    ? "text-center text-xs text-[#827472]"
    : `text-center text-xs ${BT.mutedOnLight}`;

  return (
    <figure
      className="mx-auto my-4 space-y-2"
      style={image.maxWidth ? { maxWidth: image.maxWidth } : undefined}
    >
      <Image
        src={image.src}
        alt={caption ?? ""}
        width={image.width}
        height={image.height}
        sizes={image.maxWidth ? `${image.maxWidth}px` : "(min-width: 1024px) 900px, 100vw"}
        className={`h-auto w-full rounded-xl border ${frameClass} shadow-sm`}
      />
      {caption ? <figcaption className={captionClass}>{caption}</figcaption> : null}
    </figure>
  );
}
