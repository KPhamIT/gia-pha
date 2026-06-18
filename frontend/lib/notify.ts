import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';

export const notify = {
  success(message: string) {
    toast.success(message);
  },
  error(error: unknown, fallback: string) {
    toast.error(getErrorMessage(error, fallback));
  },
};

export async function runWithNotify<T>(
  action: () => Promise<T>,
  options: { success: string; error: string },
): Promise<T | undefined> {
  try {
    const result = await action();
    notify.success(options.success);
    return result;
  } catch (error) {
    notify.error(error, options.error);
    return undefined;
  }
}
