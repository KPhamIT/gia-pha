'use client';

import { useCallback, useState } from 'react';
import { getErrorMessage } from '@/utils/errors';

export function useAsyncAction() {
  const [loading, setLoading] = useState(false);

  const run = useCallback(async <T>(
    action: () => Promise<T>,
    errorMessage: string,
    onError: (message: string) => void = alert,
  ): Promise<T | undefined> => {
    setLoading(true);
    try {
      return await action();
    } catch (error) {
      onError(getErrorMessage(error, errorMessage));
      return undefined;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, run };
}
