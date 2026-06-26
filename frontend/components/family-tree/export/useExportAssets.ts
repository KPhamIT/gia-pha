"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { fetchImageAsDataUri } from "@/lib/family-tree/export-tree-svg";
import {
  getTreeExportPresets,
  normalizeTreeExportPresets,
  type TreeExportPreset,
} from "@/lib/family-tree/tree-export-settings";
import type { SystemAssetItem } from "@/lib/api/modules/media";
import {
  BUILTIN_SYSTEM_ASSETS,
  mergeSystemAssets,
  type SystemAsset,
} from "@/lib/family-tree/export-system-assets";

function toSystemAsset(item: SystemAssetItem): SystemAsset {
  return {
    id: `system-${item.id}`,
    dbId: item.id,
    name: item.name,
    url: item.url,
    category: item.category === "other" ? "background" : item.category,
    provider: item.provider,
    access: item.access,
    key: item.key,
    width: item.width ?? undefined,
    height: item.height ?? undefined,
    aspectRatio:
      item.width && item.height ? item.width / item.height : undefined,
  };
}

/** Loads export presets, system asset library, and inlines layer images. */
export function useExportAssets(layerUrls: string[] = []) {
  const [presets, setPresets] = useState<TreeExportPreset[]>(() =>
    getTreeExportPresets(),
  );
  const [systemAssets, setSystemAssets] = useState<SystemAsset[]>(
    BUILTIN_SYSTEM_ASSETS,
  );
  const [layerImageHrefs, setLayerImageHrefs] = useState<
    Record<string, string>
  >({});
  const [assetsReady, setAssetsReady] = useState(false);

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
          if (!cancelled)
            setPresets(normalizeTreeExportPresets(seeded, defaults));
        } catch {
          /* keep local defaults */
        }
      })
      .catch(() => {
        if (!cancelled) setPresets(defaults);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const refreshSystemAssets = () => {
    api.media
      .listSystemAssets()
      .then((items) => {
        const uploaded = items.map(toSystemAsset);
        setSystemAssets(mergeSystemAssets(uploaded));
      })
      .catch(() => {
        setSystemAssets(BUILTIN_SYSTEM_ASSETS);
      });
  };

  useEffect(() => {
    refreshSystemAssets();
  }, []);

  const uniqueUrls = useMemo(
    () => [...new Set(layerUrls.filter(Boolean))],
    [layerUrls],
  );

  useEffect(() => {
    let cancelled = false;
    if (uniqueUrls.length === 0) {
      setLayerImageHrefs({});
      setAssetsReady(true);
      return;
    }

    setAssetsReady(false);
    Promise.all(
      uniqueUrls.map(async (url) => {
        try {
          const dataUri = await fetchImageAsDataUri(url);
          return [url, dataUri] as const;
        } catch {
          return [url, url] as const;
        }
      }),
    )
      .then((pairs) => {
        if (cancelled) return;
        const map: Record<string, string> = {};
        for (const [url, href] of pairs) map[url] = href;
        setLayerImageHrefs(map);
        setAssetsReady(true);
      })
      .catch(() => {
        if (!cancelled) setAssetsReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [uniqueUrls]);

  return {
    presets,
    systemAssets,
    layerImageHrefs,
    assetsReady,
    refreshSystemAssets,
  };
}
