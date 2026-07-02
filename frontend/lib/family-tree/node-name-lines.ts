import type { NodeTextCase, NodeTextDirection } from "@/components/types/family-tree-types";

/** Khoảng cách giữa các từ khi xếp dọc (baseline → baseline). */
export function verticalWordLineGap(fontSize: number): number {
  return Math.max(fontSize * 1.5, fontSize + 8);
}

export function horizontalLineGap(fontSize: number): number {
  return fontSize * 1.2;
}

export function formatNodeDisplayName(
  fullName: string,
  textCase: NodeTextCase,
): string {
  const trimmed = fullName.trim();
  if (textCase === "uppercase") return trimmed.toUpperCase();
  if (textCase === "lowercase") return trimmed.toLowerCase();
  return trimmed;
}

/**
 * Dọc: mỗi từ một hàng ("Phạm", "Văn", "Khánh").
 * Ngang: cả tên một hàng ("Phạm Văn Khánh").
 */
export function nodeNameLines(
  displayName: string,
  direction: NodeTextDirection,
): string[] {
  if (direction === "vertical") {
    const words = displayName.split(/\s+/).filter(Boolean);
    return words.length > 0 ? words : [""];
  }
  return displayName ? [displayName] : [""];
}
