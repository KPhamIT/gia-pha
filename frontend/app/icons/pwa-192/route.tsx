import { ImageResponse } from "next/og";

export const runtime = "edge";
const CACHE_CONTROL = "public, max-age=31536000, immutable";

function PwaIcon({ fontSize }: { fontSize: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#78350f",
        color: "#fef3c7",
        fontSize,
        fontWeight: 700,
      }}
    >
      家
    </div>
  );
}

export async function GET() {
  return new ImageResponse(<PwaIcon fontSize={104} />, {
    width: 192,
    height: 192,
    headers: {
      "Cache-Control": CACHE_CONTROL,
    },
  });
}
