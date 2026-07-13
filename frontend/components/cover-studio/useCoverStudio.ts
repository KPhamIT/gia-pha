"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchOrgBookContext } from "@/lib/org/org-book-context";
import type { OrgBookContext } from "@/lib/settings/default-user-settings";
import {
  cloneDesign,
  createEmptyDesign,
  designsEqual,
  type CoverDesign,
  type CoverSide,
} from "./cover-studio-settings";
import {
  buildDuplicate,
  confirmDelete,
  confirmDiscard,
  loadStudioState,
  persistDesigns,
} from "./cover-studio-actions";

export function useCoverStudio() {
  const [org, setOrg] = useState<OrgBookContext | null>(null);
  const [designs, setDesigns] = useState<CoverDesign[]>([]);
  const [draft, setDraft] = useState<CoverDesign | null>(null);
  const [savedSnap, setSavedSnap] = useState<CoverDesign | null>(null);
  const [side, setSide] = useState<CoverSide>("front");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetchOrgBookContext().then((ctx) => {
      if (cancelled) return;
      const loaded = loadStudioState(ctx);
      setOrg(ctx);
      setDesigns(loaded.designs);
      setDraft(loaded.draft);
      setSavedSnap(loaded.saved);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const isDirty = Boolean(draft && savedSnap && !designsEqual(draft, savedSnap));

  const persistAll = useCallback(
    (nextDesigns: CoverDesign[], nextActive: string | null) => {
      setDesigns(nextDesigns);
      persistDesigns(nextDesigns, nextActive);
    },
    [],
  );

  const openClone = useCallback((design: CoverDesign) => {
    setDraft(cloneDesign(design));
    setSavedSnap(cloneDesign(design));
    setSide("front");
  }, []);

  const createDesign = useCallback(() => {
    const design = createEmptyDesign(org);
    persistAll([design, ...designs], design.id);
    openClone(design);
  }, [designs, openClone, org, persistAll]);

  const openDesign = useCallback(
    (id: string) => {
      const design = designs.find((d) => d.id === id);
      if (!design) return;
      persistDesigns(designs, id);
      openClone(design);
    },
    [designs, openClone],
  );

  const closeEditor = useCallback(() => {
    if (isDirty && !confirmDiscard()) return false;
    persistDesigns(designs, null);
    setDraft(null);
    setSavedSnap(null);
    return true;
  }, [designs, isDirty]);

  const patchDraft = useCallback((patch: Partial<CoverDesign>) => {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const patchFront = useCallback((patch: Partial<CoverDesign["front"]>) => {
    setDraft((prev) =>
      prev ? { ...prev, front: { ...prev.front, ...patch } } : prev,
    );
  }, []);

  const patchBack = useCallback((patch: Partial<CoverDesign["back"]>) => {
    setDraft((prev) =>
      prev ? { ...prev, back: { ...prev.back, ...patch } } : prev,
    );
  }, []);

  const saveDraft = useCallback(() => {
    if (!draft) return;
    const nextDesign = { ...draft, updatedAt: new Date().toISOString() };
    persistAll(
      designs.map((d) => (d.id === nextDesign.id ? nextDesign : d)),
      nextDesign.id,
    );
    setDraft(nextDesign);
    setSavedSnap(cloneDesign(nextDesign));
  }, [designs, draft, persistAll]);

  const duplicateDesign = useCallback(
    (id: string) => {
      const source = designs.find((d) => d.id === id);
      if (!source) return;
      const design = buildDuplicate(source, org);
      persistAll([design, ...designs], design.id);
      openClone(design);
    },
    [designs, openClone, org, persistAll],
  );

  const deleteDesign = useCallback(
    (id: string) => {
      const target = designs.find((d) => d.id === id);
      if (!target || !confirmDelete(target.name)) return;
      const clearing = draft?.id === id;
      persistAll(
        designs.filter((d) => d.id !== id),
        clearing ? null : draft?.id ?? null,
      );
      if (clearing) {
        setDraft(null);
        setSavedSnap(null);
      }
    },
    [designs, draft, persistAll],
  );

  return {
    ready,
    org,
    designs,
    draft,
    side,
    setSide,
    isDirty,
    createDesign,
    openDesign,
    closeEditor,
    patchDraft,
    patchFront,
    patchBack,
    saveDraft,
    duplicateDesign,
    deleteDesign,
  };
}
