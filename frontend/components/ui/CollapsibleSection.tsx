'use client';

import { useState, type ReactNode } from 'react';
import Icon from '@/components/icons/Icon';
import { BT } from '@/lib/constants/ui-theme';

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
      <label className={`mb-1 block text-sm font-medium ${BT.mutedOnLight}`}>{label}</label>
      {children}
    </div>
  );
}

export const inputClassName = BT.input;

export const textareaClassName = BT.textarea;
