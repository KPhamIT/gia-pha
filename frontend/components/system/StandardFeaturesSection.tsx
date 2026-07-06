"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AC } from "@/components/auth/account-theme";
import IconRoundButton from "@/components/ui/IconRoundButton";
import { BT } from "@/lib/constants/ui-theme";
import { UI } from "@/lib/constants/ui-strings";
import {
  FEATURE_GROUPS,
  FEATURE_LABELS,
  STANDARD_FEATURE_KEYS,
  type StandardFeatureKey,
  type StandardFeatures,
} from "@/lib/auth/standard-features";
import { api } from "@/lib/api";
import { notify } from "@/lib/notify";
import { getErrorMessage } from "@/utils/errors";

type Mode = "defaults" | "org";

type StandardFeaturesSectionProps = {
  mode: Mode;
  organizationId?: number;
  variant?: "book" | "landing";
};

function featuresEqual(a: StandardFeatures, b: StandardFeatures): boolean {
  return STANDARD_FEATURE_KEYS.every((key) => a[key] === b[key]);
}

export default function StandardFeaturesSection({
  mode,
  organizationId,
  variant = "book",
}: StandardFeaturesSectionProps) {
  const isLanding = variant === "landing";
  const [baseline, setBaseline] = useState<StandardFeatures | null>(null);
  const [draft, setDraft] = useState<StandardFeatures | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    const request =
      mode === "defaults"
        ? api.standardFeatures.getDefaults()
        : organizationId == null
          ? Promise.reject(new Error(UI.SYSTEM_USER_ORG_REQUIRED))
          : api.standardFeatures
              .getOrg(organizationId)
              .then((config) => config.effective);

    return request
      .then((features) => {
        setBaseline(features);
        setDraft(features);
        setError(null);
      })
      .catch((err) => {
        setError(getErrorMessage(err, UI.ERR_FETCH_DATA));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [mode, organizationId]);

  useEffect(() => {
    void load();
  }, [load]);

  const isDirty = useMemo(() => {
    if (!baseline || !draft) return false;
    return !featuresEqual(baseline, draft);
  }, [baseline, draft]);

  const toggle = (key: StandardFeatureKey) => {
    setDraft((prev) => (prev ? { ...prev, [key]: !prev[key] } : prev));
  };

  const handleSave = async () => {
    if (!draft || !isDirty) return;
    setSaving(true);
    setError(null);
    try {
      if (mode === "defaults") {
        const saved = await api.standardFeatures.updateDefaults(draft);
        setBaseline(saved);
        setDraft(saved);
      } else if (organizationId != null) {
        const config = await api.standardFeatures.updateOrg(
          organizationId,
          draft,
        );
        setBaseline(config.effective);
        setDraft(config.effective);
      }
      notify.success(UI.TOAST_FEATURES_SAVED);
    } catch (err) {
      const message = getErrorMessage(err, UI.ERR_FETCH_DATA);
      setError(message);
      notify.error(err, UI.ERR_FETCH_DATA);
    } finally {
      setSaving(false);
    }
  };

  const loadingClass = isLanding ? AC.muted : BT.mutedOnDark;
  const errorClass = isLanding
    ? "rounded-lg bg-[#ffdad6] px-3 py-2 text-sm text-[#93000a]"
    : BT.errorBg;
  const cardClass = isLanding ? AC.card : BT.card;

  if (loading) return <p className={`text-sm ${loadingClass}`}>{UI.LOADING}</p>;
  if (error && !draft) return <p className={errorClass}>{error}</p>;
  if (!draft) return null;

  return (
    <div className="space-y-4">
      <p className={`text-sm ${loadingClass}`}>
        {mode === "defaults" ? UI.FEATURES_DEFAULTS_HINT : UI.FEATURES_ORG_HINT}
      </p>

      {FEATURE_GROUPS.map((group) => (
        <section key={group.title} className={`${cardClass} p-4 md:p-5`}>
          <h3
            className={`mb-3 text-sm font-semibold ${
              isLanding ? "font-serif text-lg text-[#321716]" : "text-amber-950"
            }`}
          >
            {group.title}
          </h3>
          <ul className="space-y-2">
            {group.keys.map((key) => (
              <li key={key}>
                <label
                  className={`flex cursor-pointer items-center justify-between gap-3 text-sm ${
                    isLanding ? AC.muted : BT.mutedOnLight
                  }`}
                >
                  <span className={isLanding ? "text-[#321716]" : "text-neutral-800"}>
                    {FEATURE_LABELS[key]}
                  </span>
                  <input
                    type="checkbox"
                    className={`h-4 w-4 ${isLanding ? "accent-[#944a00]" : "accent-amber-600"}`}
                    checked={draft[key]}
                    onChange={() => toggle(key)}
                  />
                </label>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {error ? <p className={errorClass}>{error}</p> : null}

      <div className="flex justify-end">
        {isLanding ? (
          <button
            type="button"
            disabled={!isDirty || saving}
            onClick={() => void handleSave()}
            className="rounded-xl bg-[#944a00] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {UI.SAVE}
          </button>
        ) : (
          <IconRoundButton
            icon="save"
            variant="gold"
            label={UI.SAVE}
            disabled={!isDirty}
            loading={saving}
            onClick={() => void handleSave()}
          />
        )}
      </div>
    </div>
  );
}
