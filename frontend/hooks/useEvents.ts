'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { UI } from '@/lib/constants/ui-strings';
import type { CreateEventInput, FamilyEvent, UpdateEventInput } from '@/components/types/event-types';

/** Loads the event list and exposes create / update / delete mutations. */
export function useEvents() {
  const [events, setEvents] = useState<FamilyEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setEvents(await api.event.list());
    } catch {
      setError(UI.EVENTS_LOAD_ERROR);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void reload();
  }, [reload]);

  const createEvent = useCallback(async (input: CreateEventInput) => {
    setSaving(true);
    try {
      const created = await api.event.create(input);
      setEvents((prev) => [created, ...prev]);
      return created;
    } finally {
      setSaving(false);
    }
  }, []);

  const updateEvent = useCallback(async (id: number, input: UpdateEventInput) => {
    setSaving(true);
    try {
      const updated = await api.event.update(id, input);
      setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
      return updated;
    } finally {
      setSaving(false);
    }
  }, []);

  const deleteEvent = useCallback(async (id: number) => {
    await api.event.remove(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  /** Replace one event's derived stats after a contribution toggle. */
  const patchStats = useCallback((id: number, paidCount: number, totalCollected: number) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, paidCount, totalCollected } : e)));
  }, []);

  return { events, loading, error, saving, reload, createEvent, updateEvent, deleteEvent, patchStats };
}
