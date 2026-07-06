"use client";

import type { ReactNode } from "react";
import Icon from "@/components/icons/Icon";
import { UI } from "@/lib/constants/ui-strings";
import type { CeremonyTemplate } from "@/lib/api/modules/ceremonies";
import { htmlToPreviewText } from "@/utils/html-preview";

type Props = {
  template: CeremonyTemplate;
  canDuplicate?: boolean;
  onPrint: () => void;
  onSetDefault: () => void;
  onDuplicate: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function CeremonyTemplateCard({
  template,
  canDuplicate = false,
  onPrint,
  onSetDefault,
  onDuplicate,
  onEdit,
  onDelete,
}: Props) {
  const preview = htmlToPreviewText(template.content);
  const isHtml = /<!DOCTYPE|<html[\s>]/i.test(template.content);
  const showActions =
    template.canEdit || template.canSetDefault || canDuplicate;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-amber-100/50 bg-white p-4 shadow-[0_2px_12px_rgba(69,26,3,0.06)] transition-shadow hover:shadow-md">
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="flex-1 font-serif text-xl font-semibold leading-tight text-[#321716]">
          {template.name}
        </h3>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {template.isSystemTemplate ? (
            <span className="rounded-lg border border-[#4a2c2a]/15 bg-[#f6f3ee] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#4a2c2a]">
              {UI.CEREMONY_TEMPLATE_SYSTEM_BADGE}
            </span>
          ) : null}
          {template.isDefault ? (
            <span className="rounded-lg border border-[#944a00]/20 bg-[#fef3c7] px-2 py-0.5 text-xs font-semibold text-[#944a00]">
              {UI.CEREMONY_TEMPLATE_DEFAULT_BADGE}
            </span>
          ) : null}
        </div>
      </div>

      <p
        className={`mb-4 line-clamp-3 text-sm leading-relaxed text-[#504443] ${
          isHtml ? "font-mono text-xs opacity-80 italic" : "opacity-90"
        }`}
      >
        {preview || UI.CEREMONY_TEMPLATE_PREVIEW_EMPTY}
      </p>

      <div className="mt-auto flex items-center justify-between border-t border-[#d4c3c1]/20 pt-3">
        <button
          type="button"
          onClick={onPrint}
          className="flex items-center gap-2 rounded-xl bg-[#944a00] px-4 py-2 text-sm font-semibold text-white shadow-md transition-transform active:scale-95"
        >
          <Icon
            path="print"
            size={18}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            pointer={false}
          />
          {UI.CEREMONY_PRINT_OPEN}
        </button>

        {showActions ? (
          <div className="flex items-center gap-1">
            {template.canSetDefault && !template.isDefault ? (
              <IconActionButton
                label={UI.CEREMONY_TEMPLATE_USE_DEFAULT}
                onClick={onSetDefault}
              >
                <Icon
                  path="check"
                  size={20}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  pointer={false}
                />
              </IconActionButton>
            ) : null}
            {template.canEdit || canDuplicate ? (
              <IconActionButton
                label={UI.CEREMONY_TEMPLATE_DUPLICATE}
                onClick={onDuplicate}
                className="hidden sm:inline-flex"
              >
                <Icon
                  path="userPlus"
                  size={20}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  pointer={false}
                />
              </IconActionButton>
            ) : null}
            {template.canEdit ? (
              <>
                <IconActionButton label={UI.BTN_EDIT} onClick={onEdit}>
                  <Icon
                    path="edit"
                    size={20}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    pointer={false}
                  />
                </IconActionButton>
                <IconActionButton
                  label={UI.DELETE_PERSON}
                  onClick={onDelete}
                  className="text-[#ba1a1a] hover:bg-[#ffdad6]/40"
                >
                  <Icon
                    path="trash"
                    size={20}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    pointer={false}
                  />
                </IconActionButton>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

function IconActionButton({
  label,
  onClick,
  children,
  className = "text-[#504443] hover:bg-[#f0ede9]",
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`rounded-lg p-2 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
