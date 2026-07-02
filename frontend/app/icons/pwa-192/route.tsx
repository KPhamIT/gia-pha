import { ImageResponse } from "next/og";
import { BrandIconMark } from "@/lib/brand/icon-mark";

export const runtime = "edge";
const CACHE_CONTROL = "public, max-age=31536000, immutable";

export async function GET() {
  return new ImageResponse(<BrandIconMark fontSize={104} borderRadius={32} />, {
    width: 192,
    height: 192,
    headers: {
      "Cache-Control": CACHE_CONTROL,
    },
  });
}
