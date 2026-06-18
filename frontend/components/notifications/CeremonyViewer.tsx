'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { notify } from '@/lib/notify';
import { UI } from '@/lib/constants/ui-strings';
import { BT } from '@/lib/constants/ui-theme';
import IconRoundButton from '@/components/ui/IconRoundButton';

type CeremonyViewerProps = {
  personId: number;
};

function measureIframeContent(iframe: HTMLIFrameElement | null): number {
  const doc = iframe?.contentDocument;
  if (!doc) return 0;
  return Math.max(doc.body?.scrollHeight ?? 0, doc.documentElement?.scrollHeight ?? 0);
}

export default function CeremonyViewer({ personId }: CeremonyViewerProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [contentHeight, setContentHeight] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const syncIframeHeight = useCallback(() => {
    setContentHeight(measureIframeContent(iframeRef.current));
  }, []);

  useEffect(() => {
    setLoading(true);
    api.ceremonies
      .getHtml(personId)
      .then((res) => {
        setHtml(res.html);
        setFullName(res.fullName);
      })
      .catch((err) => notify.error(err, UI.CEREMONY_ERR))
      .finally(() => setLoading(false));
  }, [personId]);

  useEffect(() => {
    if (!html) return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => syncIframeHeight();
    iframe.addEventListener('load', handleLoad);
    return () => iframe.removeEventListener('load', handleLoad);
  }, [html, syncIframeHeight]);

  const handlePrint = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    doc.defaultView?.focus();
    doc.defaultView?.print();
  }, []);

  if (loading) {
    return <p className={`text-sm ${BT.mutedOnDark}`}>{UI.CEREMONY_LOADING}</p>;
  }

  if (!html) {
    return <p className={`text-sm ${BT.mutedOnDark}`}>{UI.CEREMONY_ERR}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <IconRoundButton icon="print" variant="gold" label={UI.CEREMONY_PRINT} onClick={handlePrint} />
      </div>

      <iframe
        ref={iframeRef}
        title={UI.CEREMONY_TITLE}
        srcDoc={html}
        className="block w-full overflow-hidden rounded-xl border border-amber-200/30 bg-white shadow-inner"
        style={{ height: contentHeight > 0 ? contentHeight : undefined, minHeight: contentHeight > 0 ? undefined : '12rem' }}
        sandbox="allow-same-origin allow-modals"
      />

      <p className={`text-xs ${BT.mutedOnDark}`}>{fullName}</p>
    </div>
  );
}
