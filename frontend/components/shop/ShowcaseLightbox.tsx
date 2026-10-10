"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import OverlayPortal from "@/components/ui/OverlayPortal";
import ShowcaseBook3D from "./ShowcaseBook3D";
import ShowcaseChrome, { ShowcaseCaption } from "./ShowcaseChrome";
import type { ShowcaseItem, ShowcaseTexts } from "./showcase-types";
import { useBookTilt } from "./useBookTilt";
import { useFlipPresence } from "./useFlipPresence";
import styles from "./ShowcaseLightbox.module.css";

type ShowcaseLightboxProps = {
  items: ShowcaseItem[];
  index: number;
  texts: ShowcaseTexts;
  /** Vị trí ô nhỏ — để mục bay ra / bay về đúng chỗ. */
  getThumbRect: (index: number) => DOMRect | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

const SWIPE_PX = 50;

/** Bề rộng mặt hiển thị sao cho vừa màn hình, chừa chỗ cho chú thích. */
function faceWidth(ratio: number): number {
  const byWidth = window.innerWidth * 0.74;
  const byHeight = (window.innerHeight - 320) / ratio;
  return Math.round(Math.max(190, Math.min(byWidth, byHeight, 460)));
}

/** Popup trưng bày: mặt 3D nghiêng theo chuột, lật mặt sau, đổi mục, bay ra / về ô nhỏ. */
export default function ShowcaseLightbox({
  items,
  index,
  texts,
  getThumbRect,
  onIndexChange,
  onClose,
}: ShowcaseLightboxProps) {
  const item = items[index];
  const total = items.length;
  const [viewport, setViewport] = useState(0);
  const [side, setSide] = useState<"front" | "back">("front");
  const [navDir, setNavDir] = useState<"next" | "prev" | null>(null);
  const moverRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const swipeStart = useRef<number | null>(null);
  const { bookRef, tracking, setTracking, handlePointerMove, resetTilt } = useBookTilt();
  const getOriginRect = useCallback(() => getThumbRect(index), [getThumbRect, index]);
  const { closing, close } = useFlipPresence(moverRef, getOriginRect, onClose);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onResize = () => setViewport((v) => v + 1);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const go = useCallback(
    (step: 1 | -1) => {
      setNavDir(step === 1 ? "next" : "prev");
      setSide("front");
      onIndexChange((index + step + total) % total);
    },
    [index, onIndexChange, total],
  );

  const flipTo = useCallback(
    (next: "front" | "back") => {
      setTracking(false);
      setSide(next);
    },
    [setTracking],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key.toLowerCase() === "f" && item.renderBack) {
        flipTo(side === "front" ? "back" : "front");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, flipTo, go, item.renderBack, side]);

  // Tính lại theo tỉ lệ của mục đang xem (và khi đổi kích thước cửa sổ).
  const width = viewport >= 0 ? faceWidth(item.ratio) : 0;

  const enterClass =
    navDir === "next" ? styles.enterNext : navDir === "prev" ? styles.enterPrev : "";

  return (
    <OverlayPortal>
      <div
        className={`${styles.backdrop} ${closing ? styles.closing : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={texts.dialog}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <ShowcaseChrome
          index={index}
          total={total}
          closeRef={closeRef}
          onClose={close}
          onPrev={() => go(-1)}
          onNext={() => go(1)}
        />

        <div
          className={styles.stage}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetTilt}
          onPointerDown={(e) => {
            if (e.pointerType !== "mouse") swipeStart.current = e.clientX;
          }}
          onPointerUp={(e) => {
            const start = swipeStart.current;
            swipeStart.current = null;
            if (start == null) return;
            const dx = e.clientX - start;
            if (Math.abs(dx) > SWIPE_PX) go(dx < 0 ? 1 : -1);
          }}
        >
          <div ref={moverRef} key={index} className={`${styles.mover} ${enterClass}`}>
            <ShowcaseBook3D
              item={item}
              width={width}
              side={side}
              tracking={tracking}
              bookRef={bookRef}
            />
          </div>
        </div>

        <ShowcaseCaption item={item} side={side} texts={texts} onFlip={flipTo} />
      </div>
    </OverlayPortal>
  );
}
