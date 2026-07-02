import type { LayoutConfig, Person } from "@/components/types/family-tree-types";
import type { NodeAppearancePatch, NodeAppearanceValues } from "./types";
import { resolveGlobalNodeAppearance } from "./resolve";

export type NodeAppearanceScope = "person" | "level" | "global";
export function patchNodeAppearance(
  config: LayoutConfig,
  personId: number,
  patch: NodeAppearancePatch,
): LayoutConfig {
  const key = String(personId);
  const prev = config.nodeStyles?.[key] ?? {};
  return {
    ...config,
    nodeStyles: {
      ...config.nodeStyles,
      [key]: { ...prev, ...patch },
    },
  };
}

export function patchLevelAppearance(
  config: LayoutConfig,
  generation: number,
  patch: NodeAppearancePatch,
): LayoutConfig {
  const key = String(generation);
  const prev = config.levelStyles?.[key] ?? {};
  return {
    ...config,
    levelStyles: {
      ...config.levelStyles,
      [key]: { ...prev, ...patch },
    },
  };
}

export function clearNodeAppearance(
  config: LayoutConfig,
  personId: number,
): LayoutConfig {
  const key = String(personId);
  if (!config.nodeStyles?.[key]) return config;
  const next = { ...config.nodeStyles };
  delete next[key];
  return {
    ...config,
    nodeStyles: Object.keys(next).length > 0 ? next : undefined,
  };
}

export function commitGlobalNodeAppearance(
  config: LayoutConfig,
  values: NodeAppearanceValues,
): LayoutConfig {
  return {
    ...config,
    nodeWidth: values.nodeWidth,
    nodeHeight: values.nodeHeight,
    nodeBgColor: values.nodeBgColor,
    nodeTextColor: values.nodeTextColor,
    nodeFontSize: values.nodeFontSize,
    nodeFontWeight: values.nodeFontWeight,
    nodeTextDirection: values.nodeTextDirection,
    nodeTextCase: values.nodeTextCase,
    levelStyles: undefined,
    nodeStyles: undefined,
  };
}

export function commitNodeAppearance(
  config: LayoutConfig,
  person: Person,
  values: NodeAppearancePatch,
  scope: NodeAppearanceScope,
): LayoutConfig {
  if (scope === "global") {
    const merged = {
      ...resolveGlobalNodeAppearance(config),
      ...values,
    };
    return commitGlobalNodeAppearance(config, merged);
  }
  if (scope === "level" && person.generation != null) {
    const generation = Number(person.generation);
    if (!Number.isNaN(generation)) {
      let next = patchLevelAppearance(config, generation, values);
      next = clearNodeAppearance(next, person.id);
      return next;
    }
  }
  const key = String(person.id);
  return {
    ...config,
    nodeStyles: {
      ...config.nodeStyles,
      [key]: { ...values },
    },
  };
}

export function previewNodeAppearance(
  config: LayoutConfig,
  person: Person,
  patch: NodeAppearancePatch,
  scope: NodeAppearanceScope,
): LayoutConfig {
  if (scope === "global") {
    const merged = { ...resolveGlobalNodeAppearance(config), ...patch };
    return commitGlobalNodeAppearance(config, merged);
  }
  return commitNodeAppearance(config, person, patch, scope);
}