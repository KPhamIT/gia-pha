import { ImageResponse } from "next/og";

export const runtime = "edge";

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
  return new ImageResponse(<PwaIcon fontSize={280} />, {
    width: 512,
    height: 512,
  });
}
