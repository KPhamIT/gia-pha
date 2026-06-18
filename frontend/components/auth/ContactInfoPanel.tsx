'use client';

import { formatContactLines, getContactInfo, hasContactInfo } from '@/lib/constants/contact-info';
import { UI } from '@/lib/constants/ui-strings';

export default function ContactInfoPanel() {
  const info = getContactInfo();
  if (!hasContactInfo(info)) return null;

  const lines = formatContactLines(info);

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
      <p className="font-medium text-slate-900">{UI.CONTACT_INFO_TITLE}</p>
      <p className="mt-1 text-xs text-slate-500">{UI.LOGIN_CONTACT_HINT}</p>
      <ul className="mt-2 space-y-1">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
