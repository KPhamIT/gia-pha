import { create } from "zustand";

export type AuthGateReason = "login" | "admin" | "permission";

type AuthGateStore = {
  reason: AuthGateReason | null;
  open: (reason: AuthGateReason) => void;
  close: () => void;
};

export const useAuthGateStore = create<AuthGateStore>((set) => ({
  reason: null,
  open: (reason) => set({ reason }),
  close: () => set({ reason: null }),
}));
