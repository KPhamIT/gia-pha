"use client";

import { useEffect, useMemo, useState } from "react";
import { AC } from "@/components/auth/account-theme";
import { A4_RATIO, COVER_SAMPLES, ScaledCover, buildCoverContent, type CoverClanInfo } from "@/components/shop/cover-samples";
import { api } from "@/lib/api";
import type { PrintBookTemplate } from "@/lib/api/modules/ceremonies";
import { UI } from "@/lib/constants/ui-strings";
import { notify } from "@/lib/notify";
import CoverPicker from "./CoverPicker";
import CoverPrintSheets from "./CoverPrintSheets";
import PrayerLibrary from "./PrayerLibrary";
import PreviewGallery from "./PreviewGallery";
import { defaultSelection, moveItem } from "./prayer-templates";
import SelectedPrayerList from "./SelectedPrayerList";
import { COVER_BLEED_MM, useCoverPrint } from "./useCoverPrint";
import { usePrayerBookPrint } from "./usePrayerBookPrint";

const COVER_PREVIEW_W = 152;

type Props = { clan: CoverClanInfo; fontFamily: string; fontId: string; onMissingClan: () => void };

/** Sách văn khấn: chọn bìa, chọn bài (hệ thống / của người dùng), sắp thứ tự, in bìa và ruột. */
export default function VanKhanBookPanel({ clan, fontFamily, fontId, onMissingClan }: Props) {
  const [templates, setTemplates] = useState<PrintBookTemplate[] | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const cover = useCoverPrint(fontId);
  const inner = usePrayerBookPrint();

  useEffect(() => {
    let cancelled = false;
    api.ceremonies
      .listPrintBookTemplates()
      .then((all) => {
        if (cancelled) return;
        setTemplates(all);
        setSelected(defaultSelection(all));
      })
      .catch((err) => notify.error(err, UI.PRINT_BOOKS_LOAD_ERR));
    return () => {
      cancelled = true;
    };
  }, []);

  const byId = useMemo(() => new Map((templates ?? []).map((t) => [t.id, t])), [templates]);
  const sample = COVER_SAMPLES[coverIndex];
  const content = useMemo(() => buildCoverContent("vanKhan", clan), [clan]);

  const add = (ids: number[]) => setSelected((cur) => [...cur, ...ids.filter((id) => !cur.includes(id))]);
  const remove = (id: number) => setSelected((cur) => cur.filter((x) => x !== id));
  const printCover = () => (clan.clanName ? void cover.print() : onMissingClan());
  const printInner = () => {
    if (!clan.clanName) return onMissingClan();
    if (!selected.length) return notify.error(null, UI.PRINT_BOOKS_NO_PRAYERS);
    void inner.print(selected, clan.clanName);
  };

  return (
    <div className="space-y-6">
      <section className={`${AC.card} grid gap-5 p-5 lg:grid-cols-[1fr_auto]`}>
        <div>
          <h3 className={AC.sectionTitle}>{UI.PRINT_BOOKS_COVER}</h3>
          <div className="mt-4">
            <CoverPicker variant="vanKhan" content={content} fontFamily={fontFamily} value={coverIndex} onChange={setCoverIndex} />
          </div>
        </div>
        <PreviewGallery
          width={COVER_PREVIEW_W}
          className="flex gap-4"
          items={(["front", "back"] as const).map((side) => ({
            key: side,
            label: side === "front" ? UI.SHOP_COVER_FRONT : UI.SHOP_COVER_BACK,
            ratio: A4_RATIO,
            thick: true,
            renderFront: (w: number) => (
              <ScaledCover {...sample} side={side} width={w} variant="vanKhan" fontFamily={fontFamily} content={content} />
            ),
          }))}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <SelectedPrayerList
          selected={selected}
          byId={byId}
          onMove={(from, to) => setSelected((cur) => moveItem(cur, from, to))}
          onRemove={remove}
          onReset={() => templates && setSelected(defaultSelection(templates))}
          onClear={() => setSelected([])}
        />
        <PrayerLibrary templates={templates} selected={selected} onAdd={add} onRemove={remove} />
      </div>

      <section className={`${AC.card} space-y-3 p-5`}>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={printCover} className="rounded-xl bg-[#944a00] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#7a3d00]">
            {UI.PRINT_BOOKS_PRINT_COVER}
          </button>
          <button
            type="button"
            onClick={printInner}
            disabled={inner.preparing}
            className="rounded-xl bg-[#321716] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#4a2c2a] disabled:opacity-60"
          >
            {inner.preparing ? UI.PRINT_BOOKS_PREPARING : UI.PRINT_BOOKS_PRINT_INNER}
          </button>
        </div>
        <p className={`text-xs ${AC.label}`}>{UI.PRINT_BOOKS_PRINT_HINT}</p>
      </section>

      {cover.printing ? <CoverPrintSheets sample={sample} content={content} fontFamily={fontFamily} bleedMm={COVER_BLEED_MM} /> : null}
    </div>
  );
}
