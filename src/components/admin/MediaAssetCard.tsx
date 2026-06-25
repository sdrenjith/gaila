"use client";

import Image from "next/image";
import { deleteMediaAssetAction } from "@/app/actions/admin";
import { DeleteActionForm } from "@/components/admin/DeleteActionForm";
import { adminBadgeMuted } from "@/lib/admin-ui";
import { classifyMediaKind, formatFolderLabel, formatMediaDate } from "@/lib/media-library-ui";
import { formatBytes } from "@/lib/utils";
import type { MediaAssetRecord } from "@/types/cms";

type LibraryProps = {
  variant: "library";
  asset: MediaAssetRecord;
  copiedId: string | null;
  onCopy: (asset: MediaAssetRecord) => void;
  showFolderBadge?: boolean;
};

type SelectableProps = {
  variant: "selectable";
  asset: Pick<MediaAssetRecord, "_id" | "title" | "url" | "alt" | "folder" | "mimeType">;
  selected: boolean;
  onSelect: () => void;
  onDelete?: () => void;
  kind: "image" | "video";
};

type Props = LibraryProps | SelectableProps;

function MediaPreview({
  url,
  title,
  alt,
  mimeType,
  kind,
}: {
  url: string;
  title: string;
  alt: string;
  mimeType: string;
  kind: ReturnType<typeof classifyMediaKind>;
}) {
  if (kind === "video") {
    return (
      <>
        <video
          src={url}
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span className="pointer-events-none absolute left-1.5 top-1.5 rounded-full bg-black/70 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white">
          Video
        </span>
      </>
    );
  }

  if (kind === "image") {
    return (
      <Image
        src={url}
        alt={alt || title}
        fill
        sizes="120px"
        className="object-cover transition duration-200 group-hover:scale-[1.03]"
        unoptimized
      />
    );
  }

  return (
    <div className="absolute inset-0 grid place-items-center px-2 text-center text-[10px] text-stone-400">
      {mimeType || "File"}
    </div>
  );
}

export function MediaAssetCard(props: Props) {
  if (props.variant === "selectable") {
    const { asset, selected, onSelect, onDelete, kind } = props;
    return (
      <div
        className={`group overflow-hidden rounded-xl border bg-white transition ${
          selected
            ? "border-violet-500 shadow-sm ring-2 ring-violet-200"
            : "border-stone-200 hover:border-stone-300 hover:shadow-sm"
        }`}
      >
        <button type="button" onClick={onSelect} aria-pressed={selected} className="block w-full text-left">
          <div className="relative aspect-square bg-stone-100">
            {kind === "video" ? (
              <video
                src={asset.url}
                muted
                playsInline
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <Image
                src={asset.url}
                alt={asset.alt || asset.title}
                fill
                sizes="120px"
                className="object-cover"
                unoptimized
              />
            )}
          </div>
          <div className="space-y-0.5 p-2">
            <p className="truncate text-xs font-semibold text-stone-950" title={asset.title}>
              {asset.title}
            </p>
            <p className="truncate text-[10px] text-stone-500">{formatFolderLabel(asset.folder)}</p>
          </div>
        </button>
        {onDelete && (
          <div className="border-t border-stone-100 px-2 pb-2">
            <button
              type="button"
              onClick={onDelete}
              className="rounded-full border border-red-200 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    );
  }

  const { asset, copiedId, onCopy, showFolderBadge = false } = props;
  const kind = classifyMediaKind(asset.mimeType);
  const created = formatMediaDate(asset.createdAt);
  const sizeLabel = asset.size > 0 ? formatBytes(asset.size) : null;
  const isCopied = copiedId === asset._id;

  return (
    <article className="group overflow-hidden rounded-xl border border-stone-200 bg-white transition hover:border-stone-300 hover:shadow-sm">
      <div className="relative aspect-square bg-stone-900">
        <MediaPreview
          url={asset.url}
          title={asset.title}
          alt={asset.alt}
          mimeType={asset.mimeType}
          kind={kind}
        />
        {showFolderBadge && (
          <span className={`pointer-events-none absolute bottom-1.5 left-1.5 ${adminBadgeMuted} !px-1.5 !py-0.5 !text-[9px]`}>
            {formatFolderLabel(asset.folder)}
          </span>
        )}
        <div className="absolute inset-0 flex items-end justify-center gap-1 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent p-1.5 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
          <button
            type="button"
            onClick={() => onCopy(asset)}
            className="rounded-full border border-white/30 bg-white/90 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-stone-800 hover:bg-white"
          >
            {isCopied ? "Copied" : "Copy"}
          </button>
          <a
            href={asset.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/30 bg-white/90 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-stone-800 hover:bg-white"
          >
            Open
          </a>
        </div>
      </div>
      <div className="space-y-0.5 p-2">
        <p className="truncate text-xs font-semibold text-stone-950" title={asset.title}>
          {asset.title}
        </p>
        <p className="truncate text-[10px] text-violet-700" title={asset.url}>
          {asset.url.split("/").pop()}
        </p>
        <p className="text-[9px] uppercase tracking-[0.14em] text-stone-400">
          {sizeLabel ?? "—"}
          {created ? ` · ${created}` : ""}
        </p>
        <DeleteActionForm
          action={deleteMediaAssetAction}
          id={asset._id}
          itemLabel={asset.title}
          buttonLabel="Delete"
          buttonClassName="mt-1 rounded-full border border-red-200 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-red-600 hover:bg-red-50"
        />
      </div>
    </article>
  );
}
