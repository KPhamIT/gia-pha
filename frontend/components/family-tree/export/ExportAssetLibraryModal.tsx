"use client";

import { useMemo, useRef, useState } from "react";
import Icon from "@/components/icons/Icon";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";
import { UI } from "@/lib/constants/ui-strings";
import {
  canDeleteUploadedSystemAsset,
  filterSystemAssets,
  type SystemAsset,
  type SystemAssetCategory,
} from "@/lib/family-tree/export-system-assets";

type Tab = "builtin" | "uploaded";

type Props = {
  open: boolean;
  assets: SystemAsset[];
  onClose: () => void;
  onSelect: (asset: SystemAsset) => void;
  onAssetsChanged: () => void;
};

const CATEGORIES: { id: SystemAssetCategory; label: string }[] = [
  { id: "all", label: UI.EXPORT_LIBRARY_ALL },
  { id: "background", label: UI.EXPORT_LIBRARY_BACKGROUND },
  { id: "scroll", label: UI.EXPORT_LIBRARY_SCROLL },
  { id: "couplet", label: UI.EXPORT_LIBRARY_COUPLET },
];

export default function ExportAssetLibraryModal({
  open,
  assets,
  onClose,
  onSelect,
  onAssetsChanged,
}: Props) {
  const isSystem = useAuthStore((state) => state.isSystem);
  const fileRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<Tab>("builtin");
  const [category, setCategory] = useState<SystemAssetCategory>("all");
  const [query, setQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const builtinAssets = useMemo(
    () => assets.filter((asset) => asset.provider === "static"),
    [assets],
  );
  const uploadedAssets = useMemo(
    () => assets.filter((asset) => asset.provider !== "static"),
    [assets],
  );
  const visibleAssets = filterSystemAssets(
    tab === "builtin" ? builtinAssets : uploadedAssets,
    category,
    query,
  );

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      await api.media.uploadSystemAsset(file);
      onAssetsChanged();
      setTab("uploaded");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDelete = async (asset: SystemAsset) => {
    if (!canDeleteUploadedSystemAsset(asset)) return;
    if (!window.confirm(UI.EXPORT_LIBRARY_DELETE_CONFIRM)) return;
    setDeletingId(asset.id);
    try {
      await api.media.deleteSystemAsset({ id: asset.dbId });
      onAssetsChanged();
    } catch {
      window.alert(UI.ERR_DELETE);
    } finally {
      setDeletingId(null);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h2 className="text-base font-semibold text-slate-900">
            {UI.EXPORT_LIBRARY_TITLE}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
            aria-label={UI.EXPORT_CLOSE}
          >
            <Icon path="close" size={16} stroke="currentColor" pointer={false} />
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-2">
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setTab("builtin")}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                tab === "builtin"
                  ? "bg-amber-100 font-medium text-amber-900"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {UI.EXPORT_LIBRARY_BUILTIN}
            </button>
            <button
              type="button"
              onClick={() => setTab("uploaded")}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                tab === "uploaded"
                  ? "bg-amber-100 font-medium text-amber-900"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {UI.EXPORT_LIBRARY_UPLOADED}
            </button>
          </div>
          <p className="hidden text-xs text-slate-400 sm:block">
            {UI.EXPORT_LIBRARY_SVG_HINT}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-2">
          {CATEGORIES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(item.id)}
              className={`rounded-full px-3 py-1 text-xs ${
                category === item.id
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={UI.EXPORT_LIBRARY_SEARCH}
            className="ml-auto min-w-[10rem] flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm sm:max-w-xs"
          />
          {isSystem && tab === "uploaded" ? (
            <>
              <input
                ref={fileRef}
                type="file"
                accept="image/*,.svg"
                className="hidden"
                onChange={(e) => void handleUpload(e.target.files?.[0])}
              />
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
                className="rounded-lg bg-amber-700 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
              >
                {uploading ? UI.EXPORT_LIBRARY_UPLOADING : UI.EXPORT_LIBRARY_UPLOAD}
              </button>
            </>
          ) : null}
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-2 gap-3 overflow-y-auto p-4 sm:grid-cols-3">
          {visibleAssets.map((asset) => {
            const deletable =
              isSystem && tab === "uploaded" && canDeleteUploadedSystemAsset(asset);
            const isDeleting = deletingId === asset.id;

            return (
              <div
                key={asset.id}
                className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition hover:border-amber-400 hover:shadow-md"
              >
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => onSelect(asset)}
                  className="block w-full text-left disabled:opacity-60"
                >
                  <div className="flex aspect-[4/3] items-center justify-center p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <p className="truncate border-t border-slate-200 px-2 py-1.5 text-xs text-slate-600">
                    {asset.name}
                  </p>
                </button>
                {deletable ? (
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => void handleDelete(asset)}
                    className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-white/95 text-red-600 shadow-sm ring-1 ring-slate-200 hover:bg-red-50 disabled:opacity-50"
                    aria-label={UI.EXPORT_LIBRARY_DELETE}
                    title={UI.EXPORT_LIBRARY_DELETE}
                  >
                    <Icon
                      path="trash"
                      size={14}
                      stroke="currentColor"
                      pointer={false}
                    />
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
