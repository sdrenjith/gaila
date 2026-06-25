"use client";

import { useMemo, useState } from "react";
import { MediaAssetCard } from "@/components/admin/MediaAssetCard";
import { useToast } from "@/components/admin/Toaster";
import { adminInputClass } from "@/lib/admin-ui";
import {
  filterMediaAssets,
  formatFolderLabel,
  getFolderCounts,
  getMediaTypeCounts,
  getSortedFolders,
  groupAssetsByFolder,
  type MediaTypeFilter,
} from "@/lib/media-library-ui";
import type { MediaAssetRecord } from "@/types/cms";

type Props = {
  assets: MediaAssetRecord[];
};

type FolderFilter = "all" | string;

function FilterPill({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition ${
        active
          ? "bg-stone-900 text-white shadow-sm"
          : "border border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50"
      }`}
    >
      {children}
      <span
        className={`rounded-full px-1.5 py-0.5 text-[9px] ${
          active ? "bg-white/15 text-white" : "bg-stone-100 text-stone-500"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

const THUMB_GRID =
  "grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8";

function EmptyState({ message }: { message: string }) {
  return (
    <p className="col-span-full rounded-xl border border-dashed border-stone-300 bg-stone-50/80 px-4 py-8 text-center text-sm text-stone-500">
      {message}
    </p>
  );
}

export function MediaLibraryView({ assets }: Props) {
  const { push } = useToast();
  const [folderFilter, setFolderFilter] = useState<FolderFilter>("all");
  const [typeFilter, setTypeFilter] = useState<MediaTypeFilter>("all");
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(() => new Set(getSortedFolders(assets)));

  const folderCounts = useMemo(() => getFolderCounts(assets), [assets]);
  const folders = useMemo(() => getSortedFolders(assets), [assets]);
  const typeCounts = useMemo(() => getMediaTypeCounts(assets), [assets]);

  const filtered = useMemo(
    () => filterMediaAssets(assets, { folder: folderFilter, type: typeFilter, query }),
    [assets, folderFilter, typeFilter, query],
  );

  const grouped = useMemo(() => groupAssetsByFolder(filtered), [filtered]);

  const showAccordion =
    folderFilter === "all" && !query.trim() && typeFilter === "all" && folders.length > 1;

  const handleCopy = async (asset: MediaAssetRecord) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(asset.url);
      } else {
        throw new Error("Clipboard unavailable");
      }
      setCopiedId(asset._id);
      push({ message: "URL copied to clipboard.", variant: "success" });
      window.setTimeout(() => setCopiedId((current) => (current === asset._id ? null : current)), 1500);
    } catch {
      push({ message: "Could not copy URL.", variant: "error" });
    }
  };

  const toggleFolder = (folder: string) => {
    setExpandedFolders((current) => {
      const next = new Set(current);
      if (next.has(folder)) next.delete(folder);
      else next.add(folder);
      return next;
    });
  };

  const emptyMessage =
    query.trim() !== ""
      ? "No assets match your search."
      : folderFilter !== "all"
        ? `No assets in ${formatFolderLabel(folderFilter)}.`
        : typeFilter === "video"
          ? "No videos uploaded yet."
          : typeFilter === "image"
            ? "No images uploaded yet."
            : "No media uploaded yet.";

  return (
    <div className="grid gap-5">
      <div className="rounded-2xl border border-stone-200 bg-stone-50/60 p-4">
        <label className="grid gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
            Search library
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title, alt text, filename, or folder…"
            className={adminInputClass}
          />
        </label>
      </div>

      <div className="grid gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">
            Folders
          </span>
          <FilterPill
            active={folderFilter === "all"}
            onClick={() => setFolderFilter("all")}
            count={assets.length}
          >
            All
          </FilterPill>
          {folders.map((folder) => (
            <FilterPill
              key={folder}
              active={folderFilter === folder}
              onClick={() => setFolderFilter(folder)}
              count={folderCounts.get(folder) ?? 0}
            >
              {formatFolderLabel(folder)}
            </FilterPill>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
            Type
          </span>
          <FilterPill active={typeFilter === "all"} onClick={() => setTypeFilter("all")} count={typeCounts.all}>
            All
          </FilterPill>
          <FilterPill
            active={typeFilter === "image"}
            onClick={() => setTypeFilter("image")}
            count={typeCounts.image}
          >
            Images
          </FilterPill>
          <FilterPill
            active={typeFilter === "video"}
            onClick={() => setTypeFilter("video")}
            count={typeCounts.video}
          >
            Videos
          </FilterPill>
        </div>
      </div>

      <p className="text-[11px] text-stone-500">
        Showing {filtered.length} of {assets.length} assets
        {folderFilter !== "all" ? ` in ${formatFolderLabel(folderFilter)}` : ""}
      </p>

      {showAccordion ? (
        <div className="grid gap-3">
          {[...grouped.entries()]
            .sort(([a], [b]) => {
              const ai = folders.indexOf(a);
              const bi = folders.indexOf(b);
              return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
            })
            .map(([folder, folderAssets]) => {
              const expanded = expandedFolders.has(folder);
              return (
                <section
                  key={folder}
                  className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
                >
                  <button
                    type="button"
                    onClick={() => toggleFolder(folder)}
                    aria-expanded={expanded}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-stone-50"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="truncate text-sm font-semibold text-stone-950">
                        {formatFolderLabel(folder)}
                      </span>
                      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-700">
                        {folderAssets.length}
                      </span>
                    </div>
                    <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                      {expanded ? "Hide" : "Show"}
                    </span>
                  </button>
                  {expanded && (
                    <div className="border-t border-stone-100 px-4 pb-4 pt-3">
                      <div className={THUMB_GRID}>
                        {folderAssets.map((asset) => (
                          <MediaAssetCard
                            key={asset._id}
                            variant="library"
                            asset={asset}
                            copiedId={copiedId}
                            onCopy={handleCopy}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              );
            })}
          {filtered.length === 0 && <EmptyState message={emptyMessage} />}
        </div>
      ) : (
        <div className={THUMB_GRID}>
          {filtered.map((asset) => (
            <MediaAssetCard
              key={asset._id}
              variant="library"
              asset={asset}
              copiedId={copiedId}
              onCopy={handleCopy}
              showFolderBadge={folderFilter === "all"}
            />
          ))}
          {filtered.length === 0 && <EmptyState message={emptyMessage} />}
        </div>
      )}
    </div>
  );
}
