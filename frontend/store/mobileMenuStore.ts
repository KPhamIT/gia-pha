import { create } from "zustand";

type MobileMenuStore = {
  open: boolean;
  show: () => void;
  hide: () => void;
  toggle: () => void;
};

export const useMobileMenuStore = create<MobileMenuStore>((set) => ({
  open: false,
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
  toggle: () => set((s) => ({ open: !s.open })),
}));
