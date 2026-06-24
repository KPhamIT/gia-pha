"use client";

import { useEffect, useState } from "react";
import type { BranchValue } from "@/lib/constants/branches";
import {
  isBranchWelcomeDone,
  loadUserBranch,
  markBranchWelcomeDone,
  saveUserBranch,
} from "@/utils/branch-storage";

/**
 * Nhánh người dùng đã chọn (tuỳ chọn, qua bộ lọc). Welcome không còn bắt chọn nhánh.
 */
export function useUserBranch() {
  const [branch, setBranchState] = useState<BranchValue | null>(null);
  const [welcomeDone, setWelcomeDone] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setBranchState(loadUserBranch());
    setWelcomeDone(isBranchWelcomeDone());
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const setBranch = (value: BranchValue) => {
    saveUserBranch(value);
    markBranchWelcomeDone();
    setBranchState(value);
    setWelcomeDone(true);
  };

  const completeWelcome = () => {
    markBranchWelcomeDone();
    setWelcomeDone(true);
  };

  return { branch, setBranch, welcomeDone, completeWelcome, hydrated };
}
