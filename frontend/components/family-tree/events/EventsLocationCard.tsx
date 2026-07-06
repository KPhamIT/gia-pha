"use client";

import { getPublicContactDisplay } from "@/lib/constants/contact-info";
import { UI } from "@/lib/constants/ui-strings";

export default function EventsLocationCard() {
  const { address } = getPublicContactDisplay();
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <div className="overflow-hidden rounded-xl border border-[#d4c3c1] bg-white shadow-sm">
      <div className="h-36 bg-gradient-to-br from-[#e5e2dd] via-[#f6f3ee] to-[#ffdcc5]/40" />
      <div className="p-4">
        <h4 className="text-sm font-semibold text-[#321716]">
          {UI.EVENTS_LOCATION_TITLE}
        </h4>
        <p className="mt-1 text-xs text-[#504443]">{address}</p>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#944a00] hover:underline"
        >
          {UI.EVENTS_LOCATION_MAP_CTA}
        </a>
      </div>
    </div>
  );
}
