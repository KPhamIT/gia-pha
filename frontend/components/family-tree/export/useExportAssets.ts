'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { EXPORT_IMAGE_SOURCES, fetchImageAsDataUri, type ExportImageKey } from '@/lib/family-tree/export-tree-svg';
import {
  getTreeExportPresets,
  normalizeTreeExportPresets,
  type TreeExportPreset,
} from '@/lib/family-tree/tree-export-settings';

/** Loads the user's saved presets and inlines the decorative PNGs as data URIs. */
export function useExportAssets() {
  const [presets, setPresets] = useState<TreeExportPreset[]>(() => getTreeExportPresets());
  const [dataUris, setDataUris] = useState<Record<ExportImageKey, string> | null>(null);

  useEffect(() => {
    let cancelled = false;
    const defaults = getTreeExportPresets();

    api.exportPreset
      .getMine()
      .then(async (mine) => {
        if (cancelled) return;
        setPresets(normalizeTreeExportPresets(mine, defaults));
        if (mine.length > 0) return;
        try {
          const seeded = await api.exportPreset.replaceMine(defaults);
          if (!cancelled) setPresets(normalizeTreeExportPresets(seeded, defaults));
        } catch {
          /* keep local defaults if preset API is unavailable */
        }
      })
      .catch(() => {
        if (!cancelled) setPresets(defaults);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const keys = Object.keys(EXPORT_IMAGE_SOURCES) as ExportImageKey[];
    Promise.all(keys.map((key) => fetchImageAsDataUri(EXPORT_IMAGE_SOURCES[key])))
      .then((uris) => {
        if (cancelled) return;
        const map = {} as Record<ExportImageKey, string>;
        keys.forEach((key, i) => (map[key] = uris[i]));
        setDataUris(map);
      })
      .catch(() => {
        /* fall back to public URLs (preview still works, export inlines on retry) */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { presets, dataUris, imageSources: dataUris ?? EXPORT_IMAGE_SOURCES };
}
