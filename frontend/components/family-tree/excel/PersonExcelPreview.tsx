"use client";

import IconRoundButton from "@/components/ui/IconRoundButton";
import type {
  PersonImportIssue,
  PersonImportResult,
} from "@/lib/api/modules/person";
import { BT } from "@/lib/constants/ui-theme";
import { UI } from "@/lib/constants/ui-strings";

function IssueList({
  issues,
  total,
  tone,
}: {
  issues: PersonImportIssue[];
  total: number;
  tone: "error" | "warning";
}) {
  const color =
    tone === "error"
      ? "border-red-200 bg-red-50 text-red-800"
      : "border-amber-200 bg-amber-50 text-amber-900";
  return (
    <div className={`rounded-xl border p-3 text-sm ${color}`}>
      <p className="mb-2 font-semibold">
        {tone === "error"
          ? UI.EXCEL_ERRORS_TITLE(total)
          : UI.EXCEL_WARNINGS_TITLE(total)}
      </p>
      <ul className="max-h-64 space-y-1 overflow-y-auto">
        {issues.map((issue, i) => (
          <li key={`${issue.row}-${i}`}>
            <span className="font-medium">{UI.EXCEL_ISSUE_ROW(issue.row)}:</span>{" "}
            {issue.message}
          </li>
        ))}
      </ul>
      {issues.length < total ? (
        <p className="mt-2 text-xs opacity-80">
          {UI.EXCEL_ISSUES_TRUNCATED(issues.length, total)}
        </p>
      ) : null}
    </div>
  );
}

type PersonExcelPreviewProps = {
  preview: PersonImportResult;
  onConfirm: () => void;
};

/** Kết quả kiểm tra file (dry run): số người thêm/sửa, lỗi, lưu ý. */
export default function PersonExcelPreview({
  preview,
  onConfirm,
}: PersonExcelPreviewProps) {
  const { summary } = preview;
  const hasErrors = preview.errorCount > 0;
  const hasChanges =
    summary.create + summary.update + summary.parentLinks + summary.spouseLinks >
    0;

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold">{UI.EXCEL_PREVIEW_TITLE}</h4>
      <ul className="grid gap-1 text-sm sm:grid-cols-2">
        <li>{UI.EXCEL_SUMMARY_ROWS(summary.totalRows)}</li>
        <li>{UI.EXCEL_SUMMARY_CREATE(summary.create)}</li>
        <li>{UI.EXCEL_SUMMARY_UPDATE(summary.update)}</li>
        <li>{UI.EXCEL_SUMMARY_UNCHANGED(summary.unchanged)}</li>
        <li>
          {UI.EXCEL_SUMMARY_PARENTS(summary.parentLinks, summary.parentReplaced)}
        </li>
        <li>{UI.EXCEL_SUMMARY_SPOUSES(summary.spouseLinks)}</li>
      </ul>

      {hasErrors ? (
        <>
          <IssueList
            issues={preview.errors}
            total={preview.errorCount}
            tone="error"
          />
          <p className={`text-sm ${BT.mutedOnLight}`}>{UI.EXCEL_FIX_AND_RETRY}</p>
        </>
      ) : null}

      {preview.warningCount > 0 ? (
        <IssueList
          issues={preview.warnings}
          total={preview.warningCount}
          tone="warning"
        />
      ) : null}

      {!hasErrors && !hasChanges ? (
        <p className={`text-sm ${BT.mutedOnLight}`}>{UI.EXCEL_NOTHING_TO_DO}</p>
      ) : null}

      {!hasErrors && hasChanges ? (
        <IconRoundButton
          icon="check"
          variant="primary"
          label={UI.EXCEL_CONFIRM}
          onClick={onConfirm}
        />
      ) : null}
    </div>
  );
}
