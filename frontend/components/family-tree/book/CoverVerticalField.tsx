"use client";

import { useRef } from "react";
import styles from "./Book.module.scss";

type CoverVerticalFieldProps = {
  value: string;
  fontFamily: string;
  readOnly?: boolean;
  placeholder?: string;
  ariaLabel: string;
  positionClass: string;
  /** Địa chỉ dài — chữ nhỏ hơn + khung trang trí. */
  variant?: "default" | "address";
  onChange?: (value: string) => void;
};

function splitVerticalChars(text: string): string[] {
  return [...text];
}

function VerticalChars({
  chars,
  charClass,
}: {
  chars: string[];
  charClass: string;
}) {
  return (
    <>
      {chars.map((ch, index) =>
        ch === " " ? (
          <span
            key={`sp-${index}`}
            className={styles.coverVerticalSpace}
            aria-hidden
          />
        ) : (
          <span key={`${ch}-${index}`} className={charClass}>
            {ch}
          </span>
        ),
      )}
    </>
  );
}

/** Một ký tự mỗi dòng ở góc trang bìa; chỉnh sửa qua input ẩn phía trên. */
export default function CoverVerticalField({
  value,
  fontFamily,
  readOnly = false,
  placeholder = "",
  ariaLabel,
  positionClass,
  variant = "default",
  onChange,
}: CoverVerticalFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const trimmed = value.trim();
  const isAddress = variant === "address";
  const charClass = isAddress
    ? styles.coverVerticalCharSmall
    : styles.coverVerticalChar;

  if (readOnly && !trimmed) return null;

  const displayText = trimmed || placeholder;
  const isPlaceholder = !trimmed;
  const chars = splitVerticalChars(displayText);

  const focusInput = () => {
    if (!readOnly) inputRef.current?.focus();
  };

  return (
    <div
      className={`${styles.coverVerticalWrap} ${isAddress ? styles.coverVerticalFramedWrap : ""} ${isAddress ? styles.coverVerticalAddressWrap : ""} ${positionClass}`}
      onClick={focusInput}
      onKeyDown={(e) => {
        if (!readOnly && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          focusInput();
        }
      }}
      role={readOnly ? undefined : "button"}
      tabIndex={readOnly ? undefined : 0}
      aria-label={readOnly ? `${ariaLabel}: ${trimmed}` : ariaLabel}
    >
      {isAddress ? <span className={styles.coverVerticalCornerFrame} aria-hidden /> : null}
      <div
        className={`${styles.coverVerticalDisplay} ${isAddress ? styles.coverVerticalAddressDisplay : ""} ${isPlaceholder ? styles.coverVerticalPlaceholder : ""}`}
        style={{ fontFamily }}
        aria-hidden={!readOnly}
      >
        <VerticalChars chars={chars} charClass={charClass} />
      </div>
      {!readOnly ? (
        <input
          ref={inputRef}
          type="text"
          className={styles.coverVerticalInput}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          aria-label={ariaLabel}
        />
      ) : null}
    </div>
  );
}
