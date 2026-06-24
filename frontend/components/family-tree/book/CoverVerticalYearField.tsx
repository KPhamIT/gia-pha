"use client";

import { useRef } from "react";
import styles from "./Book.module.scss";

type CoverVerticalYearFieldProps = {
  value: string;
  /** Năm mặc định từ org khi chưa lưu (chỉ hiển thị). */
  fallbackYear?: string;
  fontFamily: string;
  readOnly?: boolean;
  ariaLabel: string;
  positionClass: string;
  onChange?: (value: string) => void;
};

function normalizeYearInput(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 4);
}

function YearVerticalDisplay({
  year,
  fontFamily,
}: {
  year: string;
  fontFamily: string;
}) {
  return (
    <div className={styles.coverVerticalYearColumn} style={{ fontFamily }}>
      <span className={styles.coverVerticalYearOrnament} aria-hidden>
        ❖
      </span>
      {[...year].map((ch, index) => (
        <span key={`${ch}-${index}`} className={styles.coverVerticalYearChar}>
          {ch}
        </span>
      ))}
      <span className={styles.coverVerticalYearOrnament} aria-hidden>
        ❖
      </span>
    </div>
  );
}

/** Góc trên trái — chỉ hiển thị số năm (vd. 2026), mỗi chữ số một dòng. */
export default function CoverVerticalYearField({
  value,
  fallbackYear = "",
  fontFamily,
  readOnly = false,
  ariaLabel,
  positionClass,
  onChange,
}: CoverVerticalYearFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const storedYear = normalizeYearInput(value);
  const displayYear = storedYear || normalizeYearInput(fallbackYear);

  if (readOnly && !displayYear) return null;

  const focusInput = () => {
    if (!readOnly) inputRef.current?.focus();
  };

  return (
    <div
      className={`${styles.coverVerticalWrap} ${styles.coverVerticalFramedWrap} ${styles.coverVerticalYearWrap} ${positionClass}`}
      onClick={focusInput}
      onKeyDown={(e) => {
        if (!readOnly && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          focusInput();
        }
      }}
      role={readOnly ? undefined : "button"}
      tabIndex={readOnly ? undefined : 0}
      aria-label={
        readOnly ? `${ariaLabel}: ${displayYear}` : ariaLabel
      }
    >
      {displayYear ? (
        <>
          <span className={styles.coverVerticalCornerFrame} aria-hidden />
          <YearVerticalDisplay year={displayYear} fontFamily={fontFamily} />
        </>
      ) : !readOnly ? (
        <span className={styles.coverVerticalYearEmpty} aria-hidden />
      ) : null}
      {!readOnly ? (
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={4}
          className={styles.coverVerticalInput}
          value={storedYear}
          onChange={(e) => onChange?.(normalizeYearInput(e.target.value))}
          aria-label={ariaLabel}
        />
      ) : null}
    </div>
  );
}
