"use client";

import { useOrgBookContext } from "@/hooks/useOrgBookContext";
import { UI } from "@/lib/constants/ui-strings";
import {
  clanMapsSearchUrl,
  resolveClanLocationLabel,
  resolveClanMapEmbedSrc,
} from "@/utils/clan-map";

export default function EventsLocationCard() {
  const { context, loading } = useOrgBookContext();
  const address = resolveClanLocationLabel(context?.clanAddress);
  const embedSrc = resolveClanMapEmbedSrc({
    embedUrl: context?.clanMapEmbedUrl,
    address: context?.clanAddress,
  });
  const mapsUrl = clanMapsSearchUrl(address);
  const hasOrgAddress = Boolean(context?.clanAddress?.trim());

  return (
    <div className="overflow-hidden rounded-xl border border-[#d4c3c1] bg-white shadow-sm">
      <div className="relative h-36 bg-gradient-to-br from-[#e5e2dd] via-[#f6f3ee] to-[#ffdcc5]/40">
        {embedSrc ? (
          <iframe
            title={UI.EVENTS_LOCATION_TITLE}
            src={embedSrc}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : null}
      </div>
      <div className="p-4">
        <h4 className="text-sm font-semibold text-[#321716]">
          {UI.EVENTS_LOCATION_TITLE}
        </h4>
        <p className="mt-1 text-xs text-[#504443]">
          {loading
            ? UI.LOADING
            : hasOrgAddress
              ? address
              : UI.EVENTS_LOCATION_MAP_EMPTY}
        </p>
        {hasOrgAddress ? (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#944a00] hover:underline"
          >
            {UI.EVENTS_LOCATION_MAP_CTA}
          </a>
        ) : null}
      </div>
    </div>
  );
}
