'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { notify } from '@/lib/notify';
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
      notify.success(UI.TOAST_EVENT_CREATED);
      return created;
    } catch (err) {
      notify.error(err, UI.ERR_SAVE);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const updateEvent = useCallback(async (id: number, input: UpdateEventInput) => {
    setSaving(true);
    try {
      const updated = await api.event.update(id, input);
      setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
      notify.success(UI.TOAST_EVENT_UPDATED);
      return updated;
    } catch (err) {
      notify.error(err, UI.ERR_SAVE);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const deleteEvent = useCallback(async (id: number) => {
    try {
      await api.event.remove(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      notify.success(UI.TOAST_EVENT_DELETED);
    } catch (err) {
      notify.error(err, UI.ERR_DELETE);
      throw err;
    }
  }, []);

  /** Merge fresh derived stats into one list event after a detail mutation. */
  const patchEvent = useCallback((id: number, patch: Partial<FamilyEvent>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }, []);

  return { events, loading, error, saving, reload, createEvent, updateEvent, deleteEvent, patchEvent };
}
