"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AuthRequiredSheet from "@/components/auth/AuthRequiredSheet";
import ResponsiveAppPageLayout from "@/components/layout/ResponsiveAppPageLayout";
import AuthPageLoading from "@/components/ui/AuthPageLoading";
import LoadingSpinner from "@/components/icons/LoadingSpinner";
import Icon from "@/components/icons/Icon";
import { FormField, inputClassName } from "@/components/ui/CollapsibleSection";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";
import type {
  ClanDutyEntry,
  ClanDutyYear,
  ClanDutyYearSummary,
} from "@/lib/api/modules/clan-duty";
import type { Person } from "@/components/types/family-tree-types";
import type { CeremonyTemplate } from "@/lib/api/modules/ceremonies";
import { getBranchLabel } from "@/lib/constants/branches";
import { UI } from "@/lib/constants/ui-strings";
import { notify } from "@/lib/notify";
import { filterPersonsByName } from "@/utils/person-search";
import DutyEntryCeremonyLinks from "@/components/clan-duty/DutyEntryCeremonyLinks";

const ROLE_SEP = " · ";
const YEAR_MIN = 1900;
const YEAR_MAX = 2200;

type DraftEntry = {
  key: string;
  personId: number;
  fullName: string;
  generation: number | null;
  branch: number | null;
  roles: string[];
  note: string;
  ceremonyLinks: { templateId: number; name: string }[];
};

function entryKey(personId: number) {
  return `p-${personId}`;
}

function parseRoles(role: string | null | undefined): string[] {
  if (!role?.trim()) return [];
  return role
    .split(ROLE_SEP)
    .map((part) => part.trim())
    .filter(Boolean);
}

function joinRoles(roles: string[]): string {
  return roles.map((r) => r.trim()).filter(Boolean).join(ROLE_SEP);
}

function sameLinkIds(
  a: { templateId: number }[],
  b: { templateId: number }[],
): boolean {
  if (a.length !== b.length) return false;
  return a.every((item, i) => item.templateId === b[i]?.templateId);
}

function toDraft(entries: ClanDutyEntry[]): DraftEntry[] {
  return entries.map((e) => ({
    key: entryKey(e.personId),
    personId: e.personId,
    fullName: e.fullName,
    generation: e.generation,
    branch: e.branch,
    roles: parseRoles(e.role),
    note: e.note ?? "",
    ceremonyLinks: (e.ceremonyLinks ?? []).map((link) => ({
      templateId: link.templateId,
      name: link.name,
    })),
  }));
}

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

function isValidYear(value: number): boolean {
  return Number.isInteger(value) && value >= YEAR_MIN && value <= YEAR_MAX;
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
  const [entries, setEntries] = useState<DraftEntry[]>([]);
  const [savedEntries, setSavedEntries] = useState<DraftEntry[]>([]);
  const [customRoles, setCustomRoles] = useState<string[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [templates, setTemplates] = useState<CeremonyTemplate[]>([]);
  const [yearsDetail, setYearsDetail] = useState<ClanDutyYear[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        joinRoles(entry.roles) !== joinRoles(saved.roles) ||
        entry.note !== saved.note ||
        !sameLinkIds(entry.ceremonyLinks, saved.ceremonyLinks)
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

  const loadYear = useCallback(async (y: number) => {
    setLoading(true);
    try {
      const [duty, years, personList, templateList] = await Promise.all([
        api.clanDuty.getYear(y),
        api.clanDuty.listYears(),
        api.person.list(),
        api.ceremonies.listTemplates(),
      ]);
      const draft = toDraft(duty.entries);
      setEntries(draft);
      setSavedEntries(draft);
      setYearNote(duty.note ?? "");
      setSavedNote(duty.note ?? "");
      setYearOptions(years);
      setPersons(personList);
      setTemplates(templateList);
      setYear(y);
      setYearInput(String(y));

      const otherYears = years
        .map((item) => item.year)
        .filter((itemYear) => itemYear !== y)
        .sort((a, b) => b - a);
      const others = await Promise.all(
        otherYears.map((itemYear) => api.clanDuty.getYear(itemYear)),
      );
      const merged = [duty, ...others].sort((a, b) => b.year - a.year);
      setYearsDetail(merged);
    } catch (error) {
      notify.error(error, UI.CLAN_DUTY_ERR_LOAD);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoaded || !isLoggedIn) return;
    void loadYear(year);
    // Chỉ bootstrap lần đầu / khi auth sẵn sàng — đổi năm qua openYear.
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
    if (!isValidYear(next)) {
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
    void loadYear(next);
  };

  const addPerson = (person: Person) => {
    if (!requireAdmin()) return;
    setEntries((prev) => [
      ...prev,
      {
        key: entryKey(person.id),
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
  };

  const updateEntry = (
    personId: number,
    patch: Partial<Pick<DraftEntry, "roles" | "note" | "ceremonyLinks">>,
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
    if (!isValidYear(year)) {
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
            role: joinRoles(e.roles) || undefined,
            note: e.note.trim() || undefined,
            sortOrder: index,
            ceremonyTemplateIds: hasCeremonyRole
              ? e.ceremonyLinks.map((link) => link.templateId)
              : [],
          };
        }),
      });
      const draft = toDraft(saved.entries);
      setEntries(draft);
      setSavedEntries(draft);
      setYearNote(saved.note ?? "");
      setSavedNote(saved.note ?? "");
      setYearOptions(await api.clanDuty.listYears());
      setYearsDetail((prev) => {
        const rest = prev.filter((item) => item.year !== year);
        return [saved, ...rest].sort((a, b) => b.year - a.year);
      });
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
      setYearsDetail((prev) => prev.filter((item) => item.year !== year));
      notify.success(UI.CLAN_DUTY_DELETED);
    } catch (error) {
      notify.error(error, UI.CLAN_DUTY_ERR_DELETE);
    } finally {
      setSaving(false);
    }
  };

  const yearsDescending = useMemo(() => {
    const years = new Set(yearsDetail.map((item) => item.year));
    years.add(year);
    return [...years].sort((a, b) => b - a);
  }, [yearsDetail, year]);

  const detailByYear = useMemo(() => {
    const map = new Map(yearsDetail.map((item) => [item.year, item]));
    return map;
  }, [yearsDetail]);

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

  return (
    <>
      <ResponsiveAppPageLayout title={UI.CLAN_DUTY_PAGE_TITLE} backHref="/events">
        <div className="mx-auto max-w-3xl space-y-6 pb-6">
          <p className="text-sm text-[#504443]">{UI.CLAN_DUTY_PAGE_SUBTITLE}</p>

          <div className="rounded-xl border border-[#d4c3c1] bg-white p-4 shadow-sm md:p-5">
            <FormField label={UI.CLAN_DUTY_YEAR_LABEL}>
              <div className="flex gap-2">
                <input
                  type="number"
                  inputMode="numeric"
                  min={YEAR_MIN}
                  max={YEAR_MAX}
                  value={yearInput}
                  onChange={(e) => setYearInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      openYear(Number(yearInput));
                    }
                  }}
                  placeholder={UI.CLAN_DUTY_YEAR_PLACEHOLDER}
                  disabled={saving}
                  className={inputClassName}
                />
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => openYear(Number(yearInput))}
                  className="shrink-0 rounded-xl bg-[#321716] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {UI.CLAN_DUTY_YEAR_OPEN}
                </button>
              </div>
            </FormField>
            {yearOptions.length > 0 ? (
              <div className="mt-3">
                <p className="mb-2 text-xs font-medium text-[#827472]">
                  {UI.CLAN_DUTY_YEAR_SAVED_HINT}
                </p>
                <div className="flex flex-col gap-2">
                  {[...yearOptions]
                    .sort((a, b) => b.year - a.year)
                    .map((item) => {
                      const active = item.year === year;
                      return (
                        <button
                          key={item.year}
                          type="button"
                          disabled={saving}
                          onClick={() => openYear(item.year)}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${
                            active
                              ? "bg-[#944a00] text-white"
                              : "bg-[#ffdcc5]/60 text-[#663100] hover:bg-[#ffdcc5]"
                          }`}
                        >
                          <span>{UI.CLAN_DUTY_YEAR_TAG(item.year)}</span>
                          <span className="text-xs opacity-80">
                            {item.entryCount}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>
            ) : null}
            <FormField label={UI.CLAN_DUTY_YEAR_NOTE}>
              <textarea
                value={yearNote}
                onChange={(e) => setYearNote(e.target.value)}
                rows={2}
                disabled={!canEdit || saving}
                placeholder={UI.CLAN_DUTY_YEAR_NOTE_PLACEHOLDER}
                className={inputClassName}
              />
            </FormField>
          </div>

          <div className="rounded-xl border border-[#d4c3c1] bg-white p-4 shadow-sm md:p-5">
            <h2 className="font-serif text-lg font-semibold text-[#321716]">
              {UI.CLAN_DUTY_MEMBERS}
            </h2>

            {loading ? (
              <div className="flex h-32 items-center justify-center">
                <LoadingSpinner size={28} label={UI.CLAN_DUTY_LOADING} />
              </div>
            ) : (
              <div className="mt-4 space-y-6">
                {yearsDescending.map((itemYear) => {
                  const active = itemYear === year;
                  const detail = detailByYear.get(itemYear);
                  const yearEntries = active
                    ? entries
                    : toDraft(detail?.entries ?? []);

                  return (
                    <section
                      key={itemYear}
                      className={`rounded-xl border p-3 ${
                        active
                          ? "border-[#944a00]/40 bg-[#fff8f0]"
                          : "border-[#d4c3c1]/70 bg-[#faf7f2]"
                      }`}
                    >
                      <button
                        type="button"
                        disabled={saving || active}
                        onClick={() => openYear(itemYear)}
                        className="mb-3 flex w-full items-center justify-between text-left"
                      >
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            active
                              ? "bg-[#944a00] text-white"
                              : "bg-[#ffdcc5] text-[#663100]"
                          }`}
                        >
                          {UI.CLAN_DUTY_YEAR_TAG(itemYear)}
                        </span>
                        {!active ? (
                          <span className="text-xs text-[#827472]">
                            {yearEntries.length}
                          </span>
                        ) : null}
                      </button>

                      {yearEntries.length === 0 ? (
                        <p className="text-sm text-[#827472]">
                          {active
                            ? UI.CLAN_DUTY_EMPTY
                            : UI.CLAN_DUTY_YEAR_EMPTY_SHORT}
                        </p>
                      ) : active ? (
                        <div className="space-y-3">
                          {yearEntries.map((entry) => (
                            <DutyEntryCard
                              key={entry.key}
                              entry={entry}
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
                      ) : (
                        <ul className="space-y-2">
                          {yearEntries.map((entry) => (
                            <li
                              key={entry.key}
                              className="rounded-lg border border-[#d4c3c1]/50 bg-white px-3 py-2"
                            >
                              <p className="text-sm font-semibold text-[#321716]">
                                {entry.fullName}
                              </p>
                              {personMeta(entry) ? (
                                <p className="text-xs text-[#827472]">
                                  {personMeta(entry)}
                                </p>
                              ) : null}
                              {entry.roles.length > 0 ? (
                                <div className="mt-1.5 flex flex-wrap gap-1.5">
                                  {entry.roles.map((role) => (
                                    <span
                                      key={role}
                                      className="rounded-full bg-[#ffdcc5]/70 px-2 py-0.5 text-[11px] font-semibold text-[#663100]"
                                    >
                                      {role}
                                    </span>
                                  ))}
                                </div>
                              ) : null}
                              {entry.roles.includes(
                                UI.CLAN_DUTY_ROLE_PREPARE_CEREMONY,
                              ) && entry.ceremonyLinks.length > 0 ? (
                                <DutyEntryCeremonyLinks
                                  links={entry.ceremonyLinks}
                                  templates={templates}
                                  canEdit={false}
                                  saving={false}
                                  onChange={() => undefined}
                                />
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      )}

                      {active && canEdit ? (
                        <div className="mt-4 border-t border-[#d4c3c1]/60 pt-4">
                          <p className="mb-2 text-sm font-medium text-[#321716]">
                            {UI.CLAN_DUTY_ADD}
                          </p>
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
                            />
                          </div>
                          {query.trim() && searchResults.length > 0 ? (
                            <ul className="mt-2 max-h-48 divide-y divide-slate-100 overflow-y-auto rounded-xl border border-slate-200">
                              {searchResults.map((person) => (
                                <li key={person.id}>
                                  <button
                                    type="button"
                                    disabled={saving}
                                    onClick={() => addPerson(person)}
                                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left active:bg-amber-50"
                                  >
                                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-600 text-sm font-semibold text-white">
                                      {person.fullName.charAt(0)}
                                    </span>
                                    <div className="min-w-0">
                                      <p className="truncate text-sm font-medium text-slate-900">
                                        {person.fullName}
                                      </p>
                                      {personMeta(person) ? (
                                        <p className="truncate text-xs text-slate-500">
                                          {personMeta(person)}
                                        </p>
                                      ) : null}
                                    </div>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ) : null}
                    </section>
                  );
                })}
              </div>
            )}

            {!canEdit ? (
              <p className="mt-4 text-xs text-[#827472]">{UI.CLAN_DUTY_NO_EDIT}</p>
            ) : null}
          </div>

          {canEdit ? (
            <div className="flex flex-wrap gap-2">
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
      <AuthRequiredSheet />
    </>
  );
}

function DutyEntryCard({
  entry,
  canEdit,
  saving,
  templates,
  roleCatalog,
  onChange,
  onRemove,
  onAddCustomRole,
}: {
  entry: DraftEntry;
  canEdit: boolean;
  saving: boolean;
  templates: CeremonyTemplate[];
  roleCatalog: string[];
  onChange: (
    personId: number,
    patch: Partial<Pick<DraftEntry, "roles" | "note" | "ceremonyLinks">>,
  ) => void;
  onRemove: (personId: number) => void;
  onAddCustomRole: (role: string) => void;
}) {
  const [roleDraft, setRoleDraft] = useState("");
  const meta = personMeta(entry);
  const hasCeremonyRole = entry.roles.includes(
    UI.CLAN_DUTY_ROLE_PREPARE_CEREMONY,
  );

  const toggleRole = (role: string) => {
    const selected = entry.roles.includes(role);
    const nextRoles = selected
      ? entry.roles.filter((r) => r !== role)
      : [...entry.roles, role];
    const keepCeremony = nextRoles.includes(UI.CLAN_DUTY_ROLE_PREPARE_CEREMONY);
    onChange(entry.personId, {
      roles: nextRoles,
      ceremonyLinks: keepCeremony ? entry.ceremonyLinks : [],
    });
  };

  const addCustomRole = () => {
    const role = roleDraft.trim();
    if (!role) return;
    onAddCustomRole(role);
    if (!entry.roles.includes(role)) {
      onChange(entry.personId, { roles: [...entry.roles, role] });
    }
    setRoleDraft("");
  };

  return (
    <div className="rounded-xl border border-[#d4c3c1]/80 bg-[#faf7f2] p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#321716]">
            {entry.fullName}
          </p>
          {meta ? <p className="text-xs text-[#827472]">{meta}</p> : null}
        </div>
        {canEdit ? (
          <button
            type="button"
            disabled={saving}
            onClick={() => onRemove(entry.personId)}
            className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 active:bg-white"
          >
            {UI.CLAN_DUTY_REMOVE}
          </button>
        ) : null}
      </div>

      <p className="mt-3 text-xs font-medium text-[#504443]">{UI.CLAN_DUTY_ROLE}</p>
      {canEdit ? (
        <>
          <div className="mt-2 flex flex-wrap gap-2">
            {roleCatalog.map((role) => {
              const active = entry.roles.includes(role);
              return (
                <button
                  key={role}
                  type="button"
                  disabled={saving}
                  onClick={() => toggleRole(role)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    active
                      ? "bg-[#944a00] text-white"
                      : "border border-[#d4c3c1] bg-white text-[#504443] hover:border-[#944a00]/50"
                  }`}
                >
                  {role}
                </button>
              );
            })}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={roleDraft}
              onChange={(e) => setRoleDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomRole();
                }
              }}
              disabled={saving}
              placeholder={UI.CLAN_DUTY_ROLE_PLACEHOLDER}
              className={inputClassName}
            />
            <button
              type="button"
              disabled={saving || !roleDraft.trim()}
              onClick={addCustomRole}
              className="shrink-0 rounded-xl border border-[#d4c3c1] bg-white px-3 py-2 text-sm font-semibold text-[#663100] disabled:opacity-50"
            >
              {UI.CLAN_DUTY_ROLE_ADD}
            </button>
          </div>
        </>
      ) : entry.roles.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {entry.roles.map((role) => (
            <span
              key={role}
              className="rounded-full bg-[#ffdcc5]/80 px-3 py-1 text-xs font-semibold text-[#663100]"
            >
              {role}
            </span>
          ))}
        </div>
      ) : null}

      {hasCeremonyRole ? (
        <DutyEntryCeremonyLinks
          links={entry.ceremonyLinks}
          templates={templates}
          canEdit={canEdit}
          saving={saving}
          onChange={(ceremonyLinks) =>
            onChange(entry.personId, { ceremonyLinks })
          }
        />
      ) : null}
    </div>
  );
}
