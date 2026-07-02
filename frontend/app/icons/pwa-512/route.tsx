import { ImageResponse } from "next/og";
import { BrandIconMark } from "@/lib/brand/icon-mark";

export const runtime = "edge";
const CACHE_CONTROL = "public, max-age=31536000, immutable";

export async function GET() {
  return new ImageResponse(<BrandIconMark fontSize={280} borderRadius={80} />, {
    width: 512,
    height: 512,
    headers: {
      "Cache-Control": CACHE_CONTROL,
    },
  });
}
