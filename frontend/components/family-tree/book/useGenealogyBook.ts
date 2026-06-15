'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { Person } from '@/components/types/family-tree-types';
import { sortPersonsForBook } from '@/utils/sort-persons-for-book';
import { usePersonDetailStore } from '@/store/personDetailStore';
import { type BookLeafCtx } from './BookLeaf';
import { buildLeaves } from './book-leaves';
import { applyPageConfig } from './book-page-config';
import { useBookSettings } from './useBookSettings';
import { useBookDraft } from './useBookDraft';
import { useBookFlip } from './useBookFlip';
import { useGenealogyPrint } from './useGenealogyPrint';
import { ensureCalligraphyFontLoaded } from './calligraphy-font-loader';

/**
 * Composes the book's data + interaction hooks (settings, draft editing, page
 * flipping, printing) and exposes everything {@link GenealogyBookViewer} renders.
 */
export function useGenealogyBook(persons: Person[], onPersonUpdated: (person: Person) => void) {
  const sortedPersons = useMemo(() => sortPersonsForBook(persons), [persons]);

  const details = usePersonDetailStore((s) => s.details);
  const loadAll = usePersonDetailStore((s) => s.loadAll);
  const updateDetail = usePersonDetailStore((s) => s.updateDetail);
  const { settings, updateSettings, hydrated } = useBookSettings();

  const visiblePersons = useMemo(
    () => applyPageConfig(sortedPersons, settings.pageConfig),
    [sortedPersons, settings.pageConfig],
  );
  const leaves = useMemo(() => buildLeaves(visiblePersons), [visiblePersons]);
  const totalLeaves = leaves.length;
  const personCount = visiblePersons.length;

  // The flip and print hooks cache the current draft before they run, but the
  // draft hook needs the page index from the flip hook — break the cycle with a
  // ref the draft hook fills in below.
  const cacheRef = useRef<() => void>(() => {});
  const cacheCurrent = useCallback(() => cacheRef.current(), []);

  const flipApi = useBookFlip(totalLeaves, cacheCurrent);
  const currentLeaf = leaves[flipApi.pageIndex];
  const currentPerson = currentLeaf?.kind === 'person' ? currentLeaf.person : null;
  const currentDetail = currentPerson ? (details[currentPerson.id] ?? null) : null;

  const { draft, setDraft, isDirty, saving, cacheCurrentDraft, getPersonDraft, handleSave } = useBookDraft({
    currentPerson,
    currentDetail,
    details,
    updateDetail,
    onPersonUpdated,
  });

  const printApi = useGenealogyPrint(cacheCurrent);

  useEffect(() => {
    cacheRef.current = cacheCurrentDraft;
  }, [cacheCurrentDraft]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  useEffect(() => {
    ensureCalligraphyFontLoaded(settings.coverFontId);
  }, [settings.coverFontId]);

  const ctx = useMemo<BookLeafCtx>(
    () => ({
      leaves,
      settings,
      updateSettings,
      details,
      personCount,
      currentDetail,
      draft,
      isDirty,
      saving,
      getPersonDraft,
      onDraftChange: setDraft,
      onSave: () => void handleSave(),
    }),
    [leaves, settings, updateSettings, details, personCount, currentDetail, draft, isDirty, saving, getPersonDraft, setDraft, handleSave],
  );

  return { hydrated, leaves, totalLeaves, sortedPersons, settings, updateSettings, saving, ctx, ...flipApi, ...printApi };
}
