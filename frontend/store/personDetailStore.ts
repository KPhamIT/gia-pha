import { create } from 'zustand';
import type { PersonDetail } from '@/components/types/family-tree-types';
import { api } from '@/lib/api';

type Status = 'idle' | 'loading' | 'loaded' | 'error';

type PersonDetailStore = {
  details: Record<number, PersonDetail>;
  status: Status;
  loadAll: () => Promise<void>;
  reloadOne: (id: number) => Promise<void>;
  updateDetail: (id: number, detail: PersonDetail) => void;
};

let loadAllInflight: Promise<void> | null = null;
const reloadInflight = new Map<number, Promise<void>>();

export const usePersonDetailStore = create<PersonDetailStore>((set, get) => ({
  details: {},
  status: 'idle',

  loadAll: async () => {
    const { status } = get();
    if (status === 'loaded') return;
    if (loadAllInflight) return loadAllInflight;

    loadAllInflight = (async () => {
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
      } finally {
        loadAllInflight = null;
      }
    })();

    return loadAllInflight;
  },

  reloadOne: async (id) => {
    const existing = reloadInflight.get(id);
    if (existing) return existing;

    const promise = api.person
      .getDetail(id)
      .then((detail) => {
        set((state) => ({ details: { ...state.details, [id]: detail } }));
      })
      .finally(() => {
        reloadInflight.delete(id);
      });

    reloadInflight.set(id, promise);
    return promise;
  },

  updateDetail: (id, detail) => {
    set((state) => ({ details: { ...state.details, [id]: detail } }));
  },
}));
