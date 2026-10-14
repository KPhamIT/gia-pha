"use client";

import { useEffect, useMemo, useState } from "react";
import { AC } from "@/components/auth/account-theme";
import { loadCalligraphyFont } from "@/components/family-tree/book/calligraphy-font-loader";
import { DEFAULT_CALLIGRAPHY_FONT_ID, getCalligraphyFont } from "@/components/family-tree/book/calligraphy-fonts";
import type { CoverClanInfo } from "@/components/shop/cover-samples";
import SystemSubpageShell from "@/components/system/SystemSubpageShell";
import { UI } from "@/lib/constants/ui-strings";
import { notify } from "@/lib/notify";
import GiaPhaBookPanel from "./GiaPhaBookPanel";
import { cleanClanName } from "./print-helpers";
import VanKhanBookPanel from "./VanKhanBookPanel";

type Tab = "giaPha" | "vanKhan";

/** /system/in-sach — in sổ gia phả trống và sách văn khấn cho khách đặt mua. */
export default function SystemPrintBooksPageView() {
  const [tab, setTab] = useState<Tab>("giaPha");
  const [clanName, setClanName] = useState("");
  const [establishedYear, setEstablishedYear] = useState("");
  const [clanAddress, setClanAddress] = useState("");
  const fontId = DEFAULT_CALLIGRAPHY_FONT_ID;
  const fontFamily = getCalligraphyFont(fontId).cssValue;

  useEffect(() => {
    void loadCalligraphyFont(fontId);
  }, [fontId]);

  const clan: CoverClanInfo = useMemo(
    () => ({ clanName: cleanClanName(clanName), establishedYear: establishedYear.trim(), clanAddress: clanAddress.trim() }),
    [clanName, establishedYear, clanAddress],
  );
  const onMissingClan = () => {
    notify.error(null, UI.PRINT_BOOKS_CLAN_REQUIRED);
    document.getElementById("print-books-clan")?.focus();
  };

  const tabClass = (t: Tab) =>
    `rounded-full px-5 py-2 text-sm font-semibold transition ${
      tab === t ? "bg-[#321716] text-white" : "bg-white text-[#321716] ring-1 ring-[#d4c3c1] hover:bg-[#f6f3ee]"
    }`;

  return (
    <SystemSubpageShell layoutTitle={UI.PRINT_BOOKS_OPEN} title={UI.PRINT_BOOKS_TITLE} subtitle={UI.PRINT_BOOKS_SUBTITLE}>
      <div className="space-y-6 px-4 md:px-0">
        <section className={`${AC.card} p-5`}>
          <h2 className={AC.sectionTitle}>{UI.PRINT_BOOKS_CLAN_SECTION}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-[2fr_1fr_2fr]">
            <label className="block">
              <span className={`text-sm font-medium ${AC.muted}`}>{UI.PRINT_BOOKS_CLAN_NAME}</span>
              <input
                id="print-books-clan"
                value={clanName}
                onChange={(e) => setClanName(e.target.value)}
                placeholder={UI.PRINT_BOOKS_CLAN_NAME_PLACEHOLDER}
                className={`${AC.input} mt-1`}
              />
              <span className={`mt-1 block text-xs ${AC.label}`}>{UI.PRINT_BOOKS_CLAN_NAME_HINT}</span>
            </label>
            <label className="block">
              <span className={`text-sm font-medium ${AC.muted}`}>{UI.PRINT_BOOKS_CLAN_YEAR}</span>
              <input value={establishedYear} onChange={(e) => setEstablishedYear(e.target.value)} inputMode="numeric" className={`${AC.input} mt-1`} />
            </label>
            <label className="block">
              <span className={`text-sm font-medium ${AC.muted}`}>{UI.PRINT_BOOKS_CLAN_ADDRESS}</span>
              <input value={clanAddress} onChange={(e) => setClanAddress(e.target.value)} className={`${AC.input} mt-1`} />
            </label>
          </div>
        </section>

        <div className="flex gap-2" role="tablist">
          <button type="button" role="tab" aria-selected={tab === "giaPha"} onClick={() => setTab("giaPha")} className={tabClass("giaPha")}>
            {UI.PRINT_BOOKS_TAB_GIA_PHA}
          </button>
          <button type="button" role="tab" aria-selected={tab === "vanKhan"} onClick={() => setTab("vanKhan")} className={tabClass("vanKhan")}>
            {UI.PRINT_BOOKS_TAB_VAN_KHAN}
          </button>
        </div>

        {tab === "giaPha" ? (
          <GiaPhaBookPanel clan={clan} fontFamily={fontFamily} fontId={fontId} onMissingClan={onMissingClan} />
        ) : (
          <VanKhanBookPanel clan={clan} fontFamily={fontFamily} fontId={fontId} onMissingClan={onMissingClan} />
        )}
      </div>
    </SystemSubpageShell>
  );
}
