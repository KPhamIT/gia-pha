import { api } from '@/lib/api';
import { UI } from '@/lib/constants/ui-strings';

export function buildCeremonySharePath(token: string): string {
  return `/ceremonies/share/${encodeURIComponent(token)}`;
}

export async function buildCeremonyShareUrl(personId: number): Promise<string> {
  const { token } = await api.ceremonies.getShareToken(personId);
  const path = buildCeremonySharePath(token);
  if (typeof window === 'undefined') return path;
  return `${window.location.origin}${path}`;
}

export type ShareCeremonyResult = 'shared' | 'copied' | 'cancelled' | 'failed';

/** Native share sheet on mobile; copy chỉ URL trên desktop fallback. */
export async function shareCeremonyLink(
  fullName: string,
  personId: number,
  urlOverride?: string,
): Promise<ShareCeremonyResult> {
  let url = urlOverride;
  if (!url) {
    try {
      url = await buildCeremonyShareUrl(personId);
    } catch {
      return 'failed';
    }
  }

  const text = UI.CEREMONY_SHARE_MESSAGE(fullName);

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({ title: UI.CEREMONY_TITLE, text, url });
      return 'shared';
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return 'cancelled';
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      return 'copied';
    } catch {
      return 'failed';
    }
  }

  return 'failed';
}
