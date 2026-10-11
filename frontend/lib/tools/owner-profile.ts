"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Gender } from "@/lib/xem-tuoi/criteria";

/** Năm sinh + giới tính gia chủ, dùng chung giữa các tab công cụ (chỉ lưu trên máy người dùng). */
export type OwnerProfile = { birthYear: number; gender: Gender };

const KEY = "giapha.tools.owner";
const DEFAULT: OwnerProfile = { birthYear: 1985, gender: "male" };
const listeners = new Set<() => void>();
/** Dự phòng khi trình duyệt chặn localStorage. */
let memory: OwnerProfile | null = null;
let cache: { raw: string; value: OwnerProfile } | null = null;

function parse(raw: string): OwnerProfile {
  try {
    const v = JSON.parse(raw) as Partial<OwnerProfile>;
    const birthYear = Number(v.birthYear);
    const gender = v.gender === "female" ? "female" : "male";
    return birthYear > 1900 && birthYear < 2100
      ? { birthYear, gender }
      : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

function read(): OwnerProfile {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    // Bị chặn storage — dùng bản trong bộ nhớ.
  }
  if (raw === null) return memory ?? DEFAULT;
  if (cache?.raw !== raw) cache = { raw, value: parse(raw) };
  return cache.value;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

export function useOwnerProfile(): [
  OwnerProfile,
  (patch: Partial<OwnerProfile>) => void,
] {
  const owner = useSyncExternalStore(subscribe, read, () => DEFAULT);
  const update = useCallback((patch: Partial<OwnerProfile>) => {
    const next = { ...read(), ...patch };
    memory = next;
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Không lưu được thì vẫn giữ trong phiên hiện tại.
    }
    listeners.forEach((l) => l());
  }, []);
  return [owner, update];
}
