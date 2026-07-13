import type { Person } from "@/components/types/family-tree-types";
import type { BookPageConfig } from "./book-page-config";

/** Các đời có trong danh sách, tăng dần (bỏ null). */
export function listPersonGenerations(persons: Person[]): number[] {
  const set = new Set<number>();
  for (const person of persons) {
    if (person.generation != null && Number.isFinite(person.generation)) {
      set.add(person.generation);
    }
  }
  return [...set].sort((a, b) => a - b);
}

function pruneHiddenOnly(config: BookPageConfig, id: number): BookPageConfig {
  const next = { ...config };
  const entry = next[id];
  if (entry && !entry.hidden && entry.order === undefined) delete next[id];
  return next;
}

/**
 * Hiện người trong [from, to] (kể cả chưa có đời); ẩn người ngoài khoảng.
 * Chỉ sửa cờ `hidden`, giữ `order` đã cấu hình.
 */
export function applyGenerationVisibility(
  persons: Person[],
  config: BookPageConfig,
  fromGen: number,
  toGen: number,
): BookPageConfig {
  const lo = Math.min(fromGen, toGen);
  const hi = Math.max(fromGen, toGen);
  let next = { ...config };

  for (const person of persons) {
    const g = person.generation;
    const inRange = g == null || (g >= lo && g <= hi);
    if (inRange) {
      if (!next[person.id]?.hidden) continue;
      next = pruneHiddenOnly(
        { ...next, [person.id]: { ...next[person.id], hidden: undefined } },
        person.id,
      );
      continue;
    }
    next = {
      ...next,
      [person.id]: { ...next[person.id], hidden: true },
    };
  }

  return next;
}
