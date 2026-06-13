'use client';

import { useState, type ReactNode } from 'react';
import Icon from '@/components/icons/Icon';

type CollapsibleSectionProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export default function CollapsibleSection({ title, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="border-b border-slate-200">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-4 py-4 text-left active:bg-slate-50"
      >
        <span className="text-sm font-semibold text-slate-900">{title}</span>
        <Icon
          path={open ? 'chevronUp' : 'chevronDown'}
          size={18}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          pointer={false}
        />
      </button>
      {open ? <div className="space-y-3 px-4 pb-4">{children}</div> : null}
    </section>
  );
}

type FormFieldProps = {
  label: string;
  children: React.ReactNode;
};

export function FormField({ label, children }: FormFieldProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}

export const inputClassName =
  'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none disabled:opacity-50';

export const textareaClassName =
  'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none disabled:opacity-50 min-h-[120px] resize-y';
