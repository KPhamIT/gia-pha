import { create } from 'zustand';
import type { PersonDetail } from '@/components/types/family-tree-types';
import { api } from '@/lib/api';

type Status = 'idle' | 'loading' | 'loaded' | 'error';

type PersonDetailStore = {
  details: Record<number, PersonDetail>;
  status: Status;
  loadAll: () => Promise<void>;
  updateDetail: (id: number, detail: PersonDetail) => void;
};

export const usePersonDetailStore = create<PersonDetailStore>((set, get) => ({
  details: {},
  status: 'idle',

  loadAll: async () => {
    const { status } = get();
    if (status === 'loading' || status === 'loaded') return;

    set({ status: 'loading' });
    try {
      const all = await api.person.getAllDetails();
      const details: Record<number, PersonDetail> = {};
      for (const d of all) {
        details[d.person.id] = d;
      }
      set({ details, status: 'loaded' });
    } catch {
      set({ status: 'error' });
    }
  },

  updateDetail: (id, detail) => {
    set((state) => ({ details: { ...state.details, [id]: detail } }));
  },
}));
