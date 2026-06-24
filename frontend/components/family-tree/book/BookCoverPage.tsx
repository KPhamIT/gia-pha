"use client";

import { useEffect } from "react";
import IconRoundButton from "@/components/ui/IconRoundButton";
import { UI } from "@/lib/constants/ui-strings";
import { getCalligraphyFont } from "./calligraphy-fonts";
import { loadCalligraphyFont } from "./calligraphy-font-loader";
import type { BookSettings } from "./book-settings";
import CoverVerticalField from "./CoverVerticalField";
import CoverVerticalYearField from "./CoverVerticalYearField";
import {
  formatCoverSubtitle,
  resolveCoverSubtitleClanName,
} from "./book-cover-subtitle";
import styles from "./Book.module.scss";
import { useOrgBookContext } from "@/hooks/useOrgBookContext";
import {
  resolveOrgClanAddress,
  resolveOrgEstablishedYear,
} from "@/lib/settings/default-user-settings";

type BookCoverPageProps = {
  settings: BookSettings;
  readOnly?: boolean;
  onChange?: (patch: Partial<BookSettings>) => void;
  showSavePrompt?: boolean;
  saving?: boolean;
  onSave?: () => void;
};

/** The ornate calligraphy cover (trang bìa). Title/subtitle/lineage editable inline. */
export default function BookCoverPage({
  settings,
  readOnly = false,
  onChange,
  showSavePrompt = false,
  saving = false,
  onSave,
}: BookCoverPageProps) {
  const font = getCalligraphyFont(settings.coverFontId).cssValue;
  const { context: orgContext } = useOrgBookContext();
  const establishedYear = resolveOrgEstablishedYear(orgContext);
  const clanAddress = resolveOrgClanAddress(orgContext);
  const clanName = resolveCoverSubtitleClanName(
    settings.coverSubtitle,
    orgContext,
  );
  const subtitleDisplay = formatCoverSubtitle(clanName);
  const subtitleInputSize = Math.min(24, Math.max(6, clanName.trim().length || 8));

  useEffect(() => {
    void loadCalligraphyFont(settings.coverFontId);
  }, [settings.coverFontId]);

  return (
    <div className={styles.cover} data-genealogy-paper data-genealogy-cover>
      {!readOnly && showSavePrompt ? (
        <IconRoundButton
          icon="save"
          variant="gold"
          loading={saving}
          className={styles.coverSaveButton}
          aria-label={UI.BOOK_COVER_SAVE}
          onClick={onSave}
        />
      ) : null}
      <div className={styles.coverFrame} aria-hidden />
      <span
        className={styles.coverFrameCorner}
        style={{ top: 10, left: 10, borderRight: "none", borderBottom: "none" }}
      />
      <span
        className={styles.coverFrameCorner}
        style={{ top: 10, right: 10, borderLeft: "none", borderBottom: "none" }}
      />
      <span
        className={styles.coverFrameCorner}
        style={{ bottom: 10, left: 10, borderRight: "none", borderTop: "none" }}
      />
      <span
        className={styles.coverFrameCorner}
        style={{ bottom: 10, right: 10, borderLeft: "none", borderTop: "none" }}
      />

      <CoverVerticalYearField
        value={establishedYear}
        fontFamily={font}
        readOnly
        positionClass={styles.coverVerticalTopLeft}
        ariaLabel={UI.BOOK_COVER_ESTABLISHED_YEAR_LABEL}
      />

      <CoverVerticalField
        value={clanAddress}
        fontFamily={font}
        readOnly
        variant="address"
        positionClass={styles.coverVerticalBottomRight}
        ariaLabel={UI.BOOK_COVER_CLAN_ADDRESS_PLACEHOLDER}
      />

      <div className={styles.coverInner}>
        <span className={styles.coverTopBadge}>家 譜</span>

        {readOnly ? (
          <h1 className={styles.coverTitle} style={{ fontFamily: font }}>
            {settings.coverTitle || UI.BOOK_COVER_DEFAULT_TITLE}
          </h1>
        ) : (
          <input
            className={styles.coverTitle}
            style={{ fontFamily: font }}
            value={settings.coverTitle}
            placeholder={UI.BOOK_COVER_TITLE_PLACEHOLDER}
            onChange={(e) => onChange?.({ coverTitle: e.target.value })}
            aria-label={UI.BOOK_COVER_TITLE_PLACEHOLDER}
          />
        )}

        <div className={styles.coverDivider}>❖</div>

        {readOnly ? (
          <p className={styles.coverSubtitle} style={{ fontFamily: font }}>
            {subtitleDisplay || UI.BOOK_COVER_DEFAULT_SUBTITLE}
          </p>
        ) : (
          <div
            className={styles.coverSubtitleRow}
            style={{ fontFamily: font }}
          >
            <span className={styles.coverSubtitlePrefix}>
              {UI.BOOK_COVER_SUBTITLE_PREFIX}
            </span>
            <input
              className={styles.coverSubtitleName}
              value={clanName}
              size={subtitleInputSize}
              placeholder={
                orgContext?.name?.trim() ||
                UI.BOOK_COVER_SUBTITLE_NAME_PLACEHOLDER
              }
              onChange={(e) => onChange?.({ coverSubtitle: e.target.value })}
              aria-label={UI.BOOK_COVER_SUBTITLE_NAME_PLACEHOLDER}
            />
          </div>
        )}

        <div className={styles.coverSeal} style={{ fontFamily: font }}>
          譜
        </div>

        {readOnly ? (
          <p className={styles.coverLineage}>
            {settings.coverLineage || UI.BOOK_COVER_DEFAULT_LINEAGE}
          </p>
        ) : (
          <textarea
            className={styles.coverLineage}
            value={settings.coverLineage}
            rows={2}
            placeholder={UI.BOOK_COVER_LINEAGE_PLACEHOLDER}
            onChange={(e) => onChange?.({ coverLineage: e.target.value })}
            aria-label={UI.BOOK_COVER_LINEAGE_PLACEHOLDER}
          />
        )}
      </div>
    </div>
  );
}