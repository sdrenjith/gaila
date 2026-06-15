"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { useToast } from "@/components/admin/Toaster";
import {
  UploadAbortError,
  UploadNetworkError,
  uploadWithProgress,
  validateUpload,
  type UploadProgress,
} from "@/lib/upload-client";
import { UploadErrorBanner, UploadProgressBar } from "@/components/admin/UploadStatus";

export type MediaLibraryAsset = {
  id: string;
  title: string;
  url: string;
  alt: string;
  folder: string;
  mimeType: string;
};

type MediaKind = "image" | "video";

type UploadApiResponse = { ok?: boolean; url?: string; error?: string };

type MediaLibraryModalProps = {
  open: boolean;
  kind: MediaKind;
  title?: string;
  folder?: string;
  uploadEnabled?: boolean;
  initialSelectedUrl?: string;
  assets: MediaLibraryAsset[];
  loading: boolean;
  loadError: string | null;
  onReload: () => void;
  onDismissLoadError: () => void;
  onSelect: (url: string) => void;
  onClose: () => void;
};

type ModalTab = "browse" | "upload";

export function MediaLibraryModal({
  open,
  kind,
  title = "Media Library",
  folder,
  uploadEnabled = true,
  initialSelectedUrl = "",
  assets,
  loading,
  loadError,
  onReload,
  onDismissLoadError,
  onSelect,
  onClose,
}: MediaLibraryModalProps) {
  const dialogTitleId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { push } = useToast();

  const [modalTab, setModalTab] = useState<ModalTab>("browse");
  const [pendingUrl, setPendingUrl] = useState(initialSelectedUrl);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(0);
  const [total, setTotal] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaLibraryAsset | null>(null);
  const [deleting, setDeleting] = useState(false);

  const uploadFolder = folder ?? (kind === "video" ? "video" : "general");
  const emptyLabel = kind === "video" ? "No videos in the media library yet." : "No images in the media library yet.";
  const accept = kind === "video" ? "video/*" : "image/*";

  useEffect(() => {
    if (!open) {
      return;
    }

    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const resetUploadProgress = () => {
    setProgress(null);
    setLoaded(0);
    setTotal(0);
  };

  const handleUpload = async (file: File) => {
    setUploadError(null);
    resetUploadProgress();

    const validation = validateUpload(file, { acceptKinds: [kind] });
    if (!validation.ok) {
      setUploadError(validation.message);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const body = new FormData();
    body.set("file", file);
    body.set("folder", uploadFolder);
    body.set("alt", "");
    body.set("responseFormat", "json");

    setUploading(true);
    setProgress(null);

    try {
      const result = await uploadWithProgress<UploadApiResponse>("/api/admin/media", body, {
        onXhr: (xhr) => {
          xhrRef.current = xhr;
        },
        onProgress: (p: UploadProgress) => {
          setLoaded(p.loaded);
          setTotal(p.total);
          setProgress(p.percent);
        },
      });

      if (!result.ok) {
        setUploadError(result.error);
        return;
      }

      if (!result.data.url) {
        setUploadError(result.data.error || "Upload did not return a URL.");
        return;
      }

      setPendingUrl(result.data.url);
      setModalTab("browse");
      onReload();
    } catch (err) {
      if (err instanceof UploadAbortError) {
        setUploadError("Upload cancelled.");
      } else if (err instanceof UploadNetworkError) {
        setUploadError(err.message);
      } else {
        setUploadError(err instanceof Error ? err.message : "Upload failed.");
      }
    } finally {
      xhrRef.current = null;
      setUploading(false);
      resetUploadProgress();
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleConfirm = () => {
    if (!pendingUrl) return;
    onSelect(pendingUrl);
    onClose();
  };

  const handleCancelUpload = () => {
    xhrRef.current?.abort();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/media?id=${encodeURIComponent(deleteTarget.id)}`, {
        method: "DELETE",
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string; message?: string };

      if (!response.ok || !payload.ok) {
        push({ message: payload.error || "Could not delete asset.", variant: "error" });
        return;
      }

      if (pendingUrl === deleteTarget.url) {
        setPendingUrl("");
      }

      push({ message: payload.message || "Asset deleted.", variant: "success" });
      setDeleteTarget(null);
      onReload();
    } catch {
      push({ message: "Could not delete asset.", variant: "error" });
    } finally {
      setDeleting(false);
    }
  };

  const segmentBase =
    "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition focus:outline-none focus:ring-2 focus:ring-amber-500";

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close media library"
        className="absolute inset-0 bg-stone-950/45 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={dialogTitleId}
        className="relative flex max-h-[min(90vh,820px)] w-full max-w-4xl flex-col overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-[0_24px_60px_-28px_rgba(14,14,14,0.35)]"
      >
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-stone-200 px-6 py-4">
          <h2 id={dialogTitleId} className="text-lg font-semibold text-stone-950">
            {title}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full border border-stone-300 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-700 hover:bg-stone-100"
          >
            Close
          </button>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-stone-100 px-6 py-3">
          <div
            role="tablist"
            aria-label="Media library panels"
            className="inline-flex rounded-full border border-stone-300 bg-stone-100 p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={modalTab === "browse"}
              onClick={() => setModalTab("browse")}
              className={`${segmentBase} ${
                modalTab === "browse" ? "bg-white text-stone-950 shadow-sm" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              Browse
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={modalTab === "upload"}
              onClick={() => setModalTab("upload")}
              disabled={!uploadEnabled}
              title={uploadEnabled ? undefined : "Configure media storage to enable uploads"}
              className={`${segmentBase} ${
                !uploadEnabled
                  ? "cursor-not-allowed text-stone-400"
                  : modalTab === "upload"
                    ? "bg-white text-stone-950 shadow-sm"
                    : "text-stone-500 hover:text-stone-900"
              }`}
            >
              Upload
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          {modalTab === "browse" ? (
            <div role="tabpanel" className="grid gap-3">
              {loading ? (
                <p className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-8 text-center text-sm text-stone-500">
                  Loading media library…
                </p>
              ) : loadError ? (
                <div className="grid gap-3">
                  <UploadErrorBanner message={loadError} onDismiss={onDismissLoadError} />
                  <button
                    type="button"
                    onClick={onReload}
                    className="justify-self-start rounded-full border border-stone-300 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-700 hover:bg-stone-100"
                  >
                    Retry
                  </button>
                </div>
              ) : assets.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {assets.map((asset) => {
                    const selected = asset.url === pendingUrl;
                    return (
                      <div
                        key={asset.id}
                        className={`overflow-hidden rounded-2xl border text-left transition ${
                          selected
                            ? "border-[var(--gold)] bg-white shadow-sm ring-2 ring-[var(--gold-light)]/40"
                            : "border-stone-200 bg-white hover:border-stone-300"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setPendingUrl(asset.url)}
                          aria-pressed={selected}
                          className="block w-full text-left"
                        >
                          <div className="relative aspect-[16/10] bg-stone-100">
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
                                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
                                className="object-cover"
                                unoptimized
                              />
                            )}
                          </div>
                          <div className="p-3">
                            <p className="truncate text-sm font-semibold text-stone-950">{asset.title}</p>
                            <p className="truncate text-xs text-stone-500">{asset.folder}</p>
                          </div>
                        </button>
                        <div className="border-t border-stone-100 px-3 pb-3">
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(asset)}
                            className="rounded-full border border-red-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-4 py-8 text-center text-sm text-stone-500">
                  {emptyLabel}
                </p>
              )}
            </div>
          ) : (
            <div role="tabpanel" className="grid max-w-lg gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                disabled={uploading || !uploadEnabled}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void handleUpload(file);
                }}
                className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-950 outline-none file:mr-4 file:rounded-full file:border-0 file:bg-stone-200 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-wider file:text-stone-700 hover:file:bg-stone-300 disabled:cursor-not-allowed disabled:opacity-60"
              />
              {uploading && !uploadError && (
                <UploadProgressBar
                  uploading={uploading}
                  progress={progress}
                  loaded={loaded}
                  total={total}
                  onCancel={handleCancelUpload}
                />
              )}
              {!uploadEnabled && (
                <p className="text-xs text-amber-700">
                  Upload is disabled. Configure media storage to enable file uploads.
                </p>
              )}
              {uploadError && <UploadErrorBanner message={uploadError} onDismiss={() => setUploadError(null)} />}
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap justify-end gap-3 border-t border-stone-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-stone-300 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-700 hover:bg-stone-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!pendingUrl}
            className="rounded-full bg-[var(--ink)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[var(--ink-soft)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Select
          </button>
        </div>
      </div>
      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        title={deleteTarget ? `Delete ${deleteTarget.title}?` : "Delete asset?"}
        description={
          deleteTarget
            ? `This will permanently remove “${deleteTarget.title}” from the media library. This action cannot be undone.`
            : ""
        }
        pending={deleting}
        onConfirm={() => void handleDeleteConfirm()}
        onCancel={() => {
          if (!deleting) setDeleteTarget(null);
        }}
      />
    </div>
  );
}
