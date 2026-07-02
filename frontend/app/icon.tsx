import { ImageResponse } from "next/og";
import { BrandIconMark } from "@/lib/brand/icon-mark";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<BrandIconMark fontSize={20} borderRadius={6} />, {
    ...size,
  });
}
