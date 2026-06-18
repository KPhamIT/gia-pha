import axios from 'axios';

const API_MESSAGE_VI: Record<string, string> = {
  'Password must be at least 6 characters': 'Mật khẩu phải có ít nhất 6 ký tự',
  'Admin must belong to an organization': 'Admin phải thuộc một tổ chức',
  'This organization already has an admin': 'Tổ chức này đã có admin',
  'Username already exists': 'Tên đăng nhập đã tồn tại',
  'Username is required': 'Vui lòng nhập tên đăng nhập',
};

function translateApiMessage(message: string): string {
  return API_MESSAGE_VI[message] ?? message;
}

function extractAxiosMessage(error: unknown): string | null {
  if (!axios.isAxiosError(error)) return null;
  const data = error.response?.data as { message?: string | string[] } | undefined;
  if (!data?.message) return null;
  const raw = Array.isArray(data.message) ? data.message.join(', ') : data.message;
  return translateApiMessage(raw);
}

export function getErrorMessage(error: unknown, fallback: string): string {
  return extractAxiosMessage(error) ?? (error instanceof Error ? error.message : fallback);
}
