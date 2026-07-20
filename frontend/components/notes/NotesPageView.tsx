"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AuthRequiredSheet from "@/components/auth/AuthRequiredSheet";
import ResponsiveAppPageLayout from "@/components/layout/ResponsiveAppPageLayout";
import AuthPageLoading from "@/components/ui/AuthPageLoading";
import LoadingSpinner from "@/components/icons/LoadingSpinner";
import NotesMonthCalendar from "@/components/notes/NotesMonthCalendar";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";
import type { DayNote } from "@/lib/api/modules/day-notes";
import { UI } from "@/lib/constants/ui-strings";
import { notify } from "@/lib/notify";
import {
  dateKey,
  formatSelectedDayLabel,
  monthGridRange,
} from "@/utils/events-calendar";

function notesByDateMap(notes: DayNote[]): Map<string, DayNote> {
  const map = new Map<string, DayNote>();
  for (const note of notes) map.set(note.noteDate, note);
  return map;
}

export default function NotesPageView() {
  const authLoaded = useAuthStore((s) => s.loaded);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const isDemo = useAuthStore((s) => s.isDemo);
  const refreshAuth = useAuthStore((s) => s.refresh);

  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState<Date>(() => today);
  const [viewMonth, setViewMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [notes, setNotes] = useState<DayNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [savedBody, setSavedBody] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void refreshAuth();
  }, [refreshAuth]);

  const loadMonth = useCallback(async (month: Date) => {
    const { start, end } = monthGridRange(
      month.getFullYear(),
      month.getMonth(),
    );
    setLoading(true);
    try {
      const list = await api.dayNotes.list({
        from: dateKey(start),
        to: dateKey(end),
      });
      setNotes(list);
    } catch (error) {
      notify.error(error, UI.NOTES_ERR_LOAD);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoaded || !isLoggedIn) return;
    void loadMonth(viewMonth);
  }, [authLoaded, isLoggedIn, viewMonth, loadMonth]);

  const byDate = useMemo(() => notesByDateMap(notes), [notes]);
  const noteDates = useMemo(() => new Set(byDate.keys()), [byDate]);
  const selectedKey = dateKey(selectedDate);
  const selectedNote = byDate.get(selectedKey) ?? null;
  const isDirty = draft !== savedBody;
  const canWrite = isLoggedIn && !isDemo;

  useEffect(() => {
    const body = selectedNote?.body ?? "";
    setDraft(body);
    setSavedBody(body);
  }, [selectedKey, selectedNote?.id, selectedNote?.body]);

  const handleSelectDate = (date: Date) => {
    if (isDirty && !window.confirm(UI.NOTES_DISCARD_CONFIRM)) return;
    setSelectedDate(date);
  };

  const handleSave = async () => {
    if (!canWrite) {
      notify.error(null, UI.NOTES_DEMO_READONLY);
      return;
    }
    const trimmed = draft.trim();
    if (!trimmed) {
      notify.error(null, UI.NOTES_ERR_SAVE);
      return;
    }
    setSaving(true);
    try {
      const saved = await api.dayNotes.upsert(selectedKey, trimmed);
      setNotes((prev) => {
        const next = prev.filter((n) => n.noteDate !== selectedKey);
        next.push(saved);
        return next;
      });
      setDraft(saved.body);
      setSavedBody(saved.body);
      notify.success(UI.NOTES_SAVED);
    } catch (error) {
      notify.error(error, UI.NOTES_ERR_SAVE);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!canWrite || !selectedNote) return;
    if (!window.confirm(UI.NOTES_DELETE_CONFIRM)) return;
    setSaving(true);
    try {
      await api.dayNotes.remove(selectedKey);
      setNotes((prev) => prev.filter((n) => n.noteDate !== selectedKey));
      setDraft("");
      setSavedBody("");
      notify.success(UI.NOTES_DELETED);
    } catch (error) {
      notify.error(error, UI.NOTES_ERR_DELETE);
    } finally {
      setSaving(false);
    }
  };

  if (!authLoaded) {
    return <AuthPageLoading message={UI.NOTES_LOADING} />;
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#fcf9f4] px-4">
        <div className="w-full max-w-md rounded-xl border border-[#d4c3c1] bg-white p-6 text-center shadow-sm">
          <h1 className="font-serif text-2xl font-semibold text-[#321716]">
            {UI.NOTES_PAGE_TITLE}
          </h1>
          <p className="mt-3 text-sm text-[#504443]">{UI.NOTES_LOGIN_REQUIRED}</p>
          <Link
            href="/login"
            className="mt-5 inline-flex rounded-xl bg-[#944a00] px-6 py-3 text-sm font-semibold text-white"
          >
            {UI.LOGIN_BUTTON}
          </Link>
        </div>
        <AuthRequiredSheet />
      </div>
    );
  }

  return (
    <>
      <ResponsiveAppPageLayout title={UI.NOTES_PAGE_TITLE} backHref="/">
        <div className="mx-auto max-w-[1280px] pb-6">
          <p className="mb-4 text-sm text-[#504443]">{UI.NOTES_PAGE_SUBTITLE}</p>
          {isDemo ? (
            <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              {UI.NOTES_DEMO_READONLY}
            </p>
          ) : null}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">
              {loading ? (
                <div className="flex h-48 items-center justify-center rounded-xl border border-[#d4c3c1] bg-white">
                  <LoadingSpinner size={32} label={UI.NOTES_LOADING} />
                </div>
              ) : (
                <NotesMonthCalendar
                  noteDates={noteDates}
                  selectedDate={selectedDate}
                  onSelectDate={handleSelectDate}
                  viewMonth={viewMonth}
                  onViewMonthChange={setViewMonth}
                />
              )}
            </div>

            <div className="lg:col-span-4">
              <section className="rounded-xl border border-[#d4c3c1] bg-white p-4 shadow-sm md:p-5">
                <h3 className="font-serif text-lg font-semibold text-[#321716]">
                  {formatSelectedDayLabel(selectedDate)}
                </h3>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  disabled={!canWrite || saving}
                  rows={10}
                  placeholder={UI.NOTES_PLACEHOLDER}
                  className="mt-3 w-full resize-y rounded-xl border border-[#d4c3c1] bg-[#fcf9f4] px-3 py-2.5 text-sm text-[#1c1c19] outline-none focus:border-[#944a00] disabled:opacity-60"
                />
                {!draft.trim() && !selectedNote ? (
                  <p className="mt-2 text-xs text-[#827472]">{UI.NOTES_EMPTY_DAY}</p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={!canWrite || saving || !isDirty || !draft.trim()}
                    onClick={() => void handleSave()}
                    className="rounded-xl bg-[#944a00] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {saving ? UI.NOTES_SAVING : UI.NOTES_SAVE}
                  </button>
                  {selectedNote ? (
                    <button
                      type="button"
                      disabled={!canWrite || saving}
                      onClick={() => void handleDelete()}
                      className="rounded-xl border border-[#d4c3c1] px-4 py-2.5 text-sm font-semibold text-[#504443] disabled:opacity-50"
                    >
                      {saving ? UI.NOTES_DELETING : UI.NOTES_DELETE}
                    </button>
                  ) : null}
                </div>
              </section>
            </div>
          </div>
        </div>
      </ResponsiveAppPageLayout>
      <AuthRequiredSheet />
    </>
  );
}
