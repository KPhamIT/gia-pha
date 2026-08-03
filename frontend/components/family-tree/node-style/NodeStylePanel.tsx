"use client";

import { useCallback, useEffect, useState } from "react";
import Icon from "@/components/icons/Icon";
import type { IconName } from "@/components/icons/icon-paths";
import type {
  LayoutConfig,
  Person,
} from "@/components/types/family-tree-types";
import NodeAppearanceToolbar from "./NodeAppearanceToolbar";
import { UI } from "@/lib/constants/ui-strings";
import {
  commitNodeAppearance,
  previewNodeAppearance,
  resolvePersonNodeAppearance,
  type NodeAppearanceKey,
  type NodeAppearanceScope,
  type NodeAppearanceValues,
} from "@/lib/family-tree/node-appearance";

export type NodeStylePanelProps = {
  person: Person;
  layoutConfig: LayoutConfig;
  setLayoutConfig: React.Dispatch<React.SetStateAction<LayoutConfig>>;
  onClose: () => void;
  onOpenDetail: (person: Person) => void;
  /** Thêm con cho người đang chọn (quyền `editTree`). */
  onAddChild?: (person: Person) => void;
  canEditTree?: boolean;
  onSaveSettings?: () => void;
  canSaveSettings?: boolean;
};

const actionBtn =
  "grid h-8 w-8 shrink-0 place-items-center rounded border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-50 active:bg-neutral-100 disabled:opacity-40";
const actionBtnActive =
  "border-amber-300 bg-amber-100 text-amber-950";

function SheetAction({
  icon,
  label,
  onClick,
  active,
  disabled,
  accent,
}: {
  icon: IconName;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  accent?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`${actionBtn} ${active ? actionBtnActive : ""} ${
        accent
          ? "border-amber-600 bg-amber-700 text-amber-50 hover:bg-amber-800"
          : ""
      }`}
    >
      <Icon path={icon} size={16} stroke="currentColor" strokeWidth={2} />
    </button>
  );
}

/** Nội dung toolbar chỉnh kiểu node — đặt trong anchor phía trên node. */
export default function NodeStylePanel({
  person,
  layoutConfig,
  setLayoutConfig,
  onClose,
  onOpenDetail,
  onAddChild,
  canEditTree = false,
  onSaveSettings,
  canSaveSettings = false,
}: NodeStylePanelProps) {
  const generation = person.generation != null ? Number(person.generation) : null;
  const canApplyLevel = generation != null && !Number.isNaN(generation);
  const [applyToLevel, setApplyToLevel] = useState(false);
  const [applyToTree, setApplyToTree] = useState(false);
  const [draft, setDraft] = useState<NodeAppearanceValues>(() =>
    resolvePersonNodeAppearance(person.id, generation, layoutConfig),
  );

  useEffect(() => {
    setDraft(resolvePersonNodeAppearance(person.id, generation, layoutConfig));
    setApplyToLevel(false);
    setApplyToTree(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [person.id, generation]);

  const scope: NodeAppearanceScope = applyToTree
    ? "global"
    : applyToLevel
      ? "level"
      : "person";

  const handleFieldChange = useCallback(
    (key: NodeAppearanceKey, value: NodeAppearanceValues[NodeAppearanceKey]) => {
      setDraft((prev) => {
        const next = { ...prev, [key]: value };
        setLayoutConfig((config) =>
          previewNodeAppearance(config, person, { [key]: value }, scope),
        );
        return next;
      });
    },
    [person, scope, setLayoutConfig],
  );

  const toggleApplyToLevel = () => {
    if (!canApplyLevel) return;
    const next = !applyToLevel;
    setApplyToLevel(next);
    if (next) setApplyToTree(false);
    const nextScope: NodeAppearanceScope = next ? "level" : "person";
    setLayoutConfig((config) =>
      commitNodeAppearance(config, person, draft, nextScope),
    );
  };

  const toggleApplyToTree = () => {
    const next = !applyToTree;
    setApplyToTree(next);
    if (next) setApplyToLevel(false);
    const nextScope: NodeAppearanceScope = next ? "global" : "person";
    setLayoutConfig((config) =>
      commitNodeAppearance(config, person, draft, nextScope),
    );
  };

  const handleApply = () => {
    setLayoutConfig((config) => commitNodeAppearance(config, person, draft, scope));
    if (canSaveSettings) onSaveSettings?.();
    onClose();
  };

  const handleOpenDetail = () => {
    onClose();
    onOpenDetail(person);
  };

  const handleAddChild = () => {
    if (!canEditTree || !onAddChild) return;
    onClose();
    onAddChild(person);
  };

  return (
    <div className="rounded-2xl border border-neutral-200/90 bg-white px-2 pb-2.5 pt-2 shadow-xl ring-1 ring-black/5">
      <div className="flex items-center gap-1.5">
        <div className="min-w-0 flex-1 pr-1">
          <p className="truncate text-sm font-semibold text-neutral-900">
            {person.fullName}
          </p>
          {canApplyLevel ? (
            <p className="text-[11px] text-neutral-500">
              {UI.GENERATION_ORDINAL(generation!)}
            </p>
          ) : null}
        </div>
        <SheetAction
          icon="tree"
          label={UI.NODE_STYLE_APPLY_WHOLE_TREE}
          onClick={toggleApplyToTree}
          active={applyToTree}
        />
        <SheetAction
          icon="layers"
          label={UI.NODE_STYLE_APPLY_SAME_LEVEL}
          onClick={toggleApplyToLevel}
          active={applyToLevel}
          disabled={!canApplyLevel}
        />
        {canEditTree && onAddChild ? (
          <SheetAction
            icon="userPlus"
            label={UI.ADD_CHILD}
            onClick={handleAddChild}
          />
        ) : null}
        <SheetAction
          icon="edit"
          label={UI.NODE_STYLE_OPEN_DETAIL}
          onClick={handleOpenDetail}
        />
        <SheetAction
          icon="check"
          label={UI.NODE_STYLE_APPLY}
          onClick={handleApply}
          accent
        />
        <SheetAction icon="close" label={UI.CLOSE} onClick={onClose} />
      </div>

      <div className="mt-2">
        <NodeAppearanceToolbar values={draft} onChange={handleFieldChange} />
      </div>
    </div>
  );
}
