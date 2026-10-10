import Image from "next/image";
import {
  THUMBNAIL_HEIGHT,
  THUMBNAIL_WIDTH,
  thumbnailSrc,
  type ThumbnailKind,
} from "@/lib/thumbnails";

type ContentThumbnailProps = {
  kind: ThumbnailKind;
  slug: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
};

/** Ảnh thumbnail 16:9 của bài viết / văn khấn; không có ảnh thì không render. */
export default function ContentThumbnail({
  kind,
  slug,
  alt,
  priority = false,
  className = "",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
}: ContentThumbnailProps) {
  const src = thumbnailSrc(kind, slug);
  if (!src) return null;
  return (
    <Image
      src={src}
      alt={alt}
      width={THUMBNAIL_WIDTH}
      height={THUMBNAIL_HEIGHT}
      priority={priority}
      sizes={sizes}
      className={`aspect-video w-full object-cover ${className}`}
    />
  );
}
