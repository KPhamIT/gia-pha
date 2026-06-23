"use client";

import type { Person } from "@/components/types/family-tree-types";
import Icon from "@/components/icons/Icon";
import { UI } from "@/lib/constants/ui-strings";

export const iconBtn =
  "grid place-items-center rounded-2xl py-3 transition disabled:opacity-50";

export function ModalHeader({
  title,
  subtitle,
  generation,
  onClose,
}: {
  title: string;
  subtitle: string;
  generation?: number | null;
  onClose: () => void;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div>
        <p className="text-lg font-semibold text-slate-900">{title}</p>
        <p className="text-base font-semibold text-slate-900">{subtitle}</p>
        {generation != null ? (
          <p className="text-sm text-slate-500">
            {UI.GENERATION_ORDINAL(generation)}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label={UI.CLOSE}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 md:h-10 md:w-10"
      >
        <Icon
          path="close"
          size={18}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          pointer={false}
        />
      </button>
    </div>
  );
}

export function ActionOptions({
  node,
  loading,
  onClose,
  onAddChild,
  onDelete,
}: {
  node: Person;
  loading: boolean;
  onClose: () => void;
  onAddChild: () => void;
  onDelete: () => void;
}) {
  return (
    <>
      <ModalHeader
        title={UI.OPTIONS_FOR}
        subtitle={node.fullName}
        generation={node.generation}
        onClose={onClose}
      />
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onAddChild}
          disabled={loading}
          aria-label={UI.ADD_CHILD}
          className={`${iconBtn} bg-green-600 text-white hover:bg-green-700`}
        >
          <Icon
            path="userPlus"
            size={20}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            pointer={false}
          />
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={loading}
          aria-label={UI.DELETE_PERSON}
          className={`${iconBtn} bg-red-50 text-red-600 hover:bg-red-100`}
        >
          <Icon
            path="trash"
            size={20}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            pointer={false}
          />
        </button>
      </div>
    </>
  );
}

export function ConfirmDelete({
  node,
  loading,
  onBack,
  onConfirm,
}: {
  node: Person;
  loading: boolean;
  onBack: () => void;
  onConfirm: () => void;
}) {
  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-100 text-red-600">
          <Icon
            path="alertTriangle"
            size={18}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            pointer={false}
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {UI.DELETE_PERSON_CONFIRM(node.fullName)}
          </p>
          <p className="text-xs text-slate-500">{UI.DELETE_IRREVERSIBLE}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          aria-label={UI.BACK}
          className={`${iconBtn} border border-slate-300 text-slate-700 hover:bg-slate-50`}
        >
          <Icon
            path="arrowLeft"
            size={18}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            pointer={false}
          />
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          aria-label={UI.DELETE_PERSON}
          className={`${iconBtn} bg-red-600 text-white hover:bg-red-700`}
        >
          <Icon
            path="trash"
            size={18}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            pointer={false}
          />
        </button>
      </div>
    </>
  );
}
