/** Class dùng chung cho form đăng ký dòng họ (/tao-dong-ho). */
export const RF = {
  label: "mb-1.5 block text-sm font-medium text-[#321716]",
  input:
    "w-full rounded-lg border border-[#d4c3c1] bg-white px-3 py-2.5 text-base text-[#1c1c19] outline-none transition focus:border-[#4a2c2a] focus:ring-2 focus:ring-[#4a2c2a]/15 md:text-sm",
  card: "rounded-2xl border border-[#d4c3c1] bg-white p-6 shadow-sm md:p-8",
  error: "rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700",
  btnPrimary:
    "inline-flex min-h-11 items-center justify-center rounded-lg bg-[#321716] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4a2c2a] disabled:opacity-50",
  btnOutline:
    "inline-flex min-h-11 items-center justify-center rounded-lg border border-[#d4c3c1] bg-white px-5 py-2.5 text-sm font-semibold text-[#321716] transition hover:bg-[#f6f3ee]",
} as const;
