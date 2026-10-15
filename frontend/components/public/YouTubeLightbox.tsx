"use client";

import { useEffect, useRef, useState } from "react";
import OverlayPortal from "@/components/ui/OverlayPortal";
import ShowcaseChrome from "@/components/shop/ShowcaseChrome";
import { useFlipPresence } from "@/components/shop/useFlipPresence";
import styles from "@/components/shop/ShowcaseLightbox.module.css";

type Props = {
  videoId: string;
  title: string;
  /** Vị trí ảnh bìa — để khung video bay ra / bay về đúng chỗ. */
  getOriginRect: () => DOMRect | null;
  onClose: () => void;
};

const VIDEO_RATIO = 9 / 16;

/** Bề rộng khung video vừa màn hình, chừa chỗ cho nút đóng và tiêu đề. */
function frameWidth(): number {
  const byWidth = window.innerWidth * 0.92;
  const byHeight = (window.innerHeight - 200) / VIDEO_RATIO;
  return Math.round(Math.max(260, Math.min(byWidth, byHeight, 1100)));
}

/** Popup xem video cùng phong cách trang dịch vụ: khung bay từ ảnh bìa ra giữa, nền tối, bụi vàng. */
export default function YouTubeLightbox({ videoId, title, getOriginRect, onClose }: Props) {
  const moverRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [width, setWidth] = useState(frameWidth);
  const { closing, close } = useFlipPresence(moverRef, getOriginRect, onClose);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onResize = () => setWidth(frameWidth());
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <OverlayPortal>
      <div
        className={`${styles.backdrop} ${closing ? styles.closing : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <ShowcaseChrome index={0} total={1} closeRef={closeRef} onClose={close} onPrev={close} onNext={close} />

        <div className={styles.stage} style={{ cursor: "default" }}>
          <div ref={moverRef} className={styles.mover}>
            <div
              className="relative overflow-hidden rounded-xl bg-black shadow-[0_30px_60px_-12px_rgba(0,0,0,0.65)] ring-1 ring-[#f6d68e]/30"
              style={{ width, height: Math.round(width * VIDEO_RATIO) }}
            >
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`}
                title={title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
              <span className={styles.sheen} aria-hidden />
            </div>
            <div className={styles.floor} aria-hidden />
          </div>
        </div>

        <div className={styles.caption}>
          <p className={styles.title}>{title}</p>
        </div>
      </div>
    </OverlayPortal>
  );
}
