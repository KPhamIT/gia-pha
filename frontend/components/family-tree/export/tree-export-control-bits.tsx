'use client';

export type ImageKey = 'scroll' | 'dragonLeft' | 'dragonRight';
export type CoupletKey = 'coupletLeft' | 'coupletRight';

export const fieldLabel = 'mb-1 block text-xs font-medium text-slate-500';
export const selectClass =
  'w-full rounded-lg border border-amber-300/50 bg-amber-50/90 px-3 py-2 text-sm text-amber-950 outline-none focus:border-amber-500';
export const sectionTitle =
  'mt-4 mb-2 text-[11px] font-semibold uppercase tracking-wide text-amber-700';

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 py-1.5 text-sm text-slate-700">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-amber-600"
      />
    </label>
  );
}

export function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="mb-2 flex items-center justify-between gap-3 text-sm text-slate-700">
      <span>{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-12 cursor-pointer rounded border border-slate-300 bg-white p-0.5"
      />
    </label>
  );
}
