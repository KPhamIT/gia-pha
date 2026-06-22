import type { ThemeMode } from "@/components/types/family-tree-types";
import LoadingSpinner from "@/components/icons/LoadingSpinner";
import { getMutedTextClass, getPageShellClass } from "@/utils/theme";
import { LAYOUT } from "@/lib/constants/ui-layout";
import { UI } from "@/lib/constants/ui-strings";

type FamilyTreeStatusProps = {
  theme: ThemeMode;
  type: "loading" | "error" | "empty";
  message?: string;
  onRetry?: () => void;
  onLogin?: () => void;
};

export default function FamilyTreeStatus({
  theme,
  type,
  message,
  onRetry,
  onLogin,
}: FamilyTreeStatusProps) {
  const shellClass = `flex h-screen w-full items-center justify-center ${getPageShellClass(theme)}`;

  if (type === "loading") {
    return (
      <div className={shellClass}>
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size={48} label={UI.LOADING} />
        </div>
      </div>
    );
  }

  if (type === "empty") {
    return (
      <div className={shellClass}>
        <div
          className={`text-lg ${getMutedTextClass(theme)} ${LAYOUT.pagePad} text-center md:mx-auto md:max-w-md md:rounded-2xl md:bg-white/50 md:shadow-sm md:dark:bg-slate-900/50`}
        >
          {UI.NO_DATA}
        </div>
      </div>
    );
  }

  return (
    <div className={shellClass}>
      <div
        className={`mx-4 max-w-md rounded-2xl p-6 text-center shadow-lg md:p-8 ${
          theme === "dark"
            ? "border border-slate-700 bg-slate-900"
            : "bg-red-50"
        }`}
      >
        <p
          className={`text-lg font-semibold ${theme === "dark" ? "text-red-300" : "text-red-600"}`}
        >
          {UI.ERROR_TITLE}
        </p>
        <p
          className={`mt-2 ${theme === "dark" ? "text-slate-200" : "text-red-500"}`}
        >
          {message}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {onLogin ? (
            <button
              onClick={onLogin}
              className="rounded-lg bg-[#0068ff] px-4 py-2 text-white hover:bg-[#0056d6]"
            >
              {UI.LOGIN_BUTTON}
            </button>
          ) : null}
          {onRetry ? (
            <button
              onClick={onRetry}
              className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              {UI.RETRY}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
