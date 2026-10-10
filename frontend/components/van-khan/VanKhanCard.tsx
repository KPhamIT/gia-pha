import Link from "next/link";
import ContentThumbnail from "@/components/thumbnails/ContentThumbnail";
import { UI } from "@/lib/constants/ui-strings";
import { ceremonyDescription, ceremonyTitle } from "@/lib/van-khan/format";
import type { PublicCeremonySummary } from "@/lib/van-khan/server-api";

type VanKhanCardProps = {
  item: PublicCeremonySummary;
};

export default function VanKhanCard({ item }: VanKhanCardProps) {
  return (
    <li className="flex flex-col overflow-hidden rounded-2xl border border-[#d4c3c1]/60 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/van-khan/${item.slug}`} tabIndex={-1} aria-hidden>
        <ContentThumbnail kind="van-khan" slug={item.slug} alt={ceremonyTitle(item)} />
      </Link>
      <div className="flex flex-1 flex-col p-5">
      <h2 className="font-serif text-lg font-semibold leading-snug text-[#321716]">
        <Link href={`/van-khan/${item.slug}`} className="hover:underline">
          {ceremonyTitle(item)}
        </Link>
      </h2>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-[#504443]">
        {ceremonyDescription(item)}
      </p>
      <Link
        href={`/van-khan/${item.slug}`}
        className="mt-4 text-sm font-semibold text-[#944a00] underline-offset-2 hover:underline"
      >
        {UI.VAN_KHAN_READ} →
      </Link>
      </div>
    </li>
  );
}
