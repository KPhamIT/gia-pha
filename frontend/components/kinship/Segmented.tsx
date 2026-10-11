"use client";

/** Nhóm nút chọn một (Nam/Nữ, miền Bắc/Trung/Nam). */
export default function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-[#d4c3c1] bg-white p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={`whitespace-nowrap rounded-full px-2.5 py-1.5 text-sm transition sm:px-3.5 ${
            value === opt.value ? "bg-[#4a2c2a] font-semibold text-[#f6d68e]" : "text-[#504443] hover:bg-[#f0ede9]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
