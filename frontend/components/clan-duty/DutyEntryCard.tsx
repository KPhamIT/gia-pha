"use client";

import { useState } from "react";
import type { CeremonyTemplate } from "@/lib/api/modules/ceremonies";
import { FormField, inputClassName } from "@/components/ui/CollapsibleSection";
import { getBranchLabel } from "@/lib/constants/branches";
import { UI } from "@/lib/constants/ui-strings";
import type { ClanDutyDraftEntry } from "@/components/clan-duty/clan-duty-draft";
import ClanDutyPersonAvatar from "@/components/clan-duty/ClanDutyPersonAvatar";
import DutyEntryCeremonyLinks from "@/components/clan-duty/DutyEntryCeremonyLinks";

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

type Props = {
  entry: ClanDutyDraftEntry;
  avatar?: string | null;
  canEdit: boolean;
  saving: boolean;
  templates: CeremonyTemplate[];
  roleCatalog: string[];
  onChange: (
    personId: number,
    patch: Partial<Pick<ClanDutyDraftEntry, "roles" | "note" | "ceremonyLinks">>,
  ) => void;
  onRemove: (personId: number) => void;
  onAddCustomRole: (role: string) => void;
};

export default function DutyEntryCard({
  entry,
  avatar,
  canEdit,
  saving,
  templates,
  roleCatalog,
  onChange,
  onRemove,
  onAddCustomRole,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [roleDraft, setRoleDraft] = useState("");
  const meta = personMeta(entry);
  const hasCeremonyRole = entry.roles.includes(
    UI.CLAN_DUTY_ROLE_PREPARE_CEREMONY,
  );
  const showEditor = canEdit && editing;

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
    <article className="flex flex-col gap-4 rounded-2xl border border-[#e5e2dd]/80 bg-white p-5 shadow-[0_4px_20px_-2px_rgba(69,26,3,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-4">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#d4c3c1]/30">
            <ClanDutyPersonAvatar name={entry.fullName} avatar={avatar} />
          </div>
          <div className="min-w-0">
            <h4 className="truncate font-serif text-xl font-semibold text-[#321716]">
              {entry.fullName}
            </h4>
            {meta ? (
              <p className="text-xs font-medium text-[#504443]">{meta}</p>
            ) : null}
          </div>
        </div>
        {canEdit ? (
          <button
            type="button"
            disabled={saving}
            onClick={() => setEditing((v) => !v)}
            className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-[#504443] hover:bg-[#f0ede9]"
          >
            {editing ? UI.CLAN_DUTY_DONE_EDIT : UI.CLAN_DUTY_EDIT_ENTRY}
          </button>
        ) : null}
      </div>

      {!showEditor && entry.roles.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {entry.roles.map((role, index) => (
            <span
              key={role}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                index === 0
                  ? "border-[#fc8f34]/30 bg-[#fc8f34]/20 text-[#663100]"
                  : "border-[#d4c3c1]/30 bg-[#ebe8e3] text-[#504443]"
              }`}
            >
              {role}
            </span>
          ))}
        </div>
      ) : null}

      {showEditor ? (
        <div className="space-y-3 border-t border-[#e5e2dd] pt-3">
          <p className="text-xs font-medium text-[#504443]">{UI.CLAN_DUTY_ROLE}</p>
          <div className="flex flex-wrap gap-2">
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
          <div className="flex gap-2">
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
          <FormField label={UI.CLAN_DUTY_ENTRY_NOTE}>
            <input
              type="text"
              value={entry.note}
              onChange={(e) =>
                onChange(entry.personId, { note: e.target.value })
              }
              disabled={saving}
              className={inputClassName}
            />
          </FormField>
          <button
            type="button"
            disabled={saving}
            onClick={() => onRemove(entry.personId)}
            className="text-xs font-medium text-red-700"
          >
            {UI.CLAN_DUTY_REMOVE}
          </button>
        </div>
      ) : null}

      {hasCeremonyRole &&
      (showEditor || entry.ceremonyLinks.length > 0) ? (
        <DutyEntryCeremonyLinks
          links={entry.ceremonyLinks}
          templates={templates}
          canEdit={showEditor}
          saving={saving}
          onChange={(ceremonyLinks) =>
            onChange(entry.personId, { ceremonyLinks })
          }
        />
      ) : null}
    </article>
  );
}
