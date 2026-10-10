"use client";

import { useRef } from "react";
import FullScreenSheet from "@/components/ui/FullScreenSheet";
import IconRoundButton from "@/components/ui/IconRoundButton";
import LoadingSpinner from "@/components/icons/LoadingSpinner";
import { LAYOUT } from "@/lib/constants/ui-layout";
import { BT } from "@/lib/constants/ui-theme";
import { UI } from "@/lib/constants/ui-strings";
import PersonExcelPreview from "./PersonExcelPreview";
import { usePersonExcel } from "./usePersonExcel";

type PersonExcelSheetProps = {
  organizationId?: number | null;
  onClose: () => void;
  /** Kiểm tra quyền `editTree` trước khi gọi API. */
  assertCanEdit: () => boolean;
  /** Gọi sau khi đã ghi dữ liệu để tải lại cây. */
  onImported: () => void;
};

/** Tải file Excel mẫu / dữ liệu hiện tại và nhập lại để tạo, cập nhật thành viên. */
export default function PersonExcelSheet({
  organizationId,
  onClose,
  assertCanEdit,
  onImported,
}: PersonExcelSheetProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const excel = usePersonExcel({
    organizationId,
    assertCanEdit,
    onApplied: () => {
      onImported();
      onClose();
    },
  });
  const { busy, file, preview, error } = excel;

  return (
    <FullScreenSheet title={UI.EXCEL_TITLE} onClose={onClose}>
      <div className={`space-y-4 ${LAYOUT.pagePad} md:mx-auto md:max-w-2xl`}>
        <section className={`${BT.card} space-y-3 p-4`}>
          <h3 className="font-semibold">{UI.EXCEL_STEP_DOWNLOAD}</h3>
          <p className={`text-sm ${BT.mutedOnLight}`}>
            {UI.EXCEL_STEP_DOWNLOAD_HINT}
          </p>
          <div className="flex flex-wrap gap-2">
            <IconRoundButton
              icon="download"
              variant="primary"
              label={UI.EXCEL_DOWNLOAD_DATA}
              loading={busy === "download-data"}
              disabled={busy != null}
              onClick={() => void excel.download(false)}
            />
            <IconRoundButton
              icon="download"
              variant="outline"
              label={UI.EXCEL_DOWNLOAD_BLANK}
              loading={busy === "download-blank"}
              disabled={busy != null}
              onClick={() => void excel.download(true)}
            />
          </div>
        </section>

        <section className={`${BT.card} space-y-3 p-4`}>
          <h3 className="font-semibold">{UI.EXCEL_STEP_UPLOAD}</h3>
          <p className={`text-sm ${BT.mutedOnLight}`}>
            {UI.EXCEL_STEP_UPLOAD_HINT}
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className="hidden"
            onChange={(event) => {
              const picked = event.target.files?.[0];
              event.target.value = "";
              if (picked) void excel.check(picked);
            }}
          />
          <div className="flex flex-wrap items-center gap-2">
            <IconRoundButton
              icon="list"
              variant="outline"
              label={file ? UI.EXCEL_CHOOSE_OTHER : UI.EXCEL_CHOOSE_FILE}
              disabled={busy != null}
              onClick={() => inputRef.current?.click()}
            />
            {file ? (
              <span className={`min-w-0 truncate text-sm ${BT.mutedOnLight}`}>
                {file.name}
              </span>
            ) : null}
          </div>

          {busy === "check" || busy === "apply" ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner
                size={32}
                label={busy === "check" ? UI.EXCEL_CHECKING : UI.EXCEL_APPLYING}
              />
            </div>
          ) : null}

          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </p>
          ) : null}

          {preview && busy == null ? (
            <PersonExcelPreview
              preview={preview}
              onConfirm={() => void excel.apply()}
            />
          ) : null}
        </section>
      </div>
    </FullScreenSheet>
  );
}
