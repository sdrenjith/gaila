"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { deleteMediaAssetAction } from "@/app/actions/admin";
import { DeleteActionForm } from "@/components/admin/DeleteActionForm";
import { useToast } from "@/components/admin/Toaster";
import type { MediaAssetRecord } from "@/types/cms";
import { formatBytes } from "@/lib/utils";

type Filter = "all" | "image" | "video";

type Props = {
  assets: MediaAssetRecord[];
};

function classify(mimeType: string): "image" | "video" | "other" {
  const mime = (mimeType || "").toLowerCase();
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("image/")) return "image";
  return "other";
}

function formatDate(value?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function FilterButton({
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
      className={`rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
        active
          ? "bg-[var(--ink)] text-white"
          : "border border-stone-300 bg-white text-stone-600 hover:bg-stone-100"
      }`}
    >
      {children}
      <span className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] ${active ? "bg-white/15" : "bg-stone-100 text-stone-500"}`}>
        {count}
      </span>
    </button>
  );
}

export function MediaLibraryGrid({ assets }: Props) {
  const { push } = useToast();
  const [filter, setFilter] = useState<Filter>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const counts = useMemo(() => {
    let images = 0;
    let videos = 0;
    for (const asset of assets) {
      const kind = classify(asset.mimeType);
      if (kind === "image") images += 1;
      else if (kind === "video") videos += 1;
    }
    return { all: assets.length, image: images, video: videos };
  }, [assets]);

  const visible = useMemo(() => {
    if (filter === "all") return assets;
    return assets.filter((asset) => classify(asset.mimeType) === filter);
  }, [assets, filter]);

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

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <FilterButton active={filter === "all"} onClick={() => setFilter("all")} count={counts.all}>
          All
        </FilterButton>
        <FilterButton active={filter === "image"} onClick={() => setFilter("image")} count={counts.image}>
          Images
        </FilterButton>
        <FilterButton active={filter === "video"} onClick={() => setFilter("video")} count={counts.video}>
          Videos
        </FilterButton>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {visible.map((asset) => {
          const kind = classify(asset.mimeType);
          const created = formatDate(asset.createdAt);
          const sizeLabel = asset.size > 0 ? formatBytes(asset.size) : null;
          const isCopied = copiedId === asset._id;
          return (
            <article
              key={asset._id}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
            >
              <div className="relative aspect-video bg-stone-900">
                {kind === "video" ? (
                  <>
                    <video
                      src={asset.url}
                      controls
                      muted
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                      Video
                    </span>
                  </>
                ) : kind === "image" ? (
                  <Image
                    src={asset.url}
                    alt={asset.alt || asset.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-xs text-stone-300">
                    {asset.mimeType || "Unknown file"}
                  </div>
                )}
              </div>
              <div className="grid gap-1 p-4">
                <p className="truncate text-sm font-semibold text-stone-950" title={asset.title}>
                  {asset.title}
                </p>
                <p className="break-all text-xs text-[var(--gold-deep)]" title={asset.url}>
                  {asset.url}
                </p>
                {asset.alt && (
                  <p className="text-xs text-stone-500" title={asset.alt}>
                    {asset.alt}
                  </p>
                )}
                <p className="text-[11px] uppercase tracking-[0.18em] text-stone-400">
                  {asset.mimeType || "unknown"}
                  {sizeLabel ? ` · ${sizeLabel}` : ""}
                  {created ? ` · ${created}` : ""}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(asset)}
                    className="rounded-full border border-stone-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-700 hover:bg-stone-100"
                  >
                    {isCopied ? "Copied" : "Copy URL"}
                  </button>
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-stone-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-700 hover:bg-stone-100"
                  >
                    Open
                  </a>
                  <DeleteActionForm
                    action={deleteMediaAssetAction}
                    id={asset._id}
                    itemLabel={asset.title}
                    buttonLabel="Delete"
                    buttonClassName="rounded-full border border-red-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-red-600 hover:bg-red-50"
                  />
                </div>
              </div>
            </article>
          );
        })}

        {visible.length === 0 && (
          <p className="col-span-full rounded-xl border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500">
            {filter === "all"
              ? "No media uploaded yet."
              : filter === "video"
                ? "No videos uploaded yet."
                : "No images uploaded yet."}
          </p>
        )}
      </div>
    </div>
  );
}
