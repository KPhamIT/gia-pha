import type { ThemeMode } from '@/components/types/family-tree-types';
import { getMutedTextClass, getPageShellClass } from '@/utils/theme';
import { UI } from '@/lib/constants/ui-strings';

type FamilyTreeStatusProps = {
  theme: ThemeMode;
  type: 'loading' | 'error' | 'empty';
  message?: string;
  onRetry?: () => void;
};

export default function FamilyTreeStatus({
  theme,
  type,
  message,
  onRetry,
}: FamilyTreeStatusProps) {
  const shellClass = `flex h-screen w-full items-center justify-center ${getPageShellClass(theme)}`;

  if (type === 'loading') {
    return (
      <div className={shellClass}>
        <div className={`text-lg ${getMutedTextClass(theme)}`}>{UI.LOADING}</div>
      </div>
    );
  }

  if (type === 'empty') {
    return (
      <div className={shellClass}>
        <div className={`text-lg ${getMutedTextClass(theme)}`}>{UI.NO_DATA}</div>
      </div>
    );
  }

  return (
    <div className={shellClass}>
      <div
        className={`rounded-lg p-6 text-center ${
          theme === 'dark' ? 'border border-slate-700 bg-slate-900' : 'bg-red-50'
        }`}
      >
        <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-red-300' : 'text-red-600'}`}>
          {UI.ERROR_TITLE}
        </p>
        <p className={`mt-2 ${theme === 'dark' ? 'text-slate-200' : 'text-red-500'}`}>{message}</p>
        {onRetry ? (
          <button
            onClick={onRetry}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            {UI.RETRY}
          </button>
        ) : null}
      </div>
    </div>
  );
}
