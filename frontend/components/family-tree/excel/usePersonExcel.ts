"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { PersonImportResult } from "@/lib/api/modules/person";
import { UI } from "@/lib/constants/ui-strings";
import { getErrorMessage } from "@/utils/errors";

const MAX_FILE_BYTES = 4 * 1024 * 1024;

export type PersonExcelBusy =
  | "download-data"
  | "download-blank"
  | "check"
  | "apply"
  | null;

type Options = {
  organizationId?: number | null;
  assertCanEdit: () => boolean;
  onApplied: () => void;
};

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Thu hồi ngay có thể làm trình duyệt lưu file dở dang (Excel báo file hỏng).
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/** Tải file Excel, kiểm tra (dry run) rồi ghi dữ liệu thành viên. */
export function usePersonExcel({ organizationId, assertCanEdit, onApplied }: Options) {
  const [busy, setBusy] = useState<PersonExcelBusy>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PersonImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const download = async (blank: boolean) => {
    if (!assertCanEdit()) return;
    setBusy(blank ? "download-blank" : "download-data");
    setError(null);
    try {
      const blob = await api.person.downloadExcel({ blank, organizationId });
      const stamp = new Date().toISOString().slice(0, 10);
      saveBlob(
        blob,
        blank ? "mau-gia-pha-coi-nguon.xlsx" : `gia-pha-coi-nguon-${stamp}.xlsx`,
      );
    } catch {
      setError(UI.EXCEL_DOWNLOAD_ERROR);
    } finally {
      setBusy(null);
    }
  };

  const check = async (picked: File) => {
    setPreview(null);
    setError(null);
    if (!picked.name.toLowerCase().endsWith(".xlsx")) {
      setError(UI.EXCEL_FILE_TYPE);
      return;
    }
    if (picked.size > MAX_FILE_BYTES) {
      setError(UI.EXCEL_FILE_TOO_LARGE);
      return;
    }
    if (!assertCanEdit()) return;
    setFile(picked);
    setBusy("check");
    try {
      setPreview(
        await api.person.importExcel(picked, { dryRun: true, organizationId }),
      );
    } catch (err) {
      setError(getErrorMessage(err, UI.EXCEL_IMPORT_ERROR));
    } finally {
      setBusy(null);
    }
  };

  const apply = async () => {
    if (!file || !assertCanEdit()) return;
    setBusy("apply");
    setError(null);
    try {
      const result = await api.person.importExcel(file, {
        dryRun: false,
        organizationId,
      });
      if (!result.applied) {
        // Dữ liệu trên cây đổi giữa lúc kiểm tra và lúc ghi: hiện lỗi mới.
        setPreview(result);
        return;
      }
      toast.success(UI.EXCEL_SUCCESS);
      onApplied();
    } catch (err) {
      setError(getErrorMessage(err, UI.EXCEL_IMPORT_ERROR));
    } finally {
      setBusy(null);
    }
  };

  return { busy, file, preview, error, download, check, apply };
}
