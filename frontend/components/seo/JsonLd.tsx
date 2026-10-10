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

/** Escape `<` để chuỗi JSON không đóng thẻ script sớm. */
function serializeJsonLd(payload: Record<string, unknown>): string {
  return JSON.stringify(payload).replace(/</g, "\\u003c");
}

/** Renders JSON-LD trong HTML server (Googlebot đọc được ngay, không cần JS). */
export default function JsonLd({ data, id }: JsonLdProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(toGraphPayload(data)) }}
    />
  );
}
