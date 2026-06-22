"use client";

import { useEffect, useState } from "react";
import type { BranchValue } from "@/lib/constants/branches";
import { loadUserBranch, saveUserBranch } from "@/utils/branch-storage";

/**
 * Tracks the branch the user picked on their first visit (persisted locally).
 * `hydrated` flips true once we've read localStorage, so the caller knows
 * whether the one-time branch prompt still needs to be shown.
 */
export function useUserBranch() {
  const [branch, setBranchState] = useState<BranchValue | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setBranchState(loadUserBranch());
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const setBranch = (value: BranchValue) => {
    saveUserBranch(value);
    setBranchState(value);
  };

  return { branch, setBranch, hydrated };
}
