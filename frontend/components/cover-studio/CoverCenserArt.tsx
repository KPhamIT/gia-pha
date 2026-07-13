"use client";

/** Lư hương + khói stylized (SVG) cho mẫu cuốn thư cam. */
export default function CoverCenserArt({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M72 38c-4-10 2-18 8-22 6 4 12 12 8 22"
        stroke="#f5e6b8"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M88 36c3-9 10-14 16-16-1 8-4 14-10 18"
        stroke="#ffe08a"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M80 40c6-8 14-10 20-8-4 8-10 12-18 12"
        stroke="#fff8e0"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.7"
      />
      <ellipse cx="80" cy="52" rx="28" ry="6" fill="#5c3a1e" />
      <path
        d="M52 52c2 18 10 28 28 32 18-4 26-14 28-32"
        fill="#6b4423"
        stroke="#3d2412"
        strokeWidth="1.5"
      />
      <path
        d="M58 58h44c1 8-2 14-22 16S57 66 58 58Z"
        fill="#8a5a2b"
      />
      <rect x="70" y="48" width="20" height="6" rx="2" fill="#c9a227" />
      <path d="M54 84l-8 18h12l4-18" fill="#4a2f16" />
      <path d="M106 84l8 18H102l-4-18" fill="#4a2f16" />
      <path d="M78 86v16h4V86" fill="#4a2f16" />
      <circle cx="80" cy="64" r="4" fill="#d4af37" />
    </svg>
  );
}
