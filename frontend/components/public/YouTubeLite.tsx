"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import YouTubeLightbox from "./YouTubeLightbox";

type YouTubeLiteProps = {
  videoId: string;
  title: string;
  /** Ảnh bìa lưu trong web (không tải ảnh từ YouTube trước khi bấm). */
  poster: string;
  /** Nhãn thời lượng góc ảnh, vd. "1:42". */
  duration?: string;
  playLabel: string;
};

/**
 * Khung video YouTube nhẹ: ban đầu chỉ là ảnh bìa + nút phát,
 * bấm mới mở popup và tải trình phát (youtube-nocookie) — không làm chậm trang khi không ai xem.
 */
export default function YouTubeLite({ videoId, title, poster, duration, playLabel }: YouTubeLiteProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const getOriginRect = useCallback(() => buttonRef.current?.getBoundingClientRect() ?? null, []);
  const handleClose = useCallback(() => {
    setOpen(false);
    // Ảnh bìa đang ẩn khi popup mở — đợi hiện lại rồi mới trả focus.
    requestAnimationFrame(() => buttonRef.current?.focus({ preventScroll: true }));
  }, []);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#321716] shadow-[0_18px_40px_rgba(50,23,22,0.22)] ring-1 ring-black/5">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${playLabel}: ${title}`}
        className="group absolute inset-0 h-full w-full cursor-pointer"
        // Ẩn ảnh bìa khi popup mở để khung video "bay" ra từ đúng chỗ.
        style={{ visibility: open ? "hidden" : undefined }}
      >
        <Image
          src={poster}
          alt={title}
          fill
          sizes="(min-width: 1024px) 640px, 100vw"
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
        />
        <span className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(105deg,transparent_35%,rgba(255,246,220,0.55)_50%,transparent_65%)] transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
        <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#c0261a] text-white shadow-lg transition group-hover:scale-110 md:h-20 md:w-20">
          <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8 md:h-10 md:w-10" aria-hidden>
            <path fill="currentColor" d="M8 5.14v13.72a1 1 0 0 0 1.52.85l10.6-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z" />
          </svg>
        </span>
        {duration ? (
          <span className="absolute bottom-3 right-3 rounded-md bg-black/75 px-2 py-0.5 text-xs font-semibold text-white">
            {duration}
          </span>
        ) : null}
      </button>

      {open ? (
        <YouTubeLightbox videoId={videoId} title={title} getOriginRect={getOriginRect} onClose={handleClose} />
      ) : null}
    </div>
  );
}
