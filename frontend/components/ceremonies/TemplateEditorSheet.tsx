"use client";

import { useState } from "react";
import Icon from "@/components/icons/Icon";
import { UI } from "@/lib/constants/ui-strings";
import { HERITAGE_LAYOUT } from "@/lib/constants/heritage-theme";
import { inputClassName } from "@/components/ui/CollapsibleSection";
import IconRoundButton from "@/components/ui/IconRoundButton";
import BottomSheet from "@/components/ui/BottomSheet";
import CeremonyViewer from "@/components/notifications/CeremonyViewer";
import type { CeremonyTemplateVariable } from "@/lib/api/modules/ceremonies";
import type { EditTarget } from "./ceremony-template-shared";
import { useTemplateEditor } from "./useTemplateEditor";
import VariablePicker from "./VariablePicker";
import CeremonyHeritageShell from "./CeremonyHeritageShell";

type EditorTab = "edit" | "preview";

type Props = {
  target: EditTarget;
  variables: CeremonyTemplateVariable[];
  onClose: () => void;
  onSaved: () => Promise<void>;
};

function EditorTabToggle({
  tab,
  onChange,
}: {
  tab: EditorTab;
  onChange: (tab: EditorTab) => void;
}) {
  return (
    <div className="flex gap-1 rounded-full bg-white/10 p-0.5">
      {(["edit", "preview"] as const).map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            tab === key
              ? "bg-[#c5a059] text-[#4a2c2a]"
              : "text-white/85 active:bg-white/10 md:hover:bg-white/10"
          }`}
        >
          {key === "edit"
            ? UI.CEREMONY_TEMPLATE_TAB_EDIT
            : UI.CEREMONY_TEMPLATE_TAB_PREVIEW}
        </button>
      ))}
    </div>
  );
}

export default function TemplateEditorSheet({
  target,
  variables,
  onClose,
  onSaved,
}: Props) {
  const [variablesOpen, setVariablesOpen] = useState(false);
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
  } = useTemplateEditor(target, variables, onSaved, onClose);

  const title = template
    ? UI.CEREMONY_TEMPLATE_EDIT
    : UI.CEREMONY_TEMPLATE_CREATE;

  const showVariables = variables.length > 0;

  const handleInsertVariable = (key: string) => {
    insertVariable(key);
  };

  return (
    <CeremonyHeritageShell
      title={title}
      onClose={requestClose}
      headerSubtitle={
        tab === "edit" ? UI.CEREMONY_TEMPLATE_CONTENT_HINT : undefined
      }
      headerAction={
        <div className="flex items-center gap-2">
          <EditorTabToggle tab={tab} onChange={setTab} />
          <IconRoundButton
            icon="save"
            variant="gold"
            loading={saving}
            label={UI.SAVE}
            onClick={() => void handleSave()}
          />
        </div>
      }
    >
      <section className={HERITAGE_LAYOUT.editorMetaBar}>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <label className="flex min-w-[min(100%,14rem)] flex-1 items-center gap-3 text-sm">
            <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-stone-500">
              {UI.CEREMONY_TEMPLATE_NAME}
            </span>
            <input
              className={`${inputClassName} min-w-0 flex-1`}
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              autoFocus
            />
          </label>
          <label className="flex shrink-0 items-center gap-2 text-sm text-stone-700">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[#4a2c2a]"
              checked={form.isDefault}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isDefault: e.target.checked }))
              }
            />
            {UI.CEREMONY_TEMPLATE_SET_DEFAULT}
          </label>
        </div>
      </section>

      {tab === "edit" ? (
        <div className={HERITAGE_LAYOUT.editorBody}>
          <div className={HERITAGE_LAYOUT.editorMain}>
            <textarea
              ref={contentRef}
              className={`${HERITAGE_LAYOUT.editorTextarea}${showVariables ? " pb-14 lg:pb-3" : ""}`}
              value={form.content}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, content: e.target.value }))
              }
              spellCheck={false}
            />
            {unknownCount > 0 ? (
              <p className="mt-2 flex shrink-0 items-center gap-1.5 text-xs text-red-600">
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

            {showVariables ? (
              <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center px-4 lg:hidden">
                <button
                  type="button"
                  onClick={() => setVariablesOpen(true)}
                  className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-[#4a2c2a] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition active:scale-95"
                >
                  <Icon
                    path="plus"
                    size={18}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    pointer={false}
                  />
                  {UI.CEREMONY_TEMPLATE_INSERT_VARIABLE}
                </button>
              </div>
            ) : null}
          </div>

          {showVariables ? (
            <div
              className={`${HERITAGE_LAYOUT.variableSidebar} border-l`}
            >
              <VariablePicker
                variables={variables}
                onInsert={handleInsertVariable}
                variant="sidebar"
              />
            </div>
          ) : null}

          {variablesOpen ? (
            <BottomSheet
              variant="search"
              zClass="z-[60]"
              onClose={() => setVariablesOpen(false)}
            >
              <VariablePicker
                variables={variables}
                onInsert={handleInsertVariable}
                variant="sheet"
              />
            </BottomSheet>
          ) : null}
        </div>
      ) : template ? (
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <CeremonyViewer variant="heritage" templateId={template.id} />
        </div>
      ) : (
        <p className="flex flex-1 items-center justify-center px-6 py-12 text-center text-sm text-stone-500">
          {UI.CEREMONY_PREVIEW_SAVE_FIRST}
        </p>
      )}
    </CeremonyHeritageShell>
  );
}
