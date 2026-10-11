"use client";

import { useMemo, useState } from "react";
import {
  KIN_STEP_GENDER,
  computeKinship,
  type Gender,
  type KinStep,
  type Region,
} from "@/lib/kinship/kinship";
import { UI } from "@/lib/constants/ui-strings";
import KinshipResultCard from "./KinshipResultCard";
import Segmented from "./Segmented";

const STEP_ORDER: KinStep[] = ["f", "m", "ob", "os", "yb", "ys", "h", "w", "s", "d"];
const MAX_STEPS = 4;
const REGIONS: Region[] = ["bac", "trung", "nam"];

/** Máy tính xưng hô: bấm từng bước quan hệ, ra cách gọi hai chiều theo miền. */
export default function KinshipCalculator() {
  const [steps, setSteps] = useState<KinStep[]>([]);
  const [egoGender, setEgoGender] = useState<Gender>("male");
  const [region, setRegion] = useState<Region>("bac");

  const result = useMemo(
    () => (steps.length ? computeKinship(steps, egoGender, region) : null),
    [steps, egoGender, region],
  );

  // Không cho chọn "chồng" của người nam / "vợ" của người nữ.
  const currentGender: Gender = steps.length ? KIN_STEP_GENDER[steps[steps.length - 1]] : egoGender;
  const canAdd = (step: KinStep) =>
    steps.length < MAX_STEPS &&
    !(step === "h" && currentGender === "male") &&
    !(step === "w" && currentGender === "female");

  const chainLabel = [UI.KIN_YOU, ...steps.map((s) => UI.KIN_STEPS[s])];
  // "Vợ của em trai của bố của bạn"
  const currentLabel = [...steps.map((s) => UI.KIN_STEPS[s].toLowerCase()).reverse(), UI.KIN_YOU.toLowerCase()]
    .join(` ${UI.KIN_OF} `)
    .replace(/^./, (c) => c.toUpperCase());

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <label className="flex flex-wrap items-center gap-2 text-sm text-[#504443]">
          {UI.KIN_YOU_ARE}
          <Segmented
            value={egoGender}
            onChange={setEgoGender}
            options={[
              { value: "male", label: UI.KIN_MALE },
              { value: "female", label: UI.KIN_FEMALE },
            ]}
          />
        </label>
        <label className="flex flex-wrap items-center gap-2 text-sm text-[#504443]">
          {UI.KIN_REGION}
          <Segmented
            value={region}
            onChange={setRegion}
            options={REGIONS.map((r) => ({ value: r, label: UI.KIN_REGIONS[r] }))}
          />
        </label>
      </div>

      <div className="rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm md:p-6">
        <nav aria-label="Chuỗi quan hệ" className="flex flex-wrap items-center gap-1.5 text-sm">
          {chainLabel.map((label, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 ? <span className="text-[#b8893b]">→</span> : null}
              <span
                className={`rounded-full px-3 py-1 ${
                  i === chainLabel.length - 1 ? "bg-[#4a2c2a] text-[#f6d68e]" : "bg-[#f0ede9] text-[#321716]"
                }`}
              >
                {label}
              </span>
            </span>
          ))}
        </nav>

        <p className="mt-5 text-sm font-medium text-[#504443]">
          {steps.length ? UI.KIN_PICK(currentLabel) : UI.KIN_PICK_FIRST}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {STEP_ORDER.map((step) => (
            <button
              key={step}
              type="button"
              disabled={!canAdd(step)}
              onClick={() => setSteps((prev) => [...prev, step])}
              className="rounded-xl border border-[#e7ddd2] bg-[#fcf9f4] px-3 py-2.5 text-sm font-semibold text-[#321716] transition hover:border-[#c99236] hover:bg-[#fff6e3] disabled:cursor-not-allowed disabled:opacity-35"
            >
              {UI.KIN_STEPS[step]}
            </button>
          ))}
        </div>
        {steps.length >= MAX_STEPS ? (
          <p className="mt-2 text-xs text-[#827472]">{UI.KIN_MAX_STEPS}</p>
        ) : null}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            disabled={!steps.length}
            onClick={() => setSteps((prev) => prev.slice(0, -1))}
            className="rounded-full border border-[#d4c3c1] px-4 py-1.5 text-sm text-[#504443] transition hover:bg-[#f0ede9] disabled:opacity-40"
          >
            {UI.KIN_BACK}
          </button>
          <button
            type="button"
            disabled={!steps.length}
            onClick={() => setSteps([])}
            className="rounded-full border border-[#d4c3c1] px-4 py-1.5 text-sm text-[#504443] transition hover:bg-[#f0ede9] disabled:opacity-40"
          >
            {UI.KIN_RESET}
          </button>
        </div>

        {result ? <KinshipResultCard result={result} /> : null}
      </div>

      <div>
        <p className="text-sm font-semibold text-[#321716]">{UI.KIN_EXAMPLES}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {UI.KIN_EXAMPLE_LIST.map((ex) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => setSteps([...ex.steps] as KinStep[])}
              className="rounded-full border border-[#e7ddd2] bg-white px-3 py-1.5 text-sm text-[#504443] transition hover:border-[#c99236] hover:text-[#944a00]"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
