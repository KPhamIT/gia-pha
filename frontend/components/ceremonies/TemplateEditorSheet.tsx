"use client";

import Icon from "@/components/icons/Icon";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import IconRoundButton from "@/components/ui/IconRoundButton";
import AutoGrowTextarea from "@/components/ui/AutoGrowTextarea";
import FullScreenSheet from "@/components/ui/FullScreenSheet";
import { inputClassName } from "@/components/ui/CollapsibleSection";
import type { CeremonyTemplateVariable } from "@/lib/api/modules/ceremonies";
import type {
  Person,
  Relationship,
} from "@/components/types/family-tree-types";
import type { EditTarget } from "./ceremony-template-shared";
import { useTemplateEditor } from "./useTemplateEditor";
import VariablePicker from "./VariablePicker";
import CeremonyPrintView from "./CeremonyPrintView";

type Props = {
  target: EditTarget;
  variables: CeremonyTemplateVariable[];
  persons: Person[];
  relationships: Relationship[];
  onClose: () => void;
  onSaved: () => Promise<void>;
  demo?: boolean;
};

export default function TemplateEditorSheet({
  target,
  variables,
  persons,
  relationships,
  onClose,
  onSaved,
  demo = false,
}: Props) {
  const {
    template,
    form,
    setForm,
    saving,
    tab,
    setTab,
    contentRef,
    unknownCount,
    insertVariable,
    handleSave,
    requestClose,
  } = useTemplateEditor(target, variables, onSaved, onClose, demo);

  return (
    <FullScreenSheet
      tone="book"
      title={template ? UI.CEREMONY_TEMPLATE_EDIT : UI.CEREMONY_TEMPLATE_CREATE}
      onClose={requestClose}
      headerRight={
        <IconRoundButton
          icon="save"
          variant="gold"
          loading={saving}
          label={UI.SAVE}
          onClick={() => void handleSave()}
        />
      }
    >
      <div className="mx-auto w-full max-w-4xl p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="min-w-0 flex-1 space-y-4">
            <label className="block text-sm">
              <span className={BT.mutedOnDark}>
                {UI.CEREMONY_TEMPLATE_NAME}
              </span>
              <input
                className={`${inputClassName} mt-1`}
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                autoFocus
              />
            </label>

            <div className="text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={BT.mutedOnDark}>
                  {UI.CEREMONY_TEMPLATE_CONTENT}
                </span>
                <div className="flex gap-1 rounded-full bg-white/10 p-0.5">
                  {(["edit", "preview"] as const).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTab(key)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        tab === key
                          ? "bg-amber-100 text-amber-950"
                          : "text-amber-100/80 active:bg-white/10"
                      }`}
                    >
                      {key === "edit"
                        ? UI.CEREMONY_TEMPLATE_TAB_EDIT
                        : UI.CEREMONY_TEMPLATE_TAB_PREVIEW}
                    </button>
                  ))}
                </div>
              </div>

              {tab === "edit" ? (
                <>
                  <p className={`mt-1 text-xs ${BT.mutedOnDark}`}>
                    {UI.CEREMONY_TEMPLATE_CONTENT_HINT}
                  </p>
                  <AutoGrowTextarea
                    ref={contentRef}
                    className={`${inputClassName} mt-2 min-h-[40vh] font-mono text-xs leading-relaxed`}
                    value={form.content}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, content: e.target.value }))
                    }
                  />
                  {unknownCount > 0 ? (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-red-300">
                      <Icon
                        path="alertTriangle"
                        size={14}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        pointer={false}
                      />
                      {UI.CEREMONY_TEMPLATE_UNKNOWN_COUNT.replace(
                        "{count}",
                        String(unknownCount),
                      )}
                    </p>
                  ) : null}
                </>
              ) : template ? (
                <div className="mt-2 space-y-2">
                  <p className={`text-xs ${BT.mutedOnDark}`}>
                    {UI.CEREMONY_PREVIEW_USES_SAVED}
                  </p>
                  <CeremonyPrintView
                    templateId={template.id}
                    persons={persons}
                    relationships={relationships}
                  />
                </div>
              ) : (
                <p className={`mt-2 text-sm ${BT.mutedOnDark}`}>
                  {UI.CEREMONY_PREVIEW_SAVE_FIRST}
                </p>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm text-amber-50">
              <input
                type="checkbox"
                className="h-4 w-4 accent-amber-600"
                checked={form.isDefault}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, isDefault: e.target.checked }))
                }
              />
              {UI.CEREMONY_TEMPLATE_SET_DEFAULT}
            </label>
          </div>

          {tab === "edit" ? (
            <VariablePicker variables={variables} onInsert={insertVariable} />
          ) : null}
        </div>
      </div>
    </FullScreenSheet>
  );
}
