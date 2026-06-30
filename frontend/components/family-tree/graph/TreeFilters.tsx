"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/icons/Icon";
import { BT } from "@/lib/constants/ui-theme";
import { UI } from "@/lib/constants/ui-strings";
import { BRANCH_OPTIONS, getBranchLabel } from "@/lib/constants/branches";

const GENERATION_OPTIONS = [3, 4, 5, 6];

type Branch = number | "all";
type Generation = number | "all";

type TreeFiltersProps = {
  branch: Branch;
  maxGeneration: Generation;
  onBranchChange: (branch: Branch) => void;
  onMaxGenerationChange: (generation: Generation) => void;
};

function Tag({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? BT.pillActive
          : "rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600 active:bg-amber-100"
      }
    >
      {label}
    </button>
  );
}

export default function TreeFilters({
  branch,
  maxGeneration,
  onBranchChange,
  onMaxGenerationChange,
}: TreeFiltersProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const summary = `${branch === "all" ? UI.FILTER_ALL : getBranchLabel(branch)} · ${
    maxGeneration === "all" ? UI.FILTER_ALL : UI.GENERATION_SHORT(maxGeneration)
  }`;

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-11 max-w-[10rem] items-center gap-1 rounded-full border border-amber-200/80 bg-white px-3 text-xs font-medium text-amber-950 shadow-sm active:bg-amber-50 md:h-10 md:max-w-[14rem] md:text-sm`}
      >
        <span className="truncate">{summary}</span>
        <Icon
          path={open ? "chevronUp" : "chevronDown"}
          size={14}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          pointer={false}
        />
      </button>

      {open ? (
        <div
          className={`absolute left-0 top-full z-30 mt-2 w-64 p-3 shadow-xl md:w-72 md:p-4 ${BT.card}`}
        >
          <p
            className={`mb-1.5 text-[11px] font-semibold uppercase tracking-wide ${BT.mutedOnLight}`}
          >
            {UI.FILTER_BRANCH_LABEL}
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Tag
              active={branch === "all"}
              label={UI.FILTER_ALL}
              onClick={() => onBranchChange("all")}
            />
            {BRANCH_OPTIONS.map((option) => (
              <Tag
                key={option.value}
                active={branch === option.value}
                label={option.label}
                onClick={() => onBranchChange(option.value)}
              />
            ))}
          </div>

          <p
            className={`mb-1.5 mt-3 text-[11px] font-semibold uppercase tracking-wide ${BT.mutedOnLight}`}
          >
            {UI.FILTER_GENERATION_LABEL}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {GENERATION_OPTIONS.map((gen) => (
              <Tag
                key={gen}
                active={maxGeneration === gen}
                label={UI.GENERATION_SHORT(gen)}
                onClick={() => onMaxGenerationChange(gen)}
              />
            ))}
            <Tag
              active={maxGeneration === "all"}
              label={UI.FILTER_ALL}
              onClick={() => onMaxGenerationChange("all")}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
