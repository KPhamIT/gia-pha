"use client";

import type { CSSProperties, RefObject } from "react";
import { UI } from "@/lib/constants/ui-strings";
import BuyButton from "./BuyButton";
import type { ShowcaseItem, ShowcaseTexts } from "./showcase-types";
import styles from "./ShowcaseLightbox.module.css";

/** Hạt bụi vàng (cố định để không đổi giữa các lần render). */
const DUST = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  size: `${3 + (i % 4)}px`,
  dur: `${9 + (i % 5) * 2.2}s`,
  delay: `${(i * 0.73) % 9}s`,
  drift: `${((i % 7) - 3) * 14}px`,
}));

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

type Props = {
  index: number;
  total: number;
  closeRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

/** Nền trang trí (vầng sáng, bụi vàng) và các nút đóng / chuyển mục của popup. */
export default function ShowcaseChrome({
  index,
  total,
  closeRef,
  onClose,
  onPrev,
  onNext,
}: Props) {
  return (
    <>
      <div className={styles.halo} aria-hidden />
      {DUST.map((d, i) => (
        <span
          key={i}
          className={styles.dust}
          aria-hidden
          style={
            {
              left: d.left,
              "--size": d.size,
              "--dur": d.dur,
              "--delay": d.delay,
              "--drift": d.drift,
            } as CSSProperties
          }
        />
      ))}

      {total > 1 ? (
        <span className={styles.counter}>
          {UI.SHOP_COVER_COUNTER(index + 1, total)}
        </span>
      ) : null}
      <button
        ref={closeRef}
        type="button"
        className={`${styles.iconButton} ${styles.close}`}
        onClick={onClose}
        aria-label={UI.SHOP_COVER_CLOSE}
      >
        <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden>
          <path {...STROKE} d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>
      {total > 1 ? (
        <>
          <button
            type="button"
            className={`${styles.iconButton} ${styles.nav} ${styles.prev}`}
            onClick={onPrev}
            aria-label={UI.SHOP_COVER_PREV}
          >
            <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden>
              <path {...STROKE} d="m15 5-7 7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            className={`${styles.iconButton} ${styles.nav} ${styles.next}`}
            onClick={onNext}
            aria-label={UI.SHOP_COVER_NEXT}
          >
            <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden>
              <path {...STROKE} d="m9 5 7 7-7 7" />
            </svg>
          </button>
        </>
      ) : null}
    </>
  );
}

type CaptionProps = {
  item: ShowcaseItem;
  side: "front" | "back";
  texts: ShowcaseTexts;
  onFlip: (side: "front" | "back") => void;
};

/** Tên mục, mô tả, nút chuyển mặt trước / sau (nếu có) và nút đặt mua. */
export function ShowcaseCaption({ item, side, texts, onFlip }: CaptionProps) {
  return (
    <div className={styles.caption}>
      <p className={styles.title}>{item.label}</p>
      {item.description ? (
        <p className={styles.description}>{item.description}</p>
      ) : null}
      {item.renderBack ? (
        <div className={styles.segment}>
          <button
            type="button"
            aria-pressed={side === "front"}
            onClick={() => onFlip("front")}
          >
            {UI.SHOP_COVER_FRONT}
          </button>
          <button
            type="button"
            aria-pressed={side === "back"}
            onClick={() => onFlip("back")}
          >
            {UI.SHOP_COVER_BACK}
          </button>
        </div>
      ) : null}
      {item.orderRef ? <BuyButton productRef={item.orderRef} label={texts.order} /> : null}
      <p className={styles.hint}>
        <span className="hidden md:inline">{texts.hint}</span>
        <span className="md:hidden">{texts.hintTouch}</span>
      </p>
    </div>
  );
}
