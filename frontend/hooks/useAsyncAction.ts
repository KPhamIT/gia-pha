"use client";

import { useCallback, useState } from "react";
import { notify } from "@/lib/notify";

type RunOptions = {
  success?: string;
};

export function useAsyncAction() {
  const [loading, setLoading] = useState(false);

  const run = useCallback(
    async <T>(
      action: () => Promise<T>,
      errorMessage: string,
      options?: RunOptions,
    ): Promise<T | undefined> => {
      setLoading(true);
      try {
        const result = await action();
        if (options?.success) notify.success(options.success);
        return result;
      } catch (error) {
        notify.error(error, errorMessage);
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { loading, run };
}
