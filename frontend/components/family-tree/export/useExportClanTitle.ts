"use client";

import { useMemo } from "react";
import type { FamilyTreeData } from "@/components/types/family-tree-types";
import { useAuthStore } from "@/store/authStore";
import {
  clanTitleLines,
  resolveClanName,
  resolveTitleRects,
} from "@/lib/family-tree/export-clan-title";
import type { ExportGeometry, ResolvedLayout } from "@/lib/family-tree/export-tree-svg";
import type { TreeExportSettings } from "@/lib/family-tree/tree-export-settings";

/** Tên dòng họ + vị trí chữ "GIA PHẢ / HỌ …" cho bản in. */
export function useExportClanTitle(
  settings: TreeExportSettings,
  treeData: FamilyTreeData,
  layout: ResolvedLayout,
  geometry: ExportGeometry,
) {
  const orgName = useAuthStore((s) => s.user?.organization?.name ?? null);
  const clanName = useMemo(
    () => resolveClanName(settings.clanName, treeData, orgName),
    [settings.clanName, treeData, orgName],
  );
  const titleLines = useMemo(
    () => clanTitleLines(clanName, settings.title.showGiaPha),
    [clanName, settings.title.showGiaPha],
  );
  const titleRects = useMemo(
    () =>
      resolveTitleRects(
        settings.title,
        settings.layers,
        layout,
        geometry.borderRect,
        geometry.headerRect,
      ),
    [settings.title, settings.layers, layout, geometry.borderRect, geometry.headerRect],
  );
  return { clanName, titleLines, titleRects };
}
