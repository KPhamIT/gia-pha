import { STORAGE_KEYS } from "@/lib/constants/storage-keys";
import { API_ROUTES } from "@/lib/constants/api-routes";
import { useAuthStore } from "@/store/authStore";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

export function getZaloLoginUrl(): string {
  return `${API_URL}${API_ROUTES.AUTH_ZALO}`;
}

export function loginWithZalo(): void {
  window.location.href = getZaloLoginUrl();
}

export async function logout(): Promise<void> {
  // Gỡ subscription khỏi user hiện tại khi token còn hiệu lực. Import động để
  // tránh phụ thuộc vòng (push-binding → api → axiosClient → session).
  try {
    const { unbindPushBeforeLogout } = await import(
      "@/lib/notifications/push-binding"
    );
    await unbindPushBeforeLogout();
  } catch {
    // best-effort
  }
  clearToken();
  useAuthStore.getState().clear();
  window.location.href = "/login";
}
