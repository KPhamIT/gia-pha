'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Person, PersonDetail } from '@/components/types/family-tree-types';
import { updatePersonDetail } from '@/lib/family-tree/mutations';
import { buildBookPageDraft, draftToUpdateInput, type BookPageDraft } from './GenealogyBookPage';

type Params = {
  currentPerson: Person | null;
  currentDetail: PersonDetail | null;
  details: Record<number, PersonDetail>;
  updateDetail: (id: number, detail: PersonDetail) => void;
  onPersonUpdated: (person: Person) => void;
};

/**
 * Owns the editable draft for the current book page plus a per-person cache of
 * unsaved edits, so flipping between pages keeps changes until they are saved.
 */
export function useBookDraft({ currentPerson, currentDetail, details, updateDetail, onPersonUpdated }: Params) {
  const [draft, setDraft] = useState<BookPageDraft>(buildBookPageDraft(null));
  const [savedSnapshot, setSavedSnapshot] = useState<BookPageDraft>(buildBookPageDraft(null));
  const [saving, setSaving] = useState(false);
  const [draftCache, setDraftCache] = useState<Record<number, BookPageDraft>>({});
  const loadedPersonId = useRef<number | null>(null);

  const isDirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(savedSnapshot),
    [draft, savedSnapshot],
  );

  // Load the draft for a person page only when the page actually changes, so
  // caching the current draft (which updates draftCache) doesn't clobber edits.
  useEffect(() => {
    if (!currentPerson) return;
    if (loadedPersonId.current === currentPerson.id) {
      if (currentDetail && !draftCache[currentPerson.id]) {
        const fromDetail = buildBookPageDraft(currentDetail);
        setSavedSnapshot(fromDetail);
        setDraft((prev) => (JSON.stringify(prev) === JSON.stringify(buildBookPageDraft(null)) ? fromDetail : prev));
      }
      return;
    }
    loadedPersonId.current = currentPerson.id;
    /* eslint-disable react-hooks/set-state-in-effect */
    const cachedDraft = draftCache[currentPerson.id];
    if (cachedDraft) {
      setDraft(cachedDraft);
      setSavedSnapshot(buildBookPageDraft(currentDetail));
    } else {
      const initial = buildBookPageDraft(currentDetail);
      setDraft(initial);
      setSavedSnapshot(initial);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [currentPerson, currentDetail, draftCache]);

  const cacheCurrentDraft = useCallback(() => {
    if (!currentPerson || !isDirty) return;
    setDraftCache((prev) => ({ ...prev, [currentPerson.id]: draft }));
  }, [currentPerson, draft, isDirty]);

  const getPersonDraft = useCallback(
    (person: Person): BookPageDraft => draftCache[person.id] ?? buildBookPageDraft(details[person.id] ?? null),
    [draftCache, details],
  );

  const handleSave = useCallback(async () => {
    if (!currentPerson || !isDirty || saving) return;
    setSaving(true);
    try {
      const updated = await updatePersonDetail(currentPerson.id, draftToUpdateInput(draft));
      updateDetail(currentPerson.id, updated);
      const saved = buildBookPageDraft(updated);
      setDraft(saved);
      setSavedSnapshot(saved);
      setDraftCache((prev) => {
        if (!(currentPerson.id in prev)) return prev;
        const next = { ...prev };
        delete next[currentPerson.id];
        return next;
      });
      onPersonUpdated(updated.person);
    } finally {
      setSaving(false);
    }
  }, [currentPerson, draft, isDirty, saving, updateDetail, onPersonUpdated]);

  return { draft, setDraft, isDirty, saving, cacheCurrentDraft, getPersonDraft, handleSave };
}
