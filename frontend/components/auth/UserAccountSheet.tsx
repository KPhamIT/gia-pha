'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Person, Relationship } from '@/components/types/family-tree-types';
import PersonSearchPanel from '@/components/family-tree/person/PersonSearchPanel';
import { UI } from '@/lib/constants/ui-strings';
import { LAYOUT } from '@/lib/constants/ui-layout';
import OverlayPortal from '@/components/ui/OverlayPortal';
import IconRoundButton from '@/components/ui/IconRoundButton';
import { BT } from '@/lib/constants/ui-theme';
import { api } from '@/lib/api';
import { logout } from '@/lib/auth/session';
import { notify } from '@/lib/notify';
import { useAuthStore } from '@/store/authStore';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { getErrorMessage } from '@/utils/errors';
import ContactInfoPanel from '@/components/auth/ContactInfoPanel';
import NotificationStatsPanel from '@/components/notifications/NotificationStatsPanel';

type UserAccountSheetProps = {
  persons: Person[];
  relationships: Relationship[];
  onClose: () => void;
  onLinked?: () => void;
};

export default function UserAccountSheet({ persons, relationships, onClose, onLinked }: UserAccountSheetProps) {
  const user = useAuthStore((state) => state.user);
  const person = useAuthStore((state) => state.person);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const isSystem = useAuthStore((state) => state.isSystem);
  const canUseFeature = useAuthStore((state) => state.canUseFeature);
  const { requireFeature } = useFeatureAccess();
  const refresh = useAuthStore((state) => state.refresh);
  const [personId, setPersonId] = useState<number | null>(person?.id ?? null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPersonId(person?.id ?? null);
  }, [person?.id]);

  const handleSaveLink = useCallback(async () => {
    if (!requireFeature('linkAccount')) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await api.auth.linkPerson(personId);
      await refresh();
      setMessage(UI.ACCOUNT_LINK_SAVED);
      notify.success(UI.TOAST_LINK_SAVED);
      onLinked?.();
    } catch (err) {
      const message = getErrorMessage(err, UI.ERR_FETCH_DATA);
      setError(message);
      notify.error(err, UI.ERR_FETCH_DATA);
    } finally {
      setSaving(false);
    }
  }, [onLinked, personId, refresh, requireFeature]);

  const roleLabel =
    user?.role === 'SYSTEM'
      ? UI.ACCOUNT_ROLE_SYSTEM
      : user?.role === 'ADMIN'
        ? UI.ACCOUNT_ROLE_ADMIN
        : UI.ACCOUNT_ROLE_STANDARD;

  return (
    <OverlayPortal>
      <div className={`${LAYOUT.sidePanelOverlay} ${LAYOUT.overlayBackdropDark}`}>
        <button type="button" className="absolute inset-0 cursor-default" onClick={onClose} aria-label={UI.CANCEL} />
        <div className={`${LAYOUT.sidePanel} ${BT.shell} scroll-list border-amber-100/10`} style={{ animation: 'slideInRight 240ms ease-out forwards' }}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-amber-50 md:text-lg">{UI.ACCOUNT_TITLE}</h2>
            <IconRoundButton icon="close" variant="ghost" label={UI.CANCEL} onClick={onClose} />
          </div>

          {!user ? (
            <p className={`mt-4 text-sm ${BT.mutedOnDark}`}>{UI.ACCOUNT_NOT_LOGGED_IN}</p>
          ) : (
            <div className={`mt-4 space-y-2 text-sm text-amber-50/90`}>
              <p>
                <span className="font-medium">{UI.LOGIN_USERNAME}:</span> {user.username ?? '—'}
              </p>
              <p>
                <span className="font-medium">Email:</span> {user.email ?? '—'}
              </p>
              <p>
                <span className="font-medium">Provider:</span> {user.provider}
              </p>
              <p>
                <span className="font-medium">Role:</span> {roleLabel}
                {isAdmin || isSystem ? null : ` (${UI.ACCOUNT_ROLE_STANDARD})`}
              </p>
            </div>
          )}

          {user && canUseFeature('linkAccount') ? (
            <div className={`mt-6 space-y-3 ${BT.card} p-4`}>
              <div>
                <label className={`block text-sm font-medium ${BT.mutedOnLight}`}>{UI.ACCOUNT_LINK_PERSON}</label>
                <p className={`mt-1 text-xs ${BT.mutedOnLight}`}>{UI.ACCOUNT_LINK_PERSON_HINT}</p>
              </div>
              <PersonSearchPanel
                persons={persons}
                relationships={relationships}
                selectedPersonId={personId}
                onSelect={(item) => setPersonId(item.id)}
                onClear={() => setPersonId(null)}
                clearLabel={UI.ACCOUNT_CLEAR_LINK}
                listClassName="max-h-52 overflow-y-auto rounded-xl border border-amber-100 bg-amber-50/30 px-1 py-1"
              />
              <div className="flex justify-end">
                <IconRoundButton
                  icon="save"
                  variant="gold"
                  loading={saving}
                  label={UI.SAVE}
                  onClick={() => void handleSaveLink()}
                />
              </div>
              {message ? <p className={`text-sm ${BT.gold}`}>{message}</p> : null}
              {error ? <p className={BT.errorBgLight}>{error}</p> : null}
            </div>
          ) : null}

          {user && isAdmin ? (
            <div className="mt-6 space-y-3">
              <div className="flex justify-center">
                <a href="/org-users">
                  <IconRoundButton icon="userPlus" variant="gold" label={UI.BTN_USERS} tabIndex={-1} aria-hidden />
                </a>
              </div>
              <NotificationStatsPanel />
            </div>
          ) : null}

          {user ? (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <a href="/settings/notifications">
                <IconRoundButton icon="settings" variant="outline" label={UI.NOTIF_OPEN_SETTINGS} tabIndex={-1} aria-hidden />
              </a>
              <a href="/ceremonies/upcoming">
                <IconRoundButton icon="calendar" variant="outline" label={UI.NOTIF_OPEN_UPCOMING} tabIndex={-1} aria-hidden />
              </a>
            </div>
          ) : null}

          {user && !isAdmin && !isSystem ? (
            <div className="mt-6">
              <ContactInfoPanel />
            </div>
          ) : null}

          <div className="mt-8 flex justify-center">
            {user ? (
              <IconRoundButton icon="arrowLeft" variant="danger" label={UI.ACCOUNT_LOGOUT} onClick={() => logout()} />
            ) : (
              <a href="/login">
                <IconRoundButton icon="lock" variant="primary" label={UI.BTN_LOGIN} tabIndex={-1} aria-hidden />
              </a>
            )}
          </div>
        </div>
      </div>
    </OverlayPortal>
  );
}
