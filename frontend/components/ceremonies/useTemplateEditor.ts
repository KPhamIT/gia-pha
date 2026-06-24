"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/lib/api";
import { notify } from "@/lib/notify";
import { UI } from "@/lib/constants/ui-strings";
import type { CeremonyTemplateVariable } from "@/lib/api/modules/ceremonies";
import {
  TOKEN_RE,
  type EditTarget,
  type FormState,
} from "./ceremony-template-shared";

export function useTemplateEditor(
  target: EditTarget,
  variables: CeremonyTemplateVariable[],
  onSaved: () => Promise<void>,
  onClose: () => void,
  demo = false,
) {
  const { template, initial } = target;
  const [form, setForm] = useState<FormState>(initial);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const knownKeys = useMemo(
    () => new Set(variables.map((v) => v.key)),
    [variables],
  );
  const unknownCount = useMemo(() => {
    let n = 0;
    for (const m of form.content.matchAll(TOKEN_RE)) {
      const key = m[1] ?? m[2];
      if (key && !knownKeys.has(key)) n += 1;
    }
    return n;
  }, [form.content, knownKeys]);

  const dirty =
    form.name !== initial.name ||
    form.content !== initial.content ||
    form.isDefault !== initial.isDefault;

  const insertVariable = useCallback((key: string) => {
    const token = `{{${key}}}`;
    const el = contentRef.current;
    setTab("edit");
    setForm((prev) => {
      if (!el) return { ...prev, content: prev.content + token };
      const start = el.selectionStart ?? prev.content.length;
      const end = el.selectionEnd ?? prev.content.length;
      const next =
        prev.content.slice(0, start) + token + prev.content.slice(end);
      requestAnimationFrame(() => {
        el.focus();
        const caret = start + token.length;
        el.setSelectionRange(caret, caret);
      });
      return { ...prev, content: next };
    });
  }, []);

  const handleSave = useCallback(async () => {
    if (!form.name.trim() || !form.content.trim()) {
      notify.error(null, UI.CEREMONY_TEMPLATE_REQUIRED);
      return;
    }
    setSaving(true);
    try {
      if (demo) {
        notify.success(UI.CEREMONY_TEMPLATE_DEMO_SAVED);
        onClose();
        return;
      }
      if (template) {
        await api.ceremonies.updateTemplate(template.id, form);
        notify.success(UI.CEREMONY_TEMPLATE_UPDATED);
      } else {
        await api.ceremonies.createTemplate(form);
        notify.success(UI.CEREMONY_TEMPLATE_CREATED);
      }
      await onSaved();
    } catch (err) {
      notify.error(err, UI.CEREMONY_TEMPLATE_ERR_SAVE);
    } finally {
      setSaving(false);
    }
  }, [demo, form, template, onSaved, onClose]);

  const requestClose = useCallback(() => {
    if (dirty && !window.confirm(UI.CEREMONY_TEMPLATE_UNSAVED_CONFIRM)) return;
    onClose();
  }, [dirty, onClose]);

  // Ctrl/Cmd+S saves without leaving the editor.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void handleSave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSave]);

  return {
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
  };
}
