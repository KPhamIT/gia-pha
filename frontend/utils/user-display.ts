import type { AuthUser, Person } from "@/components/types/family-tree-types";

export function resolveUserDisplayName(
  user: Pick<AuthUser, "username" | "email">,
  person?: Pick<Person, "fullName"> | null,
): string {
  return user.username || user.email || person?.fullName || "—";
}

/** Hai chữ cái đầu để hiện avatar tài khoản (họ + tên hoặc 2 ký tự đầu). */
export function userDisplayInitials(
  user: Pick<AuthUser, "username" | "email"> | null,
  person?: Pick<Person, "fullName"> | null,
): string {
  const source = (
    person?.fullName ||
    user?.username ||
    user?.email ||
    "?"
  ).trim();
  const words = source.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return `${words[0].charAt(0)}${words[words.length - 1].charAt(0)}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase() || "?";
}
