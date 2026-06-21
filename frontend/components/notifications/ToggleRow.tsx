'use client';

type Props = {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
};

export default function ToggleRow({ label, checked, disabled, onChange }: Props) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm text-neutral-900">
      <span className="min-w-0 flex-1">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
          checked ? 'bg-amber-600' : 'bg-neutral-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </label>
  );
}
