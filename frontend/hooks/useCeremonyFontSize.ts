"use client";

import { useCallback, useState } from "react";
import { STORAGE_KEYS } from "@/lib/constants/storage-keys";

export const CEREMONY_FONT_SCALES = [0.9, 1, 1.15, 1.3, 1.5, 1.75] as const;
const DEFAULT_SCALE_INDEX = 1;

function loadScaleIndex(): number {
  if (typeof window === "undefined") return DEFAULT_SCALE_INDEX;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.CEREMONY_FONT_SCALE_INDEX);
    if (raw == null) return DEFAULT_SCALE_INDEX;
    const index = Number.parseInt(raw, 10);
    if (
      Number.isNaN(index) ||
      index < 0 ||
      index >= CEREMONY_FONT_SCALES.length
    ) {
      return DEFAULT_SCALE_INDEX;
    }
    return index;
  } catch {
    return DEFAULT_SCALE_INDEX;
  }
}

function saveScaleIndex(index: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEYS.CEREMONY_FONT_SCALE_INDEX,
      String(index),
    );
  } catch {
    /* ignore quota */
  }
}

export function formatCeremonyFontScaleLabel(scale: number): string {
  return `${Math.round(scale * 100)}%`;
}

export function useCeremonyFontSize() {
  const [scaleIndex, setScaleIndex] = useState(loadScaleIndex);
  const scale = CEREMONY_FONT_SCALES[scaleIndex];

  const setIndex = useCallback((next: number) => {
    const clamped = Math.min(
      CEREMONY_FONT_SCALES.length - 1,
      Math.max(0, next),
    );
    setScaleIndex(clamped);
    saveScaleIndex(clamped);
  }, []);

  return {
    scale,
    scaleLabel: formatCeremonyFontScaleLabel(scale),
    canDecrease: scaleIndex > 0,
    canIncrease: scaleIndex < CEREMONY_FONT_SCALES.length - 1,
    decrease: () => setIndex(scaleIndex - 1),
    increase: () => setIndex(scaleIndex + 1),
  };
}
