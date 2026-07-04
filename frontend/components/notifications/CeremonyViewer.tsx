"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { notify } from "@/lib/notify";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import IconRoundButton from "@/components/ui/IconRoundButton";
import CeremonyHeritageActionBar from "@/components/ceremonies/CeremonyHeritageActionBar";
import CeremonyFontSizeControls from "@/components/ceremonies/CeremonyFontSizeControls";
import ShareCeremonyActions from "@/components/ceremonies/ShareCeremonyActions";
import { HERITAGE_LAYOUT } from "@/lib/constants/heritage-theme";
import { applyCeremonyFontScale } from "@/lib/ceremony/apply-ceremony-font-scale";
import { useCeremonyFontSize } from "@/hooks/useCeremonyFontSize";
import { useScrollIdleReveal } from "@/hooks/useScrollIdleReveal";

type CeremonyViewerProps = {
  personId?: number;
  shareToken?: string;
  templateId?: number;
  variant?: "legacy" | "heritage";
};

function measureIframeContent(iframe: HTMLIFrameElement | null): number {
  const doc = iframe?.contentDocument;
  if (!doc) return 0;
  return Math.max(
    doc.body?.scrollHeight ?? 0,
    doc.documentElement?.scrollHeight ?? 0,
  );
}

function resolveCeremonyRequest(
  personId: number | undefined,
  shareToken: string | undefined,
  templateId: number | undefined,
) {
  if (shareToken != null) return api.ceremonies.getPublicHtml(shareToken);
  if (personId != null) return api.ceremonies.getHtml(personId, templateId);
  if (templateId != null) return api.ceremonies.getTemplatePreviewHtml(templateId);
  return Promise.reject(new Error("Missing ceremony source"));
}

export default function CeremonyViewer({
  personId,
  shareToken,
  templateId,
  variant = "legacy",
}: CeremonyViewerProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [contentHeight, setContentHeight] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hasPerson = personId != null || shareToken != null;
  const fontSize = useCeremonyFontSize();
  const isHeritage = variant === "heritage";
  const { scrollRef, visible: barVisible, handleScroll } =
    useScrollIdleReveal();

  const syncIframeHeight = useCallback(() => {
    setContentHeight(measureIframeContent(iframeRef.current));
  }, []);

  const applyFontAndMeasure = useCallback(() => {
    applyCeremonyFontScale(iframeRef.current, fontSize.scale);
    syncIframeHeight();
  }, [fontSize.scale, syncIframeHeight]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setHtml(null);
    setFullName("");

    resolveCeremonyRequest(personId, shareToken, templateId)
      .then((res) => {
        if (cancelled) return;
        setHtml(res.html);
        setFullName(res.fullName);
      })
      .catch((err) => {
        if (!cancelled) notify.error(err, UI.CEREMONY_ERR);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [personId, shareToken, templateId]);

  useEffect(() => {
    if (!html) return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => applyFontAndMeasure();
    iframe.addEventListener("load", handleLoad);
    return () => iframe.removeEventListener("load", handleLoad);
  }, [html, applyFontAndMeasure]);

  useEffect(() => {
    if (!html) return;
    applyFontAndMeasure();
  }, [html, fontSize.scale, applyFontAndMeasure]);

  const handlePrint = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    doc.defaultView?.focus();
    doc.defaultView?.print();
  }, []);

  const shareUrl =
    typeof window !== "undefined" && shareToken
      ? `${window.location.origin}/ceremonies/share/${encodeURIComponent(shareToken)}`
      : undefined;

  const loadingClass = isHeritage ? "text-stone-500" : BT.mutedOnDark;

  if (loading) {
    return <p className={`text-sm ${loadingClass}`}>{UI.CEREMONY_LOADING}</p>;
  }

  if (!html) {
    return <p className={`text-sm ${loadingClass}`}>{UI.CEREMONY_ERR}</p>;
  }

  const iframeEl = (
    <iframe
      ref={iframeRef}
      title={UI.CEREMONY_TITLE}
      srcDoc={html}
      className={
        isHeritage
          ? "block w-full overflow-hidden bg-transparent"
          : "block w-full overflow-hidden rounded-xl border border-amber-200/30 bg-white shadow-inner"
      }
      style={{
        height: contentHeight > 0 ? contentHeight : undefined,
        minHeight: contentHeight > 0 ? undefined : "12rem",
      }}
      sandbox="allow-same-origin allow-modals"
    />
  );

  if (isHeritage) {
    return (
      <div className={HERITAGE_LAYOUT.viewerRoot}>
        <article
          ref={scrollRef}
          onScroll={handleScroll}
          className={HERITAGE_LAYOUT.scrollBody}
          data-purpose="prayer-body"
        >
          <div className={HERITAGE_LAYOUT.prayerContent}>{iframeEl}</div>
        </article>
        <div className={HERITAGE_LAYOUT.floatingBar}>
          <div
            className={`${HERITAGE_LAYOUT.floatingBarInner} ${
              barVisible
                ? HERITAGE_LAYOUT.floatingBarInnerVisible
                : HERITAGE_LAYOUT.floatingBarInnerHidden
            }`}
          >
            <CeremonyHeritageActionBar
              scaleLabel={fontSize.scaleLabel}
              canDecrease={fontSize.canDecrease}
              canIncrease={fontSize.canIncrease}
              onDecrease={fontSize.decrease}
              onIncrease={fontSize.increase}
              sharePersonId={personId}
              shareFullName={fullName}
              shareUrl={shareUrl}
              showShare={hasPerson}
              onPrint={handlePrint}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <CeremonyFontSizeControls
          scaleLabel={fontSize.scaleLabel}
          canDecrease={fontSize.canDecrease}
          canIncrease={fontSize.canIncrease}
          onDecrease={fontSize.decrease}
          onIncrease={fontSize.increase}
        />
        {hasPerson ? (
          <ShareCeremonyActions
            personId={personId}
            fullName={fullName}
            shareUrl={shareUrl}
          />
        ) : null}
        <IconRoundButton
          icon="print"
          variant="gold"
          label={UI.CEREMONY_PRINT}
          onClick={handlePrint}
        />
      </div>
      {hasPerson ? (
        <p className={`text-xs leading-relaxed ${BT.mutedOnDark}`}>
          {UI.CEREMONY_SHARE_HINT}
        </p>
      ) : null}
      {iframeEl}
      {fullName ? (
        <p className={`text-xs ${BT.mutedOnDark}`}>{fullName}</p>
      ) : null}
    </div>
  );
}
