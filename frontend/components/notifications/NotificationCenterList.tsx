'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import type { NotificationLogItem } from '@/lib/api/modules/notifications';
import { UI } from '@/lib/constants/ui-strings';
import { BT } from '@/lib/constants/ui-theme';

export default function NotificationCenterList() {
  const [items, setItems] = useState<NotificationLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api.notifications
      .list()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className={`text-sm ${BT.mutedOnDark}`}>{UI.LOADING}</p>;
  }

  if (items.length === 0) {
    return <p className={`text-sm ${BT.mutedOnDark}`}>{UI.NOTIFICATIONS_EMPTY}</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            className={`${BT.card} w-full p-4 text-left transition hover:opacity-90`}
            onClick={() => {
              if (item.person?.id) {
                router.push(`/ceremonies/upcoming?personId=${item.person.id}`);
              }
            }}
          >
            <p className="font-medium">🔔 {item.title}</p>
            <p className={`mt-1 text-sm whitespace-pre-wrap ${BT.mutedOnLight}`}>{item.message}</p>
            {item.person ? (
              <p className={`mt-2 text-xs ${BT.mutedOnLight}`}>{item.person.fullName}</p>
            ) : null}
          </button>
        </li>
      ))}
    </ul>
  );
}
