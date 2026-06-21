import {
  defaultTreeExportSettings,
  normalizeTreeExportSettings,
  type TreeExportPreset,
  type TreeExportSettings,
} from './tree-export-settings';
import { TREE_EXPORT_PRESET_DATA } from './tree-export-preset-data';

function preset(overrides: Partial<TreeExportSettings>): TreeExportSettings {
  return normalizeTreeExportSettings({ ...defaultTreeExportSettings(), ...overrides });
}

export function getTreeExportPresets(): TreeExportPreset[] {
  return TREE_EXPORT_PRESET_DATA.map(({ id, label, overrides }) => ({
    id,
    label,
    settings: preset(overrides),
  }));
}

export function normalizeTreeExportPresets(
  value: unknown,
  fallback: TreeExportPreset[] = getTreeExportPresets(),
): TreeExportPreset[] {
  if (!Array.isArray(value)) return fallback;

  const normalized = value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const id = typeof (item as { id?: unknown }).id === 'string' ? (item as { id: string }).id : null;
      const label = typeof (item as { label?: unknown }).label === 'string' ? (item as { label: string }).label : null;
      const settings = (item as { settings?: unknown }).settings as Partial<TreeExportSettings> | undefined;
      if (!id || !label || !settings) return null;
      return { id, label, settings: normalizeTreeExportSettings(settings) } satisfies TreeExportPreset;
    })
    .filter((p): p is TreeExportPreset => Boolean(p));

  return normalized.length > 0 ? normalized : fallback;
}

export function serializeTreeExportPresets(presets: TreeExportPreset[]): TreeExportPreset[] {
  return presets.map((p) => ({ id: p.id, label: p.label, settings: normalizeTreeExportSettings(p.settings) }));
}
