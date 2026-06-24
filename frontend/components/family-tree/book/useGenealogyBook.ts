"use client";

import { useCallback, useEffect, useMemo } from "react";
import type { Person } from "@/components/types/family-tree-types";
import { sortPersonsForBook } from "@/utils/sort-persons-for-book";
import { usePersonDetailStore } from "@/store/personDetailStore";
import { type BookLeafCtx } from "./BookLeaf";
import { buildBookPageDraft } from "./GenealogyBookPage";
import { buildLeaves, leafIndexForPerson } from "./book-leaves";
import { applyPageConfig } from "./book-page-config";
import { useBookSettings } from "./useBookSettings";
import { useBookFlip } from "./useBookFlip";
import { useGenealogyPrint } from "./useGenealogyPrint";
import { loadCalligraphyFont } from "./calligraphy-font-loader";

function deferPersonDetailsLoad(loadAll: () => Promise<void>): void {
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(() => void loadAll(), { timeout: 4000 });
    return;
  }
  window.setTimeout(() => void loadAll(), 3000);
}

/**
 * Composes the book's data + interaction hooks (settings, page flipping,
 * printing) and exposes everything {@link GenealogyBookViewer} renders.
 */
export function useGenealogyBook(persons: Person[]) {
  const sortedPersons = useMemo(() => sortPersonsForBook(persons), [persons]);

  const details = usePersonDetailStore((s) => s.details);
  const loadAll = usePersonDetailStore((s) => s.loadAll);
  const {
    settings,
    updateSettings,
    hydrated,
    showCoverSavePrompt,
    isCoverDirty,
    isSavingCover,
    saveCoverSettings,
  } = useBookSettings();

  const visiblePersons = useMemo(
    () => applyPageConfig(sortedPersons, settings.pageConfig),
    [sortedPersons, settings.pageConfig],
  );
  const leaves = useMemo(() => buildLeaves(visiblePersons), [visiblePersons]);
  const totalLeaves = leaves.length;
  const personCount = visiblePersons.length;

  const flipApi = useBookFlip(totalLeaves, () => {});
  const printApi = useGenealogyPrint(
    () => {},
    totalLeaves,
    settings.coverFontId,
  );

  const getPersonDraft = useCallback(
    (person: Person) => buildBookPageDraft(details[person.id] ?? null),
    [details],
  );

  const jumpToPerson = useCallback(
    (personId: number) => {
      const index = leafIndexForPerson(leaves, personId);
      if (index >= 0) flipApi.jumpToIndex(index);
    },
    [leaves, flipApi],
  );

  useEffect(() => {
    deferPersonDetailsLoad(loadAll);
  }, [loadAll]);

  useEffect(() => {
    void loadCalligraphyFont(settings.coverFontId);
  }, [settings.coverFontId]);

  const ctx = useMemo<BookLeafCtx>(
    () => ({
      leaves,
      settings,
      updateSettings,
      details,
      personCount,
      getPersonDraft,
      showCoverSavePrompt,
      isCoverDirty,
      isSavingCover,
      saveCoverSettings,
    }),
    [
      leaves,
      settings,
      updateSettings,
      details,
      personCount,
      getPersonDraft,
      showCoverSavePrompt,
      isCoverDirty,
      isSavingCover,
      saveCoverSettings,
    ],
  );

  return {
    hydrated,
    leaves,
    totalLeaves,
    visiblePersons,
    sortedPersons,
    settings,
    updateSettings,
    saveCoverSettings,
    ctx,
    jumpToPerson,
    ...flipApi,
    ...printApi,
  };
}
