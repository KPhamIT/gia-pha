"use client";

import Icon from "@/components/icons/Icon";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import IconRoundButton from "@/components/ui/IconRoundButton";
import type { CeremonyTemplate } from "@/lib/api/modules/ceremonies";

type Props = {
  template: CeremonyTemplate;
  isAdmin: boolean;
  onPrint: () => void;
  onSetDefault: () => void;
  onDuplicate: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function CeremonyTemplateCard({
  template,
  isAdmin,
  onPrint,
  onSetDefault,
  onDuplicate,
  onEdit,
  onDelete,
}: Props) {
  return (
    <li className={`${BT.card} flex flex-col p-3 md:p-4`}>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="min-w-0 flex-1 truncate font-semibold text-neutral-900">
            {template.name}
          </p>
          {template.isDefault ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
              <Icon
                path="check"
                size={12}
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                pointer={false}
              />
              {UI.CEREMONY_TEMPLATE_DEFAULT_BADGE}
            </span>
          ) : null}
        </div>
        <p
          className={`mt-2 line-clamp-3 whitespace-pre-wrap font-mono text-xs leading-relaxed ${BT.mutedOnLight}`}
        >
          {template.content}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-amber-200/60 pt-3">
        <button
          type="button"
          className={`mr-auto ${BT.btnBase} ${BT.btnSm} ${BT.btnGold}`}
          onClick={onPrint}
        >
          <Icon
            path="print"
            size={16}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            pointer={false}
          />
          {UI.CEREMONY_PRINT_OPEN}
        </button>
        {isAdmin ? (
          <>
            {!template.isDefault ? (
              <IconRoundButton
                icon="check"
                variant="outline"
                onClick={onSetDefault}
                aria-label={UI.CEREMONY_TEMPLATE_USE_DEFAULT}
              />
            ) : null}
            <IconRoundButton
              icon="userPlus"
              variant="outline"
              onClick={onDuplicate}
              aria-label={UI.CEREMONY_TEMPLATE_DUPLICATE}
            />
            <IconRoundButton
              icon="edit"
              variant="outline"
              onClick={onEdit}
              aria-label={UI.BTN_EDIT}
            />
            <IconRoundButton
              icon="trash"
              variant="danger"
              onClick={onDelete}
              aria-label={UI.DELETE_PERSON}
            />
          </>
        ) : null}
      </div>
    </li>
  );
}
