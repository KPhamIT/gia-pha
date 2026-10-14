import type { PrintBookTemplate } from "@/lib/api/modules/ceremonies";

export function creatorName(t: PrintBookTemplate): string {
  return t.createdBy?.username || t.createdBy?.email || `#${t.createdBy?.id ?? "?"}`;
}

/** Bài hệ thống đủ nội dung, theo thứ tự trong kho — lựa chọn mặc định của sách. */
export function defaultSelection(all: PrintBookTemplate[]): number[] {
  return all.filter((t) => t.isSystemTemplate && t.publishable).map((t) => t.id);
}

/** Dời phần tử `from` sang vị trí `to` (giữ nguyên nếu ngoài phạm vi). */
export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length || from === to) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
