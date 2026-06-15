const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://localhost:4000';

export default function FamilyTreeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href={API_ORIGIN} crossOrigin="anonymous" />
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
