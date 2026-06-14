'use client';

import { useState } from 'react';
import Icon from '@/components/icons/Icon';
import { UI } from '@/lib/constants/ui-strings';
import { BRANCH_OPTIONS, getBranchLabel } from '@/lib/constants/branches';

const GENERATION_OPTIONS = [3, 4, 5, 6];

type Branch = number | 'all';
type Generation = number | 'all';

type TreeFiltersProps = {
  branch: Branch;
  maxGeneration: Generation;
  onBranchChange: (branch: Branch) => void;
  onMaxGenerationChange: (generation: Generation) => void;
};

function Tag({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
        active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 active:bg-slate-200'
      }`}
    >
      {label}
    </button>
  );
}

export default function TreeFilters({ branch, maxGeneration, onBranchChange, onMaxGenerationChange }: TreeFiltersProps) {
  const [open, setOpen] = useState(false);
  const summary = `${branch === 'all' ? UI.FILTER_ALL : getBranchLabel(branch)} · ${
    maxGeneration === 'all' ? UI.FILTER_ALL : UI.GENERATION_SHORT(maxGeneration)
  }`;

  return (
    <div className="fixed left-4 top-4 z-20 pt-[env(safe-area-inset-top)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm active:bg-slate-50"
      >
        <span className="max-w-[10rem] truncate">{summary}</span>
        <Icon path={open ? 'chevronUp' : 'chevronDown'} size={14} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
      </button>

      {open ? (
        <div className="mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{UI.FILTER_BRANCH_LABEL}</p>
          <div className="flex flex-wrap gap-1.5">
            <Tag active={branch === 'all'} label={UI.FILTER_ALL} onClick={() => onBranchChange('all')} />
            {BRANCH_OPTIONS.map((option) => (
              <Tag
                key={option.value}
                active={branch === option.value}
                label={option.label}
                onClick={() => onBranchChange(option.value)}
              />
            ))}
          </div>

          <p className="mb-1.5 mt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{UI.FILTER_GENERATION_LABEL}</p>
          <div className="flex flex-wrap gap-1.5">
            {GENERATION_OPTIONS.map((gen) => (
              <Tag
                key={gen}
                active={maxGeneration === gen}
                label={UI.GENERATION_SHORT(gen)}
                onClick={() => onMaxGenerationChange(gen)}
              />
            ))}
            <Tag active={maxGeneration === 'all'} label={UI.FILTER_ALL} onClick={() => onMaxGenerationChange('all')} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
