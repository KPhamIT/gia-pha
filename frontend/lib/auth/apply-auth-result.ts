import axios from "axios";
import { setToken } from "@/lib/auth/session";
import {
  setStoredOrgAccessToken,
  syncOrgAccessTokenFromAuth,
} from "@/lib/org/org-access";
import { invalidateUserSettingsCache } from "@/lib/settings/user-settings-cache";

/** Lưu JWT + org token sau khi đăng nhập / xác nhận email (chưa refresh store). */
export function applyAuthResult(result: {
  accessToken: string;
  orgAccessToken?: string | null;
}): void {
  setToken(result.accessToken);
  syncOrgAccessTokenFromAuth(result.orgAccessToken);
  if (result.orgAccessToken) setStoredOrgAccessToken(result.orgAccessToken);
  invalidateUserSettingsCache();
}

/** Backend trả 403 { code: "EMAIL_NOT_VERIFIED" } khi tài khoản chưa xác nhận email. */
export function isEmailNotVerifiedError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;
  const data = error.response?.data as { code?: string } | undefined;
  return data?.code === "EMAIL_NOT_VERIFIED";
}
