const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:4000";

export default function FamilyTreeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="preconnect" href={API_ORIGIN} crossOrigin="anonymous" />
      <link
        rel="preload"
        href="/images/bg-tree-mobile.webp"
        as="image"
        type="image/webp"
        media="(max-width: 767px)"
      />
      <link
        rel="preload"
        href="/images/bg-tree-desktop.webp"
        as="image"
        type="image/webp"
        media="(min-width: 768px)"
      />
      <link
        rel="preload"
        href="/fonts/THUPHAPTHANHCONG3a.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      {children}
    </>
  );
}
