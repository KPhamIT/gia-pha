import { STORAGE_KEYS } from "@/lib/constants/storage-keys";
import { isBranchValue, type BranchValue } from "@/lib/constants/branches";

/** The branch the user said they belong to, asked once on first visit. */
export function loadUserBranch(): BranchValue | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEYS.USER_BRANCH);
  const value = raw != null ? Number(raw) : NaN;
  return isBranchValue(value) ? value : null;
}

export function saveUserBranch(branch: BranchValue): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEYS.USER_BRANCH, String(branch));
  } catch {
    /* ignore quota / serialization errors */
  }
}

/** Đã xem welcome — mặc định hiển thị tất cả nhánh, không bắt chọn nhánh. */
export function isBranchWelcomeDone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.localStorage.getItem(STORAGE_KEYS.BRANCH_WELCOME_DONE) === "1" ||
    loadUserBranch() != null
  );
}

export function markBranchWelcomeDone(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEYS.BRANCH_WELCOME_DONE, "1");
  } catch {
    /* ignore */
  }
}
