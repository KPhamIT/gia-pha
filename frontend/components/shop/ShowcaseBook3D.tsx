"use client";

import type { CSSProperties, RefObject } from "react";
import type { ShowcaseItem } from "./showcase-types";
import styles from "./ShowcaseLightbox.module.css";

type Props = {
  item: ShowcaseItem;
  width: number;
  side: "front" | "back";
  tracking: boolean;
  bookRef: RefObject<HTMLDivElement | null>;
};

/** Mặt trưng bày 3D: trước / sau (lật bằng `--flip`), gáy, mép giấy, ánh sáng. */
export default function ShowcaseBook3D({ item, width, side, tracking, bookRef }: Props) {
  const style = {
    width,
    height: width * item.ratio,
    "--flip": side === "back" ? "180deg" : "0deg",
  } as CSSProperties;

  return (
    <>
      <div ref={bookRef} className={`${styles.book} ${tracking ? styles.tracking : ""}`} style={style}>
        {item.thick ? <div className={styles.pages} aria-hidden /> : null}
        <div className={`${styles.face} ${item.thick ? "" : styles.sheet}`}>
          {item.renderFront(width)}
          {item.thick ? <div className={styles.spine} aria-hidden /> : null}
          <div className={styles.glare} aria-hidden />
          <div className={styles.sheen} aria-hidden />
        </div>
        {item.renderBack ? (
          <div className={`${styles.face} ${styles.back}`}>
            {item.renderBack(width)}
            {item.thick ? <div className={styles.spine} aria-hidden /> : null}
            <div className={styles.glare} aria-hidden />
          </div>
        ) : null}
      </div>
      <div className={styles.floor} aria-hidden />
    </>
  );
}
