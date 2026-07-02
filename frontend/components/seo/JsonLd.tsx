"use client";

import Script from "next/script";
import { useId } from "react";

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
  id?: string;
};

function toGraphPayload(
  data: Record<string, unknown> | Record<string, unknown>[],
): Record<string, unknown> {
  const items = Array.isArray(data) ? data : [data];
  if (items.length === 1) {
    return { "@context": "https://schema.org", ...items[0] };
  }
  return { "@context": "https://schema.org", "@graph": items };
}

/** Renders JSON-LD via next/script (single graph per mount). */
export default function JsonLd({ data, id }: JsonLdProps) {
  const autoId = useId();
  const scriptId = id ?? `json-ld${autoId.replace(/:/g, "")}`;
  const payload = toGraphPayload(data);

  return (
    <Script
      id={scriptId}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
