"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AuthRequiredSheet from "@/components/auth/AuthRequiredSheet";
import ResponsiveAppPageLayout from "@/components/layout/ResponsiveAppPageLayout";
import AuthPageLoading from "@/components/ui/AuthPageLoading";
import LoadingSpinner from "@/components/icons/LoadingSpinner";
import Icon from "@/components/icons/Icon";
import BottomSheet from "@/components/ui/BottomSheet";
import { FormField, inputClassName } from "@/components/ui/CollapsibleSection";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";
import type { ClanDutyYearSummary } from "@/lib/api/modules/clan-duty";
import type { Person } from "@/components/types/family-tree-types";
import type { CeremonyTemplate } from "@/lib/api/modules/ceremonies";
import { getBranchLabel } from "@/lib/constants/branches";
import { UI } from "@/lib/constants/ui-strings";
import { notify } from "@/lib/notify";
import { filterPersonsByName } from "@/utils/person-search";
import {
  CLAN_DUTY_YEAR_MAX,
  CLAN_DUTY_YEAR_MIN,
  clanDutyEntryKey,
  isValidClanDutyYear,
  joinClanDutyRoles,
  sameCeremonyLinkIds,
  toClanDutyDraft,
  type ClanDutyDraftEntry,
} from "@/components/clan-duty/clan-duty-draft";
import ClanDutyYearStrip from "@/components/clan-duty/ClanDutyYearStrip";
import ClanDutyHero from "@/components/clan-duty/ClanDutyHero";
import ClanDutyStatsCard from "@/components/clan-duty/ClanDutyStatsCard";
import ClanDutyPersonAvatar from "@/components/clan-duty/ClanDutyPersonAvatar";
import DutyEntryCard from "@/components/clan-duty/DutyEntryCard";

function personMeta(person: {
  generation?: number | null;
  branch?: number | null;
}): string | null {
  const parts = [
    person.generation != null ? UI.GENERATION_SHORT(person.generation) : null,
    person.branch != null ? getBranchLabel(person.branch) : null,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : null;
}

export default function ClanDutyPageView() {
  const authLoaded = useAuthStore((s) => s.loaded);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const refreshAuth = useAuthStore((s) => s.refresh);
  const { canMutate, requireAdmin } = useFeatureAccess();
  const canEdit = canMutate;

  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const [year, setYear] = useState(currentYear);
  const [yearInput, setYearInput] = useState(String(currentYear));
  const [yearOptions, setYearOptions] = useState<ClanDutyYearSummary[]>([]);
  const [yearNote, setYearNote] = useState("");
  const [savedNote, setSavedNote] = useState("");
  const [entries, setEntries] = useState<ClanDutyDraftEntry[]>([]);
  const [savedEntries, setSavedEntries] = useState<ClanDutyDraftEntry[]>([]);
  const [customRoles, setCustomRoles] = useState<string[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [templates, setTemplates] = useState<CeremonyTemplate[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [addYearOpen, setAddYearOpen] = useState(false);

  useEffect(() => {
    void refreshAuth();
  }, [refreshAuth]);

  const isDirty = useMemo(() => {
    if (yearNote !== savedNote) return true;
    if (entries.length !== savedEntries.length) return true;
    return entries.some((entry, i) => {
      const saved = savedEntries[i];
      return (
        !saved ||
        entry.personId !== saved.personId ||
        joinClanDutyRoles(entry.roles) !== joinClanDutyRoles(saved.roles) ||
        entry.note !== saved.note ||
        !sameCeremonyLinkIds(entry.ceremonyLinks, saved.ceremonyLinks)
      );
    });
  }, [entries, savedEntries, yearNote, savedNote]);

  const roleCatalog = useMemo(() => {
    const set = new Set<string>([
      ...UI.CLAN_DUTY_ROLE_SUGGESTIONS,
      ...customRoles,
    ]);
    for (const entry of entries) {
      for (const role of entry.roles) set.add(role);
    }
    return [...set];
  }, [customRoles, entries]);

  const avatarById = useMemo(() => {
    const map = new Map<number, string | null | undefined>();
    for (const person of persons) map.set(person.id, person.avatar);
    return map;
  }, [persons]);

  const loadYear = useCallback(async (y: number) => {
    setLoading(true);
    try {
      const [duty, years, personList, templateList] = await Promise.all([
        api.clanDuty.getYear(y),
        api.clanDuty.listYears(),
        api.person.list(),
        api.ceremonies.listTemplates(),
      ]);
      const draft = toClanDutyDraft(duty.entries);
      setEntries(draft);
      setSavedEntries(draft);
      setYearNote(duty.note ?? "");
      setSavedNote(duty.note ?? "");
      setYearOptions(years);
      setPersons(personList);
      setTemplates(templateList);
      setYear(y);
      setYearInput(String(y));
    } catch (error) {
      notify.error(error, UI.CLAN_DUTY_ERR_LOAD);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoaded || !isLoggedIn) return;
    void loadYear(year);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoaded, isLoggedIn, loadYear]);

  const excludeIds = useMemo(
    () => entries.map((e) => e.personId),
    [entries],
  );
  const searchResults = useMemo(() => {
    const candidates = persons.filter((p) => !excludeIds.includes(p.id));
    return filterPersonsByName(candidates, query).slice(0, 8);
  }, [persons, excludeIds, query]);

  const openYear = (next: number) => {
    if (!isValidClanDutyYear(next)) {
      notify.error(null, UI.CLAN_DUTY_YEAR_INVALID);
      return;
    }
    if (next === year) {
      setYearInput(String(next));
      return;
    }
    if (isDirty && !window.confirm(UI.CLAN_DUTY_DISCARD)) {
      setYearInput(String(year));
      return;
    }
    setAddYearOpen(false);
    void loadYear(next);
  };

  const addPerson = (person: Person) => {
    if (!requireAdmin()) return;
    setEntries((prev) => [
      ...prev,
      {
        key: clanDutyEntryKey(person.id),
        personId: person.id,
        fullName: person.fullName,
        generation: person.generation ?? null,
        branch: person.branch ?? null,
        roles: [],
        note: "",
        ceremonyLinks: [],
      },
    ]);
    setQuery("");
    setAddMemberOpen(false);
  };

  const updateEntry = (
    personId: number,
    patch: Partial<
      Pick<ClanDutyDraftEntry, "roles" | "note" | "ceremonyLinks">
    >,
  ) => {
    setEntries((prev) =>
      prev.map((e) => (e.personId === personId ? { ...e, ...patch } : e)),
    );
  };

  const removeEntry = (personId: number) => {
    setEntries((prev) => prev.filter((e) => e.personId !== personId));
  };

  const handleSave = async () => {
    if (!requireAdmin()) return;
    if (!isValidClanDutyYear(year)) {
      notify.error(null, UI.CLAN_DUTY_YEAR_INVALID);
      return;
    }
    setSaving(true);
    try {
      const saved = await api.clanDuty.upsertYear(year, {
        note: yearNote,
        entries: entries.map((e, index) => {
          const hasCeremonyRole = e.roles.includes(
            UI.CLAN_DUTY_ROLE_PREPARE_CEREMONY,
          );
          return {
            personId: e.personId,
            role: joinClanDutyRoles(e.roles) || undefined,
            note: e.note.trim() || undefined,
            sortOrder: index,
            ceremonyTemplateIds: hasCeremonyRole
              ? e.ceremonyLinks.map((link) => link.templateId)
              : [],
          };
        }),
      });
      const draft = toClanDutyDraft(saved.entries);
      setEntries(draft);
      setSavedEntries(draft);
      setYearNote(saved.note ?? "");
      setSavedNote(saved.note ?? "");
      setYearOptions(await api.clanDuty.listYears());
      notify.success(UI.CLAN_DUTY_SAVED);
    } catch (error) {
      notify.error(error, UI.CLAN_DUTY_ERR_SAVE);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteYear = async () => {
    if (!requireAdmin()) return;
    if (!window.confirm(UI.CLAN_DUTY_DELETE_YEAR_CONFIRM)) return;
    setSaving(true);
    try {
      await api.clanDuty.removeYear(year);
      setEntries([]);
      setSavedEntries([]);
      setYearNote("");
      setSavedNote("");
      setYearOptions(await api.clanDuty.listYears());
      notify.success(UI.CLAN_DUTY_DELETED);
    } catch (error) {
      notify.error(error, UI.CLAN_DUTY_ERR_DELETE);
    } finally {
      setSaving(false);
    }
  };

  const openAddMember = () => {
    if (!requireAdmin()) return;
    setAddMemberOpen(true);
  };

  const openAddYear = () => {
    if (!requireAdmin()) return;
    setYearInput(String(currentYear));
    setAddYearOpen(true);
  };

  if (!authLoaded) {
    return <AuthPageLoading message={UI.CLAN_DUTY_LOADING} />;
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#fcf9f4] px-4">
        <div className="w-full max-w-md rounded-xl border border-[#d4c3c1] bg-white p-6 text-center shadow-sm">
          <h1 className="font-serif text-2xl font-semibold text-[#321716]">
            {UI.CLAN_DUTY_PAGE_TITLE}
          </h1>
          <p className="mt-3 text-sm text-[#504443]">
            {UI.CLAN_DUTY_LOGIN_REQUIRED}
          </p>
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

  const fab = canEdit ? (
    <button
      type="button"
      disabled={saving}
      onClick={openAddMember}
      className="fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#944a00] text-white shadow-xl transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
      aria-label={UI.CLAN_DUTY_ADD}
    >
      <Icon
        path="userPlus"
        size={28}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        pointer={false}
      />
    </button>
  ) : null;

  return (
    <>
      <ResponsiveAppPageLayout
        title={UI.CLAN_DUTY_PAGE_TITLE}
        backHref="/events"
        fab={fab}
      >
        <div className="mx-auto max-w-3xl space-y-8 pb-8">
          <ClanDutyYearStrip
            year={year}
            yearOptions={yearOptions}
            saving={saving}
            canEdit={canEdit}
            onSelectYear={openYear}
            onAddYear={openAddYear}
          />

          <ClanDutyHero />

          <ClanDutyStatsCard count={entries.length} />

          {canEdit ? (
            <FormField label={UI.CLAN_DUTY_YEAR_NOTE}>
              <textarea
                value={yearNote}
                onChange={(e) => setYearNote(e.target.value)}
                rows={2}
                disabled={saving}
                placeholder={UI.CLAN_DUTY_YEAR_NOTE_PLACEHOLDER}
                className={inputClassName}
              />
            </FormField>
          ) : yearNote ? (
            <p className="rounded-xl bg-[#f6f3ee] px-4 py-3 text-sm text-[#504443]">
              {yearNote}
            </p>
          ) : null}

          <section className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#504443]">
              {UI.CLAN_DUTY_MEMBERS}
            </h2>

            {loading ? (
              <div className="flex h-32 items-center justify-center">
                <LoadingSpinner size={28} label={UI.CLAN_DUTY_LOADING} />
              </div>
            ) : entries.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-[#d4c3c1] bg-white/60 px-4 py-8 text-center text-sm text-[#827472]">
                {UI.CLAN_DUTY_EMPTY}
              </p>
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <DutyEntryCard
                    key={entry.key}
                    entry={entry}
                    avatar={avatarById.get(entry.personId)}
                    canEdit={canEdit}
                    saving={saving}
                    templates={templates}
                    roleCatalog={roleCatalog}
                    onChange={updateEntry}
                    onRemove={removeEntry}
                    onAddCustomRole={(role) => {
                      setCustomRoles((prev) =>
                        prev.includes(role) ? prev : [...prev, role],
                      );
                    }}
                  />
                ))}
              </div>
            )}

            {!canEdit ? (
              <p className="text-xs text-[#827472]">{UI.CLAN_DUTY_NO_EDIT}</p>
            ) : null}
          </section>

          {canEdit ? (
            <div className="flex flex-wrap gap-2 pb-16 md:pb-0">
              <button
                type="button"
                disabled={saving || !isDirty}
                onClick={() => void handleSave()}
                className="rounded-xl bg-[#944a00] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {saving ? UI.CLAN_DUTY_SAVING : UI.CLAN_DUTY_SAVE}
              </button>
              {savedEntries.length > 0 || savedNote ? (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void handleDeleteYear()}
                  className="rounded-xl border border-[#d4c3c1] px-5 py-2.5 text-sm font-semibold text-[#504443] disabled:opacity-50"
                >
                  {UI.CLAN_DUTY_DELETE_YEAR}
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </ResponsiveAppPageLayout>

      {addYearOpen ? (
        <BottomSheet onClose={() => setAddYearOpen(false)} maxWidth="md">
          <div className="space-y-4 p-4">
            <h3 className="font-serif text-lg font-semibold text-[#321716]">
              {UI.CLAN_DUTY_YEAR_ADD}
            </h3>
            <FormField label={UI.CLAN_DUTY_YEAR_LABEL}>
              <input
                type="number"
                inputMode="numeric"
                min={CLAN_DUTY_YEAR_MIN}
                max={CLAN_DUTY_YEAR_MAX}
                value={yearInput}
                onChange={(e) => setYearInput(e.target.value)}
                placeholder={UI.CLAN_DUTY_YEAR_PLACEHOLDER}
                className={inputClassName}
              />
            </FormField>
            <button
              type="button"
              disabled={saving}
              onClick={() => openYear(Number(yearInput))}
              className="w-full rounded-xl bg-[#321716] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {UI.CLAN_DUTY_YEAR_OPEN}
            </button>
          </div>
        </BottomSheet>
      ) : null}

      {addMemberOpen ? (
        <BottomSheet
          onClose={() => {
            setAddMemberOpen(false);
            setQuery("");
          }}
          maxWidth="md"
          variant="search"
        >
          <div className="flex h-full flex-col p-4">
            <h3 className="mb-3 font-serif text-lg font-semibold text-[#321716]">
              {UI.CLAN_DUTY_ADD}
            </h3>
            <div className="relative">
              <Icon
                path="search"
                size={18}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                pointer={false}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={UI.CLAN_DUTY_SEARCH}
                disabled={saving}
                className={`${inputClassName} pl-10`}
                autoFocus
              />
            </div>
            <ul className="mt-3 min-h-0 flex-1 divide-y divide-[#e5e2dd] overflow-y-auto">
              {searchResults.map((person) => (
                <li key={person.id}>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => addPerson(person)}
                    className="flex w-full items-center gap-3 px-1 py-3 text-left active:bg-[#fff8f0]"
                  >
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#d4c3c1]/40">
                      <ClanDutyPersonAvatar
                        name={person.fullName}
                        avatar={person.avatar}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#321716]">
                        {person.fullName}
                      </p>
                      {personMeta(person) ? (
                        <p className="truncate text-xs text-[#827472]">
                          {personMeta(person)}
                        </p>
                      ) : null}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </BottomSheet>
      ) : null}

      <AuthRequiredSheet />
    </>
  );
}
